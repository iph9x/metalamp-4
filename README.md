# miSlider
  * [demo](https://github.com/iph9x/metalamp-4)

***

## Dependencies
  * [jQuery 3.5.x+](https://jquery.com)

## Using

```html
<html>
  <head>
    <link href="./css/miSlider.css" rel="stylesheet" />
    <body>
      <script type="text/javascript" src="./js/miSlider.min.js"></script>
    </body>
  </head>
</html>
```
To initialise the slider, call miSlider on the element:
```js
$("selector").miSlider({ ...options });
```

## Options

| Options | Defaults | Type | Descriptions |
| --- | --- | --- | --- |
| `max` | `-` | `number` | Set slider max value |
| `min` | `-` | `number` | Set slider min value |
| `range` | `true` | `boolean` | set `true` - for two thumbs, `false` - for one thumb |
| `step` | `1` | `number` | Set slider's step |
| `from` | `-` | `number` | Default min thumb position |
| `to` | `-` | `number` | Default min thumb position |
| `labels` | `true` | `boolean` | Set labels visibility above the thumbs |
| `vertical` | `false` | `boolean` | Set slider orientation |
| `inputFromId` | `-` | `string` | Set id of which input the fromValue is synchronized with |
| `inputToId` | `-` | `string` | Set id of which input the toValue is synchronized with |

## Installation

```
  npm install
```

## Run tests

```
  npm test
```

## Application architecture

The application architecture is built using the MVP pattern.

### Presenter

Presenter has a dependency on the Model and View through the observer pattern.
* Updates the View when the Model is updated.
* Updates the Model when user interacts with the View.

### Model

This layer contains the business logic of the application and has no dependencies on other layers.

### View

This layer reacts to user interaction with the application;
There is the subViews: `Label`, `ProgressBar`, `Thumb`, `Scale`.

### UML diagram
  * [UML](https://draw.io/)

***

