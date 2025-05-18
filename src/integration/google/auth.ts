import { google } from "googleapis";
import configuration from "../../configuration";
import { getRedisClient, GOOGLE_TOKEN_KEY } from '../../lib/redis';

if (!process.env.GOOG_API_CREDS){
  throw new Error("No GOOG_API_CREDS has been given in the .env file");
}
const credentials = JSON.parse(process.env.GOOG_API_CREDS);
const { client_id, client_secret, redirect_uris = [configuration.api.googleOauthCallbackUrl] } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

export async function authenticateGoogle() {
  const redisClient = getRedisClient();
  const tokenString = await redisClient.get(GOOGLE_TOKEN_KEY);
  
  if (tokenString) {
    const token = JSON.parse(tokenString);
    // Check if token has expired
    const now = (new Date()).getTime();
    if (now > token.expiry_date) {
      // Token has expired, use refresh token to obtain a new access token
      oAuth2Client.setCredentials({
        refresh_token: token.refresh_token,
      });

      try {
        const response = await oAuth2Client.refreshAccessToken();
        const credentials = response.credentials;
        await redisClient.set(GOOGLE_TOKEN_KEY, JSON.stringify(credentials));
        oAuth2Client.setCredentials(credentials);
      } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
      }
    } else {
      // Token is still valid, set credentials
      oAuth2Client.setCredentials(token);
    }
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
      prompt: 'consent',
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    throw new Error(`Google Drive authentication required. Please contact administrator or authorize APP by clicking <a href="${authUrl}">THIS</a> link.`);
  }

  return oAuth2Client;
}

export async function handleCallback(code: string) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  const redisClient = getRedisClient();
  await redisClient.set(GOOGLE_TOKEN_KEY, JSON.stringify(tokens));
  console.log('Token stored in Redis');
}