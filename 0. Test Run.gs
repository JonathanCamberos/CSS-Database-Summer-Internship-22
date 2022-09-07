function generateEntry_Exits(){

  let dayNum = 10;
  updateColumn(dayNum);
}

function updateColumn(dayNum){
  let ss = SpreadsheetApp.getActiveSpreadsheet()
  let frontDeskKeysSheet = ss.getSheetByName("Front Desk Keys");
  let studySessionKeysSheet = ss.getSheetByName("Study Session Keys");

  let frontLastRow = frontDeskKeysSheet.getLastRow();
  let studyLastRow = studySessionKeysSheet.getLastRow();

  let shiftRight = 1;

  let uidList = frontDeskKeysSheet.getRange(8, 1, frontLastRow-7, 1).getValues();
  let uidList1D = transform2D(uidList);

  //Logger.log(uidList1D)
  

  let fdEntrySecret = frontDeskKeysSheet.getRange(7, shiftRight+dayNum-1).getValue();
  let fdEntryKeyRes = uidList1D.map(function(currUid){
    return generateHash(currUid+fdEntrySecret);
  });

  let fdExitSecret = frontDeskKeysSheet.getRange(7, shiftRight+dayNum).getValue();
  let fdExitKeyRes = uidList1D.map(function(currUid){
    return generateHash(currUid+fdExitSecret);
  })

  let ssEntrySecret = studySessionKeysSheet.getRange(7, shiftRight+dayNum-1).getValue();
  let ssEntryKeyRes = uidList1D.map(function(currUid){
    return generateHash(currUid+ssEntrySecret);
  });

  let ssExitSecret = studySessionKeysSheet.getRange(7, shiftRight+dayNum-1).getValue();
  let ssExitKeyRes = uidList1D.map(function(currUid){
    return generateHash(currUid+ssExitSecret);
  });

  let fdEntryKeyRes2D = transform1D(fdEntryKeyRes);
  let fdExitKeyRes2D = transform1D(fdExitKeyRes);
  let ssEntryKeyRes2D = transform1D(ssEntryKeyRes);
  let ssExitKeyRes2D = transform1D(ssExitKeyRes);
 
  
  printToFrontDesk(frontDeskKeysSheet, fdEntryKeyRes2D, fdExitKeyRes2D, dayNum);
  printStudySession(studySessionKeysSheet, ssEntryKeyRes2D, ssExitKeyRes2D, dayNum);

  
}

function printToFrontDesk(frontDeskKeysSheet, fdEntryKeyRes, fdExitKeyRes, dayNum){
  let shiftRight = 1;
  let column = (dayNum-1)*2;
  frontDeskKeysSheet.getRange(8, shiftRight+column+1, fdEntryKeyRes.length, fdEntryKeyRes[0].length).setValues(fdEntryKeyRes);
  frontDeskKeysSheet.getRange(8, shiftRight+column+2, fdExitKeyRes.length, fdExitKeyRes[0].length).setValues(fdExitKeyRes);

}

function printStudySession(studySessionKeysSheet, ssEntryKeyRes2D, ssExitKeyRes2D, dayNum){
  let shiftRight = 1;
  let column = (dayNum-1)*2;
  studySessionKeysSheet.getRange(8, shiftRight+column+1, ssEntryKeyRes2D.length, ssEntryKeyRes2D[0].length).setValues(ssEntryKeyRes2D);
  studySessionKeysSheet.getRange(8, shiftRight+column+2, ssExitKeyRes2D.length, ssExitKeyRes2D[0].length).setValues(ssExitKeyRes2D);

}
