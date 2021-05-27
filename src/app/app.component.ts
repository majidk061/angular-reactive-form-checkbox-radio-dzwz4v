import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  ValidatorFn
} from '@angular/forms';

const RADIO_LIST_FROM_DATABASE = [
  { name: '🍏', checked: false },
  { name: '🍋', checked: false },
  { name: '🍓', checked: true },
  { name: '🍌', checked: false },
  { name: '🍉', checked: false },
  { name: '🥝', checked: false }
];

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular';
  fruits: any[];
  form: FormGroup;

  ngOnInit() {
    // bind props with data from database
    this.fruits = RADIO_LIST_FROM_DATABASE;
    // build reactive form skeleton
    this.form = new FormGroup({
      user_gender: new FormControl(null),
      fruits: new FormArray([], minSelectedCheckboxes(1))
    });
    // bind existing value to form control
    this._patchValues();
  }

  private _patchValues() {
    // get array control
    const formArray = this.form.get('fruits') as FormArray;
    // loop each existing value
    this.fruits.forEach(fruit => {
      formArray.push(
        new FormGroup({
          name: new FormControl(fruit.name),
          checked: new FormControl(fruit.checked)
        })
      );
    });
  }

  submitForm() {
    const value = this.form.value;
    const selectedFruit = this.form.value.fruits.filter(f => f.checked);
    // form value binded
    console.log('current form value: ', value);
    console.log('only selected form value: ', selectedFruit);
    // original value from database not change
    console.log('original fruits list: ', this.fruits);
  }
}

function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control['controls'].checked.value)
      .reduce((prev, next) => (next ? prev + next : prev), 0);
    console.log(totalSelected);
    return totalSelected >= min ? null : { required: true };
    // return { required: true };
  };

  return validator;
}
