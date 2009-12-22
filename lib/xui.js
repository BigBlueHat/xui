/*
* @projectDescription 	XUI JavaScript library for mobile web applications.
*
* @author	Rob Ellis rob.ellis@nitobi.com
* @author	Brian LeRoux brian.leroux@westcoastlogic.com
* @author	Brock Whitten brock@sintaxi.com
*
* @version	0.1
*
* XUI
* ===
*
* A simple javascript framework for building mobile web applications.
* ---
*
* ### WHY?!
*
* We hear your words. _Why another JavaScript framework?!_ When development of PhoneGap was under way we noticed slow
* load times for modern JavaScript frameworks (such as Prototype, MooTools, YUI, Ext and (yes) even jQuery.
* A big reason why these libraries are so big is because  is mostly they contain a great deal of cross browser
* compatability code. The mobile space has less browser implementations (so far) and different needs. Thus XUI.
*
* XUI strives to be a framework for first class mobile device browsers such as WebKit, Fennec and Opera with future
* support under consideration for IE Mobile and BlackBerry.
*
* ### Authors
*
* - Rob Ellis
* - Brock Whitten
* - Brian LeRoux
*
* ### Download
*
* Minified code is less than 6k!
*
* ### Contribute
*
* Clone the source from GitHub:
*
* 	git clone git://github.com/brianleroux/xui.git
*
* To build xui: run _rake_ in the shell of your choice from the root of the project directory. (This requires Ruby.)
* There are other tasks for code minification, running the specs and generating docs. Run `rake -T` to see them all.
*
* Check out the _example_ directory for a comprehensive example application. Specs are in the _spec_ directory.
*
* API Documentation
* ===
*
* Welcome the XUI documentation. This is generated from inline documentation in the XUI javascript source.
*
*
*
* Basics
* ---
*
* XUI is available to the entire document as x$. It is a function, that accepts a query selector. The syntax is
* mostly chainable and should be familiar to anyone who has worked with jQuery.
*
* 	x$('a.navigation').css({ background:'blue' });
*
* The query selection engine is based on the browser implementation of querySelectorAll so its fast. Real fast.
* XUI allows for a single expression, an element or an array of elements to be passed
*
* 	x$(window);
*
*	x$('ul#globalnav li a.selected');
*
*	x$('li', 'div#foo');
*
*	x$(['li', 'div#foo']);
*
*/

var xui;

(function() {
  var undefined;

	xui = function(q) {
		q = q || document;
		return this.find(q);
	},

	idExpr = /^#([\w-]+)$/;

	xui.extend = function(obj) {
		var original = this.prototype;
		var extended = obj;
		for (var key in (extended || {})) original[key] = extended[key];
		return original;
	};

	xui.prototype = {

		elements:[],

		find: function(q) {
			var ele = [];
			var qlen = q.length;
      		var list, size;
      		var i, j;

      		if (typeof q == 'string' && idExpr.test(q)) {
        		this.elements.push(document.getelementsById(q));
        		return this;
      		}

			for(i = 0; i < qlen; i++ ) {
				if (typeof q[i] == 'string' ) { // one selector
					list = document.querySelectorAll ? document.querySelectorAll(q[i]) : Sizzle(q[i]);
					size = list.length;
					for(j = 0; j < size; j++ ) {
						ele.push(list[j]);
					}
				} else {
					if (q[i] instanceof Array) { // an array of selectors
						for (var x = 0; x < q[i].length; x++) {
								list = document.querySelectorAll ? document.querySelectorAll(q[i][x]) : Sizzle(q[i][x]);
							size = list.length;
							for(j = 0; j < size; j++ ) {
								ele.push(list[j]);
							}
						}
					} else {
						ele.push(q[i]);	// an element
					}
				}
			}
			this.elements = this.elements.concat(this.reduce(ele));
			return this;
		},

		/**
		 * Array Unique
		 */
		reduce: function( el, b ) {
			var a = [], i, l = el.length;
			for( i=0; i<l; i++ ) {
				if( a.indexOf( el[i], 0, b ) < 0 ) { a.push( el[i] ); }
			}
			return a;
		},
		/**
		 * Array Remove - By John Resig (MIT Licensed)
		 */
		removex: function(array, from, to) {
	      var rest = array.slice((to || from) + 1 || array.length);
	      array.length = from < 0 ? array.length + from : from;
	      return array.push.apply(array, rest);
	    },

		/**
		 * Has modifies the elements array and reurns all the elements that match (has) a CSS Query
		 */
		has: function(q) {

			var t = [];
			this.each(function(el){
				x$(q).each(function(hel) { if (hel == el) { t.push(el); } });
	      	});

			this.elements = t;
			return this;
		},


		/**
		 * Not modifies the elements array and reurns all the elements that DO NOT match a CSS Query
		 */
		not: function(q) {
			var list = this.elements;
			for (var i = 0; i<list.length;i++) {
				x$(q).each(function(hel){
					if (list[i] == hel ) {
						this.elements = this.removex(list,list.indexOf(list[i]));
					}
				});
			}

			return this;

		},

		/**
		 * Adds more DOM nodes to the existing element list.
		 */
		add: function(q) {
			this.find([q]);
			this.elements = this.reduce(this.elements);
			return this;
		},


		/**
		 * Returns the first element in the collection.
		 *
		 * @return {Element} Returns a single DOM element.
		 */
		first: function() {
			return this.get(0);
		},

		/**
		 * Returns the element in the collection at the
		 * given index
		 *
		 * @return {Element} Returns a single DOM element
		 * */
		get: function(index) {
			return this.elements[index];
		},

		/**
		 * Returns a collection containing the element
		 * at the given index
		 * */
		eq: function(idx1,idx2) {
			idx2 = idx2 ? idx2 + 1 : idx1 + 1;
			this.elements = this.elements.slice(idx1,idx2);
			return this;
		},

		/**
		 * Returns the size of the collection
		 *
		 * @return {Number} Returns an integer size of collection
		 * */
		size: function() {
			return this.elements.length;
		},

		/**
		 * Element iterator.
		 *
		 * @return {XUI} Returns the XUI object.
		 */
	  	each: function(fn) {
			for (var i = 0, len = this.elements.length; i<len; ++i) {
                if (fn.call(this, this.elements[i]) === false) {
					break;
				}
			}
			return this;
		}
	};

	var libs = [];

/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
		soFar = selector;

	while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
		soFar = m[3];

		parts.push( m[1] );

		if ( m[2] ) {
			extra = m[3];
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set );
			}
		}
	} else {
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], found, item;
				anyFound = false;

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		if ( expr === old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				throw "Syntax error, unrecognized expression: " + name;
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}
					if ( type === "first" ) {
						return true;
					}
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					var doneName = match[0],
						parent = elem.parentNode;

					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}
						parent.sizcache = doneName;
					}

					var diff = elem.nodeIndex - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 );

} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

function getText( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
}

(function(){
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){

	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";

		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function(query, context, extra, seed){
			context = context || document;

			if ( !seed && context.nodeType === 9 && !isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null; // release memory in IE
	})();
}

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ? function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};


window.Sizzle = Sizzle;

})();
/**
 *
 * @namespace {Dom}
 * @example
 *
 * Dom
 * ---
 *
 * Manipulating the Document Object Model aka the DOM.
 *
 */
var Dom = {

    inner: function(html) {
        return this.html('inner', html);
    },
    outer: function(html) {
        return this.html('outer', html);
    },
    top: function(html) {
        return this.html('top', html);
    },
    bottom: function(html) {
        return this.html('bottom', html);
    },
    remove: function() {
        return this.html('remove');
    },
    before: function(html) {
        return this.html('before', html);
    },
    after: function(html) {
        return this.html('after', html);
    },


    /**
	 * For manipulating HTML markup in the DOM.
	 *
	 * @method
	 * @param {location} [inner|outer|top|bottom|remove|before|after]
	 * @param {html} A string representation of HTML markup.
	 * @return {Element Collection}
	 * @example
	 *
	 * ### html
	 *
	 * Adds elements or changes the content of an element on a page. This method has shortcut aliases:
	 *
	 * - inner
	 * - outer
	 * - top
 	 * - bottom
	 * - remove
	 * - before
	 * - after
	 *
	 * syntax:
	 *
	 * 		x$(window).html( location, html );
	 *
	 * or this method will accept just an html fragment with a default behavior of inner..
	 *
	 * 		x$(window).html( htmlFragment );
	 *
	 * arguments:
	 *
	 * - location:string can be one of inner, outer, top, bottom
	 * - html:string any string of html markup or HTMLElement
	 *
	 * example:
	 *
	 *  	x$('#foo').html( 'inner',  '<strong>rock and roll</strong>' );
	 *  	x$('#foo').html( 'outer',  '<p>lock and load</p>' );
	 * 		x$('#foo').html( 'top',    '<div>bangers and mash</div>');
	 *  	x$('#foo').html( 'bottom', '<em>mean and clean</em>');
	 *  	x$('#foo').html( 'remove');
	 *  	x$('#foo').html( 'before', '<p>some warmup html</p>');
	 *  	x$('#foo').html( 'after', '<p>more html!</p>');
	 *
	 * or
	 *
	 * 		x$('#foo').html('<p>sweet as honey</p>');
	 *
	 */
    html: function(location, html) {

        var getTag = function(el) {

            if (el.firstChild === null) {
                switch (el.tagName) {
                case 'UL':
                    return 'LI';
                case 'DL':
                    return 'DT';
                case 'TR':
                    return 'TD';
                default:
                    return el.tagName;
                }
            }
            return el.firstChild.tagName;
        };

        var wrap = function(xhtml, tag) {

            var attributes = {};
            var re = /^<([A-Z][A-Z0-9]*)([^>]*)>(.*)<\/\1>/i;
            if (re.test(xhtml)) {
                result = re.exec(xhtml);
                tag = result[1];

                if (result[2] !== "") {
                    var attrList = result[2].split(/([A-Z]*\s*=\s*['|"][A-Z0-9:;#\s]*['|"])/i);

                    for (var i = 0; i < attrList.length; i++) {
                        var attr = attrList[i].replace(/^\s*|\s*$/g, "");
                        if (attr !== "" && attr !== " ") {
                            var node = attr.split('=');
                            attributes[node[0]] = node[1].replace(/(["']?)/g, '');
                        }
                    }
                }
                xhtml = result[3];
            }

            var element = document.createElement(tag);

            for (var x in attributes) {
                var a = document.createAttribute(x);
                a.nodeValue = attributes[x];
                element.setAttributeNode(a);
            }

            element.innerHTML = xhtml;
            return element;
        };

        this.clean();

        if (arguments.length == 0) {
            return this.elements[0].innerHTML;
        }
        if (arguments.length == 1 && arguments[0] != 'remove') {
            html = location;
            location = 'inner';
        }

        this.each(function(el) {
            switch (location) {
            case "inner":
                if (typeof html == 'string') {
                    el.innerHTML = html;
                    var list = el.getElementsByTagName('SCRIPT');
                    var len = list.length;
                    for (var i = 0; i < len; i++) {
                        eval(list[i].text);
                    }
                } else {
                    el.innerHTML = '';
                    el.appendChild(html);
                }
                break;
            case "outer":
                if (typeof html == 'string') {
                    html = wrap(html, getTag(el));
                }
                el.parentNode.replaceChild(html, el);
                break;
            case "top":
                if (typeof html == 'string') {
                    html = wrap(html, getTag(el));
                }
                el.insertBefore(html, el.firstChild);
                break;
            case "bottom":
                if (typeof html == 'string') {
                    html = wrap(html, getTag(el));
                }
                el.insertBefore(html, null);
                break;
            case "remove":
                var parent = el.parentNode;
                parent.removeChild(el);
                break;
            case "before":
                var parent = el.parentNode;
                if (typeof html == 'string') {
                    html = wrap(html, getTag(parent));
                }
                parent.insertBefore(html, el);
                break;
            case "after":
                var parent = el.parentNode;
                if (typeof html == 'string') {
                    html = wrap(html, getTag(parent));
                }
                parent.insertBefore(html, el.nextSibling);
                break;
            }
        });
        return this;
    },



    /**
	 * Removes all erronious nodes from the DOM.
	 *
	 * @method
	 * @return {Element Collection}
	 * @example
	 *
	 * ### clean
	 *
	 * Walks the Element Collection removing empty nodes and whitespace.
	 *
	 * syntax:
	 *
	 * 		x$(selector).clean();
	 *
	 * example:
	 *
	 * 		x$(window).clean();
	 */
    clean: function() {
        var ns = /\S/;
        this.each(function(el) {
            var d = el,
            n = d.firstChild,
            ni = -1;
            while (n) {
                var nx = n.nextSibling;
                if (n.nodeType == 3 && !ns.test(n.nodeValue)) {
                    d.removeChild(n);
                } else {
                    n.nodeIndex = ++ni;
                }
                n = nx;
            }
        });
        return this;
    },

    /**
	 * Attribute getter/setter
	 *
	 * @method
	 * @param {String} attributeName
	 * @param {String} attributeValue
	 * @return {Element Collection|String}
	 * */
    attr: function(attribute, val) {
        if (arguments.length == 2) {
            this.each(function(el) {
                el.setAttribute(attribute, val);
            });

            return this;
        } else {
            var attrs = [];
            this.each(function(el) {
                if (el.getAttribute(attribute) != null)
                attrs.push(el.getAttribute(attribute));

            });
            return attrs;
        }
    }
};

libs.push(Dom);
/**
 *
 * @namespace {Event}
 * @example
 *
 * Event
 * ---
 *
 * A good old fashioned event handling system.
 *
 */
var Event = {

	click: 		   		function(fn) { return this.on('click', 				fn); },
	load: 		   		function(fn) { return this.on('load',				fn); },
	submit: 		   	function(fn) { return this.on('submit',				fn); },
	touchstart:    		function(fn) { return this.on('touchstart',			fn); },
	touchmove: 	   		function(fn) { return this.on('touchmove',			fn); },
	touchend: 	   		function(fn) { return this.on('touchend',			fn); },
	touchcancel:   		function(fn) { return this.on('touchcancel',		fn); },
	gesturestart:  		function(fn) { return this.on('gesturestart',		fn); },
  	gesturechange: 		function(fn) { return this.on('gesturechange',		fn); },
  	gestureend:    		function(fn) { return this.on('gestureend',			fn); },
	orientationchange: 	function(fn) { return this.on('orientationchange',	fn); },

	/**
	 *
	 * Register callbacks to DOM events.
	 *
	 * @method
	 * @param {Event} The event identifier as a string.
	 * @param {Function} The callback function to invoke when the event is raised.
	 * @return {Element Collection}
	 * @example
	 *
	 * ### on
	 *
	 * Registers a callback function to a DOM event on the element collection.
	 *
	 * This method has shortcut aliases for:
	 *
	 * - click
	 * - load
	 * - touchstart
	 * - touchmove
	 * - touchend
	 * - touchcancel
	 * - gesturestart
	 * - gesturechange
	 * - gestureend
	 * - orientationchange
	 *
	 * For more information see:
	 *
	 * - http://developer.apple.com/webapps/docs/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/chapter_7_section_1.html#//apple_ref/doc/uid/TP40006511-SW1
	 *
	 * syntax:
	 *
	 * 		x$('button').on( 'click', function(e){ alert('hey that tickles!') });
	 *
	 * or...
	 *
	 * 		x$('a.save').click(function(e){ alert('tee hee!') });
	 *
	 * arguments:
	 *
	 * - type:string the event to subscribe to click|load|etc
	 * - fn:function a callback function to execute when the event is fired
	 *
	 * example:
	 *
	 * 		x$(window).load(function(e){
	 * 			x$('.save').touchstart( function(evt){ alert('tee hee!') }).css(background:'grey');
	 *  	});
	 *
	 */
	on: function(type, fn) {
	    var listen = function(el) {
	        if (window.addEventListener) {
	            el.addEventListener(type, fn, false);
	        }
	    };
	    this.each(function(el) {
	        listen(el);
	    });
	    return this;
	}
};

libs.push(Event);
/**
 *
 * @namespace {Style}
 * @example
 *
 * Style
 * ---
 *
 * Anything related to how things look. Usually, this is CSS.
 *
 */
var Style = {

	/**
	 *
	 * Sets a single CSS property to a new value.
	 *
	 * @method
	 * @param {String} The property to set.
	 * @param {String} The value to set the property.
	 * @return {Element Collection}
	 * @example
	 *
	 * ### setStyle
	 *
	 * syntax:
	 *
	 * 	x$(selector).setStyle(property, value);
	 *
	 * arguments:
	 *
	 * - property:string the property to modify
	 * - value:string the property value to set
	 *
	 * example:
	 *
	 * 	x$('.txt').setStyle('color', '#000');
	 *
	 */
	setStyle: function(prop, val) {
      this.each(function(el) {
        el.style[prop] = val;
      });
	  return this;
	},

	/**
	 *
	 * Retuns a single CSS property. Can also invoke a callback to perform more specific processing tasks related to the property value.
	 *
	 * @method
	 * @param {String} The property to retrieve.
	 * @param {Function} A callback function to invoke with the property value.
	 * @return {Element Collection}
	 * @example
	 *
	 * ### getStyle
	 *
	 * syntax:
	 *
	 * 	x$(selector).getStyle(property, callback);
	 *
	 * arguments:
	 *
	 * - property:string a css key (for example, border-color NOT borderColor)
	 * - callback:function (optional) a method to call on each element in the collection
	 *
	 * example:
	 *
	 *	x$('ul#nav li.trunk').getStyle('font-size');
	 *
	 * 	x$('a.globalnav').getStyle( 'background', function(prop){ prop == 'blue' ? 'green' : 'blue' });
	 *
	 */
	getStyle: function(prop, callback) {

		var gs = function (el,p) {
			return document.defaultView.getComputedStyle(el , "").getPropertyValue(p);
		};

		if(callback === undefined) {
			return gs(this.first(),prop);
		}

 		this.each( function(el) {
		  callback(gs(el,prop));
 		});
  	return this;
	},

	/**
	 *
	 * Adds the classname to all the elements in the collection.
	 *
	 * @method
	 * @param {String} The class name.
	 * @return {Element Collection}
	 * @example
	 *
	 * ### addClass
	 *
	 * syntax:
	 *
	 * 	$(selector).addClass(className);
	 *
	 * arguments:
	 *
	 * - className:string the name of the CSS class to apply
	 *
	 * example:
	 *
	 * 	$('.foo').addClass('awesome');
	 *
	 */
	addClass: function(className) {
		var that = this;
		var hasClass = function(el,className) {
		  var re = that.getClassRegEx(className);
		  return re.test(el.className);
		};

		this.each(function(el) {
			if (hasClass(el,className) === false) {
				el.className += ' ' + className;
			}
		});
		return this;
	},
	/**
	 *
	 * Checks to see if classname is one the element
	 *
	 * @method
	 * @param {String} The class name.
	 * @param {Function} A callback function (optional)
	 * @return {XUI Object - self} Chainable
	 * @example
	 *
	 * ### hasClass
	 *
	 * syntax:
	 *
	 * 	$(selector).hasClass('className');
	 * 	$(selector).hasClass('className', function(element) {});
	 *
	 * arguments:
	 *
	 * - className:string the name of the CSS class to apply
	 *
	 * example:
	 *
	 * 	$('#foo').hasClass('awesome'); // returns true or false
	 * 	$('.foo').hasClass('awesome',function(e){}); // returns XUI object
	 *
	 */
	hasClass: function(className, callback) {
        var that = this;

		if(callback === undefined && this.elements.length == 1) {
            var re = this.getClassRegEx(className);
            return re.test(that.first().className);
		}

 		this.each( function(el) {
            var re = that.getClassRegEx(className);
            if (re.test(el.className) == true) {
                callback(el);
            }
 		});

		return this;
	},

	/**
	 *
	 * Removes the classname from all the elements in the collection.
	 *
	 * @method
	 * @param {String} The class name.
	 * @return {Element Collection}
	 * @example
	 *
	 * ### removeClass
	 *
	 * syntax:
	 *
	 * 	x$(selector).removeClass(className);
	 *
	 * arguments:
	 *
	 * - className:string the name of the CSS class to remove.
	 *
	 * example:
	 *
	 * 	x$('.bar').removeClass('awesome');
	 *
	 */
	removeClass:function(className) {
		if (className === undefined) {
		   this.each(function(el) {
		      el.className = '';
		   });
		} else {
		   var re = this.getClassRegEx(className);
		   this.each(function(el) {
		      el.className = el.className.replace(re, ' ');
		   });
		}
	  return this;
	},


	/**
	 *
	 * Set a number of CSS properties at once.
	 *
	 * @method
	 * @param {Object} An object literal of CSS properties and corosponding values.
	 * @return {Element Collection}
	 * @example
	 *
	 * ### css
	 *
	 * syntax:
	 *
	 * 	x$(selector).css(object);
	 *
	 * arguments:
	 *
	 * - an object literal of css key/value pairs to set.
	 *
	 * example:
	 *
	 * 	x$('h2.fugly').css({ backgroundColor:'blue', color:'white', border:'2px solid red' });
	 *
	 */
	css: function(o) {
		var that = this;
		this.each(function(el) {
			for (var prop in o) {
				that.setStyle(prop, o[prop]);
			}
		});
		return this || that;
	},


	reClassNameCache: {},

	getClassRegEx: function(className) {
	    var re = this.reClassNameCache[className];
	    if (!re) {
	        re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
	        this.reClassNameCache[className] = re;
	    }
	    return re;
	}
};

libs.push(Style);
/**
 *
 * @namespace {Fx}
 * @example
 *
 * Fx
 * ---
 *
 * Animations, transforms and transitions for getting the most out of hardware accelerated CSS.
 *
 */
var Fx = {

	/**
	 *
	 * Tween is a method for transforming a css property to a new value.
	 *
	 * @method
	 * @param {Object} [Array|Object]
	 * @param {Function}
	 * @return {Element Collection}
	 * @example
	 *
	 * ### tween
	 *
	 * syntax:
	 *
	 * x$(selector).tween(obj, callback);
	 *
	 * arguments:
	 *
	 * - properties: object an object literal of element css properties to tween or an array containing object literals of css properties to tween sequentially.
	 * - callback (optional): function to run when the animation is complete
	 *
	 * example:
	 *
	 * 	x$('#box').tween({ left:100px, backgroundColor:'blue' });
	 * 	x$('#box').tween({ left:100px, backgroundColor:'blue' }, function() { alert('done!'); });
	 * 	x$('#box').tween([{ left:100px, backgroundColor:'green', duration:.2 }, { right:'100px' }]);
	 * 	x$('#box').tween({ left:100px}).tween({ left:'100px' });
	 *
	 */
	tween: function( options, opts ) {
		this.each(function(e){
			emile(e, options, opts);
		});
	    return this;
	}
};

libs.push(Fx);
/**
 *
 * @namespace {Xhr}
 * @example
 *
 *
 * Xhr
 * ---
 *
 * Remoting methods and utils.
 *
 */
var Xhr = {

	/**
	 *
	 * The classic Xml Http Request sometimes also known as the Greek God: Ajax. Not to be confused with AJAX the cleaning agent.
	 * This method has a few new tricks. It is always invoked on an element collection and follows the identical behaviour as the
	 * `html` method. If there no callback is defined the response text will be inserted into the elements in the collection.
	 *
	 * @method
	 * @param {location} [inner|outer|top|bottom|before|after]
	 * @param {String} The URL to request.
	 * @param {Object} The method options including a callback function to invoke when the request returns.
	 * @return {Element Collection}
	 * @example
	 *
	 * ### xhr

	 * syntax:
	 *
	 *    xhr(location, url, options)
	 *
	 * or this method will accept just a url with a default behavior of inner...
	 *
	 * 		xhr(url, options);
	 *
	 * location
	 *
	 * options:
	 *
	 * - method {String} [get|put|delete|post] Defaults to 'get'.
	 * - async {Boolen} Asynchronous request. Defaults to false.
	 * - data {String} A url encoded string of parameters to send.
	 * - callback {Function} Called on 200 status (success)
     *
     * response
     * - The response available to the callback function as 'this', it is not passed in.
     * - this.reponseText will have the resulting data from the file.
	 *
	 * example:
	 *
	 * 		x$('#status').xhr('inner', '/status.html');
	 * 		x$('#status').xhr('outer', '/status.html');
	 * 		x$('#status').xhr('top',   '/status.html');
	 * 		x$('#status').xhr('bottom','/status.html');
	 * 		x$('#status').xhr('before','/status.html');
	 * 		x$('#status').xhr('after', '/status.html');
	 *
	 * or
	 *
	 *    x$('#status').xhr('/status.html');
	 *
	 *	  x$('#left-panel').xhr('/panel', {callback:function(){ alert("All Done!") }});
	 *
	 *	  x$('#left-panel').xhr('/panel', function(){ alert(this.responseText) });
	 *
	 */

    xhr:function(location, url, options) {

        if (!/^inner|outer|top|bottom|before|after$/.test(location)) {
         	options = url;
         	url = location;
         	location = 'inner';
        }

        var o = options;

        if (typeof options == "function") {
            o = {};
            o.callback = options;
        }

        if (!options)
            o = {};


        if (this.first().tagName == "FORM") {
            o.callback  = url;
            url         = this.first().action;
            o.data      = this._toQueryString(this.first());
            o.method    = this.first().method;
        }

        var that   = this;
        var req    = new XMLHttpRequest();
        var method = o.method || 'get';
        var async  = o.async || false;
        var params = o.data || null;
        req.queryString = params;

        if (o.headers) {
            for (var i=0; i<o.headers.length; i++) {
              req.setRequestHeader(o.headers[i].name, o.headers[i].value);
            }
        }

        req.open(method,url,async);
        req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        req.onload = (o.callback != null) ? o.callback : function() { that.html(location, this.responseText); };
        req.send(params);

    	return this;
    }
};

libs.push(Xhr);

	for (var i = 0, size = libs.length; i < size; i++) {
	  xui.extend( libs[i] );
  	}

	window.x$ = function() {
		return new xui(arguments);
	};
})();


(function(emile, container){
  var parseEl = document.createElement('div'),
    props = ('backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth '+
    'borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize '+
    'fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight '+
    'maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft '+
    'paddingRight paddingTop right textIndent top width wordSpacing zIndex').split(' ');

  function interpolate(source,target,pos){ return (source+(target-source)*pos).toFixed(3); }
  function s(str, p, c){ return str.substr(p,c||1); }
  function color(source,target,pos){
    var i = 2, j, c, tmp, v = [], r = [];
    while(j=3,c=arguments[i-1],i--)
      if(s(c,0)=='r') { c = c.match(/\d+/g); while(j--) v.push(~~c[j]); } else {
        if(c.length==4) c='#'+s(c,1)+s(c,1)+s(c,2)+s(c,2)+s(c,3)+s(c,3);
        while(j--) v.push(parseInt(s(c,1+j*2,2), 16)); }
    while(j--) { tmp = ~~(v[j+3]+(v[j]-v[j+3])*pos); r.push(tmp<0?0:tmp>255?255:tmp); }
    return 'rgb('+r.join(',')+')';
  }

  function parse(prop){
    var p = parseFloat(prop), q = prop.replace(/^[\-\d\.]+/,'');
    return isNaN(p) ? { v: q, f: color, u: ''} : { v: p, f: interpolate, u: q };
  }

  function normalize(style){
    var css, rules = {}, i = props.length, v;
    parseEl.innerHTML = '<div style="'+style+'"></div>';
    css = parseEl.childNodes[0].style;
    while(i--) if(v = css[props[i]]) rules[props[i]] = parse(v);
    return rules;
  }

  container[emile] = function(el, style, opts){
    el = typeof el == 'string' ? document.getElementById(el) : el;
    opts = opts || {};
    var target = normalize(style), comp = el.currentStyle ? el.currentStyle : getComputedStyle(el, null),
      prop, current = {}, start = +new Date, dur = opts.duration||200, finish = start+dur, interval,
      easing = opts.easing || function(pos){ return (-Math.cos(pos*Math.PI)/2) + 0.5; };
    for(prop in target) current[prop] = parse(comp[prop]);
    interval = setInterval(function(){
      var time = +new Date, pos = time>finish ? 1 : (time-start)/dur;
      for(prop in target)
        el.style[prop] = target[prop].f(current[prop].v,target[prop].v,easing(pos)) + target[prop].u;
      if(time>finish) { clearInterval(interval); opts.after && opts.after(); }
    },10);
  }
})('emile', this);
/**
 * Array indexOf - from MooTools (MIT Licensed)
 */
Array.prototype.indexOf = function(item, from){
	var len = this.length;
	for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
		if (this[i] === item) return i;
	}
	return -1;
}

/* LICENSE
* ---
*
* _Copyright (c) 2008 Brian LeRoux, Brock Whitten, Rob Ellis_
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
* CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
