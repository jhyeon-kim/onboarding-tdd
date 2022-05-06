import {User} from "../User.js";

// Dummy data and storage

const user1 = new User({name: "Ice-bear"});
const user2 = new User({name:"Panda"});
const user3 = new User({name:"Brownie"});

export default class UserStorage {
    users = [user1, user2, user3];
}