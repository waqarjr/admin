'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import api from '@/lib/api';

export default function DataTable() {
  const router = useRouter();

  const [data, setData] = useState([]);

  const fetchData = async ()=>{
    try{
    const newData = await api.get("/files");
    if(newData.data.success )
      setData(newData.data.data); 
    }catch(error){
      console.log(error)
    } 
  }

  useEffect(()=>{
    fetchData();
  },[])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Data Management</h1>
          <button  onClick={()=>router.push("/admin/files/create")}  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Create New
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Image</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">{item.name}</td>
                  <td className="py-4 px-6 text-gray-600">{item.description}</td>
                  <td className="py-4 px-6">
                    <img  src={item.file} alt={item.name} className="w-16 h-16 object-cover rounded"/>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/admin/files/${item._id}`)} title="Edit" 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" >Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {data.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No data available</p>
              <p className="text-sm mt-2">Click "Create New" to add your first item</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}