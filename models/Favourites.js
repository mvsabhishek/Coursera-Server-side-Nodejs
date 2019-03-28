const mongoose = require('mongoose');
const schema = mongoose.Schema;

const favouriteSchema = new schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]

}, {
    timestamps: true
});

module.exports = Favourites = mongoose.model('Favourite', favouriteSchema);