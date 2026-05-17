const express = require("express");

const app = express();
app.use(express.json());

const WEBHOOK_URL = "https://discord.com/api/webhooks/1505582300967206912/qclIUf2wLvUEbr_x8-K-YEKbLMg_iSfyblTeoj-aH4hIiL9PWb6W-GCwUEvx-LM-P7U9";

app.post("/case", (req, res) => {
  const { defendant, plaintiff, violation, evidence, guild_id } = req.body;

  console.log("CASE RECEIVED:", req.body);

  // send to Discord
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "⚖️ New Case Filed",
      embeds: [
        {
          title: "Justice Case",
          color: 15158332,
          fields: [
            { name: "Defendant", value: defendant || "Unknown", inline: true },
            { name: "Plaintiff", value: plaintiff || "Unknown", inline: true },
            { name: "Violation", value: violation || "None" },
            { name: "Evidence", value: evidence || "None" },
            { name: "Server", value: guild_id || "Unknown" }
          ]
        }
      ]
    })
  }).catch(console.error);

  return res.json({ success: true, message: "Case received" });
});

app.listen(3000, () => {
  console.log("⚖️ Justice API running on port 3000");
});