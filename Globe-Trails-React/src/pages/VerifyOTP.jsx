import axios from 'axios'
import { CheckCircle, Loader2, RotateCcw } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './AuthPages.css'

const VerifyOTP = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef([])
  const { email } = useParams()
  const navigate = useNavigate()


  const handleChange = (index, value) => {
    if (value.length > 1) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const finalOtp = otp.join("")
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`http://localhost:8000/user/verify-otp/${email}`, {
        otp: finalOtp,
      })
      setSuccessMessage(res.data.message)
      setTimeout(() => {
        navigate(`/change-password/${email}`)
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <div className="auth-header">
          <h1 className='auth-title'>Verify your email</h1>
          <p className='auth-subtitle'>
            We've sent a 6-digit verification code to<br />
            <strong>{email}</strong>
          </p>
        </div>

        {error && <div className='auth-alert error'>{error}</div>}
        {successMessage && <div className='auth-alert success'>{successMessage}</div>}

        {isVerified ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
            <div style={{ background: '#dcfce7', borderRadius: '50%', padding: '15px', color: '#15803d' }}>
              <CheckCircle size={40} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Verification successful</h3>
              <p style={{ color: '#666' }}>Redirecting to reset password...</p>
            </div>
            <Loader2 className='spinner' />
          </div>
        ) : (
          <div className='auth-form'>
            <div className='otp-container'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="otp-input"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading || otp.some((digit) => digit === "")}
              className='auth-btn'
            >
              {isLoading ? <><Loader2 className='spinner' size={20} /> Verifying...</> : "Verify Code"}
            </button>

            <button
              onClick={clearOtp}
              className='auth-btn outline'
              disabled={isLoading || isVerified}
            >
              <RotateCcw size={16} style={{ marginRight: '8px' }} />
              Clear
            </button>

            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
              Wrong email? <Link to={'/forgot-password'} className='auth-link'>Go back</Link>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
              For testing purposes, use code: <strong>123456</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyOTP
