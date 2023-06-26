"use strict";
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
const express_1 = __importDefault(require("express"));
const utils_1 = require("../lib/utils");
const router = express_1.default.Router();
router.use(express_1.default.json());
// Login
router.get("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = yield utils_1.getOpenHIMToken();
        yield utils_1.installChannels();
        res.json({ status: "success", token });
        res.set(token);
        return;
    }
    catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json({ error: "incorrect email or password" });
        return;
    }
}));
// Login
router.post("/client", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield utils_1.getOpenHIMToken();
        let { name, password } = req.body;
        let response = yield utils_1.createClient(name, password);
        res.json({ status: "success", response });
        return;
    }
    catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json({ error: "incorrect email or password", status: "error" });
        return;
    }
}));
// Login
router.get("/install", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = yield utils_1.getOpenHIMToken();
        yield utils_1.sendRequest();
        res.json({ status: "success", token });
        return;
    }
    catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json({ error: "incorrect email or password" });
        return;
    }
}));
exports.default = router;
