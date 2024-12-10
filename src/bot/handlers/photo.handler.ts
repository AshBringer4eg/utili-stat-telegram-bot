import TelegramBot, { SendMessageOptions } from "node-telegram-bot-api";
import { Session } from "../session";
import { cancelMenu, getSelectMeasurementMenu } from "../menu/schema";
import axios from "axios";
import { uploadToGoogleDrive } from "../../integration/google/drive.files";
import { authenticateGoogle } from "../../integration/google/auth";
import { Readable } from "stream";
import { formatDate, getLocaleButton } from "../../utils/locale.utils";

export default async(msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const session = Session.getInstance().getSession(chatId);
  const activeMeasurement = session.getActiveMesurement();

  if (!msg.photo || !msg.photo.length) {
    throw new Error("There is no acceptable photo in your message, please try another one.");
  }

  if (!activeMeasurement) {
    return bot.sendMessage(chatId, 'Please select measurement element with the button below to continue', getSelectMeasurementMenu(session));
  }

  const largestPhoto = msg.photo[msg.photo.length - 1];
  const fileTgId = largestPhoto.file_id;

  activeMeasurement.fileTgId = fileTgId;

  try {
    // Get the file download URL
    const fileLink = await bot.getFileLink(fileTgId);

    const fileStream = await axios.get(fileLink, { responseType: 'stream' });
    let auth = null;
    try {
      auth = await authenticateGoogle();
    } catch (error) {
      if (error instanceof Error) {
        return bot.sendMessage(chatId, `❌ ${error.message}`, cancelMenu);
      } else {
        return bot.sendMessage(chatId, '❌ An unknown error occurred.');
      }
    }

    const date = formatDate(new Date());
    const fileName = `${date} - ${getLocaleButton(activeMeasurement.type)}.${fileLink.split('.').pop()}`;
    const readableStream = Readable.from(fileStream.data);
    const { fileId, fileUrl } = await uploadToGoogleDrive(auth, readableStream, fileName);

    activeMeasurement.fileGdId = fileId;
    activeMeasurement.fileUrl = fileUrl;
    activeMeasurement.date = date;

    await bot.sendMessage(chatId, `✅ File uploaded to Google Drive successfully! File details: <a href="${activeMeasurement.fileUrl}">${activeMeasurement.fileGdId}</a>`, Object.assign({}, cancelMenu, { parse_mode: 'HTML' }) as SendMessageOptions);
    await bot.sendMessage(chatId, `✏️ Now send in chat the measurement value`, cancelMenu);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error processing file:', error.message);
      return bot.sendMessage(chatId, `❌ ${error.message}`, cancelMenu);
    } else {
      console.error('An unknown error occurred.');
      return bot.sendMessage(chatId, `❌ An unknown error occurred.`, cancelMenu);
    }
  }
};