/**
 * h5Validate
 * @version v0.1.1
 * Using semantic versioning: http://semver.org/
 * @author Eric Hamilton dilvie@dilvie.com
 * @copyright 2010 Eric Hamilton
 * @license MIT http://www.opensource.org/licenses/mit-license.html
 */

/*global jQuery */
/*jslint browser: true, devel: true, onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
(function ($) {
	var h5 = { // Public API
			// Public HTML5-compatible validation pattern library that can be extended and/or overriden.
			// **TODO: This bit is not implemented yet. Use namespaced class names to address these in the HTML.
			patternLibrary : {
				phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)/
			},
			messages : {
				required : 'This is a required field.',
				invalid : 'Please correct this field.'
			},
			defaults : {
				debug: true,
				
				errorClass: 'ui-state-error',
				validClass: 'ui-state-valid',
	
				// Attribute which stores the ID of the error container element (without the hash).
				errorAttribute: 'data-errorID',
	
				// Setup KB event delegation.
				kbSelectors: ':text, :password, select, textarea',
				focusout: true,
				focusin: false,
				change: false,
				keyup: true,
				
				// Setup mouse event delegation.
				mSelectors: ':radio, :checkbox, select, option',
				click: true,
				
				// Validate on submit?
				submit: true,
		
				// Mark field invalid.
				// ** TODO: Highlight labels
				markInvalid: function (element, errorClass, validClass, errorID) {
					$(element).addClass(errorClass).removeClass(validClass);
					$(element.form).find("#" + element.id).addClass(errorClass);
					if ($(errorID)) {
						$(errorID).show();
					}
					return $(element);
		        },
		
				// Mark field valid.
				markValid: function (element, errorClass, validClass, errorID) {
					$(element).addClass(validClass).removeClass(errorClass);
					return $(element);
				},
		
				// Unmark field
				unmark: function (element, errorClass, validClass, errorID) {
					$(element).removeClass(errorClass).removeClass(validClass);
					$(element.form).find("#" + element.id).removeClass(errorClass).removeClass(validClass);
					return $(element);
				},	
				validate: function (settings) {
						// Get the HTML5 pattern attribute if it exists.
						// ** TODO: If a pattern class exists, grab the pattern from the patternLibrary, but the pattern attrib should override that value.
					var $this = $(this),
						pattern = $this.filter('[pattern]')[0] ? $this.attr('pattern') : false,
	
						// The pattern attribute must match the whole value, not just a subset:
						// "...as if it implied a ^(?: at the start of the pattern and a )$ at the end."
						re = new RegExp('^(?:' + pattern + ')$'),
						value = $this.val(),
						required = ($this.attr('required') !== null) ? true : false, // If the required attribute exists, set it required to true.
						errorClass = settings.errorClass,
						validClass = settings.validClass,
						errorIDbare = $this.attr(settings.errorAttribute) || false, // Get the ID of the error element.
						errorID = errorIDbare ? '#' + errorIDbare : false; // Add the hash for convenience. This is done in two steps to avoid two attribute lookups.
					
					if (settings.debug && window.console) {
						console.log('Validate called on "' + value + '" with regex "' + re + '".'); // **DEBUG
						console.log('Regex test: ' + re.test(value) + ', Pattern: ' + pattern); // **DEBUG
					}
	
					if ( (required && !value) || (pattern && !re.test(value)) ) {
						settings.markInvalid(this, errorClass, validClass, errorID);
					} else {
						settings.markValid(this, errorClass, validClass, errorID);
					}
				}
			}
		},
		// Alias public API methods for internal use.
		patternLibrary = h5.patternLibrary,
		messages = h5.messages,
		defaults = h5.defaults,

		methods = {
			/**
			 * Take the event preferences and bind the events to selected objects.
			 * Return a list of events that got bound.
			 * @param {object} eventFlags The object containing event flags.
			 * @returns {array} A new array containing only the true event names.
			 */
			delegateEvents: function (selectors, eventFlags, element, settings) {
				var events = [],
					i = 0,
					validate = function () {
						settings.validate.call(this, settings);
					};
				$.each(eventFlags, function (key, value) {
					if (value) {
						events[key] = key;
					}
				});
				i=0;
				for (i in events) {
					if (events.hasOwnProperty(i)) {
						if (window.console) {
							console.log(events[i] + ', ' + selectors); //**DEBUG
						}
						$(element).delegate(selectors, events[i] + '.h5Validate', validate);
					}
				}
				return events;
			},
			bindDelegation: function (settings) {
				return this.each(function () {
					var	kbEvents = {
							focusout: settings.focusout,
							focusin: settings.focusin,
							change: settings.change,
							keyup: settings.keyup
						},
						mEvents = {
							click: settings.click
						};

					kbEvents = methods.delegateEvents(settings.kbSelectors, kbEvents, this, settings);
					mEvents = methods.delegateEvents(settings.mSelectors, mEvents, this, settings);
				});
			}
		};

	$.fn.h5Validate = function (options) {
		// Combine defaults and options to get current settings.
		var settings = $.extend({}, settings, defaults, options);

		// Expose public API.
		$.extend($.fn.h5Validate, h5);

		// Returning the jQuery object allows for method chaining.
		return methods.bindDelegation.call(this, settings);
	};	
}(jQuery));
