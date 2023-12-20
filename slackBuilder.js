class SlackBuilder {
  constructor(webhook) {
    this.webhook = webhook;
    this.message = null;
  }
  getId() {
    return Math.floor(Math.random() * 10000).toString();
  }

  test() {
    if (!this.message) throw new Error("No message set, use .build() first");
    const param = "#" + encodeURI(this.message);
    const slackBlockKitBuilderUrl =
      "https://app.slack.com/block-kit-builder/T06AF9667";
    console.log(slackBlockKitBuilderUrl + param);
  }

  print() {
    console.log(this.message);
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

  /**
   * Creates a rich text block with a list (either bulleted or numbered).
   *
   * @param {string} listName - The title or heading for the list.
   * @param {Array.<string>} items - An array of strings representing each list item.
   * @param {string} [style="bullet"] - The style of the list; can be 'bullet' or 'number'.
   * @param {string} [id=null] - An optional identifier for the list block. A new ID will be generated if not provided.
   * @returns {Object} A rich text block object representing the list.
   *
   * @example
   * list(
   *   "Task List",
   *   ["Task 1", "Task 2", "Task 3"],
   *   "bullet",
   *   "task-list-id"
   * );
   */

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

  columns(contentBlock = []) {
    contentBlock = contentBlock.map((content) => {
      return {
        type: "plain_text",
        text: content,
        emoji: true,
      };
    });

    return {
      type: "section",
      fields: contentBlock,
    };
  }

  _elements(objElements) {
    return {
      type: objElements.elementType,
      text: {
        type: objElements.text_type,
        text: objElements.text,
        emoji: true,
      },
      style: objElements.style,
      action_id: objElements.action_id,
      value: objElements.value,
      url: objElements.url,
    };
  }

  /**
   * Creates a block of action elements with buttons.
   *
   * @param {Array.<{text: string, action_id: string, url: string, [style]: string}>} buttons - An array of objects representing the buttons. Each object must include 'text', 'action_id', and 'url' properties. Optionally, 'style' can be included to define button style.
   * @throws {Error} Throws an error if 'buttons' is not an array or if any required property is missing.
   * @returns {Object} An actions block object containing the specified buttons.
   *
   * @example
   * buttons([
   *   {
   *     text: "Visit Website",
   *     action_id: "website-button",
   *     url: "https://example.com",
   *     style: "primary"
   *   },
   *   {
   *     text: "View on Airtable",
   *     action_id: "airtable-button",
   *     url: "https://airtable.com"
   *   }
   * ]);
   */

  buttons(buttons) {
    if (!Array.isArray(buttons)) throw new Error("Buttons must be an array");

    if (buttons.length > 5) {
      throw new Error("Maximum of 5 buttons can be added");
    }
    const requiredProperties = ["text", "action_id", "url"];
    const missingProperties = requiredProperties.filter(
      (key) => !buttons[0].hasOwnProperty(key)
    );

    if (missingProperties.length) {
      throw new Error(
        `Missing required properties: ${missingProperties.join(", ")}`
      );
    }

    const elements = buttons.map((button) => {
      return this._elements({
        ...button,
        elementType: "button",
        text_type: "plain_text",
        value: button.text.replace(/\s/g, "_").toLowerCase(),
      });
    });

    return {
      type: "actions",
      elements: elements,
    };
  }
}

// Replace 'your_webhook_url' with your actual Slack webhook URL
const $ = new SlackBuilder("your_webhook_url");

// Preparing the message blocks
let messageBlocks = [
  $.header("🚀 Team Update!"), // Header with emoji
  $.mrkdwn("Here's the *latest news* from our team:"), // Markdown section
  $.divider(), // Divider
  $.list(
    "Upcoming Events",
    ["Hackathon - Jan 20", "Team Meeting - Jan 25", "Product Launch - Feb 1"],
    "bullet"
  ), // Bulleted list
  $.divider(), // Another Divider
  $.context("For more details, visit our team portal."), // Context block
  $.divider(), // Divider
  $.buttons([
    // Button
    {
      text: "Visit Our Wiki",
      action_id: "wiki-button",
      url: "https://your-wiki-url.com",
    },
  ]),
  $.context("For more details, visit our team portal."), // Context block
];

// Build the message
$.build(messageBlocks); // you can appened .send() to send the message directly

// For debugging: Print the message or test it
// console.log($.message);
$.test();

// To send the message, uncomment the following line:
// $.send();
