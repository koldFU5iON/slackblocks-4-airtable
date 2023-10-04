# SlackBlocks for Airtable

Elevate your Slack messages from Airtable with a touch of refinement. `slackblocks-4-airtable` is a script designed to enrich your notification game. By following a simple setup, you can send well-structured and visually appealing messages right from your Airtable base to Slack.

## How it Works

1. Copy and paste the script into an Airtable script automation.
2. Create an array variable to contain your message, utilizing the `$.{blockType}` syntax to design your message.
3. Use `$.build(message)` to assemble your message, ready for dispatch.
4. Send it off to Slack via a POST request to the Slack Webhook URL, including your message in the body payload.

## Example

Here’s a simple example to get the hang of it:

```javascript
const slackMessage = [
 $.header("This is a header message"),
 $.divider(),
 $.mrkdwn("You can _even_ input *Markdown* and include <gosomewhere.com|links>")
]

const message = $.build(slackMessage);

// Now, send 'message' to Slack via a POST request
```

## Getting Started

1. Copy the script from this repository.
2. Follow the example above to create your first enhanced Slack message from Airtable.
3. Enjoy better, more engaging notifications!

## Contributing

Feel free to fork this project, open a pull request or submit any ideas on how we could improve this script!

## License

MIT

---

Happy messaging!