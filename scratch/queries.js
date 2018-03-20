const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

//find
// mongoose.connect(MONGODB_URI)
//     .then(() => {
//         const searchTerm = 'lady gaga';
//         let filter = {};

//         if (searchTerm) {
//             const re = new RegExp(searchTerm, 'i');
//             filter.title = { $regex:re }; 
//         }
//         return Note.find(filter)
//             .sort('created')
//             .then(results => {
//                 console.log(results);
//                 console.log('Find Done')
//             })
//             .catch(console.error);
//     })
//     .then(() => {
//         return mongoose.disconnect()
//         .then(() => {
//             console.info('Disconnected');
//         });
//     })
//     .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//     })

//findById
// mongoose.connect(MONGODB_URI)
//     .then(() => {
//         const searchId = '000000000000000000000002'
//         return Note.findById(searchId)
//             .then(results => {
//                 console.log(results);
//                 console.log('FindById done')
//             })
//             .catch(console.error);
//     })
//     .then(() => {
//         return mongoose.disconnect()
//         .then(() => {
//             console.info('Disconnected');
//         });
//     })
//     .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//     })

//Create
// mongoose.connect(MONGODB_URI)
//     .then(() => {
//         const createIt = new Note ({
//             title:  'Why cats are actually CIA agents',
//             content: 'lorem ipsum'
//         })
//         return Note.create(createIt)
//         .then((results) => {
//             console.log(results)
//         })
//         .catch(console.error);
//     })
//     .then(() => {
//         return mongoose.disconnect()
//         .then(() => {
//             console.info('Disconnected');
//         });
//     })
//     .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//     })

//Update
// mongoose.connect(MONGODB_URI)
//     .then(() => {
//         const searchId = '000000000000000000000004';
//         const updateIt = {
//             title: 'Why cats are secretly updating your database',
//             content: 'lorem ipsum again'
//         }
//         Note.findByIdAndUpdate(searchId, updateIt, { new: true })
//         .then((results) => {
//             console.log(results);
//         })
//         .catch(console.error);
//     })
//     .then(() => {
//         return mongoose.disconnect()
//         .then(() => {
//             console.info('Disconnected');
//         })
//     })
//     .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//    })

//Delete
// mongoose.connect(MONGODB_URI)
//     .then(() => {
//         const searchId = '000000000000000000000005';
//         Note.findByIdAndRemove(searchId)
//         .then((results) => {
//             console.log(results);
//         })
//         .catch(console.error)
//     })
//     .then(() => {
//         return mongoose.disconnect()
//         .then(() => {
//             console.info('Disconnected');
//         })
//     })
//     .catch(err => {
//         console.error(`ERROR: ${err.message}`);
//         console.error(err);
//     })

