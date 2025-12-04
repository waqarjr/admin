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
            console.log(error.name);
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
            if(res.data.success) {
                localStorage.removeItem("token");
                router.push('/admin');
            }
        }
        catch (error) {
            console.log(error.name);
        }
    }

    if(loading) return <div>Loading...</div>;

    return <div>
        Admin Dashboard

        <button className="btn-primary" onClick={logout} >Logout</button>
    </div>;
}