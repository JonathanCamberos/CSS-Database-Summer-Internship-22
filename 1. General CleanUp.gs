/*General CleanUp Functions 8/10/22:
  Miscellaneous to update/clean up general "Database" spreadsheet
  on daily basis
*/

function updateWeeklySeminar(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let database = ss.getSheetByName("Database");
  let seminarSheet = ss.getSheetByName("Freshmen Seminar");

  
}

function run_UpdateMCF_WPL_WeeklyFormat(){
  let weekNum = 1;
  updateMCF_WPL_WeeklyFormat(weekNum);
}

function updateMCF_WPL_WeeklyFormat(weekNum){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let database = ss.getSheetByName("Database");

  let dbLastRow = database.getLastRow();

  let rolesList = database.getRange(4, 7, dbLastRow-3, 1).getValues();
  let rolesList1D = transform2D(rolesList);

  let weekColm = 14 + ((weekNum-1) *9);
  let wplColm = weekColm+1;
  let mcfColm = weekColm+2;

  let wplData = database.getRange(4, wplColm, dbLastRow-3, 1).getValues();
  let wplData1D = transform2D(wplData);

  let mcfData = database.getRange(4, mcfColm, dbLastRow-3, 1).getValues();
  let mcfData1D = transform2D(mcfData);

  let newWplData = rolesList1D.map(function(currRole, index){
    if(currRole == "Scholar"){
      return "N/A";
    }else{
      return wplData1D[index];
    }
  })

  let newMcfData = rolesList1D.map(function(currRole, index){
    if(currRole == "Scholar"){
      return "N/A";
    }else{
      return mcfData1D[index];
    }
  })

  let newWplData2D = transform1D(newWplData);
  let newMcfData2D = transform1D(newMcfData);

  database.getRange(4, wplColm, dbLastRow-3, 1).setValues(newWplData2D);
  database.getRange(4, mcfColm, dbLastRow-3, 1).setValues(newMcfData2D)

}


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

  //grabbing column G, "Database" ss 
  let rolesList = database.getRange(4, 7, databaseRows-3, 1).getValues();
  let rolesList1D = transform2D(rolesList);

  //grabbing column K, "Database" ss
  let cohortList = database.getRange(4, 11, databaseRows-3, 1).getValues();
  let cohortList1D = transform2D(cohortList);

  //creates fd time [], based on both the "roles" and "cohort" arr
  let frontDeskTimes = rolesList1D.map(function(currRole, index){
    
    //freshmen require 180, sophmore req 90
    if(currRole == "Scholar"){
      
      if(cohortList1D[index] == "2026"){
        return 180;
      }else{
        return 120;
      }

    //leadership does certain time
    }else if(currRole == "Team Leader" || currRole == "E-Board Chair" 
      || currRole == "Vice President" || currRole == "President"){
      return 60;

    //else role N/A, results in error
    }else{
      return -1;
    }
  });

  //creates ss time [], based on both the "roles" and "cohort" arr
  let studySessionTimes = rolesList1D.map(function(currRole, index){

    //freshmen require 180, sophmore req 90
    if(currRole == "Scholar"){
      //freshmen non tl's do 180, soph+ do 90
      if(cohortList1D[index] == "2026"){
        return 300;
      }else if(cohortList1D[index] == "2025"){
        return 180;
      }else{
        return 0;
      }

    //leadership does certain time
    }else if(currRole == "Team Leader" || currRole == "E-Board Chair" 
      || currRole == "Vice President" || currRole == "President" || currRole == "Program Coordinator"){
      return 0;

    //else role N/A, results in error
    }else{
      return -1;
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
database.getRange(4, 9, frontDeskTimes2D.length, frontDeskTimes2D[0].length).setValues(frontDeskTimes2D);
  database.getRange(4, 10, studySessionTimes2D.length, studySessionTimes2D[0].length).setValues(studySessionTimes2D);
}



/* Cohort/FreshmenSophmoreJuniSeni Count

*/
function updateCohortCount(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let database = ss.getSheetByName("Database");
  let generalInfo = ss.getSheetByName("General Info");

  let dbLastRow = database.getLastRow();

  let yearList = database.getRange(4, 12, dbLastRow-3, 1).getValues();

  let rankList = database.getRange(4, 7, dbLastRow-3, 1).getValues();

  let countScholar2021 = 0;
  let countScholar2022 = 0;
  let countScholarUpper = 0;

  let countLeadership2021 = 0;
  let countLeadershipUpper = 0;

  let yearList1D = transform2D(yearList);
  let rankList1D = transform2D(rankList);

  yearList1D.map(function(currYear, index){
    
    if(currYear == "2022"){
      countScholar2022 += 1;

    }else if(currYear == "2021"){

      if(rankList1D[index] != "Scholar"){
        countLeadership2021 += 1;
      }else{
        countScholar2021 += 1;
      }

    }else{

      if(rankList1D[index] != "Scholar"){
        countLeadershipUpper += 1;
      }else{
        countScholarUpper += 1;
      }

    }


  })

  let scholarsTotal = countScholar2022 + countScholar2021 + countScholarUpper;
  let leadershipTotal = countLeadership2021 + countLeadershipUpper;
  let total = scholarsTotal + leadershipTotal;

  generalInfo.getRange("B21").setValue(countScholar2022);
  generalInfo.getRange("B22").setValue(countScholar2021);
  generalInfo.getRange("B23").setValue(countScholarUpper);

  generalInfo.getRange("C22").setValue(countLeadership2021);
  generalInfo.getRange("C23").setValue(countLeadershipUpper);
  
  generalInfo.getRange("B24").setValue(scholarsTotal);
  generalInfo.getRange("C24").setValue(leadershipTotal);

  generalInfo.getRange("D24").setValue(total);
}

