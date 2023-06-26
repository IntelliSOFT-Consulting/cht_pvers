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
const jwt_1 = require("../lib/jwt");
const prisma_1 = __importDefault(require("../lib/prisma"));
const uploadMiddleware_1 = __importDefault(require("../lib/uploadMiddleware"));
const router = express_1.default.Router();
router.use(express_1.default.json());
// Create a new post.
router.post("/", [jwt_1.requireJWTMiddleware, uploadMiddleware_1.default.single("image")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.body.description) {
            res.status(401).json({ error: 'Please provide a description', status: "error" });
            return;
        }
        console.log(req.body.text);
        if (!req.file) {
            res.status(400).json({ error: 'Please provide an image', status: "error" });
            return;
        }
        let token = req.headers.authorization || '';
        let decodedSession = jwt_1.decodeSession(process.env['SECRET_KEY'], token.split(' ')[1]);
        if (decodedSession.type == 'valid') {
            let role = decodedSession.session.role;
            let userId = decodedSession.session.userId;
            let user = yield prisma_1.default.user.findUnique({
                where: {
                    id: userId
                }
            });
            let post = yield prisma_1.default.post.create({
                data: {
                    description: req.body.description,
                    image: req.file.filename || '',
                    userId: userId
                }
            });
            res.status(200).json({
                imageUrl: `${req.protocol + "://" + req.get('host') + "/files/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename)}`,
                id: post.id,
                image: req.file.filename,
                status: "success"
            });
            return;
        }
    }
    catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
}));
// Get Post.
router.get("/:id", [jwt_1.requireJWTMiddleware], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let token = req.headers.authorization || '';
        let decodedSession = jwt_1.decodeSession(process.env['SECRET_KEY'], token.split(' ')[1]);
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId;
            let user = yield prisma_1.default.user.findUnique({
                where: {
                    id: userId
                }
            });
            let post = yield prisma_1.default.post.findMany({
                where: { id: id, userId: userId }
            });
            if (post.length > 0) {
                res.status(200).json({
                    post: {
                        description: post[0].description,
                        createdBy: post[0].userId,
                        image: post[0].image,
                        imageUrl: `${req.protocol + "://" + req.get('host') + "/files/" + post[0].image}`,
                        updatedAt: post[0].updatedAt,
                        createdAt: post[0].createdAt,
                    },
                    status: "success"
                });
                return;
            }
            res.status(401).json({ error: "Post not found", status: "error" });
            return;
        }
    }
    catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
}));
// Get Posts By User.
router.get("/", [jwt_1.requireJWTMiddleware], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = jwt_1.decodeSession(process.env['SECRET_KEY'], token.split(' ')[1]);
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId;
            let user = yield prisma_1.default.user.findUnique({
                where: {
                    id: userId
                }
            });
            let post = yield prisma_1.default.post.findMany({
                where: { userId: userId }
            });
            if (post.length > 0) {
                res.status(200).json({
                    post: {
                        description: post[0].description,
                        createdBy: post[0].userId,
                        image: post[0].image,
                        imageUrl: `${req.protocol + "://" + req.get('host') + "/files/" + post[0].image}`,
                        updatedAt: post[0].updatedAt,
                        createdAt: post[0].createdAt,
                    },
                    status: "success"
                });
                return;
            }
            res.status(401).json({ error: "Post not found", status: "error" });
            return;
        }
    }
    catch (error) {
        // console.log(error)
        res.statusCode = 400;
        res.json({ status: "error", error: error });
        return;
    }
}));
exports.default = router;
