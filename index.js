class GalleryPlugin {
    constructor(md, options) {
        this.md = md;
        this.options = Object.assign({
            galleryClass: '',
            galleryTag: 'figure',
            imgClass: '',
            wrapImagesInLinks: false,
            linkClass: '',
            linkTarget: '',
            imgTokenType: 'image',
            linkTokenType: 'link',
            imageFilterFn: null,
            imageSrcFn: null,
            linkHrefFn: null,
        }, options);

        md.core.ruler.after('inline', 'gallery', this.gallery.bind(this));
    }

    gallery(state) {
        const tokens = state.tokens;
        const CHILD_TYPES = ['image', 'softbreak'];

        for (let i = 1; i < tokens.length - 1; i++) {
            const token = tokens[i];
            if (token.type !== 'inline') continue;
            if (!token.children.length) continue;
            // children tokens are only of type image and softbreak
            if (!token.children.reduce((acc, t) => acc && CHILD_TYPES.includes(t.type), true)) continue;
            // prev token is paragraph open
            if (tokens[i - 1].type !== 'paragraph_open') continue;
            // next token is paragraph close
            if (!tokens[i + 1] || tokens[i + 1].type !== 'paragraph_close') continue;

            const children = token.children.filter(t => t.type === 'image');

            // optional image token filter
            if (typeof this.options.imageFilterFn === 'function') {
                if (!children.every(this.options.imageFilterFn)) continue;
            }

            tokens[i - 1].type = 'gallery_open';
            tokens[i - 1].tag = this.options.galleryTag;
            tokens[i + 1].type = 'gallery_close';
            tokens[i + 1].tag = this.options.galleryTag;

            if (this.options.galleryClass) {
                this.tokenAddClass(tokens[i - 1], this.options.galleryClass);
            }

            token.children = children.reduce((acc, child) => {
                child.type = this.options.imgTokenType;
                child.attrSet('alt', child.content);
                if (this.options.imgClass) {
                    this.tokenAddClass(child, this.options.imgClass);
                }
                if (this.options.wrapImagesInLinks) {
                    const Token = child.constructor;
                    const linkOpen = new Token(`${this.options.linkTokenType}_open`, 'a', 1);
                    const linkClose = new Token(`${this.options.linkTokenType}_close`, 'a', -1);
                    if (this.options.linkHrefFn) {
                        linkOpen.attrSet('href', this.options.linkHrefFn(child));
                    } else {
                        linkOpen.attrSet('href', child.attrGet('src'));
                    }
                    if (this.options.linkClass) {
                        linkOpen.attrSet('class', this.options.linkClass);
                    }
                    if (this.options.linkTarget) {
                        linkOpen.attrSet('target', this.options.linkTarget);
                    }
                    acc.push(linkOpen);
                    acc.push(child);
                    acc.push(linkClose);
                } else {
                    acc.push(child);
                }
                if (this.options.imageSrcFn) {
                    child.attrSet('src', this.options.imageSrcFn(child));
                }
                return acc;
            }, []);
        }
    }

    tokenAddClass(token, val) {
        const attrClass = token.attrGet('class');
        if (attrClass) {
            token.attrSet('class', `${attrClass} ${val}`);
        } else {
            token.attrSet('class', val);
        }
    }
}

module.exports = (md, options = {}) => new GalleryPlugin(md, options);
