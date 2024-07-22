# Image block tool for Editor.js

This [Editor.js](https://editorjs.io/) block tool allows you to add images. This implementation is directly taken from the [Editor.js Docs](https://editorjs.io/creating-a-block-tool/).

## Preview

#### Block Tool
![image](https://api.coolbytes.in/media/handle/view/image/314/)

#### Block Settings
![settings](https://api.coolbytes.in/media/handle/view/image/315/)

## Installation

**Using `npm`**

```sh
npm install @coolbytes/editorjs-image
```

**Using `yarn`**

```sh
yarn add @coolbytes/editorjs-image
```

## Usage

Include it in the `tools` property of Editor.js config:

```js
const editor = new EditorJS({
  tools: {
    image: Image
  }
});
```

## Config Params

|Field|Type|Optional|Default|Description|
|---|---|---|---|---|
|imageAlt|`string`|`Yes`|_picture_|Alternate text for images|
|enableCaption|`boolean`|`Yes`|`false`|Flag to enable image caption|
|captionPlaceholder|`string`|`Yes`|_Enter a caption_|Placeholder text for image caption|


### Custom Configuration

```js
const editor = EditorJS({
  tools: {
    image: {
      class: Image,
      inlineToolbar: true,
      config: {
        enableCaption: true,
        captionPlaceholder: 'Enter a caption'
      }
    }
  }
});
```

## Output data

|Field|Type|Description|
|---|---|---|
|url|`string`|Image src URL|
|caption|`string`|Image caption|
|withBorder|`boolean`|Indicates if image border is added|
|withBackground|`boolean`|Indicates if image background is added|
|stretched|`boolean`|Indicates if image is stretched|

&nbsp;

Example:

```json
{
  "time": 1715969561758,
  "blocks": [
    {
      "id": "_K5QcJHHuK",
      "type": "image",
      "data": {
        "url": "https://cdn.pixabay.com/photo/2017/09/01/21/53/blue-2705642_1280.jpg",
        "caption": "Source: Editor.js",
        "withBorder": true,
        "stretched": true,
        "withBackground": false
      }
    }
  ],
  "version": "2.29.1"
}
```