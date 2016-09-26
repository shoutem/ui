import htmlparser2 from 'htmlparser2';

export default function createDOM(rawHtml, done) {
  const handler = new htmlparser2.DomHandler((err, dom) => {
    if (err) {
      done(err);
    }

    done(null, dom);
  });

  const parser = new htmlparser2.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}
