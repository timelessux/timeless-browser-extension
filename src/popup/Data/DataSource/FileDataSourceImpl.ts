import { EStatusReact } from "../../../../ts";
import { FileDataSource } from "./DataSource";

export class FileDataSourceImpl implements FileDataSource {
  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cloud_name", "timeless")
    formData.append("upload_preset", "social_media_post")
    formData.append("resource_type", "auto")

    const response = await fetch("https://api.cloudinary.com/v1_1/timeless/auto/upload", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      console.log("File successfully uploaded:", data);
      return data["secure_url"]
    } else {
      console.error("File upload failed:", response.status, response.statusText);
      return EStatusReact.FAILED
    }
  }
}