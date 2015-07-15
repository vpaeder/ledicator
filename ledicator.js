/*
    Copyright (C) 2015 Vincent Paeder

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

!function ($) {

  "use strict";


 /* LEDicator class */

  var LEDicator = function (element, options) {
    this.options = options;
	/* Pre-defined colors */
	this.namedColors = {
		"gray": ["#9a9a9a","#858585","#00000033"],
		"red": ["#ef5a5a","#d02525","#d200007f"],
		"yellow": ["#efef5a","#d0d025","#d2d2007f"],
		"green": ["#5aef5a","#25d025","#00d2007f"],
		"blue":["#5a5aef","#2525d0","#0000d27f"],
		"orange":["#efaf5a","#d08025","#d264007f"],
		"pink":["#ef5aef","#d025d0","#d200d27f"],
		"cyan":["#5aefef","#25d0d0","#00d2d27f"]	
	}
	
    this.$element = $(element);
	this.className = "container_"+this.$element[0].id;
    this.$container = $("<div class='"+this.className+"'></div>");
    this.$button = $("<label></label>");
    this.$options = $(element).children('option');
    this.numberOfOptions = this.$options.length;
    // this.initialOptionIndex = this.$options.filter('[value="'+$(element).val()+'"]').index();
	this.initialOptionIndex = this.getState();
	this.ledStyle = null;
	//this.enabled = true;
	this.convertColors();
    this.init();
  }

  LEDicator.prototype = {
    constructor: LEDicator,
	
	currentState: null,
	  
    init: function(){
      var that = this;
      // hide original select
      this.$element.css({ position: 'absolute', left: '-9999px' })
      // Prepare the slider for the DOM
      this.$container.append(this.$button);
      // Append the slider to the DOM
      this.$element.after(this.$container);
	  
	  this.currentState = this.initialOptionIndex;
	  this.copyStyles(".ledicator", "." + this.className); // styles must be copied to avoid conflict
	  this.ledStyle = this.findStyle("." + this.className + " label::before");
	  
	  this.setState(this.currentState);
	  
      this.$element.on('change', function(e){
		  that.setState(that.getState());
		
	  });
	  
      this.$button.on('mousedown', function(e){
		  if ($(that).ledicator.enabled) {
			  that.setState(that.currentState+1);
		  }
      });

    },
	
	getState: function() {
		/* this should do the same as this.$options.filter(...), but filter didn't work
		   with my configuration (Safari 8) */
		var vals = [];
		this.$options.each(function() {
			vals.push(this.value);
		});
		return vals.indexOf(this.$element.val());
	},
	
	setState: function(newState) {
		/* */
		this.$options.removeAttr('selected');
		if (newState>=this.numberOfOptions) {
			newState = 0;
		}
		if (newState<0) {
			newState = this.numberOfOptions-1;
		}
		this.$options.eq(newState).prop('selected', 'selected');
		var colors = this.options.states[newState];
		this.changeStyle(colors);
		this.currentState = newState;
	},
	
	colorToRgba: function(hex) {
		// 8 letter hex color (rgba)
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    var rgba = result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16),
	        a: parseInt(result[4], 16)/255
	    } : null;
		// 6 letter hex color (rgb)
		if (result == null) {
			result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    var rgba = result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16),
				a: 1.0
		    } : null;
		}
		if (rgba!=null) {
			return "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+")";
		}
	},
	
	convertColors: function() {
		for (var no=0; no<this.numberOfOptions; no++) {
			if (typeof(this.options.states[no]) != "string") {
				for (var nc=0; nc<3; nc++) {
					if (this.options.states[no].length==3) {
						this.options.states[no][nc] = this.colorToRgba(this.options.states[no][nc]);
					} else {
						this.options.states[no][nc] = this.colorToRgba(this.options.states[no][0]);
					}
				}
			} else {
				var col = this.colorToRgba(this.options.states[no]);
				if (col!=undefined) {
					this.options.states[no] = new Array();
					for (var nc=0; nc<3; nc++) {
						this.options.states[no].push(col);
					}
				} else {
					this.options.states[no] = this.namedColors[this.options.states[no]];
					for (var nc=0; nc<3; nc++) {
						this.options.states[no][nc] = this.colorToRgba(this.options.states[no][nc]);
					}
				}
			}
		}
	},
	
	findStyle: function(ruleName) {
		/* Since we use ::before and ::after pseudo-elements, we can't change them with jquery directly.
		   This is an attempt to do it through plain javascript in a somewhat efficient way.
		   Procedure: search for style to be modified -> store it in a property -> change relevant style rules when needed */
		for (var m=0; m<document.styleSheets.length; m++) {
			for (var n=0; n<document.styleSheets[m].cssRules.length; n++) {
				if (typeof document.styleSheets[m].cssRules[n].selectorText != "undefined") {
					// skips rules without a selector
					if (document.styleSheets[m].cssRules[n].selectorText == ruleName) {
						return document.styleSheets[m].cssRules[n];
					}
				}
			}
		}
	},
	
	copyStyles: function(className, newClassName) {
		// only one copy must be done => needs to stop after having copied from the 1st style sheet found
		var copied = false;
		for (var m=0; m<document.styleSheets.length; m++) {
			var nmax = document.styleSheets[m].cssRules.length; // needs to store it before, as it is going to grow
			for (var n=0; n<nmax; n++) {
				if (typeof document.styleSheets[m].cssRules[n].selectorText != "undefined") {
					// skips rules without a selector
					if (document.styleSheets[m].cssRules[n].selectorText.indexOf(className)>-1) {
						var copied = true;
						var newStyleText = document.styleSheets[m].cssRules[n].cssText;
						while (newStyleText.indexOf(className)>-1) {
							newStyleText = newStyleText.replace(className, newClassName);
						}
						document.styleSheets[m].insertRule(newStyleText,document.styleSheets[m].cssRules.length);
					}
				}
			}
			if (copied) { break; }
		}
	},
	
	changeStyle: function(colors) {
		this.ledStyle.style.background = "radial-gradient(40% 35%, "+colors[0]+", "+colors[1]+" 60%)";
	    this.ledStyle.style.boxShadow = "inset 0 3px 5px 1px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.4), 0 0 10px 2px " + colors[2];
	}
  }

  /* LEDicator plugin definition */
  $.fn.ledicator = function(opt) {
      // slice arguments to leave only arguments after function name
      var args = Array.prototype.slice.call(arguments, 1);
      return this.each(function() {
          var item = $(this), instance = item.data('LEDicator');
          if(!instance) {
              // create plugin instance and save it in data
              item.data('LEDicator', new LEDicator(this, opt));
          } else {
              // if instance already created call method
              if(typeof opt === 'string') {
                  instance[opt].apply(instance, args);
              }
          }
      });
  }
  if ($.fn.ledicator.enabled == undefined) {
  	$.fn.ledicator.enabled = true;
  }
  $.fn.setState = function(state) {
	  return $(this).data().LEDicator.setState(state);
  }
  $.fn.getState = function() {
	  return $(this).data().LEDicator.getState();
  }
}(jQuery);
