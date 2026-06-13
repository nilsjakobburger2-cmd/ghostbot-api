const express = require("express");

const app = express();
app.use(express.json());

// UptimeRobot will ping this
app.get("/", (req, res) => {
  res.send("Justice API Online");
});

const WEBHOOK_URL = "https://discord.com/api/webhooks/1505582300967206912/qclIUf2wLvUEbr_x8-K-YEKbLMg_iSfyblTeoj-aH4hIiL9PWb6W-GCwUEvx-LM-P7U9";

app.post("/case", async (req, res) => {
  try {
    const {
      defendant,
      plaintiff,
      violation,
      evidence,
      guild_id
    } = req.body;

    console.log("Case received:", req.body);

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content:
          `⚖️ New Case Filed\n` +
          `Defendant: <@${defendant}>\n` +
          `Plaintiff: <@${plaintiff}>`,

        allowed_mentions: {
          parse: ["users"]
        },

        embeds: [
          {
            title: "Justice Case",
            color: 15158332,
            fields: [
              {
                name: "Defendant ID",
                value: defendant || "Unknown",
                inline: true
              },
              {
                name: "Plaintiff ID",
                value: plaintiff || "Unknown",
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
                value: guild_id || "Unknown"
              }
            ],
            timestamp: new Date().toISOString()
          }
        ]
      })
    });

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚖️ Justice API running on port ${PORT}`);
});
