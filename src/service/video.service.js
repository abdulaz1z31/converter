import multer, { diskStorage } from "multer";
import ffmpeg from "fluent-ffmpeg";
import { extname, join } from "path";
import { existsSync, mkdirSync, unlinkSync } from "fs";

function existsFiles() {
  if (!existsSync("uploads")) {
    mkdirSync("uploads");
  }
  if (!existsSync("converted")) {
    mkdirSync("converted");
  }
}
const storage = diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
});

const upload = multer({ storage });
export const VideoService = {
  upload(req, res, next) {
    existsFiles();
    if (!req.file) {
      return res.status(400).json({ error: "Fayl yuklanmadi" });
    }
    const inputPath = req.file.path;
    const outputFilename = `${Date.now()}.mp4`;
    const outputPath = join("converted", outputFilename);
    ffmpeg(inputPath)
      .output(outputPath)
      .on("end", () => {
        unlinkSync(inputPath);
        res.json({
          message: "Konvertatsiya muvaffaqiyatli bajarildi!",
          downloadUrl: `/download/${outputFilename}`,
        });
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: "Konvertatsiya amalga oshmadi" });
      })
      .run();
  },
  download(req, res, next) {
    const { filename } = req.params;
    const filePath = join("converted", filename);

    if (!existsSync(filePath)) {
      return res.status(404).json({ error: "Fayl topilmadi" });
    }

    res.download(filePath);
  },
};
