const express = require("express");
const { getProfile } = require("@yayawallet/node-sdk");

const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ product: "Yayawallet Dashboard" });
});

app.post("/profile", async (req, res) => {
  const username = req.body.username;

  const profile = await getProfile(username);
  res.send(profile);
});

app.listen(port, () => {
  console.log("App running on port " + port);
});
