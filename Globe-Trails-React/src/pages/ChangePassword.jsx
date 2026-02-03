import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './AuthPages.css'

const ChangePassword = () => {
    const { email } = useParams()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const handleChangePassword = async () => {
        setError("")
        setSuccess("")

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/change-password/${email}`, {
                newPassword,
                confirmPassword
            })

            setSuccess(res.data.message)
            setTimeout(() => {
                navigate('/signin') // Fixed redirect to signin
            }, 2000)
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='auth-wrapper'>
            <div className='auth-card'>
                <div className="auth-header">
                    <h2 className='auth-title'>Change Password</h2>
                    <p className='auth-subtitle'>
                        Set a new password for <strong>{email}</strong>
                    </p>
                </div>

                {error && <div className='auth-alert error'>{error}</div>}
                {success && <div className='auth-alert success'>{success}</div>}

                <div className='auth-form'>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="auth-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="auth-input"
                        />
                    </div>
                    <button
                        className='auth-btn'
                        disabled={isLoading}
                        onClick={handleChangePassword}
                    >
                        {isLoading ? <><Loader2 className='spinner' size={20} /> Changing...</> : "Change Password"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
