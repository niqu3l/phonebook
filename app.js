const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());
app.use(express.static("dist"));

let persons = [
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
                   {
                    "id": 5,
                    "name": "martin",
                    "number": "234"
                   }
                ];
const ids = new Set()

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${(new Date())}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = persons.find(person => person.id === id);

    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const newPersons = persons.filter(person => person.id !== id);

    if (newPersons.length === persons.length) {
        res.status(404).end();
    } else {
        persons = newPersons;
        res.status(204).end();
    }
});

const createId = () => {
    const range = 10000;
   
    let id = Math.trunc(Math.random()*range); 
    while (ids.has(id)) {
        id = Math.trunc(Math.random()*range);
    }

    return id;
}

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if(!body.name || !body.number) {
        res.status(400).json({error: "content missing"});
    } else if (persons.some(p => p.name === body.name)){
        res.status(400).json({error: "person already exists"});
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: createId()
        }

        persons = persons.concat(person);
        res.json(person);
    }
});

app.put("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    const body = req.body;

    if (person) {
        person.number = body.number;
        res.json(person);
    } else {
        res.status(400).json({error: "id incorrect"});
    }
}); 

const port = 3001;
app.listen(port);