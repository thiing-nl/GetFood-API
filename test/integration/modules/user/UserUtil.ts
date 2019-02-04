import { UserCreateModel } from '../../../../src/v2/modules/auth/user/models/UserCreateModel';
import { UserUpdateModel } from '../../../../src/v2/modules/auth/user/models/UserUpdateModel';
import _ = require('lodash');


export class UserUtil {
  private static count = 0;

  public static generateEmail(extraText: string = '') {
    if ( extraText.trim() !== '' ) {
      return `test-email-${new Date().getTime()}-${UserUtil.count}-${extraText}@getfood.io`;
    }
    return `test-email-${new Date().getTime()}-${UserUtil.count}@getfood.io`;
  }

  public static generateCreate(): UserCreateModel {
    const userCreateModel = new UserCreateModel();
    userCreateModel.firstName = 'Test';
    userCreateModel.lastName = 'Create';
    userCreateModel.email = UserUtil.generateEmail();
    userCreateModel.password = 'test123';

    UserUtil.count++;

    return userCreateModel;
  }

  public static generateUpdate(): UserUpdateModel {
    const userUpdateModel = new UserUpdateModel();
    userUpdateModel.firstName = 'Update';
    userUpdateModel.lastName = 'Test';
    userUpdateModel.email = UserUtil.generateEmail('update');
    userUpdateModel.password = '123test';

    UserUtil.count++;

    return userUpdateModel;
  }

}
