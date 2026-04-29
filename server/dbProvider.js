/**
 * KanoonSaathi — Database Provider Selector
 * 
 * Dynamically loads the correct database module based on DB_PROVIDER env var.
 * Usage: import * as db from './dbProvider.js';
 * 
 * Supports:
 *   DB_PROVIDER=sqlite   → uses ./db.js (default)
 *   DB_PROVIDER=mongodb  → uses ./mongoDb.js
 */

const DB_PROVIDER = process.env.DB_PROVIDER || 'sqlite';

let dbModule;

if (DB_PROVIDER === 'mongodb') {
  dbModule = await import('./mongoDb.js');
  await dbModule.connectMongo();
  await dbModule.seedAdmin();
  console.log(`   📦 Database: MongoDB Atlas`);
} else {
  dbModule = await import('./db.js');
  console.log(`   📦 Database: SQLite (data/kanoonsaathi.db)`);
}

// Re-export all functions from the selected module
export const createUser = dbModule.createUser;
export const loginUser = dbModule.loginUser;
export const verifyToken = dbModule.verifyToken;
export const getUserById = dbModule.getUserById;
export const updateUserProfile = dbModule.updateUserProfile;
export const resetUserPassword = dbModule.resetUserPassword;
export const logQuery = dbModule.logQuery;
export const logPageView = dbModule.logPageView;
export const logLawSearch = dbModule.logLawSearch;
export const logDraftUsage = dbModule.logDraftUsage;
export const getOverviewStats = dbModule.getOverviewStats;
export const getTopQueries = dbModule.getTopQueries;
export const getTopLawSearches = dbModule.getTopLawSearches;
export const getUsageByLanguage = dbModule.getUsageByLanguage;
export const getUsageByState = dbModule.getUsageByState;
export const getUsageByFeature = dbModule.getUsageByFeature;
export const getDraftUsageStats = dbModule.getDraftUsageStats;
export const getPageViewStats = dbModule.getPageViewStats;
export const getQueryTimeline = dbModule.getQueryTimeline;
export const getRecentQueries = dbModule.getRecentQueries;
export const getAllUsers = dbModule.getAllUsers;

// Provider-specific exports with fallbacks
export const getDbStatus = dbModule.getDbStatus || dbModule.getMongoStatus || (() => ({ connected: true }));
export const disconnectDb = dbModule.disconnectDb || dbModule.disconnectMongo || (() => {});
