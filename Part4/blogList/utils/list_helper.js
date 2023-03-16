const _ = require("lodash");

const dummy = (blogs) => {
    return 1
}

const totalLikes = (list) => {
    let sum = 0
    list.length === 0 ? 0 : list.map(item => sum += item.likes)

    return sum
}

const favoriteBlog = (list) => {
    if (list.length === 0) {
        return "no favorite blog"
    } else {

        const objWithMax = list.find(item => item.likes === Math.max(...list.map(item => item.likes)));

        const favoriteBlog = (({ title, author, likes }) => ({ title, author, likes }))(objWithMax);

        return favoriteBlog
    }
}

const mostBlogs = (list) => {

    if (list.length === 0) {
        return "empty list"
    } else {
        const authorFrequency = _.countBy(_.map(list, "author"));
        console.log("quantity", authorFrequency);

        const max = Math.max(...Object.values(authorFrequency));
        console.log(max);

        for (const [key, value] of Object.entries(authorFrequency)) {
            if (value === max) {
                return {
                    author: key,
                    blogs: value
                }
            }
        }
    }
}

const mostLikes = (list) => {
    if (list.length === 0) {
        return "empty list"
    } else {
        const authors = _.uniqBy(_.map(list, "author"));

        const authorLikes = [];

        authors.forEach(author => {
            let count = 0;
            list.find(item => {
                if (item.author === author) {
                    count += item.likes
                }
            })
            authorLikes.push({ author: author, likes: count })
        })

        return authorLikes.find(item => item.likes === Math.max(...authorLikes.map(item => item.likes)))
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}          