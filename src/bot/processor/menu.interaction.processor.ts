import TelegramBot from "node-telegram-bot-api";
import { ACTIONS, cancelMenu, confirmCancelMenu, fastCloseSessionMenu, getSelectMeasurementMenu, mainMenu, unauthorizedMenu } from "../menu/schema";
import { Session } from "../session";
import { getLocaleButton } from "../../utils/locale.utils";


export default (chatId: number, selectionData: string, bot: TelegramBot) => {
  const session = Session.getInstance().getSession(chatId);
  switch (selectionData) {
    case ACTIONS.START_MEASUREMENT_SESSION:
      if (session.hasEmptyMeasurements()) {
        return bot.sendMessage(chatId, '📋 Select correct type of mesaurement that you want to make', getSelectMeasurementMenu(session));
      } else {
        return bot.sendMessage(chatId, '✅ You add all data in current session, close session to make new measurements ✅', fastCloseSessionMenu);
      }
    case ACTIONS.LOGOUT:
      session.resetPhoneNumber();
      return bot.sendMessage(chatId, '🚪 You are logged out successfully', unauthorizedMenu);
    case ACTIONS.CLOSE_MEASUREMENT_SESSION:
      return bot.sendMessage(chatId, '❓Are you sure? Session will be closed and data will be saved.', confirmCancelMenu);
    case ACTIONS.CONFIRM_CLOSE_MEASUREMENT_SESSION:
    case ACTIONS.FAST_MEASUREMENT_SESSION_CLOSE:
      session.resetMeasurementSession();
      return bot.sendMessage(chatId, '✅ Session closed successfully. Select your new action from the menu below', mainMenu);
    case ACTIONS.BACK_TO_MAIN_MENU:
      return bot.sendMessage(chatId,'Select your new action from the menu below', mainMenu);
    case ACTIONS.COLD_WATER:
    case ACTIONS.HOT_WATER:
    case ACTIONS.ELECTRICITY:
    case ACTIONS.HEAT_GJ:
    case ACTIONS.HEAT_M3:
    case ACTIONS.HEAT_SD:
      if (session.getActiveMesurement()?.type === selectionData) {
        if (session.getActiveMesurement()?.fileGdId) {
          return bot.sendMessage(chatId, `✏️ Now send in chat the measurement value for ${getLocaleButton(selectionData)}`, cancelMenu);
        }
      }
      session.setActiveMeasurement(selectionData);
      return bot.sendMessage(chatId, '📸 Send your photo with compression to save your data', cancelMenu);
  }
};