# Documentation for Icons

ZSUI library provides many icons that can be used in any application as per requirements.

# Usage

## Normal Icons

You can add `zs-icon` and `zs-icon-{{modifier_name}}` classes to the element to get the required icon. 

```HTML
<span class="zs-icon zs-icon-{{modifier_name}}"></span>
// modifier_name : search, delete, etc.
```
We can also add `zs-icon-large` class to get large icon.

```HTML
<span class="zs-icon zs-icon-large zs-icon-search"></span>
```

## Status Icons

We can have four status icons: 

* Success
* Warning
* Error
* Info

```HTML
<p class="{{modifier_class}}">
    <span class="zs-icon zs-icon-search"></span>
</p>
<p>
    <a href="javascript:void"><span class="zs-icon zs-icon-search {{modifier_class}}"></span></a>
</p>
// modifier_class: zs-success - Success, zs-warning - Warning, zs-error - Error, zs-info - Info
```
## Icons with badge

```HTML
<span class="zs-icon zs-icon-large zs-icon-tasks"><span class="zs-badge zs-badge-current-item"></span></span><br/>
<span class="zs-icon zs-icon-large zs-icon-tasks"><span class="zs-badge zs-success zs-badge-current-item"></span></span><br/>
<span class="zs-icon zs-icon-large zs-icon-tasks"><span class="zs-badge zs-warning zs-badge-warning zs-badge-triangle"></span></span>
<p class="zs-font-large"><span class="zs-icon zs-icon-large zs-icon-tasks"><span class="zs-badge zs-warning zs-badge-warning zs-badge-triangle"></span></span></p>
```

# Examples

Visit our demo [page](https://ui.zsservices.com/zsui/icons.html) to see live examples and a list of all the icons. 