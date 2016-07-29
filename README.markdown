# h5Validate

Hi,

I'm Eric Elliott, author of ["Programming JavaScript Applications" (O'Reilly)](http://pjabook.com). A few years ago, I wrote this jQuery plugin that understands HTML5 forms and knows how to validate them, even in browsers that don't yet support HTML5.

In browsers that do support HTML5, h5Validate adds some much-needed features, such as the ability to customize the user interface when an input fails validation.

## Status

A lot has changed since I wrote this library in 2010. It has been several years since I used the library myself. I leave it here because other people might find it useful. There are some open issues, and I have **no intention of updating or maintaining this library myself**. Pull requests are welcome.

If you'd like to become the new maintainer of this project, open an issue and we'll discuss it.

## Documentation

Best practice realtime HTML5 form validation for jQuery. Works on all popular browsers, including old ones like IE6.
- Regularly tested on 13 different browsers, IE6 - IE9, FireFox, Chrome, iPhone, and Android.
- Implements best practices based on 1,000 user survey, several usability studies, and the behavior of millions of users in live production environments.

## Supported Platforms

*Desktop*: IE 9, 8, 7, 6, Chrome, Firefox, Safari, and Opera. Tested on Windows 7 and Mac.
*Mobile*: iPhone, Android, Palm WebOS

## Jumpstart

Copy and paste this at the end of the body on any page with an HTML5 form. If html5 validation rules exist in the form, you're in business!

```
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="jquery.h5validate.js"></script>

<script>
$(document).ready(function () {
    $('form').h5Validate();
});
</script>
```

## Features

### 1. HTML5 `required` attribute

E.g.:
```
<input id="name" name="name" type="text" placeholder="Bob" title="Your name is required." required>
```

### 2. HTML5 `pattern` attribute

E.g. This expects mm/dd/yyyy:
```
<input id="name" name="name" type="text" placeholder="mm/dd/yyyy" title="mm/dd/yyyy" pattern="(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d">
```

### 3. Pattern library

Sometimes, you'll want to re-use the same validation pattern for several elements on a page. You could copy and paste the same pattern over and over again to a bunch of different form fields, but what happens if you discover a bug in the pattern? Fix it and repeat the whole copy and paste process?

A better solution is to attach the pattern with a class selector. Use `$.h5Validate.addPatterns()` to add your pattern, make sure the classPrefix variable is set correctly (it's `h5-` by default), and add the class to the input fields.

The included patterns available are:
 - email
 - phone
 - email
 - url
 - number
 - dateISO
 - alpha
 - alphaNumeric
 - integer

E.g.:
```
<input type="text" class="h5-email" required />
```

### 4. Error messages

Error divs should be hidden in the HTML with `display: none;` -- h5Validate shows them when the corresponding field is marked invalid.

E.g.:
```
<form>
    <label for="FirstName">Your Name:*</label>
    <input id="FirstName" type="text" title="Required: Please provide your first name." required>
    <div id="invalid-FirstName" style="display: none;">
        This stuff will get replaced by the title contents.
    </div>
</form>
```

### 5. Options

There are a ton of options you can override by passing `key: value` pairs when you call `.h5Validate()`. For example, we can change the CSS class that indicates validation errors:

```
<head>
<style>
	.black {
		background-color:#111111;
		color:silver;
	}
</style>
</head>
<body>
<form id="black">
		<label for="name">Your Name:*</label>
		<input id="name" name="name" type="text" placeholder="Bob" title="Your name is required." required>
</form>

<script>
	$(document).ready(function () {
		$('#black').h5Validate({
			errorClass:'black'
		});
	});
</script>
</body>
```

#### `errorClass`
Custom CSS class for validation errors.

#### `validClass`
Custom CSS class to mark a field validated.

#### `errorAttribute`
An html attribute that stores the ID of the error message container for this element. It's set to data-h5-errorid by default. Note: The data- attribute prefix is a new feature of HTML5, used to store an element's meta-data.

E.g:
`<input id="name" data-h5-errorid="nameError" required >`

#### `kbSelectors`
A list of CSS selectors for attaching keyboard-oriented events.

Default:
`kbSelectors: ':text, :password, select, textarea'`

#### `focusout, focusin, change, keyup`
A list of CSS selectors for attaching "mouse oriented" events.

Default:
`mSelectors: ':radio, :checkbox, select, option'`

#### `click`
(Event) The only default mouse-oriented event. Since it probably makes little sense to trigger validation on other mouse events, I'll leave it to you to figure out how to enable them.

*Note: The click event isn't just for the mouse. It will trigger for keyboard and touch screen interactions, too.*

`click: true`

### 6. Event API
h5Validate supports the following events:

#### `instance`
Instance created.

#### `validated`
The element in question has been validated. A validity object is passed into the event handler containing:

```
{
	element: HTMLObject, // A reference to the validated element
	customError: Bool, // Custom validity failed.
	patternMismatch: Bool, // Input does not match pattern
	rangeOverflow: Bool, // Input is greater than max attribute value
	rangeUnderflow: Bool, // Input is less than min attribute value
	stepMismatch: Bool, // Input does not conform to the step attribute setting
	tooLong: Bool, // Input is too long
	typeMismatch: Bool, // Wrong input type
	valid: Bool, // Input is valid
	valueMissing: Bool // Required value is missing
}
```

#### `formValidated`
The form in question has been validated. An object is passed with an object containing a bool, valid, and an array of validity objects corresponding to the validated elements.

### 7. Methods

#### `$.h5Validate.addPatterns(patterns)`
Take a map of pattern names and HTML5-compatible regular expressions, and add them to the patternLibrary. Patterns in the library are automatically assigned to HTML element pattern attributes for validation.

`{object} patterns`
A map of pattern names and HTML5 compatible regular expressions.


E.g.:
```
<input class="h5-phone" id="phone" name="phone" type="text" placeholder="555-555-5555" title="555-555-5555" />
```
The class="h5-phone" bit is the part doing the magic. The h5- prefix tells you that this class is a handle that we can use to attach validation rules to. Internally, we just tack this prefix to the front of the pattern names to get the right selectors.

In your JavaScript, specify the pattern name without the class prefix. Keeping the prefix off lets us easily share and re-use pattern libraries between projects.

```
$(document).ready(function () {
	$.h5Validate.addPatterns({
		phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)/				
	});

	$(form).h5Validate();
});
```

#### `$.h5Validate.validValues(selector, values)`
Take a valid jQuery selector, and a list of valid values to validate against. If the user input isn't in the list, validation fails.

`{String} selector`
Any valid jQuery selector.

`{Array} values`
A list of valid values to validate selected fields against.

### 8. New input types
---
**Warning:** Each browser has its own way of treating these new input types. iOS might swap out the on-screen keyboard (cool!), while Chrome renders custom UI controls that don't always make sense (like up and down arrows for `datetime` inputs.)

What's worse, some of the styles that get applied to these elements are browser-specific, and ignore CSS cascading -- so before you can add your own look and feel, you first have to turn off each native browser's look and feel. For example, h5Validate works just fine on that search field down there, but in Chrome, it ignores our CSS because you first have to turn off `-webkit-appearance: searchfield`; before you style it. (Hint: You may want to search for a good HTML5 CSS reset).

---

h5Validate does not currently validate new element types automatically. The pattern and required attributes work fine, but h5Validate **will not** automatically apply email validation to fields with `type="email"`, etc.. (Yet.)

Here are the HTML5 input types:
```
<form>
    <div><input title="normal" required></div>
    <div><input type="tel" required></div>
    <div><input type="search" required></div>
    <div><input type="email" required></div>
    <div><input type="url" required></div>
    <div><input type="datetime" required></div>
    <div><input type="date" required></div>
    <div><input type="month" required></div>
    <div><input type="week" required></div>
    <div><input type="time" required></div>
    <div><input type="datetime-local" required></div>
    <div><input type="number" required></div>
    <div><input type="range" required></div>
    <div><input type="color" required></div>
</form>
```
