
/*global window, $, module, test, ok, equal, exports */
(function (exports) {
  'use strict';
  function runTests() {
    module('h5Validate');

    test('h5Validate basics', function () {
      ok((typeof $('<div>').h5Validate === 'function'), 'h5Validate exists');
    });

    test('Required validation failure flag false by default:', function () {
      var $form = $('<form />'),
        $input = $('<textarea />').appendTo($form);

      $form.appendTo('body').h5Validate();

	  $input.val('Bob');
	  $input.on('validated',function(event,validity) {
	    strictEqual(validity.valueMissing, false, 'If the required validator does not fail, the validity property "valueMissing" should be false.');
	  });
      $input.h5Validate('isValid');
    });

    test('Maxlength validation failure flag false by default:', function () {
      var $form = $('<form />'),
        $input = $('<textarea />').appendTo($form);

      $form.appendTo('body').h5Validate();

	  $input.val('Bob');
	  $input.on('validated',function(event,validity) {
	    strictEqual(validity.tooLong, false, 'If the maxlength validator does not fail, the validity property "tooLong" should be false.');
	  });
      $input.h5Validate('isValid');
    });

    test('Pattern validation failure flag false by default:', function () {
      var $form = $('<form />'),
        $input = $('<textarea />').appendTo($form);

      $form.appendTo('body').h5Validate();

	  $input.val('Bob');
	  $input.on('validated',function(event,validity) {
	    strictEqual(validity.patternMismatch, false, 'If the pattern validator does not fail, the validity property "patternMismatch" should be false.');
	  });
      $input.h5Validate('isValid');
    });

    test('Required:', function () {
      var $input = $('#name');
      ok((!$input.h5Validate('isValid')), 'Required input should be invalid when empty.');
      $input.val('Bob');
      ok(($input.h5Validate('isValid')), 'Required input should be valid when not empty.');
      $input.val('');
    });

    test('Required validation failure flag set:', function () {
      var $input = $('#name');
      $input.val('');
	  $input.on('validated',function(event,validity) {
	    ok(validity.valueMissing, 'If the required validator fails, the validity property "valueMissing" should be true.');
	  });
      $input.h5Validate('isValid');
    });

    test('Pattern attribute:', function () {
      var $input = $('#birthdate');
      ok(($input.h5Validate('isValid')), 'Optional input should be valid when empty.');
      $input.val('01/01/2010');
      ok(($input.h5Validate('isValid')), 'Input should be valid when given valid input.');
      $input.val('foo');
      ok((!$input.h5Validate('isValid')), 'Input should be invalid when given invalid input.');
    });

    test('Pattern validation failure flag set:', function () {
      var $input = $('#birthdate');
      $input.val('foo');
	  $input.on('validated',function(event,validity) {
	    ok(validity.patternMismatch, 'If the pattern validator fails, the validity property "patternMismatch" should be true.');
	  });
      $input.h5Validate('isValid');
	});

    test('Maxlength validation failure flag set', function () {
      var $input = $('#short-answer');
      $input.val('something longer than 10 characters');
	  $input.on('validated',function(event,validity) {
		ok(validity.tooLong, 'If the maxlength validator fails, the validity property "tooLong" should be true.');
      });
      $input.h5Validate('isValid');
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

      $form.html('<input required id="instance-input"/>' +
        '<select type="select" name="BillingCountry" id="BillingCountry" required="required">' +
        '<option value="">-- Choose Country --</option>' +
        '<option value="SE">Sweden</option>' +
        '<option value="AX">Aland islands</option>' +
        '<option value="DK">Denmark</option>' +
        '<option value="FI">Finland</option>' +
        '<option value="NO">Norway</option>' +
        '</select>').appendTo('body');

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
      var $form = $('<form />'),
        $textarea = $('<textarea />').appendTo($form);

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

    test('Issue #53 number pattern fails when leading zero is omitted ' +
        'from decimal value.', function () {
      var $form = $('<form />'),
        $num = $('<input type="text" class="h5-number" required="required"></input>')
          .appendTo($form),
        validValues = ['.3', '0.3', '9999999.9', '10', '-1', '-2.99'],
        invalidValues = ['a', '2.x', 'x.2'],
        i = validValues.length,
        j = invalidValues.length,
        val;

      $form
        .appendTo('body')
        .h5Validate();

      while (i) {
        val = validValues[i-1];
        $num.val(val).trigger('keyup');
        ok($num.h5Validate('isValid'),
          'Valid number, ' + val +' should pass validation.');
        i--;
      }

      while (j) {
        val = invalidValues[j-1];
        $num.val(val).trigger('keyup');
        ok(!$num.h5Validate('isValid'),
          'Invalid number, ' + val +' should not pass validation.');
        j--;
      }

      $form.empty().remove();
    });

    test('Pull Request #64 formnovalidate attribute',function () {
      var $form = $("#bypassValidation1");
      var $bypassSubmission = $("form#bypassValidation1 :input[id=bypassSubmit]"),
        validated = false;

      $form.h5Validate();

      $form.bind('formValidated', function() {
        validated = true;
        ok(false,
          'Form with `formnovalidate` should not be validated.');
      });

      $form.submit(function (event){
        // don't allow an actual submission
        event.stopImmediatePropagation();
        return false;
      });

      $bypassSubmission.click();
      equal(validated, false,
        'Form with `formnovalidate` should not be validated.');

      $form.empty().remove();
    });
	
    test('u01jmg3 Pull Request telephone number regex updated', function () {
      var $form = $('<form />'),
        $tel = $('<input type="tel" class="h5-phone" required="required"></input>')
          .appendTo($form),
        validValues = ['+441224271234', '+44 (0)1224 271234', '+44 (01224) 27-12-34', '+44 (01224) 27.12.34', 
		'(01224) 271234 Extension: 1234', '(0)1224 271234 ex 5555'],
        invalidValues = ['44 (01224) 271234', '01224 271234 (x4444)', '(+44)1224 271234', '(01224) 271234 Extension: #123'],
        i = validValues.length,
        j = invalidValues.length,
        val;

      $form
        .appendTo('body')
        .h5Validate();

      while (i) {
        val = validValues[i-1];
        $tel.val(val).trigger('keyup');
        ok($tel.h5Validate('isValid'),
          'Valid telephone number, ' + val +' should pass validation.');
        i--;
      }

      while (j) {
        val = invalidValues[j-1];
        $tel.val(val).trigger('keyup');
        ok(!$tel.h5Validate('isValid'),
          'Invalid telephone number, ' + val +' should not pass validation.');
        j--;
      }

      $form.empty().remove();
    });	

	test('Adding an validator should fail for non functions',function () {
		raises(function() {
			$.h5Validate.addValidator('[name="target-field"]',5);
		}, Error, 'Should not be able to add an integer as an validator.');

		raises(function() {
			$.h5Validate.addValidator('[name="target-field"]','5');
		}, Error, 'Should not be able to add a string as an validator.');

		raises(function() {
			$.h5Validate.addValidator('[name="target-field"]',null);
		}, Error, 'Should not be able to add a null as an validator.');

		raises(function() {
			$.h5Validate.addValidator('[name="target-field"]',{});
		}, Error, 'Should not be able to add an object as an validator.');

		raises(function() {
			$.h5Validate.addValidator('[name="target-field"]',[]);
		}, Error, 'Should not be able to add an array as an validator.');
	});

	test('Adding an validator should succeed for functions',function () {
		$.h5Validate.addValidator('[name="target-field"]',function(){return true;});
		ok(true, 'Should be able to add a function as an validator without causing an exception.');
	});

	test('Adding an validator that returns true should not cause validation to fail.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldPass');
		$.h5Validate.addValidator($field,function(){return true;});
		$form.h5Validate();
		equal($field.h5Validate('isValid'), true, 'Adding an validator that returns true should not cause validation to fail.');
	});

	test('Adding an validator that returns false should cause validation to fail.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldFail');
		$.h5Validate.addValidator($field,function(){return false;});
		$form.h5Validate();
		equal($field.h5Validate('isValid'), false, 'Adding an validator that returns false should cause validation to fail.');
	});

	test('Adding an validator that confirms the value of the input should not cause validation to fail.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldExample');
		$.h5Validate.addValidator($field,function(value){return value == 'example';});
		$form.h5Validate();
		equal($field.h5Validate('isValid'), true, 'Adding an validator that confirms the value of the input should not cause validation to fail.');
	});

	test('Adding an validator that disconfirms the value of the input should cause validation to fail.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldNotExample');
		$.h5Validate.addValidator($field,function(value){return value == 'example';});
		$form.h5Validate();
		equal($field.h5Validate('isValid'), false, 'Adding an validator that disconfirms the value of the input should cause validation to fail.');
	});

	test('Adding an validator to a selector that does not exist should not cause validation to fail.',function () {
		var $form = $('#validationFormPass');
		$.h5Validate.addValidator('atagthatdoesntexistinhtml',function(){return false;});
		$form.h5Validate();
		equal($form.h5Validate('allValid'), true, 'Adding an validator to a selector that does not exist should not cause validation to fail.');
	});

	test('validators should be passed the value of the DOM element.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldExample');
		$.h5Validate.addValidator($field,function(value) {
			equal(value, $field.val(), 'validators should be passed the value of the DOM element.');
			return true;
		});
		$form.h5Validate();
		$field.h5Validate('isValid');
	});

	test('validators should be run in the context of the DOM element of the target field.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldExample');
		$.h5Validate.addValidator($field,function() {
			equal(this, $field.get(0), 'validators should be run in the context of the DOM element of the target field.');
			return true;
		});
		$form.h5Validate();
		$field.h5Validate('isValid');
	});

	test('If an added validator fails, the validity "failedValidator" field should be true.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldNotExampleNotNamed');
		$.h5Validate.addValidator($field,function(value){return value == 'example';});
		$field.on('validated',function(event,validity) {
			ok(validity.failedValidator, 'If an added validator fails, the validity "failedValidator" field should be true.');
		});
		$form.h5Validate();
		$field.h5Validate('isValid');
	});

	test('If no validator name is supplied,the validity "failedValidatorNames" property should be null.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldNotExampleNotNamed');
		$.h5Validate.addValidator($field,function(value){return value == 'example';});
		$field.on('validated',function(event,validity) {
			deepEqual(validity.failedValidatorNames, [], 'If no validator name is supplied,the validity "failedValidatorNames" property should be an empty array.');
		});
		$form.h5Validate();
		$field.h5Validate('isValid');
	});

	test('Supplied validator names should be assigned to the validity "failedValidatorNames" property if they exist.',function () {
		var $form = $('#validationForm'),
			$field = $('#validationFieldNotExampleNamed'),
			validatorName = 'exampleValidator';
		$.h5Validate.addValidator($field,function(value){return value == 'example';},{name: validatorName});
		$field.on('validated',function(event,validity) {
			deepEqual(validity.failedValidatorNames, [validatorName], 'Supplied validator names should be assigned to the validity "failedValidatorNames" property if they exist.');
		});
		$form.h5Validate();
		$field.h5Validate('isValid');
	});

  }
  exports.runTests = runTests;
}((typeof exports !== 'undefined') ? exports : window));
