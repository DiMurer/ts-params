let s: string[];


function _add (key: string, value: any): void {
	value = typeof value === 'function' ? value() : value === null ? '' : value === undefined ? '' : value;
	s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
}


function _addArray (prefix: string, array: Array): void {
	let bracketRegex = /\[\]$/;

	array.forEach((value: any, i: number) => {
		if (bracketRegex.test(prefix)) {
			_add(prefix, value);
		} else {
			buildParams(prefix + '[' + (typeof value === 'object' ? i : '') + ']', value);
		}
	});
}


function _addObject (prefix: string, object: Object) {
	for (let key in object) {
		if (object.hasOwnProperty(key)) {
			buildParams(prefix + '[' + key + ']', object[key]);
		}
	}
}


function buildParams (prefix: string, obj: any): void {
	if (prefix) {
		if (Array.isArray(obj)) {
			_addArray(prefix, obj);
		} else if (obj && String(obj) === '[object Object]') {
			_addObject(prefix, obj);
		} else {
			_add(prefix, obj);
		}
	} else if (Array.isArray(obj)) {
		obj.forEach((value) => {_add(value.name, value.value)});
	} else {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				buildParams(key, obj[key]);
			}
		}
	}
}


export default function param (data: any): string {
	s = [];
	buildParams('', data);

	return s.join('&').replace(/%20/g, '+');
}

