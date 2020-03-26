const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const memoizee = require('memoizee')

// If modifying these scopes, delete token.json.
const SCOPES = process.env.GOOGLE_SHEET_API_SCOPES || ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const VERSION = process.env.GOOGLE_SHEET_API_VERSION || 'v4'
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, scopes, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, scopes, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, scopes, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
/**
 * Initializes with authorization requests the API
 * @param {{version: string, scopes: Array<string>}} options 
 * @return {Promise<google.sheets>}
 */
const _initializeSheetsApi = ({ version = VERSION, scopes = SCOPES } = {}) => new Promise((resolve, reject) => {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) {
      console.error('Failed to read credentials.json')
      reject(err)
    }
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), scopes, (auth) => {
      try {
        const sheets = google.sheets({ version, auth });
        resolve(sheets)
      } catch (e) {
        reject(e)
      }
    });
  });
})



module.exports = memoizee(_initializeSheetsApi)