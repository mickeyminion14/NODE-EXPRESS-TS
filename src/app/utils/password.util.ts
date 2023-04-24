import {compare, genSalt, hash} from 'bcrypt';
import {PasswordDoc} from '../middlewares/api';
import {Document} from 'mongoose';

const config = require('config');

/**
 * @description A utility class to handle password
 */
export const passwordUtil = {
  /**
   * @description A function which can be used to verify password in a mongoose document
   * @param this Execution Context or Scope
   * @param password A string to be compared with password hash
   */
  async verify(this: PasswordDoc, password: string): Promise<boolean> {
    return await compare(password, this.password);
  },
  /**
   * @description A mongoose pre hook function to hash password before storing it in database
   * @param this Execution Context or Scope
   */
  async hook(this: Document & {password: string}): Promise<void> {
    const password = this.password;
    if (this.isModified('password')) {
      // console.log('password modified');
      const round: number = parseInt(config.salt_round + '', 10);
      this.password = await hash(password, await genSalt(round));
    }
  },
  async hookUser(this: any): Promise<void> {
    const round: number = parseInt(config.SALT_ROUND, 10);
    this.getUpdate().$setOnInsert.password = await hash(
      this.getUpdate()['$setOnInsert'].password,
      await genSalt(round)
    );
  }
};
