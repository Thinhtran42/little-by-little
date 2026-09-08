import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';
// Run against a separately started production container/server.
export default defineConfig({ ...base, testMatch: ['**/app.spec.js', '**/cloud.spec.js'], webServer: undefined, use: {...base.use, baseURL: process.env.RELEASE_URL || 'http://127.0.0.1:4180'} });
