import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

class UsersService {
  async getUsers() {
    return await UserModel.find({});
  }

  async registerUser(payload: any) {
    return await UserModel.bulkSave([payload]);
  }
}

export const usersService = new UsersService();
