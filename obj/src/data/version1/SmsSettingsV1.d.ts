import { IStringIdentifiable } from 'pip-services-commons-node';
export declare class SmsSettingsV1 implements IStringIdentifiable {
    id: string;
    name: string;
    phone: string;
    language: string;
    subscriptions: any;
    verified: boolean;
    ver_code: string;
    ver_expire_time: Date;
    custom_hdr: any;
    custom_dat: any;
}
