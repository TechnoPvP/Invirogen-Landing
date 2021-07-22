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
			// active = false;
			clearInterval(ticker);
		}
	};
};

const slideShowELem = slideShow(4.5);

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
setupDots();
prev.click(function() {
	prevSlide();
	slideShowELem.stop();
});
next.click(function() {
	nextSlide();
	slideShowELem.stop();
});

export default slideShowELem;
