const onClickBlurOverlay = (callback) => {
	$('.blur-overlay').on('click', function(e) {
		$(this).fadeOut();
		callback(e);
	});
};

export { onClickBlurOverlay };
