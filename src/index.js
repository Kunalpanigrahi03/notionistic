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
exports.handleImageMessage = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const notion_1 = require("./notion");
const twilio_1 = require("./twilio");
const gemini_1 = require("./gemini");
const auth_1 = __importDefault(require("./auth"));
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new mongodb_1.MongoClient(uri);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/auth', auth_1.default);
let firstRequestTime;
app.use((_req, _res, _next) => {
    _req.requestTime = Date.now();
    if (!firstRequestTime) {
        firstRequestTime = _req.requestTime;
    }
    _next();
});
const timeFrame = 30 * 60 * 1000;
app.use((_req, _res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (firstRequestTime) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - firstRequestTime;
        const remainingTime = timeFrame - elapsedTime;
        if (elapsedTime < timeFrame) {
            const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
            const nextAllowedTime = new Date(currentTime + remainingTime).toLocaleString();
            yield (0, twilio_1.sendTextMessage)(`Time remaining: ${remainingMinutes} minutes. You can continue at ${nextAllowedTime}.`);
            _res.status(403).send("You are not allowed to send messages yet. Please wait for the specified time frame to elapse.");
        }
        else {
            _next();
        }
    }
    else {
        _next();
    }
}));
const port = 3000;
function sendTimerMessages() {
    const currentTime = Date.now();
    const elapsedTime = firstRequestTime ? currentTime - firstRequestTime : 0;
    const remainingTime = timeFrame - elapsedTime;
    if (elapsedTime < timeFrame) {
        const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
        const nextAllowedTime = new Date(currentTime + remainingTime).toLocaleString();
        const message = `Time remaining: ${remainingMinutes} minutes. You can continue at ${nextAllowedTime}.`;
        (0, twilio_1.sendTextMessage)(message);
        setTimeout(sendTimerMessages, 60 * 1000);
    }
}
function handleTextMessage(_message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Received text message:", _message);
        const description = yield (0, gemini_1.generateAiContext)(JSON.stringify({ _message }));
        if (typeof description === 'string') {
            yield (0, notion_1.createNotionPage)(_message, description.substring(0, 2000));
            const newMessage = {
                type: 'text',
                content: _message,
                description: description,
                createdAt: new Date()
            };
            yield client.connect();
            const collection = client.db('notionistic').collection('messages');
            yield collection.insertOne(newMessage);
            (0, twilio_1.sendTextMessage)("Synced it to notion and Generated AI content");
            sendTimerMessages();
        }
        else {
            console.error('Description is not a string:', description);
        }
    });
}
function handleImageMessage(_mediaUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Received image message. Media URL:", _mediaUrl);
        const description = yield (0, gemini_1.generateAiContext)(JSON.stringify({ _mediaUrl }));
        if (typeof description === 'string') {
            yield (0, notion_1.createNotionPage)(_mediaUrl, description.substring(0, 2000));
            const newMessage = {
                type: 'image',
                content: _mediaUrl,
                description: description,
                createdAt: new Date()
            };
            yield client.connect();
            const collection = client.db('notionistic').collection('messages');
            yield collection.insertOne(newMessage);
            (0, twilio_1.sendTextMessage)("Synced it to notion and Generated AI content");
            sendTimerMessages();
        }
        else {
            console.error('Description is not a string:', description);
        }
    });
}
exports.handleImageMessage = handleImageMessage;
app.post('/', (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = _req;
    if (body.NumMedia && parseInt(body.NumMedia) > 0) {
        const mediaUrl = body.MediaUrl0;
        yield handleImageMessage(mediaUrl);
    }
    else {
        const message = body.Body;
        yield handleTextMessage(message);
    }
    _res.status(200).send();
}));
app.listen(port, () => console.log(`Express app running on port ${port}!`));
