class SlackBuilder {
  constructor(webhook) {
    this.webhook = webhook;
    this.message = null;
  }
  getId() {
    return Math.floor(Math.random() * 10000).toString();
  }
  build(object) {
    this.message = JSON.stringify({ blocks: object });
    return this;
  }

  async send() {
    //send to slack
    if (!this.webhook) throw new Error("No webhook set");
    if (!this.message) throw new Error("No message set");

    try {
      await fetch(this.webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: this.message,
      });
    } catch (e) {
      console.error("Error sending message to slack", e);
      throw e;
    }
  }

  plainText(text, id = null) {
    if (!id) id = this.getId();
    return {
      type: "section",
      block_id: id,
      text: {
        type: "plain_text",
        text: text,
        emoji: true,
      },
    };
  }

  mrkdwn(text, id = null) {
    if (!id) id = this.getId();

    return {
      type: "section",
      block_id: id,
      text: {
        type: "mrkdwn",
        text: text,
      },
    };
  }

  header(text, emoji = true) {
    return {
      type: "header",
      text: {
        type: "plain_text",
        text: text,
        emoji: emoji,
      },
    };
  }

  list(listName, items, style = "bullet", id = null) {
    if (!id) id = this.getId();
    if (!Array.isArray(items)) throw new Error("Items must be an array");

    items = items.map((item) => {
      return {
          type: "rich_text_section",
          elements: [
            {
              type: "text",
              text: item,
            }
          ],
      };
    });

    return {
      type: "rich_text",
      elements: [
        {
          type: "rich_text_section",
          elements: [
            {
              type: "text",
              text: listName,
            },
          ],
        },
        {
          type: "rich_text_list",
          style: style,
          elements: items,
        },
      ],
    };
  }

  divider() {
    return {
      type: "divider",
    };
  }

  context(text, emoji = true) {
    return {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: text,
          emoji: emoji,
        },
      ],
    };
  }

  image(url, altText) {
    return {
      type: "image",
      image_url: url,
      alt_text: altText,
    };
  }

  button(text, value, url, id = null) {
    if (!id) id = this.getId();
    return {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: text,
            emoji: true,
          },
          value: value,
          url: url,
          action_id: "actionId-" + id,
        },
      ],
    };
  }
}

// replace 'webhook_url_here' with your webhook URL
const $ = new SlackBuilder("webhook_url_here");

// example usage
let messageBlocks = [
  $.header("Success!"),
  $.divider(),
  $.mrkdwn(
    "You have *successfully* delivered a slack message using <https://github.com/koldFU5iON/slackblocks-4-airtable/|slackblocks-4-airtable>. I hope you find it useful. \n_Please star the repo if you do_."
  ),
  $.plainText("Have a great day!"),
  $.list("List", ["Item 1", "Item 2", "Item 3"]),
  $.divider(),
  $.image(
    "https://i.pinimg.com/736x/4c/db/60/4cdb6055396941b5e52a9d93caed3e13.jpg",
    "Good Job!"
  ),
  $.button(
    "Repo",
    "btn_click",
    "https://github.com/koldFU5iON/slackblocks-4-airtable/"
  ),
];

// build and send the message
$.build(messageBlocks).send();

// build for copy/paste to slack block kit builder - https://app.slack.com/block-kit-builder/
// console.message($.build(messageBlocks).message);
