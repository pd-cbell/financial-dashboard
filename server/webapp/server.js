const express = require('express');
const path = require('path');
const app = express();

// Port for this webapp
const PORT = 3001; // Choose a different port from your main app

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for unmatched requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Webapp running at http://localhost:${PORT}`);
});
