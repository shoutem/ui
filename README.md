# Shoutem UI

Shoutem UI is a set of styleable components that enables you to build beautiful React Native applications for iOS and Android. All of our components are built to be both composable and [customizable](http://github.com/shoutem/theme). Each component has a predefined style that is compatible with the rest of the Shoutem UI, which makes it possible to build complex components that look great without the need to manually define complex styles.

## Install

These instructions are valid for React Native 0.60.0 and higher. If you're running a lower version, please use v1.X.X.

```
$ npm install --save @shoutem/ui
```

We have a `postinstall` script which will add `@shoutem/ui`'s native dependencies to your root `package.json` in order to support autolinking and pod installation.

Optional: Link the font files to your iOS and Android projects using `react-native-asset`:

```
$ npx react-native-asset node_modules/@shoutem/ui/fonts
```

Not doing this will result in dismissable red screen errors about unknown font names, as well as the default system fonts being used on iOS and Android when a Shoutem UI font is meant to be used, so we suggest running this step.

## Docs

All the documentation is available on the [Developer portal](http://shoutem.github.io/docs/ui-toolkit/introduction).

## Community

Join [our community](https://www.facebook.com/groups/shoutem.community/) on Facebook. Also, feel free to ask a question on Stack Overflow using ["shoutem" tag](http://stackoverflow.com/tags/shoutem).

## UI Toolkit

Shoutem UI is a part of the [Shoutem UI Toolkit](https://shoutem.github.io/ui/) that enables you to build professional looking React Native apps with ease.

It consists of three libraries:

- [@shoutem/ui](https://github.com/shoutem/ui): beautiful and customizable UI components
- [@shoutem/theme](https://github.com/shoutem/theme): “CSS-way” of styling entire app
- [@shoutem/animation](https://github.com/shoutem/animation): declarative way of applying ready-made animations

## License

[The BSD License](https://opensource.org/licenses/BSD-3-Clause)
Copyright (c) 2016-present, [Shoutem](http://shoutem.github.io)
