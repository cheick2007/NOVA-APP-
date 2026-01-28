'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth/Auth';
import { Profile } from '@/types';

export default function ProfilePage() {
    const [session, setSession] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
            else setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
            else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function fetchProfile(userId: string) {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
        } else {
            setProfile(data);
        }
        setLoading(false);
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
    }

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
    }

    if (!session) {
        return (
            <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                <Auth />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', paddingTop: '80px', color: 'white', textAlign: 'center' }}>
            <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#333',
                margin: '0 auto 20px',
                backgroundImage: profile?.avatar_url ? `url(${profile.avatar_url})` : 'none',
                backgroundSize: 'cover'
            }}></div>

            <h1 style={{ marginBottom: '10px' }}>@{profile?.username || 'User'}</h1>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>{profile?.bio || 'No bio yet.'}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                <div>
                    <strong>0</strong><br />
                    <span style={{ fontSize: '12px', color: '#888' }}>Following</span>
                </div>
                <div>
                    <strong>0</strong><br />
                    <span style={{ fontSize: '12px', color: '#888' }}>Followers</span>
                </div>
                <div>
                    <strong>0</strong><br />
                    <span style={{ fontSize: '12px', color: '#888' }}>Likes</span>
                </div>
            </div>

            <button
                onClick={handleSignOut}
                style={{
                    padding: '10px 20px',
                    background: '#333',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Sign Out
            </button>
        </div>
    );
}
