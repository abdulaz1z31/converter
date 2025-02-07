import { Router } from "express";
import { VideoService } from "../service/video.service.js";

export const videoRouter = Router();

videoRouter.get("/download:filename", VideoService.download);
videoRouter.post("/upload", VideoService.upload);
