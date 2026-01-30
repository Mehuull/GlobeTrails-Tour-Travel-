import { getData } from '@/context/userContext'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthPages.css'

const AuthSuccess = () => {
    const { setUser } = getData()
    const navigate = useNavigate()
    useEffect(() => {

        const handleAuth = async () => {
            const params = new URLSearchParams(window.location.search)
            console.log(params);
            const accessToken = params.get("token")
            // console.log("Token", accessToken);

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken)
                try {
                    const res = await axios.get("http://localhost:8000/auth/me", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                    if (res.data.success) {
                        setUser(res.data.user)  //save user in context api store

                        if (res.data.user.role === "Admin") {
                            navigate("/adminpanel")
                        } else {
                            navigate("/")
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user:", error)
                }
            }
        }
        handleAuth()
    }, [navigate])
    return (
        <div className='auth-wrapper'>
            <div className='auth-card'>
                <h2 className='auth-title'>Logging in...</h2>
                <div className='spinner' style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #2f5c53', borderRadius: '50%', margin: '20px auto' }}></div>
            </div>
        </div>
    )
}

export default AuthSuccess
