import { MidjourneyDataSource } from "./DataSource";

export class MidjourneyDataSourceImpl implements MidjourneyDataSource {
  async getMidjourneyData(jobId: string): Promise<object> {
    const res = await fetch("https://www.midjourney.com/api/app/job-status/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        jobIds: [jobId],
      }),
    });
    return res.json();
  }
}
