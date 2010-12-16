/**
 * h5Validate
 * @version v0.4.0
 * Using semantic versioning: http://semver.org/
 * @author Eric Hamilton dilvie@dilvie.com
 * @copyright 2010 Eric Hamilton
 * @license MIT http://www.opensource.org/licenses/mit-license.html
 * 
 * Developed under the sponsorship of Zumba.com and Rese Property Management
 */

/*global jQuery window */
/*jslint browser: true, devel: true, onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
(function ($) {
	var h5 = { // Public API
			defaults : {
				debug: true,

				// HTML5-compatible validation pattern library that can be extended and/or overriden.
				patternLibrary : { //** TODO: Test the new regex patterns. Should I apply these to the new input types?
					// **TODO: url, password
					phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)/,

					// Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
					email: /((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,

					// Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/iri/
					url: /(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

					// Number, including positive, negative, and floating decimal. Credit: bassistance
					number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?/,

					// Date in ISO format. Credit: bassistance
					dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,
					
					alpha: /[a-z]+/,
					alphaNumeric: /\w+/,
					integer: /-?\d+/
				},
				messages : {
					required: 'This is a required field.',
					invalid: 'Please correct this field.'
				},

				// The prefix to use for dynamically-created class names.
				classPrefix: 'h5-',

				errorClass: 'ui-state-error', // No prefix for these.
				validClass: 'ui-state-valid', // "
				activeClass: 'active', // Prefix will get prepended.

				// Attribute which stores the ID of the error container element (without the hash).
				errorAttribute: 'data-h5-errorid',

				// Setup KB event delegation.
				kbSelectors: ':text, :password, select, textarea',
				focusout: true,
				focusin: false,
				change: true,
				keyup: false,

				// Setup mouse event delegation.
				mSelectors: ':radio, :checkbox, select, option',
				click: true,
				
				activeKeyup: true,

				// Validate on submit?
				// **TODO: This isn't implemented, yet.
				submit: true,

				// Mark field invalid.
				// ** TODO: Highlight labels
				// ** TODO: Implement setCustomValidity as per the spec:
				// http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#dom-cva-setcustomvalidity
				markInvalid: function (options) { // element, reason, errorClass, validClass, errorID
					var $element = $(options.element),
						$errorID = $(options.errorID);
					$element.addClass(options.errorClass).removeClass(options.validClass);

					// User needs help. Enable active validation.
					$element.addClass(options.settings.activeClass);

					if ($errorID) {
						if ($element.attr('title')) {
							$errorID.text($element.attr('title'));
						}
						$errorID.show();
					}
					return $element;
		        },

				// Mark field valid.
				markValid: function (element, errorClass, validClass, errorID) {
					var $element = $(element),
						$errorID = $(errorID);

					$element.addClass(validClass).removeClass(errorClass);
					if ($errorID) {
						$errorID.hide();
					}
					return $element;
				},

				// Unmark field
				unmark: function (element, errorClass, validClass, errorID) {
					var $element = $(element);
					$element.removeClass(errorClass).removeClass(validClass);
					$element.form.find("#" + element.id).removeClass(errorClass).removeClass(validClass);
					return $element;
				}	
			}
		},
		// Aliases
		defaults = h5.defaults,
		messages = defaults.messages,
		patternLibrary = defaults.patternLibrary,

		methods = {
			validate: function (settings) {
				// Get the HTML5 pattern attribute if it exists.
				// ** TODO: If a pattern class exists, grab the pattern from the patternLibrary, but the pattern attrib should override that value.
				var $this = $(this),
					pattern = $this.filter('[pattern]')[0] ? $this.attr('pattern') : false,

				// The pattern attribute must match the whole value, not just a subset:
				// "...as if it implied a ^(?: at the start of the pattern and a )$ at the end."
				re = new RegExp('^(?:' + pattern + ')$'),
				value = $this.val(),
				errorClass = settings.errorClass,
				validClass = settings.validClass,
				errorIDbare = $this.attr(settings.errorAttribute) || false, // Get the ID of the error element.
				errorID = errorIDbare ? '#' + errorIDbare : false, // Add the hash for convenience. This is done in two steps to avoid two attribute lookups.
				required = false,
				isValid = true,
				reason = '',
				$checkRequired = $('<input required>');

				/*	If the required attribute exists, set it required to true, unless it's set 'false'.
				*	This is a minor deviation from the spec, but it seems some browsers have falsey 
				*	required values if the attribute is empty (should be true). The more conformant 
				*	version of this failed sanity checking in the browser environment.
				*	This plugin is meant to be practical, not ideologically married to the spec.
				*/
				// Feature fork
				if ($checkRequired.filter('[required]') && $checkRequired.filter('[required]').length) {
					required = ($this.filter('[required]').length && $this.attr('required') !== 'false') ? true : false;
				} else {
					required = ($this.attr('required') !== undefined) ? true : false;
				}

				if (settings.debug && window.console) {
					console.log('Validate called on "' + value + '" with regex "' + re + '". Required: ' + required); // **DEBUG
					console.log('Regex test: ' + re.test(value) + ', Pattern: ' + pattern); // **DEBUG
				}

				if (required && !value) {
					isValid = false;
					reason = 'required';
				} else if (pattern && !re.test(value) && value) {
					isValid = false;
					reason = 'pattern';
				} else {
					isValid = true;
					settings.markValid(this, errorClass, validClass, errorID);
				}

				if (!isValid) {
					settings.markInvalid({
						element: this,
						reason: reason,
						errorClass: errorClass,
						validClass: validClass,
						errorID: errorID,
						settings: settings
					});
				}
			},

			/**
			 * Take the event preferences and delegate the events to selected
			 * objects.
			 * 
			 * @param {object} eventFlags The object containing event flags.
			 * 
			 * @returns {element} The passed element (for method chaining).
			 */
			delegateEvents: function (selectors, eventFlags, element, settings) {
				var events = [],
					key = 0,
					validate = function () {
						methods.validate.call(this, settings);
					};
				$.each(eventFlags, function (key, value) {
					if (value) {
						events[key] = key;
					}
				});
				key=0;
				for (key in events) {
					if (events.hasOwnProperty(key)) {
						if (settings.debug && window.console) {
							console.log(events[key] + ', ' + selectors); //**DEBUG
						}
						$(element).delegate(selectors, events[key] + '.h5Validate', validate);
					}
				}
				return element;
			},
			/**
			 * Prepare for event delegation.
			 * 
			 * @param {object} settings The full plugin state, including
			 * options. 
			 * 
			 * @returns {object} jQuery object for chaining.
			 */
			bindDelegation: function (settings) {
				// Attach patterns from the library to elements.
				$.each(patternLibrary, function (key, value) {
					var pattern = value.toString();
					pattern = pattern.substring(1, pattern.length-1);
					if (settings.debug && window.console) {
						console.log('.' + settings.classPrefix + key + ' : ' + pattern);
					}
					$('.' + settings.classPrefix + key).attr('pattern', pattern);
				});
				return this.each(function () {
					var kbEvents = {
							focusout: settings.focusout,
							focusin: settings.focusin,
							change: settings.change,
							keyup: settings.keyup
						},
						mEvents = {
							click: settings.click
						},
						activeEvents = {
							keyup:settings.activeKeyup
						};

					methods.delegateEvents(settings.kbSelectors, kbEvents, this, settings);
					methods.delegateEvents(settings.mSelectors, mEvents, this, settings);
					methods.delegateEvents(settings.activeClassSelector, activeEvents, this, settings);
				});
			}
		};

	$.h5Validate = {
		/**
		 * Take a map of pattern names and HTML5-compatible regular
		 * expressions, and add them to the patternLibrary. Patterns in
		 * the library are automatically assigned to HTML element pattern
		 * attributes for validation.
		 * 
		 * @param {Object} patterns A map of pattern names and HTML5 compatible
		 * regular expressions.
		 * 
		 * @returns {Object} patternLibrary The modified pattern library
		 */
		addPatterns : function (patterns) {
			var patternLibrary = defaults.patternLibrary,
				key;
			for (key in patterns) {
				if (patterns.hasOwnProperty(key)) {
					patternLibrary[key] = patterns[key];
					if (defaults.debug && window.console) {
						console.log(patternLibrary[key]);
					}
				}
			}
			return patternLibrary;
		},
		/**
		 * Take a valid jQuery selector, and a list of valid values to
		 * validate against.
		 * If the user input isn't in the list, validation fails.
		 * 
		 * @param {String} selector Any valid jQuery selector.
		 *
		 * @param {Array} values A list of valid values to validate selected 
		 * fields against.
		 */
		validValues : function (selector, values) {
			var i = 0,
				ln = values.length,
				pattern = '';
			// Build regex pattern
			for (i = 0; i < ln; i++) {
				pattern = pattern ? pattern + '|' + values[i] : values[i];
			}
			$(selector).attr('pattern', pattern);
		}
	};

	$.fn.h5Validate = function (options) {
		// Combine defaults and options to get current settings.
		var settings = $.extend({}, defaults, options),
			activeClass = settings.classPrefix + settings.activeClass;

		$.extend(settings, {
			activeClass: activeClass,
			activeClassSelector: '.' + activeClass 
		});

		settings.messages = messages;

		// Expose public API.
		$.extend($.fn.h5Validate, h5);

		// Returning the jQuery object allows for method chaining.
		return methods.bindDelegation.call(this, settings);
	};
}(jQuery));