import express from "express";
import { router } from "./src/routes/video.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
