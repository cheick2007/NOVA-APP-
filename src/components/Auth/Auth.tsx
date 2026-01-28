'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username,
                            full_name: username, // Default to username for now
                        },
                    },
                });
                if (error) throw error;
                alert('Inscription réussie ! Vérifiez vos emails.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Reload handled by parent or router refresh usually
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', color: 'white' }}>
            <h2 style={{ marginBottom: '20px' }}>{isSignUp ? 'Inscription' : 'Connexion'}</h2>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                {isSignUp && (
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
                        required
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px',
                        borderRadius: '5px',
                        border: 'none',
                        background: '#fe2c55',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : 'Se connecter')}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
                {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{ background: 'none', border: 'none', color: '#fff', marginLeft: '5px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isSignUp ? 'Se connecter' : "S'inscrire"}
                </button>
            </p>
        </div>
    );
}
