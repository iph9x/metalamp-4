# miSlider

  miSlider allows to select single or double values from a range.
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
| `onClick()` | `function` | Accepts a callback, which is used to set the position of a thumb on the scale |
| `setFromPosition()` | `function` | Set css `left` / `top` (depends on `vertical` specified in the Options) of a border of the ProgressBar's element |
| `setToPosition()` | `function` | Set css `right` / `bottom` (depends on `vertical` specified in the Options) of a border of the ProgressBar's element |

#### Thumb

| Property / Method | Type | Description |
| --- | --- | --- |
| `otherThumbPosition` | `number` | Stores the position of the opposite Thumb (if `range`: `true`)|
| `setPositionHandler()` | `function` | Handles the cursor position to set the position of the Thumb |
| `setPositionByValue()` | `function` | Processes the input value to set the position of the Thumb |
| `setIsActive(value: boolean)` | `function` | Sets activity of the Thumb |
| `render()` | `function` | Return jQuery element of Thumb |

#### Scale

| Property / Method | Type | Description |
| --- | --- | --- |
| `toThumbPosition` | `number` | Stores toThumb position as a percentage on the Slider |
| `fromThumbPosition` | `number` | Stores fromThumb position as a percentage on the Slider |
| `render()` | `boolean` | Return jQuery element of Scale |
| `clickHandler()` | `number` | Sets closest Thumb to the cursor position on the Scale |

### UML diagram
  * [UML](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=Untitled%20Diagram5-2.drawio#R7Z1Zc6M4EIB%2FTap2HzLFZWw%2Fxs4xR2bWM8kkM09bslEME0BeIcdxfv0KLGywFAzEHI5VlaoYIS59rVZ3qxEn%2BtB7vsJgZn9FFnRPNMV6PtHPTzRNNTST%2FgtLlquSnskKptixWKVNwY3zAlmhwkrnjgWDVEWCkEucWbpwgnwfTkiqDGCMFulqD8hNX3UGppAruJkAly%2B9dyxis6fQupvyj9CZ2vGVVbO%2F2uOBuDJ7ksAGFlokivSLE32IESKrX97zELph48Xtcv9pee9eP5pXn78H%2F4Gfgy%2B33%2B5OVye7LHLI%2BhEw9EnpU4%2FIzPkd9K6%2BXCy8PxPwspx%2FHpyqGns2sowbDFq0%2FdgmwsRGU%2BQD92JTOtiUXiM0o9VUWvgHErJk%2BMGcIFpkE89le%2BGzQ37R38qHDtv6ndhzHkqbEm8s4w2f4GXioHDzd3Lf5rBoKz7OAoENLXZ6jOa%2BFW2Fu3I2JGvwAM3xhLXKy%2BPD5cc748%2Bv2ejy%2B0K5Oht%2FPmUNrhCAp5Bk1GM9JmzZhFAyTFcQeZDeP62AoQuI85SWXMA6wHRdbwOZ%2FmCcxcyz7voJuHN2pRGGAW0RiDlhCBaO5wI%2FpP6AfBLLRdiWwHWmPv09WR2pD54gJg7teGdsBwllYzCxHde6Bks0D1soIGDyGG8NbISdF3paEIsJ3Y0JEyKqeJI1bsIj2aXp7dI6oxijui66BgFhdSbIdcEscMbRDYdVPIrJ8QeIEOTFJ0pJx7qDRxsEo8e1ylALC0%2FYGvA5Ezfbq%2FWZxmEats8ALTbqSjVZmZ1QVZqivC4h7Go%2FqEoF%2FpS2weZyupK6nGrkvZ6ZvhxwKXcfEDgIWzHg5HL9pOVFVeVE1YsGKP2MlrKxaktiaaOThHS68IG8KpvBDEwcf3od1Tk3NiU%2F2FOHRYge%2B%2BBGcmE7lgX9SG4IIGC87gsz5PgkapbOgP7RxhuGSqtDb2hIt9XNNv0Lq2MyRD4VMeBEsgSp3C5gKLsCKcvsxLulbJmmV5Ty3tSOxrF8cuBihfIu%2FPXeSGYoFzYyioek%2FfDuaA3zNjjeHGHXiUaWhJ3Aa90d%2BD0KMjJKGO%2FbyCA5VTmZ0HmZ0AX8XTCG7ggFDnFQeH68qrslF0114m4vH9Te25mKzUWOKZ77f%2F397rpuVfx6TSvhDgdwPrPoEH6JkSc55uaoqjVqV2FP5EfTFchbJDHmx6jn1KeVYeQHyRVGCTE%2FRNNoWKmaHEShPSt96fp9aUPJ69x2yznTpa9XvzPd5cTUc%2FyV%2F%2BXPvbEg%2BnMkKsfMLWVt8aV7PErw%2FK5R7tWZLgy8TmdaaCfwQ8wDDjWvJF4R8byedmXEeW0dzqlI3hXxVpUarUghcF6nBwTOJPLqkOslbbW9DeN9DjmH%2BNhDpMWpdnIaZ3uIkYrnrPggqYyxlQFZp18v1Mh895QxtuIYc09nV4UxzkSSQbY3eLxqjS6vmKKce3ojQqNGJ1Y8MvI%2BjTiHQ0ZKq4%2BUdnrpNKDcalorFSjtdA4o60gQXpOR0lQPPpxQqcpbcTJWWsCtLo688cwjjTf4ZLS0WuZ1hkvFzHnzUMZLqyRea8BUjFzjkMuIacXQGw%2BZajoHnYN87DHTElybDppqryVCHXfQtATJxrOhtNdyTI85bFoCZPNxU75PXodqjGMowzXVh2v0fjp%2B0lVziodaLl6jbr0lpvdaEa8R50Lz%2Ft4x2wTZnXnvkZuq3jUReHT0GS2Ij2IU2RNEvek5VJGTBkks9RJlfpRm0%2FaAwPWiKO%2FCLcmxne%2BAiTnyyaQjjKbUOAoGgA%2BZSOuuhtcW1LLWXef9W3f8rLG07l7r0odj3fFzrMdu3RWH2Lx1x0%2BuIn%2FoOpNHifGALDudd6CpZReGXqWhXhxn4waeznvOFOctkjCLw6z1TX%2F44v3wevb08vzLv5df77997M2v4lfEC63QljZq61%2BvTUst2KaeFFiwrZiJnVyiTdwXGL7kGm3iiswg2d8ibdGhZxiDZaICk%2FnNmUdhwcYyN7fy5Pra1qp%2B2%2FX1rOr0x%2BoG9mqRx22a0C%2BrBRel69hAHme3pOvYf%2Feeoy5zBXaOiOu%2BfDCeo85PSx6751gcYuOeo85nCUxCv%2FEj8Glnkixb6j4KLVTlAC3U9hiovZwGajzT0LCBqiqdtMWpZhuoxpZ9slX%2FzRaqUCL1ZiWyeyQiGWuU%2Bhe2zrzvxJhya8%2B9sfRLmpjSyuGWdAWjlFpuIa6D8ksEUXNiQxwJ68bwf8dp7HltoV5uqctwTkRSVt2CjnLZ4wqwil4pE2Gtyuc0eG8lkcUkfZbCQEU%2BS739lE%2BCOaos9T1xFM111cuRzw45osU99kRROMlVL0ZBOsiRrO6xL4aitaxrZdhpNA4U%2F46%2BELWOCVX4ZSme5Juc7rw%2BdxwfbInPHVtmDYVaykE3dDWJ%2FVT5oGj9HeyjrRHEDm23MDDQGoFoWRCm0z88LZDSARuVUK0WyPpI0s4vysWrmrQEerdFUwBKXi3QGtUfO0O7qXfbRV1tD%2FW8UfZ0V1cMo21qP7cwtEvtdxtV%2B3HGWX3fFa2BepvT1LZnAbU9z%2BplNlLCSfxnHED8lP%2FDpdqJnOLZIav5p3jMrZndat9Ib%2Bl3S8WSKjPPdoY41r35YDLPTH5uJ5iPgwl2xkccbizOsfHkM1OwRI0vUZZA2firS6bgyzgOlgwP6X2lbqdJ36FIyKjK0E87DHsjjt%2FFH7TrZaf3dRTlTfW7WY5D7qPXj7fyn9hR%2B7frumaTklok2n14ksr7mHo52EVFnvuG4w4R3r6vovUzRb6EpE5%2BDr5dD%2B8n%2Bp31n%2F0LPn2aPV2sP6O6GRbp8Adjd0cwLnJ%2ByBC5KAx4%2BWjlRTuuu1W005Fe%2BycL2yHwhg6h4TUXGMy4blFMRIusm2akGr%2FDGyyGaKzLcFHzjnVCLvyrucfJRd16z1EUPagVjCbBiII6hiBvd09c6CZGiCT1Hn1Qe%2FVJEP3ifw%3D%3D)

***

