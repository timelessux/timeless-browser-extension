import BaseService from '../../../../services/axios'
import { UserDataSource } from '../../Data/DataSource/UserDataSource'
import { CommunityTagDataSourceImpl } from '../../Data/DataSource/CommunityTagDataSource'
import { DashboardDataSourceImpl } from '../../Data/DataSource/DashboardDataSource'
import { InternalProfileDataSourceImpl } from '../../Data/DataSource/InternalProfileDataSource'
import { MidjourneyDataSourceImpl } from '../../Data/DataSource/MidjourneyDataSource'
import { PostDataSourceImpl } from '../../Data/DataSource/PostDataSource'
import { SendDataSourceImpl } from '../../Data/DataSource/SendDataSource'
import { CommunityTagRepositoryImpl } from '../../Data/Repository/CommunityTagRepositoryImpl'
import { DashboardRepositoryImpl } from '../../Data/Repository/DashboardRepositoryImpl'
import { InternalProfileRepositoryImpl } from '../../Data/Repository/InternalProfileRepositoryImpl'
import { MidjourneyRepositoryImpl } from '../../Data/Repository/MidjourneyRepositoryImpl'
import { PostRepositoryImpl } from '../../Data/Repository/PostRepositoryImpl'
import { SendRepositoryImpl } from '../../Data/Repository/SendRepository'
import { UserRepositoryImpl } from '../../Data/Repository/UserRepositoryImpl'
import { WalletConnectDatasourceImpl } from '../../Data/DataSource/WalletConnectDataSource'
import { WalletConnectRepositoryImpl } from '../../Data/Repository/WalletConnectRepositoryImpl'
import { FileDataSourceImpl } from '../../Data/DataSource/FileDataSourceImpl'
import { FileRepositoryImpl } from '../../Data/Repository/FileRepositoryImpl'
import { NftDataSourceImpl } from '../../Data/DataSource/NftDataSource'
import { NftRepositoryImpl } from '../../Data/Repository/NftRepositoryImpl'

const InternalProfileRepository = (axiosClient: BaseService) => {
  const internalProfileDataSource = new InternalProfileDataSourceImpl(axiosClient)
  const internalProfileRepository = new InternalProfileRepositoryImpl(internalProfileDataSource)
  return internalProfileRepository
}

const CommunityTagRepository = (axiosClient: BaseService) => {
  const communityTagDataSource = new CommunityTagDataSourceImpl(axiosClient)
  const communityTagRepository = new CommunityTagRepositoryImpl(communityTagDataSource)
  return communityTagRepository
}

const SendRepository = (axiosClient: BaseService) => {
  const sendDataSource = new SendDataSourceImpl(axiosClient)
  const sendDataRepository = new SendRepositoryImpl(sendDataSource)
  return sendDataRepository
}

const MidjourneyRepository = () => {
  const MidjourneyDataSource = new MidjourneyDataSourceImpl()
  const MidjourneyRepository = new MidjourneyRepositoryImpl(MidjourneyDataSource)
  return MidjourneyRepository
}

const PostRepository = (axiosClient: BaseService) => {
  const PostDataSource = new PostDataSourceImpl(axiosClient)
  const UserDataSourceImpl = new UserDataSource(axiosClient)
  const PostRepository = new PostRepositoryImpl(PostDataSource, UserDataSourceImpl)
  return PostRepository
}

const DashboardRepository = () => {
  const DashboardDataSource = new DashboardDataSourceImpl()
  const DashboardRepository = new DashboardRepositoryImpl(DashboardDataSource)
  return DashboardRepository
}

const UserRepository = (axiosClient: BaseService) => {
  const UserDataSourceImpl = new UserDataSource(axiosClient)
  const UserRepository = new UserRepositoryImpl(UserDataSourceImpl)
  return UserRepository
}

const WalletConnectRepository = (axiosClient: BaseService) => {
  const WalletConnectDataSource = new WalletConnectDatasourceImpl(axiosClient)
  const WalletConnectRepository = new WalletConnectRepositoryImpl(WalletConnectDataSource)
  return WalletConnectRepository
}

const FileRepository = () => {
  const FileDataSource = new FileDataSourceImpl()
  const FileRepository = new FileRepositoryImpl(FileDataSource)
  return FileRepository
}

const NftRepository = () => {
  const NftDataSource = new NftDataSourceImpl()
  const NftRepository = new NftRepositoryImpl(NftDataSource)
  return NftRepository
}

export {
  InternalProfileRepository,
  CommunityTagRepository,
  MidjourneyRepository,
  PostRepository,
  SendRepository,
  DashboardRepository,
  UserRepository,
  WalletConnectRepository,
  FileRepository,
  NftRepository
}
