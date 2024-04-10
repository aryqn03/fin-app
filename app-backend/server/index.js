// https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/

// http://localhost:3001/api

const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!!!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
