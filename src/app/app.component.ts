import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  position: number;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  name!: string;
  phone!: string;
  displayedColumns: string[] = ['position','name', 'phone', 'action'];
  newData: any[]=[];

  dataSource = new MatTableDataSource();
  form!: FormGroup;
  
  @ViewChild(MatTable) table: MatTable<PeriodicElement>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog
    ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      position:[this.newData.length + 1],
      name: ['',Validators.required],
      phone: ['',Validators.required]
    })

  }

  ngAfterViewInit() {
    this.table.renderRows();
    this.dataSource = new MatTableDataSource(this.newData);
    this.dataSource.sort = this.sort;
  }


  sortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  
  save(){
     const value = this.form.getRawValue();
    if(this.form.valid){
      value.position = this.newData.length + 1;
      this.newData.push({...value});
      this.dataSource.data = this.newData;
      this.table.renderRows();   
    }else{
      alert('Preencha os campos corretamente!')
    } 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteByItem(obj) {
    var index = this.dataSource.data.indexOf(obj);
    if (index !== -1) {
      this.newData.splice(index, 1);
      this.dataSource.data = this.newData;
      this.table.renderRows(); 
    }
  }
    
  deleteAll(){
    while(this.newData.length > 0){
      this.newData.pop()
    }     
    this.dataSource.data = this.newData;
    this.table.renderRows();
  }

}
