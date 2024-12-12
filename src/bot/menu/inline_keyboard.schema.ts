import { OverviewElement } from '../session/index';
import { CB_ACTION, CB_CATEGORY, INLINE_ACTIONS } from './menu.type';



export const getOverviewMenu = (overviewElement: OverviewElement) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: INLINE_ACTIONS.EDIT_VALUE, callback_data: JSON.stringify({ category: CB_CATEGORY.OVERVIEW, action: CB_ACTION.EDIT_VALUE, type: overviewElement.measurement.type }) },
          { text: INLINE_ACTIONS.EDIT_PHOTO, callback_data: JSON.stringify({ category: CB_CATEGORY.OVERVIEW, action: CB_ACTION.EDIT_PHOTO, type: overviewElement.measurement.type }) },
        ],
        [
          { text: INLINE_ACTIONS.REMOVE_MEASURMENT, callback_data: JSON.stringify({ category: CB_CATEGORY.OVERVIEW, action: CB_ACTION.REMOVE_MEASURMENT, type: overviewElement.measurement.type }) },
        ],
      ],
    },
  };
};