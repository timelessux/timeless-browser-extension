export interface FileRepository {
  upload(file: File): Promise<string>
}