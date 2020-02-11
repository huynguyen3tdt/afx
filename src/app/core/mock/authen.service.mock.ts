import { Observable, of  } from 'rxjs';
import { MOCK_LOGIN_RESPONSE } from './data/authen.mock';
import { LoginResponseModel } from '../model/login-response.model';
import { ResponseWihtoutDataModel } from './../model/none-data-response.model';
import { MOCK_RESPONSE_WITHOUT_DATA } from './data/data-null.mock';

export class AuthenServiceMock {
    login(): Observable<LoginResponseModel> {
        return of(MOCK_LOGIN_RESPONSE);
    }
    logout(): Observable<ResponseWihtoutDataModel> {
        return of(MOCK_RESPONSE_WITHOUT_DATA);
    }
    forgotPassWord(): Observable<ResponseWihtoutDataModel> {
        return of(MOCK_RESPONSE_WITHOUT_DATA);
    }
}

