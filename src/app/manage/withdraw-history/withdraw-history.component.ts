import { Component, OnInit } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { TransactionModel, BankInforModel } from 'src/app/core/model/withdraw-request-response.model';

@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.css']
})
export class WithdrawHistoryComponent implements OnInit {

  listBankInfor: BankInforModel;
  listDwHistory: Array<TransactionModel>;
  searchForm: FormGroup;
  isSubmitted;
  fromDate: Date = new Date();
  toDate: Date = new Date();

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
      if (response.meta.code === 200) {
        this.listBankInfor = response.data;

      }
    });
  }
  getDwHistory() {
    this.withdrawRequestService.getDwHistory().subscribe(response => {
      if (response.meta.code === 200) {
        this.listDwHistory = response.data.results;

      }
    });
  }
}
