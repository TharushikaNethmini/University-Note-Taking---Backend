import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cors from "cors";

import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import notesRouter from "./routes/notes.js";
import categoryRouter from "./routes/categories.js";
import tagsRouter from "./routes/tags.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use("/api", authRouter);
app.use("/api", usersRouter);
app.use("/api", notesRouter);
app.use("/api", categoryRouter);
app.use("/api", tagsRouter);

app.get("/", (req, res) => {
  res.send("Hello from Express with sdsdsssss!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
