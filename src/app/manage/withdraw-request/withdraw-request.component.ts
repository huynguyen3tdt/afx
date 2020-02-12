import { Component, OnInit } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { ACCOUNT_TYPE } from 'src/app/core/constant/authen-constant';

@Component({
  selector: 'app-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.css']
})
export class WithdrawRequestComponent implements OnInit {

  public listMt5Infor;
  public accountType;
  public listBankInfor;

  constructor(private withdrawRequestService: WithdrawRequestService, ) { }

  ngOnInit() {
    this.getMt5Infor();
    this.getBankInfor();
  }
  getMt5Infor() {
    this.withdrawRequestService.getmt5Infor().subscribe(response => {
      if (response.status === 200) {
        this.listMt5Infor = response.body.data;
        this.accountType = localStorage.getItem(ACCOUNT_TYPE);


      }
    });
  }
  getBankInfor() {
    this.withdrawRequestService.getBankInfor().subscribe(response => {
      if (response.status === 200) {
        this.listBankInfor = response.body.data;
        console.log('111', this.listBankInfor);


      }
    });
  }
}
