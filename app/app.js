import express from "express";
import dotenv from "dotenv";
dotenv.config();

export const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("여기는 루트!");
});

export const server = app.listen(PORT, function () {
    console.log(PORT);
    console.log('서버 구동 얍');
});

