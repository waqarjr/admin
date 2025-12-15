'use client'
import { useFormik } from "formik"
import * as Yup from "yup"
import api from "@/lib/api"
import { useState, useEffect, useRef } from "react"
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const defaultCenter = { lat: 31.488189754248967, lng: 74.37977575144312 };

export const Page = () => {
    
    const [loading, setLoading] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);

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

    const intiMap = async () => {
        const { PlaceAutocompleteElement } = await google.maps.importLibrary('places');
        
        if (autocompleteRef.current && !autocompleteRef.current.hasChildNodes()) {
            const placeAutocomplete = new PlaceAutocompleteElement();
            autocompleteRef.current.appendChild(placeAutocomplete);

            placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
                const place = placePrediction.toPlace();
                const data = await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
                setSelectedLocation(data.place.Wh.location)
            });
        }
    };

    useEffect(() => {
        const initAutocomplete = async () => {
            try {
                intiMap();
            } catch (error) {
                console.error('Error initializing autocomplete:', error);
            }
        };

        const timer = setTimeout(initAutocomplete, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
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
                        {formik.errors.name && formik.touched.name && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Description</label>
                        <textarea name="description" value={formik.values.description} onChange={formik.handleChange} rows="3" className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 resize-none bg-gray-50 hover:bg-white" placeholder="Enter item description" />
                        {formik.errors.description && formik.touched.description && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Upload File</label>
                        <input type="file" name="file" onChange={(e) => formik.setFieldValue("file", e.target.files[0])} className="w-full border border-gray-300 px-4 py-3 rounded-xl bg-gray-50 hover:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        {formik.errors.file && formik.touched.file && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.file}</p>
                        )}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {loading ? (
                            <span className="w-5 h-5 border-3 border-t-white border-gray-300 rounded-full animate-spin"></span>
                        ) : "Submit"}
                    </button>
                </form>

                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
                    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
                        <div className="border rounded-lg overflow-hidden h-full flex flex-col">
                            <div className="p-4 bg-white border-b">
                                <div ref={autocompleteRef} className="w-full"></div>
                            </div>
                            
                            <div className="flex-1 min-h-[500px]">
                                <Map style={{ width: '100%', height: '100%' }} center={selectedLocation} defaultZoom={15} onClick={(e) => setSelectedLocation(e.detail.latLng)} mapId='a6915df86e63079af52318e6' ref={mapRef}>
                                    <AdvancedMarker position={selectedLocation} />
                                </Map>
                            </div>
                            
                            <div className="p-4 bg-white border-t flex items-center justify-between">
                                <p className="font-mono text-sm mt-1">
                                    Latitude: {selectedLocation.lat.toFixed(6)}
                                </p>
                                <p className="font-mono text-sm">
                                    Longitude: {selectedLocation.lng.toFixed(6)}
                                </p>
                            </div>
                        </div>
                    </APIProvider>
                </div>
            </div>
        </div>
    )
}

export default Page