import TelegramBot, { SendMessageOptions } from "node-telegram-bot-api";
import { getSelectMeasurementMenu } from "../menu/keyboard.schema";
import { SessionElement } from "../session";
import { getOverviewMenu } from "../menu/inline_keyboard.schema";
import { valueToReadableString } from "../../utils/measurements.values.convertor";
import { ACTIONS } from "../menu/menu.type";

export const showOverview = async (chatId: number, session: SessionElement, bot: TelegramBot) => {
  const overview = await session.getOverview();
  bot.sendMessage(chatId, `📊 Session overview for ${overview.length} measurement(s). \n Please wait, it could take some time to validate photo links.`, getSelectMeasurementMenu(session));
  for (const { google, measurement } of await session.getOverview()) {
    if (!measurement.directPreviewUrl){
      bot.sendMessage(chatId, `<a href="${measurement.fileUrl}">🖼️[${google.date}]</a> ${google.type}: ${valueToReadableString(google.value, google.type as ACTIONS)}\n\n ⚠️Warning: no preview image. Check image link!⚠️`, Object.assign({}, getOverviewMenu({ google, measurement }), { parse_mode: 'HTML' }) as SendMessageOptions);
    } else {
      try {
        bot.sendPhoto(chatId, measurement.directPreviewUrl,
          Object.assign({}, getOverviewMenu({ google, measurement }), {
            caption: `<b>[${google.date}]</b> ${google.type}: <b>${valueToReadableString(google.value, measurement.type as ACTIONS)}</b>`,
            parse_mode: 'HTML',
          }) as SendMessageOptions);
      } catch (error) {
        if (error instanceof Error) {
          bot.sendMessage(chatId, `❌ ${error.message}`, getSelectMeasurementMenu(session));
        } else {
          bot.sendMessage(chatId, '❌ An unknown error occurred.', getSelectMeasurementMenu(session));
        }
      }
    }


  }
};
