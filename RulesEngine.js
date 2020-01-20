const express = require('express');
const bodyParser = require('body-parser');
const Engine = require('./Engine');

const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());

app.post('/rules/execute', (req, res) => {
  let engine = new Engine();
  console.time();
  let evaluated = engine.execute(req.body.rules, req.body.model, req.body.quickReturn);
  console.timeEnd();
  res.status(202).send(evaluated);
});

console.log(`Rules service listening on port ${port}`);
app.listen(port);
