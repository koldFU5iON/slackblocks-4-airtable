# SlackBlocks for Airtable

Elevate your Slack messages from Airtable with a touch of refinement. `slackblocks-4-airtable` is a script designed to enrich your notification game. By following a simple setup, you can send well-structured and visually appealing messages right from your Airtable base to Slack.

## How it Works

1. Copy and paste the script into an Airtable script automation.
2. Create an array variable to contain your message, utilizing the `$.{blockType}` syntax to design your message.
3. Use `$.build(message)` to assemble your message, ready for dispatch.
4. Send it off to Slack via a POST request to the Slack Webhook URL, including your message in the body payload.

## Example
### Instantiating the SlackBuilder Class

To get started with creating and sending messages, you'll first need to instantiate the `SlackBuilder` class. This class is designed to abstract the process of creating message blocks and sending them to Slack. Here's how to do it:

Instantiate the `SlackBuilder` class, passing your Slack Webhook URL as an argument to the constructor:

```javascript
// replace 'webhook_url_here' with your webhook URL
const $ = new SlackBuilder('webhook_url_here');
```

Now you have a `SlackBuilder` object, denoted by `$`, which you can use to build and send messages to Slack.

Remember, the Slack Webhook URL is crucial for the `SlackBuilder` to be able to send messages to your Slack workspace. Ensure you've followed the [Setting Up Slack Webhooks](#setting-up-slack-webhooks) section to obtain your Webhook URL.

Once that's done you will be able to create your message as part of an array, of blocks.

```javascript
const slackMessage = [
 $.header("This is a header message"),
 $.divider(),
 $.mrkdwn("You can _even_ input *Markdown* and include <github.com|links>")
]
```
once you've done that you can then build and send your slack message via your webhook with this command
```javascript
$.build(slackMessage).send();
```

## Getting Started

1. Copy the script from this repository.
2. Follow the example above to create your first enhanced Slack message from Airtable.
3. Enjoy better, more engaging notifications!

## Setting Up Slack Webhooks

Before you can send messages to Slack using `slackblocks-4-airtable`, you'll need to set up a Slack Webhook. Follow the steps below to create a new Webhook URL for your Slack workspace:

1. Navigate to [Slack Apps](https://api.slack.com/apps) and click on **Create New App**.
2. Give your app a name and select the Slack workspace where you want it to reside, then click **Create App**.
3. In the **Add features and functionality** section, click on **Incoming Webhooks**.
4. Toggle the switch to **On** to activate incoming webhooks.
5. Scroll down and click on **Add New Webhook to Workspace**.
6. Select the channel where you want your app to post messages and click on **Authorize**.
7. You'll now see your new Webhook URL under the **Webhook URLs for Your Workspace** section. Copy this URL as you'll need it to use `slackblocks-4-airtable`.

## Testing Messages with Slack Block Kit Builder

Before sending messages to a live Slack channel, you might want to test the output using the [Slack Block Kit Builder](https://app.slack.com/block-kit-builder/). This tool allows you to preview your message blocks and make any necessary adjustments. Here's how to do it:

1. Build your message blocks in your script as shown in the [Usage](#usage) section above.
2. Instead of sending the message, log the message object to the console:

```javascript
// build for copy/paste to slack block kit builder
console.log($.build(messageBlocks).message);
```

## Contributing

Feel free to fork this project, open a pull request or submit any ideas on how we could improve this script!

## License

MIT

---

Happy messaging!