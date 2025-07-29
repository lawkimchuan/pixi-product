import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve built static frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for SPA routes (optional)
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
