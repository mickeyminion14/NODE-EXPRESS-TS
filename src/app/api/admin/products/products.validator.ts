import * as Joi from 'joi';
import {validateSchema} from 'src/app/middlewares/validator';
import {JArray, JBoolean, JID, JList, JNumber, JString} from '../../api.validators';

export const productValidators = {
  add: validateSchema(
    Joi.object().keys({
      name: JString.min(3).max(100).required(),
      description: JString.min(3).max(1500).required(),
      price: JNumber.required(),
      // inStockQuantity: JNumber.required(),
      category: JArray.items(JID).required(),
      inStock: JBoolean.required().default(true),
      images: JArray.min(2).max(5).required().items(JString)
    })
  ),
  list: validateSchema(
    JList.keys({
      sort_by: JString.valid('createdAt', 'name', 'price', 'inStockQuantity').default('createdAt')
    }),
    'query'
  ),
  toogleInStock: validateSchema(
    Joi.object().keys({
      id: JID.required(),
      inStock: JBoolean.required()
    })
  )
};
