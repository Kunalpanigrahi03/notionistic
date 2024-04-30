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
          "url": "https://media.licdn.com/dms/image/D4D12AQF6mW4EuB-99Q/article-cover_image-shrink_720_1280/0/1692951785182?e=2147483647&v=beta&t=I6_1-aBTAg0fihJHret-C4hRNuffBu8JyrqKfXsm74w"
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
    console.log("Page created successfully:");
  } catch (error) {
    console.error("Error creating page:", error);
  }
}