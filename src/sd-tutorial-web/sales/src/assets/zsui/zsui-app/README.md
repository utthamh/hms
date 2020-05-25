# Application helpers 
When we build applications we often face common problems like how to send HTTP requests, how to configure our components and manage the state.

This module of [zsui](https://bitbucket.org/zssd/zsui-core/) library includes solutions we think would work better in the context our library and components.

## Install
Before installing our library in your project you need to [connect](https://bitbucket.org/zssd/zsui-core/src/master/tutorials/connect.md) to our protected SD feed.

Install dependencies
```shell
npm install
```

Install tools
```shell
npm run setup
```

Build module
```shell
grunt build
```

## Components
| | | 
| ----------- | ----------- |
| [State](./docs/state.md)      | Manage states of UI components. |
| [Configuration](./docs/configuration.md)      | How to configure UI components. |
| [l10n](./docs/l10n.md)   | Localization helper. |
| [Service](./docs/service.md)   | Working with data. |
| [HTTP Service](./docs/httpService.md)      | Send HTTP request using XMLHTTPRequest API. |
| [Fetch Service](./docs/fetchService.md)      | Send HTTP request using Fetch API. |
| [Store](./docs/store.md)      | Create a storage. |
| [Local Store](./docs/localStore.md)   | Work with Local Storage API. |

## [Change log](./CHANGELOG.md)
