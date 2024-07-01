import { FileRepository } from "../../Domain/Repository/FileRepository";
import { FileDataSource } from "../DataSource/DataSource";

export class FileRepositoryImpl implements FileRepository {
  private fileDataSource: FileDataSource
  constructor(_fileDataSource: FileDataSource) {
    this.fileDataSource = _fileDataSource
  }

  upload(file: File): Promise<string> {
    return this.fileDataSource.upload(file)
  }
}