# Typography and general styles

## Including general styles of the library
```HTML
<link rel="stylesheet" href="zsui/themes/zs/core.css">
```

## Applying styles

Our library is designed to be flexible. Developers can decided where to apply general styles of the library by using a class `zs-style`.

```HTML
<body class="zs-style"></body>
```

Typically to the `body` of the page. All children elements of such a container will receive default styles such as padding, margins, border, color, font, line height, etc...

## Text

We use Roboto web font and supply styles for headers and paragraphs.

```html
<h1>Heading 21</h1>
<p>Paragraph</p>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 3</h4>
```

You can use special classes to apply typography styles to other elements. 

```html
<div class="zs-h1">Heading 1</div>
<div class="zs-paragraph">Paragraph</div>
```

Our styles are designed in such a way to keep semantic markup in mind. For example, margins would collapse to keep right amount of space between elements.


## Lists

```html
<ul class="zs-list">
	<li>Item 1</li>
	<li>Item 2</li>
	<li>Item 3</li>
</ul>
```

```html
<ol class="zs-list">
	<li>Item 1</li>
	<li>Item 2</li>
	<li>Item 3</li>
</ol>
```

## Links

We define styles for normal, active and hover state of links.

```html
<a href="#">Text</a>
```


## Horizontal Rule

```html
text
<hr>
text
```

## Disabling elements

You can easily make elements disabled by applying `zs-disabled` class to elements.

```html
<a href="#" class="zs-disabled">Link</a>
```

You can use it on any elements and containers. Disabled links will stop react to user actions.

```html
<div class="zs-disabled">
	<p>Text</p>
	<a href="#">Link</a>
</div>
```

# Examples

* [Typography](https://ui.zsservices.com/zsui/typography.html)
* [Disabled state](https://ui.zsservices.com/zsui/disabled.html)
* [Spinner](https://ui.zsservices.com/zsui/loading.html)


# See also

* [Size and space](./../tutorials/space.md).
* [Theming](./../tutorials/theming.md)
