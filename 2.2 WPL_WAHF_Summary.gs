/*WPL_WAHF_Parse Functions 8/10/22:
  Parses "Weekly Forms" spreadsheet
  Prints summary in "Database" ss, in corresponding WeekNum/WAHF/WPL Columns
*/

function run_Summerize_WAHF_WPL(){
  //WAHF 1
  //WPL 2
  let weekNum = 1;
  let formNumber = 1;
  summerize_WAHF_WPL(weekNum, formNumber);

}

/* function summerize_MCF()
  Grabs certain MCF info in weekNum from "Weekly Forms", and prints to "Database" ss

*/
function summerize_WAHF_WPL(weekNum, formNumber) {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let weeklyFormsLog = ss.getSheetByName("Weekly Forms"); 
  let database = ss.getSheetByName("Database");
  // testing - let print = ss.getSheetByName("MCF Print");

  let weeklyFormsLogRow = weeklyFormsLog.getLastRow();
  

  //grabs Column A, from "Weekly Forms" ss
  let uidList = weeklyFormsLog.getRange(8, 1, weeklyFormsLogRow-7, 1).getValues();
  let uidResults = newSizeArray(uidList.length);

  // testing - print.getRange(5,4, uidList.length, 1).setValues(uidList);

  //grabs 1st / 2nd column in certain week, # of submissions
  let column;
  let currWeekResponses;

  if(formNumber == 1){
    //WAHF
    let shiftRight = 2;
    column = shiftRight + ((weekNum-1)*4)+0;
    currWeekResponses = weeklyFormsLog.getRange(8, column, weeklyFormsLogRow-7, 1).getValues();

  }else if (formNumber == 2){
    //WPL
    let shiftRight = 2;
    column = shiftRight + ((weekNum-1)*4)+1;
    currWeekResponses =  weeklyFormsLog.getRange(8, column, weeklyFormsLogRow-7, 1).getValues();

  }else{
    return;
  }
 

  //cleans up error codes
  let currWeekResponses1D = transform2D(currWeekResponses);
 
  //if Integer is s < 0 (error code), change to 0
  let holder = currWeekResponses1D.map(function(currVal){
    Logger.log(currVal)
    if(currVal == -2){
      return 0;
    }
    return 1;
  })

  let currWeekResponses2D = transform1D(holder);

  // testintg - print.getRange(3, 7, mcfWeekRes.length, 1).setValues(mcfWeekRes);
  // testing - print.getRange(2,2).setValue(mcfWeekRes2D.length)
  

  //pass results to copy to corresponding week
  //copyToDatabase(wplWeekRes2D, weekNum, database, 2);
  copy_WAHF_WPL_ToDatabase(currWeekResponses2D, weekNum, database, formNumber);
}

/* function copyMCFToDatabase()
  Grabs MCF result for certain week, copies to "Database" ss
  mcfWeekRes - 2D : # of submissions 
  database - SpreadSheet reference
  weekNum - Integer
  formType - Integer
*/
function copy_WAHF_WPL_ToDatabase(currWeekResponses, weekNum, database, formType){

  //calculates MCF Column for corresponding Week
  let rightShift = 14;
  let column;

  if(formType == 1){
    column = rightShift + ((weekNum-1)*9) + 0;

  }else if(formType == 2){
    column = rightShift + ((weekNum-1)*9) + 1;

  }else{
    return;
  }
  
  //copy paste :)
  database.getRange(4, column, currWeekResponses.length, currWeekResponses[0].length).setValues(currWeekResponses);
}

