import express from "express";
import {User} from "../../models/User.js";

export const router = express.Router();
router.use(express.json());

router.get("/add-users", (req, res) => {
    let users = [];
    for (let i = 0; i < 100; i++) {
        const user = new User({name:`user ${i}`});
        users.push(user);
    }
    User.insertMany(users).then(r => res.send(r));
});