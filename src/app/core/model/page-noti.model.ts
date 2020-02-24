import { MetaResponseModel } from './meta-response.model';

export interface PageNotificationResponse {
    meta: MetaResponseModel;
    data: {
        next: string,
        previous: string,
        count: number,
        results: ResultPageNotification;
    };
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
    write_date: string;
    create_date: string;
    read_flg: string;
    agree_flg: number;
    agreement_flg: number;
    news_content: string;
    create_uid: number;
    write_uid: number;
}

export interface TotalNotification {
    important: number;
    notification: number;
    campaign: number;
}

export interface ResultPageNotification {
    total_noti: TotalNotification;
    noti_list: Notification[];
}
