const express = require("express");
const cors = require("cors");
const {
  getProfile,
  generateQrUrl,
  createTransaction,
  getTransferList,
  getTransactionListByUser,
  externalAccountLookup,
  getTransferFee,
} = require("@yayawallet/node-sdk");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

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

app.post("/generateQrUrl", async (req, res) => {
  try {
    const { amount, cause } = req.body;
    const QRCode = await generateQrUrl(amount, cause);

    res.send(QRCode);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

app.post("/createTransaction", async (req, res) => {
  try {
    const { receiver, amount, cause } = req.body;
    const transactionId = await createTransaction(receiver, amount, cause, []);

    res.send(transactionId);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

app.get("/getTransferList", async (req, res) => {
  try {
    const list = await getTransferList();

    res.send(list);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/getTransactionListByUser", async (req, res) => {
  try {
    const transactionList = await getTransactionListByUser();

    res.send(transactionList);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.post("/externalAccountLookup", async (req, res) => {
  try {
    const { institution_code, account_number } = req.body;

    const account = await externalAccountLookup(
      institution_code,
      account_number,
    );

    res.send(account);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.post("/getTransferFee", async (req, res) => {
  try {
    const { institution_code, amount } = req.body;

    const transferFee = await getTransferFee(institution_code, amount);

    res.send(transferFee);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log("App running on port " + port);
});
