'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const FILTERS = [
    { name: 'Normal', filter: 'none' },
    { name: 'B&W', filter: 'grayscale(100%)' },
    { name: 'Sepia', filter: 'sepia(100%)' },
    { name: 'Vivid', filter: 'saturate(200%)' },
    { name: 'Cool', filter: 'hue-rotate(180deg)' },
    { name: 'Warm', filter: 'sepia(50%) saturate(150%)' },
    { name: 'Invert', filter: 'invert(100%)' },
];

export default function CreatePage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
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

            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1080 },
                    height: { ideal: 1920 }
                },
                audio: false
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            try {
                const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(fallbackStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = fallbackStream;
                }
            } catch (fallbackErr) {
                alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
            }
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

    function takePhoto() {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            // Set canvas size to match video resolution
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Apply filter context
            context.filter = FILTERS[activeFilterIndex].filter;

            // Mirror if frontend camera (because CSS transform doesn't affect canvas drawImage)
            if (facingMode === 'user') {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to data URL and download (Temporary for verification)
            const dataUrl = canvas.toDataURL('image/png');

            // Simulate download
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `nova_capture_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Visual Flash Effect
            const flash = document.createElement('div');
            flash.style.position = 'absolute';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.background = 'white';
            flash.style.opacity = '0.8';
            flash.style.zIndex = '100';
            flash.style.transition = 'opacity 0.5s';
            document.body.appendChild(flash);
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => document.body.removeChild(flash), 500);
            }, 50);
        }
    }

    return (
        <div style={{ height: '100vh', width: '100%', background: 'black', position: 'relative', overflow: 'hidden' }}>

            {/* Hidden Canvas for capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

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
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                }}
            />

            {/* Top Bar */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <button onClick={() => router.back()} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', padding: 8, borderRadius: '50%' }}>
                    <ArrowLeft size={28} />
                </button>
            </div>

            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
                <button onClick={toggleCamera} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: '8px', border: 'none', color: 'white' }}>
                    <RefreshCw size={24} style={{ marginBottom: 4 }} />
                    <span style={{ fontSize: 10 }}>Flip</span>
                </button>
            </div>

            {/* Filter Navigation */}
            <div style={{ position: 'absolute', top: '50%', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 10px', pointerEvents: 'none' }}>
                <button
                    onClick={() => handleFilterChange('prev')}
                    style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', padding: 10, color: 'white' }}
                >
                    <ChevronLeft size={32} />
                </button>
                <button
                    onClick={() => handleFilterChange('next')}
                    style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', padding: 10, color: 'white' }}
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Bottom Controls */}
            <div style={{ position: 'absolute', bottom: 40, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Filter Name */}
                <div style={{ marginBottom: 20, color: 'yellow', fontWeight: 'bold', textShadow: '0 1px 2px black', fontSize: '18px' }}>
                    {FILTERS[activeFilterIndex].name}
                </div>

                {/* Filter Dots */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {FILTERS.map((_, i) => (
                        <div key={i} style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: i === activeFilterIndex ? 'yellow' : 'rgba(255,255,255,0.4)',
                            transition: 'background 0.3s'
                        }} />
                    ))}
                </div>

                {/* Shutter Button (Capture) */}
                <button
                    onClick={takePhoto}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        border: '4px solid white',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'red' }}></div>
                </button>
            </div>
        </div>
    );
}
