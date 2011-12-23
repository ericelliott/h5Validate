(function (exports) {
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
					id: 'instanceTest',
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

			$form.bind('attr', function (event, data) {
				ok(data, 'Instance create event works.');
			});

			$form.h5Validate({
				allValidSelectors: 'select'
			});

			$("#BillingCountry option:eq(2)").attr("selected", "selected");

			test1 = $form.h5Validate('allValid');
			ok(test1, 'Methods are instance safe.');
		});

		//TODO: Don't attempt to validate disabled fields
		
		//TODO: Validate radio buttons correctly. (Any checked field satisfies required)


	}
	exports.runTests = runTests;
}((typeof exports !== 'undefined') ? exports : window));
