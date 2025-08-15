const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const loggingService = require('./services/logging');

const app = express();
const PORT = process.env.PORT || 8080; // Google Cloud uses port 8080

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rate limiting to prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/logs', limiter);

// Log file paths (fallback)
const LOG_DIR = path.join(__dirname, 'logs');
const REQUEST_LOG_FILE = path.join(LOG_DIR, 'visa_requests.jsonl');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'visa_errors.jsonl');
const STATS_FILE = path.join(LOG_DIR, 'stats.json');

// Ensure log directory exists for fallback
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Initialize stats file if it doesn't exist (fallback)
if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify({
        totalRequests: 0,
        totalResponses: 0,
        totalErrors: 0,
        lastUpdated: new Date().toISOString()
    }));
}

// Helper function to write log entry (fallback)
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

// Helper function to update stats (fallback)
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
app.post('/api/logs', async (req, res) => {
    try {
        const { type, data, username } = req.body;
        
        if (!type || !data) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: type and data' 
            });
        }
        
        const logData = {
            ...data,
            username: username || 'anonymous',
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress,
            requestId: Math.random().toString(36).substr(2, 9)
        };

        // Try Google Cloud Logging first
        try {
            if (type === 'ERROR') {
                await loggingService.logError(logData);
            } else if (type === 'REQUEST') {
                await loggingService.logVisaRequest(logData);
            } else if (type === 'RESPONSE') {
                await loggingService.logVisaResponse(logData);
            }
            
            res.json({ success: true, message: 'Log entry saved to Google Cloud Logging' });
        } catch (loggingError) {
            console.error('Google Cloud Logging error:', loggingError);
            
            // Fallback to local file logging
            const logEntry = {
                timestamp: new Date().toISOString(),
                type: type,
                data: logData
            };

            let success = false;
            
            if (type === 'ERROR') {
                success = writeLogEntry(ERROR_LOG_FILE, logEntry);
            } else {
                success = writeLogEntry(REQUEST_LOG_FILE, logEntry);
            }

            if (success) {
                updateStats(type === 'ERROR' ? 'Errors' : type === 'REQUEST' ? 'Requests' : 'Responses');
                res.json({ success: true, message: 'Log entry saved (fallback to local file)' });
            } else {
                res.status(500).json({ success: false, error: 'Failed to write log entry' });
            }
        }

    } catch (error) {
        console.error('Error processing log request:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// API endpoint to get logs (for admin panel)
app.get('/api/logs', async (req, res) => {
    try {
        const { type, limit = 100, offset = 0, source = 'google-cloud' } = req.query;
        
        if (source === 'google-cloud') {
            // Try Google Cloud Logging first
            try {
                const logs = await loggingService.getLogs({
                    type: type,
                    limit: parseInt(limit)
                });

                // Apply pagination
                const paginatedLogs = logs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

                res.json({
                    logs: paginatedLogs,
                    total: logs.length,
                    hasMore: parseInt(offset) + parseInt(limit) < logs.length,
                    source: 'google-cloud-logging'
                });
            } catch (error) {
                console.error('Error fetching from Google Cloud:', error);
                // Fallback to local files
                return getLogsFromLocalFiles(req, res);
            }
        } else {
            // Use local files
            return getLogsFromLocalFiles(req, res);
        }

    } catch (error) {
        console.error('Error reading logs:', error);
        res.status(500).json({ error: 'Failed to read logs' });
    }
});

// Helper function to get logs from local files
function getLogsFromLocalFiles(req, res) {
    try {
        const { type, limit = 100, offset = 0 } = req.query;
        
        let logFile = REQUEST_LOG_FILE;
        if (type === 'ERROR') {
            logFile = ERROR_LOG_FILE;
        }

        if (!fs.existsSync(logFile)) {
            return res.json({ logs: [], total: 0, source: 'local-files' });
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
            hasMore: parseInt(offset) + parseInt(limit) < logs.length,
            source: 'local-files'
        });

    } catch (error) {
        console.error('Error reading local logs:', error);
        res.status(500).json({ error: 'Failed to read logs' });
    }
}

// API endpoint to get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const { source = 'google-cloud' } = req.query;
        
        if (source === 'google-cloud') {
            try {
                const stats = await loggingService.getStats();
                
                res.json({
                    ...stats,
                    source: 'google-cloud-logging'
                });
            } catch (error) {
                console.error('Error fetching stats from Google Cloud:', error);
                // Fallback to local stats
                return getStatsFromLocalFiles(res);
            }
        } else {
            // Use local stats
            return getStatsFromLocalFiles(res);
        }

    } catch (error) {
        console.error('Error reading stats:', error);
        res.status(500).json({ error: 'Failed to read statistics' });
    }
});

// Helper function to get stats from local files
function getStatsFromLocalFiles(res) {
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
            errorLogSizeMB: (errorLogSize / (1024 * 1024)).toFixed(2),
            source: 'local-files'
        });

    } catch (error) {
        console.error('Error reading local stats:', error);
        res.status(500).json({ error: 'Failed to read statistics' });
    }
}

// API endpoint to export logs
app.get('/api/logs/export', (req, res) => {
    try {
        const { type, source = 'local' } = req.query;
        
        if (source === 'google-cloud') {
            // For Google Cloud, we'll return a message to use the console
            res.json({ 
                message: 'To export logs from Google Cloud Logging, please use the Google Cloud Console or gcloud CLI',
                instructions: 'Use: gcloud logging read "resource.type=global AND logName=visa-checker-logs" --limit=1000 --format=json'
            });
        } else {
            // Export local files
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
        }

    } catch (error) {
        console.error('Error exporting logs:', error);
        res.status(500).json({ error: 'Failed to export logs' });
    }
});

// API endpoint to clear logs
app.delete('/api/logs', (req, res) => {
    try {
        const { type, source = 'local' } = req.body;
        
        if (source === 'google-cloud') {
            res.json({ 
                message: 'To clear logs from Google Cloud Logging, please use the Google Cloud Console',
                note: 'Google Cloud Logging automatically manages log retention'
            });
        } else {
            // Clear local files
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

            res.json({ success: true, message: 'Local logs cleared successfully' });
        }

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
        uptime: process.uptime(),
        logging: 'google-cloud-logging-with-fallback'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Logs will be stored in Google Cloud Logging (with local fallback)`);
    console.log(`📊 Admin panel available at: http://localhost:${PORT}/logs.html`);
    console.log(`🔐 Google Cloud Logging enabled`);
});

module.exports = app; 