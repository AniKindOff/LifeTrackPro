import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3964;

console.log('Starting local server...');
console.log(`Static directory: ${path.join(__dirname, 'static-export')}`);

// Enable detailed logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from the static-export directory
app.use(express.static(path.join(__dirname, 'static-export')));

// Handle API routes by serving JSON files
app.get('/api/:resource', (req, res) => {
  const resource = req.params.resource;
  const filePath = path.join(__dirname, 'static-export', 'api', `${resource}.json`);
  
  console.log(`API Request: ${resource}, Looking for file: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(`Found API data for ${resource}`);
    res.json(JSON.parse(data));
  } else {
    console.error(`API resource not found: ${resource}`);
    res.status(404).json({ error: 'Resource not found' });
  }
});

// For any other request, serve the index.html file
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'static-export', 'index.html');
  console.log(`Serving index.html for path: ${req.url}`);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('Error: index.html not found!');
    res.status(404).send('Error: Application files not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Use hash-based routing in the browser');
  console.log('Press Ctrl+C to stop the server');
}); 