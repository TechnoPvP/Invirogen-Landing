const MobileHelper = function() {
	const s = {
		helperButton     : $('.mhelper__button'),
		helperIemWrapper : $('.mhelper__items-wrapper'),
		helperItems      : $('.mhelper__item')
	};

	return {
		init     : function() {
			this.bindUI();
		},
		bindUI   : function() {
			s.helperButton.click(function() {
				// TODO Do we want to toggle blur for this?
				// SidebarWidget.toggleBlur();
				$('.grid-wrapper').toggleClass('active');
				$('.mhelper__button').toggleClass('active');
				$('.mhelper__items-wrapper').fadeToggle(250);
			});
		},
		openTab  : function() {},
		closeTab : function() {}
	};
};

export default MobileHelper;
