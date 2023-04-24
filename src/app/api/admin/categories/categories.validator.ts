/* eslint-disable @typescript-eslint/camelcase */
import * as Joi from 'joi';
import {CATEGORIES_STATUS} from './categories.constant';
import {validateSchema} from 'src/app/middlewares/validator';
import {JID, JList, JNumber, JString} from '../../api.validators';

export const categoryValidators = {
  add: validateSchema(
    Joi.object().keys({
      categoryName: JString.required().min(3).max(30)
    })
  ),
  list: validateSchema(
    JList.keys({
      sort_by: JString.valid('createdAt', 'categoryName').default('createdAt')
    }),
    'query'
  ),

  delete: validateSchema(
    Joi.object().keys({
      categoryId: JID.required()
    })
  ),

  blockUnblock: validateSchema(
    Joi.object().keys({
      categoryId: JID.required(),
      status: JNumber.required().valid(...Object.values(CATEGORIES_STATUS))
    })
  ),

  edit: validateSchema(
    Joi.object().keys({
      _id: JID.required(),
      categoryName: JString.required().min(3).max(30)
    })
  )
};
//
