import { NotificationResponse } from '../../Domain/Model/Notification'
import { DashboardRepository } from '../../Domain/Repository/DashboardRepository'
import { DailyDataDTO } from '../DataSource/DashboardDataSource'
import { DashboardDataSource } from '../DataSource/DataSource'

export class DashboardRepositoryImpl implements DashboardRepository {
  private dashboardDataSource: DashboardDataSource
  constructor(_dashboardDataSource: DashboardDataSource) {
    this.dashboardDataSource = _dashboardDataSource
  }
  getNotification(profileId: string, cursor: string): Promise<NotificationResponse> {
    return this.dashboardDataSource.getNotification(profileId, cursor)
  }

  async getDailyData(
    installationId: string,
    timeZone: string
  ): Promise<DailyDataDTO['data']['extension']['getDailyData']> {
    return this.dashboardDataSource.getDailyData(installationId, timeZone)
  }

  getMantras(): string[] {
    return this.dashboardDataSource.getMantras()
  }
}
