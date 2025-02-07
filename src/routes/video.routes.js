import express from "express";
import { convert, download } from "../controller/video.controller.js";
import { upload } from "../service/video.service.js";
import { checkMovFile } from "../middleware/video.middleware.js";

export const router = express.Router();

router.post("/convert", upload.single("video"), checkMovFile, convert);
router.get("/download/:filename", download);
