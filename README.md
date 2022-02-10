# Shoutem UI

Shoutem UI is a set of styleable components that enables you to build beautiful React Native applications for iOS and Android. All of our components are built to be both composable and [customizable](http://github.com/shoutem/theme). Each component has a predefined style that is compatible with the rest of the Shoutem UI, which makes it possible to build complex components that look great without the need to manually define complex styles.

## Install

These instructions are valid for React Native 0.60.0 and higher. If you're running a lower version, please use v1.X.X.

```
$ npm install --save @shoutem/ui
```

We have a `postinstall` script which will add `@shoutem/ui`'s native dependencies to your root `package.json` in order to support autolinking and pod installation.

## Docs

All the documentation is available on the [Developer portal](http://shoutem.github.io/docs/ui-toolkit/introduction).

## Community

Join [our community](https://www.facebook.com/groups/shoutem.community/) on Facebook. Also, feel free to ask a question on Stack Overflow using ["shoutem" tag](http://stackoverflow.com/tags/shoutem).

## Examples

To see how Shoutem UI works, you can:

- include the `Examples` component into your React Native app or
- run `Restaurants` app in `examples` folder.

### Examples component

**If you are using Expo, see [this
project](https://github.com/shoutem/ui/blob/develop/examples/create-react-native-app/App.js)
for example usage. Otherwise, follow the steps below.**

Create new React Native project and locate to it:

```bash
$ react-native init HelloWorld && cd HelloWorld
```

Install `@shoutem/ui` in your project:

```bash
$ npm install --save @shoutem/ui
```

Now, simply copy the following to your `App.js` files of the React Native project:

```JavaScript
import React, { PureComponent } from 'react';
import { Examples } from '@shoutem/ui';

export default class App extends PureComponent {
  render() {
    return (
      <Examples />
    );
  }
}
```

Finally, run the app!

```bash
$ react-native run-ios
```

To see other components, just import them from `@shoutem/ui` and render them.

You can also use standard React Native components in your layouts anywhere you want, but they will not inherit either the theme or the parent styles, so you will need to style them manually.

### Restaurants app

Clone the [Shoutem UI](https://github.com/shoutem/ui) repository:

```bash
git clone https://github.com/shoutem/ui.git
```

Locate to `RestaurantsApp` folder:

```bash
cd ui/examples/RestaurantsApp
```

Install and link dependencies:

```bash
npm install
react-native link
```

Finally, run the app!

```bash
react-native run-ios
react-native run-android
```

## UI Toolkit

Shoutem UI is a part of the [Shoutem UI Toolkit](https://shoutem.github.io/ui/) that enables you to build professional looking React Native apps with ease.

It consists of three libraries:

- [@shoutem/ui](https://github.com/shoutem/ui): beautiful and customizable UI components
- [@shoutem/theme](https://github.com/shoutem/theme): “CSS-way” of styling entire app
- [@shoutem/animation](https://github.com/shoutem/animation): declarative way of applying ready-made animations

## License

[The BSD License](https://opensource.org/licenses/BSD-3-Clause)
Copyright (c) 2016-present, [Shoutem](http://shoutem.github.io)
