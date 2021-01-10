import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit {
  @Input() title: string = 'Edit name';

  @Input() item: User;

  @Input() show: boolean = false;

  @Output() readonly resolve = new EventEmitter();

  @HostBinding('style.display') get closed() {
    return !this.show ? 'none' : 'block';
  }

  public form: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnChanges({ item }: SimpleChanges) {
    if(item.currentValue) {
      this.form?.patchValue(item.currentValue);
    }
  }

  ngOnInit() {
    this.form = this._fb.group({
      name: [, Validators.required],
      surname: [, Validators.required],
      age: [, Validators.required],
      agree: [, Validators.required],
      city: [, Validators.required]
    });
  }

  public submit() {
    if(this.form.valid) {
      const formValue = this.form.getRawValue();
      delete formValue.agree;
      this.resolve.emit(formValue);
      this.show = false;
      this.item = undefined;
      this.form.reset()
    } else {
      for(const control in this.form.controls) {
        this.form.controls[control].markAsDirty();
        this.form.controls[control].updateValueAndValidity()
      }
    }
  }
}
