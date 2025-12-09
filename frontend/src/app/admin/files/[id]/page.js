'use client'
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Page = () => { 
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(''); 
    
    const fetchData = async (id) => {
        try {   
            const getData = await api.get(`/files/${id}`);
            setData(getData.data.data);
            if (getData.data.data.file) {
                setPreview(getData.data.data.file);
            }
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    useEffect(() => {
        fetchData(id);
    }, [id])

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
        file: Yup.mixed().nullable()
            .test("fileSize", "File size should be less than 5MB", (value) => {
                if (!value) return true;
                return value.size <= 5 * 1024 * 1024;
            })
    })

    const initialValues = {
        name: data.name || '',
        description: data.description || '',
        file: null, 
    }
    
    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,

        onSubmit: async (values) => {
            setLoading(true);
            try {

                const response = await api.put(`/files/${id}`, values);
                setData(response.data.data);
                // router.push('/admin/files'); 
                
            } catch (error) {
                console.log(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        }
    })

    // Handle file change and preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue("file", file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={formik.handleSubmit} 
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-6 border border-gray-100"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-800">Edit Item</h2>
                    <p className="text-gray-500 text-sm">Update the details below</p>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Name</label>
                    <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 bg-gray-50 hover:bg-white" placeholder="Enter item name" />
                    {formik.touched.name && formik.errors.name && <p className="text-red-500 text-sm">{formik.errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows="3" className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 resize-none bg-gray-50 hover:bg-white" placeholder="Enter item description" />
                    {formik.touched.description && formik.errors.description && <p className="text-red-500 text-sm">{formik.errors.description}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Upload File</label>
                    <input type="file" name="file" onChange={handleFileChange} accept="image/*" className="w-full border border-gray-300 px-4 py-3 rounded-xl bg-gray-50 hover:bg-white" />
                    {formik.touched.file && formik.errors.file && <p className="text-red-500 text-sm">{formik.errors.file}</p>}
                </div>

                {preview && (
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Preview</label>
                        <img src={preview} alt={formik.values.name || "Preview"} className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                    {loading ? <span className="w-6 h-6 border-4 border-t-white border-gray-300 rounded-full animate-spin"></span>
                     : "Update"}</button>
            </form>
        </div>
    );
}

export default Page;