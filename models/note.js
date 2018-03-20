const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {type: String, required: true },
    content: { type: String, required: true },
    created: { type: Date, default: Date.now() }
});

noteSchema.index({ title: 'text', content: 'text' })

module.exports = mongoose.model('Note', noteSchema); //collection => 'notes' --Remember that mongoose lower cases and pluralizes.
//mongoose.model('Note', noteSchema, 'notes'); // manually specify collection name