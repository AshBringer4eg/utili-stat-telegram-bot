import TelegramBot from "node-telegram-bot-api";
import { BUTTONS, cancelFileUploadMenu, mainMenu, statSelectionMenu, unauthorizedMenu } from "../menu/schema";
import { Session } from "../session";


export default (chatId: number, selectionData: string, bot: TelegramBot) => {
  const session = Session.getInstance().getSession(chatId);
  switch (selectionData) {
    case BUTTONS.START_PHOTO_SESSION:
      return bot.sendMessage(chatId, 'Select photo stat type by pressing the button below', statSelectionMenu);
    case BUTTONS.LOGOUT:
      session.resetPhoneNumber();
      return bot.sendMessage(chatId, 'You are logged out successfully', unauthorizedMenu);
    case BUTTONS.RESET_FILE_UPLOAD_SESSION:
      session.resetFileUploadWaiting();
      return bot.sendMessage(chatId, 'Action cancelled. Select your new action from the menu below', mainMenu);
    case BUTTONS.COLD_AND_HOT_WATER:
      session.setFileUploadWaitingType(BUTTONS.COLD_AND_HOT_WATER);
      return bot.sendMessage(chatId, 'Send your photo with compression to save your data', cancelFileUploadMenu);
    case BUTTONS.COLD_WATER:
      session.setFileUploadWaitingType(BUTTONS.COLD_WATER);
      return bot.sendMessage(chatId, 'Send your photo with compression to save your data', cancelFileUploadMenu);
    case BUTTONS.HOT_WATER:
      session.setFileUploadWaitingType(BUTTONS.HOT_WATER);
      return bot.sendMessage(chatId, 'Send your photo with compression to save your data', cancelFileUploadMenu);
    case BUTTONS.ELECTRICITY:
      session.setFileUploadWaitingType(BUTTONS.ELECTRICITY);
      return bot.sendMessage(chatId, 'Send your photo with compression to save your data', cancelFileUploadMenu);
    case BUTTONS.HEAT_GJ:
      session.setFileUploadWaitingType(BUTTONS.HEAT_GJ);
      return bot.sendMessage(chatId, 'Send your photo with compression to save your data', cancelFileUploadMenu);
    case BUTTONS.HEAT_M3:
      session.setFileUploadWaitingType(BUTTONS.HEAT_M3);
      return bot.sendMessage(chatId, 'Send your photo with compression to save your data', cancelFileUploadMenu);
    case BUTTONS.HEAT_SD:
      session.setFileUploadWaitingType(BUTTONS.HEAT_SD);
      return bot.sendMessage(chatId, 'Send your photo with compression to save your data', cancelFileUploadMenu);
  }
};