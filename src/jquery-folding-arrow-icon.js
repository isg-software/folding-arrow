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
	
	class PresetCopy {
		constructor(presetName) {
			this.preset = $.extend({}, $.fn.prependFoldingArrowIcon.PRESETS[presetName]);
		}
		
		prependToGraph(elementName, attributes) {
			this.preset.graph.unshift({element: elementName, attributes: attributes});
			return this;
		}
		
		appendToGraph(elementName, attributes) {
			this.preset.graph.push({element: elementName, attributes: attributes});
			return this;
		}
		
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
	
	$.fn.prependFoldingArrowIcon = function(options) {
		const opts = expandOptions(options, $.fn.prependFoldingArrowIcon.DEFAULTS);
		const svg = createSVG(opts);
		addGraph(svg, opts);
		this.each(trimFirstChild)
			.prepend(svg, opts.separator)
			.addClass(opts.containerClass);
		return this;
	};
	
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
			$(this).data(setupDataName, update);
		});
		return this;
	}
	
	$.fn.transformFoldingArrowIcon = function() {
		const defaults = $.fn.transformFoldingArrowIcon.DEFAULTS;
		this.each(function() {
			const me = $(this);
			let opts = me.data(setupDataName);
			if (typeof opts !== "object") {
				opts = defaults;
			}
			for (let i=0, l=opts.transformations.length; i < l; i++) {
				let transformation = opts.transformations[i];
				for (let selector in transformation) {
					const g = $("> svg" + classSelector(opts.svgClass) + " " + selector, me);
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
		"arrow-right": {	
			graph: [{element: "path", attributes: {"d": "M-3,-5 L5,0 L-3,5"}}],
			closePath: true
		},
		"arrow-up-down": {
			graph: [{element: "path", attributes: {"d": "M-5,-3 L0,5 L5,-3"}}],
			closePath: true,
			svgClass: "folding-arrow-icon updown",
			transformations: [{">g": "scale(1 -1)"}]
		},
		"plus": {
			graph: [{element: "line", attributes: {"x1": "-10", "y1": "0", "x2": "10", "y2":"0", "class": "h"}},
					{element: "line", attributes: {"x1": "0", "y1": "-10", "x2": "0", "y2":"10", "class": "v"}}],
			svgClass: "folding-arrow-icon plus",
			viewboxRadius: 10,
			viewboxMargin: 1,
			transformations: [{">g": "rotate(45)"}]
		},
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
		}
	}
	$.fn.prependFoldingArrowIcon.PRESETS["plusminus"] = copyOfPreset("plus")
		.prop("svgClass", "folding-arrow-icon plusminus")
		.prop("transformations", [{"line.v": "scale(1 0)"}])
		.preset;

	function copyOfPreset(defaultName) {
		return new PresetCopy(defaultName);
	}
	$.fn.appendFoldingArrowIcon.copyOfPreset =
	$.fn.prependFoldingArrowIcon.copyOfPreset = copyOfPreset;
	
	$.fn.appendFoldingArrowIcon.DEFAULTS =
	$.fn.prependFoldingArrowIcon.DEFAULTS = $.extend({}, {
		svgClass: "folding-arrow-icon",
		containerClass: "folding-arrow",
		separator: "&ensp;",
		viewboxRadius: 5,
		viewboxMargin: 1,
		closePath: false,
		preset: undefined
	}, $.fn.prependFoldingArrowIcon.PRESETS["arrow-right"]);
	
	
	
	$.fn.transformFoldingArrowIcon.DEFAULTS = $.extend({
		ifIsSelector: ".showing",
		transformations: [
			{
				"> g": "rotate(90)"
			}
		]
	}, $.fn.prependFoldingArrowIcon.DEFAULTS);
	
})(jQuery);