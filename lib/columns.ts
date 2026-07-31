// Column indices match the raw column order of the "Issues- Realtime" tab.
// Column A is blank in the sheet, so index 0 is unused — kept for alignment.
export const COL = {
  ISSUE_ID: 1,
  CLIENT: 2,
  VEHICLE_NUMBER: 3,
  TIMESTAMP_RAISED: 4,
  YEAR: 5,
  MONTH: 6,
  RAISED_BY: 7,
  RAISED_VIA: 8,
  SUB_REQUEST: 9,
  ISSUE_DETAILS: 10,
  INCIDENT_TYPE: 11,
  REMARKS: 12,
} as const;
