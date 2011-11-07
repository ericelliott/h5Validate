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
	}
	exports.runTests = runTests;
}((typeof exports !== 'undefined') ? exports : window));