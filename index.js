import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import cors from "cors";

import authRouter from "./routes/auth.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors());



app.use("/api", authRouter);

app.get('/', (req, res) => {
    res.send('Hello from Express with sdsdsssss!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});