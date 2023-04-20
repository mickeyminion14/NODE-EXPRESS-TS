import {ResponseError} from 'src/app/utils/error.util';
import {ADMIN_MESSAGES} from './admin.constants';
import {IAdminDocument} from './admin.interface';
import {AdminModel} from './admin.model';
import {UserType} from 'src/app/constants/user.constants';
import {Client} from 'src/app/middlewares/api';
import {sessionService} from '../session/session.service';

class AdminService {
  /**
   * @description A function to create session of admin by given email and password
   * @param {string} email Admin email
   * @param {string} password Admin password
   */
  async createSession(email: string, password: string, client: Client | undefined): Promise<any> {
    const admin = await AdminModel.findOne({email});
    if (!admin) {
      return Promise.reject(new ResponseError(401, ADMIN_MESSAGES.LOGIN.NOT_FOUND, 4011));
    }
    if (!(await admin.verifyPassword(password))) {
      return Promise.reject(new ResponseError(401, ADMIN_MESSAGES.LOGIN.INVALID, 4012));
    }
    const token = await sessionService.create(client!, {
      userId: admin._id,
      type: UserType.SUPER_ADMIN
    });
    return {
      token,
      profile: {
        ...admin.toObject(),
        password: undefined,
        passwordToken: undefined
      }
    };
  }

  async createNewAdmin(): Promise<any> {
    const adminModel = new AdminModel({
      email: 'sarthak@gmail.com',
      password: 'Admin@123'
    });
    return await adminModel.save();
  }
}

export const adminService = new AdminService();
