(function () {
  "use strict";

  function removeVisibleBackslashN() {
    if (!document.body) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.nodeValue || "";
      const cleaned = value.trim();

      if (
        cleaned === "\\n" ||
        cleaned === "\\n\\n" ||
        cleaned === "\\n\\n\\n"
      ) {
        nodes.push(node);
      }
    }

    nodes.forEach((node) => {
      node.parentNode && node.parentNode.removeChild(node);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeVisibleBackslashN);
  } else {
    removeVisibleBackslashN();
  }

  setTimeout(removeVisibleBackslashN, 300);
  setTimeout(removeVisibleBackslashN, 1200);
  setTimeout(removeVisibleBackslashN, 2600);

  const observer = new MutationObserver(removeVisibleBackslashN);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR visible backslash-n remover active.");
})();
