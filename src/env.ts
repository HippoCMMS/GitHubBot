require('dotenv').config();
export const DEBUG = process.env.DEBUG === 'true';
export const PERSONAL_TOKEN = process.env.PERSONAL_TOKEN;
export const ORGANIZATION = process.env.ORGANIZATION as string;
export const PORT = process.env.PORT;
export const ONLY_NEW_EVENTS = process.env.ONLY_NEW_EVENTS === 'true';
export const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
export const ENABLE_PR_QUOTES = process.env.ENABLE_PR_QUOTES === 'true';