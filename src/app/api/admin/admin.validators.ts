import * as Joi from 'joi';
import {JEmail, JName, JPassword, JString} from '../api.validators';
import {validateSchema} from 'src/app/middlewares/validator';

export const adminValidators = {
  forgetPassword: validateSchema(
    Joi.object().keys({
      email: JEmail.required()
    }),
    'body'
  ),
  login: validateSchema(
    Joi.object().keys({
      email: JEmail.required(),
      password: JPassword.required()
    }),
    'body'
  ),
  reset: validateSchema(
    Joi.object().keys({
      token: JString.required(),
      password: JPassword.required()
    }),
    'body'
  ),
  profile: validateSchema(
    Joi.object({
      name: JName.optional(),
      photoUrl: JString.uri()
    }),
    'body'
  )
};
