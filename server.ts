import express from "express";

const app = express();
const port = 5000;
//

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
