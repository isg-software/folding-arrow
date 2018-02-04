# folding-arrow

jQuery plug-in for inserting arrow icons for foldable list items, sections, burger menu icons etc. as inline SVG with CSS support.

## Motivation

Have a look at the demo page, and you'll most certainly recognize the demonstrated icons, like the triangle icons used to indicate whether a (sub)section is visible or collapsed/folded. One of the most common usages of such icons is in hierarchical lists to show list items with sub-lists and the state of the latter's visibility. For a collapsed sublist, the icon is usually an arrow to the right, if it's visible, the arrow points down.

Since the actual look of the icon is not the major content of the HTML document, but a simply a presentation style, a common way to achieve this is to simply add a class to the foldable list item which represents the logical state (open/visible or closed/collaped/folded). The icon itself (being presentation) could simply be added by CSS, e.g. with rules like this:

```css
li::before{ content: url(arrowRight.svg) }
li.open::before{ content: url(arrowDown.svg) }
```

Now the JavaScript which shows or hides the list item's content simply has to add or remove the `open` class to resp. from the `li` node.

This CSS-only way with external image files has, however, some disadvantages. Especially the sizing / scaling of the image might be tricky (e.g. `content` can't be sized by CSS but has have a fixed size and can't depend dynamically on the font size). And when opening or closing the sub list, the image simply gets replaced, so the arrows flip without animation. These were the main reasons for the development of this plug-in:

This plug-in dynamically inserts an inline-SVG image into the HTML. Other than externally loaded and embedded SVG documents, inline-SVG may be styled by CSS rules of the HTML document. 

* So you may (and have to) use CSS to size the icon and to define its properties like stroke, line width, fill color etc.
* You may style the image and the text (list item, section heading etc.) accordingly, even dynamic styles like a hover effect to both of them (see demos).
* And of course, CSS transitions allow for a smooth, animated state change like a rotating triangle, a flipping arrow sign or a plus being smoothly transformed into a minus (see demos).

The plug-in itself doesn't stop there, but is configurable, so you can even (in JavaScript) define the actual SVG image. Some typical images are provided as presets (including a transition). You can simply use these presets, modify them or create some custom images from scratch.

**Please note:** _This plug-in concentrates on drawing the SVG icon (which may be animated with CSS transitions). The actual content-folding is not part of this plug-in._ The demo page uses simple calls to jQuery's built-in `slideDown()` and  `slideUp()` functions, but the demo code still has to do two things on each click event: fold or unfold the content _and_ flip the CSS state class of the list item or heading in order to change the icon. I'm considering publishing another jQuery plug-in with the focus on  showing and hiding sections and automatically flipping a state class (like `open` in the example above) of a corresponding "header" element, to make that job even easier. Both plug-ins may then be combined for very simple (un-)folding of sections or list items.


**Not released yet!** The demo page is pretty much complete, but the reference documentation is still missing.