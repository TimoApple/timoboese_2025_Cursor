const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '127.0.0.1'; // Nur localhost

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.webm': 'video/webm',
    '.mp4': 'video/mp4',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.pdf': 'application/pdf',
    '.rtf': 'application/rtf',
};

const server = http.createServer((req, res) => {
    // CORS-Header für Netzwerkzugriff
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Query-String entfernen (z.B. ?v=2)
    let urlPath = req.url.split('?')[0];
    let filePath = urlPath === '/' ? 'index.html' : urlPath;
    filePath = path.join(__dirname, filePath);
    filePath = path.normalize(filePath);

    // Sicherheitscheck: Nur Dateien innerhalb des Projektverzeichnisses
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // Prüfen, ob der Pfad ein Verzeichnis ist → index.html laden
    try {
        if (fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
    } catch (e) {
        // existiert nicht → wird später als 404 behandelt
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

function startServer(port) {
    server.listen(port, HOST, () => {
        console.log('');
        console.log('╔══════════════════════════════════════════╗');
        console.log('║     Portfolio Development Server         ║');
        console.log('╠══════════════════════════════════════════╣');
        console.log(`║  Local:    http://localhost:${port}        ║`);
        console.log('╠══════════════════════════════════════════╣');
        console.log('║  Drücke Strg+C zum Beenden              ║');
        console.log('╚══════════════════════════════════════════╝');
        console.log('');
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠ Port ${port} ist belegt, versuche Port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('❌ Server-Fehler:', err.message);
        }
    });
}

startServer(PORT);
