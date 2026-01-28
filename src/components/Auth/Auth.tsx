'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Debug: Check if Supabase URL is defined
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            alert("Erreur Configuration: URL Supabase manquante. Vérifiez les variables d'environnement.");
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username,
                            full_name: fullName,
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
            }
        } catch (error: any) {
            console.error("Auth Error:", error);
            if (error.message === 'Failed to fetch') {
                alert("Erreur de connexion. Vérifiez votre réseau ou la configuration du projet (Variables d'environnement manquantes sur Vercel ?).");
            } else {
                alert(error.message || 'Une erreur est survenue');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ff8800 0%, #ffffff 50%, #00ff00 100%)'
        }}>
            <div style={{
                background: 'rgba(0,0,0,0.85)',
                padding: '30px',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '400px',
                color: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
                <h2 style={{ marginBottom: '25px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                    {isSignUp ? 'Rejoindre Nova' : 'Connexion'}
                </h2>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {isSignUp && (
                        <>
                            <input
                                type="text"
                                placeholder="Nom Complet"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid #444',
                                    background: '#222',
                                    color: 'white',
                                    fontSize: '16px'
                                }}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nom d'utilisateur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid #444',
                                    background: '#222',
                                    color: 'white',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid #444',
                            background: '#222',
                            color: 'white',
                            fontSize: '16px'
                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid #444',
                            background: '#222',
                            color: 'white',
                            fontSize: '16px'
                        }}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#fe2c55',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: 'pointer',
                            opacity: loading ? 0.7 : 1,
                            marginTop: '10px'
                        }}
                    >
                        {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : 'Se connecter')}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', color: '#ccc', fontSize: '14px' }}>
                    {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff8800',
                            marginLeft: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}
                    >
                        {isSignUp ? 'Se connecter' : "S'inscrire"}
                    </button>
                </div>
            </div>
        </div>
    );
}
