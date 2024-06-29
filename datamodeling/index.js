import express from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.send("welcome to our pgae ");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
