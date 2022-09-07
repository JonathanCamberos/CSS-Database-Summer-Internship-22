/*WPL_WAHF_Parse Functions 8/10/22:
  Parses "WPL Form" or "WAHF Form" spreadsheet
  Prints summary in "Database" ss, in corresponding WeekNum/MCF Columns
*/

function runParse_WPL_WAHF_Sheets(){
  //Wahf: 1
  //Wpl: 2
  let formNumber = 2;
  let weekNum = 1;

  //Change based on how many number of submissions per week!!***********************************
  let firstOnTimeRow = 38; 
  let lastOnTimeRow = 66; 
  let firstLateRow = 72;
  let lastLateRow = 85;

  parse_WPL_WAHF(formNumber, weekNum, firstOnTimeRow, lastOnTimeRow, firstLateRow, lastLateRow);
}

/*function parse_WPL_WAHF()
  Grabs "WPL Form" or "WAHF Form" ss
  Specifically by sections determined by 
  firstOnTimeRow, lastOnTimeRow, firstLateRow, lastLateRow

  This will determine what week we are currently in (changed manually)
  onTime is (Monday 00:00:00 - Friday 23:59:59)
  late is (Saturday 00:00:00 - Sunday 23:59:59)

  For each scholar parse will generate the number of 
  the current type of form submitted, to check if scholar
  submitted current form
  Results printed in "Weekly Forms" ss
*/
//parses WAHF, WPL, MCF  Submissions sheet
function parse_WPL_WAHF(formNumber, weekNum, firstOnTimeRow, lastOnTimeRow, firstLateRow, lastLateRow) {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let form;
  // testing - let print = ss.getSheetByName("WPL Print");
  let hashSheet = ss.getSheetByName("Hash Sheet");
  let weeklyFormsLog = ss.getSheetByName("Weekly Forms");
  
  
  if(formNumber == 1){
    form = ss.getSheetByName("WAHF Form");
     
  }else if(formNumber == 2){
    form = ss.getSheetByName("WPL Form");
    
  }else{
    return;
  }

  let formColumns = 3; 
  
  let hashSheetRows = hashSheet.getLastRow()


  //grabbing submissions (timeStamp, uid, "Entry"/"Exit")
  // s[0] = timeStamp, s[1] = uid, s[2] = passwordAttempt
  let onTimeSubmissions = form.getRange(firstOnTimeRow, 1, lastOnTimeRow-firstOnTimeRow+1, formColumns).getValues();
  let lateSubmissions = form.getRange(firstOnTimeRow, 1, lastOnTimeRow-firstOnTimeRow+1, formColumns).getValues();

  Logger.log(onTimeSubmissions)

  //grabs column A, from "Database" ss, gets uid list
  let uidList = hashSheet.getRange(8, 1, hashSheetRows-7, 1).getValues();
  let uidListOneD = transform2D(uidList);

  //grabs column A, from "Hash Sheet" ss, gets correct hashes (not passwords)
  let expectedHashList = hashSheet.getRange(8, 2, hashSheetRows-7, 1).getValues();
  let expectedHashList1D = transform2D(expectedHashList);

  //creates empty [] of length # of uids
  let uidFormResults = newSizeArray(uidListOneD.length);
  

  //for each uid, find whether theres was a valid submission for the current form
  uidListOneD.map(function(currUid, currIndex){

    //filter to match current UID
    let uidCurrFormSubmissions = onTimeSubmissions.filter(function(currSubmissionRow){
      if(currSubmissionRow[1] == currUid){
        return true;
      }
    });

    
    //if scholar has no submissions for curr form, they get error code (can be fixed later)
    if(uidCurrFormSubmissions.length == 0){
       uidFormResults[currIndex] = -2;

    }else{
      //scholar has at least 1 submission

      /*
      password code we are going to ignore for now :)
      //gets first valid entry and exit (**** WILL CHECK HASH KEY ***************) 
      //uidCurrFormSubmissions - 2D array of submissions for curr uid
      let firstValidSubmission = validSubmission(uidCurrFormSubmissions, expectedHashList1D[currIndex]);
      
      //if none are valid (key is wrong)
      if(firstValidSubmission == null){
        uidFormResults[currIndex] = -3

      //scholar has at least 1 submission
      }else{

        //setting submission to true 
        uidFormResults[currIndex] = 1;
      }
      */
      
      uidFormResults[currIndex] = uidCurrFormSubmissions[0][0];
    }
  });

  
    
  //Logger.log(uidFormResults)
  //return results
  let uidFormResults2D = transform1D(uidFormResults);

 

  //recording 2D [] in correct week / form location
  // testing - recordSubmissions(uidFormResults2D, formNumber, weekNum, weeklyFormsLog, print);
  recordSubmissions(uidFormResults2D, formNumber, weekNum, weeklyFormsLog);
}


//for 2D array of submissions for uid N, finds the first valid key submission and returns
function validSubmission(submissionsArr, correctKey){
  let res = null;
  let i = 0;
  let uid = submissionsArr[i][1];

  let currAttempt = generateHash(uid + submissionsArr[i][2])
  
  //while there are still submissions left and while none of them have given the correct key
  while(i < submissionsArr.length && !(currAttempt == correctKey)){
    i++;
    if(i < submissionsArr.length){
      currAttempt = generateHash(uid + submissionsArr[i][2])
    }
  }
  
  //if exited while loop before running out of submissions -> found correct key submission
  if(i != submissionsArr.length){
    res = submissionsArr[i];
  }
 
  return res;
}


//since uidTimeResults is in same order as UID list, simply copy and paste in correct day
// testing - function recordSubmissions(uidFormResults, formNumber, weekNum, weeklyFormsLog, print){
function recordSubmissions(uidFormResults, formNumber, weekNum, weeklyFormsLog){
  
  let column;
  let shiftRight = 2;
  
  if(formNumber == 1){
    //WAHf
    column = shiftRight + ( ((weekNum-1)*4)+0)

  }else if(formNumber == 2){
    //WPL
    column = shiftRight + ( ((weekNum-1)*4)+1)
  
  }else{
    return
  }

  weeklyFormsLog.getRange(8, column, uidFormResults.length, uidFormResults[0].length).setValues(uidFormResults);
}
