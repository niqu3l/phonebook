const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI
console.log(`Connecting to ${url}`);
mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log(`error connecting to MongoDB: ${error}`);
    });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
        validator: (v) => /^[0-9]{2}-[0-9]+/.test(v) || /^[0-9]{3}-[0-9]+/.test(v),
        message: (props) => `${props.value} is not a valid phone number`
    },
    required: true
  }
});

personSchema.set("toJSON", {
    transform: (document, returnedObj) => {
        returnedObj.id = document._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
    }
})

module.exports = mongoose.model('Person', personSchema);