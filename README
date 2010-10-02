# h5Validate

A jQuery plugin that understands HTML5 forms and knows how to validate them, even in browsers that don't yet support HTML5.

In browsers that do support HTML5, v5Validate adds some much-needed features, such as the ability to customize the user interface when an input fails validation.

## Jump Start

	<script src="lib/jquery/jquery-1.4.2.min.js"></script>
	<script src="lib/jquery.h5validate-0.1.0.js"></script>

	<script>
	$(document).ready(function() {
		$('form').h5Validate();
	});
	</script>


## Features

* Automatically bind validation events to input fields.

* Supports the new HTML5 required attribute:

	<div><label for="firstName">First Name</label>
		<input id="firstName" name="firstName" type="text" placeholder="Your First Name" title="Your first name must contain at least one letter." required /></div>

* Supports the new HTML5 pattern attribute:

	<div><label for="firstName">First Name</label>
		<input id="firstName" name="firstName" type="text" placeholder="Your First Name" title="Your first name must contain at least one letter." pattern="jQuery" /></div>

* Uses jQuery UI's ui-state-error class by default, so if you have jQuery UI CSS hooked up, you don't have to add your own error classes to the CSS.

* Flexible public API lets you override just about every aspect of the script's behavior. Customize error class, event bindings, callback functions, extend the callback library, etc... e.g.

	$('form').h5Validate({errorClass: 'ui-state-error'});
