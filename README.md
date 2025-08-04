# Visa Requirements Checker

A modern, responsive web application that allows users to check visa requirements for international travel using the Travel Buddy API.

## Features

- **Easy-to-use Interface**: Clean, modern design with intuitive dropdown selections
- **Comprehensive Country List**: Includes all major countries with ISO codes
- **Real-time API Integration**: Connects to Travel Buddy's visa requirements API
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Visual Status Indicators**: Color-coded visa status with appropriate icons
- **Error Handling**: User-friendly error messages and loading states
- **Comprehensive Logging**: Automatic logging of all requests, responses, and errors
- **Capital City Information**: Displays destination country's capital city and additional details
- **Log Management**: Admin panel for viewing, exporting, and managing application logs

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
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality and API integration
├── logs.html           # Administrative log viewer and management panel
└── README.md           # Project documentation
```

## Setup and Usage

### Prerequisites
- A modern web browser
- Internet connection for API calls
- RapidAPI account (free tier available)

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start checking visa requirements!

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

## Logging and Monitoring

The application includes comprehensive logging functionality:

### Automatic Logging
- **Request Logging**: All user requests are automatically logged with timestamps
- **Response Logging**: API responses are logged for monitoring and debugging
- **Error Logging**: Failed requests and errors are captured with detailed information
- **User Information**: Browser details and user agent information are included

### Log Management
- **Local Storage**: Logs are stored in browser's localStorage (up to 100 entries)
- **Export Functionality**: Logs can be exported as text files for analysis
- **Admin Panel**: Access `logs.html` for a dedicated log management interface
- **Statistics**: View request counts, response rates, and error statistics

### Log Structure
Each log entry includes:
- **Timestamp**: ISO format timestamp
- **Type**: REQUEST, RESPONSE, or ERROR
- **Data**: Detailed information about the operation
- **User Agent**: Browser and device information

### Accessing Logs
1. **Export from Main App**: Click the download icon in the navigation bar
2. **Admin Panel**: Open `logs.html` for detailed log viewing and management
3. **Browser Console**: Logs are also output to the browser console for debugging

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