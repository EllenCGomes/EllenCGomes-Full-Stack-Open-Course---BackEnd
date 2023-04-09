// npm test -- tests/blog_api.test.js -> to test only this file
// npm test -- -t "a specific note is within the returned notes" -> to test only the test with that name or the describe block
// npm test -- -t 'blogs' -> run all tests that contain notes in their name

const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper")
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog")
const User = require("../models/user")


describe("blog tests", () => {

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const token = await helper.logUser("apiTest", "apiTest", "apiTest")
        await api.post("/api/blogs").set({ "Authorization": `bearer ${token}`, "Content-Type": "application/json" }).send(helper.initialBlogs[0])

    })


    describe("when there is initially some blogs saved", () => {
        test("blogs returned as json", async () => {
            await api
                .get("/api/blogs")
                .expect(200)
                .expect("Content-Type", /application\/json/)
        })

        test("unique identifier property named as id instead of _id", async () => {
            // const blogs = await helper.blogsInDb();
            // const blog = blogs[0];

            const resultBlog = await api
                .get(`/api/blogs`)

            expect(resultBlog.body[0].id).toBeDefined()
        })
    })

    describe("add a blog", () => {
        test("a new blog added", async () => {
            const blogsStart = await helper.blogsInDb()

            const newBlog = {
                title: "title test4",
                author: "author test4",
                url: "url test4",
                likes: 1
            }

            const token = await helper.logUser("apiTest", "apiTest", "apiTest")

            await helper.logUser("apiTest", "apiTest", "apiTest")
            await api
                .post("/api/blogs")
                .set({ "Authorization": `bearer ${token}`, "Content-Type": "application/json" })
                .send(newBlog)
                .expect(201)

            const blogsEnd = await helper.blogsInDb()
            expect(blogsEnd).toHaveLength(blogsStart.length + 1)
        })

        test("property likes missing, default will be 0", async () => {
            const newBlog = {
                title: "title test5",
                author: "author test5",
                url: "url test5"
            }
            const token = await helper.logUser("apiTest", "apiTest", "apiTest")
            await api
                .post("/api/blogs")
                .set({ "Authorization": `bearer ${token}`, "Content-Type": "application/json" })
                .send(newBlog)
                .expect(201)

            const blogs = await helper.blogsInDb()
            const lastBlog = blogs[blogs.length - 1]

            expect(lastBlog.likes).toBe(0)
        })

        test("blog without title is not added", async () => {
            const blogsStart = await helper.blogsInDb();

            const newBlog = {
                author: "author test4",
                url: "url test4",
                likes: 1
            }
            const token = await helper.logUser("apiTest", "apiTest", "apiTest")
            await api
                .post("/api/blogs")
                .set({ "Authorization": `bearer ${token}`, "Content-Type": "application/json" })
                .send(newBlog)
                .expect(400)

            const blogsEnd = await helper.blogsInDb();

            expect(blogsStart).toHaveLength(blogsEnd.length)
        })

        test("blog without url is not added", async () => {
            const blogsStart = await helper.blogsInDb();

            const newBlog = {
                author: "author test5",
                likes: 1
            }
            const token = await helper.logUser("apiTest", "apiTest", "apiTest")

            await api
                .post("/api/blogs")
                .set({ "Authorization": `bearer ${token}`, "Content-Type": "application/json" })
                .send(newBlog)
                .expect(400)

            const blogsEnd = await helper.blogsInDb()

            expect(blogsEnd).toHaveLength(blogsStart.length)
        })
    })

    describe("delete a blog", () => {
        test("a blog with valid id, successfully removed", async () => {
            const blogsStart = await helper.blogsInDb()
            const removedBlog = blogsStart[0]
            const token = await helper.logUser("apiTest", "apiTest", "apiTest")
            await api
                .delete(`/api/blogs/${removedBlog.id}`)
                .set({ "Authorization": `bearer ${token}`, "Content-Type": "application/json" })
                .expect(204)

            const blogsEnd = await helper.blogsInDb()

            expect(blogsEnd).toHaveLength(blogsStart.length - 1)
            expect(blogsEnd).not.toContain(removedBlog.content)
        })
    })

    describe("update a blog", () => {
        test("specific blog updated", async () => {
            const blogsStart = await helper.blogsInDb()
            const updatedBlog = {
                title: "title test1",
                author: "author test1",
                url: "url test1",
                likes: 5
            }

            await api
                .put(`/api/blogs/${blogsStart[0].id}`)
                .send(updatedBlog)
                .expect(204)

            const blogsEnd = await helper.blogsInDb()
            expect(blogsEnd[0].likes).toBe(5)
        })
    })
})

describe("add a user", () => {

    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(helper.initialUsers)
    })

    test("creation fails with proper statuscode and message if username is already taken", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "username test2",
            name: "newname teste2",
            password: "newteste2"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("expected `username` to be unique")

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if username does not have min length", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "us",
            name: "newname teste2",
            password: "newteste2"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("shorter than the minimum allowed length")

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if password does not have min length", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "username test2",
            name: "newname teste2",
            password: "ne"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("Password must be at least 3 characters long")

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if username is missing", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: "newname teste2",
            password: "newteste2"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("`username` is required")

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if password is missing", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "username test2",
            name: "newname teste2",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("`password` is required")

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

})

afterAll(async () => {
    await mongoose.connection.close()
})