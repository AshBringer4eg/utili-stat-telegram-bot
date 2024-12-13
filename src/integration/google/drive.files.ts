import { google } from "googleapis";
import { Readable } from "stream";
import configuration from "../../configuration";
import { authenticateGoogle } from "./auth";

export async function uploadToGoogleDrive(fileStream: Readable, fileName: string) : Promise<{ fileId: string, fileUrl: string }> {
  const auth = await authenticateGoogle();
  const drive = google.drive({ version: 'v3', auth });
  if (!configuration.api.googleStorageFolderId){
    throw new Error("No GOOGLE_STORAGE_FOLDER_ID has been given in the .env file");
  }
  const fileMetadata = { name: fileName, parents: [configuration.api.googleStorageFolderId] };

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

export async function makePhotoVisibleByLink(fileId: string) {
  const auth = await authenticateGoogle();
  const drive = google.drive({ version: 'v3', auth });
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });
}

export const deleteFile = async (fileId: string, silent?: boolean) => {
  try {
    // Authenticate with the Google API
    const auth = await authenticateGoogle();
    const drive = google.drive({ version: 'v3', auth });

    // Call the delete method
    await drive.files.delete({ fileId });
  } catch (error) {
    if (silent) return;
    throw new Error(`Error deleting the file: ${error}`);
  }
};