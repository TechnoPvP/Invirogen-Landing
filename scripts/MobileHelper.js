import { onClickBlurOverlay } from './Utils.js';

const MobileHelper = function() {
	const s = {
		circleGridWrapper : $('.mhelper__grid'),
		helperButton      : $('.mhelper__button'),
		helperIemWrapper  : $('.mhelper__items-wrapper')
	};

	return {
		init          : function() {
			this.bindUI();
		},
		bindUI        : function() {
			// Form Contact Us Action
			$('#action--contactus').click(() => {
				this.toggleDisplay();
			});
			onClickBlurOverlay(() => {
				this.setDisplay(false);
			});
			s.helperButton.click(() => {
				// TODO Do we want to toggle blur for this?
				this.toggleDisplay();
			});
		},
		toggleDisplay : function() {
			s.circleGridWrapper.toggleClass('active');
			s.helperButton.toggleClass('active');
			s.helperIemWrapper.fadeToggle(250);
		},
		// close         : function() {
		// 	s.circleGridWrapper.removeClass('active');
		// 	s.helperButton.removeClass('active');
		// 	s.helperIemWrapper.fadeOut(250);
		// },
		// open          : function() {
		// 	s.circleGridWrapper.addClass('active');
		// 	s.helperButton.addClass('active');
		// 	s.helperIemWrapper.fadeIn(250);
		// },
		setDisplay    : function(boolean) {
			if (boolean) {
				s.helperIemWrapper.fadeIn(250);
			} else {
				s.helperIemWrapper.fadeOut(250);
			}
			s.circleGridWrapper.addClass('active', boolean);
			s.helperButton.addClass('active', boolean);
		}
	};
};

export default MobileHelper;
