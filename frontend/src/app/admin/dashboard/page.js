'use client';

import api from "@/lib/api";

export default function AdminDashboard() {

    const logout  = async ()=>{
        try {

        const res = await api.post("/logout");
        if(res.data.success) {
            alert("Logout successfully");
        }
        }
        catch (error) {
            console.log(error);
        }
    }

    return <div>
        Admin Dashboard

        <button className="btn-primary" onClick={logout} >Logout</button>
    </div>;
}