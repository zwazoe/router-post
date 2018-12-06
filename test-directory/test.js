const { Objectify } = require('../index');
// _ indicate a subdomain. Camelcase multiple words.
let payload = [
	'creator',
	'owner',
	'address',
	'googleid',
	'placeid',
	'place_address_creator',
	'place_address_apartment',
	'place_address_category',
	'detail_notes_creator',
	'detail_notes_notes'
];

let req = {
	body: {
		creator: 'faslfjdsfsfs',
		owner: 'ajslfjsalfsfdjfs',
		placeid: 'fakfwrewerjwtjet',
		place_address_creator: 'fasdghdhfd',
		place_address_apartment: '23',
		place_address_category: [ 'home', 'business' ],
		detail_notes_creator: 'gjghjt',
		detail_notes_notes: 'This is a note'
	}
};

let objectify = new Objectify(req.body, payload, '_');

console.log(objectify.run());
