import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (res.data.success) {
                        setUser(res.data.user);
                    }
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    localStorage.removeItem("accessToken");
                }
            }
            setIsLoading(false)
        };
        fetchUser();
    }, []);

    return <UserContext.Provider value={{ user, setUser, isLoading }}>
        {children}
    </UserContext.Provider>
}


export const getData = () => useContext(UserContext)