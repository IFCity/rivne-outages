import express from "express";
import axios from 'axios';
import * as moment from "moment-timezone"
import * as cheerio from 'cheerio';
import { transform } from '../transform';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const app = express();

app.get("/api/v1", (req, res) => res.send("RivneOff API Status: OK"));

const URL = "https://www.roe.vsei.ua/disconnections"

app.get("/api/v1/off", async (req, res) => {
    try {
      // Get the HTML from the URL
      axios.get(URL).then((response) => {
        // Load the HTML into cheerio
        const $ = cheerio.load(response.data);

        res.send({
          ...transform($),
          serverTime: moment.tz("Europe/Kiev").format('DD-MM-YYYY HH:mm'),
        })
      })
        .catch(error => {
          res.status(500).send(error)
        })
    } catch (error) {
      res.status(500).send(error)
    }
});

app.listen(process.env.PORT || 3010, () => console.log(`Server is ready`));

module.exports = app