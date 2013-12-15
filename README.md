# Karma-preprocessor-pullscripts: download Javascript from your project's html

Tests usually require resources to be loaded, such as jquery and Angular. One can load these as files, but some apps don't keep local copies, and instead download scripts from CDNs, etc.

This preprocessor lets you load your project's HTML files, from which the files denoted by the `src` field in the `<script>` files are downloaded and included in the test suites.

Pros:

1. You do not need to manage local copies of resources using, e.g. bower
2. Your project's html files are used, meaning you are guaranteed that there is consistency between test and live resources

Cons:

1. Tests require Internet connectivity
2. Downloads on each test iteration

# Installation

    $ npm install karma-preprocessor-pullscripts

# Configuration

First, include html files in the `files` section of your `karma.conf.js`. These will be processed in order.

```js
files: [
    './path/to/file1.html',
    './path/to/file2.html',
```

Add `pullscripts` to your preprocessor list:

```js
preprocessors: {
    './path/to/*.html': 'pullscripts',
},
```

## Note on order

All scripts are processed in order of appearance in the HTML files. For example if `jquery` is included before `angular`, then the jquery script will be downloaded and included before the angular script. If you have multiple html files with different scripts included, you might need to ensure the load order (order in `files` array) is consistent.

# License

BSD
