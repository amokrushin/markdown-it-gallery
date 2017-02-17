const Md = require('markdown-it');
const galleryPlugin = require('..');

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

module.exports = render;
