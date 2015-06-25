/* Pre-defined colors */
var namedColors = {
	"gray": ["#9a9a9a","#858585","#00000033"],
	"red": ["#ef5a5a","#d02525","#d200007f"],
	"yellow": ["#efef5a","#d0d025","#d2d2007f"],
	"green": ["#5aef5a","#25d025","#00d2007f"],
	"blue":["#5a5aef","#2525d0","#0000d27f"],
	"orange":["#efaf5a","#d08025","#d264007f"],
	"pink":["#ef5aef","#d025d0","#d200d27f"],
	"cyan":["#5aefef","#25d0d0","#00d2d27f"]	
}

!function ($) {

  "use strict";


 /* LEDicator class */

  var LEDicator = function (element, options) {
    this.options = options;
    this.$element = $(element);
    this.$container = $("<div class='ledicator'></div>");
    this.$button = $("<label></label>");
    this.$options = $(element).children('option');
    this.numberOfOptions = this.$options.length;
    // this.initialOptionIndex = this.$options.filter('[value="'+$(element).val()+'"]').index();
	this.initialOptionIndex = this.getState();
	this.ledStyle = null;
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
	  this.ledStyle = this.findStyle(".ledicator label::before");
	  
	  this.setState(this.currentState);
	  
      this.$element.on('change', function(e){
		  that.setState(that.getState());
		
	  });
	  
      this.$button.on('mousedown', function(e){
		  that.setState(that.currentState+1);
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
					this.options.states[no] = namedColors[this.options.states[no]];
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
				if (document.styleSheets[m].cssRules[n].selectorText == ruleName) {
					return document.styleSheets[m].cssRules[n].style;
				}
			}
		}
	},
	
	changeStyle: function(colors) {
		this.ledStyle.background = "radial-gradient(40% 35%, "+colors[0]+", "+colors[1]+" 60%)";
	    this.ledStyle.boxShadow = "inset 0 3px 5px 1px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.4), 0 0 10px 2px " + colors[2];
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
  $.fn.setState = function(state) {
	  return $(this).data().LEDicator.setState(state);
  }
  $.fn.getState = function() {
	  return $(this).data().LEDicator.getState();
  }
}(jQuery);