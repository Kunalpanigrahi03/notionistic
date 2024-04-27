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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = 3000;
function handleTextMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Received text message:", message);
        const description = yield (0, gemini_1.generateAiContext)(JSON.stringify({ message }));
        if (typeof description === 'string') {
            yield (0, notion_1.createNotionPage)(message, description.substring(0, 2000));
        }
        else {
            console.error('Description is not a string:', description);
        }
        (0, twilio_1.sendTextMessage)("Synced it to notion and Generated AI content");
    });
}
function handleImageMessage(mediaUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Received image message. Media URL:", mediaUrl);
        const description = yield (0, gemini_1.generateAiContext)(JSON.stringify({ mediaUrl }));
        if (typeof description === 'string') {
            yield (0, notion_1.createNotionPage)(mediaUrl, description.substring(0, 2000));
        }
        else {
            console.error('Description is not a string:', description);
        }
        (0, twilio_1.sendTextMessage)("Synced it to notion and Generated AI content");
    });
}
exports.handleImageMessage = handleImageMessage;
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    if (body.NumMedia && parseInt(body.NumMedia) > 0) {
        const mediaUrl = body.MediaUrl0;
        yield handleImageMessage(mediaUrl);
    }
    else {
        const message = body.Body;
        yield handleTextMessage(message);
    }
    res.status(200).send();
}));
app.listen(port, () => console.log(`Express app running on port ${port}!`));
