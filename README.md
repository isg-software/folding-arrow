# folding-arrow

jQuery plug-in for inserting arrow icons for foldable list items, sections, burger menu icons etc. as inline SVG with CSS support. This especially includes the possibility of state transformations animated by CSS transitions.

## Motivation

Have a look at the demo page, and you'll most certainly recognize the demonstrated icons, like triangle icons used to indicate whether a (sub)section is visible or collapsed/folded. One of the most common uses of such icons is in hierarchical lists to show list items with sub-lists and the state of the latter's visibility. For a collapsed sublist, the icon is usually an arrow to the right, whereas the arrow points down if the sublist's unfolded.

Since the actual look of the icon is not the major content of the HTML document, but simply a presentation style, a common way to achieve this is to simply add a class to the foldable list item which represents the logical state (open/visible or closed/collapsed/folded). The icon itself (being presentation) could simply be added by CSS, e.g. with rules like this:

```css
li::before{ content: url(arrowRight.svg) }
li.open::before{ content: url(arrowDown.svg) }
```

Then the JavaScript which shows/unfolds the list item's content simply has to add the class `open` to the `li` node, and the script code which hides/shows the item's content has to remove that class again.

This CSS-only way with external image files has, however, some disadvantages. Especially the sizing / scaling of the image might be tricky (e.g. `content` can't be sized by CSS but has have a fixed size and can't depend dynamically on the font size). And when opening or closing the sublist, the image simply gets replaced, i.e. the arrow flips without animation. These were the main reasons for the development of this plug-in:

This plug-in dynamically inserts an inline-SVG image into the HTML. Other than externally loaded and embedded SVG documents, inline-SVG is a part of the HTML document and may be styled by the HTML document's CSS. I.e. you may common define styles for the HTML list markup and for the included list icons at one central place.

* You may (actually _have to_) use CSS to size the icon and to define its properties like stroke, line width, fill color etc.
* You may style the image and the text (list item, section heading etc.) accordingly, even add dynamic styles like a hover effect to both of them (see demos).
* And of course, CSS transitions allow for a smooth, animated state transition like a rotating triangle, a flipping arrow sign or a plus being smoothly transformed into a minus (see demos).

But the plug-in doesn't stop there: It's configurable, so you can even define the actual SVG image (in JavaScript). Some typical images are provided as presets (including a transition). You can simply use these presets, modify them or create some custom images from scratch.

**Please note:** _This plug-in concentrates on drawing the SVG icon (which may be animated with CSS transitions). The actual content-folding is not part of this plug-in._ The demo page uses simple calls to jQuery's built-in `slideDown()` and  `slideUp()` functions, but the demo code still has to do at least _two_ things on each click event: fold or unfold the content _and_ toggle the CSS state class (like `open` in the example above) of the list item or heading in order to change the icon. And if you want Internet Explorer- or MS Edge support, the event handler even has to perform a third step by calling an additional plug-in function for transforming the icon (since these MS browsers don't support CSS transformations on SVG).

I'm considering publishing another jQuery plug-in with the focus on showing and hiding sections and automatically toggling a state class of a corresponding "header" element, to make that job even easier. Both plug-ins may then be combined for very simple (un-)folding of sections or list items.


**Not released yet!** The demo page is pretty much complete, but the reference documentation is still missing.

## Getting started

Let's, for the start, assume, you have a simple unordered list (`<ul>`) and want to use folding-arrows (right- or downpointing triangles by default) instead of normal list bullets for every list item (`<li>`) of that list (not including sublists inside its list items). 

What do you have to do at least—in the simplest case?

1. Fit the unordered list with the class `folding-arrows`[^1]:
	```html
	<ul class="folding-arrows">
		<li>...
			<ul>...</ul> <!-- sub list -->
		</li>
		...
	</ul>
	```
2. Include the Script file as well as jQuery inside your HTML's `<head>`:
	```html
	<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="dist/jquery-folding-arrow-icon-min.js"></script>
	```
3. Include the default stylesheet that came along with the plug-in[^3]:
	```html
	<link rel="stylesheet" type="text/css" href="dist/jquery-folding-arrow-icon.css">
	```
4. Write some custom JavaScript code to apply the plug-in: Write a query selecting all list items which should be fitted with the folding arrow icon. In this case, we select every list item of any unordered list of class `folding-arrows`, see above. To prepend the icon to the selected list items, call the `prependFoldingArrowIcon` plug-in—in this simple case without arguments, which implies all options are left on default values: 
	```javascript
	$("ul.folding-arrows > li").prependFoldingArrowIcon();
	```
5. The included CSS file (see step 3) already contains default styles for lists of class `folding-arrows`. Especially, it turns off the default bullets and indents the first line more to the left such that the inline SVG icon (being part of the content of the first line) is arranged to the left of the actual text content and—at least with default options—the actual content of the line following the icon and its separator[^5] aligns perfectly with the left margin of the following lines.    
	<strong>But</strong> the CSS does <em>not</em> define default visual styles for the icon, nor does the plug-in. The latter simply draws a path forming a triangle, but you have to style that path on your own by adding CSS rules for the `stroke` and `fill` properties, like e.g.:
	```css
	.folding-arrow-icon path {
	    stroke: none;
	    fill: silver;
	}
	```
6. Now you have a folding-arrow icon able to indicate whether the contents of the list item are visible or not. But you still have to add JavaScript handlers to capture events (like a click on the icon or on a link in the list item) which should actually toggle the state (fold or unfold content). This event handler has to do three things:
	1. Actually show or hide the content, and
	2. add or remove the class `showing` to resp. from the `<li>` item in order to flip the state of the indicator.
	3. After adding/removing the `showing` class to/from the `<li>` item, the handler should also call another jQuery plug-in function provided by this library: `$(…).transformFoldingArrowIcon()`.    
		This is not actually mandatory, but it's needed for compatibility with Microsoft's browsers (Internet Explorer as well as Edge): Both don't support SVG transitions defined via CSS, they only understand transition attributes inside the SVG's DOM itself! The `transformFoldingArrowIcon` plug-in function therefore adds or removes a transition (by default a rotation by 90°) to/from the SVG's DOM—dependent, by default, on the presence or absence of the `showing` class on the list item. It also supports adding a title to the image (e.g. showing as a pop-up when the mouse hovers over it) depending on the `showing` state, but by default, no title is added.
	(As already said in the introduction, I'm considering publishing a further jQuery plug-in which will simplify this sixth step.)

See the demo page for working examples. You may create a copy of the demo page as a playground for your own experiments.

Of course the plug-in is quite flexible and customizable. For one, it isn't limited to be applied to list items, see demo page. It also doesn't force you to stick to constraints like the use of the specific class `folding-arrows` and such. Those are simply defaults, and if you don't want to stick to these defaults, you'll have to do more customization. Especially the included CSS file applies default styles to elements equipped with default classes, and if you want to use other class names, you can't simply use the default CSS file. Feel free to make a copy of the CSS and customize that to your needs. You should _not_ edit the included stylesheet, since future updates of the plug-in might then overwrite and thus reset your local changes—also that would break the demo page.


[^1]: Of course you're not obliged to use exaclty _that_ class name, that's just a default. But if you use another name, you can't use the included CSS file `jquery-folding-arrow-icon.css` in its original form (see step 3). You should then make a copy of that file and change that accordingly.

[^3]: This CSS file contains rules for a) formatting the unordered list in such a way that the in-line SVG icons are aligned like list bullets (for any `ul.folding-arrows`, see step 1) and b) it contains default transformation and transition rules for rotating the originally right-pointing triangle by 90 degrees when the class `showing` gets added to a `li` (see step 6).

[^5]: The separator is a string inserted between the inline SVG icon and the original list item's content. It can be explicitly set in the plug-in's options. The included CSS file assumes the separator to be exactly `0.5em` wide, which is the case for the default separator (`&ensp;`).