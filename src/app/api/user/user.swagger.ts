import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

@ApiModel({
  description: "Register User Data",
  name: "RegisterDataModel",
})
export class RegisterData {
  @ApiModelProperty({
    description: "name of user",
    required: true,
    type: SwaggerDefinitionConstant.STRING,
    example: "Test User" as any,
  })
  name: string;
  @ApiModelProperty({
    description: "email of user",
    required: true,
    type: SwaggerDefinitionConstant.STRING,
    example: "test@yopmail.com" as any,
  })
  email: string;
}
