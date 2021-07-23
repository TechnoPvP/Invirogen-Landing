import { onClickBlurOverlay } from './Utils.js';

const SidebarWidget = {
	settings        : {
		sidebar     : $('.sidebar'),
		hamburger   : $('#hamburger'),
		blurOverlay : $('.blur-overlay')
	},
	init            : function() {
		this.bindUI();
		// 	console.log('Loaded sidebar widget');
	},

	bindUI          : function() {
		$('#hamburger').on('click', function() {
			SidebarWidget.toggleSidebar();
		});
		onClickBlurOverlay(() => {
			this.closeSidebar();
		});
	},
	toggleBlur      : function() {
		this.settings.blurOverlay.fadeToggle();
	},
	toggleHamburger : function() {
		this.settings.hamburger.fadeToggle();
	},
	toggleSidebar   : function() {
		// SidebarWidget.settings.sidebar.toggleClass('active');
		this.settings.sidebar.fadeToggle();
		this.toggleBlur();
		this.settings.hamburger.toggleClass('open');
	},
	closeSidebar    : function() {
		this.settings.sidebar.fadeOut();
		this.settings.hamburger.removeClass('open');
	}
};

export default SidebarWidget;
