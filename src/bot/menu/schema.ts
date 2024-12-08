/* eslint-disable no-unused-vars */
export enum BUTTONS {
  SHARE_CONTACTS = 'Share Contacts',
  START_PHOTO_SESSION = 'Start Photo Session',
  LOGOUT="Logout",
  RESET_FILE_UPLOAD_SESSION = 'Cancel Stats photo upload',
  HOT_WATER = 'Hot Water',
  COLD_WATER = 'Cold Water',
  COLD_AND_HOT_WATER = 'Cold and Hot Water',
  ELECTRICITY = 'Electricity',
  HEAT_GJ = 'Heat (GJ)',
  HEAT_M3 = 'Heat (m3)',
  HEAT_SD = 'Heat (Sd)',
}


export const unauthorizedMenu = {
  reply_markup: {
    keyboard: [
      [{
        text: BUTTONS.SHARE_CONTACTS,
        request_contact: true,
      }],
    ],
    resize_keyboard: true,
  },
};

export const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: BUTTONS.START_PHOTO_SESSION }, { text: BUTTONS.LOGOUT }],
    ],
    resize_keyboard: true,
  },
};

export const statSelectionMenu = {
  reply_markup: {
    keyboard: [
      [{ text: BUTTONS.COLD_WATER }, { text: BUTTONS.HOT_WATER }, { text: BUTTONS.COLD_AND_HOT_WATER }],
      [{ text: BUTTONS.ELECTRICITY }],
      [{ text: BUTTONS.HEAT_GJ }, { text: BUTTONS.HEAT_M3 }, { text: BUTTONS.HEAT_SD }],
      [{ text: BUTTONS.RESET_FILE_UPLOAD_SESSION }],
    ],
    resize_keyboard: true,
  },
};

export const cancelFileUploadMenu = {
  reply_markup: {
    keyboard: [
      [{ text: BUTTONS.RESET_FILE_UPLOAD_SESSION }],
    ],
    resize_keyboard: true,
  },
};