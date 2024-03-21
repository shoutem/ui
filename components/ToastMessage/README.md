# Shoutem UI Toasts :bread:

New component used for multiple types of alerts, or simple action prompts. The component is based on the [react-native-toast-message ](https://github.com/calintamas/react-native-toast-message)package, with our wrapper implementation defining custom styled toast types

> You are still free to use the react-native-toast-message show/hide methods directly, through our default export, if you so desire.

## Usage

Most of the time, you will want to use one of the four standard methods of showing a toast using this package.

- Toast.showInfo
- Toast.showAction
- Toast.showError
- Toast.showSuccess

- Toast.show() and Toast.hide() methods are identical to the ones in the parent library. So if you want to use your own components for alerts, you can do it just like you would normally.

Each of these accepts same set or props / params, but implements different styling and color schemes, according to it's semantic significance. Below are a couple of examples of commonly used methods.

```jsx
import { Toast } from '@shoutem/ui';
...
Toast.showInfo({
  title: 'Hello world!',
  message: `This is a message!`,
  iconSource: { 
    uri: 'https://townsquare.media/site/341/files/2012/05/Mr.-Trololo.jpg',
  },
});
...
```

```jsx
import { Toast } from '@shoutem/ui';
...
Toast.showAction({
  title: 'Stop',
  message: `Hammer time`,
  iconSource: require('../assets/actionIcon.png'),
  cancelButtonText: 'absolutely not',
  confirmButtonText: `Hammer zeit!`,
  onCancel: Toast.hide,
  onConfirm: () => {
    console.log('A man of culture....');
    Toast.hide();
  }
});
...
```

```jsx
import { Toast } from '@shoutem/ui';
...
Toast.showError({
  title: 'Error',
  message: `We've failed to charge your credit card. Please check your CC data`,
  iconName: 'error',
  confirmButtonText: `Take me to payment details`,
  onConfirm: () => {
    navigateTo('PaymentDetailsScreen');
    Toast.hide();
  }
  autoHide: false,
});
...
```


### Props

Currently supported props mainly include "native" props from the parent library, with both, a few exclusions and a some additions. Also, you can pass any kind of custom prop you want, and it will be passed in to your custom toast component

| **Name**                                    | **Type**          | **Default** | **Description**                                                                                                                  |
|---------------------------------------------|-------------------|-------------|----------------------------------------------------------------------------------------------------------------------------------|
| title                                       | String            | Required    | Title of the toast message                                                                                                       |
| message                                     | String            | Required    | Description of the toast message                                                                                                 |
| iconName                                    | String            | Info        | Name of the existing icon in the UI toolkit that will be used as a leading image                                                 |
| iconSource                                  | ImageSourceType   | undefined   | Standard image source ( uri object, direct require, ... ). If this prop is passed in, it will take presedence over iconName prop |
| durationIndicator                           | Bool              | true        | Displays the duration indicator line below the toast, in the duration of the `visibilityTime` prop                               |
| onConfirm                                   | Function          | undefined   | Callback called when pressing the confirm button                                                                                 |
| onCancel                                    | Function          | undefined   | Callback called when pressing the cancel button                                                                                  |
| confirmButtonText                           | String            | undefined   |                                                                                                                                  |
| cancelButtonText                            | String            | undefined   |                                                                                                                                  |
| `-- props supported from parent library --` |                   |             |                                                                                                                                  |
| position                                    | `top` or `bottom` | top         |                                                                                                                                  |
| visibilityTime                              | Number            | 4000        | How long is the toast displayed                                                                                                  |
| autoHide                                    | Bool              | true        | Hide automatically after visibilityTime has expired                                                                              |
| topOffset                                   | Number            | 40          |                                                                                                                                  |
| bottomOffset                                | Number            | 40          |                                                                                                                                  |
| keyboardOffset                              | Number            | 10          |                                                                                                                                  |
| onShow                                      | Function          |             |                                                                                                                                  |
| onHide                                      | Function          |             |                                                                                                                                  |
| onPress                                     | Function          |             |                                                                                                                                  |

## BaseToast

This component also exports our base component that contains all of the internal logic that understand how to compose and handle toast message. If you'd like to create a new Toast component, feel free to use the BaseToast, and inject `customToastStyle` prop that will be merged with the default styles, and / or any other prop manipualtion you require. 



