import React, { useEffect, useRef, useState } from 'react';
import { useDroppWallet } from '../libs/dropp-wallet-plugin.es.js';
// import '../libs/index.css'
const DroppWallet = ({ setisDropDown }) => {
    const [email, setEmail] = useState('');

    const {
        isConnected,
        walletId,
        statusMessage,
        isLoading,
        connectWallet,      // QR Code / WalletConnect
        loginWithEmail,     // Direct Login / Redirect
        disconnectWallet
    } = useDroppWallet({
        merchantId: '0.0.6784854',
        environment: 'SANDBOX',
        apiBaseUrl: 'https://unthink-dropp-payment-stage-314035436999.us-central1.run.app/api/payments/get-authorize-url'
    });

    const handleQrConnect = async () => {
        if (!email) {
            alert('Please enter an email first');
            return;
        }
        await connectWallet(email);
    };

    const handleEmailLogin = async () => {
        if (!email) {
            alert('Please enter an email first');
            return;
        }
        await loginWithEmail(email);
    };
    const popRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popRef.current && !popRef.current.contains(event.target)) {
                setisDropDown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popRef])

    return (
        <div style={{ padding: '20px', width: '100%', display: 'flex', justifyContent: 'center' }} ref={popRef}>
            <div className="glass-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"  >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                        Dropp Wallet Plugin Demo
                    </h2>
                </div>
                {/* Status Message Area */}
                {statusMessage && (
                    <div style={{
                        marginBottom: '20px',
                        padding: '12px',
                        backgroundColor: statusMessage.includes('✗') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: statusMessage.includes('✗') ? '#ef4444' : '#10b981',
                        textAlign: 'center',
                        border: `1px solid ${statusMessage.includes('✗') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                    }}>
                        {statusMessage}
                    </div>
                )}

                {!isConnected ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <label className="label-text" style={{ color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                                Enter your email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="text-input"
                                style={{ padding: '12px', height: 'auto', width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={handleQrConnect}
                                disabled={isLoading}
                                className="gradient-button"
                            >
                                {isLoading ? 'Processing...' : 'Connect Wallet'}
                            </button>

                            <button
                                onClick={handleEmailLogin}
                                disabled={isLoading}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                Login with Dropp Email
                            </button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                                <strong>Status:</strong> {statusMessage || 'Idle'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚡</div>
                        <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#10b981' }}>Success!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px' }}>
                            Your wallet is linked: <br />
                            <code style={{
                                display: 'block',
                                marginTop: '12px',
                                background: 'rgba(0,0,0,0.3)',
                                padding: '12px',
                                borderRadius: '8px',
                                color: '#a855f7',
                                fontWeight: '600'
                            }}>
                                {walletId}
                            </code>
                        </p>

                        <button
                            onClick={disconnectWallet}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                padding: '12px 24px',
                                borderRadius: '10px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                        >
                            Disconnect Wallet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DroppWallet;
