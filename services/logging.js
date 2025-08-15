const {Logging} = require('@google-cloud/logging');

class LoggingService {
    constructor() {
        this.logging = new Logging();
        this.logName = 'visa-checker-logs';
        this.log = this.logging.log(this.logName);
    }

    async logVisaRequest(requestData) {
        const metadata = {
            severity: 'INFO',
            resource: {
                type: 'global',
                labels: {
                    project_id: process.env.GOOGLE_CLOUD_PROJECT || 'visa-rules-project'
                }
            },
            labels: {
                type: 'visa_request',
                service: 'visa-checker'
            }
        };

        const entry = this.log.entry(metadata, {
            timestamp: new Date().toISOString(),
            type: 'REQUEST',
            data: requestData,
            userAgent: requestData.userAgent,
            ip: requestData.ip
        });

        await this.log.write(entry);
    }

    async logVisaResponse(responseData) {
        const metadata = {
            severity: 'INFO',
            resource: {
                type: 'global',
                labels: {
                    project_id: process.env.GOOGLE_CLOUD_PROJECT || 'visa-rules-project'
                }
            },
            labels: {
                type: 'visa_response',
                service: 'visa-checker'
            }
        };

        const entry = this.log.entry(metadata, {
            timestamp: new Date().toISOString(),
            type: 'RESPONSE',
            data: responseData
        });

        await this.log.write(entry);
    }

    async logError(errorData) {
        const metadata = {
            severity: 'ERROR',
            resource: {
                type: 'global',
                labels: {
                    project_id: process.env.GOOGLE_CLOUD_PROJECT || 'visa-rules-project'
                }
            },
            labels: {
                type: 'visa_error',
                service: 'visa-checker'
            }
        };

        const entry = this.log.entry(metadata, {
            timestamp: new Date().toISOString(),
            type: 'ERROR',
            data: errorData
        });

        await this.log.write(entry);
    }

    async getLogs(options = {}) {
        const {type, limit = 100, startTime, endTime} = options;
        
        let filter = `resource.type="global" AND logName="projects/${process.env.GOOGLE_CLOUD_PROJECT || 'visa-rules-project'}/logs/${this.logName}"`;
        
        if (type) {
            filter += ` AND labels.type="${type}"`;
        }
        
        if (startTime) {
            filter += ` AND timestamp>="${startTime}"`;
        }
        
        if (endTime) {
            filter += ` AND timestamp<="${endTime}"`;
        }

        try {
            const [entries] = await this.logging.getEntries({
                filter: filter,
                orderBy: 'timestamp desc',
                pageSize: limit
            });

            return entries.map(entry => ({
                timestamp: entry.metadata.timestamp,
                severity: entry.metadata.severity,
                type: entry.data.type,
                data: entry.data.data,
                labels: entry.metadata.labels
            }));
        } catch (error) {
            console.error('Error fetching logs from Google Cloud:', error);
            return [];
        }
    }

    async getStats() {
        try {
            const [entries] = await this.logging.getEntries({
                filter: `resource.type="global" AND logName="projects/${process.env.GOOGLE_CLOUD_PROJECT || 'visa-rules-project'}/logs/${this.logName}"`,
                pageSize: 1000
            });

            const stats = {
                totalRequests: 0,
                totalResponses: 0,
                totalErrors: 0,
                lastUpdated: new Date().toISOString()
            };

            entries.forEach(entry => {
                if (entry.data && entry.data.type) {
                    switch (entry.data.type) {
                        case 'REQUEST':
                            stats.totalRequests++;
                            break;
                        case 'RESPONSE':
                            stats.totalResponses++;
                            break;
                        case 'ERROR':
                            stats.totalErrors++;
                            break;
                    }
                }
            });

            return stats;
        } catch (error) {
            console.error('Error fetching stats from Google Cloud:', error);
            return {
                totalRequests: 0,
                totalResponses: 0,
                totalErrors: 0,
                lastUpdated: new Date().toISOString()
            };
        }
    }
}

module.exports = new LoggingService();
