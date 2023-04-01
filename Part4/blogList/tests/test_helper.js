const Blog = require("../models/blog");

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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}