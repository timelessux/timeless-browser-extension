import { DailyDataDTO } from '../../Data/DataSource/DashboardDataSource'
import { NotificationResponse } from '../Model/Notification'

export interface DashboardRepository {
  getDailyData(
    installationId: string,
    timeZone: string
  ): Promise<DailyDataDTO['data']['extension']['getDailyData']>
  getMantras(): Array<string>
  getNotification(profileId: string, cursor: string): Promise<NotificationResponse>
}
