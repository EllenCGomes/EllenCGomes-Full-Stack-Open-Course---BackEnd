const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {

    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })

    response.json(blogs)

})

blogsRouter.post("/", async (request, response) => {

    const body = request.body

    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })

    const result = await blog.save()
    user.blogs = user.blogs.concat(result.id)

    await user.save()
    response.status(201).json(result)

})

blogsRouter.delete("/:id", async (request, response) => {

    const blogToDelete = await Blog.findById(request.params.id);

    const user = request.user

    if (blogToDelete.user.toString() !== user.id.toString()) {
        return response.status(401).json({
            error: "invalid token or user"
        })
    }

    await blogToDelete.delete()

    response.status(204).end()

})

blogsRouter.put("/:id", async (request, response) => {
    const { title, author, url, likes } = request.body

    const result = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: "query" })

    response.status(204).json(result)
})

module.exports = blogsRouter