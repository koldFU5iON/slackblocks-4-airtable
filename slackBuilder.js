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
  divider() {
    return {
      type: "divider",
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
    if(!id) id = this.getId()
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

const $ = new SlackBuilder("https://hooks.slack.com/services/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");


// example usage
let messageBlocks = [
  $.header("Hello World"),
  $.divider(),
  $.mrkdwn(
    "This is _markdown_ and I'm *emphasising stuff*, check it out <something.com|a link>"
  ),
  $.divider(),
  $.mrkdwn("this is another markdown", "with it's own id"),
  $.divider(),
  $.button("click here","btn_click", "https://google.com")
];

$.build(messageBlocks).send();


// console.log(message);
