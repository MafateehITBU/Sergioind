import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Icon } from '@iconify/react/dist/iconify.js';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ProfilePageLayer = () => {
    const { user, loading, updateUser, setUser } = useAuth();
    const [imagePreview, setImagePreview] = useState(user?.image || 'assets/images/user-grid/user-grid-img13.png');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        image: user?.image || ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const navigate = useNavigate();

    // Toggle function for password field
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Toggle function for confirm password field
    const toggleConfirmPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
        return phoneRegex.test(phoneNumber);
    };

    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            phoneNumber: ''
        };

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone Number Validation
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone Number is required';
        } else if (!validatePhoneNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number'
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Create a preview URL for the image
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await Swal.fire({
            title: 'Confirm Changes',
            text: 'Are you sure you want to update your profile?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Determine the endpoint based on user position
            const endpoint = user?.role === 'superadmin'? `/superadmin/${user?.id}` :`/admin/${user?.id}`;

            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phoneNumber', formData.phoneNumber);

            // Add the file if it exists
            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }

            const response = await axiosInstance.put(endpoint, formDataToSend);

            if (response.data) {
                updateUser({
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    image: response.data.data?.image?.url || formData.image
                });

                await Swal.fire({
                    title: 'Success!',
                    text: 'Your profile has been updated successfully.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update profile',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const validatePassword = (password) => {
        // Password must be at least 8 characters long
        // and contain at least one uppercase letter, one lowercase letter, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Change Password',
            text: 'Are you sure you want to change your password? This will sign you out of all sessions.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!',
            cancelButtonText: 'No, cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        setIsSubmitting(true);

        try {
            let response;

            if (user.role === 'superadmin') {
                response = await axiosInstance.put('/superadmin/change-password', {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                });
            } else {
                response = await axiosInstance.put('/admin/change-password', {
                    email: user.email,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                });
            }

            if (response.data) {
                await Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });

                // Clear the token from cookies
                Cookie.remove('token');
                // Reset user state
                updateUser({
                    id: null,
                    name: null,
                    email: null,
                    phoneNumber: null,
                    image: null,
                });
                // Navigate to sign in page
                navigate('/sign-in');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            await Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to change password',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="row gy-4">
            <div className="col-lg-4">
                <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                    <img
                        src="assets/images/asset/test.jpeg"
                        alt=""
                        className="w-100 object-fit-cover"
                    />
                    <div className="pb-24 ms-16 mb-24 me-16  mt--100">
                        <div className="text-center border border-top-0 border-start-0 border-end-0">
                            <div className="w-120-px h-120-px rounded-circle overflow-hidden mb-16 position-relative mx-auto">
                                {loading ? (
                                    <div className="w-100 h-100 bg-neutral-200 animate-pulse" />
                                ) : (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-100 h-100 object-fit-cover"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=128`;
                                    }}
                                    />
                                )}
                            </div>
                            <h4 className="text-lg fw-semibold mb-4">
                                {loading ? (
                                    <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse" />
                                ) : (
                                    user?.name || 'User'
                                )}
                            </h4>
                            <span className="text-secondary-light fw-medium">
                                {loading ? (
                                    <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                                ) : (
                                    user?.role || 'Admin'
                                )}
                            </span>
                        </div>
                        <div className="mt-24">
                            <h6 className="text-xl mb-16">Personal Info</h6>
                            <ul>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Full Name
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {loading ? (
                                            <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
                                        ) : (
                                            user?.name || 'Not set'
                                        )}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Email
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {loading ? (
                                            <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
                                        ) : (
                                            user?.email || 'Not set'
                                        )}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Phone
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {loading ? (
                                            <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
                                        ) : (
                                            user?.phoneNumber || 'Not set'
                                        )}
                                    </span>
                                </li>
                                {user?.permissions?.length > 0 ? (
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            Permissions
                                        </span>
                                        <span>{user.permissions.join(', ')}</span>
                                    </li>
                                ) : (
                                    <li></li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card h-100">
                    <div className="card-body p-24">
                        <ul
                            className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24 active"
                                    id="pills-edit-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-edit-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-edit-profile"
                                    aria-selected="true"
                                >
                                    Edit Profile
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-change-passwork-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-change-passwork"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-change-passwork"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Change Password
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-edit-profile"
                                role="tabpanel"
                                aria-labelledby="pills-edit-profile-tab"
                                tabIndex={0}
                            >
                                <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                                {/* Upload Image Start */}
                                <div className="mb-24 mt-16">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept=".png, .jpg, .jpeg"
                                                hidden
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-32-px h-32-px d-flex justify-content-center align-items-center text-primary-600 border  bg-hover-primary-100 text-lg rounded-circle"
                                                style={{ marginTop: "120px", background: "white" }}
                                            >
                                                <Icon icon="solar:camera-outline" className="icon"></Icon>
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div
                                                id="imagePreview"
                                                style={{
                                                    backgroundImage: `url(${imagePreview})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Upload Image End */}
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Full Name
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control radius-8 ${errors.name ? 'is-invalid' : ''}`}
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Full Name"
                                                    required
                                                />
                                                {errors.name && (
                                                    <div className="invalid-feedback">
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="email"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Email <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control radius-8 ${errors.email ? 'is-invalid' : ''}`}
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter email address"
                                                    required
                                                />
                                                {errors.email && (
                                                    <div className="invalid-feedback">
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="phoneNumber"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Phone Number <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control radius-8 ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter phone number"
                                                    required
                                                />
                                                {errors.phoneNumber && (
                                                    <div className="invalid-feedback">
                                                        {errors.phoneNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border  text-md px-56 py-12 radius-8"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="tab-pane fade" id="pills-change-passwork" role="tabpanel" aria-labelledby="pills-change-passwork-tab" tabIndex="0">
                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="mb-20">
                                        <label htmlFor="currentPassword" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Current Password <span className="text-danger-600">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                className={`form-control radius-8`}
                                                id="currentPassword"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter Current Password*"
                                            />
                                            <span
                                                className="toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                                                onClick={togglePasswordVisibility}
                                            >
                                                <Icon icon={passwordVisible ? 'mdi:eye-off' : 'mdi:eye'} />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-20">
                                        <label htmlFor="newPassword" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            New Password <span className="text-danger-600">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={newPasswordVisible ? "text" : "password"}
                                                className={`form-control radius-8`}
                                                id="newPassword"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Confirm Password*"
                                            />
                                            <span
                                                className="toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                <Icon icon={newPasswordVisible ? 'mdi:eye-off' : 'mdi:eye'} />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                            onClick={() => {
                                                setPasswordData({
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Changing...' : 'Change Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePageLayer;