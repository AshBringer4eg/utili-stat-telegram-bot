import { google } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Readable } from "stream";

export async function uploadToGoogleDrive(auth: OAuth2Client, fileStream: Readable, fileName: string) : Promise<{ fileId: string, fileUrl: string }> {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = { name: fileName, parents: ['1Sy6y39jf_gePCJPgv-nfrGPJhRAm8TAQ'] };

  const media = { mimeType: 'application/octet-stream', body: fileStream };

  const response = await drive.files.create({
    requestBody: fileMetadata,  // Metadata of the file
    media,  // Media (file content)
    fields: 'id',  // Request only the file ID in the response
  });

  // TypeScript expects response.data to contain file details
  if (!response.data || !response.data.id) {
    throw new Error('File upload failed: No file ID returned.');
  }
  const fileId = response.data.id;
  const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

  // Return the file ID
  return { fileId, fileUrl };
}