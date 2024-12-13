import TelegramBot from "node-telegram-bot-api";
import { Session } from "../session";
import { cancelMeasurementElementAddMenu, closeMeasurementSessionMenu, getSelectMeasurementMenu } from "../menu/keyboard.schema";
import axios from "axios";
import { deleteFile, makePhotoVisibleByLink, uploadToGoogleDrive } from "../../integration/google/drive.files";
import { Readable } from "stream";
import { formatDate, getLocaleButton } from "../../utils/locale.utils";
import { addMeasurementRow, deleteMeasurementRow } from "../../integration/google/sheets";
import { valueToReadableString } from "../../utils/measurements.values.convertor";

export default async(msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const session = Session.getInstance().getSession(chatId);
  const operatingMeasurement = session.getAwaitingMesurement() || session.getActiveMesurement();;

  if (!msg.photo || !msg.photo.length) {
    throw new Error("There is no acceptable photo in your message, please try another one.");
  }

  if (operatingMeasurement) {
    const largestPhoto = msg.photo[msg.photo.length - 1];
    const fileTgId = largestPhoto.file_id;

    if (!operatingMeasurement) {
      return bot.sendMessage(chatId, 'Please select measurement element with the button below before you send the photo', getSelectMeasurementMenu(session));
    } else {
      bot.sendMessage(chatId, '📸 Your photo is being processed... \n\n 📸 Please wait...');
    }

    operatingMeasurement.fileTgId = fileTgId;

    try {
    // Get the file download URL
      const fileLink = await bot.getFileLink(fileTgId);

      const fileStream = await axios.get(fileLink, { responseType: 'stream' });

      const oldFileGdId = operatingMeasurement.fileGdId;

      const date = formatDate(new Date());
      const fileName = `${date} - ${getLocaleButton(operatingMeasurement.type)}.${fileLink.split('.').pop()}`;
      const readableStream = Readable.from(fileStream.data);
      const { fileId, fileUrl } = await uploadToGoogleDrive(readableStream, fileName);
      await makePhotoVisibleByLink(fileId);

      if (operatingMeasurement.waitForPhotoEdit && oldFileGdId) {
        await deleteFile(oldFileGdId, true);
        await deleteMeasurementRow(operatingMeasurement, true);
      }
      operatingMeasurement.value = msg.caption ? Number(msg.caption) : operatingMeasurement.value;
      operatingMeasurement.fileGdId = fileId;
      operatingMeasurement.fileUrl = fileUrl;
      operatingMeasurement.directPreviewUrl = `https://drive.google.com/uc?id=${fileId}`;
      operatingMeasurement.date = date;

      // TODO: Move to separate method in class
      if (operatingMeasurement.value) {
        await addMeasurementRow(operatingMeasurement);
        if (!operatingMeasurement.finalized) operatingMeasurement.finalized = true;
        if (operatingMeasurement.waitForPhotoEdit) operatingMeasurement.waitForPhotoEdit = false;
        if (operatingMeasurement.active) operatingMeasurement.active = false;
        await bot.sendMessage(chatId, `✏️ Successfully saved your ${operatingMeasurement.waitForPhotoEdit ? 'new photo and ' : ''} value ${valueToReadableString(operatingMeasurement.value, operatingMeasurement.type)} for ${getLocaleButton(operatingMeasurement.type)}`, getSelectMeasurementMenu(session));
      } else {
        await bot.sendMessage(chatId, `✅ File uploaded to Google Drive successfully! \n\n ✏️ Now send in chat the measurement value`, cancelMeasurementElementAddMenu);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error processing file:', error.message);
        return bot.sendMessage(chatId, `❌ ${error.message}`, getSelectMeasurementMenu(session));
      } else {
        console.error('An unknown error occurred.');
        return bot.sendMessage(chatId, `❌ An unknown error occurred.`, getSelectMeasurementMenu(session));
      }
    }
  }
};