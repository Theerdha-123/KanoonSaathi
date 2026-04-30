import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kanoonsaathi-dev-secret-change-in-prod';
const MONGODB_URI = process.env.MONGODB_URI;

// ─── Connection ──────────────────────────────────────────────────────────────

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set in environment variables');

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('   📦 MongoDB connected successfully');
  } catch (err) {
    console.error('   ❌ MongoDB connection failed:', err.message);
    throw err;
  }
}

export async function disconnectMongo() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

export function getMongoStatus() {
  return {
    connected: isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'N/A',
    name: mongoose.connection.name || 'N/A',
  };
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: null },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  state: { type: String, default: null },
  language: { type: String, default: 'en' },
  created_at: { type: Date, default: Date.now },
  last_login: { type: Date, default: null },
});

const querySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  query_text: { type: String, required: true },
  response_text: { type: String, default: null },
  language: { type: String, default: 'en' },
  provider: { type: String, default: null },
  feature: { type: String, default: 'chat' },
  state: { type: String, default: null },
  response_time_ms: { type: Number, default: null },
  created_at: { type: Date, default: Date.now },
});

const pageViewSchema = new mongoose.Schema({
  page: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  language: { type: String, default: 'en' },
  state: { type: String, default: null },
  user_agent: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

const lawSearchSchema = new mongoose.Schema({
  search_term: { type: String, required: true },
  category: { type: String, default: null },
  law_section: { type: String, default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  language: { type: String, default: 'en' },
  created_at: { type: Date, default: Date.now },
});

const draftUsageSchema = new mongoose.Schema({
  template_type: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  language: { type: String, default: 'en' },
  created_at: { type: Date, default: Date.now },
});

// Indexes for analytics performance
querySchema.index({ created_at: -1 });
querySchema.index({ language: 1 });
querySchema.index({ feature: 1 });
pageViewSchema.index({ page: 1 });
pageViewSchema.index({ created_at: -1 });
lawSearchSchema.index({ search_term: 1 });

const User = mongoose.model('User', userSchema);
const Query = mongoose.model('Query', querySchema);
const PageView = mongoose.model('PageView', pageViewSchema);
const LawSearch = mongoose.model('LawSearch', lawSearchSchema);
const DraftUsage = mongoose.model('DraftUsage', draftUsageSchema);

// ─── User Management ─────────────────────────────────────────────────────────

export async function createUser({ name, email, phone, password, role = 'user', state = null, language = 'en' }) {
  const hash = bcrypt.hashSync(password, 10);
  try {
    const user = new User({ name, email: email.toLowerCase(), phone, password_hash: hash, role, state, language });
    const saved = await user.save();
    return { id: saved._id.toString(), name: saved.name, email: saved.email };
  } catch (e) {
    if (e.code === 11000 || e.message?.includes('duplicate')) throw new Error('Account already exists');
    throw e;
  }
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  user.last_login = new Date();
  await user.save();
  const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return {
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role, state: user.state, language: user.language },
  };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch { return null; }
}

export async function getUserById(id) {
  try {
    const user = await User.findById(id).select('-password_hash');
    if (!user) return null;
    return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, role: user.role, state: user.state, language: user.language, created_at: user.created_at, last_login: user.last_login };
  } catch { return null; }
}

export async function updateUserProfile(id, { name, phone, state, language }) {
  await User.findByIdAndUpdate(id, { name, phone, state, language });
  return getUserById(id);
}

export async function resetUserPassword(email, newPassword) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return false;
  user.password_hash = bcrypt.hashSync(newPassword, 10);
  await user.save();
  return true;
}

// ─── Analytics Logging ───────────────────────────────────────────────────────

export async function logQuery({ userId, query, response, language, provider, feature = 'chat', state, responseTime }) {
  try {
    await Query.create({
      user_id: userId || null,
      query_text: query,
      response_text: response?.slice(0, 2000),
      language: language || 'en',
      provider,
      feature,
      state,
      response_time_ms: responseTime,
    });
  } catch (e) { console.error('logQuery error:', e.message); }
}

export async function logPageView({ page, userId, language, state, userAgent }) {
  try {
    await PageView.create({ page, user_id: userId || null, language: language || 'en', state, user_agent: userAgent });
  } catch (e) { console.error('logPageView error:', e.message); }
}

export async function logLawSearch({ term, category, section, userId, language }) {
  try {
    await LawSearch.create({ search_term: term, category, law_section: section, user_id: userId || null, language: language || 'en' });
  } catch (e) { console.error('logLawSearch error:', e.message); }
}

export async function logDraftUsage({ templateType, userId, language }) {
  try {
    await DraftUsage.create({ template_type: templateType, user_id: userId || null, language: language || 'en' });
  } catch (e) { console.error('logDraftUsage error:', e.message); }
}

// ─── Analytics Queries (Admin Dashboard) ─────────────────────────────────────

export async function getOverviewStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalQueries, totalPageViews, totalDrafts, todayQueries, todayUsers, weekQueries] = await Promise.all([
    User.countDocuments(),
    Query.countDocuments(),
    PageView.countDocuments(),
    DraftUsage.countDocuments(),
    Query.countDocuments({ created_at: { $gte: todayStart } }),
    Query.distinct('user_id', { created_at: { $gte: todayStart }, user_id: { $ne: null } }).then(r => r.length),
    Query.countDocuments({ created_at: { $gte: weekAgo } }),
  ]);

  return { totalUsers, totalQueries, totalPageViews, totalDrafts, todayQueries, todayUsers, weekQueries };
}

export async function getTopQueries(limit = 20) {
  return Query.aggregate([
    { $group: { _id: { $toLower: { $trim: { input: '$query_text' } } }, query_text: { $first: '$query_text' }, count: { $sum: 1 }, last_asked: { $max: '$created_at' } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
}

export async function getTopLawSearches(limit = 20) {
  return LawSearch.aggregate([
    { $group: { _id: { $toLower: { $trim: { input: '$search_term' } } }, search_term: { $first: '$search_term' }, category: { $first: '$category' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
}

export async function getUsageByLanguage() {
  return Query.aggregate([
    { $group: { _id: '$language', language: { $first: '$language' }, query_count: { $sum: 1 } } },
    { $sort: { query_count: -1 } },
  ]);
}

export async function getUsageByState() {
  return Query.aggregate([
    { $match: { state: { $ne: null, $ne: '' } } },
    { $group: { _id: '$state', state: { $first: '$state' }, query_count: { $sum: 1 } } },
    { $sort: { query_count: -1 } },
  ]);
}

export async function getUsageByFeature() {
  return Query.aggregate([
    { $group: { _id: '$feature', feature: { $first: '$feature' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

export async function getDraftUsageStats() {
  return DraftUsage.aggregate([
    { $group: { _id: '$template_type', template_type: { $first: '$template_type' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

export async function getPageViewStats() {
  return PageView.aggregate([
    { $group: { _id: '$page', page: { $first: '$page' }, views: { $sum: 1 } } },
    { $sort: { views: -1 } },
  ]);
}

export async function getQueryTimeline(days = 30) {
  const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return Query.aggregate([
    { $match: { created_at: { $gte: daysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, day: { $first: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
}

export async function getRecentQueries(limit = 50) {
  const queries = await Query.find().sort({ created_at: -1 }).limit(limit).lean();
  // Populate user info manually for flexibility
  const userIds = [...new Set(queries.filter(q => q.user_id).map(q => q.user_id.toString()))];
  const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
  const userMap = {};
  users.forEach(u => { userMap[u._id.toString()] = u; });

  return queries.map(q => ({
    id: q._id.toString(),
    query_text: q.query_text,
    language: q.language,
    feature: q.feature,
    provider: q.provider,
    state: q.state,
    response_time_ms: q.response_time_ms,
    created_at: q.created_at,
    user_name: q.user_id ? userMap[q.user_id.toString()]?.name : null,
    user_email: q.user_id ? userMap[q.user_id.toString()]?.email : null,
  }));
}

export async function getAllUsers(limit = 100, offset = 0) {
  const [users, total] = await Promise.all([
    User.find().select('-password_hash').sort({ created_at: -1 }).skip(offset).limit(limit).lean()
      .then(docs => docs.map(u => ({ ...u, id: u._id.toString() }))),
    User.countDocuments(),
  ]);
  return { users, total };
}

// ─── Seed admin account ──────────────────────────────────────────────────────

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kanoonsaathi.in';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  try {
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        phone: '0000000000',
        password_hash: bcrypt.hashSync(adminPass, 10),
        role: 'admin',
      });
      console.log(`   👤 Admin account created: ${adminEmail}`);
    }
  } catch (e) { /* ignore duplicate */ }
}
