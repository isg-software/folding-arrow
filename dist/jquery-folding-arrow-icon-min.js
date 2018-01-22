"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();/**
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
!function($){function e(e,t){var n=$.extend({},t,e);if("string"==typeof n.preset){var r=$.fn.prependFoldingArrowIcon.PRESETS[n.preset];"object"===(void 0===r?"undefined":_typeof(r))&&$.extend(n,r,e)}else n.preset instanceof p&&$.extend(n,n.preset.preset,e);return n}function t(e){for(var t=e.split(" "),n="",r=0,o=t.length;r<o;r++)n+="."+t[r];return n}function n(e){var t=document.createElementNS(c,"svg"),n=-e.viewboxRadius-e.viewboxMargin,r=2*(e.viewboxRadius+e.viewboxMargin);return t.setAttribute("viewBox",n+" "+n+" "+r+" "+r),t.setAttribute("class",e.svgClass),t}function r(e,t){var n=document.createElementNS(c,"g");e.appendChild(n);for(var r=0,o=t.graph.length;r<o;r++){var i=t.graph[r],a=document.createElementNS(c,i.element);for(var s in i.attributes)a.setAttribute(s,i.attributes[s]+(t.closePath&&"path"===i.element?"z":""));n.appendChild(a)}}function o(){var e=this.firstChild;if(e&&3===e.nodeType){var t=e.textContent,n=t.replace(/^\s+/g,"");n!==t&&(e.textContent=n)}}function i(){var e=this.lastChild;if(e&&3===e.nodeType){var t=e.textContent,n=t.replace(/\s+$/g,"");n!==t&&(e.textContent=n)}}function a(e,n){return $("> svg"+t(n.svgClass),e)}function s(e,t,n){if(t.titleShowing||t.titleHidden){var r=n;void 0===r&&(r=a(e,t));var o=$("> title",r),i=e.is(t.ifIsSelector)?t.titleShowing:t.titleHidden;if("string"==typeof i){if(!o.length){var s=document.createElementNS(c,"title");r.prepend(s),o=$(s)}o.text(i)}else o.text("")}}function l(e){return new p(e)}var p=function(){function e(t){_classCallCheck(this,e),this.preset=$.extend({},$.fn.prependFoldingArrowIcon.PRESETS[t]),Array.isArray(this.preset.graph)&&(this.preset.graph=this.preset.graph.slice())}return _createClass(e,[{key:"prependToGraph",value:function e(t,n){return this.preset.graph.unshift({element:t,attributes:n}),this}},{key:"appendToGraph",value:function e(t,n){return this.preset.graph.push({element:t,attributes:n}),this}},{key:"prop",value:function e(t,n){return void 0===n?this.preset[t]:(this.preset[t]=n,this)}}]),e}(),c="http://www.w3.org/2000/svg";$.fn.prependFoldingArrowIcon=function(t){var i=e(t,$.fn.prependFoldingArrowIcon.DEFAULTS),a=n(i);return r(a,i),this.each(o).prepend(a,i.separator).addClass(i.containerClass),this},$.fn.appendFoldingArrowIcon=function(t){var o=e(t,$.fn.prependFoldingArrowIcon.DEFAULTS),a=n(o);return r(a,o),this.each(i).append(o.separator,a).addClass(o.containerClass),this};var f="foldingArrowIconTransformationSetup";$.fn.setupFoldingArrowIconTransformation=function(t){var n=e(t,$.fn.transformFoldingArrowIcon.DEFAULTS);return this.each(function(){var e=$(this).data(f),r="object"===(void 0===e?"undefined":_typeof(e))?$.extend({},e,t):n;s($(this).data(f,r),n)}),this},$.fn.transformFoldingArrowIcon=function(){var e=$.fn.transformFoldingArrowIcon.DEFAULTS;return this.each(function(){var t=$(this),n=t.data(f);"object"!==(void 0===n?"undefined":_typeof(n))&&(n=e);var r=a(t,n);s(t,n,r);for(var o=0,i=n.transformations.length;o<i;o++){var l=n.transformations[o];for(var p in l){var c=$(p,r);t.is(n.ifIsSelector)?c.attr("transform",l[p]):c.removeAttr("transform")}}}),this},$.fn.appendFoldingArrowIcon.PRESETS=$.fn.prependFoldingArrowIcon.PRESETS={"arrow-right":{graph:[{element:"path",attributes:{d:"M-3,-5 L5,0 L-3,5"}}],closePath:!0},"arrow-up-down":{graph:[{element:"path",attributes:{d:"M-5,-3 L0,5 L5,-3"}}],closePath:!0,svgClass:"folding-arrow-icon updown",transformations:[{">g":"scale(1 -1)"}]},plus:{graph:[{element:"line",attributes:{x1:"-10",y1:"0",x2:"10",y2:"0",class:"h"}},{element:"line",attributes:{x1:"0",y1:"-10",x2:"0",y2:"10",class:"v"}}],svgClass:"folding-arrow-icon plus",viewboxRadius:10,viewboxMargin:1,transformations:[{">g":"rotate(45)"}]},burger:{containerClass:"burger",svgClass:"burger-icon",viewboxRadius:15,viewboxMargin:3,graph:[{element:"line",attributes:{x1:"-15",y1:"-10",x2:"15",y2:"-10",class:"topline"}},{element:"line",attributes:{x1:"-15",y1:"0",x2:"15",y2:"0",class:"midline"}},{element:"line",attributes:{x1:"-15",y1:"10",x2:"15",y2:"10",class:"bottomline"}}],transformations:[{"line.topline":"translate(0,10)"},{"line.bottomline":"translate(0,-10)"},{"line.midline":"rotate(90)"},{g:"rotate(45)"}]}},$.fn.prependFoldingArrowIcon.PRESETS["plus-minus"]=l("plus").prop("svgClass","folding-arrow-icon plus-minus").prop("transformations",[{"line.v":"scale(1 0)"}]).preset,$.fn.appendFoldingArrowIcon.copyOfPreset=$.fn.prependFoldingArrowIcon.copyOfPreset=l,$.fn.appendFoldingArrowIcon.DEFAULTS=$.fn.prependFoldingArrowIcon.DEFAULTS=$.extend({},{svgClass:"folding-arrow-icon",containerClass:"folding-arrow",separator:"&ensp;",viewboxRadius:5,viewboxMargin:1,closePath:!0,preset:void 0},$.fn.prependFoldingArrowIcon.PRESETS["arrow-right"]),$.fn.transformFoldingArrowIcon.DEFAULTS=$.extend({ifIsSelector:".showing",transformations:[{"> g":"rotate(90)"}],titleShowing:void 0,titleHidden:void 0},$.fn.prependFoldingArrowIcon.DEFAULTS)}(jQuery);