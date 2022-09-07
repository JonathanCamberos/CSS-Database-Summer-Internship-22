/*MCF_Summary Functions 8/10/22:
  Parses "Weekly Forms" spreadsheet
  Prints summary in "Database" ss, in corresponding WeekNum/MCF Columns
*/


function run_Summerize_MCF(){

  let weekNum = 1;
  summerize_MCF(weekNum);
}

/* function summerize_MCF()
  Grabs certain MCF info in weekNum from "Weekly Forms", and prints to "Database" ss

*/
//next change colors based on valid time or no, for tommorow  ******************************!!!
function summerize_MCF(weekNum){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let weeklyFormsLog = ss.getSheetByName("Weekly Forms"); 
  let database = ss.getSheetByName("Database");
  // testing - let print = ss.getSheetByName("MCF Print");

  let weeklyFormsLogRow = weeklyFormsLog.getLastRow();
    

  //grabs Column A, from "Weekly Forms" ss
  let uidList = weeklyFormsLog.getRange(8, 1, weeklyFormsLogRow-7, 1).getValues();
  let uidResults = newSizeArray(uidList.length);

  // testing - print.getRange(5,4, uidList.length, 1).setValues(uidList);
  
  //grabs 4th column in certain week, "integer" # of submissions
  let shiftRight = 2;
  let column = shiftRight + ((weekNum-1)*4) + 3;
  let mcfWeekRes =  weeklyFormsLog.getRange(8, column, weeklyFormsLogRow-7, 1).getValues();

  //cleans up error codes
  let mcfWeekRes1D = transform2D(mcfWeekRes);

  //if Integer is s < 0 (error code), change to 0
  let holder = mcfWeekRes1D.map(function(currVal){
    if(currVal == -3){
      return 0;
    }
    return currVal;
  })

  let mcfWeekRes2D = transform1D(holder);

  // testintg - print.getRange(3, 7, mcfWeekRes.length, 1).setValues(mcfWeekRes);
  // testing - print.getRange(2,2).setValue(mcfWeekRes2D.length)
  
  //pass results to copy to corresponding week
  copyMCFToDatabase(mcfWeekRes2D, weekNum, database);
  
}

/* function copyMCFToDatabase()
  Grabs MCF result for certain week, copies to "Database" ss
  mcfWeekRes - 2D : # of submissions 
  database - SpreadSheet reference
  weekNum - Integer
*/
function copyMCFToDatabase(mcfWeekRes, weekNum, database){

  //calculates MCF Column for corresponding Week
  let shiftRight = 14;
  let column = shiftRight + ((weekNum-1)*9) + 2;

  //copy paste :)
  database.getRange(4, column, mcfWeekRes.length, 1).setValues(mcfWeekRes);
}

