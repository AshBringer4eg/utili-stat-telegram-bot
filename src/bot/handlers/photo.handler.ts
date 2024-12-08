import TelegramBot, { SendMessageOptions } from "node-telegram-bot-api";
import { Session } from "../session";
import { mainMenu, statSelectionMenu } from "../menu/schema";
import axios from "axios";
import { uploadToGoogleDrive } from "../../integration/google/drive.files";
import { authenticateGoogle } from "../../integration/google/auth";
import { Readable } from "stream";
import { formatDate, getLocaleButton } from "../../utils/locale.utils";

export default async(msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const session = Session.getInstance().getSession(chatId);

  if (!msg.photo || !msg.photo.length) {
    throw new Error("There is no acceptable photo in your message, please try another one.");
  }

  const uploadWaiting = session.getFileUploadWaiting();
  if (!uploadWaiting) {
    return bot.sendMessage(chatId, 'Please start photo session process with the button below to continue', mainMenu);
  }

  if (!uploadWaiting.type) {
    return bot.sendMessage(chatId, 'Please select correct photo stat type by pressing the button below', statSelectionMenu);
  }

  const largestPhoto = msg.photo[msg.photo.length - 1];
  const fileId = largestPhoto.file_id;

  try {
    // Get the file download URL
    const fileLink = await bot.getFileLink(fileId);

    const fileStream = await axios.get(fileLink, { responseType: 'stream' });
    let auth = null;
    try {
      auth = await authenticateGoogle();
    } catch (error) {
      if (error instanceof Error) {
        return bot.sendMessage(chatId, error.message, { parse_mode: "HTML" });
      } else {
        return bot.sendMessage(chatId, 'An unknown error occurred.');
      }
    }

    const fileName = `${formatDate(new Date())} - ${getLocaleButton(uploadWaiting.type)}.${fileLink.split('.').pop()}`;
    const readableStream = Readable.from(fileStream.data);
    const driveFileId = await uploadToGoogleDrive(auth, readableStream, fileName);
    bot.sendMessage(chatId, `File uploaded to Google Drive successfully! File details: <a href="${driveFileId.fileUrl}">${driveFileId.fileId}</a>`, Object.assign({}, statSelectionMenu, { parse_mode: 'HTML' }) as SendMessageOptions);
    session.resetFileUploadWaiting();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error processing file:', error.message);
      return bot.sendMessage(chatId, error.message);
    } else {
      console.error('An unknown error occurred.');
      return bot.sendMessage(chatId, 'An unknown error occurred.');
    }
  }
};