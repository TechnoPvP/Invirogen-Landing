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

	const FormWidget = {
		settings             : {
			valid       : false,
			currentForm : 0,
			forms       : $('.flex__col'),
			form        : $('.form'),
			firstForm   : $('#solar-form-1'),
			secondForm  : $('#solar-form-2'),
			visibleForm : $('.form:visible'),
			radioWrap   : $('.radio__wrapper input[name=other_billing]')
		},

		init                 : function() {
			// console.log('Loaded FormWidget');
			this.bindUI();
			this.checkForm();
		},

		bindUI               : function() {
			this.settings.form.on('input', function() {
				FormWidget.checkForm();
			});
			this.settings.radioWrap.on('change', function() {
				if ($(this).val() == 'yes') {
					FormWidget.setBillingAddress(true);
					console.log('Set billing address true');
				} else {
					FormWidget.setBillingAddress(false);
				}
			});

			this.handleFormSubmission();
		},

		setButtonDisabled    : function(boolean) {
			$('.button-action').prop('disabled', boolean);
		},

		getCurrentForm       : function() {
			return $('.flex__col.active');
		},

		setBillingAddress    : function(boolean) {
			if (boolean) {
				$('#form__billing').removeClass('form__wrap--hidden');
				return;
			}
			$('#form__billing').addClass('form__wrap--hidden');
		},

		getNextForm          : function() {
			// If it's the last form submit
			if (this.settings.currentForm >= this.settings.forms.length) return console.error('Cant go further');

			this.settings.currentForm += 1;
			const nextFormIndex = this.settings.currentForm;

			return $(this.settings.forms[nextFormIndex]);
		},

		toggleNextForm       : function() {
			FormWidget.saveData();

			this.getCurrentForm().toggleClass('active');
			this.getNextForm().toggleClass('active');

			// Check form inputs and set button disabled prop accordingly
			this.checkForm();
		},

		handleFormSubmission : function() {
			this.settings.forms.each((index, elem) => {
				$(elem).on('submit', function(e) {
					e.preventDefault();

					const buttonValue = $(elem).find('input[type=submit]').val();
					if (buttonValue == 'Submit') {
						FormWidget.submitData($(e.target));
					} else {
						FormWidget.toggleNextForm();
					}
				});
			});
		},

		checkForm            : function() {
			this.getCurrentForm().find('input').each(function(index, elem) {
				if ($(elem).prop('required') && $(elem).val().trim() <= 0) {
					FormWidget.setButtonDisabled(true);
					return false;
				}

				FormWidget.setButtonDisabled(false);
			});
		},
		saveData             : function() {
			this.getCurrentForm().find('input').each(function(index, elem) {
				const inputVal = $(elem).val();
				const inputElement = $(elem);
				if (inputVal != null && inputVal != undefined && $(elem).attr('type') != 'submit') {
					if (inputElement.attr('name') === 'property_type') {
						window.sessionStorage.setItem(
							inputElement.attr('name'),
							inputElement.prop('checked') ? 'commercial' : 'residential'
						);
					} else if (inputElement.attr('type') == 'radio') {
						if (inputElement.is(':checked')) {
							console.log(inputElement.attr('value'));
							window.sessionStorage.setItem(inputElement.attr('name'), inputElement.attr('value'));
						}
					} else {
						console.log(inputElement.attr('value'));
						window.sessionStorage.setItem(
							inputElement.attr('name'),
							inputElement.is(':checkbox') ? inputElement.prop('checked') : inputVal
						);
					}
				}
			});
		},
		submitData           : function(target) {
			this.saveData();
			// const testData = {
			// 	electric_bill          : 190,
			// 	addtional_improvements : true,
			// 	own_property           : true,
			// 	property_type          : 'commerical',
			// 	address                : '1020 Property Adddress'
			// };

			// TODO Remove as i'm storing all data in localstorage.
			// const formData = { ...localStorage };
			// const lastFormData = target.serializeArray();
			// lastFormData.forEach((elem) => {
			// 	formData[elem.name] = elem.value;
			// });

			$.post({
				cache       : false,
				dataType    : 'json',
				url         : 'https://adamscode.com/api/inviro/solar',
				// url         : 'http://localhost:3000/api/inviro/solar',
				data        : JSON.stringify(window.sessionStorage),
				enctype     : 'mutipart/form-data',
				crossDomain : true,
				contentType : 'application/json',
				method      : 'POST',
				headers     : {
					accept                        : 'application/json',
					'Access-Control-Allow-Origin' : '*'
				},
				success     : function(e) {
					window.location.replace(`${window.location.origin}/solar.html`);
					console.log('Sucessful post');
				},
				error       : function(e) {
					console.table(e);
					window.location.href = '/solar.html';
				}
			});
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

	/**
	 * Slider
	 */
	const prev = $('.circle-back');
	const next = $('.circle-next');

	const dotsElem = $('.dots');
	dotsElem.on('click', function(e) {
		const targetId = e.target.attributes['data-id'];

		if (!targetId) return false;

		lastSlide = currentSlide;
		getSlide(targetId.value);
	});

	const slides = [ ...$('.slide') ];
	let currentSlide = 0;
	let lastSlide = 0;

	function setupDots() {
		for (let x = 0; x < slides.length; x++) {
			$('.dots').append(`<div class="dots__dot ${x == 0 ? 'active' : ''} " data-id=${x}> </div>`);
		}
	}

	function changeDots(slide) {
		const dots = $('.dots').children();
		dots.each(function() {
			const dot = $(this);
			if (dot.hasClass('active')) {
				dot.removeClass('active');
			}
		});
		$(dots[slide]).addClass('active');
	}

	function getSlide(slide) {
		currentSlide = +slide;
		setCurrentSlide(+slide);
		changeDots(slide);
	}

	function setCurrentSlide(current) {
		$(slides[lastSlide]).removeClass('active');
		$(slides[current]).addClass('active');
	}
	function nextSlide() {
		lastSlide = currentSlide;
		if (currentSlide >= slides.length - 1) {
			getSlide(0);
			return;
		}
		currentSlide += 1;
		changeDots(currentSlide);
		setCurrentSlide(currentSlide);
	}
	function prevSlide() {
		lastSlide = currentSlide;
		if (currentSlide == 0) {
			getSlide(slides.length - 1);
			return;
		}
		currentSlide -= 1;
		changeDots(currentSlide);
		setCurrentSlide(currentSlide);
	}

	const slideShow = (time) => {
		var ticker = setInterval(function() {
			nextSlide();
		}, time * 1000);
		return {
			start : function() {
				ticker = setInterval(function() {
					nextSlide();
				}, time * 1000);
			},
			stop  : function() {
				if (!ticker) {
					console.log('Slide show is not started');
				}
				active = false;
				clearInterval(ticker);
			}
		};
	};

	// Code Related to showing the slider button
	$('.slider').hover(
		function() {
			$('.circle').toggleClass('on');
			slideShowELem.stop();
		},
		function() {
			$('.circle').toggleClass('on');
			slideShowELem.start();
		}
	);

	const slideShowELem = slideShow(4.5);
	setupDots();
	prev.click(function() {
		prevSlide();
		slideShowELem.stop();
	});
	next.click(function() {
		nextSlide();
		slideShowELem.stop();
	});

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
