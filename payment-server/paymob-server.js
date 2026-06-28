import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number(process.env.PORT || 8089);
const SITE_ROOT = process.env.SITE_ROOT || path.resolve(__dirname, "..");
const PAYMOB_BASE_URL = (process.env.PAYMOB_BASE_URL || "https://accept.paymob.com").replace(/\/$/, "");
const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY || "";
const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY || "";
const PAYMOB_PAYMENT_METHODS = (process.env.PAYMOB_PAYMENT_METHODS || "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean)
  .map((x) => (/^\d+$/.test(x) ? Number(x) : x));

const PUBLIC_SITE_URL = (process.env.PUBLIC_SITE_URL || "").replace(/\/$/, "");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const cleanText = (value, fallback = "") => {
  return String(value || fallback).replace(/[<>]/g, "").trim();
};

const amountCents = (value) => {
  return Math.max(0, Math.round(Number(value || 0) * 100));
};

app.post("/api/paymob/create-intention", async (req, res) => {
  try {
    if (!PAYMOB_SECRET_KEY || !PAYMOB_PUBLIC_KEY || !PAYMOB_PAYMENT_METHODS.length) {
      return res.status(501).json({
        error: "Paymob is not configured yet. Add PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY, and PAYMOB_PAYMENT_METHODS."
      });
    }

    const body = req.body || {};
    const cartItems = Array.isArray(body.items) ? body.items : [];
    const total = Number(body.total || 0);

    if (!cartItems.length || total <= 0) {
      return res.status(400).json({ error: "Empty cart or invalid total." });
    }

    const customer = body.customer || {};
    const fullName = cleanText(customer.full_name, "KAWTHAR Customer");
    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(" ") || "Customer";

    const items = cartItems.map((item) => {
      const qty = Math.max(1, Number(item.quantity || 1));
      const price = Number(item.price || 0);
      const amount = amountCents(price * qty);

      return {
        name: cleanText(item.name, "KAWTHAR Item").slice(0, 120),
        amount,
        description: "KAWTHAR Accessories order item",
        quantity: qty
      };
    });

    const calculatedAmount = items.reduce((sum, item) => sum + item.amount, 0);

    if (calculatedAmount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount." });
    }

    const reference = `KAW-${Date.now()}`;

    const payload = {
      amount: calculatedAmount,
      currency: "EGP",
      payment_methods: PAYMOB_PAYMENT_METHODS,
      items,
      billing_data: {
        first_name: cleanText(firstName, "KAWTHAR"),
        last_name: cleanText(lastName, "Customer"),
        email: cleanText(customer.email, "customer@kawtharabdo.site"),
        phone_number: cleanText(customer.phone_number, "01000000000"),
        country: "EG",
        city: cleanText(customer.city, "Cairo"),
        state: "NA",
        postal_code: "00000",
        street: "Online order",
        building: "NA",
        floor: "NA",
        apartment: "NA"
      },
      customer: {
        first_name: cleanText(firstName, "KAWTHAR"),
        last_name: cleanText(lastName, "Customer"),
        email: cleanText(customer.email, "customer@kawtharabdo.site")
      },
      special_reference: reference,
      expiration: 3600,
      extras: {
        source: "kawtharabdo_checkout",
        merchant_reference: reference
      }
    };

    if (PUBLIC_SITE_URL) {
      payload.redirection_url = `${PUBLIC_SITE_URL}/checkout.html?payment_return=1&ref=${reference}`;
      payload.notification_url = `${PUBLIC_SITE_URL}/api/paymob/webhook`;
    }

    const paymobRes = await fetch(`${PAYMOB_BASE_URL}/v1/intention/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${PAYMOB_SECRET_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await paymobRes.json().catch(() => ({}));

    if (!paymobRes.ok) {
      return res.status(502).json({
        error: "Paymob refused the payment intention request.",
        details: data
      });
    }

    const clientSecret = data.client_secret;
    const checkoutUrl = data.checkout_url || (
      clientSecret
        ? `${PAYMOB_BASE_URL}/unifiedcheckout/?publicKey=${encodeURIComponent(PAYMOB_PUBLIC_KEY)}&clientSecret=${encodeURIComponent(clientSecret)}`
        : null
    );

    if (!checkoutUrl) {
      return res.status(502).json({
        error: "Paymob did not return a checkout URL or client secret.",
        details: data
      });
    }

    return res.json({
      ok: true,
      reference,
      client_secret: clientSecret,
      checkout_url: checkoutUrl
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Payment server error."
    });
  }
});

app.post("/api/paymob/webhook", (req, res) => {
  console.log("Paymob webhook received:", JSON.stringify(req.body));
  res.json({ ok: true });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "kawtharabdo-payment-server" });
});

app.use(express.static(SITE_ROOT, {
  extensions: ["html"]
}));

app.listen(PORT, "127.0.0.1", () => {
  console.log(`KAWTHAR payment server running on http://127.0.0.1:${PORT}`);
  console.log(`Serving site root: ${SITE_ROOT}`);
});
