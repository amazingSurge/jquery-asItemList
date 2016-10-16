# [jQuery asItemList](https://github.com/amazingSurge/jquery-asItemList) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that do amazing things.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asItemList.js
├── jquery-asItemList.es.js
├── jquery-asItemList.min.js
└── css/
    ├── asItemList.css
    └── asItemList.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asItemList/master/dist/jquery-asItemList.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asItemList/master/dist/jquery-asItemList.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asItemList --save
```

#### Install From Npm
```sh
npm install jquery-asItemList --save
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asItemList.git
cd jquery-asItemList
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asItemList` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asItemList.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asItemList.js"></script>
```

#### Required HTML structure

```html
<div class="example"></div>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asItemList(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asItemList/tree/master/examples).

## Options
`jquery-asItemList` can accept an options object to alter the way it behaves. You can see the default options by call `$.asItemList.setDefaults()`. The structure of an options object is as follows:

```
{
  namespace: 'asItemList',
  sortableID: 'asItemList-sortable',
  leng: 'en',
  itemList: function() {
    return '<div class="namespace-container">' +
      '<a class="namespace-addItem">' +
      '<i></i>{{strings.addTitle}}' +
      '</a>' +
      '<ul class="namespace-list"></ul>' +
      '<div class="namespace-prompt">{{strings.prompt}}</div>' +
      '</div>';
  },
  render: function(item) {
    return item;
  },
  process: function(value) {
    if (value) {
      const string = JSON.stringify(value);
      if (string === '[]') {
        return '';
      } else {
        return string;
      }
    }
    return '';
  },
  parse: function(value) {
    if (value) {
      return $.parseJSON(value);
    }
    return null;
  },
  // callback
  onInit: null,
  onReady: null,
  onAdd: null,
  onEdit: null,
  onAfterFill: null
}
```

## Methods
Methods are called on asItemList instances through the asItemList method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asItemList('destory');

// or
var api = $().data('asItemList');
api.destory();
```

#### val(value)
Get or set the value.
```javascript
// get the value
$().asItemList('val');

// set the value
$().asItemList('val', [{"icon":"fa-user","title":"User"},{"icon":"fa-cloud-upload","title":"Cloud-upload"}]);
```

#### set(value)
Set the value.
```javascript
$().asItemList('set', [{"icon":"fa-user","title":"User"},{"icon":"fa-cloud-upload","title":"Cloud-upload"}]);
```

#### get()
Get the value.
```javascript
$().asItemList('get');
```

#### enable()
Enable the item list functions.
```javascript
$().asItemList('enable');
```

#### disable()
Disable the item list functions.
```javascript
$().asItemList('disable');
```

#### destroy()
Destroy the item list instance.
```javascript
$().asItemList('destroy');
```

## Events
`jquery-asItemList` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asItemList::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
init    | Fires when the instance is setup for the first time.
ready   | Fires when the instance is ready for API use.
enable  | Fired when the `enable` instance method has been called.
disable | Fired when the `disable` instance method has been called.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asItemList.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asItemList.js"></script>
<script>
  $.asItemList.noConflict();
  // Code that uses other plugin's "$().asItemList" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asItemList` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asItemList` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asItemList/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asItemList.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asItemList/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asItemList.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asItemList
[license]: https://img.shields.io/npm/l/jquery-asItemList.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asItemList.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asItemList