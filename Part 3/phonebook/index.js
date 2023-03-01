const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("postBody", function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"), "-",
        tokens["response-time"](req, res), "ms",
        tokens.postBody(req, res)
    ].join(" ")
}));

let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
]

app.get("/api/persons", (request, response) => {
    response.json(phonebook)
})

app.get("/info", (request, response) => {
    response.send(`
    <div>
        <h3>Phonebook has info for ${phonebook.length} people</h3>
        <h3>${new Date()}</h3>
    </div>
    `)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const singleEntry = phonebook.find(entry => entry.id === id)

    singleEntry ? response.json(singleEntry) : response.status(404).end();

})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter(entry => entry.id !== id);

    response.status(204).end()
})

const generateId = (phonebook) => {
    let newId;
    do {
        newId = Math.floor((Math.random() * 100) + 1);
    } while (phonebook.find(entry => entry.id === newId));

    return newId
}

app.post("/api/persons", (request, response) => {

    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        });
    } else if (phonebook.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        });
    }

    const entry = {
        id: generateId(phonebook),
        name: body.name,
        number: body.number,
    };

    phonebook = phonebook.concat(entry)
    response.json(entry)

})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})