const mongoose = require("mongoose");
require("dotenv").config();

const PASS = process.env.DB_PASSWORD;
const uri = `mongodb+srv://aydgn-admin:${PASS}@girlink.wdo5f.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
