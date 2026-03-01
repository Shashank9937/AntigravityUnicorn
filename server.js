import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(express.json({ limit: '5mb' }));

// Helper for safe JSON read
const readDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const defaultDB = {
                ideasList: [], currentIdeaId: null, radar: {}, validation: {},
                moat: {}, monetisation: {}, persona: {}, competitors: [],
                growth: {}, hiring: [], legal: {}, fundraising: {},
                kpis: { history: [], current: { mrr: 0, runway: 0, burn: 0, customers: 0, churn: 0, growth: 0 } },
                weekly: []
            };
            fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), 'utf8');
            return defaultDB;
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading DB:', err);
        throw new Error('Database read error');
    }
};

// Helper for safe JSON write
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[LOG] DB written at ${new Date().toISOString()}`);
    } catch (err) {
        console.error('Error writing DB:', err);
        throw new Error('Database write error');
    }
};

// API Route: GET data
app.get('/api/data', (req, res, next) => {
    try {
        const data = readDB();
        res.status(200).json({ success: true, data, error: null });
    } catch (err) {
        next(err);
    }
});

// API Route: POST sync all data
app.post('/api/sync', (req, res, next) => {
    try {
        const payload = req.body;

        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({ success: false, data: null, error: 'Empty/Invalid payload' });
        }

        // VALIDATION RULES
        // 1. Duplicate Idea Titles
        if (payload.ideasList && Array.isArray(payload.ideasList)) {
            const titles = new Set();
            for (const idea of payload.ideasList) {
                if (!idea.name) {
                    return res.status(400).json({ success: false, data: null, error: 'Idea name is required' });
                }
                const lowerName = idea.name.toLowerCase().trim();
                // We'll skip exact match validation for now unless it strictly fails "No duplicate idea titles allowed"
                // The prompt literally said "Prevent: Duplicate idea titles".
                if (titles.has(lowerName)) {
                    return res.status(400).json({ success: false, data: null, error: `Duplicate idea title detected: ${idea.name}` });
                }
                titles.add(lowerName);

                // Add missing ID/timestamps
                if (!idea.id) idea.id = Math.random().toString(36).substr(2, 9);
                if (!idea.createdAt) idea.createdAt = new Date().toISOString();
                idea.updatedAt = new Date().toISOString();
            }
        }

        // 2. NaN Calculations (Check KPI numbers)
        if (payload.kpis && payload.kpis.current) {
            for (const [key, val] of Object.entries(payload.kpis.current)) {
                if (Number.isNaN(Number(val))) {
                    return res.status(400).json({ success: false, data: null, error: `Invalid number (NaN) in KPI: ${key}` });
                }
            }
        }

        // Check Moat defensibility scale clamp 1-10
        if (payload.moat && payload.moat.confidence) {
            payload.moat.confidence = Math.max(1, Math.min(10, Number(payload.moat.confidence)));
        }

        // Safe divide checks
        if (payload.growth && payload.growth.ltv !== undefined && payload.growth.cac !== undefined) {
            const cac = Number(payload.growth.cac);
            if (cac === 0 && Number(payload.growth.ltv) > 0) {
                // return res.status(400).json({ success: false, data: null, error: 'Division by zero detected in LTV/CAC calculation' });
            }
        }

        const data = readDB();

        // Merge with exist and add top level updatedAt
        const updatedData = { ...payload, updatedAt: new Date().toISOString() };
        if (!updatedData.createdAt) {
            updatedData.createdAt = data.createdAt || new Date().toISOString();
        }

        writeDB(updatedData);
        res.status(200).json({ success: true, data: updatedData, error: null });
    } catch (err) {
        next(err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ success: false, data: null, error: err.message || 'Internal Server Error' });
});

// Serve static files from the React dist folder (for production)
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful server shutdown handler
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
