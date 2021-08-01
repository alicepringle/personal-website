$(document).ready(function() {

  // var POINT_X = 'income'; // column name for x values in data.csv
  // var POINT_Y = 'grades'; // column name for y values in data.csv
  // var POINT_NAME = 'district'; // point names that appear in tooltip
  // var POINT_URL = 'url'; // urls of points
  // var POINT_HEAD = 'headline'; // urls of points
  // var X_AXIS = ''; // x-axis label, label in tooltip
  // var Y_AXIS = ''; // y-axis label, label in tooltip
  // var SHOW_GRID = false; // `true` to show the grid, `false` to hide
  // var colors = [ '#2685CB', '#4AD95A', '#FEC81B', '#FD8D14', '#CE00E6', '#4B4AD3', '#FC3026', '#B8CCE3', '#6ADC88', '#FEE45F'  ];
  
  var TITLE = 'Income and Test Scores in Connecticut School Districts, 2009-13';

  var POINT_X = 'income'; // column name for x values in data.csv
  var POINT_X_PREFIX = ''; // prefix for x values, eg '$'
  var POINT_X_POSTFIX = ''; // postfix for x values, eg '%'

  var POINT_Y = 'grades'; // column name for y values in data.csv
  var POINT_Y_PREFIX = ''; // prefix for x values, eg 'USD '
  var POINT_Y_POSTFIX = ''; // postfix for x values, eg ' kg'

  var POINT_NAME = 'district'; // point names that appear in tooltip
  var POINT_COLOR = 'rgba(0,0,255,0.7)'; // eg `black` or `rgba(10,100,44,0.8)`
  var POINT_RADIUS = 50; // radius of each data point

  var POINT_URL = 'url'; // urls of points
  var POINT_HEAD = 'headline'; // urls of points

  var X_AXIS = ''; // x-axis label, label in tooltip
  var Y_AXIS = ''; // y-axis label, label in tooltip

  var SHOW_GRID = false; // `true` to show the grid, `false` to hide

  $.get("event_names.csv", {'_': $.now()}, function(csvString) {
    const titles_pre = Papa.parse(csvString, {header: false, delimiter: '&&&&'}).data;
    const titles = String(titles_pre).split("&&&&")
  
    var filenames = []
    for (i=0; i<titles.length; i++) {
      filenames[i] = "./data"+String(i)+".csv"
    }


    function selectOne() {
      var select = document.getElementById('select-name');
      for (var i=0; i<filenames.length; i++) {
        select.options[select.options.length] = new Option(titles[i],filenames[i]);
      } 
    }
selectOne();


  $(function() {
    $('#select-name').selectize({plugins: ['remove_button']
  });
  
  // function titleCase(str) {
  //   str = str.toLowerCase();
  //   str = str.split(' ');
  //   for (var i = 0; i < str.length; i++) {
  //     str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  //   }
  //   return str.join(' ');
  // }

// $.get("event_names.csv", {'_': $.now()}, function(csvString) {
//   const titles_pre = Papa.parse(csvString, {header: false, delimiter: '&&&&'}).data;
//   const titles = String(titles_pre).split("&&&&")

//   var filenames = []
//   for (i=0; i<titles.length; i++) {
//     filenames[i] = "./data"+String(i)+".csv"
//   }


$('#contacts').submit(function(e){
  e.preventDefault();

  var TITLE = 'Income and Test Scores in Connecticut School Districts, 2009-13';

  var POINT_X = 'income'; // column name for x values in data.csv
  var POINT_X_PREFIX = ''; // prefix for x values, eg '$'
  var POINT_X_POSTFIX = ''; // postfix for x values, eg '%'

  var POINT_Y = 'grades'; // column name for y values in data.csv
  var POINT_Y_PREFIX = ''; // prefix for x values, eg 'USD '
  var POINT_Y_POSTFIX = ''; // postfix for x values, eg ' kg'

  var POINT_NAME = 'district'; // point names that appear in tooltip
  var POINT_COLOR = 'rgba(0,0,255,0.7)'; // eg `black` or `rgba(10,100,44,0.8)`
  var POINT_RADIUS = 25; // radius of each data point

  var X_AXIS = ''; // x-axis label, label in tooltip
  var Y_AXIS = ''; // y-axis label, label in tooltip

  var SHOW_GRID = true; // `true` to show the grid, `false` to hide
  var lengthofstring =  JSON.stringify($('#select-name').val()).length
  var csv_ref = JSON.stringify($('#select-name').val()).substr(2, lengthofstring-4)

  
  $.get(csv_ref, {'_': $.now()}, function(csvString) {
    
    
    var rows = Papa.parse(csvString, {header: true}).data;
    var colors = [ '#2685CB', '#4AD95A', '#FEC81B', '#FD8D14', '#CE00E6', '#4B4AD3', '#FC3026', '#B8CCE3', '#6ADC88', '#FEE45F'  ];
    var datasetdata = []
    pubs = []
    // list of publishers 
    var publishers_list = []
    for (i=0; i<rows.length-2; i++) {
      publishers_list[i] = rows[i][POINT_NAME]
      }
    var urls_list = []
    var head_list = []
    for (i=0; i<rows.length-1; i++) {
      urls_list[i] = rows[i][POINT_URL]
      head_list[i] = rows[i][POINT_HEAD]
      }
    var publishers = [...new Set(publishers_list)]
    for (i=0; i<publishers.length; i++) {
                pubs[i] = rows.map(function(row) {
              
                  if(row[POINT_NAME] == publishers[i]){
                  return {
                    x: row[POINT_X],
                    y: row[POINT_Y],
                    name: row[POINT_HEAD]
                  }}
                })
              }
    
    for (i=0; i<pubs.length; i++) {
        datasetdata[i] = {
              label:publishers[i],
              data: pubs[i],
              backgroundColor: colors[i],
              hoverBackgroundColor: colors[i],
              borderStyle: 'solid',
              borderWidth: 2,
              pointRadius: 15,
              fill: false,
              pointHoverRadius: 20
        }
      }

    var scatterdata = {
      datasets: datasetdata}

    var ctx = document.getElementById('container').getContext('2d');
    
    Chart.Scatter(ctx, {

      data: 
        scatterdata
      ,
      options: {

        title: {
          display: SHOW_GRID,
          text: rows[rows.length-2][POINT_NAME],
          fontSize: 20,
        },
        legend: {
          display: true,
          labels:{fontSize:15}
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: false,
              labelString: X_AXIS
            },

            gridLines: {
              display: false,
              drawBorder: true,
              lineWidth: 5

            },
            ticks: {
              callback: function(value, index, values) {
                return ;
              }
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: Y_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
              drawBorder: true,
              drawOnChartArea: true,
              lineWidth: 5
            },
            ticks: {
              callback: function(value, index, values) {
                return ;
              }
            }
          }]
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: function(tooltipItem, all) {
              return [
                all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].name,
              ]
            },
            label: function(tooltipItem, all) {
              return [
            //     X_AXIS + ': ' + POINT_X_PREFIX + tooltipItem.xLabel.toLocaleString() + POINT_X_POSTFIX,
            //     Y_AXIS + ': ' + POINT_Y_PREFIX + tooltipItem.yLabel.toLocaleString() + POINT_Y_POSTFIX
              ]
          }
        }
      }
      }
    });
    
  // var parsed = "Article URLS:"+"\n";
  // $('#target').empty().append('<p style="color:grey; font-size:20px"><b>Article Links:<b></p>')

  // for (i = 0; i< urls_list.length-1; i++) {
  //     var myobj=  urls_list[i];
  //     // var myheadline=  titleCase(head_list[i])
  //     var myheadline=  head_list[i]
  //     $('#target').append('<a  href='+myobj+'>'+myheadline+'</a>'+"<br>"+"<br>")
  // }    
  }
  );
  })
})
});
})


// $(function() {
//   $('#select-name').selectize({    plugins: ['remove_button']
// });

// $('#contacts').submit(function(e){
//   e.preventDefault();

//   alert('You have chosen the following users: '+ JSON.stringify($('#select-name').val()));
// });
// });