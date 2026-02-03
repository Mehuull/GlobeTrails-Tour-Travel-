import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './AuthPages.css'

const Verify = () => {
    const { token } = useParams()
    const [status, setStatus] = useState("Verifying...")
    const [isSuccess, setIsSuccess] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/verify`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.data.success) {
                    setStatus("Email Verified Successfully")
                    setIsSuccess(true)
                    setTimeout(() => {
                        navigate('/signin')
                    }, 2000)
                } else {
                    setStatus("Invalid or Expired Token")
                    setIsSuccess(false)
                }
            } catch (error) {
                console.log(error);
                setStatus("Verification Failed. Please try again")
                setIsSuccess(false)
            }
        };

        verifyEmail()
    }, [token, navigate])

    return (
        <div className='auth-wrapper'>
            <div className='auth-card'>
                <div className="auth-header">
                    <h2 className='auth-title'>Email Verification</h2>
                </div>
                <div className={`auth-alert ${isSuccess ? 'success' : 'error'}`} style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                    {isSuccess ? "✅ " : "❌ "} {status}
                </div>
            </div>
        </div>
    )
}

export default Verify
