import { google, sheets_v4 } from 'googleapis';
import { authenticateGoogle } from './auth';
import { getLocaleButton, formatDate } from '../../utils/locale.utils';
import { MeasurementSessionElement } from '../../bot/session';
import moment from 'moment';
import configuration from '../../configuration';
import { valueToReadableUnit } from '../../utils/measurements.values.convertor';
import { compareRowToMeasurementData } from './utils';

// Your spreadsheet ID
const SPREADSHEET_ID = configuration.api.googleSheetStorageId;
const SHEET_NAME = configuration.api.googleSheetStorageSheetName;

const range = `${SHEET_NAME}!A:Z`;

const getSheetId = async (spreadsheetId: string | undefined) => {
  if (!SPREADSHEET_ID) {
    throw new Error('Google Sheets API configuration is missing');
  }
  const auth = await authenticateGoogle(); // Your authentication function
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetInfo = response.data.sheets || [];
    for (const sheet of sheetInfo) {
      if (sheet.properties?.title === SHEET_NAME) {
        return sheet.properties?.sheetId;
      }
    }
  } catch (error) {
    console.error('Error retrieving sheet IDs:', error);
  }
};

export function fromExcelEpochToDate(rawDate: number): Date {
  const excelEpoch = new Date(Date.UTC(1899, 11, 31)); // Excel's epoch is 1899-12-31
  return new Date(excelEpoch.getTime() + rawDate * 86400000);
}

export const getSheetData = async (mode: 'FORMULA' | 'FORMATTED_VALUE'): Promise<string[][]> => {
  const auth = await authenticateGoogle(); // Authenticate your API
  const sheets = google.sheets({ version: 'v4', auth });
  const getResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueRenderOption: mode, // Fetch formulas instead of evaluated values
  });
  return getResponse.data.values || [];
};

export const appendDataToSheet = async (request: sheets_v4.Params$Resource$Spreadsheets$Values$Append): Promise<void> => {
  const auth = await authenticateGoogle(); // Authenticate your API
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append(request);
};

export async function addMeasurementRow(activeMeasurement: MeasurementSessionElement): Promise<void> {
  try {
    // Step 1: Get the last 6 rows
    const values = await getSheetData('FORMULA');

    const localizedMeasurementType = getLocaleButton(activeMeasurement.type);
    for (let i = values.length - 1; i > 0; i--) {
      const value = values[i];
      if (!value) continue;
      const date = fromExcelEpochToDate(Number(value[0]));
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
                `=HYPERLINK("${activeMeasurement.fileUrl}";${String(activeMeasurement.value).replaceAll(/\./g, ',')})`,
                `=IF(C${newRowNumber}<>"";B${newRowNumber}&". Різниця "&TEXT(A${foundLineNumber}; "dd.mm.yyyy")&"->"&TEXT(A${newRowNumber}; "dd.mm.yyyy")&" = "&TRUNC(C${newRowNumber}-C${foundLineNumber};3)&" ${valueToReadableUnit(activeMeasurement.type)}";"")`,
              ],
            ],
          },
        };
        await appendDataToSheet(request);
        break;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}



export async function deleteMeasurementRow(measurement: MeasurementSessionElement, silent?: boolean): Promise<void> {
  const auth = await authenticateGoogle(); // Your authentication function
  const sheets = google.sheets({ version: 'v4', auth });

  const sheetId = await getSheetId(SPREADSHEET_ID);

  let deleted = false;
  const values = await getSheetData('FORMATTED_VALUE');
  for (let i = values.length - 1; i > 0; i--) {
    const gdDataRow = values[i];
    if (compareRowToMeasurementData(gdDataRow, measurement)) {
      const request = {
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetId, // ID of the sheet (not name)
                  dimension: 'ROWS', // Specify we're deleting rows
                  startIndex: i, // Row to start deletion (0-based index)
                  endIndex: i + 1, // Row to end deletion (exclusive)
                },
              },
            },
          ],
        },
      };
      try {
        await sheets.spreadsheets.batchUpdate(request);
        deleted = true;
        return;
      } catch (error) {
        if (silent) return;
        throw new Error(`Error deleting the sheet row: ${error}`);
      }
    }
  }
  if (!deleted) {
    if (silent) return;
    throw new Error(`Error deleting the sheet row: Can't find row to delete/edit in Google Sheets`);
  }
}
