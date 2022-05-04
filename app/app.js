import express from "express";

export const app = express();


app.get("/", (req, res) => {
    res.send("여기는 루트!");
});

export const server = app.listen(3000, function () {
    console.log('서버 구동 얍');
});

