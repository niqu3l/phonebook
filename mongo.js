const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fuefau_db_user:${password}@phonebook.vnd4vaw.mongodb.net/?appName=phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const person = new Person({ name: process.argv[3], number: Number(process.argv[4]) });
  person.save().then(() => {
    console.log(`Added ${person.name} ${person.number} to phonebook`)
    mongoose.connection.close();
  });
}