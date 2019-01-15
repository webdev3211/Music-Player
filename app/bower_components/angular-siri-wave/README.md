angular-siri-wave
====================

An [AngularJS](https://angularjs.org/) directive for displaying a siri-like wave.

Features
========

- Displays a siri-like wave.
- Adjustable dimensions, color, speed...
- No additional dependencies outside of AngularJS.

Installation
============

This module can be installed using bower:

```shell
bower install angular-siri-wave --save
```

Otherwise, simply add the `siriwave.js` and `angular-siri-wave.min.js` file to your project.

Usage
=====

Include the scripts in your application and include the `angular-siri-wave` module as a dependency in your application module.

```javascript
angular.module('myApp', ['angular-siri-wave']);
```

Add a `siri-wave` element to your application as required.

```html
<siri-wave
    width="{integer}"
    height="{integer}"
    ratio="{integer}"
    speed="{integer}"
    frequency="{integer}"
    amplitude="{integer}"
    speed-interpolation-speed="{integer}"
    amplitude-interpolation-speed="{integer}"
    color="{string}">
</siri-wave>
```

Attributes
----------

- `width` defines the pixel width. This defaults to __min($window.innerWidth, $window.innerHeight)/2__.
- `height` defines the pixel height. This defaults to __width__.
- `ratio` defines the height ratio. This defaults to window.devicePixelRatio if defined, else 1
- `speed` defines the speed. This defaults to __0.025__.
- `frequency` defines the frequency. This defaults to __6__.
- `amplitude` defines the amplitude. This defaults to __1__.
- `speed-interpolation-speed` defines the speed of interpolation for speed. This defaults to __0.005__.
- `amplitude-interpolation-speed` defines the speed of interpolation for amplitude. This defaults to __0.005__.
- `color` defines the pixel height. This defaults to __#fff__.

License
=======

angular-siri-wave is licensed under the MIT license. See LICENSE for details.
