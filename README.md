# Visa Requirements Checker

A modern, responsive web application that allows users to check visa requirements for international travel using the Travel Buddy API. Now with **server-side logging** to collect logs from all users in centralized files.

## Features

- **Easy-to-use Interface**: Clean, modern design with intuitive dropdown selections
- **Comprehensive Country List**: Includes all major countries with ISO codes
- **Real-time API Integration**: Connects to Travel Buddy's visa requirements API
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Visual Status Indicators**: Color-coded visa status with appropriate icons
- **Error Handling**: User-friendly error messages and loading states
- **Server-Side Logging**: Centralized logging system that collects data from all users
- **Capital City Information**: Displays destination country's capital city and additional details
- **Advanced Log Management**: Admin panel for viewing, exporting, and managing application logs
- **Fallback Support**: Graceful degradation to localStorage when server is unavailable

## How It Works

1. **Select Nationality**: Choose your passport country from the dropdown
2. **Select Destination**: Choose your travel destination country
3. **Check Requirements**: Click the button to get instant visa information
4. **View Results**: See detailed visa requirements with additional information

## Visa Status Types

The application displays different visa statuses with color-coded indicators:

- 🔴 **Red** - Visa Required
- 🟢 **Green** - Visa Not Required  
- 🔵 **Blue** - Visa on Arrival Available
- 🟡 **Yellow** - Electronic Travel Authorization (eTA) Required

## API Integration

This application uses the [Travel Buddy Visa Requirements API](https://travel-buddy.ai/api/) through RapidAPI. The API provides:

- Real-time visa requirement data
- Detailed information about visa types
- Stay duration information
- Additional notes and requirements

### API Endpoint
- **URL**: `https://visa-requirement.p.rapidapi.com/visa-check`
- **Method**: POST
- **Headers**: 
  - `X-RapidAPI-Key`: Your RapidAPI key
  - `X-RapidAPI-Host`: `visa-requirement.p.rapidapi.com`
  - `Content-Type`: `application/x-www-form-urlencoded`

## File Structure

```
VisaRules/
├── index.html          # Main application interface
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and API integration
├── logs.html           # Administrative log viewer and management panel
├── server.js           # Node.js/Express server for server-side logging
├── package.json        # Node.js dependencies and scripts
├── logs/               # Server log files (created automatically)
│   ├── visa_requests.jsonl  # Request and response logs
│   ├── visa_errors.jsonl    # Error logs
│   └── stats.json           # Statistics file
└── README.md           # Project documentation
```

## Setup and Usage

### Prerequisites
- A modern web browser
- Internet connection for API calls
- RapidAPI account (free tier available)
- **For server-side logging**: Node.js (version 14 or higher)

### Installation Options

#### Option 1: Server-Side Logging (Recommended)
1. **Install Node.js** from [nodejs.org](https://nodejs.org/)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the server**:
   ```bash
   npm start
   ```
4. **Open the application** at `http://localhost:3000`

#### Option 2: Client-Side Only
1. **Open `index.html`** directly in a web browser
2. **Use the application** with localStorage logging only

**Note**: Server-side logging provides centralized log collection from all users, while client-side only stores logs locally in the browser.

### API Key Setup
The application is pre-configured with a RapidAPI key. To use your own:

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Travel Buddy API](https://rapidapi.com/TravelBuddyAI/api/visa-requirement/)
3. Replace the API key in `script.js`:
   ```javascript
   'X-RapidAPI-Key': 'your-api-key-here'
   ```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Async/await, Fetch API, DOM manipulation
- **Font Awesome**: Icons for better UX
- **Google Fonts**: Inter font family for typography

## Server-Side Logging

The application now includes a comprehensive server-side logging system that collects data from all users in centralized files.

### Features
- **Centralized Storage**: All logs are stored in server files, not just browser localStorage
- **Multi-User Support**: Collects logs from all users accessing the application
- **Automatic Fallback**: Gracefully falls back to localStorage if server is unavailable
- **Real-time Statistics**: Live statistics and file size monitoring
- **Export Capabilities**: Download logs in JSONL format for analysis

### Log Files
The server creates the following log files in the `logs/` directory:
- **`visa_requests.jsonl`**: All requests and responses (JSON Lines format)
- **`visa_errors.jsonl`**: All error logs
- **`stats.json`**: Real-time statistics and counters

### Log Entry Structure
Each log entry includes:
- **Timestamp**: ISO format timestamp
- **Type**: REQUEST, RESPONSE, or ERROR
- **Data**: Detailed information about the operation
- **User Agent**: Browser and device information
- **IP Address**: User's IP address (for server logs)
- **Request ID**: Unique identifier for each request

### API Endpoints
The server provides the following endpoints:
- **`POST /api/logs`**: Submit new log entries
- **`GET /api/logs`**: Retrieve logs with pagination
- **`GET /api/stats`**: Get real-time statistics
- **`GET /api/logs/export`**: Export logs as downloadable files
- **`DELETE /api/logs`**: Clear all logs

### Admin Panel
Access the admin panel at `http://localhost:3000/logs.html` to:
- View real-time logs from all users
- Monitor statistics and file sizes
- Export logs in various formats
- Clear logs when needed

### Fallback Support
If the server is unavailable, the application automatically:
- Falls back to localStorage logging
- Continues to function normally
- Attempts to reconnect to server on next request
- Provides clear feedback about connection status

## API Rate Limits

The Travel Buddy API offers:
- **Free Tier**: 600 requests per month
- **Paid Plans**: Starting at $4.99/month for 3,000 requests

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving the UI/UX
- Adding more countries or features

## License

This project is open source and available under the MIT License.

## Support

For API-related issues, contact Travel Buddy support at their [official website](https://travel-buddy.ai/api/).

For application issues, please check the browser console for error messages or contact the development team.

## Future Enhancements

- [ ] Add visa application links
- [ ] Include travel advisories
- [ ] Add passport validity requirements
- [ ] Implement country search functionality
- [ ] Add travel history tracking
- [ ] Include multiple destination planning