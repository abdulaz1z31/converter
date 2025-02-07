import ffmpeg from "fluent-ffmpeg";
import { parentPort, workerData } from "worker_threads";
import { unlinkSync } from "fs";

const { filePath, outputPath } = workerData;

ffmpeg(filePath)
  .outputOptions([
    "-preset ultrafast",  
    "-crf 23",         
    "-movflags faststart",
    "-threads 0",
  ])
  .output(outputPath)
  .on("end", () => {
    unlinkSync(filePath);
    parentPort.postMessage({ success: true, filename: outputPath });
  })
  .on("error", (err) => {
    parentPort.postMessage({ success: false, error: err.message });
  })
  .run();
