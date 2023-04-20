import Joi from 'joi';

export const JNumber = Joi.number();
export const JString = Joi.string().trim();
export const JBoolean = Joi.boolean();
export const JName = JString.max(60);
export const JArray = Joi.array().items(Joi.string().trim().required()).unique();
export const JEmail = JString.lowercase().email();
export const JMobile = JString.regex(/[0-9]{7,15}/);
export const JPassword = JString.min(6).max(24);
export const JID = JString.length(24);
export const JFullName = Joi.object({
  first: JName.required(),
  middle: JName,
  last: JName.required()
});

export const JList = Joi.object().keys({
  pageIndex: JNumber.required().min(0),
  pageSize: JNumber.required().min(5),
  searchText: JString,
  sort_by: JString,
  sort_order: JString.valid('asc', 'desc').default('desc')
});
