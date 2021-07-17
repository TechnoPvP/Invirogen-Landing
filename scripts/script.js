$(document).ready(function() {
	// Navbar hamburger click event

	// TODO We can do this even better.
	SidebarWidget = {
		settings      : {
			sidebar     : $('.sidebar'),
			hamburger   : $('#hamburger'),
			blurOverlay : $('.blur-overlay')
		},
		init          : function() {
			this.bindUI();
			console.log('Loaded sidebar widget');
		},

		bindUI        : function() {
			$('#hamburger').on('click', function() {
				SidebarWidget.toggleSidebar();
			});
		},
		toggleBlur    : function() {
			this.settings.blurOverlay.toggleClass('active');
		},
		toggleSidebar : function() {
			SidebarWidget.settings.sidebar.toggleClass('active');
			this.toggleBlur();
			this.settings.hamburger.toggleClass('open');
		}
	};

	var s,
		FormWidget = {
			settings             : {
				valid       : false,
				currentForm : 0,
				forms       : $('.flex__col'),
				form        : $('.form'),
				firstForm   : $('#solar-form-1'),
				secondForm  : $('#solar-form-2'),
				visibleForm : $('.form:visible')
			},

			init                 : function() {
				console.log('Loaded FormWidget');
				s = this.settings;
				this.bindUI();
				// this.checkForm();
			},

			bindUI               : function() {
				s.form.on('input', function() {
					// FormWidget.checkForm();
				});
				$('.circle-box').click(function() {
					FormWidget.toggleBillingAddress();
				});

				this.handleFormSubmission();
			},

			setButtonDisabled    : function(boolean) {
				$('.button-action').prop('disabled', boolean);
			},

			getCurrentForm       : function() {
				return $('.flex__col.active');
			},

			toggleBillingAddress : function() {
				$('#form__billing').toggleClass('form__wrap--hidden');
				$('.circle-box').toggleClass('active');
				console.log('helloe');
			},

			getNextForm          : function() {
				// If it's the last form submit
				if (this.settings.currentForm >= this.settings.forms.length) return console.error('Cant go further');

				this.settings.currentForm += 1;
				const nextFormIndex = this.settings.currentForm;

				return $(this.settings.forms[nextFormIndex]);
			},

			toggleNextForm       : function() {
				// FormWidget.saveData();

				this.getCurrentForm().toggleClass('active');
				this.getNextForm().toggleClass('active');

				// Check form inputs and set button disabled prop accordingly
				// this.checkForm();
			},

			handleFormSubmission : function() {
				this.settings.forms.each((index, elem) => {
					$(elem).on('submit', function(e) {
						e.preventDefault();

						const button = $(elem).find('input[type=submit]:focus');

						console.log(button.val());
						FormWidget.toggleNextForm();
					});
				});
			},

			checkForm            : function() {
				s.visibleForm = $('.form:visible');

				s.visibleForm.find('.input').each(function(index, elem) {
					if ($(elem).val().trim() <= 0) {
						FormWidget.setButtonDisabled(true);
						return false;
					}

					FormWidget.setButtonDisabled(false);
				});
			},

			saveData             : function() {
				s.visibleForm.find('.input').each(function(index, elem) {
					const inputElements = $(elem);

					if (inputElements.val() != null && inputElements.val() != undefined) {
						window.localStorage.setItem(inputElements.attr('name'), inputElements.val());
					}
				});
			}
		};

	var s,
		NavbarHover = {
			settings     : {
				active  : false,
				overlay : $('#overlay')
			},

			init         : function() {
				console.log('Loaded Navbar Hover Widget');
				s = this.settings;
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

	// $('#solar-form-2').submit(function(e) {
	// 	//listen for submit event
	// 	//TODO Can this be dynamic, it's hardcoded
	// 	e.preventDefault();
	// 	var v = $(e.target).serializeArray();

	// 	const data = [
	// 		...v,
	// 		{
	// 			name  : 'address',
	// 			value : window.localStorage.getItem('address')
	// 		},
	// 		{
	// 			name  : 'electric_bill',
	// 			value : window.localStorage.getItem('electric_bill')
	// 		}
	// 	];
	// 	data.forEach(function(elem) {
	// 		$('<input />')
	// 			.attr('type', 'hidden')
	// 			.attr('name', elem.name)
	// 			.attr('value', elem.value)
	// 			.appendTo('#solar-form-2');
	// 	});
	// 	var settings = {
	// 		cache       : false,
	// 		dataType    : 'json',
	// 		data        : JSON.stringify(data),
	// 		async       : true,
	// 		crossDomain : true,
	// 		method      : 'POST',
	// 		headers     : {
	// 			accept                        : 'application/json',
	// 			'Access-Control-Allow-Origin' : '*'
	// 		},
	// 		sucess      : function() {
	// 			window.location.href = '/solar.html';
	// 		}
	// 	};
	// 	// $.post('http://adamscode.com/api/inviro/solar', settings, (res, err) => {
	// 	// 	console.log(res, err);
	// 	// 	window.location.href = '/solar.html';
	// 	// });
	// 	$.post('http://localhost:3000/api/inviro/solar', settings, (res, err) => {
	// 		console.log(res, err);
	// 	});
	// });

	/**
	 * Sidebar Related Code
	 * 
	 * 
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

	// Circle Next Slide Button Hover
	if ($(window).width() >= 990) {
		$('.circle').hover(
			function(e) {
				const arrow = $(this).children();

				arrow.toggleClass('active');
			},
			function() {
				$(this).children().toggleClass('active');
			}
		);
	}
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
				SidebarWidget.settings.blurOverlay.removeClass('active');
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
				SidebarWidget.settings.blurOverlay.on('click', () => {
					this.closePopup();
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
			helperButton     : $('.mhelper'),
			helperIemWrapper : $('.mhelper__items-wrapper'),
			helperItems      : $('.mhelper__item')
		};

		return {
			init     : function() {
				this.bindUI();
			},
			bindUI   : function() {
				s.helperButton.click(function() {
					SidebarWidget.toggleBlur();
					s.helperIemWrapper.toggleClass('active');
					s.helperItems.fadeIn();
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
