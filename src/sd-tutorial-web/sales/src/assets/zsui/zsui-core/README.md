# ![](./src/images/zsuiLogo.png) 

ZSUI library core module. 

| | |
| ----------- | ----------- |
| [Typography](./docs/typography.md) | Typography and general styles.
| [Icons](./docs/icons.md)      | ZSUI library provides many icons that can be used in any application as per requirements.       |  
| [Menu](./docs/menu.md)      | Popup menu can be used to dislay a list of items in a menu.       | 
| [Badge](./docs/badge.md)      | Badges are a way of displaying quantity. These are typically placed on top of, or next to other elements.       |
| [Utils](./docs/utils.md)      | ZSUI library provides many CSS utilities for various properties like border, color, height, width, etc.       |  
| [Loading](./docs/loading.md)      | Loading behaviour and styles could be used to show loader/spinner over specified target.       |
| [Custom Elements](./docs/customElements.md)   | Custom Elements are user-defined HTML elements that can encapsulate a functionality. Our library includes a tiny helper to define and work with custom elements.|
| [Tooltip](./docs/tooltip.md)      | Tooltip component is used to show a small pop-up box when a user moves the mouse pointer over an element. Tooltips usually used to show hint or additional information about the element. | 
| [Animation](./docs/animate.md)      | Animation is a helper behaviour that helps to register and play animations based on CSS Transitions.  |
| [Highlight](./docs/zsHighlight.md)   | Highlight behaviour and styles could be utilized to highlight a text fragment in the document.          |
| [Dom Helper](./docs/domHelper.md)      | DOM Helper is a set of utility functions that help you to perform certain DOM operations with ease. It also contains JS polyfills for functions that aren't support on IE. For eg: Element.closest(). |
| [Configuration](./docs/config.md)   | We can configure themes for ZSUI library using config.js file. It is currently used to configure third party components like Highcharts.        |
| [Smart Component](./docs/smartComponent.md)   | A set of various utils that help to build a smart custom element.|


# Installation

## For Consumers

* Before installing our library in your project you need to [connect](https://bitbucket.org/zssd/zsui-core/src/master/tutorials/connect.md) to our protected SD feed.

* Open command terminal and navigate to your project folder.

* Install dependencies
    ```
    npm install zsui-core --save
    ```

* Install tools
    ```
    node node_modules\zsui-core\setup.js
    ```
* You can either copy or directly use required assets from `node_modules\zsui-core\dist` folder.

* If you wish to override or extend ZSUI assets in your project, refer respective asset files `node_modules\zsui-core\src` folder.

## For Contributors

* Checkout our project code from [repository](https://bitbucket.org/zssd/zsui-core).

* Open command terminal and navigate to your project folder.

* Install dependencies
    ```
    npm install
    ```

* Install tools
    ```
    npm run setup
    ```

* Build module
    ```
    grunt build
    ```

## [Tutorials](./tutorials/index.md)
## [Change log](./CHANGELOG.md)
## [Contribute](./CONTRIBUTING.md)