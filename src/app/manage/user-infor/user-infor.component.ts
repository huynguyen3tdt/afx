import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  requiredInput,
  emailValidation,
  validationPhoneNumber,
  postCodevalidation,
  annualIncomeValidation,
  experienceValidation
} from 'src/app/core/helper/custom-validate.helper';
import { UserModel, AddressModel, LabelModel, QuestionModel, UpdateUserParam } from 'src/app/core/model/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { LISTCITY_JAPAN } from 'src/app/core/constant/japan-constant';
import {
  backgroundApplicationInvidual,
  investExFxInvidual,
  invesExCfdInvidual,
  investStockTradingInvidual,
  investMarginTradingInvidual,
  investCommoditiesInvidual,
  tradingExperienceInvidual,
  amountAvaiableInvidual,
  annualIncomeInvidual,
  financialAssetInvidual
} from 'src/app/core/constant/question-constant';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { take } from 'rxjs/operators';
import { TYPE_ERROR_TOAST_JP, TIMEOUT_TOAST } from 'src/app/core/constant/authen-constant';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-user-infor',
  templateUrl: './user-infor.component.html',
  styleUrls: ['./user-infor.component.scss']
})
export class UserInforComponent implements OnInit {
  userForm: FormGroup;
  purposeInvestForm: FormGroup;
  userInfor: UserModel;
  editAddress: boolean;
  editEmail: boolean;
  editPhone: boolean;
  showSave: boolean;
  userAddress: AddressModel;
  occupationSurveyForm: FormGroup;
  STATUS_INFO = {
    approve: 'A',
    inProgress: 'P'
  };
  listAmountAvaiableInvidual: Array<LabelModel>;
  listAnnualIncomeInvidual: Array<LabelModel>;
  listFinancialAssetInvidual: Array<LabelModel>;
  listBackgroundApplicationInvidual: Array<LabelModel>;
  listInvestExFxInvidual: Array<LabelModel>;
  listInvesExCfdInvidual: Array<LabelModel>;
  listInvestStockTradingInvidual: Array<LabelModel>;
  listInvestMarginTradingInvidual: Array<LabelModel>;
  listInvestCommoditiesInvidual: Array<LabelModel>;
  listTradingExperienceInvidual: Array<LabelModel>;
  listCityJapan: Array<string>;
  editPurpose: boolean;
  editFinancial: boolean;
  formType = {
    userInfor: 'userInfor',
    financial: 'financial',
    purpose: 'purpose'
  };
  saveType: string;
  listFinancialSubmit: Array<QuestionModel>;
  listPurposeSubmit: Array<QuestionModel>;
  invalidEmail: boolean;

  constructor(private userService: UserService,
              private globalService: GlobalService,
              private spinnerService: Ng4LoadingSpinnerService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.listCityJapan = LISTCITY_JAPAN;
    this.editPurpose = false;
    this.editFinancial = false;
    this.resetEditUser();
    this.initUserForm();
    this.initOccupationSurveyForm();
    this.initPurposeInvestForm();
    this.getUserInfo();
    this.listAmountAvaiableInvidual = amountAvaiableInvidual.labels;
    this.listAnnualIncomeInvidual = annualIncomeInvidual.labels;
    this.listFinancialAssetInvidual = financialAssetInvidual.labels;
    this.listBackgroundApplicationInvidual = backgroundApplicationInvidual.labels;
    this.listInvestExFxInvidual = investExFxInvidual.labels;
    this.listInvesExCfdInvidual = invesExCfdInvidual.labels;
    this.listInvestStockTradingInvidual = investStockTradingInvidual.labels;
    this.listInvestMarginTradingInvidual = investMarginTradingInvidual.labels;
    this.listInvestCommoditiesInvidual = investCommoditiesInvidual.labels;
    this.listTradingExperienceInvidual = tradingExperienceInvidual.labels;
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

  initOccupationSurveyForm() {
    this.occupationSurveyForm = new FormGroup({
      annualIncome: new FormControl('', annualIncomeValidation),
      financialAsset: new FormControl('', requiredInput),
      amountAvaiable: new FormControl('', requiredInput)
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

  getUserInfo() {
    this.spinnerService.show();
    this.userService.getUserInfor().pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.userInfor = response.data;
        this.userForm.controls.postCode.setValue(this.userInfor.address.value.zip);
        this.userForm.controls.searchPrefe.setValue(this.userInfor.address.value.city);
        this.userForm.controls.searchCountry.setValue(this.userInfor.address.value.street);
        this.userForm.controls.house_numb.setValue(this.userInfor.address.value.street2);
        this.userForm.controls.name_build.setValue(this.userInfor.address.value.fx_street3);
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.userForm.controls.phone.setValue(this.userInfor.mobile);
        this.userInfor.fx_gender = this.globalService.checkGender(this.userInfor.fx_gender);
        if (this.userInfor.surveys.length > 0) {
          if (this.userInfor.surveys.find(item =>
            item.question_cd === 'indi_inv_purpose' && item.sequence === 1)) {
            this.purposeInvestForm.controls.investPurposeSortTerm.setValue(true);
          }

          if (this.userInfor.surveys.find(item =>
            item.question_cd === 'indi_inv_purpose' && item.sequence === 2)) {
            this.purposeInvestForm.controls.investPurposeMedium.setValue(true);
          }
          if (this.userInfor.surveys.find(item =>
            item.question_cd === 'indi_inv_purpose' && item.sequence === 3)) {
            this.purposeInvestForm.controls.investPurposeExchange.setValue(true);
          }
          if (this.userInfor.surveys.find(item =>
            item.question_cd === 'indi_inv_purpose' && item.sequence === 4)) {
            this.purposeInvestForm.controls.investPurposeInterestRate.setValue(true);
          }

          if (this.userInfor.surveys.find(item =>
            item.question_cd === 'indi_inv_purpose' && item.sequence === 5)) {
            this.purposeInvestForm.controls.investPurposeForeignCurrency.setValue(true);
          }

          if (this.userInfor.surveys.find(item =>
            item.question_cd === 'indi_inv_purpose' && item.sequence === 6)) {
            this.purposeInvestForm.controls.investPurposeOther.setValue(true);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_fx_exp')) {
            this.purposeInvestForm.controls.investExFx.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_fx_exp').sequence);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_cfd_exp')) {
            this.purposeInvestForm.controls.inversExCfd.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_cfd_exp').sequence);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_stock_exp')) {
            this.purposeInvestForm.controls.investStockTrading.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_stock_exp').sequence);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_other_exp_yn')) {
            this.purposeInvestForm.controls.other.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_other_exp_yn').sequence.toString());
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_source')) {
            this.purposeInvestForm.controls.backgroundApplication.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_source').sequence);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_other_source')) {
            this.purposeInvestForm.controls.specificName.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_other_source').value_text);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_margin_exp')) {
            this.purposeInvestForm.controls.investMarginTrading.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_margin_exp').sequence);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_comm_exp')) {
            this.purposeInvestForm.controls.investCommodities.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_comm_exp').sequence);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_other_fin_name')) {
            this.purposeInvestForm.controls.financialInstrument.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_other_fin_name').value_text);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_other_purpose')) {
            this.purposeInvestForm.controls.otherPurpose.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_other_purpose').value_text);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_other_fin_exp')) {
            this.purposeInvestForm.controls.tradingExperience.
            setValue(this.userInfor.surveys.find(item => item.question_cd === 'indi_other_fin_exp').sequence);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_investable')) {
            this.occupationSurveyForm.controls.amountAvaiable.setValue(
              this.userInfor.surveys.find(item => item.question_cd === 'indi_investable').sequence);
          }

          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_income')) {
            this.occupationSurveyForm.controls.annualIncome.setValue(
              this.userInfor.surveys.find(item => item.question_cd === 'indi_income').sequence);
          }
          if (this.userInfor.surveys.find(item => item.question_cd === 'indi_capital')) {
            this.occupationSurveyForm.controls.financialAsset.setValue(
              this.userInfor.surveys.find(item => item.question_cd === 'indi_capital').sequence);
          }
        }
      }
    });
  }

  changeAddress() {
    const postNo = this.userForm.controls.postCode.value;
    this.spinnerService.show();
    this.userService.getAddress(postNo).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        this.userAddress = response.data;
        this.userForm.controls.postCode.setValue(this.userAddress.postno);
        this.userForm.controls.searchPrefe.setValue(this.userAddress.prefecture);
        this.userForm.controls.searchCountry.setValue(this.userAddress.city + this.userAddress.town);
      } else if (response.meta.code === 404) {
        this.toastr.error('郵便番号から住所が見つかりませんでした。', TYPE_ERROR_TOAST_JP, {
          timeOut: TIMEOUT_TOAST
        });
      }
    });
  }

  saveUser(type: string) {
    this.saveType = type;
    if (this.saveType === this.formType.userInfor) {
      if (this.userForm.invalid) {
        return;
      }
    }
    if (this.saveType === this.formType.financial) {
      if (this.occupationSurveyForm.invalid) {
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
    $('#modal-confirm').modal('show');
  }

  updateUser() {
    const param: UpdateUserParam = {
      zip: this.userForm.controls.postCode.value,
      address: {
        city: this.userForm.controls.searchPrefe.value,
        street: this.userForm.controls.searchCountry.value.trim(),
        street2: this.userForm.controls.house_numb.value.trim(),
        fx_street3: this.userForm.controls.name_build.value.trim(),
      },
      email: this.userForm.controls.email.value,
      mobile: this.userForm.controls.phone.value,
      lang: '',
      surveys: [],
      survey_cd: 'phillip_individual'
    };
    if (this.saveType === this.formType.financial) {
      param.surveys = this.listFinancialSubmit;
      param.zip = null;
      param.address = null;
      param.email = null;
      param.mobile = null;
      param.lang = null;
    }
    if (this.saveType === this.formType.purpose) {
      param.surveys = this.listPurposeSubmit;
      param.zip = null;
      param.address = null;
      param.email = null;
      param.mobile = null;
      param.lang = null;
    }
    this.spinnerService.show();
    this.userService.updateUser(param).pipe(take(1)).subscribe(response => {
      this.spinnerService.hide();
      if (response.meta.code === 200) {
        if (this.saveType === this.formType.userInfor) {
          this.resetEditUser();
        }
        if (this.saveType === this.formType.financial) {
          this.editFinancial = false;
        }
        if (this.saveType === this.formType.purpose) {
          this.editPurpose = false;
        }
        this.getUserInfo();
      } else if (response.meta.code === 409) {
        this.editEmail = true;
        this.invalidEmail = true;
      }
    });

  }

  showEditField(field: string) {
    this.showSave = true;
    switch (field) {
      case 'address':
        this.userForm.controls.postCode.setValue(this.userInfor.address.value.zip);
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
    if (!this.editAddress && !this.editEmail && !this.editPhone) {
      this.showSave = false;
    }

  }

  changeExPurPose() {
      // 1 in 4 fields (investExFx, inversExCfd, investCommodities, tradingExperience) need experience bigger than 6 months
    // check if investExFx || inversExCfd || investCommodities <= 2 (lower than 6 months)
    if (Number(this.purposeInvestForm.controls.investExFx.value) <= 2
      && Number(this.purposeInvestForm.controls.inversExCfd.value) <= 2
      && Number(this.purposeInvestForm.controls.investCommodities.value) <= 2) {
        // setValidator experienceValidation for investExFx, inversExCfd, investCommodities
      this.globalService.resetValidator(this.purposeInvestForm.controls.investExFx, experienceValidation);
      this.globalService.resetValidator(this.purposeInvestForm.controls.inversExCfd, experienceValidation);
      this.globalService.resetValidator(this.purposeInvestForm.controls.investCommodities, experienceValidation);
      // if other === 2 and tradingExperience <= 2 (lower than 6 months) setValidator experienceValidation for tradingExperience
      if (Number(this.purposeInvestForm.controls.other.value) === 2
        && Number(this.purposeInvestForm.controls.tradingExperience.value) <= 2) {
          this.globalService.resetValidator(this.purposeInvestForm.controls.tradingExperience, experienceValidation);
      }
       //  if other === 2 and tradingExperience > 2 (bigger than 6 months)
      // setValidator requiredInput for investExFx, inversExCfd, investCommodities
      if (Number(this.purposeInvestForm.controls.other.value) === 2
        && Number(this.purposeInvestForm.controls.tradingExperience.value) > 2) {
        this.globalService.resetValidator(this.purposeInvestForm.controls.investExFx, requiredInput);
        this.globalService.resetValidator(this.purposeInvestForm.controls.inversExCfd, requiredInput);
        this.globalService.resetValidator(this.purposeInvestForm.controls.investCommodities, requiredInput);
      }
    }
     // check if investExFx || inversExCfd || investCommodities > 2 (bigger than 6 months)
    if (Number(this.purposeInvestForm.controls.investExFx.value) > 2
      || Number(this.purposeInvestForm.controls.inversExCfd.value) > 2
      || Number(this.purposeInvestForm.controls.investCommodities.value) > 2) {
        // if other === 2 setValidator requiredInput for tradingExperience
      if (Number(this.purposeInvestForm.controls.other.value) === 2) {
          this.globalService.resetValidator(this.purposeInvestForm.controls.tradingExperience, requiredInput);
      }
      // setValidator requiredInput for investExFx, inversExCfd, investCommodities
      this.globalService.resetValidator(this.purposeInvestForm.controls.investExFx, requiredInput);
      this.globalService.resetValidator(this.purposeInvestForm.controls.inversExCfd, requiredInput);
      this.globalService.resetValidator(this.purposeInvestForm.controls.investCommodities, requiredInput);
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
    // 1 of 6 reason investment purpose need to be checked (investPurposeSortTerm,
    // investPurposeMedium, investPurposeExchange, investPurposeInterestRate, investPurposeForeignCurrency, investPurposeOther)
    if (this.purposeInvestForm.controls.investPurposeSortTerm.value === false
      && this.purposeInvestForm.controls.investPurposeMedium.value === false
      && this.purposeInvestForm.controls.investPurposeExchange.value === false
      && this.purposeInvestForm.controls.investPurposeInterestRate.value === false
      && this.purposeInvestForm.controls.investPurposeForeignCurrency.value === false
      && this.purposeInvestForm.controls.investPurposeOther.value === false) {
      this.purposeInvestForm.controls.investPurpose.setValue(false);
      this.globalService.resetValidator(this.purposeInvestForm.controls.investPurpose, requiredInput);
    } else {
      // if choose 1 of 6 reasons => change value and remove validate for investPurpose
      this.purposeInvestForm.controls.investPurpose.setValue(true);
      this.globalService.resetValidator(this.purposeInvestForm.controls.investPurpose);
    }

    if (this.purposeInvestForm.controls.investPurposeOther.value === true) {
      this.globalService.resetFormControl(this.purposeInvestForm.controls.otherPurpose, requiredInput);
    } else {
      this.globalService.resetFormControl(this.purposeInvestForm.controls.otherPurpose);
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

  changeFinanAssetInvidual() {
    this.listAmountAvaiableInvidual = amountAvaiableInvidual.labels;
    this.listAmountAvaiableInvidual =
      this.listAmountAvaiableInvidual.filter(item => item.sequence <= Number(this.occupationSurveyForm.controls.financialAsset.value));
    if (Number(this.occupationSurveyForm.controls.amountAvaiable.value)
      > Number(this.occupationSurveyForm.controls.financialAsset.value)) {
      this.occupationSurveyForm.controls.amountAvaiable.setValue('');
    }
  }

  editPurposeInvest() {
    this.editPurpose = true;
    this.changeExPurPose();
    this.changePurpose();
  }

  resetEditUser() {
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    this.showSave = false;
    this.invalidEmail = false;
  }

  canCelSaveOccupation() {
    this.editFinancial = false;
    this.getUserInfo();
  }
  canCelPurpose() {
    this.editPurpose = false;
    this.getUserInfo();
  }

  initListFinancialSubmit() {
    this.listFinancialSubmit = [
      {
        question_cd: 'indi_investable',
        value_text: null,
        sequence: this.occupationSurveyForm.controls.amountAvaiable.value
      },
      {
        question_cd: 'indi_income',
        value_text: null,
        sequence: this.occupationSurveyForm.controls.annualIncome.value
      },
      {
        question_cd: 'indi_capital',
        value_text: null,
        sequence:  this.occupationSurveyForm.controls.financialAsset.value
      },
    ];
  }

  initListPurposeSubmit() {
    if (this.purposeInvestForm.controls.investPurposeOther.value === false) {
      this.purposeInvestForm.controls.otherPurpose.setValue('');
    }

    this.listPurposeSubmit = [
      {
        question_cd: 'indi_other_exp_yn',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.other.value)
      },
      {
        question_cd: 'indi_other_fin_name',
        value_text: this.purposeInvestForm.controls.financialInstrument.value
        ? this.purposeInvestForm.controls.financialInstrument.value.trim() : null,
        sequence: null
      },
      {
        question_cd: 'indi_other_source',
        value_text: this.purposeInvestForm.controls.specificName.value ? this.purposeInvestForm.controls.specificName.value.trim() : null,
        sequence: null
      },
      {
        question_cd: 'indi_source',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.backgroundApplication.value)
      },
      {
        question_cd: 'indi_other_purpose',
        value_text: this.purposeInvestForm.controls.otherPurpose.value ? this.purposeInvestForm.controls.otherPurpose.value.trim() : null,
        sequence: null
      },
      {
        question_cd: 'indi_cfd_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.inversExCfd.value)
      },
      {
        question_cd: 'indi_other_fin_exp',
        value_text: null,
        sequence: this.purposeInvestForm.controls.tradingExperience.value
        ? Number(this.purposeInvestForm.controls.tradingExperience.value) : null
      },
      {
        question_cd: 'indi_fx_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.investExFx.value)
      },
      {
        question_cd: 'indi_comm_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.investCommodities.value)
      },
      {
        question_cd: 'indi_margin_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.investMarginTrading.value)
      },
      {
        question_cd: 'indi_stock_exp',
        value_text: null,
        sequence: Number(this.purposeInvestForm.controls.investStockTrading.value)
      },
      {
        question_cd: 'indi_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeSortTerm.value === true ? 1 : null
      },
      {
        question_cd: 'indi_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeMedium.value === true ? 2 : null
      },
      {
        question_cd: 'indi_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeExchange.value === true ? 3 : null
      },
      {
        question_cd: 'indi_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeInterestRate.value === true ? 4 : null
      },
      {
        question_cd: 'indi_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeForeignCurrency.value === true ? 5 : null
      },
      {
        question_cd: 'indi_inv_purpose',
        value_text: null,
        sequence: this.purposeInvestForm.controls.investPurposeOther.value === true ? 6 : null
      },
    ];
  }

}
