/**
 * ════════════════════════════════════════════════════════
 *  ICT Registration System — Google Apps Script (FIXED)
 *  
 *  ✅ এটি Apps Script এ deployed করলেই কাজ করবে
 *  ✅ SPREADSHEET_ID না দিয়েও কাজ করে (Active spreadsheet ব্যবহার করে)
 *  ✅ আগে থেকে ডেটা রেখে থাকলেও সেফ
 * ════════════════════════════════════════════════════════
 */

// যদি Spreadsheet ID manually set করতে চাও, এখানে দাও:
// var SPREADSHEET_ID = '1a2b3c4d5e6f7g8h9i0j';
// না হলে active spreadsheet ব্যবহার হবে

function doPost(e) {
  try {
    // ──────────────────────────────────────────
    // ১. Request থেকে ডেটা নিয়ে আসো
    // ──────────────────────────────────────────
    Logger.log('===== doPost CALLED =====');
    Logger.log('Event object: ' + JSON.stringify(e));
    
    var payload = {};
    
    if (e && e.postData && e.postData.contents) {
      Logger.log('Raw contents: ' + e.postData.contents);
      payload = JSON.parse(e.postData.contents);
      Logger.log('Parsed payload: ' + JSON.stringify(payload));
    } else {
      Logger.log('WARNING: e or e.postData or e.postData.contents is missing');
    }

    var name      = (payload.name || '').trim();
    var college   = (payload.college || '').trim();
    var mobile    = (payload.mobile || '').trim();
    var comment   = (payload.comment || '').trim();
    var timestamp = payload.timestamp || new Date().toISOString();

    Logger.log('Extracted - name: ' + name + ', college: ' + college + ', mobile: ' + mobile);

    // Validation
    if (!name || !college || !mobile) {
      throw new Error('Name, College, Mobile are required. Got: name="' + name + '", college="' + college + '", mobile="' + mobile + '"');
    }

    // ──────────────────────────────────────────
    // ২. Spreadsheet খোলো
    // ──────────────────────────────────────────
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (!ss) {
      throw new Error('No active spreadsheet found');
    }

    // ──────────────────────────────────────────
    // ৩. আজকের তারিখে শিটের নাম
    // ──────────────────────────────────────────
    var sheetName = getTodayDateString();  // e.g. "08/05/2026"

    // ──────────────────────────────────────────
    // ৪. শিট পাও বা তৈরি করো
    // ──────────────────────────────────────────
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      // নতুন শিট তৈরি করো
      sheet = ss.insertSheet(sheetName);
      
      // Header row যোগ করো
      sheet.appendRow(['ক্রমিক', 'নাম', 'কলেজ', 'মোবাইল', 'মন্তব্য', 'সময়']);
      
      // Header styling
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange
        .setBackground('#1a0533')
        .setFontColor('#00f5ff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      
      // Column width
      sheet.setColumnWidth(1, 60);    // ক্রমিক
      sheet.setColumnWidth(2, 160);   // নাম
      sheet.setColumnWidth(3, 200);   // কলেজ
      sheet.setColumnWidth(4, 130);   // মোবাইল
      sheet.setColumnWidth(5, 250);   // মন্তব্য
      sheet.setColumnWidth(6, 180);   // সময়
      
      // Header freeze করো
      sheet.setFrozenRows(1);
      
      Logger.log('New sheet created: ' + sheetName);
    }

    // ──────────────────────────────────────────
    // ৫. ডেটা যোগ করো
    // ──────────────────────────────────────────
    var lastRow = sheet.getLastRow();
    var serial = lastRow;  // header = row 1, first data = serial 1
    
    var newRow = [
      serial,
      name,
      college,
      mobile,
      comment,
      formatTimeISO(timestamp)
    ];
    
    sheet.appendRow(newRow);
    
    Logger.log('Data appended: ' + JSON.stringify(newRow));

    // ──────────────────────────────────────────
    // ৬. সাফল্যের জবাব
    // ──────────────────────────────────────────
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved to sheet: ' + sheetName,
        serial: serial,
        sheet: sheetName,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Error জবাব
    Logger.log('ERROR: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * GET request handler — API test করার জন্য
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetCount = ss.getSheets().length;
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'ICT Registration API is running ✅',
      spreadsheet: ss.getName(),
      sheetCount: sheetCount,
      apiVersion: '2.0',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ════════════════════════════════════════════════════════

/**
 * আজকের তারিখ "DD/MM/YYYY" ফরম্যাটে
 * উদাহরণ: "08/05/2026"
 */
function getTodayDateString() {
  var now = new Date();
  var dd = String(now.getDate()).padStart(2, '0');
  var mm = String(now.getMonth() + 1).padStart(2, '0');
  var yyyy = now.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}


/**
 * ISO timestamp কে "DD/MM/YYYY HH:MM:SS" ফরম্যাটে রূপান্তর করে
 * উদাহরণ: "08/05/2026 14:32:05"
 */
function formatTimeISO(isoString) {
  try {
    var d = new Date(isoString);
    
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var yyyy = d.getFullYear();
    var hh = String(d.getHours()).padStart(2, '0');
    var min = String(d.getMinutes()).padStart(2, '0');
    var ss = String(d.getSeconds()).padStart(2, '0');
    
    return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min + ':' + ss;
  } catch (e) {
    Logger.log('Time format error: ' + e.toString());
    return isoString;
  }
}


// ════════════════════════════════════════════════════════
//  DEBUG / TEST FUNCTIONS
// ════════════════════════════════════════════════════════

/**
 * Apps Script এ সরাসরি test করতে এই function run করো
 * Run → testRegistration() → Execution log এ দেখো
 */
function testRegistration() {
  Logger.log('=== STARTING TEST ===');
  
  var testPayload = {
    name: 'আবদুল্লাহ আহমেদ',
    college: 'ঢাকা কলেজ',
    mobile: '01700000001',
    comment: 'এটি একটি test entry',
    timestamp: new Date().toISOString()
  };
  
  var jsonString = JSON.stringify(testPayload);
  Logger.log('Test payload (raw string): ' + jsonString);
  
  // doPost simulate করো — direct call করো
  var mockEvent = {
    postData: {
      contents: jsonString
    }
  };
  
  Logger.log('Mock event created successfully');
  var response = doPost(mockEvent);
  Logger.log('Response: ' + response.getContent());
  Logger.log('=== TEST COMPLETE ===');
}


/**
 * সব sheets দেখো
 */
function listAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  Logger.log('Total sheets: ' + sheets.length);
  sheets.forEach(function(sheet) {
    Logger.log(' - ' + sheet.getName() + ' (rows: ' + sheet.getLastRow() + ')');
  });
}
