import FormWidget from './FormWidget.js';
import MobileHelper from './MobileHelper.js';
import ImageSlider from './ImageSlider.js';

$(document).ready(function() {
	// Navbar hamburger click event
	// TODO We can do this even better.
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
			this.settings.blurOverlay.on('click', () => {
				Popup().closePopup();
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

	const NavbarHover = {
		settings     : {
			active  : false,
			overlay : $('#overlay')
		},

		init         : function() {
			// console.log('Loaded Navbar Hover Widget');
			this.bindUI();
		},

		bindUI       : function() {
			$('.nav__ol').on('mouseleave', () => {
				this.settings.overlay.toggleClass('active');
			});
			this.bindNavLinks();
		},

		bindNavLinks : function() {
			$('.nav__a').each(function(index, elem) {
				elem.addEventListener('mouseenter', function(event) {
					const pos = elem.getBoundingClientRect();
					overlay.style.left = pos.x + 'px';
					overlay.style.height = pos.height + 'px';
					overlay.style.width = pos.width + 'px';
					overlay.classList.add('active');
				});
			});
		}
	};

	const Popup = () => {
		const se = {
			popupElement : $('.popup'),
			exitElement  : $('.popup__x'),
			tooltip      : $('.tooltip')
		};

		return {
			init        : function() {
				this.bindUI();
			},
			togglePopup : function(name) {
				this.getPopup(name).toggleClass('active');

				SidebarWidget.toggleBlur();
			},
			closePopup  : function() {
				se.popupElement.removeClass('active');
				SidebarWidget.toggleBlur();
			},
			getPopup    : function(name) {
				const popupElem = $(`#popup--${name}`);
				if (popupElem.length <= 0) return console.error('Popup element is not found.', popupElem);

				return popupElem;
			},
			bindUI      : function() {
				se.tooltip.click((e) => {
					const clickedTooltipName = e.target.id.split('--')[1];
					this.togglePopup(clickedTooltipName);
				});
				se.exitElement.on('click', () => {
					this.closePopup();
				});
			}
		};
	};

	const TabWidget = function() {
		const s = {
			acord      : $('.acord'),
			plusButton : $('.acord__plus')
		};
		const plusLines = {
			hor : $('.acord__horline'),
			ver : $('.acord__verline')
		};
		return {
			init     : function() {
				this.bindUI();
			},
			bindUI   : function() {
				s.plusButton.click(function() {
					if (!$(this).parent().hasClass('active')) {
						$(this).parent().addClass('active');
						s.plusButton.toggleClass('active');
					} else {
						$(this).parent().removeClass('active');
						s.plusButton.toggleClass('active');
					}
				});
			},
			openTab  : function() {},
			closeTab : function() {}
		};
	};

	function initWidgets() {
		SidebarWidget.init();
		FormWidget.init();
		NavbarHover.init();
		Popup().init();
		TabWidget().init();
		MobileHelper().init();
	}

	initWidgets();
});
