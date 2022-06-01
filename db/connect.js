const admin = require('firebase-admin')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
require('dotenv').config()

const serviceAccount = require('../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-foodbank-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const firestore = getFirestore()

module.exports = { admin, firestore }
