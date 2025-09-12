# @qubit-ltd/common-ui-quasar

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/common-ui-quasar.svg)](https://npmjs.com/package/@qubit-ltd/common-ui-quasar)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-common-ui-quasar/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-common-ui-quasar/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/js-common-ui-quasar/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-common-ui-quasar?branch=master)

## Introduction

[@qubit-ltd/common-ui-quasar] is an implementation of common UI components using the [Quasar Framework](https://quasar.dev/). This library provides a collection of UI components that offer a consistent interface experience for developers.

This project implements notifications, confirmation dialogs, alert boxes, and loading indicators based on the Quasar framework. It seamlessly integrates with the [@qubit-ltd/common-ui] library, allowing developers to easily use these components in Quasar projects.

## Features

- **Unified Component Interface**: Maintains consistent APIs with [@qubit-ltd/common-ui], facilitating migration between different projects
- **Quasar Framework Integration**: Optimized for the Quasar Framework, leveraging its component ecosystem
- **Comprehensive Notification System**: Supports various notification types (info, success, warning, error, debug)
- **High Customizability**: Supports custom icons, positions, durations, and other parameters
- **Complete Type Support**: Provides comprehensive TypeScript type definitions
- **100% Test Coverage**: Ensures code quality and reliability

## Installation

Using npm:

```bash
npm install @qubit-ltd/common-ui-quasar --save
```

Or using yarn:

```bash
yarn add @qubit-ltd/common-ui-quasar
```

## Dependencies

This library depends on the following packages:

- `@qubit-ltd/common-ui`: Common UI component interface definitions
- `quasar`: Quasar framework
- `vue`: Vue.js framework

Ensure these dependencies are correctly installed in your project.

## Custom Icon Configuration

Starting from v1.1.0, `@qubit-ltd/common-ui-quasar` supports custom icon configuration. You can configure custom icon CSS class names for different message types.

### Basic Configuration

```javascript
import { alert, confirm, notify } from '@qubit-ltd/common-ui';
import { QuasarAlertImpl, QuasarConfirmImpl, QuasarNotifyImpl } from '@qubit-ltd/common-ui-quasar';
import { Dialog, Notify } from 'quasar';

// Configure custom icons
const iconConfig = {
  iconClassMap: {
    'info': 'fa-solid fa-info-circle',
    'success': 'fa-solid fa-check-circle',
    'warn': 'fa-solid fa-exclamation-triangle',
    'error': 'fa-solid fa-times-circle',
    'debug': 'fa-solid fa-bug'
  }
};

// Pass configuration when setting implementation
alert.setImpl(new QuasarAlertImpl(Dialog), iconConfig);
confirm.setImpl(new QuasarConfirmImpl(Dialog), iconConfig);
notify.setImpl(new QuasarNotifyImpl(Notify), iconConfig);
```

### Partial Custom Configuration

You only need to configure the icon types you want to customize, other types will use default icons:

```javascript
// Only customize error and success icons
const partialConfig = {
  iconClassMap: {
    'error': 'fa-solid fa-skull-crossbones',
    'success': 'fa-solid fa-thumbs-up'
  }
};

alert.setImpl(new QuasarAlertImpl(Dialog), partialConfig);
```

### Supported Icon Libraries

You can use any CSS icon library:

```javascript
// FontAwesome icons
const fontAwesomeConfig = {
  iconClassMap: {
    'info': 'fa-solid fa-circle-info',
    'error': 'fa-solid fa-circle-xmark'
  }
};

// Bootstrap Icons
const bootstrapConfig = {
  iconClassMap: {
    'info': 'bi bi-info-circle-fill',
    'error': 'bi bi-x-circle-fill'
  }
};

// Material Icons
const materialConfig = {
  iconClassMap: {
    'info': 'material-icons',
    'error': 'material-icons'
  }
};
```

### Backward Compatibility

When no configuration is provided, the original behavior is maintained:

```javascript
// Original way, using default icons
alert.setImpl(new QuasarAlertImpl(Dialog));
```

### Runtime Configuration Updates

You can also update configuration at runtime:

```javascript
// Get current implementation and update configuration
const impl = alert.getImpl();
impl.configure({
  iconClassMap: {
    'info': 'new-info-icon',
    'error': 'new-error-icon'
  }
});
```

## Usage

### Basic Setup

First, import and set up the implementations in your application:

```javascript
import { notify, loading, confirm, alert } from '@qubit-ltd/common-ui';
import {
  QuasarNotifyImpl,
  QuasarLoadingImpl,
  QuasarConfirmImpl,
  QuasarAlertImpl
} from '@qubit-ltd/common-ui-quasar';
import { Notify, Loading, Dialog } from 'quasar';

// Set implementations
notify.setImpl(new QuasarNotifyImpl(Notify));
loading.setImpl(new QuasarLoadingImpl(Loading));
confirm.setImpl(new QuasarConfirmImpl(Dialog));
alert.setImpl(new QuasarAlertImpl(Dialog));
```

### Notification Examples

```javascript
// Show an info notification
notify.info('This is an information message');

// Show a success notification
notify.success('Operation completed successfully');

// Show a warning notification
notify.warn('Please note', {
  position: 'top-right',
  duration: 5000,
  closeable: true
});

// Show an error notification
notify.error('An error occurred', {
  icon: 'error',
  showDetail: true,
  detailLabel: 'View Details',
  detailAction: () => console.log('Viewing details')
});
```

### Loading Indicator Examples

```javascript
// Show a loading indicator
loading.show();

// Show a loading indicator with a message
loading.show('Loading data...');

// Hide the loading indicator
loading.hide();
```

### Confirmation Dialog Examples

```javascript
// Simple confirmation dialog
confirm.show('Confirm Deletion?', 'Are you sure you want to delete this item?')
  .then(() => {
    // User clicked confirm
    console.log('User confirmed the action');
  })
  .catch(() => {
    // User clicked cancel
    console.log('User cancelled the action');
  });

// Custom confirmation dialog
confirm.show(
  'Save Changes',
  'Do you want to save your changes?',
  {
    ok: 'Save',
    cancel: 'Don\'t Save',
    icon: 'save'
  }
).then(() => {
  // Handle save logic
});
```

### Alert Dialog Examples

```javascript
// Show a simple alert dialog
alert.show('Operation Complete', 'Your operation has completed successfully');

// Alert with callback
alert.show('Notice', 'Your session is about to expire', {
  ok: 'Got it',
  callback: () => console.log('User acknowledged')
});
```

## API Documentation

This project uses JSDoc to generate detailed API documentation, which can be built locally using:

```bash
yarn doc
```

The generated documentation will be located in the `doc` directory.

## Project Structure

```
src/
├── impl/                  # Implementation utilities
│   ├── get-html-icon.js   # HTML icon generation
│   ├── get-quasar-color.js # Quasar color mapping
│   └── get-quasar-icon.js # Quasar icon mapping
├── index.js               # Entry point
├── get-quasar-icon-set.js # Icon set handling
├── quasar-alert-impl.js   # Alert dialog implementation
├── quasar-confirm-impl.js # Confirmation dialog implementation
├── quasar-loading-impl.js # Loading indicator implementation
└── quasar-notify-impl.js  # Notification system implementation
```

## Development Guide

### Environment Setup

After cloning the repository, install dependencies:

```bash
yarn install
```

### Building

```bash
# Development build
yarn build:dev

# Production build
yarn build

# Build everything (docs and library)
yarn build:all
```

### Testing

This project uses Jest for unit testing:

```bash
# Run all tests
yarn test

# Run tests with coverage report
yarn test --coverage
```

### Code Standards

This project uses ESLint for code quality checks:

```bash
yarn lint
```

## Contributing

Contributions to this project are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request to the [GitHub repository].

## License

[@qubit-ltd/common-ui-quasar] is distributed under the Apache 2.0 license.
See the [LICENSE](LICENSE) file for more details.

[@qubit-ltd/common-ui-quasar]: https://npmjs.com/package/@qubit-ltd/common-ui-quasar
[@qubit-ltd/common-ui]: https://npmjs.com/package/@qubit-ltd/common-ui
[GitHub repository]: https://github.com/Haixing-Hu/js-common-ui-quasar
