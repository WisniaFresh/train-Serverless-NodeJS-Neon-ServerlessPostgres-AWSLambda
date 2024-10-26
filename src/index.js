const serverless = require("serverless-http");
const express = require("express");
const { getDbClient } = require("./db/clients");
const crud = require("./db/crud");
const validators = require("./db/validators");
const app = express();

app.use(express.json());

app.get("/", async (req, res, next) => {
  const sql = await getDbClient();
  const now = Date.now();
  const [dbNowResult] = await sql`select now();`;
  const delta = (dbNowResult.now.getTime() - now) / 1000;
  return res.status(200).json({
    message: "Hello from root!",
    delta: delta,
    stage: process.env.STAGE || "prod",
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.get("/leads/:id", async (req, res, next) => {
  const { id } = req.params;
  const results = await crud.getLead(id);
  return res.status(200).json({
    message: "Hello from get one lead path!",
    results,
  });
});

app.get("/leads", async (req, res, next) => {
  const results = await crud.listLeads();
  return res.status(200).json({
    message: "Hello from get leads path!",
    results,
  });
});

app.post("/leads", async (req, res, next) => {
  const postData = await req.body;
  console.log("postData", postData);

  //validation
  const { data, hasError, message } = await validators.validateLead(postData);
  console.log("validdata", data);
  if (hasError === true) {
    return res.status(400).json({
      message: message || "Invalid request. Please try again",
    });
  } else if (hasError === undefined) {
    return res.status(500).json({
      message: "Server Error",
    });
  }

  //creation
  const result = await crud.newLead(data);
  return res.status(201).json({
    message: "Hello from post path!",
    result,
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    message: "Not found",
  });
});

// server-ful app
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`running at: http://localhost:${PORT}`);
// });

module.exports.handler = serverless(app);
