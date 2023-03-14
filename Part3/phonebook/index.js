/* global process*/
const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Contact = require("./models/contact");

const errorHandler = (error, request, response, next) => {
    if (error.name === "CastError") { response.status(400).send({ error: "malformated id" }); } else if (error.name === "ValidationError") {
        response.status(400).send({ error: `${error.message}` });
    }

    next(error);
};

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("postBody", function (req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"), "-",
        tokens["response-time"](req, res), "ms",
        tokens.postBody(req, res)
    ].join(" ");
}));

app.get("/api/persons", (request, response) => {
    Contact.find({}).then(contacts => {
        contacts ? response.json(contacts) : response.status(404).end();
    });
});

app.get("/info", (request, response) => {
    Contact.find({}).then(contacts => {
        response.send(`
    <div>
        <h3>Phonebook has info for ${contacts.length} people</h3>
        <h3>${new Date()}</h3>
    </div>
    `);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
    Contact.findById(request.params.id)
        .then(contact =>
            contact ? response.json(contact) : response.status(404).end())
        .catch(error => next(error));

});

app.delete("/api/persons/:id", (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
        .then(contact =>
            contact ? response.status(204).end() : response.status(404).end())
        .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const entry = {
        name: body.name,
        number: body.number,
    };

    Contact.findByIdAndUpdate(request.params.id, entry, { new: true })
        .then(updatedContact => response.json(updatedContact))
        .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {

    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        });
    } else {
        const entry = new Contact({
            name: body.name,
            number: body.number
        });

        entry.save().then(savedContact => response.json(savedContact)).catch(error => next(error));
    }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});