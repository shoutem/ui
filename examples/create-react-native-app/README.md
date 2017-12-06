This is an example project bootstrapped with Create React Native App.

More detailed guide on how to work with a CRNA project can be found here.

Shoutem UI depends on several React Native packages with native code dependencies and it uses custom fonts. The default behavior of the CRNA is to create an app compatible with the Expo preview. The Expo app imposes restrictions on the way that native dependencies and custom fonts can be used compared to a standard RN app. The differences from the standard RN environment are described below.

## Loading custom fonts

In order to use custom fonts that come with the Shoutem UI in the Expo preview app, those fonts need to be manually loaded using Font.loadAsync from the expo package. You can see how to do that in the `App.js`.

## Native dependencies

The Expo preview app has a set of predefined dependencies and it doesn't have support for adding new native dependencies using standard RN commands (react-native link).

Shoutem UI is functional in this environment, but certain UI components that use native components will not work. If you need those components, you can eject from the CRNA environment. See the ejecting guide for more details about this option.
