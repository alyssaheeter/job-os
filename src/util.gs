function getSheetOrThrow_(name) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sheet) {
    throw new Error("Missing sheet: " + name);
  }
  return sheet;
}

function getHeaderMap(sheet) {
  var lastColumn = sheet.getLastColumn();
  if (lastColumn === 0) {
    return {};
  }
  var headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var map = {};
  for (var i = 0; i < headerRow.length; i++) {
    var key = String(headerRow[i] || "").trim();
    if (key) {
      map[key] = i + 1;
    }
  }
  return map;
}

function appendRowByMap(sheet, rowMap) {
  var headerMap = getHeaderMap(sheet);
  var values = new Array(Object.keys(headerMap).length).fill("");
  Object.keys(rowMap).forEach(function(key) {
    if (!headerMap[key]) {
      throw new Error("Schema mismatch. Missing header for: " + key);
    }
    values[headerMap[key] - 1] = rowMap[key];
  });
  sheet.appendRow(values);
}

function updateRowByMap(sheet, rowIndex, rowMap) {
  var headerMap = getHeaderMap(sheet);
  var rowValues = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  Object.keys(rowMap).forEach(function(key) {
    if (!headerMap[key]) {
      throw new Error("Schema mismatch. Missing header for: " + key);
    }
    rowValues[headerMap[key] - 1] = rowMap[key];
  });
  sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
}

function readRowByMap(sheet, rowIndex) {
  var headerMap = getHeaderMap(sheet);
  var values = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = {};
  Object.keys(headerMap).forEach(function(key) {
    row[key] = values[headerMap[key] - 1];
  });
  return row;
}

function findRowById_(sheet, idColumnName, idValue) {
  var headerMap = getHeaderMap(sheet);
  var idCol = headerMap[idColumnName];
  if (!idCol) {
    throw new Error("Missing id column: " + idColumnName);
  }
  var data = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(idValue)) {
      return i + 2;
    }
  }
  return -1;
}

function generateId_(prefix) {
  var ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMddHHmmss");
  var rand = Math.floor(Math.random() * 1000000);
  return prefix + "_" + ts + "_" + rand;
}

function formatDate_(dateObj) {
  if (!dateObj) return "";
  return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function parseJsonSafe_(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return fallback;
  }
}

function ensureHeadersIfEmpty_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function coerceString_(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}
