class TestLoader {

  constructor() {
    const body = new E(document.body);
    body.append('header', new E().set({ textContent : 'body.header: создан' }));
    console.log(body);
    body.header.set({ textContent : 'body.header: обновлён' });
    console.log(body);
    body.append('content', new E().set({ textContent : 'body.content' }));
    console.log(body);
    body.content.append('content', new E('p').set({ textContent : 'body.content.content' }));
    console.log(body);
    body.content.remove();
    console.log(body);
    body.append('content', body.content);
    console.log(body);
  }

}