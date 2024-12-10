import { google } from 'googleapis';
import { authenticateGoogle as authenticate } from './auth';
import { getLocaleButton, formatDate } from '../../utils/locale.utils';
import { MeasurementSessionElement } from '../../bot/session';
import moment from 'moment';
import configuration from '../../configuration';
import mvc from '../../utils/measurements.values.convertor';

// Your spreadsheet ID
const SPREADSHEET_ID = configuration.api.googleSheetStorageId;
const SHEET_NAME = configuration.api.googleSheetStorageSheetName;

function fromExcelEpochToDate(rawDate: number): Date {
  const excelEpoch = new Date(Date.UTC(1899, 11, 31)); // Excel's epoch is 1899-12-31
  return new Date(excelEpoch.getTime() + rawDate * 86400000);
}

export async function addMeasurementRow(activeMeasurement: MeasurementSessionElement): Promise<void> {
  const auth = await authenticate(); // Authenticate your API
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Step 1: Get the last 6 rows
    const range = `${SHEET_NAME}!A:Z`;
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueRenderOption: 'FORMULA', // Fetch formulas instead of evaluated values
    });
    const values = getResponse.data.values || [];

    const localizedMeasurementType = getLocaleButton(activeMeasurement.type);
    for (let i = values.length - 1; i > 0; i--) {
      const value = values[i];
      if (!value) continue;
      const date = fromExcelEpochToDate(value[0]);
      if (
        localizedMeasurementType === value[1] &&
        formatDate(date) !== activeMeasurement.date
      ) {
        const foundLineNumber = i + 1;
        const newRowNumber = values.length + 1;
        const request = {
          spreadsheetId: SPREADSHEET_ID,
          range,
          valueInputOption: 'USER_ENTERED', // You can also use 'USER_ENTERED' if you want Google Sheets to interpret the data
          resource: {
            values: [
              [
                moment(activeMeasurement.date, 'YY.MM.DD').format('DD.MM.YYYY'),
                localizedMeasurementType,
                `=HYPERLINK("${activeMeasurement.fileUrl}";${activeMeasurement.value})`,
                `=IF(C${newRowNumber}<>"";B${newRowNumber}&". Різниця "&TEXT(A${foundLineNumber}; "dd.mm.yyyy")&"->"&TEXT(A${newRowNumber}; "dd.mm.yyyy")&" = "&TRUNC(C${newRowNumber}-C${foundLineNumber};3)&" ${mvc(activeMeasurement.type)}";"")`,
              ], //
            ],
          },
        };
        activeMeasurement.sheetRowNumber = newRowNumber;
        await sheets.spreadsheets.values.append(request);
        break;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}