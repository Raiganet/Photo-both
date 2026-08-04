'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCameraOptions {
  deviceId?: string | null;
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export function useCamera(options: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enumerateDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
      setDevices(videoDevices);
      return videoDevices;
    } catch (err) {
      setError('Gagal mendeteksi kamera');
      return [];
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: options.deviceId
          ? { deviceId: { exact: options.deviceId }, width: options.width ?? 1920, height: options.height ?? 1080 }
          : { facingMode: options.facingMode ?? 'user', width: options.width ?? 1920, height: options.height ?? 1080 },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }

      await enumerateDevices();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kamera tidak dapat diakses';
      setError(message);
      setIsStreaming(false);
    }
  }, [options.deviceId, options.facingMode, options.width, options.height, enumerateDevices]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreaming(false);
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/png');
  }, []);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  return {
    videoRef,
    devices,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    captureFrame,
    enumerateDevices,
  };
}
