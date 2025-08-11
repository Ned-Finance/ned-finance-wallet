import express from "express";
import { resizeImage } from "./requests/utils";

// Express initialization
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV == "production") {
  // TODO: Add app check verification using other provider than firebase
}

// Express routes
app.get("/resize-image", resizeImage);

// Express execution
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
