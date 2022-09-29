import { GetProfileResponse } from "./get-profile.response";
import { checkForApiProperties } from "../../../test/unit/helpers/response-dto-helper.spec";

describe("GetProfileResponse", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it("should has ApiProperty decorator for all properties", () => {
    const dto = new GetProfileResponse.Dto({
        fullName: "fullName",
        aboutMe: "aboutMe",
        lookingForAJob: true,
        lookingForAJobDescription: "description"
      },
      null,
      null
    );
    checkForApiProperties(dto, GetProfileResponse.Dto);
  });
});