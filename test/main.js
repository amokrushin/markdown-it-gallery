const test = require('tape');
const Md = require('markdown-it');
const galleryPlugin = require('..');

function normalizeMarkdown(html) {
    return html.replace(/[ ]{12,}/g, '');
}
function normalizeHtml(html) {
    return html.replace(/\n\s+/g, '').replace(/\n/g, '');
}

test('two sequences of images', (t) => {
    const md = Md().use(galleryPlugin);
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
            ![](image-2.jpg)
            
            ![](image-3.jpg)
        `),
        expected: normalizeHtml(`
            <figure>
                <img src="image-1.jpg" alt="">
                <img src="image-2.jpg" alt="">
            </figure>
            <figure>
                <img src="image-3.jpg" alt="">
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('two sequences of images split with text', (t) => {
    const md = Md().use(galleryPlugin);
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
            ![](image-2.jpg)
            
            text
            
            ![](image-3.jpg)
        `),
        expected: normalizeHtml(`
            <figure>
                <img src="image-1.jpg" alt="">
                <img src="image-2.jpg" alt="">
            </figure>
            <p>text</p>
            <figure>
                <img src="image-3.jpg" alt="">
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('text after sequence of images', (t) => {
    const md = Md().use(galleryPlugin);
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
            ![](image-2.jpg)
            text
            
            ![](image-3.jpg)
        `),
        expected: normalizeHtml(`
            <p>
                <img src="image-1.jpg" alt="">
                <img src="image-2.jpg" alt="">
                text
            </p>
            <figure>
                <img src="image-3.jpg" alt="">
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('image alt', (t) => {
    const md = Md().use(galleryPlugin);
    const sample = {
        source: normalizeMarkdown(`
            ![Title A](image-1.jpg)
            ![Title B](image-2.jpg)
        `),
        expected: normalizeHtml(`
            <figure>
                <img src="image-1.jpg" alt="Title A">
                <img src="image-2.jpg" alt="Title B">
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('option wrapImagesInLinks', (t) => {
    const md = Md().use(galleryPlugin, { wrapImagesInLinks: true });
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
        `),
        expected: normalizeHtml(`
            <figure>
                <a href="image-1.jpg">
                    <img src="image-1.jpg" alt="">
                </a>
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('option galleryClass', (t) => {
    const md = Md().use(galleryPlugin, { galleryClass: 'gallery' });
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
        `),
        expected: normalizeHtml(`
            <figure class="gallery">
                <img src="image-1.jpg" alt="">
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('option imgClass', (t) => {
    const md = Md().use(galleryPlugin, { imgClass: 'image' });
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
        `),
        expected: normalizeHtml(`
            <figure>
                <img src="image-1.jpg" alt="" class="image">
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('options linkClass and linkTarget', (t) => {
    const md = Md().use(galleryPlugin, { wrapImagesInLinks: true, linkClass: 'link', linkTarget: '_blank' });
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
        `),
        expected: normalizeHtml(`
            <figure>
                <a href="image-1.jpg" class="link" target="_blank">
                    <img src="image-1.jpg" alt="">
                </a>
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('option imageFilterFn', (t) => {
    function imageFilterFn(token) {
        return !/image-2/.test(token.attrGet('src'));
    }

    const md = Md().use(galleryPlugin, { imageFilterFn });
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
            
            ![](image-2.jpg)
            
            ![](image-3.jpg)
        `),
        expected: normalizeHtml(`
            <figure>
                <img src="image-1.jpg" alt="">
            </figure>
            <p>
                <img src="image-2.jpg" alt="">
            </p>
            <figure>
                <img src="image-3.jpg" alt="">
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});

test('options linkHrefFn and imageSrcFn', (t) => {
    function linkHrefFn(token) {
        return token.attrGet('src').replace('image-1.jpg', 'image-1-800x800.jpg');
    }

    function imageSrcFn(token) {
        return token.attrGet('src').replace('image-1.jpg', 'image-1-320x320.jpg');
    }

    const md = Md().use(galleryPlugin, { wrapImagesInLinks: true, linkHrefFn, imageSrcFn });
    const sample = {
        source: normalizeMarkdown(`
            ![](image-1.jpg)
        `),
        expected: normalizeHtml(`
            <figure>
                <a href="image-1-800x800.jpg">
                    <img src="image-1-320x320.jpg" alt="">
                </a>
            </figure>
        `),
    };
    const actual = normalizeHtml(md.render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});
