import {
  InternalProfileRepository,
  TimelessProfile,
} from "../../Domain/Repository/InternalProfileRepository";
import { InternalProfileDataSource } from "../DataSource/DataSource";

export class InternalProfileRepositoryImpl
  implements InternalProfileRepository
{
  private internalProfileDataSource: InternalProfileDataSource;

  constructor(_internalProfileDataSource: InternalProfileDataSource) {
    this.internalProfileDataSource = _internalProfileDataSource;
  }

  getInternalProfiles(): Promise<Array<TimelessProfile>> {
    return this.internalProfileDataSource.getInternalProfiles();
  }
}
