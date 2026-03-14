// import React from "react";
// import { RiMapPinLine, RiGroupLine, RiCalendar2Line, RiSearchLine } from "react-icons/ri";

// const SearchBar = () => {
//   return (
//     <div className="max-w-5xl mx-auto mt-10 px-4">
//       <div className="bg-white p-4 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

//         {/* Location */}
//         <div className="flex items-center gap-3">
//           <RiMapPinLine className="text-xl text-gray-500" />
//           <div>
//             <label className="text-gray-500 text-sm">Location</label>
//             <input
//               type="text"
//               placeholder="Where are you going?"
//               className="w-full border-none outline-none text-gray-700 placeholder:text-gray-400 text-base"
//             />
//           </div>
//         </div>

//         {/* Distance */}
//         <div className="flex items-center gap-3">
//           <RiMapPinLine className="text-xl text-gray-500" />
//           <div>
//             <label className="text-gray-500 text-sm">Distance</label>
//             <input
//               type="text"
//               placeholder="Distance (e.g. 500km)"
//               className="w-full border-none outline-none text-gray-700 placeholder:text-gray-400 text-base"
//             />
//           </div>
//         </div>

//         {/* Max People */}
//         <div className="flex items-center gap-3">
//           <RiGroupLine className="text-xl text-gray-500" />
//           <div>
//             <label className="text-gray-500 text-sm">Max People</label>
//             <input
//               type="number"
//               placeholder="e.g. 5"
//               className="w-full border-none outline-none text-gray-700 placeholder:text-gray-400 text-base"
//             />
//           </div>
//         </div>

//         {/* Search Button */}
//         <div className="flex justify-center md:justify-end">
//           <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
//             <RiSearchLine className="text-xl" />
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchBar;
import React, { useState, useEffect, useRef } from "react";
import { RiMapPinLine, RiGroupLine, RiSearchLine, RiSuitcaseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

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

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (!location && !category && !maxPeople) {
      navigate('/tours');
      return;
    }

    const queryParams = new URLSearchParams();
    if (location) queryParams.append("location", location);
    if (category) queryParams.append("category", category);
    if (maxPeople) queryParams.append("maxGroupSize", maxPeople);

    navigate(`/tours?${queryParams.toString()}`);
  };

  return (
    <div className="searchbar-wrapper">
      <div className="searchbar-container">

        {/* Location */}
        <div className="searchbar-field">
          <RiMapPinLine className="searchbar-icon" />
          <div>
            <label className="searchbar-label">Location</label>
            <input
              type="text"
              placeholder="Where are you going?"
              className="searchbar-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Category Custom Dropdown */}
        <div className="searchbar-field">
          <RiSuitcaseLine className="searchbar-icon" />
          <div style={{ width: '100%', maxWidth: '180px', position: 'relative' }} ref={dropdownRef}>
            <label className="searchbar-label">Tour Category</label>
            <div className={`searchbar-custom-dropdown ${isDropdownOpen ? 'open' : ''}`}>
              <div 
                className={`searchbar-dropdown-selected ${!category ? 'is-placeholder' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {category || "Select Category"}
                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}></span>
              </div>
              
              {isDropdownOpen && (
                <div className="searchbar-dropdown-menu">
                  <div 
                    className={`searchbar-dropdown-item ${!category ? 'active' : ''}`}
                    onClick={() => { setCategory(""); setIsDropdownOpen(false); }}
                  >
                    Select Category
                  </div>
                  {CATEGORIES_OPTIONS.map((cat, index) => (
                    <div 
                      key={index}
                      className={`searchbar-dropdown-item ${category === cat ? 'active' : ''}`}
                      onClick={() => { setCategory(cat); setIsDropdownOpen(false); }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Max People */}
        <div className="searchbar-field">
          <RiGroupLine className="searchbar-icon" />
          <div>
            <label className="searchbar-label">Max People</label>
            <input
              type="number"
              placeholder="e.g. 5"
              className="searchbar-input"
              value={maxPeople}
              onChange={(e) => setMaxPeople(e.target.value)}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="searchbar-button-wrapper">
          <button className="searchbar-button" onClick={handleSearch}>
            <RiSearchLine className="searchbar-button-icon" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
