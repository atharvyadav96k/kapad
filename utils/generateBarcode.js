const bwipjs = require('bwip-js');
const { createCanvas, loadImage, Image } = require('canvas');

exports.generateQRCode = (data, brandName) => {
    return new Promise((resolve, reject) => {
        bwipjs.toBuffer({
            bcid:        'qrcode',    // Use QR code
            text:        data,        // QR code data
            scale:       5,           // Adjust scaling factor for readability
            includetext: false        // We’ll add the text manually
        }, async (err, png) => {
            if (err) {
                return reject(err);
            }

            // Create an image object and load the QR code buffer
            const image = new Image();
            image.src = png;

            // Create canvas dynamically based on the image dimensions
            const canvasWidth = image.width + 400; // Add space for the text on the right
            const canvasHeight = Math.max(image.height, 150); // Make sure there's space for text
            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext('2d');

            // Draw the QR code on the left side
            ctx.drawImage(image, 0, 0, image.width, image.height);

            // Set font and alignment for the text
            ctx.font = '24px Arial';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#000'; // Set text color

            // Calculate vertical spacing to avoid text overlap
            const lineHeight = 30; // Set height between text lines
            const startX = image.width + 10; // Start text 10px to the right of QR code
            let startY = 40; // Starting Y position for text

            // Add the brand name and adjust text placement
            ctx.fillText(`Brand: ${brandName}`, startX, startY);
            startY += lineHeight; // Move to next line for data

            // Add the data text and adjust its position
            ctx.fillText(`Data: ${data}`, startX, startY);

            // Resolve with the canvas buffer
            resolve(canvas.toBuffer('image/png'));
        });
    });
}
