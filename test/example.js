const test = require('tape');
const fs = require('fs');
const render = require('../example/script');

function normalizeHtml(html) {
    return html.replace(/\n\s+/g, '').replace(/\n/g, '');
}

test('example', (t) => {
    const sample = {
        source: fs.readFileSync('./example/input.md').toString(),
        expected: normalizeHtml(fs.readFileSync('./example/output.html').toString()),
    };
    const actual = normalizeHtml(render(sample.source));
    t.equal(actual, sample.expected, 'render result match');
    t.end();
});
