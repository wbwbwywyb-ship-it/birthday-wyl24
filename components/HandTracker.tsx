
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { useStore } from '../store';
import { AppPhase } from '../types';

const HandTracker: React.FC = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const setGesture = useStore((state) => state.setGesture);
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);

  useEffect(() => {
    async function initRecognizer() {
      try {
        setLoading(true);
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        recognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
      } catch (err) {
        console.warn("Failed to initialize gesture recognizer:", err);
        setError("AI initialization failed.");
      } finally {
        setLoading(false);
      }
    }
    initRecognizer();
  }, []);

  useEffect(() => {
    let animationId: number;
    const predict = async () => {
      if (active && videoRef.current && recognizerRef.current && videoRef.current.readyState >= 2) {
        try {
          const now = performance.now();
          const results = recognizerRef.current.recognizeForVideo(videoRef.current, now);
          
          if (results.gestures.length > 0) {
            const gestureName = results.gestures[0][0].categoryName;
            setGesture(gestureName as any);
            
            if (gestureName === 'Open_Palm' && phase === AppPhase.CAKE) {
              setPhase(AppPhase.BLOOMING);
            } else if (gestureName === 'Closed_Fist' && phase === AppPhase.NEBULA) {
              setPhase(AppPhase.COLLAPSING);
            }
          } else {
            setGesture('None');
          }
        } catch (err) {
          // Silent catch for per-frame prediction errors
        }
      }
      animationId = requestAnimationFrame(predict);
    };
    predict();
    return () => cancelAnimationFrame(animationId);
  }, [active, phase, setGesture, setPhase]);

  const toggleCamera = async () => {
    setError(null);
    if (!active) {
      try {
        // Pre-check for MediaDevices support
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          throw new Error("Browser does not support media devices.");
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        
        if (!hasCamera) {
          throw new Error("No camera found on this device.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.warn("Video play failed:", e));
            setActive(true);
          };
        }
      } catch (err: any) {
        console.warn("Camera access warning:", err);
        let msg = "Could not access camera.";
        if (err.name === 'NotFoundError' || err.message.includes('not found')) {
          msg = "No camera hardware detected.";
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          msg = "Camera permission denied.";
        }
        setError(msg);
        setActive(false);
      }
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setActive(false);
      setGesture('None');
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
      <div className={`w-40 h-30 bg-black/50 border border-white/20 rounded-lg overflow-hidden backdrop-blur-md transition-all duration-500 ${active ? 'opacity-100' : 'opacity-0 scale-95'}`}>
        <video ref={videoRef} playsInline muted className="w-full h-full object-cover -scale-x-100" />
      </div>
      
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        {error && (
          <div className="px-3 py-2 bg-red-500/20 border border-red-500/40 rounded text-red-100 text-[10px] backdrop-blur-sm max-w-[200px] text-right">
            {error} 无法访问摄像头，手势功能已禁用。请用鼠标点击蛋糕炸开，按 [空格] 或双击屏幕重置。
          </div>
        )}

        <button
          onClick={toggleCamera}
          disabled={loading}
          className={`px-4 py-2 border rounded-full text-white text-sm backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 ${
            active ? 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30' : 'bg-white/10 border-white/20 hover:bg-white/20'
          }`}
        >
          {loading ? 'AI Preparing...' : active ? 'Disable Gestures' : 'Enable Hand Control'}
        </button>
        
        {!active && !loading && !error && (
          <div className="text-[10px] text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Interactive hand tracking available
          </div>
        )}
      </div>
    </div>
  );
};

export default HandTracker;
