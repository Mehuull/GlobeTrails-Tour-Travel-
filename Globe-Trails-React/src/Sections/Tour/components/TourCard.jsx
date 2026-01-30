import React from 'react';
import { Clock, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TourCard.css';

const TourCard = ({ tour }) => {
    const { _id, title, category, duration, pricePerPerson, maxGroupSize, images, locationsCovered } = tour;

    return (
        <div className="tour-card">
            <div className="tour-card-header">
                <img src={images[0]} alt={title} className="tour-image" />
                {category && <span className="tour-badge">{category}</span>}
            </div>

            <div className="tour-card-body">
                <h3 className="tour-title">{title}</h3>

                <p className="tour-description">
                    {tour.description}
                </p>

                <div className="tour-details-stack">
                    <div className="detail-row">
                        <MapPin size={16} className="text-orange" />
                        <span className="tour-location-text">
                            {/* Extract unique locations from itinerary if available, or just a placeholder */}
                            {tour.itinerary && tour.itinerary.length > 0
                                ? tour.itinerary.flatMap(day => day.locationsCovered).join(', ')
                                : "Multiple Locations"
                            }
                        </span>
                    </div>

                    <div className="detail-row">
                        <Clock size={16} className="text-orange" />
                        <span>{duration.days} Days / {duration.nights} Nights</span>
                    </div>

                    <div className="detail-row">
                        <Users size={16} className="text-orange" />
                        <span>Max {maxGroupSize} People</span>
                    </div>
                </div>

                <div className="tour-card-footer">
                    <div className='price-sec'>
                        <span className="price-label">Price </span>
                        <span className="tour-price">₹{pricePerPerson}</span>
                    </div>
                    <Link to={`/tours/${_id}`} className="book-btn">
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TourCard;
