const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the root or a folder like 'public'
app.use(express.static(path.join(__dirname, 'public')));

// For example, if your index.html is in the root directory:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
