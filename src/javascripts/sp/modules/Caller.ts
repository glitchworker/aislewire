import { Woman } from './Woman';
import { Man } from './Man';

export class Caller {
  public woman: Woman;
  public man: Man;

  constructor() {
    this.man = new Man();
    this.woman = new Woman();
  }

  call() {
    console.log(
      `My name is ${this.man.name}. ${this.man.age} years old from ${this.man.country}.`
    );
    console.log(
      `My name is ${this.woman.name}. ${this.woman.age} years old from ${this.woman.country}.`
    );
  }
}