import { Component, OnInit } from '@angular/core';
import { CorporateModel, AddressModel, LabelModel, QuestionModel } from 'src/app/core/model/user.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import {
  postCodevalidation,
  requiredInput,
  validationPhoneNumber,
  emailValidation,
  experienceValidation,
  fullWidthRequired
} from 'src/app/core/helper/custom-validate.helper';
import { GlobalService } from 'src/app/core/services/global.service';
import { LISTCITY_JAPAN } from 'src/app/core/constant/japan-constant';
import {
  businessEntityAnnualCorporation,
  taxCorporation, businessCapital,
  investmentCorporation,
  backgroundApplicationInvidual,
  investExFxInvidual,
  invesExCfdInvidual,
  investStockTradingInvidual,
  investMarginTradingInvidual,
  investCommoditiesInvidual,
  tradingExperienceInvidual
} from 'src/app/core/constant/question-constant';
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
  purposeInvestForm: FormGroup;
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
  isSubmittedPic: boolean;
  showSaveCorp: boolean;
  showSavePic: boolean;
  STATUS_INFO = {
    approve: 'A',
    inProgress: 'P'
  };
  formType = {
    corporateInfor: 'corporateInfor',
    pic: 'pic',
    financial: 'financial',
    purpose: 'purpose'
  };
  saveType;
  listBusinessEntityAnnualCorporation: Array<LabelModel>;
  listTaxCorporation: Array<LabelModel>;
  listBusinessCapitalCorporation: Array<LabelModel>;
  listInvestmentCorporation: Array<LabelModel>;
  listBackgroundApplicationInvidual: Array<LabelModel>;
  listInvestExFxInvidual: Array<LabelModel>;
  listInvesExCfdInvidual: Array<LabelModel>;
  listInvestStockTradingInvidual: Array<LabelModel>;
  listInvestMarginTradingInvidual: Array<LabelModel>;
  listInvestCommoditiesInvidual: Array<LabelModel>;
  listTradingExperienceInvidual: Array<LabelModel>;
  editFinancial: boolean;
  editPurpose: boolean;
  listFinancialSubmit: Array<QuestionModel>;
  listPurposeSubmit: Array<QuestionModel>;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
              private userService: UserService,
              private globalService: GlobalService) { }

  ngOnInit() {
    this.listCityJapan = LISTCITY_JAPAN;
    this.editFinancial = false;
    this.editPurpose = false;
    this.resetEditPic();
    this.resetEditCorporateInfor();
    this.initCorporateForm();
    this.getCorporateInfor();
    this.initPicForm();
    this.initFinancialInforForm();
    this.initPurposeInvestForm();
    this.listBusinessEntityAnnualCorporation = businessEntityAnnualCorporation.labels;
    this.listTaxCorporation = taxCorporation.labels;
    this.listBusinessCapitalCorporation = businessCapital.labels;
    this.listInvestmentCorporation = investmentCorporation.labels;

    this.listBackgroundApplicationInvidual = backgroundApplicationInvidual.labels;
    this.listInvestExFxInvidual = investExFxInvidual.labels;
    this.listInvesExCfdInvidual = invesExCfdInvidual.labels;
    this.listInvestStockTradingInvidual = investStockTradingInvidual.labels;
    this.listInvestMarginTradingInvidual = investMarginTradingInvidual.labels;
    this.listInvestCommoditiesInvidual = investCommoditiesInvidual.labels;
    this.listTradingExperienceInvidual = tradingExperienceInvidual.labels;
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
      person_picname: new FormControl('', fullWidthRequired),
      person_gender: new FormControl('', requiredInput),
      person_phone: new FormControl('', validationPhoneNumber),
      person_email: new FormControl('', emailValidation),
    });
  }

  initFinancialInforForm() {
    this.financialInforForm = new FormGroup({
      businessEntityAnnual: new FormControl('', requiredInput),
      tax: new FormControl('', requiredInput),
      businessCapital: new FormControl('', requiredInput),
      investment: new FormControl('', requiredInput)
    });
  }

  initPurposeInvestForm() {
    this.purposeInvestForm = new FormGroup({
      investPurpose: new FormControl('', requiredInput),
      investPurposeSortTerm: new FormControl(false),
      investPurposeMedium: new FormControl(false),
      investPurposeExchange: new FormControl(false),
      investPurposeInterestRate: new FormControl(false),
      investPurposeForeignCurrency: new FormControl(false),
      investPurposeOther: new FormControl(false),
      otherPurpose: new FormControl(''),
      backgroundApplication: new FormControl('', requiredInput),
      specificName: new FormControl(''),
      investExFx: new FormControl('', experienceValidation),
      inversExCfd: new FormControl('', experienceValidation),
      investStockTrading: new FormControl('', requiredInput),
      investMarginTrading: new FormControl('', requiredInput),
      investCommodities: new FormControl('', experienceValidation),
      other: new FormControl('1', requiredInput),
      financialInstrument: new FormControl(''),
      tradingExperience: new FormControl('')
    });
  }

  getCorporateInfor() {
    this.spinnerService.show();
    this.userService.getCorporateInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.spinnerService.hide();
        this.corporateInfor = response.data;
        if (this.corporateInfor.corporation) {
          this.corporateForm.controls.cor_prefec.setValue(this.corporateInfor.corporation.address.value.city);
          this.corporateForm.controls.cor_district.setValue(this.corporateInfor.corporation.address.value.street);
          this.corporateForm.controls.cor_postcode.setValue(this.corporateInfor.corporation.zip.value);
          this.corporateForm.controls.cor_house.setValue(this.corporateInfor.corporation.address.value.street2);
          this.corporateForm.controls.cor_build.setValue(this.corporateInfor.corporation.address.value.fx_street3);
          this.corporateForm.controls.cor_phone.setValue(this.corporateInfor.corporation.mobile);
          this.corporateForm.controls.cor_fax.setValue(this.corporateInfor.corporation.fx_fax.value);
        }
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
        if (this.corporateInfor.surveys.length > 0) {
          if (this.corporateInfor.surveys.find(item =>
             item.question_cd === 'corp_inv_purpose' && item.sequence === 1)) {
            this.purposeInvestForm.controls.investPurposeSortTerm.setValue(true);
          }

          if (this.corporateInfor.surveys.find(item =>
             item.question_cd === 'corp_inv_purpose' && item.sequence === 2)) {
            this.purposeInvestForm.controls.investPurposeMedium.setValue(true);
          }
          if (this.corporateInfor.surveys.find(item =>
             item.question_cd === 'corp_inv_purpose' && item.sequence === 3)) {
            this.purposeInvestForm.controls.investPurposeExchange.setValue(true);
          }
          if (this.corporateInfor.surveys.find(item =>
             item.question_cd === 'corp_inv_purpose' && item.sequence === 4)) {
            this.purposeInvestForm.controls.investPurposeInterestRate.setValue(true);
          }

          if (this.corporateInfor.surveys.find(item =>
             item.question_cd === 'corp_inv_purpose' && item.sequence === 5)) {
            this.purposeInvestForm.controls.investPurposeForeignCurrency.setValue(true);
          }

          if (this.corporateInfor.surveys.find(item =>
             item.question_cd === 'corp_inv_purpose' && item.sequence === 6)) {
            this.purposeInvestForm.controls.investPurposeOther.setValue(true);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_other_exp_yn')) {
            this.purposeInvestForm.controls.other.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_other_exp_yn').sequence.toString());
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_other_name_exp')) {
            this.purposeInvestForm.controls.financialInstrument.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_other_name_exp').value_text);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_stock_exp')) {
            this.purposeInvestForm.controls.investStockTrading.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_stock_exp').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_margin_exp')) {
            this.purposeInvestForm.controls.investMarginTrading.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_margin_exp').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_comm_exp')) {
            this.purposeInvestForm.controls.investCommodities.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_comm_exp').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_fx_exp')) {
            this.purposeInvestForm.controls.investExFx.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_fx_exp').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_other_exp')) {
            this.purposeInvestForm.controls.tradingExperience.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_other_exp').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_cfd_exp')) {
            this.purposeInvestForm.controls.inversExCfd.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_pic_cfd_exp').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_other_inv')) {
            this.purposeInvestForm.controls.otherPurpose.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_other_inv').value_text);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_source')) {
            this.purposeInvestForm.controls.backgroundApplication.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_source').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_other_source')) {
            this.purposeInvestForm.controls.specificName.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_other_source').value_text);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_annual_sales')) {
            this.financialInforForm.controls.businessEntityAnnual.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_annual_sales').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_sales_after_tax')) {
            this.financialInforForm.controls.tax.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_sales_after_tax').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_capital')) {
            this.financialInforForm.controls.businessCapital.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_capital').sequence);
          }

          if (this.corporateInfor.surveys.find(item => item.question_cd === 'corp_investable')) {
            this.financialInforForm.controls.investment.
          setValue(this.corporateInfor.surveys.find(item => item.question_cd === 'corp_investable').sequence);
          }
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
          street: this.corporateForm.controls.cor_district.value.trim(),
          street2: this.corporateForm.controls.cor_house.value.trim(),
          fx_street3: this.corporateForm.controls.cor_build.value.trim(),
        },
        mobile: this.corporateForm.controls.cor_phone.value.trim(),
        fx_fax: this.corporateForm.controls.cor_fax.value.trim(),
        lang: '',
      },
      pic: {
        name: this.picForm.controls.per_picname.value.trim(),
        fx_name1: this.picForm.controls.person_picname.value.trim(),
        fx_gender: this.picForm.controls.person_gender.value,
        email: this.picForm.controls.person_email.value.trim(),
        mobile: this.picForm.controls.person_phone.value,
        function: this.picForm.controls.person_pic.value.trim(),
        fx_dept: this.picForm.controls.person_bod.value
      },
      surveys: [],
      survey_cd: 'phillip_corporate'
    };
    if (this.saveType === this.formType.corporateInfor) {
      param.pic = null;
    }
    if (this.saveType === this.formType.pic) {
      param.corporation = null;
    }
    if (this.saveType === this.formType.financial) {
      param.pic = null;
      param.corporation = null;
      param.surveys = this.listFinancialSubmit;
    }
    if (this.saveType === this.formType.purpose) {
      param.pic = null;
      param.corporation = null;
      param.surveys = this.listPurposeSubmit;
    }
    this.userService.changeCorporation(param).subscribe(response => {
      if (response.meta.code === 200) {
        if (this.saveType === this.formType.corporateInfor) {
          this.resetEditCorporateInfor();
        }
        if (this.saveType === this.formType.pic) {
          this.resetEditPic();
        }
        if (this.saveType === this.formType.financial) {
          this.editFinancial = false;
        }
        if (this.saveType === this.formType.purpose) {
          this.editPurpose = false;
        }
        this.getCorporateInfor();
      }
    });
  }

  saveCorp(type) {
    this.saveType = type;
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
    if (this.saveType === this.formType.financial) {
      if (this.financialInforForm.invalid) {
        return;
      }
      this.initListFinancialSubmit();
    }
    if (this.saveType === this.formType.purpose) {
      if (this.purposeInvestForm.invalid) {
        return;
      } else {
       this.initListPurposeSubmit();
      }
    }
    $('#modal-corporation').modal('show');

  }

  changeExPurPose() {
    if (Number(this.purposeInvestForm.controls.investExFx.value) <= 2
      && Number(this.purposeInvestForm.controls.inversExCfd.value) <= 2
      && Number(this.purposeInvestForm.controls.investCommodities.value) <= 2) {
      this.purposeInvestForm.controls.investExFx.setValidators([experienceValidation]);
      this.purposeInvestForm.controls.investExFx.updateValueAndValidity();
      this.purposeInvestForm.controls.inversExCfd.setValidators([experienceValidation]);
      this.purposeInvestForm.controls.inversExCfd.updateValueAndValidity();
      this.purposeInvestForm.controls.investCommodities.setValidators([experienceValidation]);
      this.purposeInvestForm.controls.investCommodities.updateValueAndValidity();
      if (Number(this.purposeInvestForm.controls.other.value) === 2
        && Number(this.purposeInvestForm.controls.tradingExperience.value) <= 2) {
          this.purposeInvestForm.controls.tradingExperience.setValidators([experienceValidation]);
          this.purposeInvestForm.controls.tradingExperience.updateValueAndValidity();
      }
      if (Number(this.purposeInvestForm.controls.other.value) === 2
        && Number(this.purposeInvestForm.controls.tradingExperience.value) > 2) {
        this.purposeInvestForm.controls.investExFx.setValidators([requiredInput]);
        this.purposeInvestForm.controls.investExFx.updateValueAndValidity();
        this.purposeInvestForm.controls.inversExCfd.setValidators([requiredInput]);
        this.purposeInvestForm.controls.inversExCfd.updateValueAndValidity();
        this.purposeInvestForm.controls.investCommodities.setValidators([requiredInput]);
        this.purposeInvestForm.controls.investCommodities.updateValueAndValidity();
      }
    }
    if (Number(this.purposeInvestForm.controls.investExFx.value) > 2
      || Number(this.purposeInvestForm.controls.inversExCfd.value) > 2
      || Number(this.purposeInvestForm.controls.investCommodities.value) > 2) {
      if (Number(this.purposeInvestForm.controls.other.value) === 2) {
          this.purposeInvestForm.controls.tradingExperience.setValidators([requiredInput]);
          this.purposeInvestForm.controls.tradingExperience.updateValueAndValidity();
      }
      this.purposeInvestForm.controls.investExFx.setValidators([requiredInput]);
      this.purposeInvestForm.controls.investExFx.updateValueAndValidity();
      this.purposeInvestForm.controls.inversExCfd.setValidators([requiredInput]);
      this.purposeInvestForm.controls.inversExCfd.updateValueAndValidity();
      this.purposeInvestForm.controls.investCommodities.setValidators([requiredInput]);
      this.purposeInvestForm.controls.investCommodities.updateValueAndValidity();
    }
  }

  changeBackGroundApplication() {
    if (Number(this.purposeInvestForm.controls.backgroundApplication.value) === 7) {
      this.globalService.resetFormControl(this.purposeInvestForm.controls.specificName, requiredInput);
    } else {
      this.globalService.resetFormControl(this.purposeInvestForm.controls.specificName);
    }
  }

  changePurpose() {
    if (this.purposeInvestForm.controls.investPurposeSortTerm.value === false
      && this.purposeInvestForm.controls.investPurposeMedium.value === false
      && this.purposeInvestForm.controls.investPurposeExchange.value === false
      && this.purposeInvestForm.controls.investPurposeInterestRate.value === false
      && this.purposeInvestForm.controls.investPurposeForeignCurrency.value === false
      && this.purposeInvestForm.controls.investPurposeOther.value === false) {
      this.purposeInvestForm.controls.investPurpose.setValue(false);
      this.purposeInvestForm.controls.investPurpose.setValidators([requiredInput]);
      this.purposeInvestForm.controls.investPurpose.updateValueAndValidity();
    } else {
      this.purposeInvestForm.controls.investPurpose.setValue(true);
      this.purposeInvestForm.controls.investPurpose.setValidators([]);
      this.purposeInvestForm.controls.investPurpose.updateValueAndValidity();
    }

    if (this.purposeInvestForm.controls.investPurposeOther.value === true) {
      this.purposeInvestForm.controls.otherPurpose.setValidators([requiredInput]);
      this.purposeInvestForm.controls.otherPurpose.updateValueAndValidity();
    } else {
      this.purposeInvestForm.controls.otherPurpose.setValidators([]);
      this.purposeInvestForm.controls.otherPurpose.updateValueAndValidity();
    }
  }

  changeOtherEx() {
    if (this.purposeInvestForm.controls.other.value === '2') {
      this.globalService.resetFormControl(this.purposeInvestForm.controls.financialInstrument, requiredInput);
      this.globalService.resetFormControl(this.purposeInvestForm.controls.tradingExperience, requiredInput);
    } else {
      this.globalService.resetFormControl(this.purposeInvestForm.controls.financialInstrument);
      this.globalService.resetFormControl(this.purposeInvestForm.controls.tradingExperience);
    }
    this.changeExPurPose();
  }

  changeBusinessCapital() {
    this.listInvestmentCorporation = businessCapital.labels;
    this.listInvestmentCorporation =
      this.listInvestmentCorporation.filter(item => item.sequence <= Number(this.financialInforForm.controls.businessCapital.value));
    if (Number(this.financialInforForm.controls.investment.value)
      > Number(this.financialInforForm.controls.businessCapital.value)) {
        this.financialInforForm.controls.investment.setValue('');
    }
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
        this.picForm.controls.person_gender.setValue(this.globalService.reConvertGender(this.corporateInfor.pic.fx_gender.value));
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
        this.picForm.controls.person_gender.setValue(this.globalService.reConvertGender(this.corporateInfor.pic.fx_gender.value));
        this.editGender = true;
        break;
    }
  }

  cancelEditCor(field: string, type: string) {
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
    if (type === this.formType.corporateInfor
      && this.editCorAddress === false
      && this.editCorPhone === false
      && this.editCorFax === false) {
      this.showSaveCorp = false;
    }
    if (type === this.formType.pic
      && this.editPersonBod === false
      && this.editPersonPic === false
      && this.editPersonPicname === false
      && this.editPersonPhone === false
      && this.editPersonEmail === false
      && this.editGender === false) {
      this.showSavePic = false;
    }
  }

  cancelEditFinan() {
    this.editFinancial = false;
  }

  cancelEditPurpose() {
    this.editPurpose = false;
  }

  editPurposeInvest() {
    this.editPurpose = true;
    this.changeExPurPose();
    this.changePurpose();
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

  initListFinancialSubmit() {
    this.listFinancialSubmit = [
      {
        question_cd: 'corp_annual_sales',
        value_text: null,
        sequence: this.financialInforForm.controls.businessEntityAnnual.value
      },
      {
        question_cd: 'corp_sales_after_tax',
        value_text: null,
        sequence: this.financialInforForm.controls.tax.value
      },
      {
        question_cd: 'corp_capital',
        value_text: null,
        sequence: this.financialInforForm.controls.businessCapital.value
      },
      {
        question_cd: 'corp_investable',
        value_text: null,
        sequence: this.financialInforForm.controls.investment.value
      }
    ];
  }

  initListPurposeSubmit() {
    if (this.purposeInvestForm.controls.investPurposeOther.value === false) {
      this.purposeInvestForm.controls.otherPurpose.setValue('');
    }
    this.listPurposeSubmit = [
      {
        question_cd: 'corp_pic_other_exp_yn',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.other.value)
      },
      {
        question_cd: 'corp_pic_other_name_exp',
        value_text: this.purposeInvestForm.controls.financialInstrument.value
        ? this.purposeInvestForm.controls.financialInstrument.value.trim() : null,
        sequence: null
      },
      {
        question_cd: 'corp_other_source',
        value_text: this.purposeInvestForm.controls.specificName.value ? this.purposeInvestForm.controls.specificName.value.trim() : null,
        sequence: null
      },
      {
        question_cd: 'corp_source',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.backgroundApplication.value)
      },
      {
        question_cd: 'corp_other_inv',
        value_text: this.purposeInvestForm.controls.otherPurpose.value ? this.purposeInvestForm.controls.otherPurpose.value.trim() : null,
        sequence: null
      },
      {
        question_cd: 'corp_pic_cfd_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.inversExCfd.value)
      },
      {
        question_cd: 'corp_pic_other_exp',
        value_text: null,
        sequence: this.purposeInvestForm.controls.tradingExperience.value
        ? Number(this.purposeInvestForm.controls.tradingExperience.value) : null
      },
      {
        question_cd: 'corp_pic_fx_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.investExFx.value)
      },
      {
        question_cd: 'corp_pic_comm_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.investCommodities.value)
      },
      {
        question_cd: 'corp_pic_margin_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.investMarginTrading.value)
      },
      {
        question_cd: 'corp_pic_stock_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.investStockTrading.value)
      },
      {
        question_cd: 'corp_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeSortTerm.value === true ? 1 : null
      },
      {
        question_cd: 'corp_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeMedium.value === true ? 2 : null
      },
      {
        question_cd: 'corp_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeExchange.value === true ? 3 : null
      },
      {
        question_cd: 'corp_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeInterestRate.value === true ? 4 : null
      },
      {
        question_cd: 'corp_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeForeignCurrency.value === true ? 5 : null
      },
      {
        question_cd: 'corp_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeOther.value === true ? 6 : null
      },
    ];
    // this.listPurposeSubmit = this.listPurposeSubmit.filter(item => item.value_text !== null || item.sequence !== null);
  }

}
