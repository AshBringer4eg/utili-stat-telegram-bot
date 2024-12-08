import path from 'path';


interface DataBaseConfig {
  connectionString: string;
  dialect: "postgres";
  host: string;
  port: number | string;
  username: string;
  password: string;
  database: string;
};

export type ApplicationConfiguration = {
  environment: string;
  db: Partial<DataBaseConfig>;
  api: {
    googleTokenPath: string;
    googleOauthCallbackUrl: string
  };
  root: string;
  allowedPhones: string[];
}

const environment = process.env.NODE_ENV || 'development';
/* Main configuration */
const configuration: ApplicationConfiguration = {
  environment,
  db: {
    connectionString: process.env.DB_CONNECTION_STRING,
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
  },
  api: {
    googleTokenPath: './token/google.json',
    googleOauthCallbackUrl: process.env.GOOG_API_CALLBACK || 'http://localhost:10000/oauth2callback',
  },
  root: path.resolve(process.cwd()),
  allowedPhones: JSON.parse(process.env.ALLOWED_PHONES || '[]'),
};

/* Modules configuration */

export default configuration;