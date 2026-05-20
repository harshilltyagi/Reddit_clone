import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import auth from "./middleware/authMiddleware.js";
import communityRoutes from "./routes/communityRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://reddit-clone-nine-omega.vercel.app",
    credentials: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Api is working");
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
