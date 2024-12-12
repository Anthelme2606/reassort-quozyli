const fs = require('fs');
const path = require('path');

async function saveFile(file) {
  const { createReadStream, filename, mimetype } = await file;
  const stream = createReadStream();

  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
  const uniqueFilename = `${timestamp}_${filename}`;

  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueFilename);

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.on('finish', () => resolve(`/uploads/${uniqueFilename}`));
    writeStream.on('error', reject);
    stream.on('error', (error) => writeStream.destroy(error));
    stream.pipe(writeStream);
  });
}

module.exports = saveFile;