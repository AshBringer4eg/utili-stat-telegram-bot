import { ACTIONS } from "../bot/menu/schema";

export default (measurement: ACTIONS) => {
  switch (measurement) {
    case ACTIONS.HOT_WATER:
    case ACTIONS.COLD_WATER:
    case ACTIONS.HEAT_M3:
      return 'm3';
    case ACTIONS.ELECTRICITY:
      return "кВт";
    case ACTIONS.HEAT_GJ:
      return "Gj";
    case ACTIONS.HEAT_SD:
      return 'Sd';
    default:
      return '###';
  }
};