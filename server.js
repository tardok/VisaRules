const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Rate limiting to prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/logs', limiter);

// Log file paths
const LOG_DIR = path.join(__dirname, 'logs');
const REQUEST_LOG_FILE = path.join(LOG_DIR, 'visa_requests.jsonl');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'visa_errors.jsonl');
const STATS_FILE = path.join(LOG_DIR, 'stats.json');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Initialize stats file if it doesn't exist
if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify({
        totalRequests: 0,
        totalResponses: 0,
        totalErrors: 0,
        lastUpdated: new Date().toISOString()
    }));
}

// Helper function to write log entry
function writeLogEntry(logFile, entry) {
    try {
        const logLine = JSON.stringify(entry) + '\n';
        fs.appendFileSync(logFile, logLine);
        return true;
    } catch (error) {
        console.error(`Error writing to log file ${logFile}:`, error);
        return false;
    }
}

// Helper function to update stats
function updateStats(type) {
    try {
        const stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
        stats[`total${type}`]++;
        stats.lastUpdated = new Date().toISOString();
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// API endpoint to receive logs
app.post('/api/logs', (req, res) => {
    try {
        const { type, data, username } = req.body;
        
        if (!type || !data) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: type and data' 
            });
        }
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: type,
            data: data,
            username: username || 'anonymous',
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress,
            requestId: Math.random().toString(36).substr(2, 9)
        };

        let success = false;
        
        if (type === 'ERROR') {
            success = writeLogEntry(ERROR_LOG_FILE, logEntry);
        } else {
            success = writeLogEntry(REQUEST_LOG_FILE, logEntry);
        }

        if (success) {
            updateStats(type === 'ERROR' ? 'Errors' : type === 'REQUEST' ? 'Requests' : 'Responses');
            res.json({ success: true, message: 'Log entry saved successfully' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to write log entry' });
        }

    } catch (error) {
        console.error('Error processing log request:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// API endpoint to get logs (for admin panel)
app.get('/api/logs', (req, res) => {
    try {
        const { type, limit = 100, offset = 0 } = req.query;
        
        let logFile = REQUEST_LOG_FILE;
        if (type === 'ERROR') {
            logFile = ERROR_LOG_FILE;
        }

        if (!fs.existsSync(logFile)) {
            return res.json({ logs: [], total: 0 });
        }

        const logContent = fs.readFileSync(logFile, 'utf8');
        const lines = logContent.trim().split('\n').filter(line => line.length > 0);
        
        // Parse JSON lines and reverse to get newest first
        const logs = lines
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return null;
                }
            })
            .filter(log => log !== null)
            .reverse();

        // Apply pagination
        const paginatedLogs = logs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

        res.json({
            logs: paginatedLogs,
            total: logs.length,
            hasMore: parseInt(offset) + parseInt(limit) < logs.length
        });

    } catch (error) {
        console.error('Error reading logs:', error);
        res.status(500).json({ error: 'Failed to read logs' });
    }
});

// API endpoint to get statistics
app.get('/api/stats', (req, res) => {
    try {
        const stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
        
        // Get file sizes
        const requestLogSize = fs.existsSync(REQUEST_LOG_FILE) ? 
            fs.statSync(REQUEST_LOG_FILE).size : 0;
        const errorLogSize = fs.existsSync(ERROR_LOG_FILE) ? 
            fs.statSync(ERROR_LOG_FILE).size : 0;

        res.json({
            ...stats,
            requestLogSize: requestLogSize,
            errorLogSize: errorLogSize,
            requestLogSizeMB: (requestLogSize / (1024 * 1024)).toFixed(2),
            errorLogSizeMB: (errorLogSize / (1024 * 1024)).toFixed(2)
        });

    } catch (error) {
        console.error('Error reading stats:', error);
        res.status(500).json({ error: 'Failed to read statistics' });
    }
});

// API endpoint to export logs
app.get('/api/logs/export', (req, res) => {
    try {
        const { type } = req.query;
        let logFile = REQUEST_LOG_FILE;
        
        if (type === 'ERROR') {
            logFile = ERROR_LOG_FILE;
        }

        if (!fs.existsSync(logFile)) {
            return res.status(404).json({ error: 'Log file not found' });
        }

        const filename = `visa_logs_${type || 'all'}_${new Date().toISOString().split('T')[0]}.jsonl`;
        
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        const fileStream = fs.createReadStream(logFile);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error exporting logs:', error);
        res.status(500).json({ error: 'Failed to export logs' });
    }
});

// API endpoint to clear logs
app.delete('/api/logs', (req, res) => {
    try {
        const { type } = req.body;
        
        if (type === 'ERROR') {
            if (fs.existsSync(ERROR_LOG_FILE)) {
                fs.writeFileSync(ERROR_LOG_FILE, '');
            }
        } else if (type === 'REQUEST') {
            if (fs.existsSync(REQUEST_LOG_FILE)) {
                fs.writeFileSync(REQUEST_LOG_FILE, '');
            }
        } else {
            // Clear both files
            if (fs.existsSync(REQUEST_LOG_FILE)) {
                fs.writeFileSync(REQUEST_LOG_FILE, '');
            }
            if (fs.existsSync(ERROR_LOG_FILE)) {
                fs.writeFileSync(ERROR_LOG_FILE, '');
            }
        }

        // Reset stats
        fs.writeFileSync(STATS_FILE, JSON.stringify({
            totalRequests: 0,
            totalResponses: 0,
            totalErrors: 0,
            lastUpdated: new Date().toISOString()
        }));

        res.json({ success: true, message: 'Logs cleared successfully' });

    } catch (error) {
        console.error('Error clearing logs:', error);
        res.status(500).json({ error: 'Failed to clear logs' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Logs will be stored in: ${LOG_DIR}`);
    console.log(`📊 Admin panel available at: http://localhost:${PORT}/logs.html`);
});

module.exports = app; 