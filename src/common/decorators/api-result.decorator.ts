import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { CommonResponse } from "../dto/common.response";
import { applyDecorators } from "@nestjs/common";

interface ApiResultOptions {
  type: Function,
  description?: string,
  status?: number
}

export const ApiResult = (options: ApiResultOptions) => {
  return applyDecorators(
    ApiExtraModels(CommonResponse.Dto, options.type),
    ApiResponse({
      description: options?.description,
      status: options?.status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(CommonResponse.Dto) },
          {
            properties: {
              data: {
                type: 'object',
                allOf: [
                  {
                    $ref: getSchemaPath(options?.type)
                  }
                ],
              },
            },
          },
        ],
      },
    }),
  )
}