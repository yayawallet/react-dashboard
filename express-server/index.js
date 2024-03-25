const express = require('express');

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.json({product: 'Yayawallet Dashboard'})
})

app.listen(port, () => {
  console.log('App running on port ' + port);
})