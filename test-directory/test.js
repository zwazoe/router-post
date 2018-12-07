const { Objectify } = require('../index');
// _ indicate a subdomain. Camelcase multiple words.
let payload = [
	'creator',
	'owner',
	'address',
	'googleid',
	'placeid',
	'address_creator',
	'address_apartment',
	'address_category',
	'notes_creator',
	'notes_detail_information_comment_go'
];

let req = {
	body: {
		creator: 'faslfjdsfsfs',
		owner: 'ajslfjsalfsfdjfs',
		placeid: 'fakfwrewerjwtjet',
		address_creator: 'fasdghdhfd',
		address_apartment: '23',
		address_category: [ 'home', 'business' ],
		notes_creator: 'gjghjt',
		notes_detail_information_comment_go: 'This is a note'
	}
};

let objectify = new Objectify(req.body, payload, '_');

console.log(objectify.run());
