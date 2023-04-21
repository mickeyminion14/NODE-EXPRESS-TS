import {ApiModel, ApiModelProperty, SwaggerDefinitionConstant} from 'swagger-express-ts';

@ApiModel({
  description: 'Admin Login Data',
  name: 'AdminLoginDataModel'
})
export class AdminLoginData {
  @ApiModelProperty({
    description: 'email of admin',
    required: true,
    type: SwaggerDefinitionConstant.STRING,
    example: 'sarthak@gmail.com'
  })
  email: string;
  @ApiModelProperty({
    description: 'password for admin',
    required: true,
    type: SwaggerDefinitionConstant.STRING,
    example: 'Admin@123'
  })
  password: string;
}
