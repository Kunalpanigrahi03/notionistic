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
exports.createNotionPage = void 0;
const client_1 = require("@notionhq/client");
const notion_client = new client_1.Client({ auth: process.env.NOTION_ACCESS_TOKEN });
const pageID = process.env.NOTION_PAGE_ID;
function createNotionPage(message, description) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield notion_client.pages.create({
                "parent": { "page_id": pageID },
                "properties": {
                    "title": {
                        "title": [{ "type": "text", "text": { "content": message } }]
                    }
                },
                "children": [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "rich_text": [{ "type": "text", "text": { "content": description } }]
                        }
                    }
                ]
            });
            console.log("Page created successfully:");
        }
        catch (error) {
            console.error("Error creating page:", error);
        }
    });
}
exports.createNotionPage = createNotionPage;
