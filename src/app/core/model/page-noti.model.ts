import { MetaResponseModel } from './meta-response.model';

export interface PageNotificationResponse {
    meta: MetaResponseModel;
    data: {
        next: string,
        previous: string,
        count: number,
        results: Array<Notification>;
    };
}
export interface TotalNotoficationResponse {
  meta: MetaResponseModel;
  data: TotalNotification;
}
export interface NotificationStatusResponse {
    meta: MetaResponseModel;
    data: {
        total_noti: TotalNotification;
        noti_item: Notification;
    };
}

export interface NotificationResponse {
    meta: MetaResponseModel;
    data: Notification;
}

export interface Notification {
    id: number;
    news_type: number;
    news_title: string;
    create_date: string;
    read_flg: string;
    agree_flg: number;
    agreement_flg: number;
    publish_date: string;
    news_content: number;
    active: number;
}

export interface TotalNotification {
    important: number;
    notification: number;
    campaign: number;
}



