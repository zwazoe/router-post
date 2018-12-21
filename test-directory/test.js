const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const app = express();

const Place = require('./models/Place');

const { RouterPost } = require('../index');

let routerPost = new RouterPost();

let req = {
	body: {
		creator: 'faslfjdsfsfs',
		owner: 'ajslfjsalfsfdjfs',
		id: 'kafdlsjfsfjfowfwe',
		place_id: 'fakfwrewerjwtjet',
		icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
		name: 'Naomi\'s Garden Restaurant & Lounge',
		'address-creator': 'fasdghdhfd',
		'address-apartment': '23',
		'address-category': [ 'home', 'business' ],
		'notes-creator': 'sfjsfljsowrwhrwfsfs',
		'notes-detail_information_comment_go': 'This place have a to go section and a great garden in the back. You would love it. Trust and believe me. '
	}
};

let mapPayload = [
	'creator',
	'owner',
	'id',
	'place_id',
	'icon',
	'name',
	'formated_address',
	'formated_phone_number',
	'location',
	'label',
	'types',
	'address-apartment',
	'address-category',
	'address-creator',
	'notes-detail',
	'notes-creator'
];

let data = routerPost.objectify(req.body, mapPayload, '-');

data.updated_at = Date.now();
// router.get('/current-place', passport.authenticate('jwt', { session: false }), (req, res) => {

routerPost.findPostOne(Place, [data, req, ''], { id: data.id }, [
		{
			condition: data.address[0].creator !== undefined,
			push: [
				{
					field: 'address',
					value: data.address[0]
				}
			],
			addons: [
				{
					field: 'updated_at',
					value: Date.now()
				}
			]
		},
		{
			condition: data.notes[0].creator !== undefined,
			push: [
				{
					field: 'notes',
					value: data.notes[0]
				}
			],
			addons: [
				{
					field: 'updated_at',
					value: Date.now()
				}
			]
		}
	]);

// })

