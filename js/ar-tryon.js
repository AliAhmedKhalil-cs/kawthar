// js/ar-tryon.js

export const initARTryOn = () => {
  const modal = document.getElementById('arTryOnModal');
  const videoElement = document.getElementById('arVideo');
  const canvasElement = document.getElementById('arCanvas');
  const closeBtn = document.getElementById('closeArBtn');
  const loadingText = document.getElementById('arLoading');
  
  if (!modal || !videoElement || !canvasElement) return;

  const canvasCtx = canvasElement.getContext('2d');
  let camera = null;
  let hands = null;
  let currentProductImg = new Image();
  let isCameraActive = false;

  const setupAR = () => {
    // تحميل مكتبة MediaPipe لتتبع اليد
    hands = new window.Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    hands.setOptions({
      maxNumHands: 1, // تتبع يد واحدة
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults(onResults);

    camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (isCameraActive) {
          await hands.send({image: videoElement});
        }
      },
      width: 480,
      height: 640
    });
  };

  const onResults = (results) => {
    if (loadingText) loadingText.style.display = 'none';
    
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      // نقاط إصبع البنصر (Ring Finger)
      const baseJoint = landmarks[13]; 
      const midJoint = landmarks[14];  

      const x1 = baseJoint.x * canvasElement.width;
      const y1 = baseJoint.y * canvasElement.height;
      const x2 = midJoint.x * canvasElement.width;
      const y2 = midJoint.y * canvasElement.height;

      // حساب المسافة والميلان
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const ringSize = distance * 2.2; // التحكم بحجم الخاتم
      const angle = Math.atan2(y2 - y1, x2 - x1) - (Math.PI / 2);

      // رسم الخاتم
      if (currentProductImg.src && currentProductImg.complete) {
        canvasCtx.translate(x2, y2);
        canvasCtx.rotate(angle);
        canvasCtx.drawImage(currentProductImg, -ringSize / 2, -ringSize / 2, ringSize, ringSize);
      }
    }
    canvasCtx.restore();
  };

  window.openARTryOn = (imgUrl) => {
    currentProductImg.src = imgUrl;
    modal.classList.remove('hidden');
    if (loadingText) loadingText.style.display = 'flex';
    
    if (!hands) setupAR();
    if (!isCameraActive) {
      isCameraActive = true;
      camera.start();
    }
  };

  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
    if (camera && isCameraActive) {
      isCameraActive = false;
      camera.stop();
      // تفريغ الكانفاس عند الإغلاق
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
  });
};