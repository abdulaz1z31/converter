import express from "express";
import { videoRouter } from "./src/routes/video.routes.js";

const app = express();
const port = process.env.PORT || 4200;

app.use(videoRouter);

app.listen(port, () => {
  console.log(`Server http://localhost:${port} da ishlamoqda`);
});
