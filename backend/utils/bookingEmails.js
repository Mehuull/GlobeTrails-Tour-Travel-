import nodemailer from "nodemailer";
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendBookingInquiryEmail = async (booking, tourTitle, userEmail, userName) => {
    const mailOptions = {
        from: `"GlobeTrails" <${process.env.MAIL_USER}>`,
        to: userEmail,
        subject: `Booking Inquiry Received: ${tourTitle}`,
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #ff7f50; margin: 0;">GlobeTrails</h1>
                <p style="color: #666; font-size: 14px;">Your Gateway to Adventure</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
                <p style="color: #555; line-height: 1.6;">
                    Thank you for choosing GlobeTrails! We have successfully received your booking inquiry for the <strong>${tourTitle}</strong>.
                </p>
                
                <div style="margin: 20px 0; border-top: 1px solid #eee; pt: 15px;">
                    <h3 style="color: #2c3e50; font-size: 16px;">Tour Details:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #7f8c8d; width: 120px;">Tour:</td>
                            <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${tourTitle}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #7f8c8d;">Travel Date:</td>
                            <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${new Date(booking.preferredStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #7f8c8d;">Guests:</td>
                            <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${booking.guests} Persons</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #7f8c8d;">Booking Status:</td>
                            <td style="padding: 8px 0; color: #f39c12; font-weight: 700;">${booking.inquiryStatus.toUpperCase()}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div style="padding: 15px; background-color: #fff9f0; border-left: 4px solid #f39c12; margin-bottom: 20px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                    <strong>Important Note:</strong> This is an initial inquiry. Your booking will <strong>not be confirmed</strong> until our team reviews the availability and updates the status to 'Confirmed'.
                </p>
            </div>

            <p style="color: #555; line-height: 1.6;">
                Our team will process your request shortly. You will receive a separate confirmation email once your booking has been officially approved.
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                <p>&copy; 2026 GlobeTrails Travel Agency. All rights reserved.</p>
                <p>If you have any questions, please reply to this email or contact our support team.</p>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Booking inquiry email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending booking email:", error);
    }
};

export const sendBookingConfirmationEmail = async (booking, tourTitle, userEmail, userName) => {
    const balanceMsg = booking.balanceAmount ? `<p style="color: #d35400;"><strong>Reminder:</strong> A remaining balance of <strong>₹${booking.balanceAmount}</strong> is due at least 5 days before your trip. Please log in to your profile to complete the payment.</p>` : '';

    const mailOptions = {
        from: `"GlobeTrails" <${process.env.MAIL_USER}>`,
        to: userEmail,
        subject: `Booking CONFIRMED (Deposit Paid): ${tourTitle}`,
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #27ae60; margin: 0;">GlobeTrails</h1>
                <p style="color: #666; font-size: 14px;">Deposit Received & Booking Confirmed!</p>
            </div>
            
            <div style="background-color: #f0fff4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c6f6d5;">
                <h2 style="color: #27ae60; margin-top: 0;">Great News, ${userName}!</h2>
                <p style="color: #2f855a; line-height: 1.6;">
                    Your advanced deposit for <strong>${tourTitle}</strong> has been received and your booking is <strong>CONFIRMED</strong>. 
                </p>
            </div>

            <div style="margin: 20px 0;">
                <h3 style="color: #2c3e50; font-size: 16px;">Booking Summary:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d; width: 120px;">Tour:</td>
                        <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${tourTitle}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d;">Travel Date:</td>
                        <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${new Date(booking.preferredStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d;">Guests:</td>
                        <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${booking.guests} Persons</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d;">Total Price:</td>
                        <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">₹${booking.finalPrice}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d;">Deposit Paid:</td>
                        <td style="padding: 8px 0; color: #27ae60; font-weight: 600;">₹${booking.depositAmount || Math.round(booking.finalPrice * 0.4)}</td>
                    </tr>
                </table>
            </div>

            ${balanceMsg}

            <p style="color: #555; line-height: 1.6;">
                You can view your booking details and our cancellation policy in your profile section on our website.
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                <p>&copy; 2026 GlobeTrails Travel Agency. All rights reserved.</p>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Booking deposit confirmation email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending confirmation email:", error);
    }
};

export const sendFullPaymentConfirmationEmail = async (booking, tourTitle, userEmail, userName) => {
    const mailOptions = {
        from: `"GlobeTrails" <${process.env.MAIL_USER}>`,
        to: userEmail,
        subject: `Full Payment Received: ${tourTitle}`,
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2ecc71; margin: 0;">GlobeTrails</h1>
                <p style="color: #666; font-size: 14px;">Full Payment Successful!</p>
            </div>
            
            <div style="background-color: #f0fff4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #27ae60; margin-top: 0;">Thank you, ${userName}!</h2>
                <p style="color: #2f855a; line-height: 1.6;">
                    We have received your full payment of <strong>₹${booking.finalPrice}</strong> for <strong>${tourTitle}</strong>. You are all set for your trip!
                </p>
                <p style="color: #555;">Get ready for an amazing adventure starting on ${new Date(booking.preferredStartDate).toLocaleDateString()}.</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                <p>&copy; 2026 GlobeTrails Travel Agency. All rights reserved.</p>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Full payment confirmation email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending full payment email:", error);
    }
};
