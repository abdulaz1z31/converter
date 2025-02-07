import { convertVideo, downloadVideo } from "../service/video.service.js";

export const convert = async (req, res, next) => {
  try {
    const result = await convertVideo(req.file);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const download = async (req, res, next) => {
  try {
    await downloadVideo(req.params.filename, res);
  } catch (error) {
    next(error);
  }
};
