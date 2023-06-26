"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.sendRequest = exports.installChannels = exports.getOpenHIMToken = exports.importMediators = void 0;
const openhim_mediator_utils_1 = __importDefault(require("openhim-mediator-utils"));
const shrMediatorConfig_json_1 = __importDefault(require("../config/shrMediatorConfig.json"));
const mpiMediatorConfig_json_1 = __importDefault(require("../config/mpiMediatorConfig.json"));
const https_1 = require("https");
const crypto = __importStar(require("crypto"));
const fetch = (url, init) => Promise.resolve().then(() => __importStar(require('node-fetch'))).then(({ default: fetch }) => fetch(url, init));
const openhimApiUrl = process.env.OPENHIM_API_URL;
const openhimUsername = process.env.OPENHIM_USERNAME;
const openhimPassword = process.env.OPENHIM_PASSWORD;
const openhimConfig = {
    username: openhimUsername,
    password: openhimPassword,
    apiURL: openhimApiUrl,
    trustSelfSigned: true
};
openhim_mediator_utils_1.default.authenticate(openhimConfig, (e) => {
    console.log(e ? e : "✅ OpenHIM authenticated successfully");
});
const importMediators = () => {
    try {
        openhim_mediator_utils_1.default.registerMediator(openhimConfig, shrMediatorConfig_json_1.default, (e) => {
            console.log(e ? e : "");
        });
        openhim_mediator_utils_1.default.registerMediator(openhimConfig, mpiMediatorConfig_json_1.default, (e) => {
            console.log(e ? e : "");
        });
    }
    catch (error) {
        console.log(error);
    }
    return;
};
exports.importMediators = importMediators;
const getOpenHIMToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Auth", auth)
        let token = yield openhim_mediator_utils_1.default.genAuthHeaders(openhimConfig);
        return token;
    }
    catch (error) {
        console.log(error);
        return { error, status: "error" };
    }
});
exports.getOpenHIMToken = getOpenHIMToken;
const installChannels = () => __awaiter(void 0, void 0, void 0, function* () {
    let headers = yield exports.getOpenHIMToken();
    [shrMediatorConfig_json_1.default.urn, mpiMediatorConfig_json_1.default.urn].map((urn) => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (yield fetch(`${openhimApiUrl}/mediators/${urn}/channels`, {
            headers: headers, method: 'POST', body: JSON.stringify({ a: "y" }), agent: new https_1.Agent({
                rejectUnauthorized: false
            })
        })).text();
        console.log(response);
    }));
});
exports.installChannels = installChannels;
const sendRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    let headers = yield exports.getOpenHIMToken();
    [shrMediatorConfig_json_1.default.urn, mpiMediatorConfig_json_1.default.urn].map((urn) => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (yield fetch(`${openhimApiUrl}/patients`, {
            headers: headers, method: 'POST', body: JSON.stringify({ a: "y" }), agent: new https_1.Agent({
                rejectUnauthorized: false
            })
        })).text();
        console.log(response);
    }));
});
exports.sendRequest = sendRequest;
const createClient = (name, password) => __awaiter(void 0, void 0, void 0, function* () {
    let headers = yield exports.getOpenHIMToken();
    const clientPassword = password;
    const clientPasswordDetails = yield genClientPassword(clientPassword);
    let response = yield (yield fetch(`${openhimApiUrl}/clients`, {
        headers: Object.assign(Object.assign({}, headers), { "Content-Type": "application/json" }),
        method: 'POST',
        body: JSON.stringify({
            passwordAlgorithm: "sha512",
            passwordHash: clientPasswordDetails.passwordHash,
            passwordSalt: clientPasswordDetails.passwordSalt,
            clientID: name, name: name, "roles": [
                "*"
            ],
        }), agent: new https_1.Agent({
            rejectUnauthorized: false
        })
    })).text();
    console.log("create client: ", response);
    return response;
});
exports.createClient = createClient;
// export let apiHost = process.env.FHIR_BASE_URL
const genClientPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const passwordSalt = crypto.randomBytes(16);
        // create passhash
        let shasum = crypto.createHash('sha512');
        shasum.update(password);
        shasum.update(passwordSalt.toString('hex'));
        const passwordHash = shasum.digest('hex');
        resolve({
            "passwordSalt": passwordSalt.toString('hex'),
            "passwordHash": passwordHash
        });
    });
});
