const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address Schema
const PlaceSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'profile'
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'profile'
	},
	id: {
		type: 'string'
	},
	icon: {
		type: 'string'
	},
	place_id: {
		type: 'string'
	},
	name: String,
	address: String,
	phone_number: String,
	location: {},
	label: String,
	notes: [
		{
			creator: {
				type: Schema.Types.ObjectId,
				ref: 'profile'
			},
			detail: {
				type: String
			},
			created_at: {
				type: Date,
				default: Date.now()
			}
		}
	],
	address: [
		{
			creator: {
				type: Schema.Types.ObjectId,
				ref: 'profile'
			},
			apartment: String,
			category: [ String ],
			created_at: {
				type: Date,
				default: Date.now()
			}
		}
	],
	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date
	}
});

module.exports = Place = mongoose.model('place', PlaceSchema);
