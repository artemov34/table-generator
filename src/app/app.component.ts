import { Component } from '@angular/core';
import { Subject } from 'rxjs';

import { User } from './models/user.model';
import { Tabel } from './components/table/table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public tables: Tabel<User>[] = [];

  public addFromState: User;

  public addRow = new Subject<User>();

  public addFormChange(value: User) {
    this.addFromState = { ...value };
  }

  public copyTable(rows: User[]) {
    this.tables.unshift({ rows });
  }

  public removeTable(index: number) {
    this.tables.splice(index, 1);
  }
}
