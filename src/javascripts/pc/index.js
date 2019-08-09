class Index {

  constructor() {
    if (Common.getName('Index')) {
      this.index();
    }
  }

  index() {
    return console.log('Index');
  }

}

new Index();