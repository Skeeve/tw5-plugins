/*\
title: $:/plugins/skeeve/pick/pick.js
type: application/javascript
module-type: filteroperator

Filter operator for regexp matching and picking out capturing groups

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var regexper = function(source,operator,options, grouping) {
	var results = [],
		fieldname = (operator.suffix || "title").toLowerCase(),
		regexpString, regexp, flags = "", match,
		getFieldString = function(tiddler,title) {
			if(tiddler) {
				return tiddler.getFieldString(fieldname);
			} else if(fieldname === "title") {
				return title;
			} else {
				return null;
			}
		};
	// Process flags and construct regexp
	regexpString = operator.operand;
	match = /^\(\?([gim]+)\)/.exec(regexpString);
	if(match) {
		flags = match[1];
		regexpString = regexpString.substr(match[0].length);
	} else {
		match = /\(\?([gim]+)\)$/.exec(regexpString);
		if(match) {
			flags = match[1];
			regexpString = regexpString.substr(0,regexpString.length - match[0].length);
		}
	}
	var global= flags.indexOf('g') > -1;
	try {
		regexp = new RegExp(regexpString,flags);
	} catch(e) {
		return ["" + e];
	}
	// Process the incoming tiddlers
	if(operator.prefix === "!") {
		// If negated, we handle it like the regexp filter
		source(function(tiddler,title) {
			var text = getFieldString(tiddler,title);
			if(text !== null) {
				if(!regexp.exec(text)) {
					results.push(title);
				}
			}
		});
	} else {
		source(function(tiddler,title) {
			var text = getFieldString(tiddler,title);
			if(text !== null) {
				var m;
				while (m = regexp.exec(text)) {
					// Just 1 match means: We had no capturing group
					// act like regexp filter
					if (m.length == 1) {
						results.push(title);
						break;
					}
					grouping(m, results);
				}
			}
		});
	}
	return results;
};
/*
Export our filter function
*/
exports.pick = function(source,operator,options) {
	return regexper(source,operator,options,function(m, r){
		// push each group as a result
		for (var i=1; i<m.length;++i) {
			r.push(m[i]);
		}
	});
};
exports.pickgroups = function(source,operator,options) {
	return regexper(source,operator,options,function(m, r){
		// Join all capturing groups with a NUL character
		r.push(m.slice(1).join("\0"));
	});
};

})();
