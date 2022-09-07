var weeklyMemoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Weekly Memo Sandbox");
var formulaSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FormulaSheet");
var currentMenuItem;

const queryCell = weeklyMemoSheet.getRange("F65");
const queryCellRowNum = 65;
const queryCellColNum = 6;

const dropDownCellTitle = weeklyMemoSheet.getRange("B62").getValue(); // drop down cell
const dropDownCell = weeklyMemoSheet.getRange("B62");
const dropDownCellColumnNum = 4;
const dropDownCellRow = 62;
const descriptionCell = weeklyMemoSheet.getRange("B64");

//header types
var fiveColumnHeader = weeklyMemoSheet.getRange("F64:J64");
var sixColumnHeader = weeklyMemoSheet.getRange("F64:K64");
var threeColumnHeader = weeklyMemoSheet.getRange("F64:H64");

var ssHeader = formulaSheet.getRange("A7:E7");
var fdHeader = formulaSheet.getRange("A9:F9");
var saHeader = formulaSheet.getRange("A11:C11");
var tlpHeader = formulaSheet.getRange("A13:E13");
var recognitionHeader = formulaSheet.getRange("A23:J79");

var ssQuery = formulaSheet.getRange("A1").getFormula(); // study session query
var fdQuery = formulaSheet.getRange("A2").getFormula(); // front desk query
var saQuery = formulaSheet.getRange("A3").getFormula(); // seminar attendance query
var tlpQuery = formulaSheet.getRange("A4").getFormula(); // team leader performance query

// conditional formatting rules function

// function clearMainHeader() {
//   mainHeaderRow = weeklyMemoSheet.getRange("F64:L64").clear();
// }

function refreshButton() {

  // clearMainHeader();
  // resetFormat(weeklyMemoSheet.getRange(queryCellRowNum, queryCellColNum, num_Freshmen + num_Sophomores + num_TLs + 10, 6));
  reformatCells();

  if (dropDownCellTitle == "Study Sessions") {                 // STUDY SESSION QUERY + FORMATTING
    dropDownCell.setValue("Study Sessions");

    ssHeader.copyFormatToRange(weeklyMemoSheet, 6, 11, 64, 64);
    fiveColumnHeader.setValues(ssHeader.getValues());

    queryCell.setValue(ssQuery);
    
  } else if (dropDownCellTitle == "Front Desk") {              // FRONT DESK QUERY + FORMATTING
   
    dropDownCell.setValue("Front Desk");

    // fdHeader.copyTo(fiveColumnHeader);
    fdHeader.copyFormatToRange(weeklyMemoSheet, 6, 12, 64, 64);
    sixColumnHeader.setValues(fdHeader.getValues());

    queryCell.setValue(fdQuery);

  } else if (dropDownCellTitle == "Seminar Attendance") {      // SEMINAR ATTENDANCE QUERY + FORMATTING
    dropDownCell.setValue("Seminar Attendance");

    saHeader.copyFormatToRange(weeklyMemoSheet, 6, 9, 64, 64);
    threeColumnHeader.setValues(saHeader.getValues());

    queryCell.setValue(saQuery);
  } else if (dropDownCellTitle == "Team Leader Performance") {  // TEAM LEADER PERFORMANCE QUERY + FORMATTING
    dropDownCell.setValue("Team Leader Performance");

    tlpHeader.copyFormatToRange(weeklyMemoSheet, 6, 11, 64, 64);
    fiveColumnHeader.setValues(tlpHeader.getValues());

    queryCell.setValue(tlpQuery);
  }
  currentMenuItem = dropDownCellTitle;
}

function reformatCells() {
  if (dropDownCellTitle == "Study Sessions") {                   // FORMATTING FOR STUDY SESSION PART
    let completionRateColumnNum = 10;
    let minutesColumnNum = 9;
    let cohortColumnNum = 8;
    let extraColumnNum = 11;

    let completionRateColumn = weeklyMemoSheet.getRange(queryCellRowNum, completionRateColumnNum, num_Freshmen + num_Sophomores);
    let minutesColumn = weeklyMemoSheet.getRange(queryCellRowNum, minutesColumnNum, num_Freshmen + num_Sophomores);
    let cohortColumn = weeklyMemoSheet.getRange(queryCellRowNum, cohortColumnNum, num_Freshmen + num_Sophomores);
    let extraColumn = weeklyMemoSheet.getRange(queryCellRowNum - 1, extraColumnNum, num_Freshmen + num_Sophomores);

    let defaultRange = weeklyMemoSheet.getRange("F64:K240");
    let ssRange = weeklyMemoSheet.getRange(queryCellRowNum - 1, queryCellColNum, num_Freshmen + num_Sophomores + 1, 5);

    //MANUAL FORMATTING
      extraColumn.setBackground(null).clearContent();
      ssRange.getBandings().forEach(banding => banding.remove()); // first remove any existing alternating colors in range to prevent error 
      removeRules();

      descriptionCell.setValue("• The table to the right shows the completion rate for every scholar with a study session requirement.");
      completionRateColumn.setFontWeight("bold").setHorizontalAlignment("right").setNumberFormat("0.#%");
      minutesColumn.setHorizontalAlignment("right");
      cohortColumn.setHorizontalAlignment("right").setFontWeight(null);
      weeklyMemoSheet.getRange("K64").setBorder(true, null, true, true, true, null, "white", SpreadsheetApp.BorderStyle.SOLID);
      
      applyCompletionRateRules(completionRateColumn);
      ssRange.applyRowBanding(SpreadsheetApp.BandingTheme.BROWN);           // apply alternate background colors
    
  } else if (dropDownCellTitle == "Front Desk") {                // FORMATTING FOR FRONT DESK PART

    let completionRateColumnNum = 11;
    let minutesColumnNum = 10;
    let cohortColumnNum = 9;
    let roleColumnNum = 8;

    let completionRateColumn = weeklyMemoSheet.getRange(queryCellRowNum, completionRateColumnNum, num_Freshmen + num_Sophomores + num_TLs);
    let minutesColumn = weeklyMemoSheet.getRange(queryCellRowNum, minutesColumnNum, num_Freshmen + num_Sophomores + num_TLs);
    let cohortColumn = weeklyMemoSheet.getRange(queryCellRowNum, cohortColumnNum, num_Freshmen + num_Sophomores + num_TLs);
    let roleColumn = weeklyMemoSheet.getRange(queryCellRowNum, roleColumnNum, num_Freshmen + num_Sophomores + num_TLs);

    let fdRange = weeklyMemoSheet.getRange(queryCellRowNum - 1, queryCellColNum, num_Freshmen + num_Sophomores + num_TLs + 2, 6);

    //MANUAL FORMATTING

      fdRange.getBandings().forEach(banding => banding.remove()); // first remove any existing alternating colors in range to prevent error 
      removeRules();
      
      descriptionCell.setValue("• The table to the right shows completion rate for every scholar with a front desk requirement");

      minutesColumn.setHorizontalAlignment("right").setNumberFormat("0").setFontWeight("bold");
      completionRateColumn.setFontWeight("bold").setHorizontalAlignment("right").setNumberFormat("0.#%");
      cohortColumn.setHorizontalAlignment("right").setFontWeight(null);
      roleColumn.setHorizontalAlignment("left").setFontWeight(null);

      applyCompletionRateRules(completionRateColumn);

      fdRange.applyRowBanding(SpreadsheetApp.BandingTheme.BROWN);           // apply alternate background colors

  } else if (dropDownCellTitle == "Seminar Attendance") {        // FORMATTING FOR SEMINAR ATTENDANCE PART

    let attendanceColumnNum = 8;
    let attendanceColumn = weeklyMemoSheet.getRange(queryCellRowNum, attendanceColumnNum, num_Freshmen);
    let extraRange = weeklyMemoSheet.getRange("I64:K186");
    let saRange = weeklyMemoSheet.getRange(queryCellRowNum - 1, queryCellColNum, num_Freshmen + 1, 3);

    //MANUAL FORMATTING
      saRange.getBandings().forEach(banding => banding.remove()); // first remove any existing alternating colors in range to prevent error 
      removeRules();

      descriptionCell.setValue("• The table to the right shows attendance for freshmen scholars at seminar this week.");
      attendanceColumn.setHorizontalAlignment("center").setFontWeight("bold");
      extraRange.setBackground(null).clearContent();
      weeklyMemoSheet.getRange("I64:K64").setBorder(true, null, true, true, true, null, "white", SpreadsheetApp.BorderStyle.SOLID);
      applyScholarAttendanceRules(attendanceColumn);                        
      saRange.applyRowBanding(SpreadsheetApp.BandingTheme.BROWN);           // apply alternate background colors

  } else if (dropDownCellTitle == "Team Leader Performance") {   // FORMATTING TEAM LEADER PERFORMANCE PART

    let menteeColumnNum = 8;
    let mcfColumnNum = 9;
    let wplColumnNum = 10;
    let extraColumnNum = 11;

    let menteeColumn = weeklyMemoSheet.getRange(queryCellRowNum, menteeColumnNum, num_TLs + 3);
    let wplColumn = weeklyMemoSheet.getRange(queryCellRowNum, wplColumnNum, num_TLs + 3);
    let mcfColumn = weeklyMemoSheet.getRange(queryCellRowNum, mcfColumnNum, num_TLs + 3);
    let extraColumn = weeklyMemoSheet.getRange(queryCellRowNum, extraColumnNum, num_TLs + 1);
    let tlpRange = weeklyMemoSheet.getRange(queryCellRowNum - 1, queryCellColNum, num_TLs + 5, 5);

    //MANUAL FORMATTING
      tlpRange.getBandings().forEach(banding => banding.remove()); // first remove any existing alternating colors in range to prevent error 
      removeRules();
      
      extraColumn.setBackground(null).clearContent();
      descriptionCell.setValue("• The table to the right shows Team Leaders' WPL and MCF completion for this week.");
      wplColumn.setFontWeight("bold");
      menteeColumn.setFontWeight(null).setHorizontalAlignment("right");
      weeklyMemoSheet.getRange("K64").setBorder(true, null, true, true, true, null, "white", SpreadsheetApp.BorderStyle.SOLID);

      applyWPLRules(wplColumn);                        
      tlpRange.applyRowBanding(SpreadsheetApp.BandingTheme.BROWN);           // apply alternate background colors
  }
  currentMenuItem = dropDownCellTitle; 
}

function applyCompletionRateRules(range) {
  var greaterThan100 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(90/100)                       // 90% or higher is green
    .setFontColor("#00d300")
    .setRanges([range])
    .build();

  var between50and90 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(60/100, 89/100)                            // 60% - 89% is yellow (not in bad territory but they need to pull numbers up)
    .setFontColor("#e69138")
    .setRanges([range])
    .build();

  var between0and50 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(1/100, 59/100)                             // 0% - 59% is red (pretty bad numbers)
    .setFontColor("#ff0000")
    .setRanges([range])
    .build();

  var equals0 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(0)                               // 0% is dark red (worst number ever)
    .setFontColor("#660000")
    .setRanges([range])
    .build();

  var emptyCell = SpreadsheetApp.newConditionalFormatRule()
    .whenCellEmpty()                                                // no number is black background (data not available)
    .setBackground("#fce5cd")
    .setRanges([range])
    .build();

  var rules = weeklyMemoSheet.getConditionalFormatRules();
  rules.push(greaterThan100);
  rules.push(between50and90);
  rules.push(between0and50);
  rules.push(equals0);
  rules.push(emptyCell);
  weeklyMemoSheet.setConditionalFormatRules(rules);
}

function applyScholarAttendanceRules(range) {
  var present = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Y")                                         // green if scholar is present
    .setFontColor("#00d300")
    .setRanges([range])
    .build();

  var absent = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("N")                                         // red if scholar is absent
    .setFontColor("red")
    .setRanges([range])
    .build();

  var late = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("L")                                         // yellow if scholar was late
    .setFontColor("#e69138")
    .setRanges([range])
    .build();

  var excused = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("EX")                                        // blue if scholar is excused
    .setFontColor("#4a86e8")                              
    .setRanges([range])
    .build();

  var emptyCell = SpreadsheetApp.newConditionalFormatRule()
    .whenCellEmpty()                                                // no data is black background (data not available)
    .setBackground("#fce5cd")
    .setRanges([range])
    .build();

  var rules = weeklyMemoSheet.getConditionalFormatRules();
  rules.push(present);
  rules.push(absent);
  rules.push(late);
  rules.push(excused);
  rules.push(emptyCell);
  weeklyMemoSheet.setConditionalFormatRules(rules);
}

function applyWPLRules(range) {
  var completedWPL = SpreadsheetApp.newConditionalFormatRule()
    .whenTextDoesNotContain("Not found")                                 // green if WPL is complete
    .setFontColor("#00d300")
    .setRanges([range])
    .build();  

  var notFound = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Not found")                                         // red if WPL is missing
    .setFontColor("red")
    .setRanges([range])
    .build();

  let rules = weeklyMemoSheet.getConditionalFormatRules();
  rules.push(completedWPL);
  rules.push(notFound);
  weeklyMemoSheet.setConditionalFormatRules(rules);
}

function removeRules() {
  var rules = weeklyMemoSheet.getConditionalFormatRules();

  if (currentMenuItem == "Study Sessions" || currentMenuItem == "Seminar Attendance" || currentMenuItem == "Front Desk") {
    rules.pop();
    rules.pop();
  } else {
    rules.pop();
    rules.pop();
    rules.pop();
    rules.pop();
    rules.pop();
  }
  weeklyMemoSheet.setConditionalFormatRules(rules);
}

function createSpace(){
  let recognitionBoardInfo = formulaSheet.getRange(22, 1, 79-22+1, 10).getValues();
  //recognitionHeader

  //copy to row 192

  //weeklyMemoSheet.getRange(192, 3, recognitionBoardInfo.length, recognitionBoardInfo[0].length).setValues(recognitionBoardInfo);
  //recognitionHeader.copyFormatToRange(weeklyMemoSheet, 3, 10, 192, 192+(79-22+1));

  weeklyMemoSheet.getRange(365, 3, recognitionBoardInfo.length, recognitionBoardInfo[0].length).setValues(recognitionBoardInfo);
  recognitionHeader.copyFormatToRange(weeklyMemoSheet, 3, 10, 365, 365+(79-22+1));

}

function onEdit(e) {
  if (e.range.getA1Notation() === "B62") {
    refreshButton();
  }
}

function deleteSpace(){
var rules = weeklyMemoSheet.getConditionalFormatRules();
Logger.log(rules.toString());

}
