import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const initRedis = async () => {
    await redisClient.connect();
};

export const getRedisClient = () => redisClient;

// Key for storing Google OAuth tokens
export const GOOGLE_TOKEN_KEY = 'google_oauth_token'; 