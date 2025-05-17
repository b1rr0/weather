export declare class HasherService {
    private readonly SALT;
    hashData(data: string): Promise<string>;
    compareData(data: string, hashedData: string): Promise<boolean>;
}
