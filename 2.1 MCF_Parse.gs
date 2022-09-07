/*MCF_Parse Functions 8/10/22:
  Parses "MCF Form" spreadsheet
  Prints results in "Weekly Forms" ss, in MCF Columns
*/

function runParse_MCF_Sheets(){
  let weekNum = 1;
  parse_MenteeCheckInForm(weekNum)
}

/* parse_MenteeCheckInForm()
  Grabs "MCF Form" ss
  Specifically by sections determined by 
  firstOnTimeRow, lastOnTimeRow, firstLateRow, lastLateRow

  This will determine what week we are currently in (changed manually)
  onTime is (Monday 00:00:00 - Friday 23:59:59)
  late is (Saturday 00:00:00 - Sunday 23:59:59)

  For each Leadership mentor that is in charge of Mentees,
  Parse will generate the number of forms submitted, to check
  if leadership member met with all Mentees
  Results printed in "Weekly Forms" ss
 */
function parse_MenteeCheckInForm(weekNum) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let database = ss.getSheetByName("Database");
  let hashSheet = ss.getSheetByName("Hash Sheet");
  let form = ss.getSheetByName("MCF Form");
  //let print = ss.getSheetByName("MCF Print");
  let weeklyFormsLog = ss.getSheetByName("Weekly Forms");

  let databaseRows = database.getLastRow();
  let hashSheetRows = hashSheet.getLastRow();
  let mentorToMentee = getMentorToMenteeList();

  updateMenteeCount(mentorToMentee);


  let menteeCount = database.getRange(4, 11, databaseRows-3, 1).getValues();
  let menteeCount1D = transform2D(menteeCount);
  // for testing - print2D(mentorToMentee, 6, 2, print);
  
  
  //to determine where to print results in "Weekly Forms" ss

  //grabs column A in "Database" ss
  let uidList = database.getRange(4, 1, databaseRows-3, 1).getValues();
  let uidListOneD = transform2D(uidList);

  // for testing - print.getRange(1,1, uidList.length, 1).setValues(uidList);

  //Change based on how many number of submissions per week!!***********************************
  let firstOnTimeRow = 17; 
  let lastOnTimeRow = 53; 
  let firstLateRow = 55;
  let lastLateRow = 55;
  let formColumns = 4; 
  
  //grabbing submissions (timeStamp, mentorUid, password, menteeUid)
  // s[0] = timeStamp, s[1] = mentorUid, s[2] = passwordAttempt, s[3] = menteeAttempt
  let onTimeSubmissions = form.getRange(firstOnTimeRow, 1, lastOnTimeRow-firstOnTimeRow+1, formColumns).getValues();
  let lateSubmissions = form.getRange(firstOnTimeRow, 1, lastOnTimeRow-firstOnTimeRow+1, formColumns).getValues();

  // testing - print.getRange(1,1, onTimeSubmissions.length, onTimeSubmissions[0].length).setValues(onTimeSubmissions);
  
  //grabbing correct hashes from "Hash Sheet" ss
  let expectedHashList = hashSheet.getRange(8, 2, hashSheetRows-7, 1).getValues();
  let expectedHashList1D = transform2D(expectedHashList);

  // testing - print.getRange(1,1, expectedHashList.length, 1).setValues(expectedHashList);
  
  //final count for # of submissions per Leadership member
  let menteesMetRes = [];

  Logger.log(onTimeSubmissions)
  Logger.log(menteeCount1D)
  //for every uid
  uidListOneD.map(function(currUid, currIndex){

    //filter to match current UID
    let uidCurrFormSubmissions = onTimeSubmissions.filter(function(currSubmissionRow){
      if(currSubmissionRow[1] == currUid){
        return true;
      }
    });

    // testing - print.getRange(1,1, uidCurrFormSubmissions.length, uidCurrFormSubmissions[0].length).setValues(uidCurrFormSubmissions)
    // testing - print.getRange(3,3).setValue(uidCurrFormSubmissions.length);
    


    //if scholar has no submissions for MCF form, they get error code (can be fixed later)
    if(uidCurrFormSubmissions.length == 0){
       menteesMetRes.push([false, -3]);

      // testing - print.getRange(3+currIndex, 3).setValue("wow");

    
    //scholar has at least 1 submission
    }else{
            
      Logger.log(menteeCount1D[currIndex]);
      Logger.log(uidCurrFormSubmissions.length)
      Logger.log("clear");
      if(menteeCount1D[currIndex] == "-"){
        Logger.log("helo");
        menteesMetRes.push(["N/A", "N/A"]);

      }else if(menteeCount1D[currIndex] <= uidCurrFormSubmissions.length){
        Logger.log("CORRECT!");
        menteesMetRes.push([true, uidCurrFormSubmissions.length]);
      }else{
        Logger.log("NO!!");
        menteesMetRes.push([false, uidCurrFormSubmissions.length]);
      }

      /*  Password testing code that we will ignore for now :)
      // testing - print.getRange(5,5).setValue(expectedHashList1D[currIndex]);
      // tesing - print.getRange(5, 5, uidCurrFormSubmissions.length, uidCurrFormSubmissions[0].length).setValues(uidCurrFormSubmissions);
      //gets all valid submissions (**** WILL CHECK HASH KEY ***************) 

      //returns [][] of submissions, only if submission 'k', has correct password (not hash) 'p'
      let allValidSubmission = findAllValidSubmissions(uidCurrFormSubmissions, expectedHashList1D[currIndex], print);
      
      
      //if all submissions are valid (password, not hash, is wrong)
      if(allValidSubmission == null){
        menteesMetRes.push([false, -3]);
        
        // testing - print.getRange(3+currIndex, 3).setValue("nother");
      }else{

        //Leadership member has (m <= s) where m is # of mentees, and s is # of submissions
        //Member has at least as many submissions, as they do mentees
        if(allValidSubmission.length >= mentorToMentee[currIndex].length-1){
          // testing - print.getRange(3+currIndex, 3).setValue("hello");

          menteesMetRes.push([true, allValidSubmission.length]); 

        //Leadership member has (s < m) where m is # of mentees, and s is # of submissions
        //Member have less submissions, than they do mentees
        }else{

          // testing - print.getRange(3+currIndex, 3).setValue("bye");
          menteesMetRes.push([false, allValidSubmission.length]);
        }
      }  

      */
      
    }
  });

  // testing - let menteesMetRes2D = transform1D(menteesMetRes)
  // testing - print.getRange(1, 4, menteesMetRes.length, 2).setValues(menteesMetRes);
  Logger.log("FINAL **********");
  Logger.log(menteesMetRes)

  //sends result to be recorded to "Weekly Forms" ss
  recordMCF(menteesMetRes, weeklyFormsLog, weekNum)
  
  
  
}

function updateMenteeCount(mentorToMentee){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let database = ss.getSheetByName("Database");

  let dbLastRow = database.getLastRow();

  let numOfMentees = mentorToMentee.map(function(currRow){
    if(currRow.length == 1){ //everyone starts with -1, which is counted for the length, so everyone has extra +1 length
      return "-";
    }else{
      return currRow.length-1;
    }
  })

  let numOfMentees2D = transform1D(numOfMentees);

  database.getRange(4, 11, dbLastRow-3, 1).setValues(numOfMentees2D);

}


/* function recordMCF()
  Takes result of MCF Submissions
  menteeMetRes - 2D -> [true/false, integer], true/false: based on # of submissions & # of assigned mentees, integer: # of valid submissions
  weeklyFormslog - SpreadSheet reference
  weekNum - Integer
*/
function recordMCF(menteeMetRes, weeklyFormsLog, weekNum){
  
  //since uidTimeResults is in same order as UID list, simply copy and paste in correct day  
  let shiftRight = 2;
  let column = shiftRight + ((weekNum-1)*4) + 2
  
  //pastes [uid.length, 2] array into "Weekly Forms" ss
  weeklyFormsLog.getRange(8, column, menteeMetRes.length, menteeMetRes[0].length).setValues(menteeMetRes);
}

/* function findAllValidSubmissions()
  Takes result of MCF Submissions
  submissionsArr - 2D -> s[0] = timeStamp, s[1] = mentorUid, s[2] = passwordAttempt, s[3] = menteeAttempt
  correctKey - string
  print - testing
*/
function findAllValidSubmissions(submissionsArr, correctHash, print){
  let i = 0;
  let uid = submissionsArr[i][1];
 
  /* filter returns "rows"/"submissions" in which the password is grabbed s[2]
    and the associated hash is calculated
    filter returns "rows"/"submissions" where those hashes match the correct hash
  */
  let goodPasswords = submissionsArr.filter(function(currSubmissionRow, currIndex){
      
    let currAttempt = generateHash(uid + currSubmissionRow[2]);
    
    // testing - print.getRange(5, 1 + currIndex).setValue(currSubmissionRow[2]);
    // testing - print.getRange(6, 1 + currIndex).setValue(currAttempt);

    if(currAttempt == correctHash){
      return true;
    }
  });
  
  if(goodPasswords.length == 0){
    return null;
  }
 
  //returns good submissions
  return goodPasswords;
}

/* function getMentorToMenteeList()
  Generates 2D arr -> based on uid list from "Database" ss
  2D arr List will be list of mentees assigned to mentors, where row is based on mentorUid:

*/
function getMentorToMenteeList(){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let database = ss.getSheetByName("Database");
  // testing - let print = ss.getSheetByName("MCF Print");

  let databaseRows = database.getLastRow();

  //grabs column A, from "Database" ss
  let uidList = database.getRange(4, 1, databaseRows-3, 1).getValues();
  
  //merges column C+B, from "Database" ss
  let lastFirstName = database.getRange(4, 2, databaseRows-3, 2).getValues();
  let teamLeaderList = database.getRange(4,5, databaseRows-3, 1).getValues();
  let firstLastName1D = lastFirstName.map(function(currRow){
    return currRow[1] + " " + currRow[0];
  })

  //2D list of firstLast name in order of uid
  let firstLastName2D = transform1D(firstLastName1D);

  // testing - print.getRange(4, 4, firstLastName2D.length, 1).setValues(firstLastName2D);

  // uidList (integer)
  //teamLeader (firstName " " lastName) 
  //Note: teamLeader Column, is based on scholars (uid) assigned TL
  let uidList1D = transform2D(uidList);
  let teamLeaderList1D = transform2D(teamLeaderList);
  
  //new 2D array
  let mentorToMenteeList2D = newSize2DArray(uidList1D.length);
  
  // testing - print.getRange(1,1, teamLeaderList.length, 1).setValues(teamLeaderList);
  
  //for list of assigned TLs
  teamLeaderList1D.map(function(currName, index){
    
    //if not blank
    if(currName != ""){

      //gets index of TeamLeader
      let nameIndex = firstLastName1D.indexOf(currName);
      
      // testing - print.getRange(1+index, 2).setValue(nameIndex);
      
      //if TeamLeader does not exits
      if(nameIndex == -1){

        //name does not exists (spelled wrong maybe)
        
      //Tl does exist  
      }else{
        mentorToMenteeList2D[nameIndex].push(index);
      }
      
    }
  })

  // testing - print2D(mentorToMenteeList2D, 10, 2, print);

  //returns 
  return mentorToMenteeList2D;
  
}
