'use client'
import { useFormik } from "formik"
import * as Yup from "yup"
import api from "@/lib/api"
import { useState, useCallback } from "react"
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '100%'};
const defaultCenter = { lat: 31.488189754248967, lng: 74.37977575144312 };

export const page = () => {
    
    const [loading, setLoading] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(defaultCenter);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    });

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
        file: Yup.mixed().required("File is required").test("fileSize", "File size should be less than 5MB", (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
        })
    })
    
    const initialValues = {
        name: "",
        description: "",
        file: null
    }
    
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, {resetForm}) => {
            try{
                setLoading(true);
                const dataToSend = {
                    ...values,
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng
                }
                const data = await api.post("/files", dataToSend)
                console.log(data)
            }catch(error) {
                console.log(error.response.message)
            }finally{
                resetForm();
                setSelectedLocation(defaultCenter);
                setLoading(false);
            }
        }
    })

    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded) return <div>Loading map...</div>;

    return (<>
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex gap-4 w-full max-w-6xl">
                <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-6 border border-gray-100">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800">Create Item</h2>
                        <p className="text-gray-500 text-sm">Fill in the details below to create a new item</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Name</label>
                        <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 bg-gray-50 hover:bg-white" placeholder="Enter item name" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Description</label>
                        <textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows="3" className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 resize-none bg-gray-50 hover:bg-white" placeholder="Enter item description" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Upload File</label>
                        <input type="file" name="file" onChange={(e) => formik.setFieldValue("file", e.target.files[0])} className="border border-gray-300 px-4 py-3 rounded-xl bg-gray-50 hover:bg-white" />
                    </div>

                    <button type="submit" className="w-full btn-primary">{loading ? (<><span className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></span></>) : "Submit"}</button>
                </form>

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
    </>)
}
export default page