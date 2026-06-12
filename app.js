require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());
app.use(express.static("dist"));

app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then(persons => res.json(persons))
        .catch(error => next(error));
});

app.get("/info", (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.send(`Phonebook has info for ${persons.length} people`)
        })
        .catch(error => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.post("/api/persons", (req, res, next) => {
    const body = req.body;
    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    const person = {
        name: body.name,
        number: body.number
    }
    const options = {
        new: true,
        runValidators: true,
        context: "query"
    }

    Person.findByIdAndUpdate(id, person, options)
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson)
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
}); 

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
}

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") {
        res.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    } else {
        next(error);
    }
}

app.use(errorHandler);

app.listen(process.env.PORT);