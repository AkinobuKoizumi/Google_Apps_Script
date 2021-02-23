
function getSlackUser() {
  const slack_app_token = "****";

  const options = {
    "method" : "get",
    "contentType": "application/x-www-form-urlencoded",
    "payload" : { 
      "token": slack_app_token
    }
  };
  
  const url = "https://slack.com/api/users.list";
  const response = UrlFetchApp.fetch(url, options);
  
  const members = JSON.parse(response).members;
  
  let arr = [];
  
  for (const member of members) {
    
    //削除済、botユーザー、Slackbotを除く
    if (!member.deleted && !member.is_bot && member.id !== "USLACKBOT") {
      let id = member.id;
      let real_name = member.real_name; //氏名(※表示名ではない)
      arr.push([real_name,id]);
    }
    
  }
  //スプレッドシートに書き込み
  const SHEET_URL ="****";
  const SHEET1 = SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName("user-id-from-slack");
  SHEET1.getRange(1, 1, SHEET1.getMaxRows()-1, 2).clearContent();
  SHEET1.getRange(1, 1, arr.length, arr[0].length).setValues(arr); 
}