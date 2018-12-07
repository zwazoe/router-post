class Objectify {
	constructor(source, payload = [], separator = '_', myArray = { myArrays: [], level: 0 }) {
		// source is the location of fields such as req.body
		this.source = source;
		// assign the payload that build the payload = [creator, owner, address]
		this.payload = payload;
		// assigned separator for multilevel object
		this.separator = separator;

		// initiate an empty obj that will change
		this.obj = {};
		// initiate the empty field object that will be returned
		this.fields = {};
		this.myArray = myArray;
	}
	run() {
		this.payload.map((field) => {
			if (!field.includes(this.separator)) {
				// assign one value of the array as a key tot he field.
				// then get that value from the source.
				// fields = { field: req.body.field}
				if (this.source[field]) this.fields[field] = this.source[field];
			} else {
				// split fields into an array using the defined separator
				// google_place_location_lat = [google, place, location, lat]
				let fields = field.split(this.separator);
				// get the value from the source.
				let value = this.source[field];
				// turn the splited array into a nested objejt.
				let obj = fields.reduceRight((nested, key) => ({ [key]: nested }), value);
				// assigned the object to the rest of the fields.
				Object.assign(this.fields, obj);
			}
		});
		// check to see if any of the keys are an array

		if (this.myArray.level == 0 && this.myArray.myArrays.length > 0) {
			let keys = Object.keys(this.fields);
			keys.forEach((key) => {
				if (this.myArray.myArrays.includes(key)) {
					this.fields[key] = [ this.fields[key] ];
				}
			});
		}
		// return the fields.
		return this.fields;
	}
	post(route) {}
}

module.exports = {
	Objectify
};
