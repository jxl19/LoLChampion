var state = {
  URL: {
    league: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion",
    youtube: 'https://www.googleapis.com/youtube/v3/search',
  },
  currentskin: 0,
}

function getDataFromLeagueApi(searchTerm, callback) {
  var query = {
    champData: 'info,skins',
    api_key: 'RGAPI-b2ae3075-552d-4b32-bcd3-7523ec3fe407',
  }
  $.getJSON(state.URL.league, query, callback);
}

function getDataFromYoutubeApi(searchTerm, callback) {
  var query = {
    q: searchTerm,
    part: 'snippet',
    key: 'AIzaSyCLzHHWZfMw2w1o5g4OrfkatluyOunoOOc',
  }
  $.getJSON(state.URL.youtube, query, callback);
}
// make a fixed navbar, with search bar that will be up there with it
//put the URLs in a state object, and currentskin

function firstLetterUppercase(str) {
  var splitStr = str.toLowerCase().split(' ');
  var arr = [];

  for (i = 0; i < splitStr.length; i++) {
    arr.push(splitStr[i].charAt(0).toUpperCase() + splitStr[i].slice(1));
  } //try using arr.map 
  // word.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  return arr.join(' ');
}
function displaySkinName(obj) {
  //var resultElement = '';
  var optionElement = '';
  var cardElement = '';
  var userInput = $('input.js-query').val(); //put in state
  userInput = firstLetterUppercase(userInput);

  for (var i in obj.data) {
    if (obj.data[i].name === userInput) {
      for (var y = 1; y < obj.data[i].skins.length; y++) {
        // resultElement +=
        //   '<li class = "skinName col-xs-12 col-md-2" value =' + y + '>' + obj.data[i].skins[y].name + '</li>';
        optionElement +=
          '<option class = "skinName" value =' + y + '>' + obj.data[i].skins[y].name + '</option>';
        cardElement +=
        '<div class = "col-md-3 col-xs-12 profile"><div class = "panel panel-default"><div class="panel-thumbnail"><a href= "#" title ="'+obj.data[i].skins[y].name+'" class ="thumb"><img src = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + obj.data[i].key + '_' + y + '.jpg" class = "img-responsive img-rounded" data-toggle ="modal" data-target = ".modal-profile-lg"></a></div><div class = "panel-body"><p class ="profile-name" value =' + y + '>'+  obj.data[i].skins[y].name +'</p></div></div></div>' ;
      }
    }
  }
  //$('.js-search-results').html(resultElement);
  $('select').html(optionElement);
   $('div.panels').html(cardElement);
}

function renderSplashArt(obj) {
  var resultElement = '<div class = "splashart">Splash Art</div>';
  var userInput = $('input.js-query').val();
  userInput = firstLetterUppercase(userInput);
  for (var i in obj.data) {
    if (obj.data[i].name === userInput) {
      for (var y = 1; y < obj.data[i].skins.length; y++) {
        if (y == state.currentSkin) { //refractor!!
          resultElement +=
            '<img class = "splashImg" src = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' +
            obj.data[i].key + '_' + y + '.jpg">';
        }
      }
    }
  }
  $('.js-splash').append(resultElement);
}

function renderVideoResult(data) {
  var resultElement = '<div class = "youtubevid" style = "text-align:center">Champion Skin Spotlights</div>';
  if (data.items) {
    console.log(data.items);

    data.items.forEach(function (item) {
      resultElement += '<div class = "videoName col-md-4 col-xs-12"><div class ="panel-body"><a class = "youtubeLink" href ="#" data-toggle="modal" data-target="#videoModal" data-theVideo=https://youtube.com/embed/' + item.id.videoId + '><img class = "col-xs-12" src =' + item.snippet.thumbnails.high.url + '></a></div></div>';
    });
  }
  else {
    resultElement += '<p>Sorry... nothing came up</p>';
  }
  $('div.panel.panel-default').html(resultElement);
}

function searchSkins(champName) {
  getDataFromYoutubeApi(champName, renderVideoResult);
}

//FUNCTION TO GET AND AUTO PLAY YOUTUBE VIDEO FROM DATATAG
function autoPlayYouTubeModal(clickedVideo) {
  console.log(clickedVideo.attr("data-theVideo"));
  console.log('target:' + clickedVideo.data("target"));
  var theModal = clickedVideo.data("target"),
    videoSRC = clickedVideo.attr("data-theVideo"),
    videoSRCauto = videoSRC + "?autoplay=1";
  $(theModal + ' iframe').attr('src', videoSRCauto);
  $(theModal + ' button.close').click(function () {
    $(theModal + ' iframe').attr('src', videoSRC);
  });
  $(theModal).on('hidden.bs.modal', function () {
    $(theModal + ' iframe').attr('src', videoSRC);
  });
};

function watchSubmit() {
  $('.js-search-form').submit(function (e) {
    e.preventDefault();
    $('p').addClass('show');
    //$('#skins').addClass('show');
    $('.js-splash').empty();
    $('.js-video').empty();
    getDataFromLeagueApi($(this).find('.js-query').val(), displaySkinName);
    state.userInput = $(this).find('.js-query').val();
    console.log(state);
  });
}

// $('.js-search-results').on('click', '.skinName', function (e) {
//   $('.js-splash').empty();
//   $('.js-video').empty();
//   $('.js-splash').addClass('divider');
//   var chosenSkin = $(this).text();
//   searchSkins(chosenSkin + " League of Legends skin spotlight");
//   getDataFromLeagueApi(chosenSkin, renderSplashArt);
//   state.currentSkin = $(this).val();
// });


$('#skinOptions').on('change', function () {
  $('.js-splash').empty();
  $('.js-video').empty();
  $('.js-splash').addClass('divider');
  var chosenSkin = $(this).find("option:selected").text();
  console.log($(this).find("option:selected").text() + ' clicked!');
  searchSkins(chosenSkin + " League of Legends skin spotlight");
  getDataFromLeagueApi(chosenSkin, renderSplashArt);
  state.currentSkin = $(this).val();
});

$('.panel').on('click', '.youtubeLink', function (e) {
  autoPlayYouTubeModal($(this));
});

watchSubmit();


$('.panels').on('click','a.thumb',function(event){
    	event.preventDefault();
      console.log('thumb clicked');
    	var content = $('.modal-body');
    	content.empty();
      	var title = $(this).attr("title");
      	$('.modal-title').html(title);      	
      	content.html($(this).html());
      	$(".modal-profile").modal({show:true});
});

//landing page
//https://jsbin.com/qiyuheloho/edit?html,css,output buttons
//https://land-book.com/gallery/landings

// inside the modal make arrows and a button that removes splash and shows video