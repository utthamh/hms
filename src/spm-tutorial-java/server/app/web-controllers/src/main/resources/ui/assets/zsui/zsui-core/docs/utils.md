# Documentation for CSS Utilities

ZSUI library provides many CSS utilities for various properties like border, color, height, width, etc. 

## Border 

Use the border utilities to change and style the borders of the element. You can selectively add or remove the borders as well as change the color and radius.

### Adding border

```HTML
<span class="zs-border"></span>
<span class="zs-border-top"></span>
<span class="zs-border-right"></span>
<span class="zs-border-bottom"></span>
<span class="zs-border-left"></span>
```

### Removing border

```HTML
<span class="zs-border-0"></span>
<span class="zs-border-top-0"></span>
<span class="zs-border-right-0"></span>
<span class="zs-border-bottom-0"></span>
<span class="zs-border-left-0"></span>
```
### Border Radius

```HTML
<span class="zs-border zs-border-rounded"></span>
<span class="zs-border zs-border-rounded-top"></span>
<span class="zs-border zs-border-rounded-right"></span>
<span class="zs-border zs-border-rounded-bottom"></span>
<span class="zs-border zs-border-rounded-left"></span>
<span class="zs-border zs-border-rounded-0"></span>
<span class="zs-border zs-border-circle"></span>
```

### Border colors

```HTML
<span class="zs-border zs-border-color-default"></span>
<span class="zs-border zs-border-color-error"></span>
<span class="zs-border zs-border-color-warning"></span>
<span class="zs-border zs-border-color-success"></span>
<span class="zs-border zs-border-color-info"></span>
```

## Size

Use the size utilities to set the height and width of the element.

### Width

```HTML
<span class="zs-width-25">Width 25%</span>
<span class="zs-width-50">Width 50%</span>
<span class="zs-width-75">Width 75%</span>
<span class="zs-width-100">Width 100%</span>
```
### Height

```HTML
<span class="zs-height-25">Height 25%</span>
<span class="zs-height-50">Height 50%</span>
<span class="zs-height-75">Height 75%</span>
<span class="zs-height-100">Height 100%</span>
```

## Space

Use the space utilities to add margin or padding to the element.

```HTML
<span class="zs-padding-1">Padding: 1</span>
<span class="zs-margin-1">Margin: 1</span>
<span class="zs-padding-1-2">Padding: 1,2,1,2</span>
<span class="zs-margin-0-1">Margin: 0,1,0,1</span>
<span class="zs-margin-1-2-2-1">Margin: 1,2,2,1</span>
```

## Align

Use the align utilities to set the vertical alignment of the element.

```HTML
<span class="zs-align-baseline">Baseline</span>
<span class="zs-align-top">Top</span>
<span class="zs-align-middle">Middle</span>
<span class="zs-align-bottom">Bottom</span>
<span class="zs-align-text-top">Text top</span>
<span class="zs-align-text-bottom">Text bottom</span>
```

## Float

Use the float utilities to position the element using floats.

```HTML
<div class="zs-float-none">Target div</div>
<div class="zs-float-left">Target div</div>
<div class="zs-float-right">Target div</div>
```

## Shadow

Use the shadow utility to add a shadow to the element.

```HTML
<div class="zs-box-shadow">Normal shadow</div>
<div class="zs-inner-shadow-sample1">Inner shadow</div>
<div class="zs-shadow-none">No shadow</div>
```
## Display

Use the display utilities to set the display property of the element.

```HTML
<div class="zs-display-block">Target div</div>
<div class="zs-display-inline-block">Target div</div>
<div class="zs-display-inline">Target div</div>
<div class="zs-display-table">Target div</div>
<div class="zs-display-table-row">Target div</div>
<div class="zs-display-table-cell">Target div</div>
<div class="zs-display-flex">Target div</div>
<div class="zs-display-none">Target div</div>
```

## Position

Use the position utilities to set the position property of the element.

```HTML
<div class="zs-position-static">Target div</div>
<div class="zs-position-absolute">Target div</div>
<div class="zs-position-relative">Target div</div>
<div class="zs-position-fixed">Target div</div>
```

##  Visibility

Use the visibility utilities to set the visibility of the element.

```HTML
<div class="zs-visibility-visible">Target div</div>
<div class="zs-visibility-hidden">Target div</div>
```
## Color 

Use the color utilities to set background and text colors for an element.


### Background colors

```HTML
<div class="zs-bg-primary"></div>
<div class="zs-bg-brand-dark"></div>
<div class="zs-bg-gray"></div>
<div class="zs-bg-darkgray"></div>
<div class="zs-bg-standard"></div>	
<div class="zs-bg-dark"></div>
<div class="zs-bg-border"></div>
<div class="zs-bg-link"></div>
<div class="zs-bg-link-hover"></div>
<div class="zs-bg-error"></div>
<div class="zs-bg-warning"></div>
<div class="zs-bg-success"></div>
<div class="zs-bg-info"></div>
<div class="zs-bg-border-error"></div>
<div class="zs-bg-selected"></div>
<div class="zs-bg-tab"></div>
<div class="zs-bg-shadow"></div>
```
### Text colors

```HTML
<div class="zs-text-default">Default text</div>
<div class="zs-text-light">Light text </div>
<div class="zs-text-footer">Footer text </div>
<div class="zs-text-success">Success text </div>
<div class="zs-text-error">Error text </div>
<div class="zs-text-warning">Warning text </div>
<div class="zs-text-info">Info text </div>
```

### Chart Colors

```HTML
<div class="zs-bg-chart-1"></div>
<div class="zs-bg-chart-2"></div>
<div class="zs-bg-chart-3"></div>
<div class="zs-bg-chart-4"></div>
<div class="zs-bg-chart-5"></div>
<div class="zs-bg-chart-6"></div>
<div class="zs-bg-chart-7"></div>
```

# Responsive Utilities

If we want to use above utilities on a specific screen size, we can put -lw, -mw, -sw and -xsw as a suffix to the required utility class.

* -lw : large width - (min-width: 1200px)

* -mw : medium width - (min-width: 992px) and (max-width: 1199px)

* -sw : small width - (min-width: 768px) and (max-width: 991px)

* -xsw : extra-small width - (max-width: 768px)

We have responsive utilities for:

* Border
* Size
* Align
* Float
* Display
* Position
* Visibility 

# Examples

Visit our demo [page](https://ui.zsservices.com/zsui/cssUtils.html) to see live examples and detailed usage of CSS utilities and also visit demo [page](https://ui.zsservices.com/zsui/cssUtilsResponsive.html) of responsive utilities to check the responsive utilities examples.