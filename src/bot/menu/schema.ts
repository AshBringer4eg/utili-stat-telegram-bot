import { SessionElement } from "../session";

/* eslint-disable no-unused-vars */
export enum ACTIONS {
  SHARE_CONTACTS = '📞 Share Contacts',

  START_MEASUREMENT_SESSION = '📏 Open Measurement Session',

  LOGOUT="🚪 Logout",
  BACK_TO_MAIN_MENU = '🏠 Back to main menu 🏠',
  CLOSE_MEASUREMENT_SESSION = '✅ Close Measurement session ✅',
  FAST_MEASUREMENT_SESSION_CLOSE = '✅ End current Measurement session ✅',
  CONFIRM_CLOSE_MEASUREMENT_SESSION = '👍 I\'m sure I want to close Measurement session',

  HOT_WATER = '🔥 Hot Water',
  COLD_WATER = '❄️ Cold Water',
  ELECTRICITY = '⚡ Electricity',
  HEAT_GJ = '🌡️ Heat (GJ)',
  HEAT_M3 = '🌡️ Heat (m3)',
  HEAT_SD = '🌡️Heat (Sd)',
}


export const unauthorizedMenu = {
  reply_markup: {
    keyboard: [
      [{
        text: ACTIONS.SHARE_CONTACTS,
        request_contact: true,
      }],
    ],
    resize_keyboard: true,
  },
};

export const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.START_MEASUREMENT_SESSION }, { text: ACTIONS.LOGOUT }],
    ],
    resize_keyboard: true,
  },
};

export const cancelMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.CLOSE_MEASUREMENT_SESSION }],
    ],
    resize_keyboard: true,
  },
};

export const fastCloseSessionMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.FAST_MEASUREMENT_SESSION_CLOSE }, { text: ACTIONS.BACK_TO_MAIN_MENU }],
    ],
    resize_keyboard: true,
  },
};


export const confirmCancelMenu = {
  reply_markup: {
    keyboard: [
      [{ text: ACTIONS.CONFIRM_CLOSE_MEASUREMENT_SESSION }, { text: ACTIONS.BACK_TO_MAIN_MENU }],
    ],
    resize_keyboard: true,
  },
};

export const getSelectMeasurementMenu = (session: SessionElement) => {
  const measurementSession = session.getMeasurementSession();
  const statSelectionMenu = {
    reply_markup: {
      keyboard: [
        [{ text: ACTIONS.CLOSE_MEASUREMENT_SESSION }],
      ],
      resize_keyboard: true,
    },
  };

  const keyboard = statSelectionMenu.reply_markup.keyboard;

  if (session.hasEmptyMeasurements()) {
    keyboard[0].push({ text: ACTIONS.BACK_TO_MAIN_MENU });
  }

  let buttonsAdded = 0;
  for (const key in measurementSession) {
    const measurement = measurementSession[key];

    if (buttonsAdded % 3 === 0) {
      keyboard.unshift([]);
    }

    if (!measurement.finalized) {
      keyboard[0].push({ text: measurement.type });
      buttonsAdded++;
    }
  }

  return statSelectionMenu;
};