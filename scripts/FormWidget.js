const FormWidget = {
	settings             : {
		valid       : false,
		currentForm : 0,
		forms       : $('.flex__col'),
		formList    : [ ...$('.flex__col') ],
		form        : $('.form'),
		visibleForm : $('.form:visible'),
		radioWrap   : $('.radio__wrapper input[name=other_billing]')
	},

	init                 : function() {
		// console.log('Loaded FormWidget');
		this.bindUI();
		this.setCurrentForm(0);
		Progress().init();
	},

	bindUI               : function() {
		this.settings.form.on('input', () => {
			this.disableButton(this.checkForm());
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

	disableButton        : function(boolean) {
		this.getCurrentForm().find('.button--action').prop('disabled', boolean ? false : true);
	},

	setBillingAddress    : function(boolean) {
		if (boolean) {
			$('#form--billing').removeClass('form__wrap--hidden');
			return;
		}
		$('#form--billing').addClass('form__wrap--hidden');
	},

	getCurrentForm       : function() {
		return $('.flex__col.active');
	},

	getNextForm          : function() {
		if (this.settings.currentForm >= this.settings.forms.length) {
			return console.error('Cant go further');
		}

		this.settings.currentForm = this.settings.currentForm += 1;
		this.setCurrentForm(this.settings.currentForm);
		// const formElement = $(this.settings.forms[this.settings.currentForm]);

		// this.saveData();

		// // Duplicate Code Fix DRY.
		// this.getCurrentForm().removeClass('active');
		// formElement.addClass('active');

		return $(this.settings.forms[this.settings.currentForm]);
	},

	setCurrentForm       : function(index) {
		// Save the form data before moving to another form
		this.saveData();

		const formAtIndex = $(this.settings.formList[index]);
		this.settings.currentForm = index;

		Progress().setCurrentProgress(FormWidget.settings.currentForm);

		this.getCurrentForm().removeClass('active');
		formAtIndex.addClass('active');
	},

	handleFormSubmission : function() {
		this.settings.forms.each((index, elem) => {
			$(elem).on('submit', function(e) {
				e.preventDefault();

				const buttonValue = $(elem).find('input[type=submit]').val();
				if (buttonValue == 'Submit') {
					FormWidget.postData($(e.target));
				} else {
					FormWidget.getNextForm();

					// TODO Implement progress next
				}
			});
		});
	},

	showNextForm         : function() {
		this.getCurrentForm().removeClass('active');
		this.getNextForm().addClass('active');

		// Check form inputs and set button disabled prop accordingly
		this.disableButton(this.checkForm());
	},
	checkForm            : function() {
		let isFormValid = false;

		this.getCurrentForm().find('input[required]').each(function(index, elem) {
			if ($(elem).is(':invalid')) {
				isFormValid = false;
				return false;
			}
			// If it hasn't returned false by here than the form is valid.
			isFormValid = true;
		});
		return isFormValid;
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
						window.sessionStorage.setItem(inputElement.attr('name'), inputElement.attr('value'));
					}
				} else {
					window.sessionStorage.setItem(
						inputElement.attr('name'),
						inputElement.is(':checkbox') ? inputElement.prop('checked') : inputVal
					);
				}
			}
		});
	},
	postData             : function(target) {
		this.saveData();
		// const testData = {
		// 	electric_bill          : 190,
		// 	addtional_improvements : true,
		// 	own_property           : true,
		// 	property_type          : 'commerical',
		// 	address                : '1020 Property Adddress'
		// };

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
			success     : () => {
				this.getNextForm();
				Progress().disableClick();
				console.log('Sucessful post');
			},
			error       : function(e) {
				console.table(e);
				window.location.href = '/solar.html';
			}
		});
	}
};
const Progress = function() {
	const s = {
		progressLine    : $('.progress__line'),
		pointsList      : $('.progress__circle'),
		currentProgress : 0,
		progressWidth   : 0
	};

	function checkProgressPastCircle() {
		s.pointsList.each(function(index, elem) {
			const circlePotionLeft = $(elem).position().left;
			//TODO Find out where the progress bar is without params.
			if (Math.abs(s.progressWidth) >= circlePotionLeft) {
				$(elem).addClass('active');
			} else {
				$(elem).removeClass('active');
			}
		});
	}

	return {
		init               : function() {
			this.bindUI();
		},
		bindUI             : function() {
			s.pointsList.click(function() {
				const index = $(this).data('index');
				if (index + 1 == s.pointsList.length) return false;

				if ($(this).hasClass('active') || FormWidget.checkForm()) {
					Progress().setCurrentProgress(index);
					FormWidget.setCurrentForm(index);
				} else {
					alert('Please fill in required information before going forward.');
				}
			});
		},
		disableClick() {
			s.pointsList.off('click');
		},

		setCurrentProgress : function(index) {
			const progressElem = $(s.pointsList[index]);
			const indexProgress = progressElem.offset().left;
			const parentProgress = progressElem.parent().offset().left;
			const circleOffset = indexProgress - parentProgress;

			s.currentProgress = index;

			s.progressLine.css({ width: `${Math.abs(circleOffset)}px` });
			s.progressWidth = circleOffset;

			// Check if it has past any circles than highlight them.
			checkProgressPastCircle();
		}
	};
};
export default FormWidget;
