const blurOverlay = $('#blur-overlay');

const onClickBlurOverlay = (callback) => {
	blurOverlay.on('click', function(e) {
		$(this).fadeOut();
		callback(e);
	});
};

const setBlurOverlayVisible = (boolean) => {
	if (boolean === null || boolean == undefined) return console.error('Blur overlay must have a value.');

	boolean ? blurOverlay.fadeIn(250) : blurOverlay.fadeOut(250);
	console.log('blur set');
};

export { onClickBlurOverlay, setBlurOverlayVisible };
