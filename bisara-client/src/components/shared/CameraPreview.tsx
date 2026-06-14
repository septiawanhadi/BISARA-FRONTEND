import React, { useRef, useEffect, useState } from 'react';
import { InferenceSocketService } from '../../lib/api';

interface CameraPreviewProps {
  isQuizMode?: boolean;
  onAccuracyUpdate?: (acc: number) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ 
  isQuizMode = false,
  onAccuracyUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [statusText, setStatusText] = useState('Status: Kamera Mati');
  const [metricsText, setMetricsText] = useState('Akurasi: -- | Conf: --');
  const [lowLightWarning, setLowLightWarning] = useState(false);
  const [outOfFrame, setOutOfFrame] = useState(false);
  const [highLatency, setHighLatency] = useState(false);
  const [latencyVal, setLatencyVal] = useState<number | null>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const socketRef = useRef<InferenceSocketService | null>(null);

  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
        setCameraActive(true);
        setStatusText('Status: Mencari Aktor...');
        startLandmarkSimulation();
      } catch (err) {
        console.error("Webcam failed:", err);
        alert("Gagal mengakses kamera. Mohon berikan izin kamera.");
      }
    }
  };

  const stopCamera = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setLowLightWarning(false);
    setOutOfFrame(false);
    setHighLatency(false);
    setLatencyVal(null);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setStatusText('Status: Kamera Mati');
    setMetricsText('Akurasi: -- | Conf: --');
    
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up camera streams on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const startLandmarkSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 640;
    canvas.height = canvas.parentElement?.clientHeight || 480;

    // Connect to mock/real WebSocket AI Inference Server as defined in Section 5
    const socket = new InferenceSocketService(isQuizMode ? 'quiz' : 'sandbox');
    socket.onStatusChange((status, latency) => {
      setStatusText(status);
      if (latency) {
        setLatencyVal(latency);
        setHighLatency(latency > 500);
      }
    });
    socket.onResult((res) => {
      if (isQuizMode && onAccuracyUpdate) {
        onAccuracyUpdate(res.accuracy);
      }
      setMetricsText(`Akurasi: ${res.accuracy}% | Conf: ${res.confidence.toFixed(2)}`);
    });
    socket.connect();
    socketRef.current = socket;

    let frameCount = 0;
    
    const points = {
      nose: { x: canvas.width / 2, y: canvas.height * 0.3 },
      leftEye: { x: canvas.width / 2 - 25, y: canvas.height * 0.28 },
      rightEye: { x: canvas.width / 2 + 25, y: canvas.height * 0.28 },
      leftShoulder: { x: canvas.width / 2 - 90, y: canvas.height * 0.5 },
      rightShoulder: { x: canvas.width / 2 + 90, y: canvas.height * 0.5 },
      leftElbow: { x: canvas.width / 2 - 140, y: canvas.height * 0.65 },
      rightElbow: { x: canvas.width / 2 + 140, y: canvas.height * 0.65 },
      leftWrist: { x: canvas.width / 2 - 80, y: canvas.height * 0.6 },
      rightWrist: { x: canvas.width / 2 + 80, y: canvas.height * 0.6 },
    };

    const drawFrame = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      const driftX = Math.sin(frameCount * 0.05) * 8;
      const driftY = Math.cos(frameCount * 0.07) * 5;
      const gestureOffsetLeftX = Math.sin(frameCount * 0.1) * 35;
      const gestureOffsetLeftY = Math.cos(frameCount * 0.1) * 20;

      // Face mesh oval
      ctx.strokeStyle = "#22D3EE";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(points.nose.x + driftX, points.nose.y + driftY, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "#FF4D9D";
      [points.leftEye, points.rightEye].forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x + driftX, pt.y + driftY, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Body shoulders skeleton
      ctx.strokeStyle = "#34D399";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(points.leftShoulder.x + driftX, points.leftShoulder.y + driftY);
      ctx.lineTo(points.rightShoulder.x + driftX, points.rightShoulder.y + driftY);
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.moveTo(points.leftShoulder.x + driftX, points.leftShoulder.y + driftY);
      ctx.lineTo(points.leftElbow.x + driftX, points.leftElbow.y + driftY);
      ctx.lineTo(points.leftWrist.x + gestureOffsetLeftX, points.leftWrist.y + gestureOffsetLeftY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(points.rightShoulder.x + driftX, points.rightShoulder.y + driftY);
      ctx.lineTo(points.rightElbow.x + driftX, points.rightElbow.y + driftY);
      ctx.lineTo(points.rightWrist.x + driftX, points.rightWrist.y + driftY);
      ctx.stroke();

      // Hands
      const leftWristX = points.leftWrist.x + gestureOffsetLeftX;
      const leftWristY = points.leftWrist.y + gestureOffsetLeftY;
      const rightWristX = points.rightWrist.x + driftX;
      const rightWristY = points.rightWrist.y + driftY;

      drawHandJoints(ctx, leftWristX, leftWristY, frameCount);
      drawHandJoints(ctx, rightWristX, rightWristY, frameCount);

      // --- ERR-02: Check if hand landmarks coordinates go out of frame boundaries ---
      const borderMargin = 45;
      const isOut = (
        leftWristX < borderMargin || 
        leftWristX > canvas.width - borderMargin || 
        leftWristY < borderMargin || 
        leftWristY > canvas.height - borderMargin ||
        rightWristX < borderMargin ||
        rightWristX > canvas.width - borderMargin ||
        rightWristY < borderMargin ||
        rightWristY > canvas.height - borderMargin
      );
      setOutOfFrame(isOut);

      // --- ERR-01: Real-time Camera Luminance Check ---
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const width = 80;
          const height = 60;
          const sampleCtx = canvas.getContext('2d');
          if (sampleCtx) {
            const buffer = sampleCtx.getImageData(canvas.width / 2 - width / 2, canvas.height / 2 - height / 2, width, height);
            const data = buffer.data;
            let sum = 0;
            for (let i = 0; i < data.length; i += 4) {
              sum += (0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]);
            }
            const brightness = sum / (width * height);
            // If average pixel brightness drops below 30 (severe low light)
            setLowLightWarning(brightness < 30);
          }
        } catch (e) {
          // Ignore canvas read restrictions
        }
      }

      // --- ERR-05: Network Latency Spike Simulation (triggers every 6s) ---
      if (frameCount % 180 === 0) {
        setHighLatency(true);
        setLatencyVal(680);
        setStatusText("Status: Latensi Tinggi...");
        setMetricsText("Akurasi: -- | Conf: -- | Latency: 680ms");
        
        setTimeout(() => {
          setHighLatency(false);
          setLatencyVal(12);
        }, 2000);
      }

      // --- PUSH SEQUENCE TO SOCKET (Every 30 frames / 1s) ---
      if (frameCount % 30 === 0 && socketRef.current) {
        const simulatedLandmarks = [
          { x: leftWristX / canvas.width, y: leftWristY / canvas.height, z: 0 },
          { x: rightWristX / canvas.width, y: rightWristY / canvas.height, z: 0 }
        ];
        socketRef.current.sendJointLandmarks(simulatedLandmarks);

        // Fallback update metrics when server matches
        if (!highLatency) {
          const acc = Math.floor(75 + Math.sin(frameCount) * 15);
          const conf = (0.75 + Math.sin(frameCount) * 0.15).toFixed(2);
          if (isQuizMode && onAccuracyUpdate) {
            onAccuracyUpdate(acc);
            setMetricsText(`Akurasi: ${acc}%`);
          } else {
            setStatusText("Status: Mendeteksi...");
            setMetricsText(`Akurasi: ${acc}% | Conf: ${conf} | Latency: 12ms`);
          }
        }
      }

      animationIdRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();
  };

  const drawHandJoints = (ctx: CanvasRenderingContext2D, wristX: number, wristY: number, tick: number) => {
    ctx.fillStyle = "#FFD60A";
    ctx.strokeStyle = "#FF8A00";
    ctx.lineWidth = 1.5;
    
    for (let f = 0; f < 5; f++) {
      const angle = -Math.PI / 2 + (f - 2) * 0.25;
      ctx.beginPath();
      ctx.moveTo(wristX, wristY);
      
      let curX = wristX;
      let curY = wristY;
      
      for (let j = 0; j < 3; j++) {
        const len = 15;
        curX += Math.cos(angle + Math.sin(tick * 0.05 + f) * 0.05) * len;
        curY += Math.sin(angle + Math.sin(tick * 0.05 + f) * 0.05) * len;
        
        ctx.lineTo(curX, curY);
        ctx.arc(curX, curY, 3, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
    
    ctx.fillStyle = "#FF4D9D";
    ctx.beginPath();
    ctx.arc(wristX, wristY, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full font-nunito">
      <div className={`relative w-full bg-white border-4 ${outOfFrame ? 'border-bisara-pink animate-pulse' : 'border-bisara-accent'} rounded-lg p-4 shadow-md transition-colors duration-300`}>
        {/* Username overlay */}
        <div className="absolute top-6 left-6 bg-slate-800 bg-opacity-70 text-white font-extrabold px-4 py-2 rounded-full z-10 backdrop-blur-sm">
          Anya
        </div>
        
        {/* AI metrics card overlay */}
        <div className="absolute top-6 right-6 bg-bisara-yellow text-bisara-navy p-3 rounded-md shadow-md z-10 text-xs font-bold max-w-[200px]">
          <span className="w-2.5 h-2.5 rounded-full bg-bisara-pink inline-block mr-2 animate-ping"></span>
          <span>{statusText}</span>
          <div className="mt-1 opacity-80">{metricsText}</div>
          {latencyVal !== null && (
            <div className="mt-0.5 text-[10px] opacity-75 font-nunito">Latensi: {latencyVal}ms</div>
          )}
        </div>

        <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-md overflow-hidden">
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover scale-x-[-1] absolute top-0 left-0" 
            autoPlay 
            playsInline
          />
          <canvas 
            ref={canvasRef} 
            className="w-full h-full absolute top-0 left-0 z-[5] pointer-events-none" 
          />
          <div className="absolute top-[15%] left-[15%] w-[70%] h-[70%] border-2 border-dashed border-yellow-400 opacity-60 rounded-lg pointer-events-none z-[6]" />

          {/* ERR-01: Low Light Overlay */}
          {lowLightWarning && (
            <div className="absolute inset-0 bg-slate-900 bg-opacity-85 flex flex-col items-center justify-center text-center p-6 z-20">
              <span className="text-4xl mb-2 animate-bounce">💡</span>
              <span className="text-white font-extrabold text-lg font-zain tracking-wide">Pencahayaan Rendah (ERR-01)</span>
              <span className="text-slate-300 text-xs mt-1 font-semibold max-w-[280px]">Mohon nyalakan lampu agar AI dapat mendeteksi dengan baik.</span>
            </div>
          )}

          {/* ERR-02: Out of Frame Warning Pill */}
          {outOfFrame && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-bisara-pink text-white px-4 py-1.5 rounded-full z-20 text-[10px] font-black uppercase tracking-wider shadow font-zain">
              Keluar Batas (ERR-02)
            </div>
          )}

          {/* ERR-05: Latency Spike Notification Bar */}
          {highLatency && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-600 bg-opacity-95 text-white p-3 rounded-md shadow-md z-20 text-[10px] font-bold flex items-center gap-2 animate-bounce">
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block animate-ping"></span>
              <span>Koneksi server lambat (Latensi Tinggi). Membuka ulang jalur komunikasi...</span>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={toggleCamera}
        className="w-[72px] h-[72px] rounded-full text-white text-3xl flex items-center justify-center shadow-lg transition-transform hover:scale-108"
        style={{ backgroundColor: cameraActive ? 'var(--primary-blue)' : 'var(--pink-accent)' }}
      >
        {cameraActive ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        )}
      </button>
    </div>
  );
};
