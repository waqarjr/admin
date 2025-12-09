'use client';
import api from "@/lib/api";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

    const router = useRouter();
    const [loading , setLoading] = useState(true);
    const [showMessage , setShowMessage] = useState('');
    const [popup , setPopup] = useState(false);
    
    const verified = async (token)=>{
        try { setLoading(true);
            const res = await api.post("/checking",{},{headers:{  "Authorization": `Bearer ${token}`}});
            console.log(res.data); 
            setShowMessage(res.data); 
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
        {showMessage && <p className="text-red-500 text-xs mt-1 mx-auto">{showMessage.message},{showMessage.data}</p>}
        <button className="btn-primary" onClick={logout} >Logout</button>
        <button className="btn-primary" onClick={()=>setPopup(true)} >popup</button>

        {popup && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setPopup(false)} >
            <div className="bg-white p-4 rounded-lg" >
                <p>Are you sure you want to logout?</p>
                <button className="btn-primary" onClick={logout} >Logout</button>
                <button className="btn-primary" onClick={()=>setPopup(false)} >Cancel</button>
            </div>
        </div>}
    </div>;
}