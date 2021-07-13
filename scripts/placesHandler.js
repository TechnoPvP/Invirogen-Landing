let autocomplete;
function initAutocomplete() {
	autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {
		types                 : [ 'address' ],
		componentRestrictions : { country: [ 'US' ] },
		fields                : [ 'place_id', 'geometry', 'name' ]
	});
}

function onPlaceChanged() {
	var place = autocomplete.getPlace();

	if (!place.geometry) {
		document.getElementById('autocomplete').placeholder = 'Enter a place';
	} else {
		document.getElementById('autocomplete').innerHTML = place.name;
	}
}
