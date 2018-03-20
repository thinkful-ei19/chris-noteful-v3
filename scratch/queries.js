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
mongoose.connect(MONGODB_URI)
    .then(() => {
        const searchId = mongoose.Types.ObjectId('000000000000000000000004');
        let filter = {};
        if (searchId) {
            filter._id = searchId
        }
        //return Note.findById(searchId)
        return Note.findOne({_id: "000000000000000000000007"})
        //return Note.find()
            .then(results => {
                console.log(results);
                console.log('FindById done')
            })
            .catch(console.error);
    })
    .then(() => {
        return mongoose.disconnect()
        .then(() => {
            console.info('Disconnected');
        });
    })
    .catch(err => {
        console.error(`ERROR: ${err.message}`);
        console.error(err);
    })

//Create
//Update
//Delete