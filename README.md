# Replace Keywords

Module that enables automatic transformation of keywords when writing inside a `contenteditable div` Element.

## Installation

Install with npm:

    npm i replace-keywords
    

## Initializing

We initialize replace-keywords by creating an instance and passing our target element ( `div` with attribute `contenteditable="true"` ), as well as a config object to it.

**HTML**
```html
<div id="textbox" contenteditable="true"></div>
```

**JS**
```js
import ReplaceKeywords from 'replace-keywords';

const element = document.querySelector('#textbox');

const rk = new ReplaceKeywords(element, { transformations: transformMap });

```

## Configuration

The `transformations` config expects an array of transformation objects with the following options:
  - `query` : The string or regular expression to identify the keyword
  - `value` : The string (or function, more about that later) to replace the keyword with
  - `appendSpace` : (optional, default = true) Whether to add a space after the inserted value. Recommended when inserting HTML to jump out of the inserted elements end-tag before continuing to type

**Example transformation map**

```js
const transformMap = [
  {
    query: 'red',
    value: 'blue',
  },
  {
    query: /\b((?:0|1):[0-5]\d)\b/g,
    value: (word, query) => `<span contenteditable="false" style="color: blue">
      <img src="icons/clock.svg" />${word}</span>`,
  },
]
```
As seen in the second example transformation, the value string can be generated by a function. This function will receive the word that tested positive against the query, as well as the query itself as arguments. It must always return a string.

In this specific example any timestamp from `0:00` to `1:59` is replaced with the same text, but wrapped in a styled span and prefixed with a little clock icon. 

## Events

### Replace

The attached element will emit a `replace` Event when a keyword is replaced

```js
const element = document.querySelector('#textbox');

element.addEventListener('replace', ({ detail }) => console.log(detail));

// Output:
{
  oldValue: ...
  newValue: ...
  config: { 
    query: ...
    value: ...
    appendSpace: ...
  },
},
```

## Tips

You can dynamically attach a different element to a `replace-keywords` instance by calling `attach(element)`. 

```js
const element = document.querySelector('#textbox');

const rk = new ReplaceKeywords(element, { transformations: transformMap });

const otherElement = document.querySelector('#other-textbox');

rk.attach(otherElement);
```

You can also detach from an element:
```js
rk.detach();
```

The transformation configuration of an instance can also be changed dynamically:

```js
rk.transformations.push({ query: '->', value: '&#10140;' });
```

