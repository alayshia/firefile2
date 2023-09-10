const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path'); // handles local path resolve
const localSaveDirectory = '/tmp';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
};

app.use(cors(corsOptions));

// Establishing mongoose connection
require('./utils/database-connection.js');

const FileSchema = new mongoose.Schema({
  name: String,
  content: Buffer,
});

const File = mongoose.model('File', FileSchema);

// Mongo endpoint check
app.get('/db-status', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send({ status: 'Connected' });
  } else {
    res.status(500).send({ status: 'Disconnected', error: 'Not connected to MongoDB.' });
  }
});

//Validates Download Inputs
function validateDownloadInput(req, res, next) {
  const { url, storeInMongo, destination, filename } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL provided.' });
  }

  if (!filename || typeof url !== 'string') {
    return res.status(400).json({ error: 'Please provide filename.' });
  }

  if (typeof storeInMongo !== 'boolean') {
    return res.status(400).json({ error: 'Invalid storeInMongo flag.' });
  }

  if (!storeInMongo && (!destination || typeof destination !== 'string')) {
    return res.status(400).json({ error: 'Invalid destination provided.' });
  }

  next();
}

// Checks Size
app.head('/check-size', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL provided.' });
  }

  try {
    const { headers } = await axios.head(url);
    const size = headers['content-length'];

    if (size > 1e9) {
      return res.status(400).json({ error: 'File size exceeds 1GB.' });
    }

    res.send({ size });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check file size.' });
  }
});

/*
Downloads the file based on data storage. It can be locally or in the MongoDB database
*/
app.post('/download', validateDownloadInput, async (req, res) => {
  const { url, storeInMongo, destination, filename } = req.body;

  try {
    const response = await axios.get(url, { responseType: 'stream' });

    if (storeInMongo) {
      const file = new File({
        name: filename,
        content: await streamToBuffer(response.data)
      });

      await file.save();
      res.send({ message: 'Saved to MongoDB' });
    } else {
      // If destination is a directory, use the provided filename to form the complete path
      const finalDestination = path.join(destination, filename);

      // Log the final destination for debugging
      console.log("Saving to:", finalDestination);

      if (!fs.existsSync(destination)) {
        return res.status(400).json({ error: `Destination directory doesn't exist: ${destination}` });
      }

      const writer = fs.createWriteStream(finalDestination);
      response.data.pipe(writer);

      response.data.on('error', err => {
        console.error('Error in incoming stream:', err);
      });

      writer.on('finish', () => {
        res.send({ message: 'Saved locally' });
      });

      writer.on('error', (err) => {
        res.status(500).json({ error: 'Failed to save file locally: ' + err.message });
      });
    }
  } catch (error) {
    console.error('Download Error:', error); // Log the entire error object
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Axios Config Error:', error.message);
    }
    res.status(500).json({ error: 'Failed to download the file.' });
  }
});

// Endpoint to fetch all the downloads, no matter the location. Defaults to looking at /tmp
app.get('/downloads', async (req, res) => {
  try {
    // Fetch files from MongoDB
    const filesFromDB = await File.find({});

    const dbFilesDetails = filesFromDB.map(file => ({
      filename: file.name,
      id: file._id,
      size: Buffer.from(file.content).length,
      source: 'MongoDB'
    }));

    // Fetch local files
    const localFiles = fs.readdirSync(localSaveDirectory).filter(file => {
      return fs.statSync(path.join(localSaveDirectory, file)).isFile();
    });

    const localFilesDetails = localFiles.map(file => ({
      filename: file,
      size: fs.statSync(path.join(localSaveDirectory, file)).size,
      source: 'Local'
    }));

    // Merge both lists
    const allFiles = [...dbFilesDetails, ...localFilesDetails];

    res.send({ files: allFiles });

  } catch (error) {
    console.error("Download Error:", error); //Error diagnosis 
    res.status(500).json({ error: 'Failed to fetch downloads.' });
  }
});

// Endpoint to fetch a single download by its MongoDB ID or filename
app.get('/download/:id', async (req, res) => {
  const { identifier } = req.params.id;
  try {
    // First, attempt to retrieve from MongoDB by ID
    const file = await File.findById(identifier);
    if (!file) {

      res.status(404).json({ error: `File not found in MongoDB.` });
      return;
    }
    res.set('Content-Type', 'application/octet-stream');
    res.send({
      filename: file.name,
      content: file.content, // This sends the raw content, you might want to adjust based on your requirements
      source: 'MongoDB'
    });
    // If not found in MongoDB, attempt to fetch from local storage by filename
    const localFilePath = path.join(localSaveDirectory, identifier);

    if (fs.existsSync(localFilePath)) {
      res.sendFile(localFilePath); // Send the actual file
      return;
    }

    // If not found in both places
    res.status(404).json({ error: 'Download not found.' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the download.' });
  }
});

// Endpoint to delete a single download by its MongoDB ID or filename
app.delete('/download/:id', async (req, res) => {
  const { identifier } = req.params.id;
  try {
    // First, attempt to delete from MongoDB by ID
    const file = await File.findById(identifier);

    if (file) {
      await File.findByIdAndDelete(identifier);
      res.send({ message: 'File deleted from MongoDB.' });
      return;
    }

    // If not found in MongoDB, attempt to delete from local storage by filename
    const localFilePath = path.join(localSaveDirectory, identifier);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      res.send({ message: 'File deleted from local storage.' });
      return;
    }

    // If not found in both places
    res.status(404).json({ error: 'Download not found.' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the download.' });
  }
});


app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: 'Internal server error. Please try again later.' });
});

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const buffers = [];
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
    stream.on('error', reject);
  });
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
