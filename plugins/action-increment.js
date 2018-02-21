/*\
title: $:/plugins/skeeve/widgets/action-increment.js
type: application/javascript
module-type: widget

Action widget to increment a value specified by a text reference

<$action-increment $reference="Tiddler!!field"/>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var IncrementWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
IncrementWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
IncrementWidget.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
IncrementWidget.prototype.execute = function() {
	this.actionReference = this.getAttribute("$reference");
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
IncrementWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if($tw.utils.count(changedAttributes) > 0) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
IncrementWidget.prototype.invokeAction = function(triggeringWidget,event) {
	if(this.actionReference) {
		var value=this.wiki.getTextReference(this.actionReference,"0",this.getVariable("currentTiddler"));
		var shattered= value.split(/(\d+)/);
		if(shattered.length>2) {
			shattered[1]= ((("10"+shattered[1])*1+1)+"").replace(/^10?/, "");
			value= shattered.join("");
			this.wiki.setTextReference(this.actionReference,value,this.getVariable("currentTiddler"));
		}
	}
	return true; // Action was invoked
};

exports["action-increment"] = IncrementWidget;

})();
