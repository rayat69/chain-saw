"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStorage = exports.adminAuth = exports.adminFirestore = exports.adminDatabase = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const credentials_json_1 = require("./credentials.json");
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: credentials_json_1.project_id,
            clientEmail: credentials_json_1.client_email,
            privateKey: credentials_json_1.private_key,
        }),
        databaseURL: credentials_json_1.database_url,
    });
}
else {
    firebase_admin_1.default.app();
}
exports.adminDatabase = firebase_admin_1.default.database();
exports.adminFirestore = firebase_admin_1.default.firestore();
exports.adminAuth = firebase_admin_1.default.auth();
exports.adminStorage = firebase_admin_1.default.storage();
//# sourceMappingURL=admin.js.map