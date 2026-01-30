import React, { useRef } from "react";
import "./Destinations.css";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "lucide-react";

// International Data
const internationalDestinations = [
    { id: 1, name: "Thailand", img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000&auto=format&fit=crop" },
    { id: 2, name: "Maldives", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, name: "Malaysia", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop" },
    { id: 4, name: "Nepal", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop" },
    { id: 5, name: "Japan", img: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2000&auto=format&fit=crop" },
    { id: 6, name: "UAE (Dubai)", img: "https://images.unsplash.com/photo-1562660474-d20c6b33478e?q=80&w=687&auto=format&fit=crop" },
    { id: 7, name: "Switzerland", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2000&auto=format&fit=crop" },
    { id: 8, name: "Kenya", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2000&auto=format&fit=crop" },
    { id: 9, name: "Singapore", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2000&auto=format&fit=crop" },
    { id: 10, name: "Paris", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop" },
    { id: 11, name: "Vietnam", img: "https://images.unsplash.com/photo-1603852452378-a4e8d84324a2?q=80&w=764&auto=format&fit=crop" },
    { id: 12, name: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop" },
    { id: 13, name: "Greece", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop" },
    { id: 14, name: "Egypt", img: "https://images.unsplash.com/photo-1544343390-f758a6f18f8c?q=80&w=687&auto=format&fit=crop" },
    { id: 15, name: "Turkey", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2000&auto=format&fit=crop" },
];

// India Data
const indianDestinations = [
    { id: 1, name: "Goa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop" },
    { id: 2, name: "Kerala", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, name: "Andaman & Nicobar ", img: "https://plus.unsplash.com/premium_photo-1719843013722-c2f4d69db940?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 4, name: "Shimla", img: "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 5, name: "Leh & ladakh", img: "https://images.unsplash.com/photo-1617824077360-7a77db40aae1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 6, name: "Rishikesh", img: "https://images.unsplash.com/photo-1718383537411-6f9e727ae0bb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 7, name: "Varanasi", img: "https://images.unsplash.com/photo-1728272355917-f41c61fe9842?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 8, name: "Ujjain", img: "https://images.unsplash.com/photo-1658730487395-dcc99f5d997c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 9, name: "Udaipur", img: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=2000&auto=format&fit=crop" },
    { id: 10, name: "Jaipur", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2000&auto=format&fit=crop" },
    { id: 11, name: "Delhi", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop" },
    { id: 12, name: "Agra", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2000&auto=format&fit=crop" },
    { id: 13, name: "Manali", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000&auto=format&fit=crop" },
    { id: 14, name: "Leh Ladakh", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2000&auto=format&fit=crop" },
    { id: 15, name: "Darjeeling", img: "https://images.unsplash.com/photo-1637433452527-39b0103e6103?q=80&w=783&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 16, name: "Mumbai", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=2000&auto=format&fit=crop" },
    { id: 17, name: "Mussoorie", img: "https://wallpaperaccess.com/full/2504913.jpg" },
    { id: 18, name: "Hampi", img: "https://wallpaperaccess.com/full/15211552.jpg" },
    { id: 19, name: "Amritsar", img: "https://images.unsplash.com/photo-1623059508779-2542c6e83753?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 20, name: "Ooty", img: "https://images.unsplash.com/photo-1660918738010-295b09857f93?q=80&w=2004&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const DestinationSlider = ({ title, subtitle, data }) => {
    const sliderRef = useRef(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: false,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5 } },
            { breakpoint: 1024, settings: { slidesToShow: 3.5 } },
            { breakpoint: 600, settings: { slidesToShow: 2.5 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } },
        ],
    };

    const handlePrev = () => sliderRef.current?.slickPrev();
    const handleNext = () => sliderRef.current?.slickNext();

    return (
        <section className="destinations-section">
            <div className="destinations-container">
                {/* Header Section */}
                <div className="destinations-header">
                    <div className="header-left">
                        <h2 className="section-title">{title}</h2>
                        {subtitle && <p className="section-subtitle">{subtitle}</p>}
                    </div>

                    <div className="header-arrows">
                        <button className="arrow-btn" onClick={handlePrev}>
                            <ArrowLeft size={18} />
                        </button>
                        <button className="arrow-btn" onClick={handleNext}>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="carousel-wrapper">
                    <Slider ref={sliderRef} {...settings}>
                        {data.map((item) => (
                            <div key={item.id} className="destination-slide">
                                <div className="pill-card">
                                    <div className="image-container">
                                        <img src={item.img} alt={item.name} />
                                    </div>
                                    <h3 className="place-name">{item.name}</h3>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

const Destinations = () => {
    return (
        <>
            <DestinationSlider
                title={
                    <>
                        Best <span className="highlight">International Tourist Places</span> to Visit
                    </>
                }
                subtitle="Looking for the ultimate International tourist destination? Choose from given International holiday destinations like Greece, Bali, Singapore, Switzerland and more.."
                data={internationalDestinations}
            />

            <DestinationSlider
                title={
                    <>
                        Best <span className="highlight">Tourist Places to Visit</span> in the India
                    </>
                }
                subtitle="Experience the magic of India's rich heritage. Visit the best holiday destinations in India and top India tourist attractions in India for culture, adventure, and nature throughout your journey."
                data={indianDestinations}
            />
        </>
    );
};

export default Destinations;