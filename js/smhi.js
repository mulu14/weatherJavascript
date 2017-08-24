// finally this assignment is done 

'use strict'

$(document).ready(function(){
// get name from user and convert into latitude and longtude and store in sessionStorage
$("#locater").click(function() {
 var address = document.getElementById('placename').value // get value from input field
  //console.log(address);
  //var findLocation = new Array(2); // create array length 2 to hold latitude and logitude of a place
  if(address !=null){   // check if the user field is empty 
  var geocoder = new google.maps.Geocoder();   
  geocoder.geocode( { 'address': address}, function(results, status) {

  if (status == google.maps.GeocoderStatus.OK) {
    var lat = results[0].geometry.location.lat().toFixed(4);
    var longt= results[0].geometry.location.lng().toFixed(3);
    var data = 'http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/'+longt+'/lat/'+lat+'/data.json';
    var smi = $.getJSON(data); // send request 
    returnWeathers(smi);  
      }
    else{
    }
  });
}});


$("#localselected").change(function() {   // calcualte latitude and longititude for faviourte place
 var address = $(this).val();  // get the value of the address from drop down list
  //console.log(address);
  if(address !=null){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': address}, function(results, status) {

  if (status == google.maps.GeocoderStatus.OK) {
    var lat = results[0].geometry.location.lat().toFixed(4);
    var longt= results[0].geometry.location.lng().toFixed(3);
    var data = 'http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/'+longt+'/lat/'+lat+'/data.json';
    var smi = $.getJSON(data); // send request 
    returnWeathers(smi);  
       
       // if the user choice any new place update localsession storage with new address latitide and longitude
  }
  });
  }
});
 
     // save data in array of faviourate place in this array 
     $('#fav').click(function(e) {
         let placeArray = new Array();
         let placeaddress = document.getElementById('placename').value; // get value from input field
         
         let placeName = {                  // create json object to save the faviourate place 
             name:placeaddress
         }
         if(window.sessionStorage.getItem("place") == null){  // check if sessionStorage is empty 
            placeArray.push(placeName); // push value to array
            window.sessionStorage.setItem("place", JSON.stringify(placeArray)); // save array in sessionStorage 

         }
         else{
            let  place_Array = window.sessionStorage.getItem("place"); //save  parsed session 
            // console.log(typeof(place_Array));
             placeArray = JSON.parse(place_Array);
             placeArray.push(placeName); // add new faviourite place in array
             window.sessionStorage.setItem("place", JSON.stringify(placeArray)); // save back array to session variable
         }
         
    
         
        });

pushTofav(); // function call  display faviourite place ss
});




function returnWeathers(smi){
    var windspeed = []; // wind speed array
    var temp = []; // tempreture array
    var valid = []; // valid time array
    var windDirection =  []; 
    smi.done(function(result){
    // calculate wind speed and save in wind speed array
    for(i = 0; i < result.timeSeries.length; ++i){
        if(result.timeSeries[i].validTime.split("T")[1] == "12:00:00Z"){
            for(var j = 0; j < result.timeSeries[i].parameters.length; ++j){
                if(result.timeSeries[i].parameters[j].name =="ws"){
                 windspeed.push(result.timeSeries[i].parameters[j].values);
                }
            }

        }

    }
// wind direction 
  for(i = 0; i < result.timeSeries.length; ++i){
        if(result.timeSeries[i].validTime.split("T")[1] == "12:00:00Z"){
            for(var j = 0; j < result.timeSeries[i].parameters.length; ++j){
                if(result.timeSeries[i].parameters[j].name =="wd"){
                 windDirection.push(result.timeSeries[i].parameters[j].values);
                }
            }

        }

    }
   


    // calculate tempreature and save in temp array 
    for(i = 0; i < result.timeSeries.length; ++i){
                if(result.timeSeries[i].validTime.split("T")[0]){
                for(j = 0; j < result.timeSeries[i].parameters.length; ++j){
                    if(result.timeSeries[i].parameters[j].name =="t"){
                         temp.push(result.timeSeries[i].parameters[j].values)
                    }
                }
                }

            }
    // calculate valid time  and save in valid array 

     for(i = 0; i < result.timeSeries.length; ++i){
            valid.push(result.timeSeries[i].validTime.split("T")[0]);
           // console.log(result.timeSeries[i].validTime.split("T")[0]);
                }
// filter unique day
    var uniqueDay = [];
    var arrDay = valid;
    for(var i in arrDay){
        if(uniqueDay.indexOf(arrDay[i]) === -1){
            uniqueDay.push(arrDay[i]);
        }
    }
   //console.log(uniqueDay);
///* convert year, month, day format into week days */
var arrYMD = [];
var weekDay = uniqueDay;
for(i = 0; i < weekDay.length; ++i){
var datT = new Date(weekDay[i]);
var convertweekD = datT.getDay();
arrYMD.push(convertweekD);
};

/*convert week day to actual day*/
var arrWeekDay = [];
var week = arrYMD;
for(i = 0; i < week.length; ++i){
    switch(week[i]){
        case 1:
        arrWeekDay.push("Monday");
        break;
        case 2:
        arrWeekDay.push("Tuesday");
        break;
        case 3:
        arrWeekDay.push("Wednesday");
        break;
        case 4:
        arrWeekDay.push("Thursday");
        break;
        case 5:
        arrWeekDay.push("Friday");
        break;
        case 6:
        arrWeekDay.push("Saturday");
        break;
        default:
        arrWeekDay.push("Sunday");
        break;
    }
}

/*function to sort returned array into array of array*/
var arrValid = valid;
var resultreduce = arrValid.reduce(function(r, item) {
  (r.hash[item] || (r.hash[item] = r.arrValid[r.arrValid.push([]) - 1])).push(item);

  return r;
}, { arrValid: [], hash: {} }).arrValid;

/* concatenate array*/
 var timeT = resultreduce;
    var tempT = temp;
    var tempArray = [];
    for(i = 0; i < timeT.length; ++i){
       var len = timeT[i].length;
        var part = tempT.slice(0, len);
        var merged = [].concat.apply([],part);
        tempArray.push(merged);

    }

    /*calculate max tempreture*/
 var max = [];
    var findMaxTemp = tempArray;
    for(i = 0; i < findMaxTemp.length; ++i){
        var elem = findMaxTemp[i];
        var val = Math.max.apply(null, elem);
        max.push(val);
    }
/* calculate average tempreature*/
var avr = [];
var sum = 0;
var calAverge = tempArray;
for(i = 0; i < calAverge.length; ++i){
    for(j = 0; j < calAverge[i].length; ++j){
        sum +=calAverge[i][j];
    }
    var average = sum/calAverge[i].length;
    avr.push(average);
    sum = 0;
}

// create table and display weather data
      //var table = document.getElementById("wData"); /*  */
      var days = arrWeekDay;  /*days where Metrology data collected */
      var windS = windspeed;  /*speed of wind */
      var average = avr; /* average wind*/
      var max = max;  /* maximum tempreture*/
      var mergeWind = [].concat.apply([], windDirection);    
      var html = ''; 
      for (i = 0; i < 7; ++i){
          html += '<tr>';
          html +='<td>'+ days[i] +'</td>'; 
          html +='<td>'+ max[i] +'</td>'; 
          html +='<td>'+ average[i] +'</td>'; 
          html +='<td>'+ '<div class="fa fa-long-arrow-up" id="data' + i + '"></div>' + '</br>' + windS[i] +'</td>'; 
          html +='</tr>'; 
         
      }

      $('#weatherTable > tbody').html(html); 

   rotate(); 

   //function to rotate 
   // the function take two paramters  angle and id
        function rotateImage(degree, id) {
            $('#'+id).animate({  transform: degree }, {
            step: function(now,fx) {
                $(this).css({
                    '-webkit-transform':'rotate('+now+'deg)', 
                    '-moz-transform':'rotate('+now+'deg)',
                    'transform':'rotate('+now+'deg)'
                });
            }
            });
        }

    // function rotate each id element
    function rotate(){
     for(i = 0; i < 7; ++i){
         var makestring = i.toString();  // convert number to string
         rotateImage(mergeWind[i], "data" + makestring); 
     }
    }
    
})};




 //this function retrive values from local session 
 // display in drop down in user faviourite place 
  function pushTofav(){
   var retriveFav = window.sessionStorage.getItem("place"); // get session variable 
   var select = document.getElementById('localselected');   //var select = document.createElement('select');
   select.innerHTML = ''; // initial value is  null
   var parseRetrive= JSON.parse(retriveFav); // parse and save as array in variable
   //console.log(parseRetrive);
   
   for(var i = 0; i < parseRetrive.length; ++i){ // loop and save in DOM object
    var opt = parseRetrive[i].name;
    select.innerHTML += "<option value=\"" +      opt  +     "\">" +    opt +    "</option>";
   }

  }
