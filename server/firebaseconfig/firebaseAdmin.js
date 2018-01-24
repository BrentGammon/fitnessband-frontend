const admin = require('firebase-admin');

var serviceAccount = require("../firebaseconfig/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://reactdemo-b1425.firebaseio.com"
});


module.exports = {
    admin
}
