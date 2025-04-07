const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

const apps = getApps();

const firebaseAdmin = apps.length === 0 ? initializeApp(firebaseAdminConfig) : apps[0];
const auth = getAuth(firebaseAdmin);

module.exports = { auth };