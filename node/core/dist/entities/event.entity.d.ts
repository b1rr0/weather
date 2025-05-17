import { EventType, ProcessStatus } from 'src/doments/event/contants/event.constants';
export declare class EventEntity {
    id: string;
    status: ProcessStatus;
    type: EventType;
    data: string;
    createdAt: Date;
    updatedAt: Date;
}
