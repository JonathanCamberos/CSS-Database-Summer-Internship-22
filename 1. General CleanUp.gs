/*General CleanUp Functions 8/10/22:
  Miscellaneous to update/clean up general "Database" spreadsheet
  on daily basis
*/


/* function calcFD_SS_Time_Role()
  Grabs uid list from "Database" ss
  Creates a required Front Desk / Study Session,
  times based on "role" of scholar (Scholar, Team Leader, E-Board) etc
  
 */
function calcFD_SS_Time_Role() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let database = ss.getSheetByName("Database");
  //* for testing - let print = ss.getSheetByName("Print");
  let databaseRows = database.getLastRow();

  //grabbing column F, "Database" ss 
  let rolesList = database.getRange(4, 6, databaseRows-3, 1).getValues();
  let rolesList1D = transform2D(rolesList);

  //grabbing column K, "Database" ss
  let cohortList = database.getRange(4, 11, databaseRows-3, 1).getValues();
  let cohortList1D = transform2D(cohortList);

  //creates fd time [], based on both the "roles" and "cohort" arr
  let frontDeskTimes = rolesList1D.map(function(currRole, index){
    
    //freshmen require 180, sophmore req 90
    if(currRole == "Scholar"){
      
      if(cohortList1D[index] == "2026"){
        return 1;
      }else{
        return 2;
      }

    //leadership does certain time
    }else if(currRole == "Team Leader" || currRole == "E-Board Chair" 
      || currRole == "Vice President" || currRole == "President"){
      return 3;

    //else role N/A, results in error
    }else{
      return 4;
    }
  });

  //creates ss time [], based on both the "roles" and "cohort" arr
  let studySessionTimes = rolesList1D.map(function(currRole, index){

    //freshmen require 180, sophmore req 90
    if(currRole == "Scholar"){
      //freshmen non tl's do 180, soph+ do 90
      if(cohortList1D[index] == "2026"){
        return 5;
      }else{
        return 6;
      }

    //leadership does certain time
    }else if(currRole == "Team Leader" || currRole == "E-Board Chair" 
      || currRole == "Vice President" || currRole == "President"){
      return 7;

    //else role N/A, results in error
    }else{
      return 8;
    }
  });
  
  //transforms to 2D array for copy/pasting
  let frontDeskTimes2D = transform1D(frontDeskTimes);
  let studySessionTimes2D = transform1D(studySessionTimes);

  //pass to print into
  enterIntoDatabase(database, frontDeskTimes2D, studySessionTimes2D);
}

/* function enterIntoDatabase()
   takes Front Desk / Study Session require times,
   Prints it into correct columns
 */
function enterIntoDatabase(database, frontDeskTimes2D, studySessionTimes2D){

  //FD into column H, SS into column I
  database.getRange(4, 8, frontDeskTimes2D.length, 1).setValues(frontDeskTimes2D);
  database.getRange(4, 9, studySessionTimes2D.length, 1).setValues(studySessionTimes2D);
}
