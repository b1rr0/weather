import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HasherService {
  private readonly SALT = '$2b$10$KPlqYXtq5.4zsHcDmM.Sd.';
  //process.env.SALT; // $2b$10$KPlqYXtq5.4zsHcDmM.Sd.

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, this.SALT);
  }

  compareData(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }
}
