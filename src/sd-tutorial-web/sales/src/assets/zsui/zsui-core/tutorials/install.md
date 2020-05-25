# Installation

## For Consumers

* Before installing our library in your project you need to [connect](./connect.md) to our protected SD feed.

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
