export declare class KafkaService {
    private producer;
    constructor();
    private connect;
    write(topic: string, key: string, message: any): Promise<boolean>;
    disconnect(): Promise<void>;
}
