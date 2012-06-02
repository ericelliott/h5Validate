
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
				isEmptyValid,
				isCheckedValid,
				$checkme;
			isEmptyValid = $radioTest.h5Validate('isValid');
			$checkme = $('.checkme');
			ok(!isEmptyValid, 'Radio should be invalid when empty.');
			$checkme.attr('checked', 'checked');
			isCheckedValid = $checkme.h5Validate('isValid');
			ok(isCheckedValid,
				'Radio should be valid as soon as any one is selected');
		});

		// Validate radio buttons correctly. (Any checked field satisfies required)
		test('Issue #27: Validate radio buttons correctly (again).', function () {
			var $form = $('<form />', {
					id: 'radio-test2-form'
				}),
				$radioTest,
				isEmptyValid = 0,
				isCheckedValid = 0,
				$checkme;

			$('<input type="radio" required id="radio-test2-1" name="radio-test2" value="abc123" />')
				.appendTo($form);

			$('<input type="radio" required id="radio-test2-2" name="radio-test2" value="def456" />')
				.appendTo($form);

			$('<input type="radio" required id="radio-test2-3" name="radio-test2" value="ghi789" />')
				.appendTo($form);

			$form
				.appendTo('body');

			$form.h5Validate();

			$radioTest = $('[name="radio-test2"]', $form);

			equal($radioTest.length, 3, 'Three radio buttons with the same name exist');
			equal($radioTest.filter(':checked').length, 0, 'None is checked');

			$radioTest.each(function(){
					isEmptyValid += $(this).h5Validate('isValid', { revalidate: false }) ? 1 : 0;
				});

			equal(isEmptyValid, 0, 'Radio should be invalid when empty.');

			$checkme = $('#radio-test2-2');
			$checkme.attr('checked', 'checked');
			equal($radioTest.filter(':checked').length, 1, 'One is checked');
			
			// Trigger change event to trigger validation
			$checkme.change();
			
			$radioTest.each(function(){
					isCheckedValid += $(this).h5Validate('isValid', { revalidate: false }) ? 1 : 0;
				});

			equal(isCheckedValid, 3,
				'Radio should be valid as soon as any one is selected');

			$form.remove();
		});

		test('Pull request #39: Each radio button is only validated once in allValid', 3, function () {
			var $form = $('<form />', {
					id: 'radio-test3-form'
				}),
				$radioTest,
				isEmptyValid = 0,
				isCheckedValid = 0,
				$checkme;

			$('<input type="radio" required id="radio-test3-1" name="radio-test3" value="abc123" />')
				.appendTo($form);

			$('<input type="radio" required id="radio-test3-2" name="radio-test3" value="def456" />')
				.appendTo($form);

			$('<input type="radio" required id="radio-test3-3" name="radio-test3" value="ghi789" />')
				.appendTo($form);

			$form
				.appendTo('body');

			$form.h5Validate();

			$form.on("validated.radio-test3", function(evt, data){
				ok(evt.target.name === "radio-test3", "Validated a radio button, " + evt.target.id)
			});

			$form.h5Validate("allValid");

			$form.off(".radio-test3");

			$form.remove();
		});

		// Todo: test allValid. Make sure to call it more than once and ensure that
		// behavior remains consistent.
	}
	exports.runTests = runTests;
}((typeof exports !== 'undefined') ? exports : window));
