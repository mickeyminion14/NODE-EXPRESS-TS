import Joi from 'joi';
import {validateSchema} from 'src/app/middlewares/validator';
import {JList, JString, JID} from '../../api.validators';

export const productValidators = {
  list: validateSchema(
    JList.keys({
      sort_by: JString.valid('createdAt', 'name', 'price', 'inStockQuantity').default('createdAt')
    }),
    'query'
  ),

  latestProducts: validateSchema(
    JList.keys({
      sort_by: JString.valid('createdAt').default('createdAt')
    }),
    'query'
  ),

  productDetails: validateSchema(
    Joi.object().keys({
      productId: JID.required()
    }),
    'params'
  )
};
