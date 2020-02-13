import { Component, OnInit } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';

@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.css']
})
export class WithdrawHistoryComponent implements OnInit {

  public listBankInfor;
  public listDwHistory;
  public searchForm: FormGroup;
  public isSubmitted;
  public fromDate: Date = new Date();
  public toDate: Date = new Date();

  constructor(private withdrawRequestService: WithdrawRequestService, ) { }

  ngOnInit() {
    this.getBankInfor();
    this.getDwHistory();
    this.initSearchForm();
  }
  initSearchForm() {
    this.searchForm = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      history: new FormControl('')
    });
  }
  onSearchSubmit() {
    const fromDate = new Date(this.searchForm.controls.startDate.value).getTime();
    const toDate = new Date(this.searchForm.controls.endDate.value).getTime();
    if (fromDate > toDate) {
    }
    if (fromDate < toDate) {
      this.getDwHistory();
    }

  }
  getBankInfor() {
    this.withdrawRequestService.getBankInfor().subscribe(response => {
      if (response.status === 200) {
        this.listBankInfor = response.body.data;

      }
    });
  }
  getDwHistory() {
    this.withdrawRequestService.getDwHistory().subscribe(response => {
      if (response.status === 200) {
        this.listDwHistory = response.body.data.results;

      }
    });
  }
}
