/**
 * @license 
 * Copyright (c) 2018, Immo Schulz-Gerlach, www.isg-software.de 
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are 
 * permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT 
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED 
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 * WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function($){
	"use strict";
	
	/**
	 * The function $.fn.appendFoldingArrowIcon.copyOfPreset 
	 * (alias $.fn.appreendFoldingArrowIcon.copyOfPreset) returns an instance of this class.
	 * Use the methods of this class to modify the copied preset.
	 * Then you may directly use the modified instance as argument for the 'preset' option of
	 * the included jQuery plug-in functions (instead of a preset name string literal).
	 */
	class PresetCopy {
		constructor(presetName) {
			this.preset = $.extend({}, $.fn.prependFoldingArrowIcon.PRESETS[presetName]);
			//While $.extend creates a copy of the preset object, the copied object's
			//graph property still references the same graph array. 
			//In order for the append|prpendToGraph methods to work as intended and
			//not to modify the original preset's graph, we'll now explicitly copy
			//the graph array:
//			this.preset.graph = this.preset.graph.slice();
			if (Array.isArray(this.preset.graph)) {
				this.preset.graph = this.preset.graph.slice();
			}
		}
		
		/**
		 * Prepends a new SVG node definition to the preset's graph array.
		 * Arguments:
		 * elementName (string): Name of the SVG element to be created
		 * attributes (object): Object (set of key-value-pairs) defining the attributes
		 * for the inserted element: Each key defines an attribute name and its
		 * value is to be a string defining the attribute value.
		 * Return value: this (enables chained method calls).
		 */
		prependToGraph(elementName, attributes) {
			this.preset.graph.unshift({element: elementName, attributes: attributes});
			return this;
		}
		
		/**
		 * Just like prependToGraph, only is the new node definition appended
		 * to the preset's graph array.
		 */
		appendToGraph(elementName, attributes) {
			this.preset.graph.push({element: elementName, attributes: attributes});
			return this;
		}
		
		/**
		 * Sets or gets a property of the preset.
		 * prop(propertyName) returns the current value of the property (if defined).
		 * prop(propertyName, propertyValue) sets the property to a new value and
		 * simply returns this (the PresetCopy instance) in order to allow chained
		 * method calls.
		 */
		prop(propertyName, propertyValue) {
			if (typeof propertyValue === "undefined") {
				return this.preset[propertyName];
			} else {
				this.preset[propertyName] = propertyValue;
				return this;
			}
		}
	}
	
	function expandOptions(options, defaults) {
		let opts = $.extend({}, defaults, options);
		if (typeof opts.preset === "string") {
			const preset = $.fn.prependFoldingArrowIcon.PRESETS[opts.preset];
			if (typeof preset === "object") {
				//First merge preset into opts, then re-merge user's options into that 
				//since these options may override individual preset options.
				$.extend(opts, preset, options);
			}
		} else if (opts.preset instanceof PresetCopy) {
			$.extend(opts, opts.preset.preset, options)
		}
		return opts;
	}
	
	function classSelector(classnames) {
		const classes = classnames.split(" ");
		let out = "";
		for (let i=0, l=classes.length; i < l; i++) {
			out += "." + classes[i];
		}
		return out;
	}
	
	const NS = "http://www.w3.org/2000/svg";
		
	function createSVG(opts) {
		const svg = document.createElementNS(NS, "svg");
		const topleft = -opts.viewboxRadius - opts.viewboxMargin;
		const widthheight = 2 * (opts.viewboxRadius + opts.viewboxMargin);
		svg.setAttribute("viewBox", topleft + " " + topleft + " " + widthheight + " " + widthheight);
		svg.setAttribute("class", opts.svgClass);
		return svg;
	}
	
	function addGraph(svg, opts) {
		const g = document.createElementNS(NS, "g");
		svg.appendChild(g);
		//for (let el of opts.graph) { //Babel mit Standardeinstellungen generiert aus "for of" einen nicht IE-kompatiblen Code, also vermeiden!
		for (let i=0, l=opts.graph.length; i < l; i++) {
			let el = opts.graph[i];
			const node = document.createElementNS(NS, el.element);
			for (let key in el.attributes) {
				node.setAttribute(key, el.attributes[key] + (opts.closePath && el.element === "path" ? "z" : ""));
			}
			g.appendChild(node);
		}
	}
	
	function trimFirstChild() {
		const child = this.firstChild;
		if (child && child.nodeType === 3) {
			const text = child.textContent;
			const r = text.replace(/^\s+/g, "");
			if (r !== text)
				child.textContent = r;
		}
	}
	
	function trimLastChild() {
		const child = this.lastChild;
		if (child && child.nodeType === 3) {
			const text = child.textContent;
			const r = text.replace(/\s+$/g, "");
			if (r !== text)
				child.textContent = r;
		}
	}
	
	/**
	 * jQuery plug-in function which inserts a new SVG icon into every node of the
	 * jQuery result-set to which it is applied.
	 * The icon gets prepended to the exiting node's content, followed by a separator string
	 * (defaulting to an ensp, i.e a space of exactly 0.5em width).
	 * If called without argument, the default options are applied. 
	 * To use custom options, pass one argument of type object which defines exactly
	 * those options you want to override. Any option left undefined in your argument
	 * will still remain on their default values.
	 * See: $.fn.prependFoldingArrowIcon.DEFAULTS
	 */
	$.fn.prependFoldingArrowIcon = function(options) {
		const opts = expandOptions(options, $.fn.prependFoldingArrowIcon.DEFAULTS);
		const svg = createSVG(opts);
		addGraph(svg, opts);
		this.each(trimFirstChild)
			.prepend(svg, opts.separator)
			.addClass(opts.containerClass);
		return this;
	};
	
	/**
	 * jQuery plug-in function which inserts a new SVG icon into every node of the
	 * jQuery result-set to which it is applied.
	 * The icon gets appended to the exiting node's content, preceded by a separator string
	 * (defaulting to an ensp, i.e a space of exactly 0.5em width).
	 * Otherwise the same as $.fn.prependFoldingArrowIcon.
	 * See: $.fn.appendFoldingArrowIcon.DEFAULTS
	 */
	$.fn.appendFoldingArrowIcon = function(options) {
		const opts = expandOptions(options, $.fn.prependFoldingArrowIcon.DEFAULTS);
		const svg = createSVG(opts);
		addGraph(svg, opts);
		this.each(trimLastChild)
			.append(opts.separator, svg)
			.addClass(opts.containerClass);
		return this;
	};
	
	const setupDataName = "foldingArrowIconTransformationSetup";
	
	function findSVG(me, opts) {
		return $("svg" + classSelector(opts.svgClass), me).first();
	}
	
	function setTitle(me, opts, optSVG) {
		if (opts.titleShowing || opts.titleHidden) {
			let svg = optSVG;
			if (typeof svg === "undefined") 
				svg = findSVG(me, opts);
			let titleElement = $("> title", svg);
			const t = me.is(opts.ifIsSelector) ? opts.titleShowing : opts.titleHidden;
			if (typeof t === "string") {
				if (!titleElement.length) {
					const n = document.createElementNS(NS, "title");
					svg.prepend(n);
					titleElement = $(n);
				}
				titleElement.text(t);
			} else {
				titleElement.text("");
			}
		}		
	}
	
	/**
	 * jQuery plug-in function. 
	 * Just like $.fn.prependFoldingArrowIcon and $.fn.appendFoldingArrowIcon this function
	 * is to be called just once. It defines and saves the options for
	 * $.fn.transformFoldingArrowIcon.
	 * If you don't want to use the latter plug-in function (needed for Internet Explorer and Edge)
	 * or if you are fine with the default transformation options and don't need to create
	 * a custom setup, you don't need to use this function.
	 * But if you want to modify the default behaviour of that plug-in function,
	 * you have to call this plug-in once before.
	 * The only argument is an object defining those options you want to override,
	 * see: $.fn.transformFoldingArrowIcon.DEFAULTS
	 * The jQuery resultset on which this plug-in gets applied should be exactly the same
	 * as the one you called $.fn.prependFoldingArrowIcon on, i.e. the set of nodes
	 * to which a folding-arrow icon has been added.
	 */
	$.fn.setupFoldingArrowIconTransformation = function(options) {
		const opts = expandOptions(options, $.fn.transformFoldingArrowIcon.DEFAULTS);
		this.each(function() {
			const current = $(this).data(setupDataName);
			//If no previous setup has been stored yes (current == null, normal case), 
			//the opts object is stored as setup (shared for any target without existing setup).
			//If a current setup exists, modify that. But do *not* simply extend the current
			//setup object, but create a new instance. Reason: The original "current"
			//might be an object shared (referenced) by several icons (see normal case above), 
			//and the update might affect only a subset of nodes! Modification of a shared 
			//object might cause side effects (influence the setup of nodes not selected
			//by the calling query).
			const update = typeof current === "object" ? $.extend({}, current, options) : opts;
			const me = $(this).data(setupDataName, update);
			//If the setup defines title attributes, apply initial title now instead of waiting
			//for the first call of transformFoldingArrowIcon:
			setTitle(me, opts);
		});
		return this;
	}
	
	/**
	 * jQuery plug-in function to be called for a node already fitted with a folding-arrow
	 * inline SVG icon. For every node of the resultset, this function first looks
	 * for state information by applying a state-check-selector.
	 * This is defined by the option 'ifIsSelector' and defaults to ".showing". 
	 * If this selector matches a node of the result-set, a transition will be added
	 * to that node's Icon (which has to be a direct child node of type SVG with
	 * a certain class name, defaulting to 'folding-arrow-icon' - you may change that
	 * via the option 'svgClass', but if you do, be sure to set the same option in the
	 * prependFoldingArrowIcon() call as well as in setupFoldingArrowIconTransformation()).
	 * If the selector doesn't match, an existing transformation will be removed again.
	 *
	 * This function is needed for compatibility with browsers like Microsoft Edge and
	 * Internet Explorer, which don't support CSS transformations for inine SVG, but
	 * require a transformation attribute in the SVG's DOM.
	 * Note that if you specify transitions via this function _and_ via CSS, a browser
	 * supporting CSS transformations will prefer the latter and ignore the attributes
	 * inserted by this plug-in. So this is really just a fallback application.
	 *
	 * Also, independently of the browser, this function may optionally add a title
	 * to the SVG image which depends on the state. (A title may be displayed by the
	 * browser whenever the mouse cursor hovers over the image.) 
	 * So, for example, you might define a title like "show more…" for the icon of
	 * a collapsed list and "close" of the icon of an unfolded section.
	 * You may also only define a title for one of the two states.
	 * The title(s) to apply have to be defined via the 
	 * setupFoldingArrowIconTransformation() plug-in function.
	 */
	$.fn.transformFoldingArrowIcon = function() {
		const defaults = $.fn.transformFoldingArrowIcon.DEFAULTS;
		this.each(function() {
			const me = $(this);
			let opts = me.data(setupDataName);
			if (typeof opts !== "object") {
				opts = defaults;
			}
			const svg = findSVG(me, opts);
			setTitle(me, opts, svg); //Passing svg as third parameter prohibits redundant selection in the procedure
			for (let i=0, l=opts.transformations.length; i < l; i++) {
				let transformation = opts.transformations[i];
				for (let selector in transformation) {
					const g = $(selector, svg);
					if (me.is(opts.ifIsSelector)) {
						g.attr("transform", transformation[selector]);
					} else {
						g.removeAttr("transform");
					}
				}
			}
		});
		return this;
	}
	
	$.fn.appendFoldingArrowIcon.PRESETS =
	$.fn.prependFoldingArrowIcon.PRESETS = {
		//Default Preset for right-pointing triangle and 90 degrees rotation transformation.
		"arrow-right": {	
			graph: [{element: "path", attributes: {"d": "M-3,-5 L5,0 L-3,5"}}],
			closePath: true
		},
		//Default Preset for up-pointing triangle when closed and vertical flip transformation.
		"arrow-up-down": {
			graph: [{element: "path", attributes: {"d": "M-5,-3 L0,5 L5,-3"}}],
			closePath: true,
			svgClass: "folding-arrow-icon updown",
			transformations: [{">g": "scale(1 -1)"}]
		},
		//Preset for showing a plus icon with a 45 degree transformation (resulting in an X icon for unfolded content)
		"plus": {
			graph: [{element: "line", attributes: {"x1": "-10", "y1": "0", "x2": "10", "y2":"0", "class": "h"}},
					{element: "line", attributes: {"x1": "0", "y1": "-10", "x2": "0", "y2":"10", "class": "v"}}],
			svgClass: "folding-arrow-icon plus",
			viewboxRadius: 10,
			viewboxMargin: 1,
			transformations: [{">g": "rotate(45)"}]
		},
		//Preset for a burger icon (three stacked horizontal lines) with a transformation to form an X icon when unfolded
		"burger": {
			containerClass: "burger",
			svgClass: "burger-icon",
			viewboxRadius: 15,
			viewboxMargin: 3,
			graph: [{element: "line", attributes: {"x1": "-15", "y1": "-10", "x2": "15", "y2": "-10", "class": "topline"}},
					{element: "line", attributes: {"x1": "-15", "y1": "0", "x2": "15", "y2": "0", "class": "midline"}},
					{element: "line", attributes: {"x1": "-15", "y1": "10", "x2": "15", "y2": "10", "class": "bottomline"}}],
			transformations: [
				{"line.topline": "translate(0,10)"},
				{"line.bottomline": "translate(0,-10)"},
				{"line.midline": "rotate(90)"},
				{"g": "rotate(45)"}
			]
		},
		//Preset for a simple dash icon without transformation, meant as bullet for 
		//static list items in a list also containing foldable list entries.
		"dash": {
			graph: [{element: "line", attributes: {"x1": "-3", "x2": "5", "y1": "0", "y2": "0"}}],
			svgClass: "folding-arrow-icon static dash"
		},
		//Preset for a simple disc (circle) icon without transformation, meant as alternative bullet for 
		//static list items in a list also containing foldable list entries.
		"disc": {
			graph: [{element: "circle", attributes: {"cx": "0", "cy": "0", "r": "3"}}],
			svgClass: "folding-arrow-icon static disc"
		}
	}
	//Preset for a plus icon which gets transformed into a minus icon when unfolded.
	//(Derived from the "plus"-preset.)
	$.fn.prependFoldingArrowIcon.PRESETS["plus-minus"] = copyOfPreset("plus")
		.prop("svgClass", "folding-arrow-icon plus-minus") //must differ from "plus" class in order to be able to assign different transformation & transition via CSS!
		.prop("transformations", [{"line.v": "scale(1 0)"}])
		.preset;

	function copyOfPreset(defaultName) {
		return new PresetCopy(defaultName);
	}
	/**
	 * JavaScript function (not a jQuery plug-in function!, but only defined as a property of
	 * the plug-in functions in order not to pollute the global namespace) in order to create
	 * a copy of a built-in preset which may the be altered in order to create a new, derived
	 * preset.
	 * Argument: Name of the preset to copy.
	 * Result: Object of class PresetCopy (see above).
	 */
	$.fn.appendFoldingArrowIcon.copyOfPreset =
	$.fn.prependFoldingArrowIcon.copyOfPreset = copyOfPreset;
	
	/**
	 * Default options for the plug-in functions appendFoldingArrowIcon and 
	 * prependFoldingArrowIcon.
	 * Some of these options also apply to setupFoldingArrowIconTransformation.
	 * You may globally alter these defaults or override individual options via
	 * the argument of the aforementioned plug-in functions.
	 */
	$.fn.appendFoldingArrowIcon.DEFAULTS =
	$.fn.prependFoldingArrowIcon.DEFAULTS = $.extend({}, {
		/**
		 * Option svgClass: The generated inline SVG element will be equipped
		 * with a class attribute, and this option defines its value.
		 * This class can be used to select the SVG icons, which is especially
		 * needed for applying CSS styles.
		 */
		svgClass: "folding-arrow-icon",
		/**
		 * Option containerClass: This class name will be added to the class attribute
		 * of the container element (parent element of the inserted SVG node), 
		 * i.e. any element of the jquery resultset on which the 
		 * append-/prependFoldingArrowIcon() plug-in has been applied. 
		 * When used in unordered lists, the containers are the <li> elements.
		 * This class can also be used for CSS formatting, especially in combination
		 * with the 'showing' class defining the state toggle, see included CSS file:
		 */
		containerClass: "folding-arrow",
		/**
		 * Option separator: This string is inserted between the SVG icon and the
		 * container node's original content. So, when you call prependFoldingArrowIcon,
		 * the SVG followed by this separator string are prepended to the node's content,
		 * when you call appendFoldingArrowIcon, the separator string followed by the
		 * SVG icon are appended to the node's content.
		 * The default separator is an ensp, i.e. a space character of exactly
		 * 1en = 0.5em width. The included default stylesheet for unordererd lists 
		 * relies on this width!
		 */
		separator: "&ensp;",
		/**
		 * Options viewboxRadius and viewboxMargin: 
		 * The generated SVG will be equipped with a viewBox attribut which defines a
		 * the visible square region of the SVG's coordinate system centered around the 
		 * point (0, 0).
		 * Let r be the sum of both options: r := viewboxRadius + viewboxMargin.
		 * Then the CSS will have the following viewBox: "-r -r 2*r 2*r".
		 * The individual values are not used by the plug-in, only the sum of both is
		 * evaluated. The only reason why there are _two_ options is for better
		 * readability: The use of these two values is intended as follows:
		 * viewboxRadius should describe half the width and height of the actual icon,
		 * such that any coordinate used to describe the graph (i.e. point of a path, 
		 * edge of a polygon, endpoint of a line etc.) should be contained in the square
		 * (-viewboxRadius, -viewboxRadius) / (viewboxRadius, viewboxRadius).
		 * The option viewboxMargin can then be used to define the width of a margin 
		 * around the actual icon. A margin may be essential, if you don't just create
		 * a filled graph without stroke, but if you have a stroke greater than zero:
		 * If graph points touch the edge of the viewboxRadius square, the stroke will
		 * then extend into the margin and would be clipped without one.
		 * Also, during rotation transitions the transition paths of some of the 
		 * graph's points may easily leave the main graph region defined by the 
		 * viewboxRadius.
		 * The default values define a 10-by-10-pixel area for the graph and a 1px margin
		 * around that. Whenever you use the graph option to define your own graph and
		 * you don't want to describe your graph with coordinate of this 10x10 area,
		 * you have to override the viewboxRadius option accordingly to your graph's area.
		 * The viewboxMargin option should be increased if you plan to use larger
		 * stroke-width values in CSS.
		 */
		viewboxRadius: 5,
		viewboxMargin: 1,
		/**
		 * Option graph: Defines the actual graph. (The default graph is not initialized
		 * at this place, but is copied from the preset "arrow-right".)
		 * A graph has to be an array of node definitions.
		 * A node definition (element of the graph array) is an object with two properties
		 * 'element' and 'attributes':
		 * Property 'element' has to be a string defining an SVG element name (e.g. "line",
		 * "circle" or "path").
		 * Property 'attributes' has to be an object of key-value-pairs of type string
		 * defining the attributes of the SVG element.
		 * Example:
		 * `graph: [{element: "circle", attributes: {"cx": "0", "cy": "0", "r": "3"}}]`
		 * defines a graph consisting of just one SVG element, namely a circle around the
		 * point (0,0), which is the center of the viewBox, and with a radius of 3.
		 */
		graph: undefined,
		/**
		 * Option closePath:
		 * If the graph option contains at least one `path` element which is not yet closed,
		 * i.e. its start point and its end point differ, then this option defines whether
		 * a "z" is appended to the path (which is a flag defining the path should be
		 * closed by a line connecting start and end point).
		 * The default graph is actually not a closed triangle, but a path shaped like
		 * a grater than sign. Thus, while you use the default graph, and if you draw
		 * a stroke (via CSS) this option controls whether that stroke is a closed triangle
		 * or "just a chevron".
		 * If the graph does not contain any unclosed path element, the option has no
		 * effect.
		 */
		closePath: true,
		/**
		 * Option preset:
		 * If you don't specify the graph neither the preset option, a default graph
		 * (right-pointing triangle) will be used. You may override that by specifying
		 * the graph option and thus defining your own graph.
		 * But you may also simply load alternative graphs in the form of so-called
		 * presets. A preset is simply a bundle of options which can be loaded all at
		 * once by setting this 'preset' option. You may load the included presets as
		 * well as create and use your own onces.
		 * The value of this option has to be either...
		 * - a string: the name of a preset or...
		 * - an instance of class PresetCopy, obtained by calling the function
		 *   $.fn.prependFoldingArrowIcon.copyOfPreset(presetName) and modifying
		 *   that copy via its instance methods.
		 *   (For an example, see demo page, section "Combine preset with circle").
		 */
		preset: undefined
	}, $.fn.prependFoldingArrowIcon.PRESETS["arrow-right"]);
	
	
	/**
	 * Default options for the plug-in function transformFoldingArrowIcon.
	 * If you want to override these options, use the jQuery plug-in function
	 * setupFoldingArrowIconTransformation() with an object enumarating the options
	 * you want to override. This setup has to be called just once, and the
	 * transformFoldingArrowIcon() function will then always use this setup.
	 */
	$.fn.transformFoldingArrowIcon.DEFAULTS = $.extend({
		/**
		 * Option ifIsSelector: 
		 * The transformFoldingArrowIcon function will add or remove a transition to
		 * the selected nodes, depending on their state. This state is determined by
		 * `jqr.is(opts.ifIsSelector)`: If the node matches the jQuery selector defined
		 * by this string, the transformation is added, otherwise it's removed.
		 * This is also used to switch titles, if defined.
		 */
		ifIsSelector: ".showing",
		/**
		 * Option transformations: Defines the transformation(s) the plug-in function
		 * transformFoldingArrowIcon should apply to (or remove from) the SVG.
		 * The value of this option has to be an array of single transformations.
		 * A single transformation (element of that array) has to be an object of 
		 * key-value-pairs of type string. Each key is to be a selector and its value
		 * a transformation rule.
		 * The default is: [{"> g": "rotate(90)"}], which means:
		 * A single transformation will be added to the SVG, more specifically 
		 * a transformation attribute will be added to the SVG's child node of type
		 * `g`(SVG group), and the content of that attribute will be "rotate(90)".
		 * To understand that, it's important to know that all graph elements defined
		 * by the `graph` option (see above) will be grouped by a single `g` element,
		 * this this transformation rule means: Rotate the whole graph by 90 degrees.
		 * Of course you may also define transitions for individual child nodes of that
		 * group, see presets "burger" or "plus-minus".
		 */
		transformations: [
			{
				"> g": "rotate(90)"
			}
		],
		/**
		 * Option titleShowing: Defines a title to be added to the graph when the
		 * ifIsSelector is matching (unfolded state). That title may be displayed by
		 * the browser whenever the mouse cursor hovers over the icon.
		 */
		titleShowing: undefined,
		/**
		 * Option titleHidden: Defines a title to be added to the graph when the
		 * ifIsSelector is not matching.
		 */
		titleHidden: undefined
	}, $.fn.prependFoldingArrowIcon.DEFAULTS);
	
})(jQuery);