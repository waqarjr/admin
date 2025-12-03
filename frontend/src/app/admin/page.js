'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";


export default function Admin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});   
    
    const formSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if( username.trim() === "" ) newErrors.username = "Username must be required";
        if( password.length < 6 ) newErrors.password = "Password must be at least 6 characters long";

        if(Object.keys(newErrors).length > 0) {
          return setErrors(newErrors);   
        } else {
            setErrors({});
            try{
            const res =  await api.post("/login", { username, password })
            console.log(res.data);
            if(res.data.success){
                setPassword("");
                setUsername("");
                router.push('/admin/dashboard')
            }
            }catch (err){
                console.log(err.name);
            }
            
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="shadow-2xl bg-white rounded-xl max-w-md w-full mx-4 p-8">
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-6">
                        <p className="text-3xl font-bold text-gray-800">Sign up</p>
                    </div>
                    
                    <form onSubmit={formSubmit} className="w-full flex flex-col gap-5">
                        <div className="w-full flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <input className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                                value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter username" />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <input className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                        </div>
                        
                        <button className="btn-primary btn-primary:active text-white font-semibold py-2.5 rounded-lg transition duration-200 w-full mt-2"
                       type="submit" >Sign up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}