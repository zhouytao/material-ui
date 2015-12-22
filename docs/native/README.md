# [material-ui-docs](http://callemall.github.io/material-ui/)

This is the documentation site for material-ui.

## Requirements

- [Node](https://nodejs.org) 4.x or better
- [React Native](http://facebook.github.io/react-native/docs/getting-started.html) for development
- [Xcode](https://developer.apple.com/xcode/) for iOS development (optional)
- [Android SDK](https://developer.android.com/sdk/) for Android development (optional)
- [Android Lollipop](https://www.android.com/versions/lollipop-5-0/) or better for Android device testing (optional)

## Installation
After cloning the repository, install dependencies:
```sh
cd <project folder>/material-ui
npm install
cd <project folder>/material-ui/docs
npm install
```

## Running

Once dependencies are installed, start the application with:

### Browser

```sh
npm run browser:development
```

Open `http://localhost:3000` to view the documentation site.

### iOS

```sh
npm run native:development
```

This will start a [Webpack Dev Server](https://github.com/webpack/webpack-dev-server) which will watch your JS files for changes and automatically generate the `index.ios.js` file expected by your React Native iOS.

Open `ios/App.xcodeproj` in Xcode, build and run the project.

Unlike the app currently generated by `react-native init` this app removes the `UIViewControllerBasedStatusBarAppearance` key to prevent the app from logging an error in Xcode and leading to an App Store rejection. The key may be added back, if desired, but its value must be set to `true` to prevent unexpected rejection during the review process.

### Android

```sh
npm run native:development
```

This will start a [Webpack Dev Server](https://github.com/webpack/webpack-dev-server) which will watch your JS files for changes and automatically generate the `index.android.js` file expected by your React Native Android app.

Then:

```sh
npm run android:setup-port
react-native run-android
```

## Bundling

Building the app for distribution.

1. Execute `npm run native:bundle` to generate the [offline JS bundle](https://facebook.github.io/react-native/docs/running-on-device-ios.html#using-offline-bundle).
2. For iOS, update `AppDelegate.m` to load from pre-bundled file on disk.