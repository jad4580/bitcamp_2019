import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['firstNm', 'lastNm', 'organization', 'link'];
  data = '';
  array = [];
  dataSource: MatTableDataSource<any>;
  loaded: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) {
    this.loaded = false;
  }

  ngOnInit() {
    this.http.get('../../assets/IA_Indvl_Feeds20.xml', {responseType: 'text'})
      .subscribe(data => {
        this.data = data;
      });
    setTimeout(() => {
      const parseString = require('xml2js').parseString;
      parseString(this.data, (err, result) => {
        // console.dir(result.IAPDIndividualReport.Indvls[0].Indvl);
        this.array = result.IAPDIndividualReport.Indvls[0].Indvl;
      });
      this.dataSource = new MatTableDataSource(this.array);
      console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loaded = true;

      /* configure filter */
      this.dataSource.filterPredicate =
        (data, filter: string) => {
          if (filter in data.Info[0].$ || filter in data.element.CrntEmps[0].CrntEmp[0].$) {
            return true;
          } else {
            return false;
          }
        };
    }, 1000);
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

export interface PeriodicElement {
  actvAGReg: string;
  firstNm: string;
  indvlPK: string;
  lastNm: string;
  link: string;
}
