function run_Summerize_FD_SS_Times(){
  
  let weekNum = 1;
  summerizeFrontDesk(weekNum)
}

function summerizeFrontDesk(weekNum) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let timeSheet = ss.getSheetByName("Front Desk Time Log"); 
  let database = ss.getSheetByName("Database");
  //let print = ss.getSheetByName("Ready Print");

  let timeRow = timeSheet.getLastRow();

  let uidList = timeSheet.getRange(8, 1, timeRow-7, 1).getValues();
  
  let uidTimeResults = newSizeArray(uidList.length);

  //let currUidWeekTimes = timeSheet.getRange(8+0, (weekNum*5)-3, 1, 5).getValues();
  //print.getRange(1, 2, currUidWeekTimes.length, currUidWeekTimes[0].length).setValues(currUidWeekTimes);
  //print1D(currUidWeekTimes, 1, 2, print)

  let shiftRight = 2;
  let weekColumn = shiftRight + ((weekNum-1)*5) + 0;
  uidList.map(function(currUid, currIndex){

    let currUidWeekTimes = timeSheet.getRange(8+currIndex, weekColumn, 1, 5).getValues();
    
    let currWeekSum = sumUpWeek(currUidWeekTimes)


    uidTimeResults[currIndex] = currWeekSum;

  });
  
  let uidTimeResults2D = transform1D(uidTimeResults);

  Logger.log(uidTimeResults2D)

  //print.getRange(6, 10, uidTimeResults2D.length, 1).setValues(uidTimeResults2D);

  copyToDatabase(uidTimeResults2D, weekNum, database);
}

function copyToDatabase(uidTimeResults2D, weekNum, database){

  let shiftRight = 14;

  Logger.log(uidTimeResults2D)

  let frontDeskColumn = shiftRight + ((weekNum-1)*9) + 5;

  database.getRange(4, frontDeskColumn, uidTimeResults2D.length, 1).setValues(uidTimeResults2D);

}

function sumUpWeek(uidWeekTimes){

  let sum = 0;

  uidWeekTimes.map(function(currRowBug){

    currRowBug.map(function(currDayTimeCount){
      if(0 < currDayTimeCount){
        sum += currDayTimeCount;
      }
    })
  })

  return sum;

}
