# LEDicator
jQuery plugin to display a &lt;select> control as a single LED indicator with different colour states.
The indicator style is inspired from [this tutorial](http://tympanus.net/Tutorials/CSS3ButtonSwitches/).

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

LEDicator applies to *<select>* HTML elements. Create one with a defined number of *<option>* tags. Give your *<select>* element an id. Then, include a JavaScript block with the following line
```
$("#id_of_your_select_element").ledicator( {'states': {'0':'gray', '1':'red', ...} } );
```
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
