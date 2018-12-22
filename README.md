# router-post
DRY method of creating and posting to the database. You will no longer need to copy and paste the same things over and over again.

## Why router post:

Router Post is very lightweight and you won't have to worry about much logics when posting to the database. You simply  have to tell router-post what is what.

### small project
Lets create a small project where you must add data to the database. The data will consist of objects and arrays.

Let's implement the model.

````
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address Schema
const PlaceSchema = new Schema({
	owner: String,

	creator: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	id: {
		type: 'string'
	},

	name: String,
	formatted_address: String,
	formatted_phone_number: String,
	types: [ String ],
	label: String,
	icon: {
		type: 'string'
	},
	place_id: {
		type: 'string'
	},

	location: {},
	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date
	},
	notes: [
		{
			creator: {
				type: Schema.Types.ObjectId,
				ref: 'users'
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
				ref: 'users'
			},
			apartment: String,
			category: [ String ],
			created_at: {
				type: Date,
				default: Date.now()
			}
		}
	]
});

module.exports = Place = mongoose.model('place', PlaceSchema);

````



- Then, you should create a place.js file in your routes/api directory. And import router-post. 

````
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const { RouterPost } = require('router-post');
````

- It is a class so you'll have to instantiate it:
````
let routerPost = new RouterPost();
````

- Then, you'll start your express, as you normally would:
````
router.post('/create-place', passport.authenticate('jwt', { session: false }), (req, res) => {
  // router-post goes here
}
````

- now, the sweet goodness starts. 
If you weren't using router post, you'll probably have to do the following for each fields:
````
if (req.body.creator) profileFields.handle = req.body.creator;
````
imagine if you have 50 field. it would be a lots of copy and paste. 

With router post, all you have to do is create an array and add the field to the array. 
````
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
	];
  ````
  
  - You may then call routerPost.objectify to turn your payload to the desired data.
  The first argument is where the payload is comming from. The second argument is the actual payload map. 
 
  ````
  	let data = routerPost.objectify(req.body.place, mapPayload);
  ````
   Their is a third argument which is called the separator. The default is '-'. Therefore, if you have any field that includes a -, you'll have to change the separator. 
  
  for example. If formated_address was written formated-address. 
  but you did not want formated-address to be an array. 
  you would have to include a third argument.
  
  ````
  let data = routerPost.objectify(req.body.place, mapPayload, '|');
  ````
  But in my case, I could simply leave it without a seperator because there is no conflict since I am not using the default separator '-'
 
  In order to trully appreciated router-post, here's a before and after of the code so far:
  
  BEFORE using Router-Post
  
````

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

	const placeFields = {};
	placeFields.user = req.user.id;
	if (req.body.creator) placeFields.creator = req.body.creator;
	if (req.body.owner) placeFields.owner = req.body.owner;
	if (req.body.id) placeFields.id = req.body.id;
	if (req.body.place_id) placeFields.place_id = req.body.place_id;
	if (req.body.icon) placeFields.icon = req.body.icon;
  	if (req.body.name) placeFields.name = req.body.name;
	if (req.body.formated_address) placeFields.formated_address = req.body.formated_address;
	if (req.body.formated_phone_number) placeFields.formated_phone_number = req.body.formated_phone_number;
  	if (req.body.location) placeFields.location = req.body.location;
	if (req.body.label) placeFields.label = req.body.label;
	if (req.body.types) placeFields.types = req.body.types;
 }
 	Place.findOne({ user: req.user.id }).then((place) => {
		if (place) {
			// Update
			Place.findOneAndUpdate({ user: req.user.id }, { $set: placeFields }, { new: true }).then((place) =>
				res.json(place)
			);
		} else {
			// Create

			// Check if handle exists
			Place.findOne({ handle: placeFields.handle }).then((place) => {
				if (place) {
					errors.handle = 'That handle already exists';
					res.status(400).json(errors);
				}

				// Save Place
				new Place(placeFields).save().then((place) => res.json(place));
			});
		}
	});
});
````
  
  AFTER:
  
````

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
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
	];
	let data = routerPost.objectify(req.body.place, mapPayload);
	routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, []);
})
 ````
  
  so FAR so DRY (haha)
  
  I will tell you about about routerPost.findPostOne later. Hold on a sec.
  
  - Let say you want to add an item with array. 
  The old way, you may have to do something like so:
 ````

	if (typeof req.body.category !== 'undefined') {
		placeFields.category = req.body.category.split(',');
	}
  ````
  And if you'll have to focus on each individual field depending on its logic.
  
  With router-post, you simply have to state the array and what it is:
  
   
  ````
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Place  Model
const Place = require('../../../models/people/Place');
// Load User Model
const User = require('../../../models/people/User');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {


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
		'notes-creator',
	];

  let data = routerPost.objectify(req.body.place, mapPayload, '-');

	routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, []);
})
  
  ````
  In the above code, I added the fields as I normally would. For example: creator, owner, id. etc. 

  Then, I added the arrays. I used a dash "-" to separator the arrays. i.e. address-apartment, address-category, note-detail
  
  This state that address and notes are the keys that contain the array. 

  Here's a snippet of the model.

  ````
  address: [{
    apartment: String,
    category: String,
    creator: {
       type: Schema.Types.ObjectId,
       ref: 'users' 
    }
  }]
  ````
 
 Notice, in Objectifying the data. I  include a separator. The separator can be whatever you want it to be. It can even be a string. 
 
 address-apartment. The "-" is the separator.
 If you want, you could have change the separator to a pipe like so |
 
 ````
    	'address|apartment',
		'address|category',
		'address|creator',
		'notes|detail',
		'notes|creator',
 
 ````
 
 If I were to use the above code where I use pipes (|) instead of dashes (-), I would have to state pipes (|) as my separator.
 ````
 // add the array separator and the array iteself
  let data = routerPost.objectify(req.body.place, mapPayload, '|');
 ````
 
 Now, such a complex router is simplified and dried up using router-post:
 
 - Now, lets focus the following
 ````
	routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, []);
 ````
 
The first argument is the actual model. 

The second argument is an array that includes data, requests and responses.

The third argument is the condition. If there is an id that matched data.id, we should update instead of create. If not, we should create. 
 
 
 - Lets say you want to add additional fields. Fields that you are not getting from the datasource (req.body). 
 
 if you want to add an additional field to the data. Let's say you want to created to default updated_at to Date.now().
 You will do the following:
 
 ````
 	data.updated_at = Date.now();
	routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, [])
  
 ````
 And of course, you would of pass it with the rest of the field above. This is simply if you wanted to pass it in the router instead of in the request. 
 
 - Lets say you wanted to add additional field to the arrays itselves. Lets say you wanted to add an updated_at default to the address array and the notes array. 
 
 You would do the following.

  ````
 routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, [
	{
		condition: true,
		push: [
			{
				field: 'address',
				value: data.address[0]
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
]
  
  ````
  
Let's explain the above code. 

First, router-post already identified your arrays. It simply identify the array. You'll then have to tell it what to push. 

I did this for a reason. Most likely, you may want to create a different route that will add your address or notes. This technique able you to do that. Here's how it works. 

You wil include your condition. If the condition is true, it will work. If you don't have a logic for this, just pass in true. 

````
condition: data.address[0].creator !== undefined

or

condition: true

````

then, you will create the items that you want to push. This is an array, you can add as many item as you like. 
````
	push: [
		{
			field: 'address',
			value: data.address[0]
		}
	]

````
If you want to manually add an item to this array, you would add the addons like so:

````
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
}
````

## Ready Script

````
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

let data = routerPost.objectify(req.body, mapPayload);

data.updated_at = Date.now();
router.get('/current-place', passport.authenticate('jwt', { session: false }), (req, res) => {

routerPost.findPostOne(Place, [data, req, res], { id: data.id }, [
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

})





````

