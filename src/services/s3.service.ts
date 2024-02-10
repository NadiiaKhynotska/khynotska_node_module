import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import * as crypto from "crypto";
import { UploadedFile } from "express-fileupload";
import * as path from "path";

import { configs } from "../configs";
import { EFileType } from "../enums";

class S3Service {
  constructor(
    private client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_S3_ACCESS_KEY,
        secretAccessKey: configs.AWS_S3_SECRET_KEY,
      },
    }),
  ) {}
  public async uploadFile(
    itemId: string,
    uploadFile: UploadedFile,
    itemTye: EFileType,
  ): Promise<string> {
    const filePath = this.buildFilePath(itemTye, itemId, uploadFile.name);
    await this.client.send(
      new PutObjectCommand({
        ACL: "public-read",
        Body: uploadFile.data,
        Bucket: configs.AWS_S3_BUCKET_NAME,
        ContentType: uploadFile.mimetype,
        Key: filePath,
      }),
    );
    return filePath;
  }
  public async deleteFile(filePath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: configs.AWS_S3_BUCKET_NAME,
        Key: filePath,
      }),
    );
  }

  private buildFilePath(itemType: EFileType, itemId: string, fileName: string) {
    return `${itemType}/${itemId}/${crypto.randomUUID()}${path.extname(
      fileName,
    )}`;
  }
}

export const s3Service = new S3Service();
