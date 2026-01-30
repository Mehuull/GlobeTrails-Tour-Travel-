import "./CardGrid.css";

const categories = [
    {
        category: "Wildlife Tour",
        place: "Jungle Safaris",
        rating: "4.9",
        img: "https://images.pexels.com/photos/32457066/pexels-photo-32457066.jpeg",
    },
    {
        category: "Adventure Tour",
        place: "Hiking & Rafting",
        rating: "4.8",
        img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1170&q=80",
    },
    {
        category: "Heritage Tour",
        place: "Ancient Palaces",
        rating: "5.0",
        img: "https://media.istockphoto.com/id/2165735183/photo/scenic-views-of-ellora-india.jpg?s=2048x2048&w=is&k=20&c=_u98rIU6DMtvrgEjg0Oif0zofSXd4DaojZbchJEa798=",
    },
    {
        category: "Beaches Tour",
        place: "Sun & Sand",
        rating: "4.7",
        img: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=1170&q=80",
    },
    {
        category: "Hill Station",
        place: "Mountain Retreats",
        rating: "4.6",
        img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1170&q=80",
    },
    {
        category: "Pilgrimage Tour",
        place: "Spiritual Journey",
        rating: "4.8",
        img: "https://images.pexels.com/photos/15017640/pexels-photo-15017640.jpeg",
    },
];

export default function CardGrid() {
    return (
        <section className="card-grid-section">
            <div className="destinations-header">
                <div className="header-left">
                    <h2 className="section-title">
                        Browse Top Travel <span className="highlight">Attractions by Category</span>
                    </h2>
                    <p className="section-subtitle">
                        Discover popular destinations for adventure, heritage, wildlife, beaches, and more. Find the perfect getaway that matches your travel style, all in one place at TourTravelWorld.
                    </p>
                </div>
            </div>

            <div className="grid">
                {categories.map((card, i) => (
                    <div className="card" key={i}>
                        <div className="card__img">
                            <img src={card.img} alt={card.category} />

                            <span className="rating">
                                <svg viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {card.rating}
                            </span>

                            <div className="card__overlay">
                                <h2>{card.category}</h2>
                                <p>{card.place}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
