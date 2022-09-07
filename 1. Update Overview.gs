function runUpdateOverview() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let database = ss.getSheetByName("Database");
  let weeklyMemo = ss.getSheetByName("Weekly Memo Sandbox");
  let generalInfo = ss.getSheetByName("General Info");

  let weekNum = weeklyMemo.getRange("K5").getValue();

  updateOverview(database, weeklyMemo, generalInfo, weekNum);
}

function updateOverview(database, weeklyMemo, generalInfo, weekNum){
  let shiftRight = 14;
  let weekColumn = shiftRight + ((weekNum-1)* 9);
  let dbLastRow = database.getLastRow();

  let yearList = database.getRange(4, 12, dbLastRow-3, 1).getValues();
  let rankList = database.getRange(4, 7, dbLastRow-3, 1).getValues();

  let yearList1D = transform2D(yearList);
  let rankList1D = transform2D(rankList);

  let freshScholarCount = generalInfo.getRange("B21").getValue();
  let sophScholarCount = generalInfo.getRange("B22").getValue();
  let leadershipCount = generalInfo.getRange("C24").getValue();

  updateFrontDesk(weeklyMemo, database, dbLastRow, weekColumn, 
    freshScholarCount, sophScholarCount, leadershipCount, yearList1D, rankList1D);

  //updateStudySession(weeklyMemo, database, dbLastRow, weekColumn, 
  //  freshScholarCount, sophScholarCount, yearList1D, rankList1D);

  updateSubmissionCount(weeklyMemo, generalInfo)
  
}

function updateSubmissionCount(weeklyMemo, generalInfo){

  let onTimeWahf = generalInfo.getRange("C11").getValue() - generalInfo.getRange("B11").getValue() + 1;
  let lateWahf = generalInfo.getRange("E11").getValue() - generalInfo.getRange("D11").getValue() + 1;
  let totalScholar = generalInfo.getRange("D24").getValue();
  
  let missingWahf = totalScholar - (onTimeWahf + lateWahf)

  weeklyMemo.getRange("G14").setValue(onTimeWahf)
  weeklyMemo.getRange("H14").setValue(lateWahf)
  weeklyMemo.getRange("I14").setValue(missingWahf)
}

function updateStudySession(weeklyMemo, database, dbLastRow, weekColumn, freshScholarCount, sophScholarCount, yearList1D, rankList1D){

  let ssColumn = weekColumn + 6;
  let requiredStudySessionTimes = database.getRange(4, 10, dbLastRow-3, 1).getValues();
  let studySessionTimes = database.getRange(4, ssColumn, dbLastRow-3, 1).getValues();

  let requiredStudySessionTimes1D = transform2D(requiredStudySessionTimes);
  let studySessionTimes1D = transform2D(studySessionTimes);

  let freshmenComplete = 0;
  let sophComplete = 0;

  studySessionTimes1D.map(function(currTime, index){

    if(rankList1D[index] == "Scholar"){

      if(requiredStudySessionTimes1D[index] <= currTime){

        if(yearList1D[index] == "2022"){
          freshmenComplete += 1;
        }else if(yearList1D[index] == "2021"){
          sophComplete += 1;
        }

      }
    }

  })

  printStudySession(weeklyMemo,freshmenComplete, sophComplete, freshScholarCount, sophScholarCount);


}

function printStudySession(weeklyMemo,freshmenComplete, sophComplete, freshScholarCount, sophScholarCount){
  weeklyMemo.getRange("C21").setValue(freshmenComplete + " out of " + freshScholarCount + " Freshman Scholars completed their front desk hours");
  weeklyMemo.getRange("C22").setValue(sophComplete + " out of " + sophScholarCount + " Sophmore Scholars completed their front desk hours");

}

function updateFrontDesk(weeklyMemo, database, dbLastRow, weekColumn, freshScholarCount, sophScholarCount, leadershipCount, yearList1D, rankList1D){

  
  let fdColumn = weekColumn + 5;
  let requiredFrontDeskTimes = database.getRange(4, 9, dbLastRow-3, 1).getValues();
  let frontDeskTimes = database.getRange(4, fdColumn, dbLastRow-3, 1).getValues();

  let requiredFrontDeskTimes1D = transform2D(requiredFrontDeskTimes);
  let frontDeskTimes1D = transform2D(frontDeskTimes);

  let freshmenComplete = 0;
  let sophComplete = 0;
  let leadershipComplete = 0;

  frontDeskTimes1D.map(function(currTime, index){

    //did enough
    if(requiredFrontDeskTimes1D[index] <= currTime){

      if(rankList1D[index] != "Scholar"){
        leadershipComplete += 1;
      
      }else{

        if(yearList1D[index] == "2022"){
          freshmenComplete += 1;
        }else if(yearList1D[index] == "2021"){
          sophComplete += 1;
        }
      }
    }
  });

  printFrontDesk(weeklyMemo,freshmenComplete, sophComplete, leadershipComplete, freshScholarCount, sophScholarCount, leadershipCount);
}

function printFrontDesk(weeklyMemo, freshmenComplete, sophComplete, leadershipComplete, freshScholarCount, sophScholarCount, leadershipCount){
  
  weeklyMemo.getRange("C17").setValue(leadershipComplete + " out of " + leadershipCount + " TLs completed their front desk hours");
  weeklyMemo.getRange("C18").setValue(freshmenComplete + " out of " + freshScholarCount + " Freshman Scholars completed their front desk hours");
  weeklyMemo.getRange("C19").setValue(sophComplete + " out of " + sophScholarCount + " Sophmore Scholars completed their front desk hours");


}
