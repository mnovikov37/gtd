class TestLoader {

  constructor() {
    const body = document.body;
    const f = new Field('Заголовок', document.createElement('button'));
    body.append(f);
    console.log(f.value());
    //f.value() = '123';
    //console.log(f.value());
    const f2 = new Field('Заголовок2');
    body.append(f2);
    console.log(f2.value());
    //f.value() = '123';
    //console.log(f.value());
    body.append(f2);
    body.append(f);
    const f3 = new Field('Заголовок3', f2);
    body.append(f3);
  }

}