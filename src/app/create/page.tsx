'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Circle, Check } from 'lucide-react';

const FILTERS = [
    { name: 'Normal', filter: 'none' },
    { name: 'B&W', filter: 'grayscale(100%)' },
    { name: 'Sepia', filter: 'sepia(100%)' },
    { name: 'Vivid', filter: 'saturate(200%)' },
    { name: 'Cool', filter: 'hue-rotate(180deg)' },
];

export default function CreatePage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [activeFilterIndex, setActiveFilterIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    async function startCamera() {
        try {
            if (stream) {
                stopCamera();
            }
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: false // Muted for now
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }

    function toggleCamera() {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    }

    function handleFilterChange(direction: 'next' | 'prev') {
        if (direction === 'next') {
            setActiveFilterIndex((prev) => (prev + 1) % FILTERS.length);
        } else {
            setActiveFilterIndex((prev) => (prev - 1 + FILTERS.length) % FILTERS.length);
        }
    }

    return (
        <div style={{ height: '100vh', width: '100%', background: 'black', position: 'relative', overflow: 'hidden' }}>

            {/* Camera Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: FILTERS[activeFilterIndex].filter,
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' // Mirror selfie
                }}
            />

            {/* Top Bar */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <ArrowLeft size={28} />
                </button>
            </div>

            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
                <button onClick={toggleCamera} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', color: 'white' }}>
                    <RefreshCw size={24} style={{ marginBottom: 4 }} />
                    <span style={{ fontSize: 10 }}>Flip</span>
                </button>
            </div>

            {/* Filter Name Overlay (Temporary) */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                textAlign: 'center',
                pointerEvents: 'none',
                opacity: 0.7
            }}>
                <SwipeHandler onSwipeLeft={() => handleFilterChange('next')} onSwipeRight={() => handleFilterChange('prev')} />
            </div>

            {/* Bottom Controls */}
            <div style={{ position: 'absolute', bottom: 40, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Filter Scroller Label */}
                <div style={{ marginBottom: 20, color: 'yellow', fontWeight: 'bold', textShadow: '0 1px 2px black' }}>
                    {FILTERS[activeFilterIndex].name}
                </div>

                {/* Filter Dots */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {FILTERS.map((_, i) => (
                        <div key={i} style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: i === activeFilterIndex ? 'yellow' : 'rgba(255,255,255,0.5)'
                        }} />
                    ))}
                </div>

                {/* Shutter Button */}
                <button style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    border: '4px solid white',
                    background: 'red',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Inner content can be added for recording state */}
                </button>
            </div>

            {/* Instructions */}
            <div style={{ position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 12, pointerEvents: 'none' }}>
                Swipe left/right for filters
            </div>
        </div>
    );
}

// Simple Swipe Helper Component
function SwipeHandler({ onSwipeLeft, onSwipeRight }: { onSwipeLeft: () => void, onSwipeRight: () => void }) {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0); // reset
        setTouchStart(e.targetTouches[0].clientX);
    }

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            onSwipeLeft();
        }
        if (isRightSwipe) {
            onSwipeRight();
        }
    }

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ width: '100vw', height: '30vh', position: 'absolute', top: '-15vh', left: 0 }}
        />
    )
}
