class Objectify {
	constructor(
		source,
		payload = [],
		separator = '_',
		myArray = { myArrays: [ 'notes_detail_information', 'address_apartment' ], separator: '_' }
	) {
		// source is the location of fields such as req.body
		this.source = source;
		// assign the payload that build the payload = [creator, owner, address]
		this.payload = payload;
		// assigned separator for multilevel object
		this.separator = separator;

		// initiate an empty obj that will change
		this.obj = {};
		// initiate the empty field object that will be returned
		this.myArray = myArray;
		this.fields = {};
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
				let value = this.source[field];
				switch (fields.length) {
					case 2:
						if (!this.fields[fields[0]]) this.fields[fields[0]] = {};
						this.fields[fields[0]][fields[1]] = value;
						break;
					case 3:
						if (!this.fields[fields[0]]) this.fields[fields[0]] = {};
						if (!this.fields[fields[0]][fields[1]]) this.fields[fields[0]][fields[1]] = {};
						this.fields[fields[0]][fields[1]][fields[2]] = value;
					case 4:
						if (!this.fields[fields[0]]) this.fields[fields[0]] = {};
						if (!this.fields[fields[0]][fields[1]]) this.fields[fields[0]][fields[1]] = {};
						if (!this.fields[fields[0]][fields[1]][fields[2]])
							this.fields[fields[0]][fields[1]][fields[2]] = {};
						this.fields[fields[0]][fields[1]][fields[2]][fields[3]] = value;
					case 5:
						if (!this.fields[fields[0]]) this.fields[fields[0]] = {};
						if (!this.fields[fields[0]][fields[1]]) this.fields[fields[0]][fields[1]] = {};
						if (!this.fields[fields[0]][fields[1]][fields[2]])
							this.fields[fields[0]][fields[1]][fields[2]] = {};
						if (!this.fields[fields[0]][fields[1]][fields[2]][fields[3]])
							this.fields[fields[0]][fields[1]][fields[2]][fields[3]] = {};
						this.fields[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]] = value;

						break;
				}
			}
		});
		// check to see if any of the keys are an array

		if (this.myArray.myArrays.length > 0) {
			let keys = Object.keys(this.fields);
			this.myArray.myArrays.forEach((key) => {
				let fields = key.split(this.myArray.separator);
				switch (fields.length) {
					case 1:
						if (this.fields[fields[0]]) this.fields[fields[0]] = [ this.fields[fields[0]] ];
						break;
					case 2:
						if (this.fields[fields[0]][fields[1]])
							this.fields[fields[0]][fields[1]] = [ this.fields[fields[0]][fields[1]] ];
						break;
					case 3:
						if (this.fields[fields[0]][fields[1]][fields[2]])
							this.fields[fields[0]][fields[1]][fields[2]] = [ this.fields[fields[0]][fields[1]] ][
								fields[2]
							];
						break;

					case 4:
						if (this.fields[fields[0]][fields[1]][fields[2]][fields[3]])
							this.fields[fields[0]][fields[1]][fields[2]][fields[3]] = [
								this.fields[fields[0]][fields[1]]
							][fields[2]][fields[3]];
						break;

					case 5:
						if (this.fields[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]])
							this.fields[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]] = [
								this.fields[fields[0]][fields[1]]
							][fields[2]][fields[3]][fields[4]];
						break;
				}
			});
		}
		// return the fields.
		console.log(this.fields);
		return this.fields;
	}
	post(route) {}
}

module.exports = {
	Objectify
};
