import moment from "moment";
import { MeasurementSessionElement } from "../../bot/session";
import { getLocaleButton } from "../../utils/locale.utils";

export const compareRowToMeasurementData = (googleSheetRow: string[], measurementData: MeasurementSessionElement): boolean => {
  if (
    moment(googleSheetRow[0], 'DD.MM.YYYY').isSame(moment(measurementData.date, 'YY.MM.DD')) &&
    googleSheetRow[1] === getLocaleButton(measurementData.type) &&
    parseFloat(googleSheetRow[2]) === parseFloat(measurementData.value?.toString().replaceAll(/\./g, ',') || '-1')
  ) {
    return true;
  }
  return false;
};