function runParseSheets(){
  let dayCount = 5;
  let formNumber = 1;

  let firstOnTimeRow = 127; 
  let lastOnTimeRow = 150;

  parse_FrontDesk_StudySession(formNumber, dayCount, firstOnTimeRow, lastOnTimeRow);
}

//parses Front Desk Submissions sheet
function parse_FrontDesk_StudySession(formNumber, dayCount, firstOnTimeRow, lastOnTimeRow) {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let form;
  let print = ss.getSheetByName("front/crypto Print");
  let keySheet;
  let timeSheet;

  if(formNumber == 1){
    form = ss.getSheetByName("Front Desk Form");
    timeSheet = ss.getSheetByName("Front Desk Time Log");
    keySheet = ss.getSheetByName("Front Desk Keys");
  
  }else if(formNumber == 2){
    form = ss.getSheetByName("Study Session Form");
    timeSheet = ss.getSheetByName("Study Session Time Log");
    keySheet = ss.getSheetByName("Study Session Keys");
  }else{
    return;
  }

  //Change based on how many number of submissions per day!!***********************************
  
  let formColumns = 4; 
   

  let keySheetRows = keySheet.getLastRow()

  //grabbing submissions (timeStamp, uid, "Entry"/"Exit")
  // s[0] = timeStamp, s[1] = uid, s[2] = "Entry"/"Exit", s[3] = keyAttempt
  let submissions = form.getRange(firstOnTimeRow, 1, lastOnTimeRow-firstOnTimeRow+1, formColumns).getValues();
  Logger.log(submissions)

  //gets uid list
  let uidList = keySheet.getRange(8, 1, keySheetRows-7, 1).getValues();
  let uidListOneD = transform2D(uidList);

  let validDayEntryKeys = keySheet.getRange(8, dayCount*2, keySheetRows-7, 1).getValues();
  let validDayExitKeys = keySheet.getRange(8, (dayCount*2)+1, keySheetRows-7, 1).getValues();
  
  let validDayEntryKey1D = transform2D(validDayEntryKeys);
  let validDayExitKey1D = transform2D(validDayExitKeys)

  //Break up submissions into two separate - 2D arrays, one for all "Entrys", one for all "Exits"
  let entrySubmissions = submissionTypesSplit(submissions, "Entry");
  let exitSubmissions = submissionTypesSplit(submissions, "Exit");
  
  //let fakeUidList = [117232363, 1234];
  let uidTimeResults = newSizeArray(uidListOneD.length);
  
  //for each uid, (eventually, each scholar that is required to do Front_Desk)
  //filter "Entry" and "Exit" array by uid
  //take the first valid by key "Entry" and "Exit" submission
  //if scholar is missing either, they will get and error code (-1/-2/-3, etc) (can be manually fixed later)
  uidListOneD.map(function(currUid, currIndex){

    //filter all "Entry"/"Exit" (entrySubmissions) to match current UID
    let uidEntrySubmissions = entrySubmissions.filter(function(currSubmissionRow){
      if(currSubmissionRow[1] == currUid){
        return true;
      }
    });
    let uidExitSubmissions = exitSubmissions.filter(function(currSubmissionRow){
      if(currSubmissionRow[1] == currUid){
        return true;
      }
    });

    //if scholar has no submissions for either, they get error code (can be fixed later)
    if(uidEntrySubmissions.length == 0){
       uidTimeResults[currIndex] = -2;

    } else if(uidExitSubmissions.length == 0){
      uidTimeResults[currIndex] = -3;

    }else{

      let finalTime = calcTime(uidEntrySubmissions[0][0], uidExitSubmissions[0][0], print);   //bug where first Exit COULD before first Entry 
      uidTimeResults[currIndex] = finalTime;

      //scholar has at least 1 submission for both "Entry" and "Exit"
      /*
      //gets first valid entry and exit (**** WILL CHECK CRYPTOGRAPHIC KEY ***************) WHY DOES THIS NOT USE THE DAY????????? ##########
      let firstValidEntry = validEntry_Exit(uidEntrySubmissions, validDayEntryKey1D[currIndex]);
      let firstValidExit = validEntry_Exit(uidExitSubmissions, validDayExitKey1D[currIndex]);



      //if none are valid (key is wrong)
      if(firstValidEntry == null){

        uidTimeResults[currIndex] = -4;
      }else if (firstValidExit == null){

        uidTimeResults[currIndex] = -5;
      }else{

        //Valid entry and exit for curr uid
        //calculate final times
        let finalTime = calcTime(firstValidEntry[0], firstValidExit[0], print);   //bug where first Exit COULD before first Entry 

        //setting finalTime to correct index    
        uidTimeResults[currIndex] = finalTime;
      }
      */


    }
  });
  
  //record on time sheet
  recordTimes(uidTimeResults, timeSheet, dayCount);
}

//since uidTimeResults is in same order as UID list, simply copy and paste in correct day
function recordTimes(uidTimeResults, timeSheet, frontDayCount){
  
  let dayColumn = 1+frontDayCount;
  let timeResults2D = transform1D(uidTimeResults);

  timeSheet.getRange(8, dayColumn, timeResults2D.length, timeResults2D[0].length).setValues(timeResults2D);
  
}

//calculating time (exit-entry)
function calcTime(entryDateTime, exitDateTime, print){
  let res;

  if(entryDateTime < exitDateTime){
    res = exitDateTime.getTime() - entryDateTime.getTime();
    res = Math.ceil(res/60000);  //calculating miliseconds -> minutes, ceiling just to be nice :)
  }else{
    //error, entry is after exit
    res = -6;
  }
 
  return res;
}

//(uidEntrySubmissions, currIndex, "Entry");
//for 2D array of submissions for uid N, finds the first valid key submission and returns
function validEntry_Exit(entryExitSubmissionsArr, correctKey){
  let res = null;
  let i = 0;

  //while there are still submissions and while none of them have given the correct key
  while(i < entryExitSubmissionsArr.length && !(entryExitSubmissionsArr[i][3] == correctKey)){
    i++;
  }
  
  //if exited while loop before running out of submissions -> found correct key submission
  if(i != entryExitSubmissionsArr.length){
    res = entryExitSubmissionsArr[i];
  }
 
  return res;
}
 
//Returns all "Entry" or "Exit" submissions based on "type"
function submissionTypesSplit(submissions, type){
  let res = submissions.filter(function(currSubmissionRow){
    if(currSubmissionRow[2] == type){
      return true; 
    }
  });
  return res;
}
