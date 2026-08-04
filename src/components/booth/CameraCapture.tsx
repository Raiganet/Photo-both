'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, FlipHorizontal, RefreshCw, Settings2 } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useBoothStore } from '@/store/useBoothStore';
import { GlassCard } from '@/components/shared/GlassCard';
import { Countdown } from './Countdown';
import { LayoutSelector } from './LayoutSelector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CameraCapture() {
  const { mirrorMode, currentDeviceId, resolution, countdown, flashAnimation } = useBoothStore();
  const { videoRef, devices, isStreaming, error, startCamera, captureFrame } = useCamera({
    deviceId: currentDeviceId,
    width: resolution.width,
    height: resolution.height,
  });

  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [countingDown, setCountingDown] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  useEffect(() => {
    startCamera();
  }, [startCamera, currentDeviceId]);

  const handleCapture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCapturedImages([]);

    const shotsNeeded = getShotsForLayout(useBoothStore.getState().layout);

    for (let i = 0; i < shotsNeeded; i++) {
      // Countdown
      setCountingDown(true);
      for (let c = countdown; c > 0; c--) {
        setCurrentCount(c);
        if (useBoothStore.getState().voiceCountdown) {
          speak(c.toString());
        }
        await sleep(1000);
      }
      setCountingDown(false);

      // Flash
      if (flashAnimation) {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
      }

      // Capture
      const frame = captureFrame();
      if (frame) setCapturedImages(prev => [...prev, frame]);

      if (i < shotsNeeded - 1) await sleep(1500);
    }

    setIsCapturing(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Camera View */}
      <GlassCard className="relative overflow-hidden aspect-video max-h-[70vh]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            'w-full h-full object-cover transition-transform',
            mirrorMode && 'scale-x-[-1]'
          )}
        />

        {/* Flash Overlay */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white pointer-events-none z-20"
            />
          )}
        </AnimatePresence>

        {/* Countdown Overlay */}
        <AnimatePresence>
          {countingDown && <Countdown value={currentCount} />}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center">
            <div>
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">Kamera Tidak Tersedia</p>
              <p className="text-sm opacity-70 mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Camera Controls Overlay */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button
            size="icon"
            variant="glass"
            onClick={() => useBoothStore.getState().toggleMirror()}
          >
            <FlipHorizontal className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="glass">
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </GlassCard>

      {/* Bottom Controls */}
      <div className="mt-6 flex flex-col gap-4">
        <LayoutSelector />

        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            onClick={handleCapture}
            disabled={isCapturing || !isStreaming}
            className="px-8 bg-gradient-primary text-white hover:opacity-90"
          >
            <Camera className="w-5 h-5 mr-2" />
            {isCapturing ? 'Mengambil Foto...' : 'Ambil Foto'}
          </Button>
        </div>

        {/* Captured Preview */}
        {capturedImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {capturedImages.map((img, i) => (
              <motion.img
                key={i}
                src={img}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 object-cover rounded-lg border-2 border-primary"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getShotsForLayout(layout: string): number {
  const map: Record<string, number> = {
    'single': 1, 'double': 2, 'triple': 3, 'quad': 4,
    'strip-2': 2, 'strip-3': 3, 'strip-4': 4,
    'grid-2x2': 4, 'grid-3x3': 9,
  };
  return map[layout] ?? 4;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'id-ID';
    utter.rate = 1.2;
    speechSynthesis.speak(utter);
  }
}
