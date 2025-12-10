'use client'
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 31.488189754248967, lng: 74.37977575144312 };

const Page = () => { 
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
    
    const { isLoaded, loadError } = useLoadScript({googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY});
    
    const fetchData = async (id) => {
        try {   
            const getData = await api.get(`/files/${id}`);
            const fileData = getData.data.data;
            setData(fileData);
            
            setPreview(fileData.file);               
            setSelectedLocation({lat: fileData.latitude, lng: fileData.longitude});
            
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    useEffect(() => {
        fetchData(id);
    }, [id])

    const onMapClick = useCallback((event) => {
        const newLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        setSelectedLocation(newLocation);
    }, []);

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
                const dataToSend = {
                    ...values,
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng
                };

                const response = await api.put(`/files/${id}`, dataToSend);
                setData(response.data.data);                
            } catch (error) {
                console.log(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        }
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue("file", file);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    }

    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex gap-4 w-full max-w-6xl">
                {/* Form Section */}
                <form onSubmit={formik.handleSubmit} 
                    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-6 border border-gray-100"
                >
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800">Edit Item</h2>
                        <p className="text-gray-500 text-sm">Update the details below</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Name</label>
                        <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} 
                        className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 bg-gray-50 hover:bg-white" placeholder="Enter item name" />
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
                       {loading ? <span className="w-6 h-6 border-4 border-t-white border-gray-300 rounded-full animate-spin"></span> : "Update"}
                    </button>
                </form>

                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
                    <div className="border rounded-lg overflow-hidden h-full flex flex-col">
                        <div className="flex-1 min-h-[500px]">
                            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={selectedLocation} onClick={onMapClick}>
                                <Marker position={selectedLocation} />
                            </GoogleMap> 
                        </div>
                        <div className="p-2 flex items-center justify-between bg-white border-t">
                            <p className="font-mono text-sm mt-1">Latitude: {selectedLocation.lat.toFixed(6)}</p>
                            <p className="font-mono text-sm">Longitude: {selectedLocation.lng.toFixed(6)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;