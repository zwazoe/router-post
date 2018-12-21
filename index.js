const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

class RouterPost {
	constructor(
		source,
		payload = [],
		separator = '_',
		myArray = { myArrays: [], separator: '-' }
	) {
		// source is the location of fields such as req.body
		this.source = source;
		// assign the payload that build the payload = [creator, owner, address]
		this.payload = payload;
		// assigned separator for multilevel object
		this.separator = separator;

		// initiate the empty field object that will be returned
		this.myArray = myArray;
		this.fields = {};
		this.arr = []
	}
	objectify(source, payload = [], separator = '-') {
		payload.map((field) => {
			if (!field.includes(separator)) {
				// assign one value of the array as a key tot he field.
				// then get that value from the source.
				// fields = { field: req.body.field}
				if (source[field]) this.fields[field] = source[field];
			} else {
				// split fields into an array using the defined separator
				// google_place_location_lat = [google, place, location, lat]
				let fields = field.split(separator);
				if(!this.arr.includes(fields[0])){
					this.arr.push(fields[0])
				}
				let value = source[field];
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
			if (this.arr.length > 0) {
				let keys = Object.keys(this.fields);
				this.arr.forEach((key) => {
					let fields = key.split(separator);
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
		return this.fields;

	}
	findPostOne(Collection, settings, Condition = {}, DocumentHandler = []) {

		let data = settings[0];
		let req = settings[1];
		let res = settings[2];

		Collection.findOne(Condition).then((document) => {
			if (document) {
				if (DocumentHandler.length > 0) {
					DocumentHandler.forEach((element) => {
						if (element.condition) {
							element.push.forEach((pushing) => {
								document[pushing.field].push(pushing.value);
							});
							if (element.addons.length > 0) {
								element.addons.forEach((addon) => {
									document[addon.field] = addon.value;
								});
							}
						}
					});
				}

				document.save().then((document) => res.json(document));
			} else {
				// Save Place
				new Collection(settings[0]).save().then((document) => settings[2].json(document));
			}
		});
	}
}

module.exports = {
	RouterPost
};
