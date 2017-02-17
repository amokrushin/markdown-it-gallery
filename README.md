# markdown-it-gallery
[![NPM Stable Version][npm-stable-version-image]][npm-url]
[![Build Status][travis-master-image]][travis-url]
[![Test Coverage][codecov-image]][codecov-url-master]
[![Dependency Status][david-image]][david-url-master]
[![Node.js Version][node-version-image]][node-version-url]
[![License][license-image]][license-url]

> A markdown-it plugin for wrapping a sequence of images with a custom block element.

## Usage

### Options

- `galleryClass: String`
- `galleryTag: String` Default: `figure`
- `imgClass: String`
- `wrapImagesInLinks: Boolean` Default: `false`
- `linkClass: String`
- `linkTarget: String`  Link [target](https://developer.mozilla.org/en/docs/Web/HTML/Element/a#attr-target) attribute
- `imgTokenType: String` Default: `image`
- `linkTokenType: String` Default: `link`
- `imageFilterFn: function(token) { ... } => Boolean` token argument is a [Token](https://markdown-it.github.io/markdown-it/#Token) instance
- `imageSrcFn: function(token) { ... } => String` token argument is a [Token](https://markdown-it.github.io/markdown-it/#Token) instance
- `linkHrefFn: function(token) { ... } => String` token argument is a [Token](https://markdown-it.github.io/markdown-it/#Token) instance

### Example

```js
const Md = require('markdown-it');
const galleryPlugin = require('markdown-it-gallery');

const md = Md().use(galleryPlugin, {
    galleryClass: 'md-gallery',
    galleryTag: 'figure',
    imgClass: 'md-gallery__image',
    wrapImagesInLinks: true,
    linkClass: 'md-gallery__link',
    linkTarget: '_blank',
    imgTokenType: 'image',
    linkTokenType: 'link',
    imageFilterFn: token => /example.com/.test(token.attrGet('src')),
    imageSrcFn: token => token.attrGet('src').replace(/(\.\w+$)/, '-320x320$1'),
    linkHrefFn: token => token.attrGet('src').replace(/(\.\w+$)/, '-1920x1920$1'),
});

/**
 * @param {string} markdown
 * @returns {string} HTML
 */
function render(markdown) {
    return md.render(markdown);
}
```



Input markdown:


```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

![Gallery Image 1](http://example.com/image-1.jpg)
![Gallery Image 2](http://example.com/image-2.jpg)

Aliquam elit felis, varius non ligula et, vestibulum pulvinar libero.

![Gallery Image 3](http://example.com/image-3.jpg)

![Filtered Image 3](http://example.net/image-4.jpg)

Cras ut rutrum est, sodales porta orci. ![Inline image 1](http://example.com/inline-image-1.jpg) Quisque aliquet ipsum sit amet lacus consequat varius.

![Inline image 2](http://example.com/inline-image-2.jpg)
Proin pretium tortor in turpis tristique, in pharetra ipsum maximus.
```

Output HTML:

```html
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

<figure class="md-gallery">
    <a href="http://example.com/image-1-1920x1920.jpg" class="md-gallery__link" target="_blank">
        <img src="http://example.com/image-1-320x320.jpg" alt="Gallery Image 1" class="md-gallery__image">
    </a>
    <a href="http://example.com/image-2-1920x1920.jpg" class="md-gallery__link" target="_blank">
        <img src="http://example.com/image-2-320x320.jpg" alt="Gallery Image 2" class="md-gallery__image">
    </a>
</figure>

<p>Aliquam elit felis, varius non ligula et, vestibulum pulvinar libero.</p>

<figure class="md-gallery">
    <a href="http://example.com/image-3-1920x1920.jpg" class="md-gallery__link" target="_blank">
        <img src="http://example.com/image-3-320x320.jpg" alt="Gallery Image 3" class="md-gallery__image">
    </a>
</figure>

<p>
    <img src="http://example.net/image-4.jpg" alt="Filtered Image 3">
</p>

<p>
    Cras ut rutrum est, sodales porta orci. <img src="http://example.com/inline-image-1.jpg" alt="Inline image 1"> Quisque aliquet ipsum sit amet lacus consequat varius.
</p>

<p>
    <img src="http://example.com/inline-image-2.jpg" alt="Inline image 2">
    Proin pretium tortor in turpis tristique, in pharetra ipsum maximus.
</p>
```


[npm-stable-version-image]: https://img.shields.io/npm/v/markdown-it-gallery.svg
[npm-url]: https://npmjs.com/package/markdown-it-gallery
[travis-master-image]: https://img.shields.io/travis/amokrushin/markdown-it-gallery/master.svg
[travis-url]: https://travis-ci.org/amokrushin/markdown-it-gallery
[codecov-image]: https://img.shields.io/codecov/c/github/amokrushin/markdown-it-gallery/master.svg
[codecov-url-master]: https://codecov.io/github/amokrushin/markdown-it-gallery?branch=master
[david-image]: https://img.shields.io/david/amokrushin/markdown-it-gallery.svg
[david-url-master]: https://david-dm.org/amokrushin/markdown-it-gallery
[node-version-image]: https://img.shields.io/node/v/markdown-it-gallery.svg
[node-version-url]: https://nodejs.org/en/download/
[license-image]: https://img.shields.io/npm/l/markdown-it-gallery.svg
[license-url]: https://raw.githubusercontent.com/amokrushin/markdown-it-gallery/master/LICENSE.txt