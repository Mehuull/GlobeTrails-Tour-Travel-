import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import "./Faq.css";

const faqData = [
    {
        id: 1,
        question: "What is GlobeTrails and what does it offer?",
        answer: "GlobeTrails is a premier online travel platform connecting travelers with top-rated Indian and International tour operators. We offer curated travel packages, adventure tours, and personalized itineraries to help you explore the world's most beautiful destinations seamlessly."
    },
    {
        id: 2,
        question: "How can I customize my travel package?",
        answer: "Absolutely! We believe in unique travel experiences. You can choose any of our existing packages and request modifications, or contact our travel experts directly to build a completely unparalleled itinerary tailored to your preferences, budget, and dates."
    },
    {
        id: 3,
        question: "What destinations do you cover?",
        answer: "We cover a vast range of destinations globally. From the serene beaches of Bali and the Maldives to the heritage sites of Europe and the vibrant landscapes of India (like Kerala, Goa, and Rajasthan). Check our 'Destinations' section for the full list."
    },
    {
        id: 4,
        question: "Are the tour guides and operators verified?",
        answer: "Yes, safety and quality are our top priorities. We strictly partner with verified, experienced, and government-licensed tour operators and guides to ensure you have a safe, informative, and enjoyable journey."
    },
    {
        id: 5,
        question: "What is the cancellation and refund policy?",
        answer: "Cancellation policies vary depending on the specific tour package and operator. Generally, we offer a full refund if cancelled 30 days prior to the trip. Please refer to the specific terms and conditions mentioned on the booking page of your chosen package."
    }
];

export default function Faq() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                {/* Header */}
                <div className="faq-header">
                    <h2 className="faq-title">
                        Frequently <span className="highlight">Asked Questions</span>
                    </h2>
                </div>

                {/* FAQ List */}
                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <div
                            className={`faq-item ${activeIndex === index ? "active" : ""}`}
                            key={item.id}
                        >
                            <button className="faq-question" onClick={() => toggleFaq(index)}>
                                <span className="question-text">
                                    <span className="question-number">{item.id}.</span>
                                    {item.question}
                                </span>
                                <span className="faq-icon">
                                    {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <div className="faq-answer">
                                <div className="faq-answer-content">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
