/*WPL_WAHF_Parse Functions 8/10/22:
  Parses "Weekly Forms" spreadsheet
  Prints summary in "Database" ss, in corresponding WeekNum/WAHF/WPL Columns
*/


/* function summerize_MCF()
  Grabs certain MCF info in weekNum from "Weekly Forms", and prints to "Database" ss

*/
function summerize_WAHF_WPL() {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let weeklyFormsLog = ss.getSheetByName("Weekly Forms"); 
  let database = ss.getSheetByName("Database");
  // testing - let print = ss.getSheetByName("MCF Print");

  let weeklyFormsLogRow = weeklyFormsLog.getLastRow();
  
  let weekNum = 1;

  //grabs Column A, from "Weekly Forms" ss
  let uidList = weeklyFormsLog.getRange(8, 1, weeklyFormsLogRow-7, 1).getValues();
  let uidResults = newSizeArray(uidList.length);

  // testing - print.getRange(5,4, uidList.length, 1).setValues(uidList);

  //grabs 1st / 2nd column in certain week, # of submissions
  let column = 2 + ((weekNum-1)*4);

  let wahfWeekRes = weeklyFormsLog.getRange(8, column, weeklyFormsLogRow-7, 1).getValues();

  let wplWeekRes =  weeklyFormsLog.getRange(8, column+1, weeklyFormsLogRow-7, 1).getValues();

  //cleans up error codes
  let wahfWeekRes1D = transform2D(wahfWeekRes);
  let wplWeekRes1D = transform2D(wplWeekRes);

  //if Integer is s < 0 (error code), change to 0
  let holder1 = wahfWeekRes1D.map(function(currVal){
    if(currVal <= 0){
      return 0;
    }
    return currVal;
  })

   //if Integer is s < 0 (error code), change to 0
  let holder2 = wplWeekRes1D.map(function(currVal){
    if(currVal <= 0){
      return 0;
    }
    return currVal;
  })

  let wahfWeekRes2D = transform1D(holder1);
  let wplWeekRes2D = transform1D(holder2);

  // testintg - print.getRange(3, 7, mcfWeekRes.length, 1).setValues(mcfWeekRes);
  // testing - print.getRange(2,2).setValue(mcfWeekRes2D.length)
  
  //pass results to copy to corresponding week
  copyToDatabase(wahfWeekRes2D, weekNum, database, 1);
  copyToDatabase(wplWeekRes2D, weekNum, database, 2);
}

/* function copyMCFToDatabase()
  Grabs MCF result for certain week, copies to "Database" ss
  mcfWeekRes - 2D : # of submissions 
  database - SpreadSheet reference
  weekNum - Integer
  formType - Integer
*/
function copy_WAHF_WPL_ToDatabase(mcfWeekRes, database, weekNum, formType){

  //calculates MCF Column for corresponding Week
  let leftShift = 13;
  let column;

  if(formType == 1){
    column = leftShift + ((weekNum-1)*10) + 0;

  }else if(formType == 2){
    column = leftShift + ((weekNum-1)*10) + 2;

  }else{
    return;
  }
  
  //copy paste :)
  database.getRange(4, column, mcfWeekRes.length, 1).setValues(mcfWeekRes);
}
