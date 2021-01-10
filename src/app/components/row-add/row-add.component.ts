import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-row-add',
  templateUrl: './row-add.component.html',
  styleUrls: ['./row-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowAddComponent implements OnInit, OnChanges {
  @Input() public value: User;

  @Output() readonly resolve = new EventEmitter();

  @Output() readonly change = new EventEmitter();

  public form: FormGroup;

  private _destroy = new Subject();

  constructor(private _fb: FormBuilder) { }

  ngOnChanges({value}: SimpleChanges) {
    if(value) {
      this.form?.patchValue(value.currentValue)
    }
  }

  ngOnInit() {
    this.form = this._fb.group({
      name: [, Validators.required],
      surname: [, Validators.required],
      age: [, Validators.required],
      city: [, Validators.required]
    });

    this.form.valueChanges
      .pipe(takeUntil(this._destroy))
      .subscribe((data) => {
        this.change.emit(data);
      })
  }

  public submit() {
    if(this.form.valid) {
      this.resolve.emit(this.form.getRawValue());
      this.form.reset()
    } else {
      for(const control in this.form.controls) {
        this.form.controls[control].markAsDirty();
        this.form.controls[control].updateValueAndValidity()
      }
    }
  }

}
