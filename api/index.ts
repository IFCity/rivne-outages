import express from "express";
import { returnJson } from '../script';

const app = express();

const http = require('http').Server(app);

app.get("/api/v1", (req, res) => res.send("ChernivtsyOff API Status: OK"));

app.get("/api/v1/today", async (req, res) => {
  const result = await returnJson(false);
  res.status(200).send(result);
});

app.get("/api/v1/tomorrow", async (req, res) => {
  const result = await returnJson(true);
  res.status(200).send(result);
});

app.listen(process.env.PORT || 3010, () => console.log(`Server is ready`));

module.exports = app