import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['firstNm', 'lastNm', 'organization', 'city', 'link', 'state', 'options'];
  data = '';
  array = [];
  stateArray = [];
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
        this.array = result.IAPDIndividualReport.Indvls[0].Indvl;
      });
      this.dataSource = new MatTableDataSource(this.array);
      console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loaded = true;

      for (let i = 0; i < this.array.length; i++) {
        let state = this.array[i].CrntEmps[0].CrntEmp[0].$.state;
        if (state != '' && this.stateArray.includes(state) === false) {
          this.stateArray.push(state);
        }
      }
      this.stateArray.sort();
    }, 1000);
  }


  applyStateFilter(filterValue: string) {
    /* configure filter */
    console.log(filterValue);
    this.dataSource.filterPredicate =
      (data, filter: string) => {
        if (data.CrntEmps[0].CrntEmp[0].$.state !== undefined) {
          return data.CrntEmps[0].CrntEmp[0].$.state == filter;
        } else {
          return false;
        }
      };
    this.dataSource.filter = filterValue;
    //
    // this.dataSource.data = this.dataSource.data.filter((element) => {
    //   if (element.CrntEmps[0].CrntEmp[0].$.state !== undefined) {
    //     return element.CrntEmps[0].CrntEmp[0].$.state == filterValue;
    //   } else {
    //     return false;
    //   }
    // });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
