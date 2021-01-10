import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import { User } from '../../models/user.model';

const EMPTY_COUNT_ROWS = 4;

export interface Tabel<T> {
  rows: T[];
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() public rows: User[] = [];

  @Input() readonly add: Subject<User>;

  @Input() public canRemove: boolean = false;

  @Input() public canCopy: boolean = false;

  @Output() readonly removed = new EventEmitter();

  @Output() readonly copy = new EventEmitter();

  public showModal: boolean;

  public editItem: User;

  private _editIndex: number;

  get emptyRows() {
    const array = [];
    const count = EMPTY_COUNT_ROWS - this.rows.length;
    for (let index = 0; index < count; index++) {
      array.push({});
    }
    return array;
  }

  private _destroy = new Subject();

  ngOnInit() {
    if(this.add) {
      this.add
        .pipe(takeUntil(this._destroy))
        .subscribe((data) => {
          this.rows.unshift(data);
        })
    }
  }

  public copyTabel() {
    this.copy.emit(this.rows);
    this.rows = [];
  }

  public editRow(index: number, row: User) {
    this.showModal = true;
    this.editItem = row;
    this._editIndex = index;
  }

  public editResolve(data: User) {
    if(data) {
      this.rows[this._editIndex] = data;
    }

    this._editIndex = undefined;
    this.editItem = undefined;
    this.showModal = false;
  }

  public removeRow(index: number) {
    this.rows.splice(index, 1);
    if(this.rows.length === 0) {
      this.removed.emit();
    }
  }
}
