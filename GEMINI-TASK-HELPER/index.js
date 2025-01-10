const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const { generateResponse } = require("./controllers/gemini.js");

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Add this line to serve static files

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/generate", generateResponse);

app.get("/generate", (req, res) => {
  res.send(history);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});