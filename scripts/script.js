$(document).ready(function() {
	// Navbar hamburger click event

	var s,
		Sidebar = {
			settings      : {
				sidebar     : $('.sidebar'),
				hamburger   : $('#hamburger'),
				blurOverlay : $('.blur-overlay')
			},
			init          : function() {
				s = this.settings;
				this.bindUI();
				console.log('Loaded sidebar widget');
			},

			bindUI        : function() {
				$('#hamburger').on('click', function() {
					Sidebar.toggleSidebar();
				});

				console.log('UI Binded');
			},
			toggleSidebar : function() {
				s.sidebar.toggleClass('active');
				s.hamburger.toggleClass('open');
				s.blurOverlay.toggleClass('active');
			}
		};

	Sidebar.init();

	$('#nav').load('../nav.html', function() {
		console.log('Loaded nav bar');
	});

	$('.form').on('input', function() {
		let valid = true;
		const inputFields = $(this).find('.input');
		inputFields.each(function(index, elem) {
			if (!elem.value) {
				valid = false;
				return false;
			}
		});
		if (valid) {
			$('.button-action').prop('disabled', false);
		} else {
			$('.button-action').prop('disabled', true);
		}
	});

	// Solar next button
	$('#solar-form-1').on('submit', function(e) {
		e.preventDefault();
		$('#solar-form-2').toggleClass('active');
		$('#solar-form-1').toggleClass('active');
		const fields = e.target.length - 1;
		for (let x of e.target) {
			if ($(x).attr('type') != 'submit') {
				const value = $(x).val();
				const name = $(x).attr('name');
				window.localStorage.setItem(name, value);
			}
		}
	});

	$('#solar-form-2').submit(function(e) {
		//listen for submit event
		//TODO Can this be dynamic, it's hardcoded
		e.preventDefault();
		var v = $(e.target).serializeArray();

		const data = [
			...v,
			{
				name  : 'address',
				value : window.localStorage.getItem('address')
			},
			{
				name  : 'electric_bill',
				value : window.localStorage.getItem('electric_bill')
			}
		];
		data.forEach(function(elem) {
			$('<input />')
				.attr('type', 'hidden')
				.attr('name', elem.name)
				.attr('value', elem.value)
				.appendTo('#solar-form-2');
		});
		var settings = {
			cache       : false,
			dataType    : 'json',
			data        : JSON.stringify(data),
			async       : true,
			crossDomain : true,
			method      : 'POST',
			headers     : {
				accept                        : 'application/json',
				'Access-Control-Allow-Origin' : '*'
			},
			sucess      : function() {
				window.location.href = '/solar.html';
			}
		};
		// $.post('http://adamscode.com/api/inviro/solar', settings, (res, err) => {
		// 	console.log(res, err);
		// 	window.location.href = '/solar.html';
		// });
		$.post('http://localhost:3000/api/inviro/solar', settings, (res, err) => {
			console.log(res, err);
		});
	});

	// Code Related too navigation hover.
	const nav_list = document.querySelectorAll('.nav__a');
	const overlay = document.querySelector('#overlay');
	let active = false;

	nav_list.forEach(function(e) {
		e.addEventListener('mouseenter', function(event) {
			const pos = e.getBoundingClientRect();
			overlay.style.left = pos.x + 'px';
			overlay.style.height = pos.height + 'px';
			overlay.style.width = pos.width + 'px';
			overlay.classList.add('active');
		});
	});
	$('.nav__ol').on('mouseenter', function() {
		active = true;
	});
	$('.nav__ol').on('mouseleave', function() {
		overlay.classList.remove('active');
		// Set timeout so you don't see the reset animation
		setTimeout(() => {
			overlay.style.left = null;
		}, 250);
	});

	// Slider code
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
});
