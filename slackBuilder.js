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

  /**
   * Creates a section block with an overflow menu accessory.
   *
   * @param {string} descriptor - The text to display in the section block.
   * @param {Array.<{name: string}>} [items=[]] - An array of objects representing the items in the overflow menu.
   * Each object should have a `name` property. The array can have a maximum of five elements.
   * @param {string} [id=null] - An optional identifier for the block. A new ID will be generated if not provided.
   * @returns {Object} A section block object with an overflow menu accessory.
   *
   * @example
   * overflow(
   *   "Choose an option:",
   *   [{name: "Option 1"}, {name: "Option 2"}, {name: "Option 3"}],
   *   "example-block-id"
   * );
   */
  overflow(descriptor, items = [], id = null) {
    if (!id) id = this.getId();

    const overflowItems = items.map((item, index) => ({
      text: {
        type: "plain_text",
        text: item.name,
        emoji: false,
      },
      value: (index + 1).toString(),
    }));

    return {
      type: "section",
      block_id: "overflow " + id,
      text: {
        type: "mrkdwn",
        text: descriptor,
      },
      accessory: {
        type: "overflow",
        options: overflowItems,
        action_id: "overflow-action",
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
          },
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

  /**
   * Transforms an array of button data into an action object containing button elements.
   *
   * @param {Array.<{text: string, id: string, url: string}>} buttons - An array of objects, each representing a button.
   * @returns {Object} An actions object containing an array of button elements.
   *
   * @example
   * buttonArray([
   *   {text: 'Visit Website', id: 'website-button', url: 'https://example.com'},
   *   {text: 'View on Airtable', id: 'airtable-button', url: 'https://airtable.com'}
   * ]);
   */
  buttonArray(buttons) {
    const elements = buttons.map((button) => {
      const id = button.id || this.getId();
      return {
        type: "button",
        text: {
          type: "plain_text",
          text: button.text,
          emoji: true,
        },
        value: button.value,
        url: button.url,
        action_id: "actionId-" + id,
      };
    });

    return {
      type: "actions",
      elements: elements,
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
