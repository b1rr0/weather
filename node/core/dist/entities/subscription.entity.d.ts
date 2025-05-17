import { SubscribeType } from 'src/doments/subscription/dto/subscribe.type';
export declare class SubsribeEntity {
    id: string;
    email: string;
    city: string;
    isConfirmed: boolean;
    token: string;
    subscribeType: SubscribeType;
    createdAt: Date;
    updatedAt: Date;
}
