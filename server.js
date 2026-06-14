const express = require("express");

const app = express();
app.use(express.json());

// UptimeRobot will ping this
app.get("/", (req, res) => {
  res.send("Justice API Online");
});

const WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_HERE"; // ⚠️ don't expose real webhook publicly

app.post("/case", async (req, res) => {
  try {
    const {
      defendant,
      plaintiff,
      violation,
      evidence,
      guild_id,
      guild_name
    } = req.body;

    console.log("Case received:", req.body);

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content:
          `⚖️ **New Case Filed**\n` +
          `Defendant: ${defendant ? `<@${defendant}>` : "Unknown"}\n` +
          `Plaintiff: ${plaintiff ? `<@${plaintiff}>` : "Unknown"}`,

        allowed_mentions: {
          parse: ["users"]
        },

        embeds: [
          {
            title: "Justice Case",
            color: 15158332,
            fields: [
              {
                name: "Defendant",
                value: defendant ? `<@${defendant}>` : "Unknown",
                inline: true
              },
              {
                name: "Plaintiff",
                value: plaintiff ? `<@${plaintiff}>` : "Unknown",
                inline: true
              },
              {
                name: "Violation",
                value: violation || "None"
              },
              {
                name: "Evidence",
                value: evidence || "None"
              },
              {
                name: "Origin Server",
                value: guild_name
                  ? `${guild_name} (${guild_id || "No ID"})`
                  : (guild_id || "Unknown")
              }
            ],
            timestamp: new Date().toISOString()
          }
        ]
      })
    });

    return res.json({ success: true });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚖️ Justice API running on port ${PORT}`);
});
