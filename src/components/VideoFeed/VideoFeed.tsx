'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Video } from '@/types';
import ActionButtons from '../ActionButtons/ActionButtons';
import TopBar from '../TopBar/TopBar';

export default function VideoFeed() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVideos() {
            setLoading(true);
            const { data, error } = await supabase
                .from('videos')
                .select(`
                    *,
                    profiles (*)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching videos:', error);
            } else {
                setVideos((data as Video[]) || []);
            }
            setLoading(false);
        }

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'black', color: 'white' }}>
                <p>Loading videos...</p>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'black', color: 'white' }}>
                <p>No videos yet!</p>
                <p style={{ color: '#888', marginTop: '10px' }}>Upload the first video.</p>
            </div>
        );
    }

    return (
        <div className="snap-y" style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory', position: 'relative' }}>
            <TopBar />
            {videos.map((video) => (
                <div key={video.id} className="snap-center" style={{ height: '100vh', width: '100%', position: 'relative', borderBottom: '1px solid #333', background: '#000' }}>
                    {/* Video content would go here */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        backgroundImage: `url(${video.video_url})`, // Placeholder if it's an image, or use video tag below
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                        {/* 
                           Note: For real videos, use:
                           <video src={video.video_url} loop autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           But for now, usually video data might be just a URL 
                        */}
                        <video
                            src={video.video_url}
                            loop
                            autoPlay
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Overlay Info (Bottom Left) */}
                        <div style={{ position: 'absolute', bottom: '80px', left: '10px', color: 'white', textShadow: '1px 1px 2px black', maxWidth: '80%' }}>
                            <h3 style={{ margin: 0, fontWeight: 'bold' }}>@{video.profiles?.username || 'user'}</h3>
                            <p style={{ margin: '8px 0' }}>{video.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '5px' }}>🎵</span>
                                <p style={{ margin: 0 }}>{video.song_name || 'Original Sound'}</p>
                            </div>
                        </div>
                    </div>

                    <ActionButtons />
                </div>
            ))}
        </div>
    )
}
