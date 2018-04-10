# Vacuum Analytics
A lightweight logging solution based on elasticsearch/logstash.

# Client libraries

## Javascript library

JavaScript library is designed to be used both in ```node``` and in browser apps.

### Node logging

Add dependncy into your app's package.json file:
```
"dependencies": {
  "va": "file:<path_to_repo>/js/library",
}
```

and then import library class into your app.js file:

```
const LogEvent = require('va').LogEvent;
```

See [example](https://github.com/sourcerer-io/vacuum-analytics/tree/master/js/samples/node) for how-to.

### In-browser logging

Copy ```<path_to_repo>/js/library``` and then include the script into your web app:

```
<script src='js/library/LogEvent.js'</script>
```

Refer to [example](https://github.com/sourcerer-io/vacuum-analytics/tree/master/js/samples/browser) for complete steps.

## Kotlin library

### Prerequirements
* Install [Java SE](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* Install [gradle](https://gradle.org/install/)

### Build

To build the [libarary](https://github.com/sourcerer-io/vacuum-analytics/tree/master/kotlin/libarary) and its [example](https://github.com/sourcerer-io/vacuum-analytics/tree/master/kotlin/sample):

```
cd kotlin && gradle build;
```

You can run the example by:
```
cd sample && gradle run;
```
