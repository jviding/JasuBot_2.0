module.exports = {

  createDate: function() {
    return formDate();
  }

}

function formDate() {
  var date = new Date();
  var dayName = getDayName(date.getDay());
  var day = date.getDate();
  var month = getRightMonth(date.getMonth());
  return dayName+" "+day+"."+month;
}

function getRightMonth(num) {
  num++;
  if(num<10) {
    return "0"+num;
  }
  return num;
}

function getDayName(num) {
  if(num===1) {
    return 'Ma';
  }
  else if(num===2) {
    return 'Ti';
  }
  else if(num===3) {
    return 'Ke';
  }
  else if(num===4) {
    return 'To';
  }
  else if(num===5) {
    return 'Pe';
  }
  else if(num===6) {
    return 'La';
  }
  else {
    return 'Su';
  }
}