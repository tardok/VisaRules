# GlobalVisa - Visa Requirements Checker

A professional web application for checking visa requirements using the Travel Buddy API. Features user authentication, comprehensive logging, and an admin panel.

## Features

- **User Authentication**: Simple username/password registration and login system
- **Visa Requirements Checker**: Check visa requirements for any nationality to destination combination
- **Real-time API Integration**: Uses Travel Buddy API for up-to-date visa information
- **Visual Status Indicators**: Happy person for visa-free travel, sad tiger for visa requirements
- **Comprehensive Logging**: Server-side logging with user tracking
- **Admin Panel**: View logs, statistics, and export data
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Inspired by Vialto Partners design aesthetic

## Security Notice

⚠️ **IMPORTANT**: This is a prototype application. Do not use real usernames or passwords. Your credentials are stored locally and are not secure.

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Open your browser and go to `http://localhost:3000`
   - You'll be redirected to the login page (`index.html`)

## Usage

### For Users

1. **Registration**:
   - Click "Register here" on the login page
   - Create a username (minimum 3 characters) and password (minimum 6 characters)
   - Read and acknowledge the security warning
   - Click "Register"

2. **Login**:
   - Enter your username and password
   - Click "Login"

3. **Check Visa Requirements**:
   - Select your nationality from the dropdown
   - Select your destination country
   - Click "Check Visa Requirements"
   - View the results with visual indicators

4. **Logout**:
   - Click the "Logout" button in the top navigation

### For Administrators

1. **Access Admin Panel**:
   - Click the "Admin" link in the navigation bar
   - Or go directly to `http://localhost:3000/logs.html`

2. **View Logs**:
   - See all user requests and API responses
   - View user information for each log entry
   - Check statistics including active user count

3. **Export Logs**:
   - Click the export button (download icon) in the navigation
   - Or use the "Export Logs" button in the admin panel

4. **Clear Logs**:
   - Use the "Clear All" button in the admin panel

## File Structure

```
VisaRules/
├── index.html          # Login/Registration page
├── app.html            # Main application page
├── logs.html           # Admin panel
├── styles.css          # All styling
├── script.js           # Main application logic
├── auth.js             # Authentication logic
├── server.js           # Node.js server for logging
├── package.json        # Dependencies and scripts
├── install.bat         # Windows installation script
├── install.sh          # Unix/Linux installation script
└── .gitignore          # Git ignore rules
```

## API Configuration

The application uses the Travel Buddy Visa Requirements API:
- **Base URL**: `https://visa-requirement.p.rapidapi.com`
- **API Key**: Included in the code (for demo purposes)
- **Headers**: X-RapidAPI-Key and X-RapidAPI-Host

## Logging System

### Server-side Logging
- Logs are stored in JSONL format in the `logs/` directory
- Separate files for requests, responses, and errors
- Includes user information, timestamps, and IP addresses
- Automatic log rotation and size management

### Log Files
- `visa_requests.jsonl`: All API requests and responses
- `visa_errors.jsonl`: Error logs
- `stats.json`: Application statistics

## User Data Storage

- **User Accounts**: Stored in browser localStorage (not secure for production)
- **Session Management**: Current user session stored in localStorage
- **Logs**: Stored on server in JSONL files

## Development

### Running in Development Mode
```bash
npm run dev
```

### Adding New Features
1. Frontend changes: Edit HTML, CSS, or JavaScript files
2. Backend changes: Modify `server.js` for new API endpoints
3. Styling: Update `styles.css` following the Vialto Partners design system

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

1. **Server won't start**:
   - Check if Node.js is installed: `node --version`
   - Ensure port 3000 is not in use
   - Run `npm install` to install dependencies

2. **API errors**:
   - Check internet connection
   - Verify API key is valid
   - Check browser console for error details

3. **Logs not appearing**:
   - Ensure server is running
   - Check `logs/` directory exists
   - Verify file permissions

### Getting Help

- Check the browser console for error messages
- Review server logs in the terminal
- Ensure all files are in the correct directory structure

## License

This is a prototype application for demonstration purposes.

## Credits

- **API**: Travel Buddy Visa Requirements API
- **Design Inspiration**: Vialto Partners
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)