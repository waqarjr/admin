'use client';
import api from "@/lib/api";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

    const router = useRouter();
    const [loading , setLoading] = useState(true);


    const verified = async (token)=>{
        try {
            setLoading(true);
            const res = await api.post("/checking",{},{headers:{  "Authorization": `Bearer ${token}`}});
            console.log(res.data);  
            if(!res.data.success) {
                router.push('/admin');
            }
        }
        catch (error) {
            console.log(error.response.data);
            router.push('/admin');
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token) return  router.push('/admin');
        
        verified(token);

    },[])

    const logout  = async ()=>{
        try {
            const res = await api.post("/logout");
            console.log(res.data.success);
            if(res.data.success) {
                localStorage.removeItem("token");
                router.push('/admin');
            }
        }
        catch (error) {
            console.log(error.response.data);
            router.push('/admin');
        }
    }

    if(loading) return <div className="flex h-screen items-center justify-center" >
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" ></div>
    </div>;

    return <div>
        Admin Dashboard

        <button className="btn-primary" onClick={logout} >Logout</button>
    </div>;
}