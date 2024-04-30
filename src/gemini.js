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
            const history = "https://www.youtube.com/@harkirat1, A tech YouTuber who mainly focuses on development and open source." +
                "https://www.youtube.com/@takeUforward, a channel focused on data structures and algorithms. " +
                "https://www.youtube.com/@TheAdityaVerma, a channel for programming tutorials. " +
                "https://www.youtube.com/@TLE_Eliminators, a channel dedicated to competitive programming. " +
                "I want you to generate context for the following message and make sure whatever you are generating must be formatted well, as this is going directly to the notion page. Format should be like - 1) About the topic 2) Youtube Video 2 line description and link 3) Blogpost description and links 4)Conclusion" +
                "Attach links of latest youtube video relevant to that topic (the video links must be working) on the above mentioned channels and blogpost you are recommending for the topic in the message. ";
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
