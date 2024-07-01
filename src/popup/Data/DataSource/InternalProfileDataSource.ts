import BaseService from "../../../../services/axios";
import { TimelessProfile } from "../../Domain/Repository/InternalProfileRepository";
import { InternalProfileDataSource } from "./DataSource";

export class InternalProfileDataSourceImpl
  implements InternalProfileDataSource
{
  private axiosClient: BaseService;

  constructor(_axiosClient: BaseService) {
    this.axiosClient = _axiosClient;
  }

  async getInternalProfiles(): Promise<TimelessProfile[]> {
    const response = await this.axiosClient.get({
      path: "airplane/timeless_profiles/",
    });
    return response.data;
  }
}
