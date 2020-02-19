import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/core/services/report.service';
import { ReportIDS } from 'src/app/core/model/report-response.model';
import * as moment from 'moment';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {

  currentPage: number;
  pageSize: number;
  totalItem: number;
  tab: string;
  listReport: Array<ReportIDS>;



  constructor(private reportservice: ReportService, ) { }

  ngOnInit() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.getReport(this.currentPage, this.pageSize, -1);
  }
  getReport(pageSize: number, pageNumber: number, type?: number) {
    this.checkTab(type);
    this.reportservice.getReport(pageSize, pageNumber, type).subscribe(response => {
      if (response.meta.code === 200) {
        this.listReport = response.data.results;
        this.listReport.forEach(item => {
          item.created_date = moment(item.created_date).format('YYYY/MM/DD');
        });
      }
    });
  }

  pageChanged(event) {
    this.currentPage = event.page;
    switch (this.tab) {
      case 'ALL':
        this.getReport(this.currentPage, this.pageSize, -1);
        break;
      case 'TRANSACTION':
        this.getReport(this.currentPage, this.pageSize, 0);
        break;
      case 'ANNUAL':
        break;
    }
  }
  checkTab(type: number) {
    switch (type) {
      case -1:
        this.tab = 'ALL';
        break;
      case 0:
        this.tab = 'TRANSACTION';
        break;
      case 1:
        this.tab = 'ANNUAL';
        break;
      // case 2:
      //   this.tab = 'CAMPAIGN';
      //   break;
    }
  }
}
