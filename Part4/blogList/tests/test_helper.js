const Blog = require("../models/blog");
const User = require("../models/user");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const initialBlogs = [
    {
        title: "title test1",
        author: "author test1",
        url: "url test1",
        likes: 1
    },
    {
        title: "title test2",
        author: "author test2",
        url: "url test2",
        likes: 1
    },
    {
        title: "title test3",
        author: "author test3",
        url: "url test3",
        likes: 1
    }
];

const initialUsers = [
    {
        username: "username test1",
        name: "name test1",
        passwordHash: "test1",
    },
    {
        username: "username test2",
        name: "name test2",
        passwordHash: "test2",
    },
    {
        username: "username test3",
        name: "name test3",
        passwordHash: "test3",
    }
];

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const logUser = async (username, name, password) => {
    const newUser = {
        username: username,
        name: name,
        password: password
    }

    await api
        .post("/api/users")
        .send(newUser)

    const loginUser = {
        username: newUser.username,
        password: newUser.password
    }

    const loggedUser = await (await api.post("/api/login").send(loginUser)).text

    return JSON.parse(loggedUser).token

}

module.exports = {
    initialBlogs, initialUsers, blogsInDb, usersInDb, logUser
}