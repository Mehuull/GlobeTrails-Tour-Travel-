import axios from 'axios'
import { CheckCircle, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import './AuthPages.css'

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigate = useNavigate()

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/forgot-password`, {
                email
            });
            if (res.data.success) {
                navigate(`/verify-otp/${email}`)
                toast.success(res.data.message)
                setEmail("")
            }
        } catch (error) {
            console.log(error);
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='auth-wrapper'>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h1 className='auth-title'>Forgot Password</h1>
                    <p className='auth-subtitle'>
                        {isSubmitted
                            ? "Check your email for reset instructions"
                            : "Enter your email address to receive a password reset link"}
                    </p>
                </div>

                {error && <div className="auth-alert error">{error}</div>}

                {isSubmitted ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#dcfce7', borderRadius: '50%', padding: '15px', color: '#15803d' }}>
                            <CheckCircle size={40} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Check your inbox</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p style={{ fontSize: '0.85rem' }}>
                                If you don't see the email, check your spam folder or{" "}
                                <button
                                    className='auth-link'
                                    style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
                                    onClick={() => setIsSubmitted(false)}>
                                    try again
                                </button>
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleForgotPassword} className='auth-form'>
                        <div className='form-group'>
                            <label className="form-label">Email</label>
                            <input
                                type='email'
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className='spinner' size={20} />
                                    Sending...
                                </>
                            ) : ("Send reset link")}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
                    Remember your password?{" "}
                    <Link to={'/signin'} className='auth-link'>Sign in</Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
