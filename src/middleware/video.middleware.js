import { extname } from "path";

export const checkMovFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Fayl yuklanmadi" });
  }

  const fileExt = extname(req.file.originalname).toLowerCase();
  if (fileExt !== ".mov") {
    return res
      .status(400)
      .send({ error: "Only files in .mov format can converted" });
  }

  next();
};
