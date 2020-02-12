import { Component, OnInit } from '@angular/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';

@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.css']
})
export class WithdrawHistoryComponent implements OnInit {

  public listBankInfor;

  constructor(private withdrawRequestService: WithdrawRequestService, ) { }

  ngOnInit() {
    this.getBankInfor()
  }
  getBankInfor() {
    this.withdrawRequestService.getBankInfor().subscribe(response => {
      if (response.status === 200) {
        this.listBankInfor = response.body.data;
        console.log('111', this.listBankInfor );


      }
    });
  }
}
