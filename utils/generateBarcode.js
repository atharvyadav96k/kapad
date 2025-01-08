const bwipjs = require('bwip-js');
const { createCanvas, Image } = require('canvas');
const fs = require('fs');

function formatTextToFitLines(text, maxCharsPerLine) {
  const words = text.split('');
  let formattedText = '';
  let letterIdx = 0;
  console.log(words)
  words.forEach(element => {
    if(letterIdx > 14){
      formattedText += '\n';
      letterIdx = 0;
    }
    letterIdx++;
    formattedText += element;
  });
  console.log(formattedText)
  return formattedText;
}
// Function to generate a QR code as a buffer
const generateQRCode = (data) => {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid: 'qrcode',    // QR code type
      text: data,        // QR code data
      scale: 5,           // Adjust scaling factor for readability
      includetext: false  // Do not include any text with the QR code
    }, (err, png) => {
      if (err) {
        return reject(err);
      }
      resolve(png); // Return the buffer
    });
  });
};

// Main function to generate barcode page with QR codes
exports.generateBarCodePage = async (data) => {
  try {
    // Canvas size and padding
    const canvasWidth = 2480;
    const canvasHeight = 3508;
    const paddingLeftRight = 100; // Padding for left and right
    const paddingTop = 180; // Padding for top
    const paddingBottom = 250; // Bottom padding if required
    const horizontalMargin = 20; // Horizontal margin between boxes
    const verticalMargin = 0; // Vertical margin between rows

    // Number of boxes
    const rows = 12;
    const cols = 4;

    // Calculate usable width and height
    const usableWidth = canvasWidth - 2 * paddingLeftRight;
    const usableHeight = canvasHeight - paddingTop - paddingBottom;

    // Calculate box dimensions with margins
    const totalHorizontalMargins = horizontalMargin * (cols - 1); // Total horizontal space taken by margins
    const totalVerticalMargins = verticalMargin * (rows - 1); // Total vertical space taken by margins
    const boxWidth = Math.floor((usableWidth - totalHorizontalMargins) / cols);
    const boxHeight = Math.floor((usableHeight - totalVerticalMargins) / rows);

    // Create the main canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Set background color to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw the boxes
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    // Generate the QR code buffer once outside the loop
    const qrCodeBuffer = await generateQRCode(data);
    const image = new Image();
    image.src = qrCodeBuffer;
    const text = formatTextToFitLines(data,14);

    // Loop through each box position to draw the boxes and QR code
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Calculate the position with margins
        let extraSpace = 5;
        if(cols == 3){
          extraSpace = 10;
        }
        const x = paddingLeftRight + col * (boxWidth + horizontalMargin) + (col * extraSpace);
        const y = paddingTop + row * (boxHeight + verticalMargin);

        // Draw the box outline
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        // Draw the QR code inside the box
        ctx.drawImage(image, x + 40, y + 40, 170, 170); // Adjust the position and size
        ctx.fillStyle = 'black'; // Text color
        ctx.font = '30px Arial'; // Font size and type
        ctx.textAlign = 'left'; // Align text to center
        ctx.textBaseline = 'middle'; // Align text vertically
        const tx = x + 220; // Center horizontally
        const ty = y + 55; // Center vertically
        ctx.fillText(text, tx, ty);
      }
    }

    // Save the final canvas with all QR codes drawn
    const buffer = canvas.toBuffer('image/png');
    const outputPath = 'barcode_page_with_qr_codes.png';
    // fs.writeFileSync(outputPath, buffer);

    console.log(`Barcode page saved as ${outputPath}`);
    return buffer;

  } catch (error) {
    console.error('Error generating barcode page:', error);
    throw error;
  }
};
