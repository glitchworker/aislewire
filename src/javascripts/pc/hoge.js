class Hoge {

  constructor() {
    if (Common.getName('Hoge')) {
      this.hoge();
    } else if (Common.getName('Hoge_fuga')) {
      this.hoge_fuga();
    }
  }

  hoge() {
    return console.log('hoge');
  }

  hoge_fuga() {
    return console.log('hoge_fuga');
  }

}

new Hoge();