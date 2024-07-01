export interface MidjourneyRepository {
  fetchMidjourneyData(jobId: string): Promise<object>;
}
