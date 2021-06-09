"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.auth = exports.firestore = exports.database = void 0;
const firebase_1 = __importDefault(require("firebase"));
require("firebase/database");
require("firebase/firestore");
require("firebase/auth");
require("firebase/storage");
const conf = {
    apiKey: 'AIzaSyDqZvo3uqrqclPxPiYjS7E8hf3xSIoYWBI',
    authDomain: 'auth-development-faab3.firebaseapp.com',
    databaseURL: 'https://auth-development-faab3-default-rtdb.firebaseio.com',
    projectId: 'auth-development-faab3',
    storageBucket: 'auth-development-faab3.appspot.com',
    appId: '1:838575164828:web:33a42eca722e76a0e60c59',
};
if (!firebase_1.default.apps.length) {
    firebase_1.default.initializeApp(conf);
}
else {
    firebase_1.default.app();
}
exports.database = firebase_1.default.database();
exports.firestore = firebase_1.default.firestore();
exports.auth = firebase_1.default.auth();
exports.storage = firebase_1.default.storage();
//# sourceMappingURL=firebase.js.map