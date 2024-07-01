import { MidjourneyRepository } from "../../Domain/Repository/MidjourneyRepository";
import { MidjourneyDataSource } from "../DataSource/DataSource";

export class MidjourneyRepositoryImpl implements MidjourneyRepository {
  private midjourneyData: MidjourneyDataSource;

  constructor(_midjourneyData: MidjourneyDataSource) {
    this.midjourneyData = _midjourneyData;
  }
  fetchMidjourneyData(jobId: string): Promise<object> {
    return this.midjourneyData.getMidjourneyData(jobId);
  }
}
