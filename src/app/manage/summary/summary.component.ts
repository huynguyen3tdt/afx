import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  showSummary: boolean;
  showDetail: boolean;
  TAB = {
    summary: 'summary',
    detail: 'detail'
  };
  constructor() { }

  ngOnInit() {
    this.showSummary = true;
  }
  changeTab(type) {
    this.showSummary = type === this.TAB.summary;
    this.showDetail = type === this.TAB.detail;
  }
}
