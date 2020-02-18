import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Mt5Model, WithdrawAmountModel } from 'src/app/core/model/withdraw-request-response.model';
import { UserService } from './../../core/services/user.service';
import { UserModel } from 'src/app/core/model/user.model';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
  accountInfor: Mt5Model;
  withdrawAmount: WithdrawAmountModel;
  editAddress: boolean;
  editEmail: boolean;
  editPhone: boolean;
  editLanguage: boolean;
  userInfor: UserModel;

  constructor(
    private translateee: TranslateService,
    private withdrawRequestService: WithdrawRequestService,
    private userService: UserService) { }

  ngOnInit() {
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    this.editLanguage = false;
    this.getUserInfo();
    this.getMt5Infor();
    this.getWithDrawAmount();
  }

  changeLang(event) {
    this.translateee.use(event);
  }

  getUserInfo() {
    this.userService.getUserInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.userInfor = response.data;
      }
    });
  }

  getMt5Infor() {
    this.withdrawRequestService.getmt5Infor().subscribe(response => {
      if (response.meta.code === 200) {
        this.accountInfor = response.data;
      }
    });
  }

  getWithDrawAmount() {
    this.withdrawRequestService.getDwAmount().subscribe(response => {
      if (response.meta.code === 200) {
        this.withdrawAmount = response.data;
      }
    });
  }

  showEditField(field: string) {
    switch (field) {
      case 'address':
        this.editAddress = true;
        break;
      case 'email':
        this.editEmail = true;
        break;
      case 'phone':
        this.editPhone = true;
        break;
      case 'lang':
        this.editLanguage = true;
        break;
    }
  }

  cancelEdit(field: string) {
    switch (field) {
      case 'address':
        this.editAddress = false;
        break;
      case 'email':
        this.editEmail = false;
        break;
      case 'phone':
        this.editPhone = false;
        break;
      case 'lang':
        this.editLanguage = false;
        break;
    }
  }
}
