import User from "./User.js";

const user1 = new User("Ice-bear");
const user2 = new User("Panda");
const user3 = new User("Brownie");

export default class UserStorage {
    users = [user1, user2, user3];
}