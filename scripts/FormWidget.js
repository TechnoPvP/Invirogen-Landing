const FormWidget = {
	settings             : {
		valid       : false,
		currentForm : 0,
		forms       : $('.flex__col'),
		formList    : [ ...$('.flex__col') ],
		form        : $('.form'),
		visibleForm : $('.form:visible')
	},

	init                 : function() {
		// console.log('Loaded FormWidget');
		this.bindUI();
		Progress().init();
	},

	bindUI               : function() {
		// TODO May remove this feature to show which inputs need to be valid.

		// this.settings.form.on('input', () => {
		// 	this.disableButton(this.checkForm());
		// });

		this.onUploadFile();

		this.onBillingInputChange();

		this.handleFormSubmission();
	},

	disableButton        : function(boolean) {
		this.getCurrentForm().find('.button--action').prop('disabled', boolean ? false : true);
	},

	onBillingInputChange : function() {
		const radioWrap = $('.radio__wrapper input[name=other_billing]');

		radioWrap.on('change', function() {
			if ($(this).val() == 'yes') {
				FormWidget.setBillingAddress(true);
			} else {
				FormWidget.setBillingAddress(false);
			}
		});
	},

	setBillingAddress    : function(boolean) {
		if (boolean) {
			$('#form--billing').removeClass('form__wrap--hidden');
			return;
		}
		$('#form--billing').addClass('form__wrap--hidden');
	},

	onUploadFile         : function() {
		const file = $('.file');
		const fileText = $('.file__text');

		file.on('change', function(e) {
			const fileName = $(this).val().replace(/C:\\fakepath\\/i, '');

			fileText.text(fileName);
		});
	},

	changeFileText       : function() {},

	getCurrentForm       : function() {
		return $('.flex__col.active');
	},

	getNextForm          : function() {
		if (this.settings.currentForm >= this.settings.forms.length) {
			return console.error('Cant go further');
		}

		this.settings.currentForm = this.settings.currentForm += 1;
		const nextForm = this.setCurrentForm(this.settings.currentForm);

		return nextForm;
	},

	setCurrentForm       : function(index) {
		// Save the form data before moving to another form
		this.saveData();

		const formAtIndex = $(this.settings.formList[index]);
		this.settings.currentForm = index;

		Progress().setCurrentProgress(FormWidget.settings.currentForm);

		this.getCurrentForm().removeClass('active');
		formAtIndex.addClass('active');

		return formAtIndex;
	},

	handleFormSubmission : function() {
		this.settings.forms.each((index, formElement) => {
			$(formElement).on('submit', function(submitHandler) {
				submitHandler.preventDefault();

				const buttonValue = $(formElement).find('input[type=submit]').val();
				if (buttonValue == 'Submit') {
					FormWidget.postData();
					console.log('Attempting to submit');
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

		$('.form:visible').find('input[required]').each(function(index, elem) {
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

	// TODO THis needs to be handled in the save methods.
	serlizeSessionData   : function() {
		const formData = new FormData();
		const billFileElement = $('#bill_photo');

		for (const sessionKey of Object.keys(window.sessionStorage)) {
			if (window.sessionStorage.getItem(sessionKey) && window.sessionStorage.getItem(sessionKey).length != 0)
				formData.set(sessionKey, window.sessionStorage.getItem(sessionKey));
		}

		if (billFileElement.val()) {
			const billFileName = billFileElement.val().replace(/C:\\fakepath\\/i, '');
			formData.set('bill_photo', billFileElement.prop('files')[0], billFileName);
			console.log(billFileName, billFileElement);
		}

		return formData;
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

		// TODO Method 1 implemntation using different forms and sessionStorage.
		const formData = this.serlizeSessionData();

		var request = new XMLHttpRequest();
		request.open('POST', 'http://localhost:3000/api/inviro/solar');
		request.onload = function(oEvent) {
			if (request.status == 200) {
				console.log('Uploaded');
			} else {
				console.log((request.status = ' error occures while uploading file.'));
			}
		};

		request.send(formData);

		// $.post({
		// 	cache       : false,
		// 	// dataType    : 'json',
		// 	url         : 'https://adamscode.com/api/inviro/solar',
		// 	// url         : 'http://localhost:3000/api/inviro/solar',
		// 	data        : formData,
		// 	mimeType    : 'mutipart/form-data',
		// 	crossDomain : true,
		// 	processData : false,
		// 	contentType : false,
		// 	// contentType : 'application/json',
		// 	method      : 'POST',
		// 	headers     : {
		// 		// accept                        : 'application/json',
		// 		'Access-Control-Allow-Origin' : '*'
		// 	},
		// 	success     : () => {
		// 		this.getNextForm();
		// 		Progress().disableClick();
		// 		console.log('Sucessful post');
		// 	},
		// 	error       : function(e) {
		// 		console.log(e.status, e.statusText, e.responseText);
		// 		window.location.href = '/solar.html';
		// 	}
		// });
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
