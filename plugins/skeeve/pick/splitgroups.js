/*\
title: $:/plugins/skeeve/pick/splitgroups.js
type: application/javascript
module-type: widget

Set variables to group values widget

```
<$splitgroups name1=… name2=…>
    :
</$splitgroups>
```

Example:

```
<$splitgroups a="$1" b="test $2" c="$$ $3" d="$1 $4">
    …anything using above variables…
</$splitgroups>
```
# a will get the first group
# b will be set to "test" followed by the second group
# c will be set to a literal "$" followed by the third group
# d will be set to group 1 followed by group 4


\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var SplitgroupsWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
SplitgroupsWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
SplitgroupsWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
SplitgroupsWidget.prototype.execute = function() {
	// Get our parameters
	// As there is nothing which will give me the attributes,
	// I have to access the object myself…
	var separator= this.getAttribute("$separator","\0");
	var groups= this.getVariable("currentTiddler").split(separator);
	for(var name in this.attributes) {
		if( name.charAt(0) === "$") {
			continue;
		}
		// Split so that every odd match is a group index or a "$"
		var shattered= this.attributes[name].split(/\$(\d+|\$)/g);
		var value= shattered[0];
		for (var i= 1; i<shattered.length; ++i) {
			// if we have an even match
			// or the last match (an even one) ended with "$"
			// or this one is "$", we simply append this one
			if ( i%2 == 0 || shattered[i-1].substr(-1) == "$" || shattered[i] == "$") {
				value+= shattered[i];
				continue;
			}
			// get the groups index as a number
			var j=shattered[i]-1;
			// if it is an existing number, we append the group
			if (  j>=0 && j < groups.length ) {
				value+= groups[j];
				continue;
			}
			// Otherwise we append the literal $ followed by the index
			value+= "$" + shattered[i];
		}
		this.setVariable(name, value, this.parseTreeNode.params);
	}
	// Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
SplitgroupsWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	for(var attr in changedAttributes) {
		if(changedAttributes[attr]) {
			this.refreshSelf();
			return true;
		}
	}
	return this.refreshChildren(changedTiddlers);
};

exports.splitgroups = SplitgroupsWidget;

})();
