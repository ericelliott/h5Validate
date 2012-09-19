
/*global window, $, module, test, ok, equal, exports */
(function (exports) {
	'use strict';
	function runTests() {
		module('h5Validate');

		test('h5Validate basics', function () {
			ok((typeof $('<div>').h5Validate === 'function'), 'h5Validate exists');
		});

		test('Required:', function () {
			var $input = $('#name');
			ok((!$input.h5Validate('isValid')), 'Required input should be invalid when empty.');
			$input.val('Bob');
			ok(($input.h5Validate('isValid')), 'Required input should be valid when not empty.');
			$input.val('');
		});

		test('Pattern attribute:', function () {
			var $input = $('#birthdate');
			ok(($input.h5Validate('isValid')), 'Optional input should be valid when empty.');
			$input.val('01/01/2010');
			ok(($input.h5Validate('isValid')), 'Input should be valid when given valid input.');
			$input.val('foo');
			ok((!$input.h5Validate('isValid')), 'Input should be invalid when given invalid input.');
		});

		test('Pattern library:', function () {
			var $input = $('#email');
			$input.val('test@example.com');
			ok(($input.h5Validate('isValid')), 'Input should be valid when given valid input.');
			$input.val('invalid email');
			ok((!$input.h5Validate('isValid')), 'Input should be invalid when given invalid input.');
		});

		test('Error messages:', function () {
			var $input = $('#FirstName'),
				$errordiv = $('#invalid-FirstName');
			ok($errordiv.is(':hidden'), 'Error message is hidden when input is valid');
			$input.h5Validate('isValid');
			ok($errordiv.is(':visible'), 'Error message displays when input is invalid');
		});

		test('Instance safe for method calls:', function () {
			var $form = $('<form>', {
					id: 'instanceTest'
				}),
				test1;

			$form.html('<input required id="instance-input"/>'
				+ '<select type="select" name="BillingCountry" id="BillingCountry" required="required">'
				+ '<option value="">-- Choose Country --</option>'
				+ '<option value="SE">Sweden</option>'
				+ '<option value="AX">Aland islands</option>'
				+ '<option value="DK">Denmark</option>'
				+ '<option value="FI">Finland</option>'
				+ '<option value="NO">Norway</option>'
				+ '</select>')
				.appendTo('body');

			$form.bind('instance', function (event, data) {
				ok(data, 'Instance create event works.');
			});

			$form.h5Validate({
				allValidSelectors: 'select'
			});

			$("#BillingCountry option:eq(2)").attr("selected", "selected");

			test1 = $form.h5Validate('allValid');
			ok(test1, 'Methods are instance safe.');
		});

		test('Validated events:', function () {
			var $form = $('<form>', {
					id: 'eventTest'
				}),
				$input;

			$form.html('<input required id="event-input"/>')
				.appendTo('body');

			$input = $('#event-input');

			$form.h5Validate();

			$input.bind('validated', function (event, data) {
				ok(data, 'Validated event triggers.');
				equal(data.element, $input[0], 'Element is correct.');
				equal(data.valid, true, 'Element is valid.');
			});

			$form.bind('formValidated', function (event, data) {
				ok(data, 'formValidated triggers.');
				equal(data.elements[0].element, $input[0], 'Form element 0 is correct.');
				equal(data.elements[0].valid, true, 'Element is valid.');
			});

			$input.val('test');
			$form.h5Validate('allValid');
		});

		test('Issue #29: Disabled fields gum up the works.', function () {
			var $form = $('<form>', {
					id: 'disabledTest'
				}),
				$input;

			$form.html('<input required id="disabled-input" disabled required /><input />')
				.appendTo('body');

			$input = $('#disabled-input');

			$form.h5Validate();

			ok($form.h5Validate('allValid'), 'Disabled fields get skipped.');
		});

		test('Issue #26: Need a .novalidate class.', function () {
			var $form = $('<form>', {
					id: 'novalidateTest'
				}),
				$input;

			$form.html('<input required id="novalidate-input" class="novalidate" required /><input />')
				.appendTo('body');

			$input = $('#novalidate-input');

			$form.h5Validate();

			ok($form.h5Validate('allValid'), '.novalidate fields get skipped.');
			
		});

		// Validate radio buttons correctly. (Any checked field satisfies required)
		test('Issue #27: Validate radio buttons correctly.', function () {
			var $radioTest = $('[name="radio-test"]'),
				isEmptyInvalid = true,
				isCheckedValid = true,
				$checkme;

			// Perform validation on each of the radio buttons
			$radioTest.h5Validate('isValid');

			$radioTest.each(function(){
				// Get validation results without performing validation again
				isEmptyInvalid = isEmptyInvalid && !$(this).h5Validate('isValid', { revalidate: false });
			});

			$checkme = $('.checkme');
			ok(isEmptyInvalid, 'All radio buttons should be invalid when empty.');
			$checkme.attr('checked', 'checked');

			// Call .change() to trigger validation
			$checkme.change();

			$radioTest.each(function(){
				// Get validation results without performing validation again
				isCheckedValid = isCheckedValid && $(this).h5Validate('isValid', { revalidate: false });
			});

			ok(isCheckedValid,
				'All radio buttons should be valid as soon as any one is selected');
		});

		// Todo: test allValid. Make sure to call it more than once and ensure that
		// behavior remains consistent.

		test('Issue #43: data-h5-errorid doesn\'t work with square brackets', function () {
			var $container = $('<div id="idTestContainer">'),
				$input = $('<input>', {
					'id': 'idTestInput',
					'data-h5-errorid': 'test[0]',
					'required': 'required'
				}).appendTo($container),
				$errorDiv = $('<div id="test[0]" style="display: none;">').appendTo($container);

			$container.appendTo('body');
			$container.h5Validate();

			$input.h5Validate('isValid');
			ok($errorDiv.is(':visible'),
				'Should be able to toggle visibility of divs with square brackets in ' +
				'the id');
		});


		test('Issue #44: validation throws an error when the number of characters in a textarea is > maxlength', function () {
			var $form = $('<form />')
				, $textarea = $('<textarea />').appendTo($form);

			$form
				.appendTo('body')
				.h5Validate();

			$.each([3, 11, 100], function (i, maxlength) {
				var validStr = new Array(maxlength + 1).join('a'),
					validLength = validStr.length,
					invalidStr = new Array (maxlength + 2).join('a'),
					invalidLength = invalidStr.length;

				$textarea.attr('maxlength', maxlength);

				$textarea.val(validStr).trigger('keyup');
				ok($textarea.h5Validate('isValid'), 'Textareas with character length = ' + validLength +' and maxlength = ' + maxlength + ' are valid');

				$textarea.val(invalidStr).trigger('keyup');
				ok(! $textarea.h5Validate('isValid'), 'Textareas with character length = ' + invalidLength + ' than maxlength = ' + maxlength + ' are invalid');
			});
		});
	}
	exports.runTests = runTests;
}((typeof exports !== 'undefined') ? exports : window));
