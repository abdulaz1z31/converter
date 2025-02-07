import { Worker } from "worker_threads";
import multer, { diskStorage } from "multer";
import { extname, join, basename, resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import queue from "../worker/quue.js";

const UPLOADS_DIR = resolve(process.cwd(), "uploads");
const CONVERTED_DIR = resolve(process.cwd(), "converted");
const WORKER_PATH = resolve(process.cwd(), "src", "worker", "video.worker.js");

function checkDirectories() {
  if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR);
  if (!existsSync(CONVERTED_DIR)) mkdirSync(CONVERTED_DIR);
}

const storage = diskStorage({
  destination: (req, file, cb) => {
    checkDirectories();
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });

export const convertVideo = (file) => {
  return queue.add(
    () =>
      new Promise((resolve, reject) => {
        checkDirectories();
        if (!file || !file.path) {
          return reject(new Error("Fayl topilmadi"));
        }

        const filePath = join(UPLOADS_DIR, file.filename);
        const outputFilename = `${Date.now()}.mp4`;
        const outputPath = join(CONVERTED_DIR, outputFilename);

        const worker = new Worker(WORKER_PATH, {
          workerData: { filePath, outputPath },
        });

        worker.on("message", (msg) => {
          if (msg.success) {
            resolve({ filename: outputFilename });
          } else {
            reject(new Error(msg.error));
          }
        });

        worker.on("error", reject);
      })
  );
};

export const downloadVideo = (filename, res) => {
  return new Promise((resolve, reject) => {
    const safeFilename = basename(filename);
    const filePath = join(CONVERTED_DIR, safeFilename);

    if (!existsSync(filePath)) {
      return reject(new Error("Fayl topilmadi"));
    }

    res.download(filePath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
