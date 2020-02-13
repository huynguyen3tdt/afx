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
    noti_type: number;
    title: string;
    date_time: string;
    is_read: boolean;
    is_agreement: string;
    content: string;
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
