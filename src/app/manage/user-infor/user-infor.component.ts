import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  requiredInput,
  emailValidation,
  validationPhoneNumber,
  postCodevalidation
} from 'src/app/core/helper/custom-validate.helper';
import { UserModel, AddressModel } from 'src/app/core/model/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { LISTCITY_JAPAN } from 'src/app/core/constant/japan-constant';
declare var $: any;

@Component({
  selector: 'app-user-infor',
  templateUrl: './user-infor.component.html',
  styleUrls: ['./user-infor.component.css']
})
export class UserInforComponent implements OnInit {
  userForm: FormGroup;
  userInfor: UserModel;
  editAddress: boolean;
  editEmail: boolean;
  editPhone: boolean;
  showSave: boolean;
  userAddress: AddressModel;
  isSubmittedUser: boolean;
  STATUS_INFO = {
    approve: 'A',
    inProgress: 'P'
  };
  listCityJapan: Array<string>;
  constructor(private userService: UserService, private globalService: GlobalService) { }

  ngOnInit() {
    console.log('in in in');
    this.listCityJapan = LISTCITY_JAPAN;
    this.resetEdit();
    this.initUserForm();
    this.getUserInfo();
  }

  initUserForm() {
    this.userForm = new FormGroup({
      postCode: new FormControl('', postCodevalidation),
      searchPrefe: new FormControl('', requiredInput),
      searchCountry: new FormControl('', requiredInput),
      house_numb: new FormControl('', requiredInput),
      name_build: new FormControl(''),
      email: new FormControl('', emailValidation),
      phone: new FormControl('', validationPhoneNumber),
    });
  }

  getUserInfo() {
    this.userService.getUserInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.userInfor = response.data;
        // this.county = response.data.address.value.street;
        this.userForm.controls.postCode.setValue(this.userInfor.zip.value);
        this.userForm.controls.searchPrefe.setValue(this.userInfor.address.value.city);
        this.userForm.controls.searchCountry.setValue(this.userInfor.address.value.street);
        this.userForm.controls.house_numb.setValue(this.userInfor.address.value.street2);
        this.userForm.controls.name_build.setValue(this.userInfor.address.value.fx_street3);
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.userForm.controls.phone.setValue(this.userInfor.mobile);
        this.userInfor.fx_gender = this.globalService.checkGender(this.userInfor.fx_gender);
      }
    });
  }

  changeAddress() {
      const postNo = this.userForm.controls.postCode.value;
      this.userService.getAddress(postNo).subscribe(response => {
        if (response.meta.code === 200) {
          this.userAddress = response.data;
          this.userForm.controls.postCode.setValue(this.userAddress.postno);
          this.userForm.controls.searchPrefe.setValue(this.userAddress.prefecture);
          this.userForm.controls.searchCountry.setValue(this.userAddress.city + this.userAddress.town);
          this.userForm.controls.house_numb.setValue(this.userAddress.old_postcode);
          this.userForm.controls.name_build.setValue(this.userAddress.city);
        }
      });
  }

  userSubmit() {
    this.isSubmittedUser = true;
    if (this.userForm.invalid) {
      return;
    }
    $('#modal-confirm').modal('show');
  }

  updateUser() {
    const param = {
      zip: this.userForm.controls.postCode.value,
      address: {
        city: this.userForm.controls.searchPrefe.value,
        street: this.userForm.controls.searchCountry.value,
        street2: this.userForm.controls.house_numb.value,
        fx_street3: this.userForm.controls.name_build.value,
      },
      email: this.userForm.controls.email.value,
      mobile: this.userForm.controls.phone.value,
      lang: ''
    };
    this.userService.updateUser(param).subscribe(response => {
      if (response.meta.code === 200) {
        this.showSave = false;
        this.editAddress = false;
        this.editEmail = false;
        this.editPhone = false;
        this.getUserInfo();
      }
    });

  }

  showEditField(field: string) {
    this.showSave = true;
    switch (field) {
      case 'address':
        this.userForm.controls.postCode.setValue(this.userInfor.zip.value);
        this.userForm.controls.searchPrefe.setValue(this.userInfor.address.value.city);
        this.userForm.controls.searchCountry.setValue(this.userInfor.address.value.street);
        this.userForm.controls.house_numb.setValue(this.userInfor.address.value.street2);
        this.userForm.controls.name_build.setValue(this.userInfor.address.value.fx_street3);
        this.editAddress = true;
        break;
      case 'email':
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.editEmail = true;
        break;
      case 'phone':
        this.userForm.controls.phone.setValue(this.userInfor.mobile);
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

  resetEdit() {
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
  }

}
