// const mongoose = require("mongoose");

// const contactSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// });

// const Contact = require("./models/contact");

// const password = process.argv[2];

// const url = `mongodb+srv://fullstack:${password}@phonebookfullstack.nfefvib.mongodb.net/?retryWrites=true&w=majority`;

// mongoose.set("strictQuery", false);

// mongoose.connect(url);


// if (process.argv.length === 3) {
//     Contact.find({}).then(result => {
//         console.log("Phonebook:");
//         result.length !== 0 ? result.forEach(contact => console.log(contact.name, contact.number)) : console.log("empty");
//         mongoose.connection.close()
//     });

// } else if (process.argv.length !== 3 && process.argv.length !== 5) {
//     console.log("Please give the password to see the Phonebook's contacts or password, name and number to add a new contact");
//     process.exit(1);
// } else {
//     const nameArgv = process.argv[3];
//     const name = nameArgv[0].toUpperCase() + nameArgv.substring(1)
//     const number = process.argv[4];

//     const contact = new Contact({
//         name: name,
//         number: number,
//     });

//     contact.save().then(result => {
//         console.log(`Added ${name} number ${number} to phonebook`);
//         mongoose.connection.close()
//     })
// }



