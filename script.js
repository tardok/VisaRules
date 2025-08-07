// Authentication check
let userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display current user
document.addEventListener('DOMContentLoaded', function() {
    const currentUserElement = document.getElementById('currentUser');
    if (currentUserElement && currentUser) {
        currentUserElement.textContent = `Welcome, ${currentUser.username}`;
        
        // Make username clickable
        currentUserElement.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }
});

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// API Configuration
const API_CONFIG = {
    baseUrl: 'https://visa-requirement.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': '2301ce502cmshd749d36b208985ap17a90bjsna0f85904fb8e',
        'X-RapidAPI-Host': 'visa-requirement.p.rapidapi.com',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

// Logging Configuration
const LOG_CONFIG = {
    logFile: 'visa_requests.log',
    maxLogSize: 10 * 1024 * 1024, // 10MB
    maxLogEntries: 1000
};

// Server Configuration
const SERVER_CONFIG = {
    baseUrl: window.location.origin, // Automatically detect server URL
    endpoints: {
        logs: '/api/logs',
        stats: '/api/stats',
        export: '/api/logs/export'
    }
};

// Logging Functions
async function logRequest(requestData) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'REQUEST',
        data: requestData,
        username: currentUser ? currentUser.username : 'anonymous'
    };
    
    try {
        // Send to server
        const response = await fetch(`${SERVER_CONFIG.baseUrl}${SERVER_CONFIG.endpoints.logs}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'REQUEST',
                data: requestData,
                username: currentUser ? currentUser.username : 'anonymous'
            })
        });

        if (response.ok) {
            console.log('📝 Logged Request to server:', logEntry);
        } else {
            console.error('Failed to log request to server:', response.status);
            // Fallback to localStorage if server is unavailable
            fallbackToLocalStorage(logEntry);
        }
    } catch (error) {
        console.error('Error logging request to server:', error);
        // Fallback to localStorage if server is unavailable
        fallbackToLocalStorage(logEntry);
    }
}

async function logResponse(responseData) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'RESPONSE',
        data: responseData,
        username: currentUser ? currentUser.username : 'anonymous'
    };
    
    try {
        // Send to server
        const response = await fetch(`${SERVER_CONFIG.baseUrl}${SERVER_CONFIG.endpoints.logs}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'RESPONSE',
                data: responseData,
                username: currentUser ? currentUser.username : 'anonymous'
            })
        });

        if (response.ok) {
            console.log('📝 Logged Response to server:', logEntry);
        } else {
            console.error('Failed to log response to server:', response.status);
            // Fallback to localStorage if server is unavailable
            fallbackToLocalStorage(logEntry);
        }
    } catch (error) {
        console.error('Error logging response to server:', error);
        // Fallback to localStorage if server is unavailable
        fallbackToLocalStorage(logEntry);
    }
}

async function logError(errorData) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'ERROR',
        data: errorData,
        username: currentUser ? currentUser.username : 'anonymous'
    };
    
    try {
        // Send to server
        const response = await fetch(`${SERVER_CONFIG.baseUrl}${SERVER_CONFIG.endpoints.logs}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'ERROR',
                data: errorData,
                username: currentUser ? currentUser.username : 'anonymous'
            })
        });

        if (response.ok) {
            console.log('📝 Logged Error to server:', logEntry);
        } else {
            console.error('Failed to log error to server:', response.status);
            // Fallback to localStorage if server is unavailable
            fallbackToLocalStorage(logEntry);
        }
    } catch (error) {
        console.error('Error logging error to server:', error);
        // Fallback to localStorage if server is unavailable
        fallbackToLocalStorage(logEntry);
    }
}

// Fallback function for when server is unavailable
function fallbackToLocalStorage(logEntry) {
    try {
        const logs = JSON.parse(localStorage.getItem('visaLogs') || '[]');
        logs.push(logEntry);
        
        // Keep only the last 100 entries to prevent localStorage overflow
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('visaLogs', JSON.stringify(logs));
        console.log('📝 Fallback: Logged to localStorage:', logEntry);
    } catch (error) {
        console.error('Error logging to localStorage:', error);
    }
}

async function exportLogs() {
    try {
        // Try to export from server first
        const response = await fetch(`${SERVER_CONFIG.baseUrl}${SERVER_CONFIG.endpoints.export}`, {
            method: 'GET'
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `visa_logs_${new Date().toISOString().split('T')[0]}.jsonl`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('📁 Logs exported from server successfully');
        } else {
            // Fallback to localStorage export
            fallbackExportFromLocalStorage();
        }
    } catch (error) {
        console.error('Error exporting logs from server:', error);
        // Fallback to localStorage export
        fallbackExportFromLocalStorage();
    }
}

// Fallback export function for when server is unavailable
function fallbackExportFromLocalStorage() {
    try {
        const logs = JSON.parse(localStorage.getItem('visaLogs') || '[]');
        const logText = logs.map(log => 
            `[${log.timestamp}] ${log.type}: ${JSON.stringify(log.data, null, 2)}`
        ).join('\n\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visa_logs_local_${new Date().toISOString().split('T')[0]}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📁 Fallback: Logs exported from localStorage');
    } catch (error) {
        console.error('Error exporting logs from localStorage:', error);
    }
}

// Country data with ISO codes and names
const COUNTRIES = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AG', name: 'Antigua & Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia & Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BR', name: 'Brazil' },
    { code: 'BN', name: 'Brunei' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' },
    { code: 'CV', name: 'Cape Verde' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CG', name: 'Congo' },
    { code: 'CD', name: 'Congo (Dem. Rep.)' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CI', name: 'Cote d\'Ivoire' },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GR', name: 'Greece' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'XK', name: 'Kosovo' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MO', name: 'Macau' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KP', name: 'North Korea' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestinian Territories' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russian Federation' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome and Principe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'KR', name: 'South Korea' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'ES', name: 'Spain' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syria' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Türkiye' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States of America' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VA', name: 'Vatican City' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VN', name: 'Viet Nam' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' }
];

// DOM Elements
const elements = {
    form: document.getElementById('visaForm'),
    passportSelect: document.getElementById('passport'),
    destinationSelect: document.getElementById('destination'),
    loading: document.getElementById('loading'),
    result: document.getElementById('result'),
    resultContent: document.getElementById('resultContent'),
    tripFrom: document.getElementById('tripFrom'),
    tripTo: document.getElementById('tripTo'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('errorMessage')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    populateCountrySelects();
    setupEventListeners();
    
    // Pre-populate nationality if available in profile (after countries are loaded)
    if (userProfile.nationality) {
        setTimeout(() => {
            const passportSelect = document.getElementById("passport");
            if (passportSelect) {
                // Find the option with matching text content
                const options = passportSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].textContent === userProfile.nationality) {
                        passportSelect.value = options[i].value;
                        console.log("Pre-populated nationality:", userProfile.nationality);
                        break;
                    }
                }
            }
        }, 100); // Small delay to ensure countries are loaded
    }
});

// Populate country select dropdowns
function populateCountrySelects() {
    const sortedCountries = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        
        elements.passportSelect.appendChild(option.cloneNode(true));
        elements.destinationSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    elements.form.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const passport = elements.passportSelect.value;
    const destination = elements.destinationSelect.value;
    
    if (!passport || !destination) {
        showError('Please select both your nationality and destination country.');
        return;
    }
    
    if (passport === destination) {
        showError('Please select different countries for nationality and destination.');
        return;
    }
    
    // Log the request
    const requestData = {
        passport: passport,
        destination: destination,
        passportName: getCountryName(passport),
        destinationName: getCountryName(destination),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    logRequest(requestData);
    
    showLoading();
    hideError();
    hideResult();
    
    try {
        const visaInfo = await checkVisaRequirements(passport, destination);
        
        // Log the successful response
        logResponse({
            request: requestData,
            response: visaInfo,
            success: true
        });
        
        displayResults(passport, destination, visaInfo);
    } catch (error) {
        console.error('Error checking visa requirements:', error);
        
        // Log the error
        logError({
            request: requestData,
            error: error.message,
            stack: error.stack,
            success: false
        });
        
        showError('Failed to check visa requirements. Please try again later.');
    }
}

// Check visa requirements using the API
async function checkVisaRequirements(passport, destination) {
    const url = `${API_CONFIG.baseUrl}/`;
    
    console.log('API Call Details:');
    console.log('URL:', url);
    console.log('Passport:', passport);
    console.log('Destination:', destination);
    console.log('Headers:', API_CONFIG.headers);
    
    const formData = new URLSearchParams();
    formData.append('passport', passport);
    formData.append('destination', destination);
    
    console.log('Form Data:', formData.toString());
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: formData
        });
        
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API Response Data:', data);
        return data;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

// Display results
function displayResults(passport, destination, visaInfo) {
    const passportCountry = getCountryName(passport);
    const destinationCountry = getCountryName(destination);
    
    elements.tripFrom.textContent = passportCountry;
    elements.tripTo.textContent = destinationCountry;
    
    const resultHTML = generateResultHTML(visaInfo);
    elements.resultContent.innerHTML = resultHTML;
    
    hideLoading();
    showResult();
}

// Generate HTML for visa results
function generateResultHTML(visaInfo) {
    console.log('Raw API Response:', visaInfo);
    console.log('visaInfo.visa:', visaInfo.visa);
    console.log('visaInfo.color:', visaInfo.color);
    console.log('All visaInfo keys:', Object.keys(visaInfo));
    
    let html = '';
    
    // Parse the visa status based on the actual API response
    const visaStatus = visaInfo.visa ? visaInfo.visa.toLowerCase() : '';
    const color = visaInfo.color ? visaInfo.color.toLowerCase() : '';
    
    console.log('Parsed visa status:', visaStatus);
    console.log('Parsed color:', color);
    
    // Determine visa requirement based on visa field and color
    if (visaStatus.includes('visa required') || color === 'red') {
        html += `
            <div class="visa-status required">
                <div class="status-image">
                    <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&h=200&fit=crop&crop=face" alt="Sad Tiger" class="status-img">
                </div>
                <div class="status-content">
                    <i class="fas fa-times-circle"></i>
                    <span>Visa Required</span>
                </div>
            </div>
        `;
    } else if (visaStatus.includes('visa on arrival') || color === 'blue') {
        html += `
            <div class="visa-status on-arrival">
                <div class="status-image">
                    <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&h=200&fit=crop&crop=face" alt="Sad Tiger" class="status-img">
                </div>
                <div class="status-content">
                    <i class="fas fa-plane-arrival"></i>
                    <span>Visa on Arrival Available</span>
                </div>
            </div>
        `;
    } else if (visaStatus.includes('eta') || visaStatus.includes('electronic travel authorization') || color === 'yellow') {
        html += `
            <div class="visa-status eta">
                <div class="status-image">
                    <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&h=200&fit=crop&crop=face" alt="Sad Tiger" class="status-img">
                </div>
                <div class="status-content">
                    <i class="fas fa-clipboard-check"></i>
                    <span>Electronic Travel Authorization (eTA) Required</span>
                </div>
            </div>
        `;
    } else if (visaStatus.includes('visa not required') || visaStatus.includes('no visa required') || color === 'green') {
        html += `
            <div class="visa-status not-required">
                <div class="status-image">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Happy Person" class="status-img">
                </div>
                <div class="status-content">
                    <i class="fas fa-check-circle"></i>
                    <span>Visa Not Required</span>
                </div>
            </div>
        `;
    } else {
        // Fallback: display the raw visa status
        html += `
            <div class="visa-status not-required">
                <div class="status-image">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Happy Person" class="status-img">
                </div>
                <div class="status-content">
                    <i class="fas fa-info-circle"></i>
                    <span>${visaInfo.visa || 'Visa status unknown'}</span>
                </div>
            </div>
        `;
    }
    
    // Add additional details if available
    if (visaInfo.except_text || visaInfo.stay_of || visaInfo.pass_valid) {
        html += `
            <div class="visa-details">
                <h3>Additional Information</h3>
                ${visaInfo.except_text ? `<p><strong>Exceptions:</strong> ${visaInfo.except_text}</p>` : ''}
                ${visaInfo.stay_of ? `<p><strong>Stay Duration:</strong> ${visaInfo.stay_of}</p>` : ''}
                ${visaInfo.pass_valid ? `<p><strong>Passport Validity:</strong> ${visaInfo.pass_valid}</p>` : ''}
            </div>
        `;
    }
    
    // Add destination country information including capital city
    if (visaInfo.capital || visaInfo.currency || visaInfo.timezone || visaInfo.phone_code) {
        html += `
            <div class="visa-details">
                <h3>Destination Country Information</h3>
                ${visaInfo.capital ? `<p><strong>Capital City:</strong> ${visaInfo.capital}</p>` : ''}
                ${visaInfo.currency ? `<p><strong>Currency:</strong> ${visaInfo.currency}</p>` : ''}
                ${visaInfo.timezone ? `<p><strong>Timezone:</strong> ${visaInfo.timezone}</p>` : ''}
                ${visaInfo.phone_code ? `<p><strong>Phone Code:</strong> ${visaInfo.phone_code}</p>` : ''}
            </div>
        `;
    }
    
    // Add embassy information if available
    if (visaInfo.embassy) {
        html += `
            <div class="visa-details">
                <h3>Embassy Information</h3>
                <p><a href="${visaInfo.embassy}" target="_blank" rel="noopener noreferrer">Visit Embassy Website</a></p>
            </div>
        `;
    }
    
    return html;
}

// Get country name from code
function getCountryName(code) {
    const country = COUNTRIES.find(c => c.code === code);
    return country ? country.name : code;
}

// UI Helper Functions
function showLoading() {
    elements.loading.classList.remove('hidden');
}

function hideLoading() {
    elements.loading.classList.add('hidden');
}

function showResult() {
    elements.result.classList.remove('hidden');
}

function hideResult() {
    elements.result.classList.add('hidden');
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.error.classList.remove('hidden');
}

function hideError() {
    elements.error.classList.add('hidden');
} 

