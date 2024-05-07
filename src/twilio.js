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
exports.sendTextMessage = exports.handleIncomingMessage = exports.endingMessage = exports.startingMessage = exports.client = void 0;
const twilio_1 = __importDefault(require("twilio"));
exports.client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
exports.startingMessage = "Hi there! I am Notionistic. I can help you with creating Notion pages. Just send me the content you want to add to the page. If you want to exit, just type 'done' or 'exit' or 'bye'.";
exports.endingMessage = "Goodbye! Have a great day!";
function handleIncomingMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.toLowerCase() === "hi" || message.toLowerCase() === "hello") {
            yield exports.client.messages.create({
                body: exports.startingMessage,
                from: process.env.MY_TWILIO_NUM,
                to: process.env.MY_PERSONAL_NUM
            });
        }
        else if (message.toLowerCase() === "done" || message.toLowerCase() === "exit" || message.toLowerCase() === "bye") {
            yield exports.client.messages.create({
                body: exports.endingMessage,
                from: process.env.MY_TWILIO_NUM,
                to: process.env.MY_PERSONAL_NUM
            });
        }
    });
}
exports.handleIncomingMessage = handleIncomingMessage;
function sendTextMessage(body) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.client.messages.create({
            body: body,
            from: process.env.MY_TWILIO_NUM,
            to: process.env.MY_PERSONAL_NUM
        });
    });
}
exports.sendTextMessage = sendTextMessage;
