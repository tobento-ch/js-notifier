# JS Notifier

Simple JavaScript notifier to show notifications.

## Table of Contents

- [Getting started](#getting-started)
    - [Browser support](#browser-support)
- [Documentation](#documentation)
    - [Basic Usage](#basic-usage)
    - [Parameters](#parameters)
    - [Methods](#methods)
    - [Stacks](#stacks)
- [Credits](#credits)
___

# Getting started

## Browser support

Modern browser only.

# Documentation

## Basic Usage

**1. Include CSS/JS**

```html
<link href="notifier.css" rel="stylesheet" type="text/css">
```

**2. Import Notifier And Send A Notification**

```js
import notifier from "notifier.js";

const notification = notifier.send({
    status: 'success',
    title: 'Lorem',
    text: 'Lorem ipsum.',
});
```

## Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| ```action``` | ```{title: "View ...", url: "https://example.com/slug", classes: ["button"]}``` | You may set an action displayed using an ```a``` element. |
| ```autotimeout``` | ```5000```, ```null``` | If defined, the notification will be closed after the milliseconds passed. |
| ```classes``` | ```["notification", "notification-fade"]``` | You may set custom CSS classes to the notification element. |
| ```icon``` | ```"<svg ... /></svg>"``` | You may add a custom icon. |
| ```id``` | ```"ID"``` | A unique notification id. |
| ```removeDelay``` | ```500``` | Milliseconds after the notification will be removed. You may change this value if you have a custom animation, other than fade in and out. |
| ```showCloseButton``` | ```false``` | If ```false``` close button will not be displayed at all. |
| ```showIcon``` | ```false``` | If ```false``` icon will not be displayed at all. |
| ```stack``` | ```"name"``` | A stack name. See [stack section](#stacks) to learn more. |
| ```status``` | ```"success"```, ```"error"```, ```"warning"```, ```"info"``` | The notification status. |
| ```text``` | ```"Lorem ipsum"``` | A text to be displayed. |
| ```title``` | ```"Lorem"``` | A title to be displayed. |

All parameters are optional but you must specify ```title``` or ```text``` at least.

### Methods

```js
import notifier from "notifier.js";

const notification = notifier.send({
    status: 'success',
    title: 'Lorem',
    autotimeout: null,
});

// close after 2000 milliseconds:
notification.close(2000);
```

### Stacks

By default, notifications will be pushed to the ```default``` stack which will be positioned top right. You may create more stacks by the following way:

**1. Create the CSS class**

Name your class like .notification-stack-```stack-name```:

```css
.notification-stack-secondary {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 50;
  width: 400px;
}
```

**2. Define the stack within you notifiaction**

```js
import notifier from "notifier.js";

const notification = notifier.send({
    stack: 'secondary',
    title: 'Lorem',
});
```

# Credits

- [Tobias Strub](https://www.tobento.ch)
- [All Contributors](../../contributors)
- [Tabler Icons](https://github.com/tabler/tabler-icons)