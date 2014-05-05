# Karma-preprocessor-pullscripts: read Javascript referred to by your project's html

Instead of duplicating all your app's Javascript references in your Karma config, just refer to your HTML files, test files and mocks.

Also supports reading external Javascript files via HTTP.

This preprocessor lets you load your project's HTML files, from which the files denoted by the `src` field in the `<script>` files are read or downloaded and included in the test suites.

This is handy for running your tests againts your dist package.

Pros:

1. Your project's html files are used, meaning you are guaranteed that there is consistency between test and live resources
2. You do not need to manage local copies of resources using, e.g. bower

Cons for case 2:

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

Configure the file prefix:
```js
pullscripts: {
    // Prefix referenced local file names with this before reading them up.
    filePrefix: 'dist/'
},
```


## Note on order

All scripts are processed in order of appearance in the HTML files. For example if `jquery` is included before `angular`, then the jquery script will be downloaded and included before the angular script. If you have multiple html files with different scripts included, you might need to ensure the load order (order in `files` array) is consistent.

# License

BSD
