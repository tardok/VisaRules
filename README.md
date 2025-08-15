# GlobalVisa - Visa Requirements Checker

A professional web application for checking visa requirements using the Travel Buddy API. Features user authentication, comprehensive logging with Google Cloud Logging, and an admin panel.

## Features

- **User Authentication**: Simple username/password registration and login system
- **Visa Requirements Checker**: Check visa requirements for any nationality to destination combination
- **Real-time API Integration**: Uses Travel Buddy API for up-to-date visa information
- **Visual Status Indicators**: Happy person for visa-free travel, sad tiger for visa requirements
- **Google Cloud Logging**: Server-side logging with Google Cloud Logging service
- **Admin Panel**: View logs, statistics, and export data
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Inspired by Vialto Partners design aesthetic
- **Fallback Logging**: Local file logging when Google Cloud is unavailable

## Security Notice

⚠️ **IMPORTANT**: This is a prototype application. Do not use real usernames or passwords. Your credentials are stored locally and are not secure.

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Google Cloud account (for production deployment)

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

## Google Cloud Deployment

### Prerequisites
- Google Cloud account
- Google Cloud CLI installed
- Project created in Google Cloud Console

### Deployment Steps

1. **Install Google Cloud CLI**:
   ```bash
   # Download from: https://cloud.google.com/sdk/docs/install
   gcloud init
   gcloud auth login
   ```

2. **Set your project**:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable required APIs**:
   ```bash
   gcloud services enable logging.googleapis.com
   gcloud services enable appengine.googleapis.com
   ```

4. **Deploy to App Engine**:
   ```bash
   gcloud app deploy
   ```

5. **Open your application**:
   ```bash
   gcloud app browse
   ```

### Environment Variables

Update `app.yaml` with your Google Cloud project ID:

```yaml
env_variables:
  NODE_ENV: production
  GOOGLE_CLOUD_PROJECT: "YOUR_PROJECT_ID"
  PORT: 8080
```

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
   - Toggle between Google Cloud Logging and local files

3. **Export Logs**:
   - Click the export button (download icon) in the navigation
   - Or use the "Export Logs" button in the admin panel

4. **Clear Logs**:
   - Use the "Clear All" button in the admin panel

## Logging System

### Google Cloud Logging (Primary)
- Logs are stored in Google Cloud Logging service
- 50 GB/month free tier
- Automatic log retention and management
- Built-in search and filtering capabilities
- Integration with Google Cloud Console

### Local File Logging (Fallback)
- Automatic fallback when Google Cloud is unavailable
- Logs stored in JSONL format in the `logs/` directory
- Separate files for requests, responses, and errors
- Includes user information, timestamps, and IP addresses

### Log Files
- `visa_requests.jsonl`: All API requests and responses (fallback)
- `visa_errors.jsonl`: Error logs (fallback)
- `stats.json`: Application statistics (fallback)

## API Configuration

The application uses the Travel Buddy Visa Requirements API:
- **Base URL**: `https://visa-requirement.p.rapidapi.com`
- **API Key**: Included in the code (for demo purposes)
- **Headers**: X-RapidAPI-Key and X-RapidAPI-Host

## User Data Storage

- **User Accounts**: Stored in browser localStorage (not secure for production)
- **Session Management**: Current user session stored in localStorage
- **Logs**: Stored in Google Cloud Logging (primary) and local files (fallback)

## Development

### Running in Development Mode
```bash
npm run dev
```

### Adding New Features
1. Frontend changes: Edit HTML, CSS, or JavaScript files
2. Backend changes: Modify `server.js` for new API endpoints
3. Styling: Update `styles.css` following the Vialto Partners design system

## Google Cloud Logging Commands

### View Logs in Console
```bash
gcloud logging read "resource.type=global AND logName=visa-checker-logs" --limit=100
```

### Export Logs
```bash
gcloud logging read "resource.type=global AND logName=visa-checker-logs" --limit=1000 --format=json > logs_export.json
```

### Filter by Type
```bash
# View only requests
gcloud logging read "resource.type=global AND logName=visa-checker-logs AND labels.type=visa_request"

# View only errors
gcloud logging read "resource.type=global AND logName=visa-checker-logs AND labels.type=visa_error"
```

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

2. **Google Cloud Logging errors**:
   - Verify Google Cloud project is set correctly
   - Check if Logging API is enabled
   - Ensure proper authentication with `gcloud auth login`

3. **API errors**:
   - Check internet connection
   - Verify API key is valid
   - Check browser console for error details

4. **Logs not appearing**:
   - Check Google Cloud Console for logs
   - Verify fallback local files in `logs/` directory
   - Check server console for error messages

### Getting Help

- Check the browser console for error messages
- Review server logs in the terminal
- Check Google Cloud Console for logging issues
- Ensure all files are in the correct directory structure

## Cost Analysis

### Google Cloud Logging Free Tier
- **50 GB/month** of logs ingested
- **7 days** of log retention
- **Estimated capacity**: 25,000-50,000 requests/month
- **Cost**: $0 (within free tier)

### App Engine Free Tier
- **28 instance hours/day**
- **Automatic scaling**
- **Cost**: $0 (within free tier)

## License

This is a prototype application for demonstration purposes.

## Credits

- **API**: Travel Buddy Visa Requirements API
- **Design Inspiration**: Vialto Partners
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Logging**: Google Cloud Logging