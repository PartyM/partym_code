//Google app script to break apart the IRS excel sheet for selected income and produce a clean, simplified version that is importable into a database for querying.
//Input: currently designed to be attached directly to a Google Sheet file as a script and ran directly on that file.
//Output: a new google sheet in the root directory of your google drive

function myFunction() {
  //Get current spreadsheet. This is expected to be an import from IRS directly.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var originalSheet = ss.getSheetByName("TBL11");

  //name of the file is expected to start with the year of the tax data
  var year = ss.getName().substring(0,4)
  Logger.log("year: %s", year);

  //Set up a holding group for modified data
  var workingSheet = ss.getSheetByName("workingCopy");
  if (workingSheet != null) {
   Logger.log("Deleting old workingSheet: %s", workingSheet.getName());
   ss.deleteSheet(workingSheet);
  }

  ss.insertSheet("workingCopy", {"template": originalSheet});
  var workingSheet2 = ss.getSheetByName("workingCopy");

  //Delete first 2 rows
  workingSheet2.deleteRows(1, 2);
  //Delete extra calculations (from lowest, from highest)
  workingSheet2.deleteRows(28, 100);

  //TODO: getMergedCells and and replace content with the content so we can auto figure out headers later

  //things to be removed from all fields
  r = workingSheet2.getRange("A7:U27");

  //remove special formatting
  r.clearFormat();

  values = r.getValues();
  for (var i = 0; i < values.length; i++) {
    for (var k = 0; k < values[i].length; k++) {
      Logger.log("Value: %s", values[i][k]);
      //remove $ and ,
      values[i][k] = values[i][k].toString().replace(/\$|\,/g,"");
      //make lowercase
      values[i][k] = values[i][k].toString().toLowerCase();
      //remove spaces
      values[i][k] = values[i][k].toString().replace(/\s/g,"_");
      //replace [1] and [2] anywhere in sheet
      values[i][k] = values[i][k].toString().replace("[1]", 0.001);
      values[i][k] = values[i][k].toString().replace("[2]", 0.025);
    };
  };

  r.setValues(values)

  cell = workingSheet2.getRange("B7").setValue("all_returns_number_of_returns");
  cell = workingSheet2.getRange("C7").setValue("all_returns_percent_of_total");
  cell = workingSheet2.getRange("D7").setValue("all_returns_agi_less_deficit_amount");
  cell = workingSheet2.getRange("E7").setValue("all_returns_agi_less_deficit_percent_of_total");
  cell = workingSheet2.getRange("F7").setValue("all_returns_agi_less_deficit_average");
  cell = workingSheet2.getRange("G7").setValue("taxable_returns_number_of_returns");
  cell = workingSheet2.getRange("H7").setValue("taxable_returns_percent_of_total");
  cell = workingSheet2.getRange("I7").setValue("taxable_returns_agi_less_deficit_amount");
  cell = workingSheet2.getRange("J7").setValue("taxable_returns_agi_less_deficit_percent_of_total");
  cell = workingSheet2.getRange("K7").setValue("taxable_returns_taxable_income_number_of_returns");
  cell = workingSheet2.getRange("L7").setValue("taxable_returns_taxable_income_amount");
  cell = workingSheet2.getRange("M7").setValue("taxable_returns_taxable_income_percent_of_total");
  cell = workingSheet2.getRange("N7").setValue("taxable_returns_income_tax_after_credits_number_of_returns");
  cell = workingSheet2.getRange("O7").setValue("taxable_returns_income_tax_after_credits_amount");
  cell = workingSheet2.getRange("P7").setValue("taxable_returns_income_tax_after_credits_percent_of_total");
  cell = workingSheet2.getRange("Q7").setValue("taxable_returns_total_income_tax_amount");
  cell = workingSheet2.getRange("R7").setValue("taxable_returns_total_income_tax_percent_of_total");
  cell = workingSheet2.getRange("S7").setValue("taxable_returns_total_income_tax_percent_of_taxable_income");
  cell = workingSheet2.getRange("T7").setValue("taxable_returns_total_income_tax_percent_of_agi_less_deficit");
  cell = workingSheet2.getRange("U7").setValue("taxable_returns_total_income_tax_percent_of_average_total_income_tax");

  //insert a column for year with the year of file
  workingSheet2.insertColumnAfter(1);
  cell = workingSheet2.getRange("B7").setValue("year");
  r = workingSheet2.getRange("B8:B27");
  values = r.getValues();
  for (var i = 0; i < values.length; i++) {
    for (var k = 0; k < values[i].length; k++) {
      values[i][k] = year
    };
  };
  r.setValues(values)

  //delete the old headers
  workingSheet2.deleteRows(1, 6);

  //Get clean data
  var r = workingSheet2.getRange("A1:U21");

  //New spradsheet for final data landing
  var newSS =  SpreadsheetApp.create(year);
  newSS.renameActiveSheet("selected_income");
  var newSheet = newSS.getSheetByName("selected_income");
  var r2 = newSheet.getRange("A1:U21");
  r2.setValues(r.getValues());

  //delete the workingCopy
  ss.deleteSheet(workingSheet2)

}
