// // export default UserProfile;
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout, updateUser } from '../../redux/authSlice'; // ensure updateUser exists in authSlice
// import './UserProfile.css';
// import axios from 'axios';
// import {
//   CheckCircle,
//   XCircle,
//   Eye,
//   EyeOff,
//   Lock
// } from "lucide-react";


// const UserProfile = () => {
//   const { user, token, isAuthenticated } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const [isEditing, setIsEditing] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");

//   const [formData, setFormData] = useState({
//     fullName: user?.fullName || '',
//     username: user?.username || '',
//     // email: user?.email || '',
//     // mobile: user?.mobile || '',
//   });


//   // Password state
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [showPassword1, setShowPassword1] = useState(false);
//   const [showPassword2, setShowPassword2] = useState(false);
//   const [showPassword3, setShowPassword3] = useState(false);


//   const validatenewPassword = (password) => {
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
//     return passwordRegex.test(password);
//   };


//   const handlePasswordChange = (e) => {
//     setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setMessage("New passwords do not match!");
//       setMessageType("error");
//       return;
//     }


//     if (!validatenewPassword(passwordData.newPassword)) {
//       setMessage(
//         "Password must be at least 8 characters with uppercase, lowercase, and number"
//       );
//       setMessageType("error");
//       return;
//     }


//     try {
//       const response = await axios.put(
//         'http://localhost:5000/api/user/change-password',
//         {
//           currentPassword: passwordData.currentPassword,
//           newPassword: passwordData.newPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('Change Password Response:', response);

//       if (response.status === 200) {
//         //alert('Password updated successfully!');
//         setMessage("Password updated successfully!");
//         setMessageType("success");
//         setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       } else {
//         setMessage(response.data.message || 'Password update failed');
//         setMessageType("error");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         setMessage(error.response.data.message || 'Server error while updating password');
//         setMessageType("error");
//       }
//       // console.error('Error updating password:', error);
//       // alert('Server error while updating password');
//     }
//   };

//   // Update user profile
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/user/${user.id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       dispatch(updateUser(response.data));
//       // localStorage.setItem("user", JSON.stringify(response.data));
//       setMessage("Profile updated successfully");
//       setMessageType("success");
//       console.log('Update Response:', response);
//       console.log("updated user:", user);//here comming still old user data even user updated in mongodb data 
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Update error:', error);
//       setMessage("profile Update failed");
//       setMessageType("error");
//     }
//   };
//   console.log(user.id);

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

//     if (!confirmDelete) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/user/${user.id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       dispatch(logout());
//     } catch (err) {
//       console.error('Delete failed', err);
//       setMessage("Account deletion failed");
//       setMessageType("error");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="user-profile">
//       <div className="profile-container">
//         {!isEditing ? (
//           <div className="profile-details">
//             <h1>Profile Details</h1>
//             <hr />
//             <h4><span>Full Name:</span> {user?.fullName || 'N/A'}</h4>
//             <h4><span>Username:</span> {user?.username || 'N/A'}</h4>
//             <h4><span>Email:</span> {user?.email || 'N/A'}</h4>
//             <h4><span>Mobile:</span> {user?.mobile || 'N/A'}</h4>

//             <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>

//             {/*<form onSubmit={handleChangePassword}>
//               <h3>Change Password</h3>
//                <input
//                 type="password"
//                 name="currentPassword"
//                 placeholder="Current Password"
//                 value={passwordData.currentPassword}
//                 onChange={handlePasswordChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="newPassword"
//                 placeholder="New Password"
//                 value={passwordData.newPassword}
//                 onChange={handlePasswordChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm New Password"
//                 value={passwordData.confirmPassword}
//                 onChange={handlePasswordChange}
//                 required
//               /> 
              
//               <button type="submit" className="save-btn">Update Password</button>
//             </form>*}
//              <form onSubmit={handleChangePassword} className="space-y-5">
//       <h3 className="text-lg font-semibold mb-4">Change Password</h3>

//       {/* Current Password */}
//             <form onSubmit={handleChangePassword} className="space-y-5">
//               <h3 className="text-lg font-semibold mb-4">Change Password</h3>


//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type={showPassword1 ? "text" : "password"}
//                   name="currentPassword"
//                   value={passwordData.currentPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Current Password"
//                   required
//                   className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword1(!showPassword1)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword1 ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               {/* New Password */}
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type={showPassword2 ? "text" : "password"}
//                   name="newPassword"
//                   value={passwordData.newPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="New Password"
//                   required
//                   className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword2(!showPassword2)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               {/* Confirm New Password */}
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type={showPassword3 ? "text" : "password"}
//                   name="confirmPassword"
//                   value={passwordData.confirmPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Confirm New Password"
//                   required
//                   className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword3(!showPassword3)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword3 ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
//               >
//                 Update Password
//               </button>
//             </form>

//             {/* Message Display */}
//             {message && (
//               <div
//                 className={`flex items-center gap-2 p-4 rounded-lg mb-6 mt-3 ${messageType === "success"
//                     ? "bg-green-50 text-green-700 border border-green-200"
//                     : "bg-red-50 text-red-700 border border-red-200"
//                   }`}
//               >
//                 {messageType === "success" ? (
//                   <CheckCircle size={16} />
//                 ) : (
//                   <XCircle size={16} />
//                 )}
//                 <span className="text-sm">{message}</span>
//               </div>
//             )}

//             <div className="logout-delete">
//               <Link to="/signin">
//                 <button className="sign-in-btn" onClick={() => dispatch(logout())}>LOG OUT</button>
//               </Link>
//               <Link to="/signin">
//                 <button className="sign-in-btn" onClick={handleDelete}>Delete Account</button>
//               </Link>
//             </div>
//           </div>
//         ) : (
//           <form className="profile-update" onSubmit={handleUpdate}>
//             <h1>Edit Profile</h1>
//             <hr />
//             <label>Full Name*</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//             />
//             <label>Username*</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//             {/* <label>Email*</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             /> */}
//             {/* <label>Mobile Number*</label> */}
//             {/* <input
//               type="tel"
//               name="mobile"
//               value={formData.mobile}
//               onChange={handleChange}
//               required
//             /> */}
//             <div className="btn-group">
//               <button type="submit" className="save-btn">Save</button>
//               <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
//             </div>

//             {/* Message Display */}
//             {message && (
//               <div
//                 className={`flex items-center gap-2 p-4 rounded-lg mb-6 mt-3 ${messageType === "success"
//                     ? "bg-green-50 text-green-700 border border-green-200"
//                     : "bg-red-50 text-red-700 border border-red-200"
//                   }`}
//               >
//                 {messageType === "success" ? (
//                   <CheckCircle size={16} />
//                 ) : (
//                   <XCircle size={16} />
//                 )}
//                 <span className="text-sm">{message}</span>
//               </div>
//             )}

//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '../../redux/authSlice'; // ensure updateUser exists in authSlice
import './UserProfile.css';
import axios from 'axios';
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";


const UserProfile = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    // email: user?.email || '',
    // mobile: user?.mobile || '',
  });


  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);


  const validatenewPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };


  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match!");
      setMessageType("error");
      return;
    }


    if (!validatenewPassword(passwordData.newPassword)) {
      setMessage(
        "Password must be at least 8 characters with uppercase, lowercase, and number"
      );
      setMessageType("error");
      return;
    }


    try {
      const response = await axios.put(
        'http://localhost:5000/api/user/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Change Password Response:', response);

      if (response.status === 200) {
        //alert('Password updated successfully!');
        setMessage("Password updated successfully!");
        setMessageType("success");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage(response.data.message || 'Password update failed');
        setMessageType("error");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message || 'Server error while updating password');
        setMessageType("error");
      }
      // console.error('Error updating password:', error);
      // alert('Server error while updating password');
    }
  };

  // Update user profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/user/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(updateUser(response.data));
      // localStorage.setItem("user", JSON.stringify(response.data));
      setMessage("Profile updated successfully");
      setMessageType("success");
      console.log('Update Response:', response);
      console.log("updated user:", user);//here comming still old user data even user updated in mongodb data 
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      setMessage("profile Update failed");
      setMessageType("error");
    }
  };
  console.log(user.id);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(logout());
    } catch (err) {
      console.error('Delete failed', err);
      setMessage("Account deletion failed");
      setMessageType("error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="user-profile">
      <div className="profile-container">
        {!isEditing ? (
          <div className="profile-details">
            <h1>Profile Details</h1>
            <hr />
            <h4><span>Full Name:</span> {user?.fullName || 'N/A'}</h4>
            <h4><span>Username:</span> {user?.username || 'N/A'}</h4>
            <h4><span>Email:</span> {user?.email || 'N/A'}</h4>
            <h4><span>Mobile:</span> {user?.mobile || 'N/A'}</h4>

            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>

            <form onSubmit={handleChangePassword} className="password-form">
              <h3 className="password-form-title">Change Password</h3>

              {/* Current Password */}
              <div className="password-input-group">
                <Lock className="password-icon" size={18} />
                <input
                  type={showPassword1 ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  required
                  className="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="password-toggle"
                >
                  {showPassword1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* New Password */}
              <div className="password-input-group">
                <Lock className="password-icon" size={18} />
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  required
                  className="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="password-toggle"
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="password-input-group">
                <Lock className="password-icon" size={18} />
                <input
                  type={showPassword3 ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  required
                  className="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword3(!showPassword3)}
                  className="password-toggle"
                >
                  {showPassword3 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="password-update-btn"
              >
                Update Password
              </button>
            </form>

            {/* Message Display */}
            {message && (
              <div className={`message ${messageType === "success" ? "message-success" : "message-error"}`}>
                {messageType === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                <span className="message-text">{message}</span>
              </div>
            )}

            <div className="logout-delete">
              <Link to="/signin">
                <button className="sign-in-btn logout-btn" onClick={() => dispatch(logout())}>LOG OUT</button>
              </Link>
              <Link to="/signin">
                <button className="sign-in-btn delete-btn" onClick={handleDelete}>Delete Account</button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="profile-update" onSubmit={handleUpdate}>
            <h1>Edit Profile</h1>
            <hr />
            <label>Full Name*</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <label>Username*</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {/* <label>Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            /> */}
            {/* <label>Mobile Number*</label> */}
            {/* <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            /> */}
            <div className="btn-group">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`message ${messageType === "success" ? "message-success" : "message-error"}`}>
                {messageType === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                <span className="message-text">{message}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
