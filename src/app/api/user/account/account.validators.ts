import Joi from 'joi';
import {validateSchema} from 'src/app/middlewares/validator';
import {JEmail, JPassword, JString, JName} from '../../api.validators';

export const userValidators = {
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

  signup: validateSchema(
    Joi.object().keys({
      email: JEmail.required(),
      password: JPassword.required(),
      fullName: JString.required().max(60)
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
