# miSlider

  miSlider allows to select single or double values from a range.
  * [demo](https://iph9x.github.io/metalamp-4/index.html)

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

| Options | Defaults | Type | Description |
| --- | --- | --- | --- |
| `max` | `-` | `number` | Set slider max value |
| `min` | `-` | `number` | Set slider min value |
| `range` | `true` | `boolean` | Set `true` - for two thumbs, `false` - for one thumb |
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

This layer reacts to user interaction with the application.
There is the subViews: `Label`, `ProgressBar`, `Thumb`, `Scale`.

#### Label
| Property / Method | Type | Description |
| --- | --- | --- |
| `render()` | `function` | Return Jquery element of Label |
| `setValue()` | `function` | Set html content of Label element |
| `setPosition()` | `function` | Sets properties `top` / `bottom` / `left` / `right` (depends on `vertical` specified in the Options and on type of the thumb) relative to the Scale |

#### ProgressBar

| Property / Method | Type | Description |
| --- | --- | --- |
| `render()` | `function` | Return Jquery element of ProgressBar |
| `onProgressBarMousedown()` | `function` | Accepts a callback, which is used to set the position of a thumb on the scale |
| `setFromPosition()` | `function` | Set css `left` / `top` (depends on `vertical` specified in the Options) of a border of the ProgressBar's element |
| `setToPosition()` | `function` | Set css `right` / `bottom` (depends on `vertical` specified in the Options) of a border of the ProgressBar's element |

#### Thumb

| Property / Method | Type | Description |
| --- | --- | --- |
| `otherThumbPosition` | `number` | Stores the position of the opposite Thumb (if `range`: `true`)|
| `handleThumbMove()` | `function` | Handles the cursor position to set the position of the Thumb |
| `setPositionByValue()` | `function` | Processes the input value to set the position of the Thumb |
| `setIsActive(value: boolean)` | `function` | Sets activity of the Thumb |
| `render()` | `function` | Return jQuery element of Thumb |

#### Scale

| Property / Method | Type | Description |
| --- | --- | --- |
| `toThumbPosition` | `number` | Stores toThumb position as a percentage on the Slider |
| `fromThumbPosition` | `number` | Stores fromThumb position as a percentage on the Slider |
| `render()` | `boolean` | Return jQuery element of Scale |
| `handleScaleMousedown()` | `number` | Sets closest Thumb to the cursor position on the Scale |

### UML diagram
  * [UML](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1#R7Z1bc5s4FIB%2FTWZ2H7Jjbr48xmmStknatMkm7dOOYstAi5ELchzn16%2FAwgZ0jAGbSzAzmYkR4qbvSDo3xIlyPn29ctDMuCVjbJ3InfHrifLhRJYlVe6yf17JclXS7%2FIC3THHvNKm4N58w7yww0vn5hi7kYqUEIuas2jhiNg2HtFIGXIcsohWmxAretUZ0rFQcD9Cllj6ZI6pwZ9C7m3KP2JTN4IrS93Bas8UBZX5k7gGGpNFqEi5OFHOHULo6tf09RxbXuMF7fL0aflk3fzuXn3%2B5v5B%2Fw6vH748nq5OdpnlkPUjONimuU99R2fmT7d%2FdX2xmP4aobfl%2FPPwVJL5s9Fl0GB4zNqPbxKHGkQnNrIuNqXDTekNITNWTWKFvzClS44fzSlhRQadWnwvfjXpD%2Fa784%2FGt36G9nzwpK0TbCyDDZs6y9BB3ubP8L7NYf5WcNwYuQYe89M7ZG6P%2FS1vV8qG5A3ukrkz4q3y9nty%2BfFR%2FfVjdnf5bdG5Onv%2BfMobvEORo2OaUI%2F3GK9lQ0LJMV1hMsXs%2FlkFB1uImi9RyUW8A%2BjrehvI7AfnDDNPuusXZM35le4c7LIWwY4gDO7CnFrI9qhPiE0DufDaElmmbrPfo9WRyvAFO9RkHe%2BM76CebAxHhmmNb9CSzL0Wcika%2FQ62hgZxzDd2WhSICdvtUC5EbOAJ17j3juSXZrfL6twFGKV10Q1yKa8zIpaFZq757N%2BwV2XKMJn2kFBKpsGJItKx7uD%2BBnXI7%2FWQIWUWHq818Gsibr5XHvARh4%2BwAw5osRmupC4vM0JDFSvdLiH8at%2FZkIpsnbXB5nJKJ3I5SU17vdjlkMW424jiodeKriCX6yfNL6qSIKpTf4JSzlgpn6tiEssanYak08ITulU23RkambZ%2B49f5oG5KvvOn9ooIO3Zi%2BXJhmOMxtn25oYii53VfmBHTpn6zaEP2xxrv3Bu0NHZD52xb2myzP6%2B6Q8%2BJzUQMmb4sYSa3C%2BzJLiBliZ14t5Qto%2FSyUj7YsCMLLF9MvFihfPR%2BNY1kwuDCZ0Z4SjoMb02umLcq8BYIW6Y%2Fs4T0BHHU3YF%2FykD6Sgnn%2FeArJKeSIBOKKBMKwN9Cz9i6I65JTeKd31nVjclFVZ24108Htb8%2FU1hdFJg6c%2FuvvxvXdYvi1696ENYEgPPZmE3hlw6ZthxTc5SkEkdXsCeKs%2BkK5ANpMabHqKQcTwvDKE6SK4wtxPQQu2p5EC13%2BG2g3FqT%2Bej%2BzLq%2B%2Fj6ffD2VxFFVx8xWbjJHgU9atNs5prZ7i5ocuwJG0C5pfSLF%2B0SUTtRJoXQB4dAGonAogbc2o1Mk5oNRO%2FV1igwEMRVE9NgNq25qeUvwjkDidQDDCrzhnsDUxfTWPGLbKjNCBVADIISFTR99kCF6bSDDg7q2MpNOOxcUprWLigIj3VATulrUkMOkVNTgwNxII7ta0KBHpVTS4PB9T%2FGsZX1o1pDbpdSpWhId2a0fNA9JyPdSaq8VjaHWD5odI%2BR6KRVjkC3WOkL3sGGlqpUlYFjVG6sYF4ZRLVETgv3ZYnBJb6jSuwVOWq4J%2FqQSVRwYoiJAbHKsvgCEg6odSpJofMI5b21EoviIhNaPRiRSR6t6uQISmvZ%2BsjRlcagRRPTYIxLrvnzwhM2iQhLyttwET5979AobO5kUQBOKTpSbfrst9euBtDAPEIAoNeNEtJZ5AKLZKPMoeSu6tcjIhPV0CGXT%2B2QBIEtNyQRJglZz2ynzsCwzLxNkKWq0etsr85CsPDkTzM1scmZNERTLTM0EKYoZF3pTc2sKowjGB0qlKPqz9MaG2IvDCMUHQIyFvQUmegZuPF%2BKwLD1S5aQKT2IOgp7EjBW9wDxkPJlSkux18eVfi0ck%2FBLUqKdLMjoETkmkzvzXo5JSMCKGn5k0WRmzzjGTmNnkQIgQv5ICGJxLzCK5rKLaSD1Lcr9vJHlohStZYay2bZyARwhV2S5HEUr684hOlOO3CFyWu2uirWBOnm1O6352p1oTrba3bYu%2FX60OzEP%2F9i1u%2BwQq9fuxLxsYocmk1sydzEbUI9Y0ctOtXJFTxHtaR53Xo9nLcz3ou0pWyLPrQmWHSYYfC6KJn6bfp%2F2Df3yw%2FV%2Fl7dPXz7251fBQjKZ1nGNarjlr%2BoqR5Z1lU4yLOuaTd8OL%2BQK9wWOL7ySK1yRayeHW8rVP%2FTMcdAyVIHL%2FObMd17BRk3vxrJDB3Js7d94fSWpOvuxuoGDqudBm4bGl9WyzK0dWUH2ci%2BvHakkKPrvzo4Eo5KiqkrJgzGfPm%2BMNG%2BNUpuVACskN2NO3BGnTOjgexuSxWXWidrqhKmqLdq90UJry5aru7ZvHKRkmEWLhVaXLdP1o4h5Bcfu%2BskOsXq7Usy4M5DN%2BpGv%2FbWOnxxMqzcvOwKs%2BpuX9bEu%2BYC507oMYoYVW5dSR4so7wMp2bpUY8ZFrP7e5iUokUq1Etk7EpEMRpTyv12TeN%2BhycXX5wVhaJ0KZQSnI90%2BvU8h3yvRNfUpwHIKxL%2BogZ1jMz53K0P91FJXgV8BXrO9%2FbJJAVjT%2BhSKMj7VbWaL32VvWe85YoslM83KQ9UquEZrIP7D5ZFnJ2YnWrlfQQWXYv3kno08tbNFWVN3AsyyTfI6AEboLelSMWqVuoWC3%2F43YdcuogK%2FJSuS3MsGT2uCB%2F7CmpjgwRJo7wl6BPlGAoqFnvQVzAN7%2BASXXHy1MknToqdYSR0%2F6vD2b69GDuPOuxsZAu1554elg6WLajI09KT6UE%2Frk40ODR1V3cHd37rDjsmazPMe1kcY6uWp7VU6TQTJheV9aL4E6nXOSIzHjOQDx4ASGylkRnx9drHzkv5L9vJJGxDYIavpAwLdWBwwpX8%2B50oENf2QPSypbcLSTgt43ZvruEQqfMdiJMCdP7sjx3w%2BYodUdo5lLo4K3zKwOKrdosyBssylUeFbFh3%2FE9NpGdb0K%2FWw7aBVaTtkcTEV6Sqqh2KvBv6%2B4Mu4%2FeRkMC22YkHW%2Br0kwyH10aX5ubpVSmqn0ZIq2phKPthZRV74GPQOEY7fV9b6iSKfQ1JH%2Fw6%2F3Jw%2FjZTH8R%2FjB375NHu5AJYMZ9MfDswdYF4U7JBzYhHP4WWTlRVtWlasaKchvbZPFoZJ8T2bQr1rLhw0E7pFNhHNsl6eGml8TVRYVGiuSzBR0851IBfxLezj5CLFXmmFvAelgpFbMJBTRwWyPIviAr%2FWV%2B2r7hmm3K2vuudwLMfm1gNO3sFH%2B1KmgpcQT4Cx9yrFHo0npA4pSr1uBPw%2FnZ68A37aANNBJGLP1RDkYiSCbTqE0LACxEY8Y%2FXxM%2BXifw%3D%3D)

***

