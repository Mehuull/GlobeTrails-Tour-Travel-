import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, Users, MapPin, CheckCircle, XCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getData } from '@/context/userContext';
import { toast } from 'sonner';
import './TourDetails.css';

const TourDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = getData();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);

    // Booking Form State
    const [bookingData, setBookingData] = useState({
        fullName: user?.username || '',
        email: user?.email || '',
        phone: '',
        guest: 1,
        bookAt: ''
    });

    const [serviceCharge] = useState(10); // Fixed service charge

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/tours/${id}`);
                if (res.data.success) {
                    setTour(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch tour details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTour();
    }, [id]);

    useEffect(() => {
        const checkExistingBooking = async () => {
            if (!user || !id) return;
            try {
                const tokens = localStorage.getItem('accessToken');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/my-bookings`, {
                    headers: { Authorization: `Bearer ${tokens}` }
                });
                if (res.data.success) {
                    const hasBooked = res.data.data.some(b =>
                        b.tour?._id === id &&
                        new Date(b.preferredStartDate) >= new Date().setHours(0, 0, 0, 0)
                    );
                    setIsAlreadyBooked(hasBooked);
                }
            } catch (error) {
                console.error("Error checking user bookings", error);
            }
        };
        checkExistingBooking();
    }, [user, id]);

    // Image Carousel Auto-scroll
    useEffect(() => {
        if (tour?.images?.length > 1) {
            const interval = setInterval(() => {
                setCurrentImage((prev) => (prev + 1) % tour.images.length);
            }, 5000); // 5 seconds
            return () => clearInterval(interval);
        }
    }, [tour]);

    const handleChange = (e) => {
        setBookingData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleBookingSchema = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please sign in to book a tour");
            navigate('/signin'); // Or wherever your login is
            return;
        }

        try {
            const payload = {
                tour: tour._id,
                preferredStartDate: bookingData.bookAt,
                guests: Number(bookingData.guest),
                contactDetails: {
                    phone: bookingData.phone,
                    email: bookingData.email
                },
                finalPrice: (Number(tour.pricePerPerson) * Number(bookingData.guest)) + serviceCharge
            };

            const tokens = localStorage.getItem('accessToken'); // Retrieve token for auth
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, payload, {
                headers: {
                    Authorization: `Bearer ${tokens}`
                }
            });

            if (res.data.success) {
                toast.success("Booking inquiry sent successfully!");
                navigate('/profile');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Booking failed. Please try again.");
        }
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (!tour) return <div className="not-found">Tour not found</div>;

    const totalAmount = Number(tour.pricePerPerson) * Number(bookingData.guest) + serviceCharge;

    return (
        <div className="tour-details-page">
            <div className="details-container">

                {/* Left Column: Details */}
                <div className="details-content">

                    {/* Image Carousel */}
                    <div className="details-image-container">
                        <img src={tour.images[currentImage]} alt={tour.title} className="details-main-image" />

                        {tour.images.length > 1 && (
                            <>
                                <button
                                    className="carousel-btn prev"
                                    onClick={() => setCurrentImage((curr) => (curr === 0 ? tour.images.length - 1 : curr - 1))}
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    className="carousel-btn next"
                                    onClick={() => setCurrentImage((curr) => (curr + 1) % tour.images.length)}
                                >
                                    <ChevronRight />
                                </button>
                                <div className="carousel-dots">
                                    {tour.images.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`dot ${currentImage === idx ? 'active' : ''}`}
                                            onClick={() => setCurrentImage(idx)}
                                        ></span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="details-header">
                        <h1>{tour.title}</h1>
                        <div className="details-meta">
                            <span className="meta-item"><MapPin size={18} /> {tour.itinerary[0]?.locationsCovered?.join(', ') || "Multiple Locations"}</span>
                            <span className="meta-item"><Clock size={18} /> {tour.duration.days} Days / {tour.duration.nights} Nights</span>
                            <span className="meta-item"><Users size={18} /> Max {tour.maxGroupSize} People</span>
                        </div>
                    </div>

                    <div className="section-block">
                        <h3>Description</h3>
                        <p>{tour.description}</p>
                    </div>

                    <div className="section-block">
                        <h3>Itinerary</h3>
                        <div className="itinerary-list">
                            {tour.itinerary.map((day) => (
                                <div key={day.dayNumber} className="itinerary-item">
                                    <div className="day-badge">Day {day.dayNumber}</div>
                                    <div className="day-content">
                                        <h4>{day.title}</h4>
                                        <p>{day.description}</p>
                                        <small style={{ color: '#666' }}>Overnight Stay: {day.overnightStay}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section-block">
                        <h3>Inclusions & Exclusions</h3>
                        <div className="inc-exc-grid">
                            <div className="inc-col">
                                <h4>Inclusions</h4>
                                <ul>
                                    {tour.inclusions.map((inc, i) => (
                                        <li key={i}><CheckCircle size={16} className="text-green-500" /> {inc}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="exc-col">
                                <h4>Exclusions</h4>
                                <ul>
                                    {tour.exclusions.map((exc, i) => (
                                        <li key={i}><XCircle size={16} className="text-red-500" /> {exc}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Booking Form (Sticky) */}
                <div className="booking-sidebar">
                    <div className="booking-form-card">
                        <div className="book-form-header">
                            <div className="price-tag">
                                <span className="amount">₹{tour.pricePerPerson}</span> <span className="per-person">/ per person</span>
                            </div>
                            <div className="rating">
                                <Star size={16} fill="#f39c12" stroke="#f39c12" /> 4.5 (2)
                            </div>
                        </div>

                        <div className="form-title">Information</div>

                        {isAlreadyBooked ? (
                            <div className="already-booked-msg">
                                <CheckCircle size={40} className="text-green-500" />
                                <h3>You've Already Booked!</h3>
                                <p>You have an active booking for this tour. Check your profile for details.</p>
                                <button type="button" onClick={() => navigate('/profile')} className="btn-view-profile">Go to Profile</button>
                            </div>
                        ) : (
                            <form className="booking-form" onSubmit={handleBookingSchema}>
                                <div className="form-group-details">
                                    <input type="text" placeholder="Full Name" id="fullName" required onChange={handleChange} value={bookingData.fullName} />
                                </div>
                                <div className="form-group-details">
                                    <input type="email" placeholder="Email" id="email" required onChange={handleChange} value={bookingData.email} />
                                </div>
                                <div className="form-group-details">
                                    <input type="tel" placeholder="Phone" id="phone" required onChange={handleChange} value={bookingData.phone} />
                                </div>
                                <div className="form-row-details">
                                    <input type="date" id="bookAt" required onChange={handleChange} value={bookingData.bookAt} className="date-input" />
                                    <input type="number" placeholder="Guest" id="guest" required min="1" max={tour.maxGroupSize} onChange={handleChange} value={bookingData.guest} />
                                </div>

                                <div className="price-summary">
                                    <div className="summary-row">
                                        <span>₹{tour.pricePerPerson} x {bookingData.guest} person</span>
                                        <span>₹{tour.pricePerPerson * bookingData.guest}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Service charge</span>
                                        <span>₹{serviceCharge}</span>
                                    </div>
                                    <div className="summary-total">
                                        <span>Total</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                </div>

                                <button type="submit" className="btn-book-submit">Book Now</button>
                            </form>
                        )}
                        <div className="cancellation-policy-note">
                            <Clock size={14} className="inline-icon" />
                            <span>* Cancellation is only allowed 20 days prior to the travel date.</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TourDetails;
