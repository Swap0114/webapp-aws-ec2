// index.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('myFile');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Set up a route
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.send('No file selected!');
      } else {
        res.send(`File uploaded: ${req.file.filename}`);
      }
    }
  });
});

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
