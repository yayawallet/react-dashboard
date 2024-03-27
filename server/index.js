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

  try {
    if (!username) throw new Error("username is required!");

    const profile = await getProfile(username);
    res.send(profile);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

app.listen(port, () => {
  console.log("App running on port " + port);
});
