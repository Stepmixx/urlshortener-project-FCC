require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRouter = require("./routes/api");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Conection to database
const uri = process.env.MONGO_URI;
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(uri, connectionOptions);

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.use("/api", apiRouter);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
