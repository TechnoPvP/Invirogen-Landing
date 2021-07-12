$(document).ready(function() {
	// Navbar hamburger click event
	$('#hamburger').click(function() {
		const sideBar = $('.sidebar');

		$(this).toggleClass('open');
		$('.blur-overlay').toggleClass('active');

		if (!sideBar.hasClass('visible')) {
			sideBar.animate({ right: '0px' }, 400).addClass('visible');
		} else {
			sideBar.animate({ right: '-300px' }, 400, function() {
				sideBar.removeClass('visible');
			});
		}
	});

	$('.form').on('focusout', function() {
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
			//TODO Dobule Validation for some reason
			// console.log('valid');
		} else {
			$('.button-action').prop('disabled', true);
		}
	});

	$('.form').change(function() {
		console.log(e);
	});

	// Solar next button
	$('#solar-form-1').on('submit', function(e) {
		e.preventDefault();
		$('#solar-form-2').toggleClass('active');
		$('#solar-form-1').toggleClass('active');
		const fields = e.target.length - 1;
		for (let x of e.target) {
			const value = $(x).val();

			if ($(x).attr('type') != 'submit') {
				const name = $(x).attr('name');
				window.localStorage.setItem(name, value);
			}
		}
	});

	$('#solar-form-2').submit(function(e) {
		//listen for submit event
		//TODO Can this be dynamic, it's hardcoded
		e.preventDefault();
		var v = $(this).serialize();
		const data = [
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
			url         : 'http://localhost:3000/data',
			method      : 'POST',
			headers     : {
				accept                        : 'application/json',
				'Access-Control-Allow-Origin' : '*'
			}
		};
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
		const targetId = e.target.attributes['data-id'].value;

		console.log(targetId);
		lastSlide = currentSlide;
		getSlide(targetId);
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

	const slideShowELem = slideShow(4.5);

	// Code Related to showing the slider button
	$('.slider').hover(
		function() {
			$('.circle').toggleClass('visible');
			slideShowELem.stop();
		},
		function() {
			$('.circle').toggleClass('visible');
			slideShowELem.start();
		}
	);

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
