import path from 'path';

export type ApplicationConfiguration = {
  environment: string;
  api: {
    googleTokenPath: string;
    googleOauthCallbackUrl: string;
    googleStorageFolderId?: string;
    googleSheetStorageId?: string;
    googleSheetStorageSheetName?: string;
  };
  root: string;
  allowedPhones: string[];
}

const environment = process.env.NODE_ENV || 'development';
/* Main configuration */
const configuration: ApplicationConfiguration = {
  environment,
  api: {
    googleTokenPath: './token/google.json',
    googleOauthCallbackUrl: process.env.GOOG_API_CALLBACK || 'http://localhost:10000/oauth2callback',
    googleStorageFolderId: process.env.GOOG_API_STORAGE_FOLDER_ID,
    googleSheetStorageId: process.env.GOOGLE_API_SHEET_STORAGE_ID,
    googleSheetStorageSheetName: process.env.GOOGLE_API_SHEET_STORAGE_SHEET_NAME,
  },
  root: path.resolve(process.cwd()),
  allowedPhones: JSON.parse(process.env.ALLOWED_PHONES || '[]'),
};

/* Modules configuration */

export default configuration;