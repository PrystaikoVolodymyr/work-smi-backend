const admin = require("firebase-admin");
const firebase = require("firebase/app");
require("firebase/analytics");
require("firebase/auth");
const config = require("../config/config");
const serviceAccount = require("../../firebase-admin-sdk.json");
const firebaseConfig = require("../../firebase-config.json");

const App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

firebase.initializeApp(firebaseConfig);

module.exports = {
  get firestore() {
    return App.firestore();
  },

  get getApp() {
    return App;
  },

  async getUsersList(nextPageToken) {
    return await App.auth().listUsers(1000, nextPageToken);
  },

  async signInWithCustomToken(uid) {
    const token = await App.auth().createCustomToken(uid);
    return await firebase.auth().signInWithCustomToken(token);
  },

  async getCustomToken(uid) {
    return await App.auth().createCustomToken(uid);
  },

  async getUserByUid(uid) {
    return await App.auth().getUser(uid);
  },

  async getUserByEmail(email) {
    try {
      return await App.auth().getUserByEmail(email);
    } catch (e) {
      return false
    }
  },

  async checkUserByEmail(email) {
    return App.auth()
      .getUserByEmail(email)
      .then(() => {
        return true;
      })
      .catch((error) => {
        return false;
      });
  },

  async createUser(userData) {
    return await App.auth().createUser(userData);
  },

  async editUser(uid, userData) {
    const allowedKeys = [
      "displayName",
      "photoURL",
      "password",
      "emailVerified",
      "email",
      "disabled",
    ];
    const finalData = Object.keys(userData)
      .filter((key) => allowedKeys.includes(key))
      .reduce((acc, key) => {
        acc[key] = userData[key];
        return acc;
      }, {});

    return await App.auth().updateUser(uid, finalData);
  },

  async setClaims(uid, claimsObject) {
    try {
      const user = await App.auth().getUser(uid);
      const newClaims = Object.assign({}, user.customClaims, claimsObject);
      await admin.auth().setCustomUserClaims(uid, newClaims);
      return (await App.auth().getUser(uid)).customClaims;
    } catch (e) {
      return e;
    }
  },

  async deleteUserByUid(uid) {
    return await App.auth().deleteUser(uid);
  },

  async deleteUserByEmail(email) {
    const user = await App.auth().getUserByEmail(email);
    return await App.auth().deleteUser(user.uid);
  },

  async decodeIdToken(token) {
    return await App.auth().verifyIdToken(token);
  },
};
