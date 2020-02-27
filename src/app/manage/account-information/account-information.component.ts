import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Mt5Model, WithdrawAmountModel } from 'src/app/core/model/withdraw-request-response.model';
import { UserService } from './../../core/services/user.service';
import { UserModel, CorporateResponse, CorporateModel } from 'src/app/core/model/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { IS_COMPANY } from 'src/app/core/constant/authen-constant';

declare var $: any;

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {


  constructor(
    private translateee: TranslateService,
    private withdrawRequestService: WithdrawRequestService,
    private userService: UserService) { }
  accountInfor: Mt5Model;
  withdrawAmount: WithdrawAmountModel;
  editAddress: boolean;
  editEmail: boolean;
  editPhone: boolean;
  editCorAddress: boolean;
  editCorPhone: boolean;
  editCorFax: boolean;
  editPersonBod: boolean;
  editPersonPic: boolean;
  editPersonPicname: boolean;
  editPersonPhone: boolean;
  editPersonEmail: boolean;
  // editLanguage: boolean;
  userInfor: UserModel;
  corporateInfor: CorporateModel;
  userForm: FormGroup;
  corporateForm: FormGroup;
  changePassForm: FormGroup;
  countries = ['Vietnamese', 'English'];
  postcode: any;
  isSubmitted: boolean;
  prefecture: any;
  county: any;
  showSave = false;
  showSaveCor = false;
  typeUser: string;
  corPrefecture: any;
  corDistrict: any;
  test: any;
  isCompany: string;





  ngOnInit() {
    this.initUserForm();
    this.initCorporateForm();
    this.initSettingForm();
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    this.editCorAddress = false;
    this.editCorPhone = false;
    this.editCorFax = false;
    this.editPersonBod = false;
    this.editPersonPic = false;
    this.editPersonPicname = false;
    this.editPersonPhone = false;
    this.editPersonEmail = false;
    this.getMt5Infor();
    this.getWithDrawAmount();
    this.getCorporateInfor();
  }

  initUserForm() {
    this.userForm = new FormGroup({
      postCode: new FormControl(),
      searchPrefe: new FormControl(),
      searchCountry: new FormControl(),
      house_numb: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      // language: new FormControl(),
    });
  }
  initCorporateForm() {
    this.corporateForm = new FormGroup({
      cor_postcode: new FormControl(),
      cor_prefec: new FormControl(),
      cor_district: new FormControl(),
      cor_house: new FormControl(),
      cor_build: new FormControl(),
      cor_phone: new FormControl(),
      cor_fax: new FormControl(),
      person_bod: new FormControl(),
      person_pic: new FormControl(),
      per_picname: new FormControl(),
      person_picname2: new FormControl(),
      person_phone: new FormControl(),
      person_email: new FormControl(),
    });
  }
  initSettingForm() {
    this.changePassForm = new FormGroup({
      current_password: new FormControl(),
      new_password: new FormControl(),
      confirm_password: new FormControl(),
    });
  }
  changeLang(event) {
    this.translateee.use(event);
  }

  getUserInfo() {
    this.userService.getUserInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.userInfor = response.data;
        this.prefecture = response.data.address.value.city;
        this.county = response.data.address.value.street;
        this.userForm.controls.postCode.setValue(this.userInfor.zip.value);
        this.userForm.controls.searchPrefe.setValue(this.userInfor.address.value.city);
        this.userForm.controls.searchCountry.setValue(this.userInfor.address.value.street);
        this.userForm.controls.house_numb.setValue(this.userInfor.address.value.street2);
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.userForm.controls.phone.setValue(this.userInfor.mobile);
      }
    });
  }

  getCorporateInfor() {
    this.userService.getCorporateInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.corporateInfor = response.data;
        this.isCompany = localStorage.getItem(IS_COMPANY);
        this.corPrefecture = this.corporateInfor.corporation.address.value.city;
        this.corDistrict = this.corporateInfor.corporation.address.value.street;
        this.corporateForm.controls.cor_postcode.setValue(this.corporateInfor.corporation.zip.value);
        this.corporateForm.controls.cor_house.setValue(this.corporateInfor.corporation.address.value.street2);
        this.corporateForm.controls.cor_build.setValue(this.corporateInfor.corporation.address.value.fx_street3);
        this.corporateForm.controls.cor_phone.setValue(this.corporateInfor.corporation.mobile);
        this.corporateForm.controls.cor_fax.setValue(this.corporateInfor.corporation.fx_fax.value);
        this.corporateForm.controls.person_bod.setValue(this.corporateInfor.pic.fx_dept);
        this.corporateForm.controls.person_pic.setValue(this.corporateInfor.pic.function);
        this.corporateForm.controls.per_picname.setValue(this.corporateInfor.pic.name);
        this.corporateForm.controls.per_picname2.setValue(this.corporateInfor.pic.fx_name1);
        this.corporateForm.controls.person_phone.setValue(this.corporateInfor.pic.mobile);
        this.corporateForm.controls.person_email.setValue(this.corporateInfor.pic.email.value);
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    // this.editLanguage = false;

    const param = {
      post_code: this.userForm.controls.postCode.value,
      prefecture: this.userForm.controls.searchPrefe.value,
      address: {
        county: this.userForm.controls.searchCountry.value,
        house_numb: this.userForm.controls.house_numb.value,
        email: this.userForm.controls.email.value,
      },
      phone: this.userForm.controls.phone.value,
      // lang: this.userForm.controls.language.value
    };
    this.userService.updateUser(param).subscribe(response => {
      if (response.meta.code === 200) {

        this.showSave = false;
        this.editAddress = false;
        this.editEmail = false;
        this.editPhone = false;
        // this.editLanguage = false;
        this.test = response.data.zip.status;
      }
    });
    // this.userService.getUserInfor(param).subscribe(response => {
    //   if (response.meta.code === 200) {
    //   }
    // });
  }

  showEditField(field: string) {
    this.showSave = true;
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
    }
  }

  cancelEdit(field: string) {
    this.showSave = false;
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
    }

  }
  showEditFieldCor(field: string) {
    this.showSaveCor = true;
    switch (field) {
      case 'cor-address':
        this.editCorAddress = true;
        break;
      case 'cor-phone':
        this.editCorPhone = true;
        break;
      case 'cor-fax':
        this.editCorFax = true;
        break;
      case 'department':
        this.editPersonBod = true;
        break;
      case 'pic-position':
        this.editPersonPic = true;
        break;
      case 'pic-name':
        this.editPersonPicname = true;
        break;
      case 'p-phone':
        this.editPersonPhone = true;
        break;
      case 'p-email':
        this.editPersonEmail = true;
        break;
    }
  }
  cancelEditCor(field: string) {
    this.showSaveCor = false;
    switch (field) {
      case 'cor-address':
        this.editCorAddress = false;
        break;
      case 'cor-phone':
        this.editCorPhone = false;
        break;
      case 'cor-fax':
        this.editCorFax = false;
        break;
      case 'department':
        this.editPersonBod = false;
        break;
      case 'pic-position':
        this.editPersonPic = false;
        break;
      case 'pic-name':
        this.editPersonPicname = false;
        break;
      case 'p-phone':
        this.editPersonPhone = false;
        break;
      case 'p-email':
        this.editPersonEmail = false;
        break;
    }
  }
  settingSave() {

  }
}
