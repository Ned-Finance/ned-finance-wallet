import { Request, Response } from "express";
import { ResizeImageRequest } from "./types";
import axios from "axios";
import sharp from "sharp";

export const resizeImage = async (
  req: Request<object, object, object, ResizeImageRequest>,
  res: Response
) => {
  const { width, height, url } = req.query;
  try {
    const imageResponse = await axios({ url: url, responseType: "stream" });

    const src = imageResponse.data.pipe(sharp());
    const image = src
      .resize(Number(width), Number(height), {
        fit: "cover",
        position: "center",
      })
      .toFormat("jpeg")
      .toBuffer();

    image.then((resizedImage: ArrayBuffer) => {
      const headers = { "Content-Type": "image/jpeg" };
      res.writeHead(200, headers);
      res.end(resizedImage, "binary");
    });
  } catch (e) {
    console.log(e);
    res.end();
  }
};
