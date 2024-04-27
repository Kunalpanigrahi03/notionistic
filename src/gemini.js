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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAiContext = void 0;
const google_genai_1 = require("@langchain/google-genai");
const langchainLLM = new google_genai_1.ChatGoogleGenerativeAI();
function generateAiContext(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Change this {history} according to the context, you want to generate your content
            const history = "https://www.youtube.com/@harkirat1, this is my youtube channel.I am a tech youtuber. Give me the context to the following message with respect to this information: generated by you, blogposts, any relevent youtube videos";
            const langchainTextResponse = yield langchainLLM.invoke([['human', history + message]]);
            const langchainOutput = langchainTextResponse.content;
            return langchainOutput;
        }
        catch (error) {
            console.error(error);
            throw new Error('An error occurred while generating AI context.');
        }
    });
}
exports.generateAiContext = generateAiContext;
