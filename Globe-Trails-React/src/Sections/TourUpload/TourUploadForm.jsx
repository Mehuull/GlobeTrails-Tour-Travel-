import React, { useState } from "react";
import "./TourUploadForm.css";
import { getData } from "../../context/userContext";

const TourUploadForm = () => {
  const { user } = getData();
  const creatorId = user?._id || "";
  const [tourType, setTourType] = useState("single");
  const [formData, setFormData] = useState({
    creator: creatorId || "",
    tourName: "",
    category: "",
    duration: 1,
    price: 0,
    description: "",
    // Single tour fields
    destination: "",
    maxParticipants: "",
    highlights: "",
    // Package fields
    destinations: "",
    packageType: "",
    inclusions: "",
    exclusions: "",
  });
  const [itinerary, setItinerary] = useState([
    { day: 1, title: "", activities: "" },
  ]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    "adventure",
    "cultural",
    "relaxation",
    "wildlife",
    "luxury",
    "budget",
  ];

  const packageTypes = [
    "family",
    "honeymoon",
    "group",
    "solo",
    "business",
    "luxury",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const addItineraryDay = () => {
    setItinerary((prev) => [
      ...prev,
      { day: prev.length + 1, title: "", activities: "" },
    ]);
  };

  const removeItineraryDay = (index) => {
    if (itinerary.length > 1) {
      const newItinerary = itinerary.filter((_, i) => i !== index);
      setItinerary(newItinerary.map((day, i) => ({ ...day, day: i + 1 })));
    }
  };

  const updateItineraryDay = (index, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setItinerary(newItinerary);
  };

  const handleFileUpload = (type, files) => {
    if (type === "images") {
      setUploadedImages((prev) => [...prev, ...files]);
    } else {
      setUploadedDocuments((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (type, index) => {
    if (type === "images") {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setUploadedDocuments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tourName.trim()) newErrors.tourName = "Tour name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.duration < 1)
      newErrors.duration = "Duration must be at least 1 day";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (tourType === "single") {
      if (!formData.destination.trim())
        newErrors.destination = "Destination is required for single tours";
    }

    if (tourType === "package") {
      if (!formData.destinations.trim())
        newErrors.destinations = "Destinations are required for packages";
      if (!formData.packageType)
        newErrors.packageType = "Package type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // if (!validateForm()) {
  //   //   return;
  //   // }

  //   console.log("formdata:",formData);

  //   // Simulate form submission
  //   console.log("Tour Data:", {
  //     ...formData,
  //     tourType,
  //     itinerary: tourType === "package" ? itinerary : undefined,
  //     images: uploadedImages.map((file) => file.name),
  //     documents: uploadedDocuments.map((file) => file.name),
  //   });
  //      // ✅ Send everything in one request
  //     const response = await fetch(
  //       "http://localhost:5000/api/tours/create",
  //       {
  //         method: "POST",
  //         body: formData, // ✅ Send as FormData
  //       }
  //     );

  //     const result = await response.json();
  //     console.log(result);

  //   setShowSuccess(true);
  //   // handleReset();
  //   setTimeout(() => setShowSuccess(false), 5000);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullFormData = new FormData();

    // ✅ Append each key-value pair from formData manually
    Object.entries(formData).forEach(([key, value]) => {
      fullFormData.append(key, value);
    });

    // ✅ Append tourType
    fullFormData.append("tourType", tourType);

    // ✅ Only append itinerary if tourType is 'package'
    if (tourType === "package") {
      fullFormData.append("itinerary", itinerary);
    }

    // ✅ Append images
    uploadedImages.forEach((file) => {
      fullFormData.append("images", file);
    });

    // ✅ Append documents
    uploadedDocuments.forEach((file) => {
      fullFormData.append("documents", file);
    });

    // ✅ Log all FormData entries for debugging
    for (let pair of fullFormData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    try {
      const response = await fetch("http://localhost:5000/api/tours/create", {
        method: "POST",
        body: fullFormData,
      });

      const result = await response.json();
      console.log("Response:", result);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleReset = () => {
    setFormData({
      tourName: "",
      category: "",
      duration: 1,
      price: 0,
      description: "",
      destination: "",
      maxParticipants: "",
      highlights: "",
      destinations: "",
      packageType: "",
      inclusions: "",
      exclusions: "",
    });
    setItinerary([{ day: 1, title: "", activities: "" }]);
    setUploadedImages([]);
    setUploadedDocuments([]);
    setErrors({});
  };

  return (
    <div className="tour-upload-container">
      <div className="tour-upload-wrapper">
        {/* Header */}
        <div className="header">
          <h1 className="header-title">
            {/* <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="download"
              className="header-icon"
            >
              <path
                fill="#75afff"
                d="m22,15v3c0,1.105-.895,2-2,2h-12c-1.105,0-2-.895-2-2v-3h16Z"
              ></path>
              <path
                fill="#112d55"
                d="m8.47,12.53c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l1.72,1.72V4c0-.414.336-.75.75-.75s.75.336.75.75v9.189l1.72-1.72c.293-.293.768-.293,1.061,0s.293.768,0,1.061l-3,3c-.146.146-.338.22-.53.22s-.384-.073-.53-.22l-3-3Zm11.53,1.72c-.414,0-.75.336-.75.75v3c0,.689-.561,1.25-1.25,1.25H6c-.689,0-1.25-.561-1.25-1.25v-3c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3c0,1.517,1.233,2.75,2.75,2.75h12c1.517,0,2.75-1.233,2.75-2.75v-3c0-.414-.336-.75-.75-.75Z"
              ></path>
            </svg>
            Admin Tour Management
          </h1>
          <p className="header-subtitle">
            Create and manage tour packages for your travel website
          </p>
        </div>

        {/* Form Container */}
        <div className="form-card">
          {/* Form Header */}
          <div className="form-header">
            <h2 className="form-title">
              <svg
                className="form-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Upload New Tour
            </h2>
            <p className="form-subtitle">
              Fill in the details below to create a new tour or tour package
            </p>
          </div>

          <div className="form-content">
            {/* Success Message */}
            {showSuccess && (
              <div className="success-message">
                <svg
                  className="success-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
                <span>Tour uploaded successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="tour-form">
              {/* Tour Type Selection */}
              <div className="form-section">
                <div className="section-header">
                  <svg
                    className="section-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <h3>Tour Type Selection</h3>
                </div>

                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="single"
                      name="tourType"
                      value="single"
                      checked={tourType === "single"}
                      onChange={(e) => setTourType(e.target.value)}
                    />
                    <label htmlFor="single">
                      <div className="radio-title">Single Tour</div>
                      <div className="radio-description">
                        Individual tour with one destination
                      </div>
                    </label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id="package"
                      name="tourType"
                      value="package"
                      checked={tourType === "package"}
                      onChange={(e) => setTourType(e.target.value)}
                    />
                    <label htmlFor="package">
                      <div className="radio-title">Tour Package</div>
                      <div className="radio-description">
                        Multi-destination package with itinerary
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <div className="section-header">
                  <svg
                    className="section-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                  <h3>Basic Information</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="tourName">
                      Tour Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="tourName"
                      placeholder="e.g., Bali Adventure Tour"
                      value={formData.tourName}
                      onChange={(e) =>
                        handleInputChange("tourName", e.target.value)
                      }
                      className={errors.tourName ? "error" : ""}
                    />
                    {errors.tourName && (
                      <span className="error-text">{errors.tourName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className={errors.category ? "error" : ""}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span className="error-text">{errors.category}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">
                      Duration (Days) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="duration"
                      min="1"
                      placeholder="e.g., 7"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange(
                          "duration",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className={errors.duration ? "error" : ""}
                    />
                    {errors.duration && (
                      <span className="error-text">{errors.duration}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">
                      Price (USD) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 1299"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={errors.price ? "error" : ""}
                    />
                    {errors.price && (
                      <span className="error-text">{errors.price}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">
                      Description <span className="required">*</span>
                    </label>
                    <textarea
                      id="description"
                      placeholder="Describe your tour in detail..."
                      rows="5"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className={errors.description ? "error" : ""}
                    />
                    {errors.description && (
                      <span className="error-text">{errors.description}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Single Tour Fields */}
              {tourType === "single" && (
                <div className="form-section">
                  <div className="section-header">
                    <svg
                      className="section-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <h3>Single Tour Details</h3>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="destination">
                        Destination <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="destination"
                        placeholder="e.g., Ubud, Bali"
                        value={formData.destination}
                        onChange={(e) =>
                          handleInputChange("destination", e.target.value)
                        }
                        className={errors.destination ? "error" : ""}
                      />
                      {errors.destination && (
                        <span className="error-text">{errors.destination}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="maxParticipants">Max Participants</label>
                      <input
                        type="number"
                        id="maxParticipants"
                        min="1"
                        placeholder="e.g., 15"
                        value={formData.maxParticipants}
                        onChange={(e) =>
                          handleInputChange("maxParticipants", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="highlights">Tour Highlights</label>
                      <textarea
                        id="highlights"
                        placeholder="List the main attractions and activities..."
                        rows="5"
                        value={formData.highlights}
                        onChange={(e) =>
                          handleInputChange("highlights", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Package Fields */}
              {tourType === "package" && (
                <>
                  <div className="form-section">
                    <div className="section-header">
                      <svg
                        className="section-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <h3>Package Details</h3>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="destinations">
                          Destinations <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="destinations"
                          placeholder="e.g., Bangkok, Phuket, Krabi"
                          value={formData.destinations}
                          onChange={(e) =>
                            handleInputChange("destinations", e.target.value)
                          }
                          className={errors.destinations ? "error" : ""}
                        />
                        {errors.destinations && (
                          <span className="error-text">
                            {errors.destinations}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="packageType">
                          Package Type <span className="required">*</span>
                        </label>
                        <select
                          id="packageType"
                          value={formData.packageType}
                          onChange={(e) =>
                            handleInputChange("packageType", e.target.value)
                          }
                          className={errors.packageType ? "error" : ""}
                        >
                          <option value="">Select package type</option>
                          {packageTypes.map((type) => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                        {errors.packageType && (
                          <span className="error-text">
                            {errors.packageType}
                          </span>
                        )}
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="inclusions">Inclusions</label>
                        <textarea
                          id="inclusions"
                          placeholder="What's included in the package..."
                          rows="4"
                          value={formData.inclusions}
                          onChange={(e) =>
                            handleInputChange("inclusions", e.target.value)
                          }
                        />
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="exclusions">Exclusions</label>
                        <textarea
                          id="exclusions"
                          placeholder="What's not included..."
                          rows="4"
                          value={formData.exclusions}
                          onChange={(e) =>
                            handleInputChange("exclusions", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Itinerary Builder */}
                  <div className="form-section">
                    <div className="section-header">
                      <svg
                        className="section-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <h3>Itinerary Builder</h3>
                    </div>

                    <div className="itinerary-container">
                      {itinerary.map((day, index) => (
                        <div key={index} className="itinerary-day">
                          <div className="day-header">
                            <h4>Day {day.day}</h4>
                            {itinerary.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItineraryDay(index)}
                                className="remove-day-btn"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <polyline points="3,6 5,6 21,6" />
                                  <path d="M19,6V20a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6" />
                                  <path d="M8,6V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2V6" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="day-content">
                            <div className="form-group">
                              <label>Day Title</label>
                              <input
                                type="text"
                                placeholder="e.g., Arrival in Bangkok"
                                value={day.title}
                                onChange={(e) =>
                                  updateItineraryDay(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Activities</label>
                              <textarea
                                placeholder="Describe the day's activities..."
                                rows="3"
                                value={day.activities}
                                onChange={(e) =>
                                  updateItineraryDay(
                                    index,
                                    "activities",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addItineraryDay}
                        className="add-day-btn"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Another Day
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* File Upload Section */}
              <div className="form-section">
                <div className="section-header">
                  <svg
                    className="section-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21,15 16,10 5,21" />
                  </svg>
                  <h3>Media Upload</h3>
                </div>

                <div className="upload-grid">
                  <div className="upload-section">
                    <h4>Tour Images</h4>
                    <div className="file-upload-zone">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload("images", Array.from(e.target.files))
                        }
                        className="file-input"
                        id="images"
                      />
                      <label htmlFor="images" className="file-upload-label">
                        <svg
                          className="upload-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21,15 16,10 5,21" />
                        </svg>
                        <div className="upload-text">
                          <span>Click to upload images</span>
                          <span className="upload-hint">or drag and drop</span>
                        </div>
                      </label>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="uploaded-files">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="uploaded-file">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile("images", index)}
                              className="remove-file-btn"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="upload-section">
                    <h4>Documents</h4>
                    <div className="file-upload-zone">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          handleFileUpload(
                            "documents",
                            Array.from(e.target.files)
                          )
                        }
                        className="file-input"
                        id="documents"
                      />
                      <label htmlFor="documents" className="file-upload-label">
                        <svg
                          className="upload-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                        <div className="upload-text">
                          <span>Click to upload documents</span>
                          <span className="upload-hint">PDF, DOC, DOCX</span>
                        </div>
                      </label>
                    </div>
                    {uploadedDocuments.length > 0 && (
                      <div className="uploaded-files">
                        {uploadedDocuments.map((file, index) => (
                          <div key={index} className="uploaded-file">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile("documents", index)}
                              className="remove-file-btn"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  // onClick={handleReset}
                  className="btn-secondary"
                >
                  <svg
                    className="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <svg
                    className="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17,21 17,13 7,13 7,21" />
                    <polyline points="7,3 7,8 15,8" />
                  </svg>
                  Upload Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourUploadForm;
