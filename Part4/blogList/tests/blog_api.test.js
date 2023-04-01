const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper")
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog")

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    // for (let blog of helper.initialBlogs) {
    //     let blogObject = new Blog(blog)
    //     await blogObject.save()
    // }
})

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

test("a new blog added", async () => {
    const blogsStart = await helper.blogsInDb()

    const newBlog = {
        title: "title test4",
        author: "author test4",
        url: "url test4",
        likes: 1
    }

    await api
        .post("/api/blogs")
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

    await api
        .post("/api/blogs")
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

    await api
        .post("/api/blogs")
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

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)

    const blogsEnd = await helper.blogsInDb()

    expect(blogsEnd).toHaveLength(blogsStart.length)
})

test("a blog with valid id, successfully removed", async () => {
    const blogsStart = await helper.blogsInDb()
    const removedBlog = blogsStart[0]

    await api
        .delete(`/api/blogs/${removedBlog.id}`)
        .expect(204)

    const blogsEnd = await helper.blogsInDb()

    expect(blogsEnd).toHaveLength(blogsStart.length - 1)
    expect(blogsEnd).not.toContain(removedBlog.content)
})

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

afterAll(async () => {
    await mongoose.connection.close()
})