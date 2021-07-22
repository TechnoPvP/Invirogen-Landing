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
		Progress().init();

		//TODO Add Back In
		// this.checkForm();
	},

	bindUI               : function() {
		// TODO Add Back in
		// this.settings.form.on('input', function() {
		// 	FormWidget.checkForm();
		// });
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

	setBillingAddress    : function(boolean) {
		if (boolean) {
			$('#form__billing').removeClass('form__wrap--hidden');
			return;
		}
		$('#form__billing').addClass('form__wrap--hidden');
	},

	getCurrentForm       : function() {
		return $('.flex__col.active');
	},

	getNextForm          : function() {
		if (this.settings.currentForm >= this.settings.forms.length) {
			return console.error('Cant go further');
		}

		this.settings.currentForm = this.settings.currentForm += 1;
		const formElement = $(this.settings.forms[this.settings.currentForm]);

		this.getCurrentForm().removeClass('active');
		formElement.addClass('active');

		return $(this.settings.forms[this.settings.currentForm]);
	},

	setCurrentForm       : function(index) {
		// Save the form data before moving to another form
		FormWidget.saveData();

		const formAtIndex = $(this.settings.formList[index]);

		this.settings.currentForm = index;
		this.getCurrentForm().removeClass('active');
		formAtIndex.addClass('active');
	},

	handleFormSubmission : function() {
		this.settings.forms.each((index, elem) => {
			$(elem).on('submit', function(e) {
				e.preventDefault();

				const buttonValue = $(elem).find('input[type=submit]').val();
				if (buttonValue == 'Submit') {
					FormWidget.submitData($(e.target));
				} else {
					FormWidget.getNextForm();
					console.log(FormWidget.settings.currentForm);

					// TODO Implement progress next
					Progress().setCurrentProgress(FormWidget.settings.currentForm);
				}
			});
		});
	},

	showNextForm         : function() {
		this.getCurrentForm().removeClass('active');
		this.getNextForm().addClass('active');

		// Check form inputs and set button disabled prop accordingly
		// this.checkForm();
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
			this.setCurrentProgress(0);
		},
		bindUI             : function() {
			s.pointsList.click(function() {
				if ($(this).hasClass('active')) {
					const parentOffset = $(this).parent().offset();
					const circleOffset = parentOffset.left - $(this).offset().left;

					Progress().setCurrentProgress($(this).data('index'));
					FormWidget.setCurrentForm($(this).data('index'));
				} else {
					alert('Please fill in required information before going forward.');
				}
			});
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
			console.log('Circle Offset ' + circleOffset);
		}
	};
};
export default FormWidget;
