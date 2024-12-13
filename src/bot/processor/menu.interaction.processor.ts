import TelegramBot from "node-telegram-bot-api";
import { closeMeasurementSessionMenu, confirmCancelMenu, fastCloseSessionMenu, getSelectMeasurementMenu, mainMenu, unauthorizedMenu } from "../menu/keyboard.schema";
import { Session } from "../session";
import { getLocaleButton } from "../../utils/locale.utils";
import { showOverview } from "./overview.processor";
import { ACTIONS } from "../menu/menu.type";


export default async (chatId: number, selectionData: string, bot: TelegramBot) => {
  const session = Session.getInstance().getSession(chatId);
  try {
    switch (selectionData) {
      case ACTIONS.START_MEASUREMENT_SESSION:
        if (session.hasNonFinalizedMeasurements()) {
          return bot.sendMessage(chatId, '📋 Select correct type of mesaurement that you want to make', getSelectMeasurementMenu(session));
        } else {
          return bot.sendMessage(chatId, '✅ You add all data in current session, overview inserted data or close session to make new measurements', getSelectMeasurementMenu(session));
        }
      case ACTIONS.SESSION_OVERVIEW:
        return showOverview(chatId, session, bot);
      case ACTIONS.CANCEL_MEASUREMENT_ELEMENT_ADD:
        try {
          await session.deleteMeasurment(session.getActiveMesurement());
          return bot.sendMessage(chatId, '✅ Measurement adding cancelled', getSelectMeasurementMenu(session));
        } catch (error) {
          if (error instanceof Error) {
            return bot.sendMessage(chatId, `❌ ${error.message}`, getSelectMeasurementMenu(session));
          } else {
            return bot.sendMessage(chatId, '❌ An unknown error occurred.', getSelectMeasurementMenu(session));
          }
        }
      case ACTIONS.CONFIRM_DELETE_MEASUREMENT:
        try {
          await session.deleteMeasurment(session.getAwaitingMesurement());
          return bot.sendMessage(chatId, '✅ Measurement removed successfully', getSelectMeasurementMenu(session));
        } catch (error) {
          if (error instanceof Error) {
            return bot.sendMessage(chatId, `❌ ${error.message}`, getSelectMeasurementMenu(session));
          } else {
            return bot.sendMessage(chatId, '❌ An unknown error occurred.', getSelectMeasurementMenu(session));
          }
        }
      case ACTIONS.CANCEL_MEASUREMENT_ELEMENT_EDIT:
        session.resetAllWaitings();
        return bot.sendMessage(chatId, '✅ Edit action was canceled', getSelectMeasurementMenu(session));
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
            return bot.sendMessage(chatId, `✏️ Now send in chat the measurement value for ${getLocaleButton(selectionData)}`, closeMeasurementSessionMenu);
          }
        }
        session.setActiveMeasurement(selectionData);
        return bot.sendMessage(chatId, '📸 Send your photo with compression to save your data');
    }
  } catch (error) {
    if (error instanceof Error) {
      return bot.sendMessage(chatId, `❌ ${error.message}`, mainMenu);
    } else {
      return bot.sendMessage(chatId, '❌ An unknown error occurred.', mainMenu);
    }
  }
};