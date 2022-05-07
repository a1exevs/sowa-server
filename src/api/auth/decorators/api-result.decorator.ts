import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { CommonResDTO } from "../../common/ResDTO/CommonResDTO";
import { applyDecorators } from "@nestjs/common";

interface ApiResultOptions {
  type: Function,
  description?: string,
  status?: number
}

export const ApiResult = (options: ApiResultOptions) => {
  return applyDecorators(
    ApiExtraModels(CommonResDTO, options.type),
    ApiResponse({
      description: options?.description,
      status: options?.status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(CommonResDTO) },
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