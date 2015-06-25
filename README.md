# LEDicator
jQuery plugin to display a ```<select>``` control as a single LED indicator with different colour states.

The indicator style is inspired from [this excellent tutorial](http://tympanus.net/codrops/2012/09/13/button-switches-with-checkboxes-and-css3-fanciness/) by Hugo Giraudel, which provides a CSS3-only fancy and lightweight representation of a LED button.

# Installation

LEDicator requires [jQuery](https://jquery.com) to function. Include the jQuery source before including LEDicator, like this
```
<script type="text/javascript" src="ledicator.js"></script>
```

You also need to include the LEDicator style sheet

```
<link rel="stylesheet" href="ledicator.css">
```

# Usage

LEDicator applies to ```<select>``` HTML elements. Create one with a defined number of ```<option>``` tags. Give your ```<select>``` element an id. Then, include a JavaScript block with the following line

```
$("#id_of_your_select_element").ledicator( {'states': {'0':'gray', '1':'red', ...} } );
```
You will find a working example [here](https://github.com/vpaeder/ledicator/blob/master/ledicator-demo.html).

The *states* option is mandatory and specifies the colours associated with each state. You need to define each sate following the pattern 'option name':'colour'.

Some predifined colours are included. These are:

```
	"gray": ["#9a9a9a","#858585","#00000033"]
	"red": ["#ef5a5a","#d02525","#d200007f"]
	"yellow": ["#efef5a","#d0d025","#d2d2007f"]
	"green": ["#5aef5a","#25d025","#00d2007f"]
	"blue":["#5a5aef","#2525d0","#0000d27f"]
	"orange":["#efaf5a","#d08025","#d264007f"]
	"pink":["#ef5aef","#d025d0","#d200d27f"]
	"cyan":["#5aefef","#25d0d0","#00d2d27f"]	
```

It is possible to define your own colours by providing an array of length 3 containing RGB or RGBA hex-coded colours, representing ["LED center colour", "LED edge colour", "LED glow colour"].

# Methods

To simplify access to the LED state, LEDicator comes with the following methods:

**setState(state_index)** sets the state to the given option index (integer)

**getState()** returns the currently display option index (integer)

These methods are accessible in this way:
```
$("#id_of_your_select_element").setState(3);
var state = $("#id_of_your_select_element").getState();
```

# License
LEDicator is licensed under the [GPL v3.0](http://www.gnu.org/licenses/gpl-3.0.en.html).
