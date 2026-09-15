/**
 * =======================================================================
 * PitchReady — Google Apps Script for Google Sheets Persistent Lead Sync
 * =======================================================================
 * 
 * HOW TO SET UP IN 2 MINUTES:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click Extensions > Apps Script
 * 3. Paste this entire code into Code.gs
 * 4. Click Deploy > New Deployment
 * 5. Select type: "Web app"
 *    - Description: PitchReady Form Sync
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Required for webhooks from Vercel / serverless)
 * 6. Copy the Web App URL (e.g. https://script.google.com/macros/s/.../exec)
 * 7. In Vercel Project Settings > Environment Variables, add:
 *    GOOGLE_SHEETS_WEBHOOK_URL = <your Web App URL>
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait up to 10 seconds for other concurrent requests
    lock.waitLock(10000);

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.sheet === 'Interviews' || data.action === 'schedule_interview') {
      appendInterviewRow(ss, data);
    } else {
      appendSubmissionRow(ss, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', id: data.id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function appendSubmissionRow(ss, data) {
  var sheet = ss.getSheetByName('Submissions');
  if (!sheet) {
    sheet = ss.insertSheet('Submissions');
    sheet.appendRow([
      'Timestamp',
      'ID',
      'Type',
      'Company / Candidate Name',
      'Contact Person',
      'Phone',
      'Email',
      'City',
      'Role Needed / Target Role',
      'Openings / Experience',
      'Status',
      'Offline Synced',
      'Raw Payload JSON'
    ]);
    sheet.getRange(1, 1, 1, 13).setFontWeight('bold').setBackground('#173d34').setFontColor('#ffffff');
  }

  var name = data.companyName || data.candidateName || data.name || '';
  var contact = data.contactPerson || '';
  var phone = data.phone || data.empPhone || data.candPhone || '';
  var email = data.email || data.empEmail || data.candEmail || '';
  var city = data.city || data.empCity || data.candCity || '';
  var role = data.roleNeeded || data.targetRole || data.candRole || '';
  var openingsOrExp = data.openings || data.experience || '';

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.id || '',
    data.type || '',
    name,
    contact,
    phone,
    email,
    city,
    role,
    openingsOrExp,
    data.status || 'Received',
    data.isOffline ? 'Yes' : 'No',
    data.rawJson || JSON.stringify(data)
  ]);
}

function appendInterviewRow(ss, data) {
  var sheet = ss.getSheetByName('Interviews');
  if (!sheet) {
    sheet = ss.insertSheet('Interviews');
    sheet.appendRow([
      'Timestamp',
      'Interview ID',
      'Company Name',
      'Candidate Name',
      'Candidate ID',
      'Interview Date',
      'Interview Time',
      'Meeting Format',
      'Status'
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#173d34').setFontColor('#ffffff');
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.id || '',
    data.companyName || '',
    data.candidateName || '',
    data.candidateId || '',
    data.interviewDate || data.date || '',
    data.interviewTime || data.time || '',
    data.meetingFormat || data.format || '',
    data.status || 'Confirmed'
  ]);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', service: 'PitchReady Google Sheets Sync' }))
    .setMimeType(ContentService.MimeType.JSON);
}
