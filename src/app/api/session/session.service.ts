import {IClient, ISessionUser} from './session.interface';
import {SessionModel} from './session.model';
import {UserType} from '../../constants/user.constants';
import {tokenUtil} from 'src/app/utils/jwt.util';

class SessionService {
  async create(client: IClient, user: ISessionUser): Promise<string> {
    const id = user.userId;
    if (user.type === UserType.SUPER_ADMIN) {
      await SessionModel.updateMany({type: 'SUPER_ADMIN', userId: id, isActive: true}, {isActive: false});
    }
    const session = await new SessionModel({client, ...user}).save();

    return tokenUtil.generateAuthToken(
      {
        ...user,
        sessionId: session._id
      },
      user.type
    );
  }
}

export const sessionService = new SessionService();
