import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HasherService {
  private readonly SALT = process.env.SALT || bcrypt.genSaltSync(10);

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, this.SALT);
  }

  compareData(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }
}
