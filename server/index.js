const express = require('express');
const { getProfile } = require('@yayawallet/node-sdk');

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.json({ product: 'Yayawallet Dashboard' });
});

app.get('/profile', async (req, res) => {
  const profile = await getProfile('username');
  res.send(profile);
});

app.listen(port, () => {
  console.log('App running on port ' + port);
});
