import { Component, OnInit } from '@angular/core';
import { CorporateModel, AddressModel } from 'src/app/core/model/user.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { postCodevalidation, requiredInput, validationPhoneNumber, emailValidation } from 'src/app/core/helper/custom-validate.helper';
import { GlobalService } from 'src/app/core/services/global.service';
import { LISTCITY_JAPAN } from 'src/app/core/constant/japan-constant';
declare var $: any;

@Component({
  selector: 'app-corporate-info',
  templateUrl: './corporate-info.component.html',
  styleUrls: ['./corporate-info.component.css']
})
export class CorporateInfoComponent implements OnInit {
  corporateInfor: CorporateModel;
  corporateForm: FormGroup;
  financialInforForm: FormGroup;
  picForm: FormGroup;
  editCorAddress: boolean;
  editCorPhone: boolean;
  editCorFax: boolean;
  editPersonBod: boolean;
  editPersonPic: boolean;
  editPersonPicname: boolean;
  editPersonPhone: boolean;
  editPersonEmail: boolean;
  editGender: boolean;
  corpAddress: AddressModel;
  listCityJapan: Array<string>;
  isSubmittedCor: boolean;
  showSaveCorp: boolean;
  showSavePic: boolean;
  STATUS_INFO = {
    approve: 'A',
    inProgress: 'P'
  };
  formType = {
    corporateInfor: 'corporateInfor',
    pic: 'pic'
  };
  saveType;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
              private userService: UserService,
              private globalService: GlobalService) { }

  ngOnInit() {
    this.listCityJapan = LISTCITY_JAPAN;
    this.resetEditPic();
    this.resetEditCorporateInfor();
    this.initCorporateForm();
    this.getCorporateInfor();
    this.initPicForm();
  }

  initCorporateForm() {
    this.corporateForm = new FormGroup({
      cor_postcode: new FormControl('', postCodevalidation),
      cor_prefec: new FormControl('', requiredInput),
      cor_district: new FormControl('', requiredInput),
      cor_house: new FormControl('', requiredInput),
      cor_build: new FormControl(''),
      cor_phone: new FormControl('', validationPhoneNumber),
      cor_fax: new FormControl('', requiredInput),
    });
  }

  initPicForm() {
    this.picForm = new FormGroup({
      person_bod: new FormControl('', requiredInput),
      person_pic: new FormControl('', requiredInput),
      per_picname: new FormControl('', requiredInput),
      person_picname: new FormControl('', requiredInput),
      person_gender: new FormControl('', requiredInput),
      person_phone: new FormControl('', validationPhoneNumber),
      person_email: new FormControl('', emailValidation),
    });
  }

  // initFinancialInforForm() {
  //   this.financialInforForm = new FormGroup({
  //     annualIncome: new FormControl('', requiredInput),
  //     financialAsset: new FormControl('', requiredInput),
  //     amountAvaiable: new FormControl('', requiredInput)
  //   })
  // }

  getCorporateInfor() {
    this.spinnerService.show();
    this.userService.getCorporateInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.corporateInfor = response.data;
        this.corporateForm.controls.cor_prefec.setValue(this.corporateInfor.corporation.address.value.city);
        this.corporateForm.controls.cor_district.setValue(this.corporateInfor.corporation.address.value.street);
        this.corporateForm.controls.cor_postcode.setValue(this.corporateInfor.corporation.zip.value);
        this.corporateForm.controls.cor_house.setValue(this.corporateInfor.corporation.address.value.street2);
        this.corporateForm.controls.cor_build.setValue(this.corporateInfor.corporation.address.value.fx_street3);
        this.corporateForm.controls.cor_phone.setValue(this.corporateInfor.corporation.mobile);
        this.corporateForm.controls.cor_fax.setValue(this.corporateInfor.corporation.fx_fax.value);
        if (this.corporateInfor.pic) {
          this.picForm.controls.person_bod.setValue(this.corporateInfor.pic.fx_dept);
          this.picForm.controls.person_pic.setValue(this.corporateInfor.pic.function);
          this.picForm.controls.per_picname.setValue(this.corporateInfor.pic.name);
          this.picForm.controls.person_picname.setValue(this.corporateInfor.pic.fx_name1);
          this.picForm.controls.person_phone.setValue(this.corporateInfor.pic.mobile);
          this.picForm.controls.person_email.setValue(this.corporateInfor.pic.email.value);
          this.picForm.controls.person_gender.setValue(this.corporateInfor.pic.fx_gender.value);
          this.corporateInfor.pic.fx_gender.value = this.globalService.checkGender(this.corporateInfor.pic.fx_gender.value);
        }
      }
    });
  }

  changeAddress() {
      const postNo = this.corporateForm.controls.cor_postcode.value;
      this.userService.getAddress(postNo).subscribe(response => {
        if (response.meta.code === 200) {
          this.corpAddress = response.data;
          this.corporateForm.controls.cor_postcode.setValue(this.corpAddress.postno);
          this.corporateForm.controls.cor_district.setValue(this.corpAddress.city + this.corpAddress.town);
          this.corporateForm.controls.cor_build.setValue(this.corpAddress.city);
          this.corporateForm.controls.cor_house.setValue(this.corpAddress.old_postcode);
          this.corporateForm.controls.cor_prefec.setValue(this.corpAddress.prefecture);
        }
      });
  }

  updateCorporate() {
    const param = {
      corporation: {
        zip: this.corporateForm.controls.cor_postcode.value,
        address: {
          city: this.corporateForm.controls.cor_prefec.value,
          street: this.corporateForm.controls.cor_district.value,
          street2: this.corporateForm.controls.cor_house.value,
          fx_street3: this.corporateForm.controls.cor_build.value,
        },
        mobile: this.corporateForm.controls.cor_phone.value,
        fx_fax: this.corporateForm.controls.cor_fax.value,
        lang: '',
      },
      pic: {
        name: this.picForm.controls.per_picname.value,
        fx_name1: this.picForm.controls.person_picname.value,
        fx_gender: this.picForm.controls.person_gender.value,
        email: this.picForm.controls.person_email.value,
        mobile: this.picForm.controls.person_phone.value,
        function: this.picForm.controls.person_pic.value,
        fx_dept: this.picForm.controls.person_bod.value
      }
    };
    if (this.saveType === this.formType.corporateInfor) {
      param.pic = null;
    }
    if (this.saveType === this.formType.pic) {
      param.corporation = null;
    }
    this.userService.changeCorporation(param).subscribe(response => {
      if (response.meta.code === 200) {
        if (this.saveType === this.formType.corporateInfor) {
          this.resetEditCorporateInfor();
        }
        if (this.saveType === this.formType.pic) {
          this.resetEditPic();
        }
        this.getCorporateInfor();
      }
    });
  }

  saveCorp(type) {
    this.saveType = type;
    this.isSubmittedCor = true;
    if (this.saveType === this.formType.corporateInfor) {
      if (this.corporateForm.invalid) {
        return;
      }
    }
    if (this.saveType === this.formType.pic) {
      if (this.picForm.invalid) {
        return;
      }
    }
    $('#modal-corporation').modal('show');

  }

  showEditFieldCor(field: string, type: string) {
    if (type === this.formType.corporateInfor) {
      this.showSaveCorp = true;
    }
    if (type === this.formType.pic) {
      this.showSavePic = true;
    }
    switch (field) {
      case 'cor-address':
        this.corporateForm.controls.cor_prefec.setValue(this.corporateInfor.corporation.address.value.city);
        this.corporateForm.controls.cor_district.setValue(this.corporateInfor.corporation.address.value.street);
        this.corporateForm.controls.cor_postcode.setValue(this.corporateInfor.corporation.zip.value);
        this.corporateForm.controls.cor_house.setValue(this.corporateInfor.corporation.address.value.street2);
        this.corporateForm.controls.cor_build.setValue(this.corporateInfor.corporation.address.value.fx_street3);
        this.editCorAddress = true;
        break;
      case 'cor-phone':
        this.corporateForm.controls.cor_phone.setValue(this.corporateInfor.corporation.mobile);
        this.editCorPhone = true;
        break;
      case 'cor-fax':
        this.corporateForm.controls.cor_fax.setValue(this.corporateInfor.corporation.fx_fax.value);
        this.editCorFax = true;
        break;
      case 'department':
        this.picForm.controls.person_bod.setValue(this.corporateInfor.pic.fx_dept);
        this.editPersonBod = true;
        break;
      case 'pic-position':
        this.picForm.controls.person_pic.setValue(this.corporateInfor.pic.function);
        this.editPersonPic = true;
        break;
      case 'pic-name':
        this.picForm.controls.person_picname.setValue(this.corporateInfor.pic.fx_name1);
        this.editPersonPicname = true;
        break;
      case 'p-phone':
        this.picForm.controls.person_phone.setValue(this.corporateInfor.pic.mobile);
        this.editPersonPhone = true;
        break;
      case 'p-email':
        this.picForm.controls.person_email.setValue(this.corporateInfor.pic.email.value);
        this.editPersonEmail = true;
        break;
      case 'p-gender':
        this.picForm.controls.person_gender.setValue(this.corporateInfor.pic.fx_gender.value);
        this.editGender = true;
        break;
    }
  }

  cancelEditCor(field: string, type: string) {
    if (type === this.formType.pic) {
      this.showSavePic = false;
    }
    if (type === this.formType.corporateInfor) {
      this.showSaveCorp = false;
    }
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
      case 'p-gender':
        this.editGender = false;
        break;
    }
  }

  resetEditPic() {
    this.showSavePic = false;
    this.editPersonBod = false;
    this.editPersonPic = false;
    this.editPersonPicname = false;
    this.editPersonPhone = false;
    this.editPersonEmail = false;
    this.editGender = false;
  }

  resetEditCorporateInfor() {
    this.showSaveCorp = false;
    this.editCorAddress = false;
    this.editCorPhone = false;
    this.editCorFax = false;
  }

}
