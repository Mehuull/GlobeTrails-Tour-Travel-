import PDFDocument from 'pdfkit';

/**
 * Generates a payment receipt PDF
 * @param {Object} booking - The booking object
 * @param {string} tourTitle - The title of the tour
 * @param {string} paymentType - 'deposit' or 'full'
 */
export const generateReceipt = (booking, tourTitle, paymentType) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Header
            doc.fillColor('#ff7f50').fontSize(25).text('GlobeTrails', { align: 'center' });
            doc.fillColor('#666666').fontSize(10).text('Your Gateway to Adventure', { align: 'center' });
            doc.moveDown();

            doc.fillColor('#333333').fontSize(20).text('PAYMENT RECEIPT', { align: 'center', underline: true });
            doc.moveDown();

            // Receipt Info
            const receiptId = paymentType === 'deposit' ? booking.razorpayDepositPaymentId : booking.razorpayBalancePaymentId;
            const amountPaid = (paymentType === 'deposit' ? booking.depositAmount : booking.balanceAmount) || 0;
            const finalPrice = booking.finalPrice || 0;
            
            doc.fontSize(12).fillColor('#000000');
            doc.text(`Receipt ID: ${receiptId || 'N/A'}`, { align: 'right' });
            doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.moveDown();

            // Customer Details
            doc.fontSize(14).text('Customer Details', { underline: true });
            doc.fontSize(12).text(`Name: ${booking.user?.username || 'Valued Customer'}`);
            doc.text(`Email: ${booking.contactDetails?.email || booking.user?.email}`);
            doc.text(`Phone: ${booking.contactDetails?.phone || 'N/A'}`);
            doc.moveDown();

            // Booking Details
            doc.fontSize(14).text('Booking Details', { underline: true });
            doc.fontSize(12).text(`Tour: ${tourTitle}`);
            doc.text(`Travel Date: ${new Date(booking.preferredStartDate).toLocaleDateString()}`);
            doc.text(`Guests: ${booking.guests}`);
            doc.moveDown();

            // Payment Summary
            doc.fontSize(14).text('Payment Summary', { underline: true });
            doc.moveDown(0.5);

            const tableTop = doc.y;
            doc.text('Description', 50, tableTop);
            doc.text('Amount', 400, tableTop, { align: 'right' });
            
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            
            const row1Y = tableTop + 25;
            doc.text(`Total Tour Price`, 50, row1Y);
            doc.text(`INR ${finalPrice.toFixed(2)}`, 400, row1Y, { align: 'right' });

            const row2Y = row1Y + 20;
            const desc = paymentType === 'deposit' ? 'Advance Deposit (40%)' : 'Balance Payment (60%)';
            doc.text(desc, 50, row2Y);
            doc.text(`INR ${amountPaid.toFixed(2)}`, 400, row2Y, { align: 'right' });

            doc.moveTo(50, row2Y + 15).lineTo(550, row2Y + 15).stroke();

            const totalY = row2Y + 25;
            doc.fontSize(14).fillColor('#27ae60').text('Amount Paid', 50, totalY);
            doc.text(`INR ${amountPaid.toFixed(2)}`, 400, totalY, { align: 'right' });

            doc.fontSize(12).fillColor('#c0392b').text('Remaining Balance', 50, totalY + 20);
            const remaining = (paymentType === 'deposit' ? booking.balanceAmount : 0) || 0;
            doc.text(`INR ${remaining.toFixed(2)}`, 400, totalY + 20, { align: 'right' });

            doc.moveDown(3);

            // Footer
            doc.fillColor('#999999').fontSize(10).text('Thank you for booking with GlobeTrails!', { align: 'center' });
            doc.text('This is a computer-generated receipt and does not require a signature.', { align: 'center' });
            doc.text('For any queries, please contact support@globetrails.com', { align: 'center' });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
