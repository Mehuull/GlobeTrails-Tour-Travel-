import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const INCLUSIONS_OPTIONS = [
    "Pickup & Drop from Airport / Railway Station",
    "Accommodation in Hotel",
    "Daily Breakfast",
    "Sightseeing as per itinerary",
    "All Transfers by Private Vehicle",
    "Driver Allowance, Toll & Parking",
    "All Applicable Taxes"
];

const EXCLUSIONS_OPTIONS = [
    "Airfare",
    "Train Fare",
    "Personal Expenses",
    "Travel Insurance",
    "Entry Fees to Monuments",
    "Adventure Activities Charges",
    "Anything not mentioned in Inclusions"
];

const CATEGORIES_OPTIONS = [
    "Adventure Tour",
    "Wildlife Tour",
    "Beach Tour",
    "Heritage Tour",
    "Hill Station Tour",
    "Pilgrimage Tour",
    "Honeymoon Tour",
    "Family Tours",
    "Eco / Nature Tour"
];

const AddTour = ({ editingTour, setEditingTour, setActiveTab }) => {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        duration: { days: 0, nights: 0 },
        pricePerPerson: 0,
        maxGroupSize: 0,
        itinerary: [
            { dayNumber: 1, title: "", locationsCovered: [], description: "", overnightStay: "" }
        ],
        inclusions: [],
        exclusions: [],
        images: []
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {
        if (editingTour) {
            setFormData({
                ...editingTour,
                images: editingTour.images || [], // Ensure array
            });
            // If editing, we show existing images. 
            // Handling mixed edit (delete existing + add new) is complex.
            // For now, let's just allow adding NEW images to the list or editing text fields.
        }
    }, [editingTour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleItineraryChange = (index, field, value) => {
        const updatedItinerary = [...formData.itinerary];
        if (field === 'locationsCovered') {
            // Keep as array
            updatedItinerary[index][field] = value.split(',').map(s => s.trim());
        } else {
            updatedItinerary[index][field] = value;
        }
        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
    };

    const addDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [
                ...prev.itinerary,
                { dayNumber: prev.itinerary.length + 1, title: "", locationsCovered: [], description: "", overnightStay: "" }
            ]
        }));
    };

    const removeDay = (index) => {
        const updatedItinerary = formData.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 }));
        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
    };

    const toggleCheckbox = (type, item) => {
        setFormData(prev => {
            const list = prev[type];
            if (list.includes(item)) {
                return { ...prev, [type]: list.filter(i => i !== item) };
            } else {
                return { ...prev, [type]: [...list, item] };
            }
        });
    };

    // File Selection Handler
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        // Revoke URL to avoid mem leak
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use FormData for file upload
            const data = new FormData();

            // Append simple fields
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('pricePerPerson', formData.pricePerPerson);
            data.append('maxGroupSize', formData.maxGroupSize);

            // Append complex objects as JSON strings
            data.append('duration', JSON.stringify(formData.duration));
            data.append('itinerary', JSON.stringify(formData.itinerary));
            data.append('inclusions', JSON.stringify(formData.inclusions));
            data.append('exclusions', JSON.stringify(formData.exclusions));

            // Append existing images (if any remain)
            // (Assuming backend handles "images" field for existing URLs)
            if (formData.images.length > 0) {
                // Join them or send as JSON. Backend expects comma separated string in my simplified logic above?
                // Wait, backend logic: `if (typeof tourData.images === 'string') start split...`
                // Let's send as JSON string or comma separated
                data.append('images', formData.images.join(','));
            }

            // Append new files
            selectedFiles.forEach(file => {
                data.append('images', file);
            });

            // Note: 'images' key is used for BOTH existing URLs (string) and new Files (binary). 
            // Multer will catch the files. Req.body.images will catch the string. 
            // Express handles this mix well usually.

            if (editingTour) {
                await axios.put(`${import.meta.env.VITE_API_URL}/tours/${editingTour._id}`, data);
                toast.success("Tour updated successfully");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/tours`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Tour created successfully");
            }
            setEditingTour(null);
            setActiveTab('tours');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Operation failed");
            console.log(error.response?.data?.message);
        }
    };

    return (
        <div className="form-container">
            <div className="content-header">
                <h2 className="page-title">{editingTour ? "Edit Tour" : "Add New Tour"}</h2>
                <button className="btn-primary" style={{ backgroundColor: '#95a5a6' }} onClick={() => setActiveTab('tours')}>Cancel</button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <h3 className="form-label" style={{ fontSize: '18px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Basic Information</h3>
                <div className="form-group">
                    <label className="form-label">Tour Title</label>
                    <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select name="category" className="form-input" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {CATEGORIES_OPTIONS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-textarea" rows="4" value={formData.description} onChange={handleChange} required></textarea>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Days</label>
                        <input type="number" name="duration.days" className="form-input" value={formData.duration.days} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Nights</label>
                        <input type="number" name="duration.nights" className="form-input" value={formData.duration.nights} onChange={handleChange} required />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Price Per Person (₹)</label>
                        <input type="number" name="pricePerPerson" className="form-input" value={formData.pricePerPerson} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Max Group Size</label>
                        <input type="number" name="maxGroupSize" className="form-input" value={formData.maxGroupSize} onChange={handleChange} required />
                    </div>
                </div>

                {/* Images Upload - Drag & Drop Style */}
                <div className="form-group">
                    <label className="form-label">Tour Images</label>
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files);
                            setSelectedFiles(prev => [...prev, ...files]);
                            const newPreviews = files.map(file => URL.createObjectURL(file));
                            setPreviewUrls(prev => [...prev, ...newPreviews]);
                        }}
                        style={{
                            border: '2px dashed #ddd',
                            borderRadius: '8px',
                            padding: '30px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: '#fafafa'
                        }} onClick={() => document.getElementById('fileInput').click()}>
                        <Plus size={40} style={{ color: '#ccc', marginBottom: '10px' }} />
                        <p style={{ color: '#777' }}>Click to upload or drag & drop images here</p>
                        <input
                            id="fileInput"
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>

                    {/* Previews */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                        {/* Show existing images */}
                        {formData.images.map((url, idx) => (
                            <img key={`existing-${idx}`} src={url} alt="exist" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', opacity: 0.7 }} title="Existing" />
                        ))}

                        {previewUrls.map((url, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                <img src={url} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                <button
                                    type="button"
                                    onClick={() => removeSelectedFile(idx)}
                                    style={{
                                        position: 'absolute', top: -5, right: -5,
                                        background: 'red', color: 'white',
                                        borderRadius: '50%', border: 'none',
                                        width: '20px', height: '20px',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Itinerary */}
                <h3 className="form-label" style={{ fontSize: '18px', borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '30px' }}>Itinerary</h3>
                {formData.itinerary.map((day, index) => (
                    <div key={index} className="itinerary-day">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h4 style={{ margin: 0 }}>Day {day.dayNumber}</h4>
                            {index > 0 && <button type="button" onClick={() => removeDay(index)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={day.title}
                                onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                placeholder="e.g. Arrival & Transfer"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Locations Covered (Comma separated)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={Array.isArray(day.locationsCovered) ? day.locationsCovered.join(', ') : day.locationsCovered}
                                onChange={(e) => handleItineraryChange(index, 'locationsCovered', e.target.value)} // Pass RAW value to helper, helper splits it
                                placeholder="e.g. Delhi, Shimla"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                rows="2"
                                value={day.description}
                                onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Overnight Stay</label>
                            <input
                                type="text"
                                className="form-input"
                                value={day.overnightStay}
                                onChange={(e) => handleItineraryChange(index, 'overnightStay', e.target.value)}
                                placeholder="e.g. Hotel Shivalik, Shimla"
                            />
                        </div>
                    </div>
                ))}

                <button type="button" onClick={addDay} className="btn-primary" style={{ width: '100%', marginBottom: '30px', backgroundColor: '#34495e' }}>
                    <Plus size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Add Another Day
                </button>

                {/* Inclusions */}
                <h3 className="form-label" style={{ fontSize: '18px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Inclusions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                    {INCLUSIONS_OPTIONS.map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.inclusions.includes(opt)}
                                onChange={() => toggleCheckbox('inclusions', opt)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>

                {/* Exclusions */}
                <h3 className="form-label" style={{ fontSize: '18px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Exclusions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                    {EXCLUSIONS_OPTIONS.map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.exclusions.includes(opt)}
                                onChange={() => toggleCheckbox('exclusions', opt)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>

                <button type="submit" className="btn-primary btn-success" style={{ width: '100%', padding: '15px', fontSize: '18px' }}>
                    {editingTour ? "Update Tour" : "Create Tour"}
                </button>

            </form>
        </div>
    );
};

export default AddTour;
