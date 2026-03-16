import React from 'react';
import './Policy.css';

const Policy = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <h1 className="policy-title">Our Policies</h1>
                <p className="policy-intro">Please read our policies carefully before making a booking.</p>

                <div className="policy-section">
                    <h2>1️⃣ Payment Policy</h2>
                    <ul>
                        <li>A <strong>40% advanced deposit</strong> of the total amount is required at the time of booking to confirm your reservation.</li>
                        <li>The remaining <strong>60% balance</strong> must be paid at least <strong>5 days before the trip</strong>.</li>
                        <li>If the remaining balance is not paid 2 days before the trip, the booking may be cancelled and the deposit may be forfeited.</li>
                        <li>All payments are processed securely via Razorpay.</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h2>2️⃣ Cancellation Policy</h2>
                    <p>We understand that plans can change. Cancellations must be made through your profile dashboard. Our cancellation periods are calculated based on the start date of your tour.</p>
                </div>

                <div className="policy-section">
                    <h2>3️⃣ Refund Policy</h2>
                    <table className="refund-table">
                        <thead>
                            <tr>
                                <th>Cancellation Time</th>
                                <th>Refund Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>30+ days before trip</td>
                                <td>100% refund</td>
                            </tr>
                            <tr>
                                <td>15–30 days before trip</td>
                                <td>50% refund</td>
                            </tr>
                            <tr>
                                <td>7–15 days before trip</td>
                                <td>25% refund</td>
                            </tr>
                            <tr>
                                <td>Less than 7 days</td>
                                <td>No refund</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="note">Note: Refunds are processed within 5-7 business days to the original payment method.</p>
                </div>

                <div className="policy-section">
                    <h2>4️⃣ Terms & Conditions</h2>
                    <ul>
                        <li>By booking a tour with GlobeTrails, you agree to abide by all the rules and regulations set forth by the guide and local authorities.</li>
                        <li>GlobeTrails is not responsible for any personal injury, loss, or damage to property during the tour.</li>
                        <li>We reserve the right to alter itineraries due to unforeseen circumstances like weather conditions or strikes.</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h2>5️⃣ Privacy Policy</h2>
                    <p>
                        Your privacy is important to us. We collect your personal information (name, email, phone number) solely for the purpose of booking and communicating with you regarding your trip. We do not sell or share your data with third parties without your consent.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Policy;
