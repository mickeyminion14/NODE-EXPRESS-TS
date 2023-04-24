import Joi from 'joi';
import {validateSchema} from 'src/app/middlewares/validator';
import {JID} from '../../api.validators';

export const cartValidators = {
  add: validateSchema(
    Joi.object().keys({
      productId: JID.required()
    })
  )
};
