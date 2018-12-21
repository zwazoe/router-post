# router-post
DRY method of creating and posting to the database. At first it may seems difficult and overwhelming but it is not. Just follow the documentation and you will save plenty of time.

## Why router post:

Other than the fact that router post is very lightweight, here's another reason.
You probably have found yourself using the same logic over and over again when you are posting to the database. 

We will great a router-post in order to add item from google place api. In addition, we will add items that does not come from the api itself.


1. you have to import router post inot your routes/api folder like so:

````
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const { RouterPost } = require('../../../libraries/router-post/index');
````

2. It is a class so you'll have to instantiate it like so:
````
let routerPost = new RouterPost();
````

3. Then, you'll start your express, as you normally would:
````
router.post('/create-address', passport.authenticate('jwt', { session: false }), (req, res) => {
  // router-post goes here
}
````

4. now, the sweet goodness starts. 
Noticed on the old way, without router post, you have to write many if and else statement logic in order to map your paylod. Like so:
````
if (req.body.creator) profileFields.handle = req.body.creator;
````

With router post, all you have to do is create an array and add the field to the array. this will do the maping for you. 
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
  
  4. You may then call routerPost.objectify to turn your payload to the desired data like so:
  The first argument is where the payload is comming from. The second argument is to map the payloa like we created above. 
  ````
  let data = routerPost.objectify(req.body.place, mapPayload);
  ````
  
  
  Here's a before and after of the code so far:
  
  BEFORE
  
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
// Get fields
	const placeFields = {};
	placeFields.user = req.user.id;
	if (req.body.creator) placeFields.handle = req.body.creator;
	if (req.body.owner) placeFields.company = req.body.owner;
	if (req.body.id) placeFields.website = req.body.id;
	if (req.body.place_id) placeFields.location = req.body.place_id;
	if (req.body.icon) placeFields.bio = req.body.icon;
  	if (req.body.name) placeFields.website = req.body.name;
	if (req.body.formated_address) placeFields.location = req.body.formated_address;
	if (req.body.formated_phone_number) placeFields.bio = req.body.formated_phone_number;
  	if (req.body.location) placeFields.website = req.body.location;
	if (req.body.label) placeFields.location = req.body.label;
	if (req.body.types) placeFields.bio = req.body.types;
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
	];
  let data = routerPost.objectify(req.body.place, mapPayload);

	routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, []);
})
  
  ````
  
  so FAR so DRY (haha)
  
  I will tell you about about routerPost.findPostOne later. Hold on a sec.
  
  5. Let say you want to add an item with array. 
  The old way, you may have to do something like so:
  ````
  // Skills - Spilt into array
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
    
    // add arrays
    'address-apartment',
		'address-category',
		'address-creator',
		'notes-detail',
		'notes-creator',
	];
  // state what is an array and the level of the array. 
  	let myArray = { myArrays: [ 'address', 'notes' ], level: 0 };
// add the array separator and the array iteself
  let data = routerPost.objectify(req.body.place, mapPayload, '-', myArray);

	routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, []);
})
  
  ````
  
  In the above code, I first added the arrays. address-apartment state the address is the key that contained the array. and apartment is the another object that have a key that contains apartment. This part of the model may look like this:
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
 If you wanted, you could have change the separator to a pipe like so |
 
 ````
 // add arrays
    'address|apartment',
		'address|category',
		'address|creator',
		'notes|detail',
		'notes|creator',
 
 ````
 
 Second, I state what the array is is. I created a let variable that is called myArray. Inside the object, I added myArrays. I stated that my arrays are address and notes. 
 
 Because this can be multilevel, I stated that the level is one level array. 
 ````
  // state what is an array and the level of the array. 
  	let myArray = { myArrays: [ 'address', 'notes' ], level: 0 };
 ````
 
 Third, I added the separator and my array
 
 ````
 // add the array separator and the array iteself
  let data = routerPost.objectify(req.body.place, mapPayload, '-', myArray);
 ````
 
 Now, such a complex router is simplified and dried up using router-post:
 
 6. Now, lets focus the following
 ````
	routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, []);
 ````
 
 First, I have to pass the model which is Place.
 Then, inside an array, I pass in data, req, res. data is of couse the data that I am saving. Req, res is being passed in order to obviosly make request and also respondng. 
 
 Next, I pass in id: data.id. 
 
 The third argument is to identify what it is that I am passing. Whatever logic you would pass in order to find and post one, you could do it here. As for me, I only want to find by id. 
 
 
 
 7. Lets say you want to add additional fields. Fields that you are not getting from the database. 
 
 if you want to add an additional field to the data. Let's say you want to created to default updated_at to Date.now().
 You will do the following:
 
 ````
 data.updated_at = Date.now();
	routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, [])
  
 ````
 And of course, you would of pass it with the rest of the field above. This is simply if you wanted to pass it in the router instead of in the request. 
 
 8. Lets say you wanted to add additional field to the arrays itselves. Lets say you wanted to add an updated_at default to the address array and the notes array. 
 
 You would do the following.

  ````
 routerPost.findPostOne(Place, [ data, req, res ], { id: data.id }, [
		{
			condition: data.address[0].creator !== undefined,
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

first, when you create myArray that includes address and notes. 
It will map the content of the array but it will not add the data. This is because, you may want to add more than oneset of data to your array. 

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

## Test Script

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

routerPost.findPostOne(Place, null, { id: data.id }, [
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

