import { Client } from '@notionhq/client';

const notion_client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });

const pageID = process.env.NOTION_PAGE_ID;

export async function createNotionPage(_message_: string, _description_: string) {
  try {
    const response = await notion_client.pages.create({
      "parent": { "page_id": pageID! },
      "cover": {
        "type": "external",
        "external": {
          "url": "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/final_keyword_header.width-800.format-webp.webp"
        }
      },
      "properties": {
        "title": {
          "title": [{ "type": "text", "text": { "content": _message_ } }]
        }
      },
      "children": [
        {
          "object": "block",
          "type": "paragraph",
          "paragraph": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": _description_
                },
                "annotations": {
                  "bold": false,
                  "italic": true,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "orange",
                }
              }
            ]
          }
        }
      ]
    });
    console.log("Page created successfully");
  } catch (error) {
    console.error("Error creating page : ", error);
  }
}