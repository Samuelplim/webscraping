import consumerService from "./service/consumer.service";
const puppeteer = require("puppeteer");
require("dotenv").config();

const consumer = new consumerService();
(async () => {
  consumer.run();
})();
