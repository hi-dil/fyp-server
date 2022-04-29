const admin = require('firebase-admin')
require('dotenv').config()

const serviceAccount = require('../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-foodbank-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin
