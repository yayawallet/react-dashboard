const express = require("express");
const { getProfile } = require("@yayawallet/node-sdk");

const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ product: "Yayawallet Dashboard" });
});

app.get("/profile", async (req, res) => {
  // user your own yayawallet username
  const username = "surafelaraya";

  try {
    const profile = await getProfile(username);
    res.send(profile);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

app.listen(port, () => {
  console.log("App running on port " + port);
});
