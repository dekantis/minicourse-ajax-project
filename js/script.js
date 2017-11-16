// $('#form-container').submit(function() {
//
//     var $body = $('body');
//     var $wikiElem = $('#wikipedia-links');
//     var $nytHeaderElem = $('#nytimes-header');
//     var $nytElem = $('#nytimes-articles');
//     var $greeting = $('#greeting');
//
//     // clear out old data before new request
//     $wikiElem.text("");
//     $nytElem.text("");
//
//     var addressInput = $ ('#street'). val ();
//     var cityInput = $ ('#city'). val ();
//     var addressInput = $('#street').val();
//     var cityInput = $('#city').val();
//     var address = addressInput + ', ' + cityInput;
//
//     $greeting.text('So, you want to live at ' + address + '?');
//
//     var bgImgURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&amp;location=' + address + '';
//
//     $body.append('<img class="bgimg" src="' + bgImgURL +'">');
//
//
//     return false;
// });
//
// $('#form-container').submit();

// New code goes HERE


var geocoder;
var map;
var marker;

function initialize() {
  //Определение карты
  var latlng = new google.maps.LatLng(55.54057960174266, 28.63636846190184);
  var options = {
    zoom: 13,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), options);

  //Определение геокодера
  geocoder = new google.maps.Geocoder();

  marker = new google.maps.Marker({
    map: map,
    draggable: true
  });

}

$(document).ready(function() {

  initialize();

  $(function() {
    $("#address").autocomplete({
      //Определяем значение для адреса при геокодировании
      source: function(request, response) {
        geocoder.geocode({
          'address': request.term
        }, function(results, status) {
          response($.map(results, function(item) {
            // Подключение NY TImes Search

            // SETUP VARIABLES
            // ==========================================================

            // This variable will be pre-programmed with our authentication key (the one we received when we registered)
            var authKey = "126bf7aad67c4e70913c43561718d92f";

            // These variables will hold the results we get from the user's inputs via HTML
            var queryTerm = "";
            var numResults = 0;
            var startYear = 0;
            var endYear = 0;

            // Based on the queryTerm we will create a queryURL
            var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + authKey + "&q=";

            // Array to hold the various article info
            var articleCounter = 0;
            // FUNCTIONS
            // ==========================================================


            // This runQuery function expects two parameters (the number of articles to show and the final URL to download data from)
            function runQuery(numArticles, queryURL) {

              // The AJAX function uses the URL and Gets the JSON data associated with it. The data then gets stored in the variable called: "NYTData"
              $.ajax({
                  url: queryURL,
                  method: "GET"
                })
                .done(function(NYTData) {

                  // Here we are logging the URL so we have access to it for troubleshooting
                  console.log("------------------------------------")
                  console.log("URL: " + queryURL);
                  console.log("------------------------------------")

                  // Here we then log the NYTData to console, where it will show up as an object.
                  console.log(NYTData);
                  console.log("------------------------------------")

                  // Loop through and provide the correct number of articles
                  for (var i = 0; i < numArticles; i++) {

                    // Add to the Article Counter (to make sure we show the right number)
                    articleCounter++;

                    // Create the HTML Well (Section) and Add the Article content for each
                    var wellSection = $("<div>");
                    wellSection.addClass('well');
                    wellSection.attr('id', 'articleWell-' + articleCounter)
                    $('#wellSection').append(wellSection);

                    // Confirm that the specific JSON for the article isn't missing any details
                    // If the article has a headline include the headline in the HTML
                    if (NYTData.response.docs[i].headline != "") {
                      $("#articleWell-" + articleCounter).append('<h3><span class="label label-primary">' + articleCounter + '</span><strong>   ' + NYTData.response.docs[i].headline.main + "</strong></h3>");

                      // Log the first article's Headline to console.
                      console.log(NYTData.response.docs[i].headline.main);
                    }

                    // If the article has a Byline include the headline in the HTML
                    if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.hasOwnProperty("original")) {
                      $("#articleWell-" + articleCounter).append('<h5>' + NYTData.response.docs[i].byline.original + "</h5>");

                      // Log the first article's Author to console.
                      console.log(NYTData.response.docs[i].byline.original);
                    }

                    // Then display the remaining fields in the HTML (Section Name, Date, URL)
                    $("#articleWell-" + articleCounter).append('<h5>Section: ' + NYTData.response.docs[i].section_name + "</h5>");
                    $("#articleWell-" + articleCounter).append('<h5>' + NYTData.response.docs[i].pub_date + "</h5>");
                    $("#articleWell-" + articleCounter).append("<a href='" + NYTData.response.docs[i].web_url + "'>" + NYTData.response.docs[i].web_url + "</a>");

                    // Log the remaining fields to console as well
                    console.log(NYTData.response.docs[i].pub_date);
                    console.log(NYTData.response.docs[i].section_name);
                    console.log(NYTData.response.docs[i].web_url);
                  }
                });

            }

            // METHODS
            // ==========================================================

            // // On Click button associated with the Search Button
            // $('#runSearch').on('click', function(){

            // Initially sets the articleCounter to 0
            articleCounter = 0;

            // Empties the region associated with the articles
            $("#wellSection").empty();

            // Search Term
            var searchTerm = $('#address').val().trim();
            queryURL = queryURLBase + searchTerm;

            // Num Results
            numResults = 5;

            // Then we will pass the final queryURL and the number of results to include to the runQuery function
            runQuery(numResults, queryURL);

            // This line allows us to take advantage of the HTML "submit" property. This way we can hit enter on the keyboard and it registers the search (in addition to clicks).
            // 	return false;
            // });

            // End NY Times Api

            //start wiki api


            return {
              label: item.formatted_addres,
              value: item.formatted_address,
              latitude: item.geometry.location.lat(),
              longitude: item.geometry.location.lng()
            }
          }));
        })
      },
      //Выполняется при выборе конкретного адреса
      select: function(event, ui) {
        $("#latitude").val(ui.item.latitude);
        $("#longitude").val(ui.item.longitude);
        var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
        marker.setPosition(location);
        map.setCenter(location);
      }
    });
  });

  //Добавляем слушателя события обратного геокодирования для маркера при его перемещении
  google.maps.event.addListener(marker, 'drag', function() {
    geocoder.geocode({
      'latLng': marker.getPosition()
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#address').val(results[0].formatted_address);
          $('#latitude').val(marker.getPosition().lat());
          $('#longitude').val(marker.getPosition().lng());
        }
      }
    });
  });
  var $search = $('#address');
  var $results = $('#results');

  // For autocomplete if I ever get around to implementing it
  /*$.ajax({
    url: "http://en.wikipedia.org/w/api.php",
    dataType: "jsonp",
    data: {
      'action': "opensearch",
      'format': "json",
      'search': $search.val()
    }*/

  $search.keyup(function() {
    var searchQuery = $search.val();

    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'query',
        format: 'json',
        prop: 'extracts',
        exchars: '200',
        exlimit: 'max',
        explaintext: '',
        exintro: '',
        pilimit: 'max',
        rawcontinue: '',
        generator: 'search',
        gsrsearch: searchQuery,
        gsrnamespace: '0',
        gsrlimit: '5'
      },
      success: function(data) {
        $results.empty();
        var pages = data.query.pages;
        console.log(pages);
        for (var page in pages) {
          $results.append(
            '<a href="https://en.wikipedia.org/wiki/' + pages[page].title + '" target="_blank">' +
            '<article id="result">' +
            '<h2>' + pages[page].title + '</h2>' +
            '<p>' + pages[page].extract + '</p>' +
            '</article>' +
            '</a>'
          );
        }
      }
    });
  });

});
//wiki example tty
