import consumerService from "./service/consumer.service";
require("dotenv").config();

const consumer = new consumerService();
(async () => {
  consumer.run();
})();
