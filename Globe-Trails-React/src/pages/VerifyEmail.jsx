import React from 'react'
import './AuthPages.css'

const VerifyEmail = () => {
  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <div className="auth-header" style={{ marginBottom: '1rem' }}>
          <h2 className='auth-title'>✅ Check Your Email</h2>
          <p className='auth-subtitle'>
            We've sent you an email to verify your account. Please check your inbox and click the verification link.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
