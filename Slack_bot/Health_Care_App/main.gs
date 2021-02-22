function processData() {
  const SHEET_URL ="https://docs.google.com/spreadsheets/d/1tTMx35W4OmSnPPn7O70ctzoYTJz2gfwSLE8-rmz41AA/edit#gid=361941574";
  const SHEET1 = SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName("フォームの回答 1");
  const SHEET2 = SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName("name-list");
  const SHEET3 = SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName("mail-list");
  var maxRowsSheet1 = SHEET1.getMaxRows();
  var maxRowsSheet2 = SHEET2.getMaxRows();

  //最後の行までを取得する
  // //getRange(始まりの行番号,始まりの列番番号,指定する行数,指定する列数)
  //----------------エクセルデータの取得---------------------
  //nullを含む全ての文字列を取得してしまう
  ////解決策
  //////（1）filterでnullを含む物から文字列の格納されている配列だけを抜き出す
  var sheet1Values_full = SHEET1.getRange(2,2,maxRowsSheet1,1).getValues();
  var sheet1Values = sheet1Values_full.filter(String);
  var sheet2Values_full = SHEET2.getRange(2,1,maxRowsSheet2,1).getValues();
  var sheet2Values = sheet2Values_full.filter(String);
  var sheet3Values_full = SHEET2.getRange(2,2,maxRowsSheet2,1).getValues();
  var sheet3Values = sheet3Values_full.filter(String);  
  
  
  //--------------------------------------

  //-------------格納されているデータの確認----------------
  Logger.log(sheet1Values);  //フォームの回答
  Logger.log(sheet1Values.length); //フォームの配列の要素数 
  Logger.log(sheet2Values);  //名簿 
  Logger.log(sheet2Values.length);  //名簿の配列の格納数 
  Logger.log(sheet3Values);  //User ID
  Logger.log(sheet3Values.length);  //User IDの配列の格納数 
  //--------------------------------------

  //-------------データの判定/処理--------------
  var num = 0;
  //returnが-1になるまで呼び出しを繰り替えす
  while(num < 50){
    getIndex(sheet2Values,sheet1Values);
    num++;
    if(getIndex(sheet2Values,sheet1Values) == -1){
      Logger.log("存在しない");
      break;
    }else{
      Logger.log("存在する");
      Logger.log(getIndex(sheet2Values,sheet1Values));
      var result2 = sheet2Values.splice(getIndex(sheet2Values,sheet1Values),1);
      var result3 = sheet3Values.splice(getIndex(sheet2Values,sheet1Values),1);
      Logger.log(result2);
      Logger.log(result3);
    }
  }
  Logger.log(sheet1Values);
  Logger.log(sheet2Values); //こいつをアウトプットする
  Logger.log(sheet3Values); 
  var text = creatMessage(sheet2Values,sheet3Values);
  Logger.log(text);
  postSlack(text);
  //-----------------------------------------
  

}



//------------indeOfの補完用関数--------------------
////＊説明---------------------------
//////＊連想配列ではindexOfは使用できない
//////＊getValue(=>配列)
////////＊返り値は、object[]
//////＊getValues（=>連想配列）
////////＊返り値は、object[][]
////---------------------------------
function getIndex(namelist, outputlist) {
    for(let i = 0; i < outputlist.length; i++) {
      for(let j=0;j < namelist.length;j++){
        if(outputlist[i][0] == namelist[j][0]) {
          Logger.log(j);
          return j;
        }
      }
    }
    return -1; 

}
//--------------------------------------------------

//-----------------Slack用文言生成関数----------------
function creatMessage(sheet2Values,sheet3Values) {
  var go_name = ['健康チェック未入力の方を通知します。\n10時までに入力をお願いします。\n'];
  for(let i=0;i< sheet2Values.length;i++){
    go_name.push('氏名　'+sheet2Values[i][0]+'　ID　'+sheet3Values[i][0]);
  }
  var output = go_name.join('\n');
  return output;
} 


//--------------------------------------------------

//-----------------Slackへのpost用関数---------------
//引数sheet2Values
function postSlack(text) {
  var url = 'https://hooks.slack.com/services/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'; // Webhook URLを入力する

  
  var postData = {
    "channel": "#general",
    "text": text,
    "username": "Health Care Bot"
  };
  
  var options = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(postData)

  };
  
  return UrlFetchApp.fetch(url, options);
}

//--------------------------------------------------

