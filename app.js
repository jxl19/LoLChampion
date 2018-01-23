var state = {
  URL: {
    youtube: 'https://www.googleapis.com/youtube/v3/search',
    server: "https://lolchampion.herokuapp.com/champion",
    skin: "https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion/"
  },
  splashImg: '',
  title: '',
  userInput: '',
}

function getDataFromServer(searchTerm, callback) {
  $.getJSON(state.URL.server, searchTerm, callback);
}
function getSkinData(searchTerm, callback) {
  searchTerm = searchTerm[0].toUpperCase() + searchTerm.slice(1);
  let link = state.URL.skin + searchTerm + ".json";
  $.getJSON(link, callback);
}
function getDataFromYoutubeApi(searchTerm, callback) {
  var query = {
    q: searchTerm,
    part: 'snippet',
    key: 'AIzaSyCLzHHWZfMw2w1o5g4OrfkatluyOunoOOc',
    channelId: 'UC0NwzCHb8Fg89eTB5eYX17Q',
    maxResults: 1,
  }
  $.getJSON(state.URL.youtube, query, callback);
}

function displayChampionSprite(obj) {
  let myObj = obj.champions[0].data;
  var grids = '';
  var arr = [];
  let newArr = [];
    for(var keys in myObj) {
      newArr.push(keys);
    }
    newArr = newArr.reverse();
    for(var i = 0; i < newArr.length; i++) {
        arr.push(newArr[i]);
        grids =
          '<div class = "col-xs-3 col-md-2 profile"><div class = panel-panel-default"><div class = panel-thumbnail"><img class = "sprite" value = "' + newArr[i] + '" src = "https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + newArr[i]+ '.png"></a></div></div><div class = championName>' + myObj[newArr[i]].name + '</div>';
        $('.character-grid-container').append(grids);
      }
}

function displayChampionCard(obj) {
  let myObj = obj.champions[0].data;
  let newArr=[];
  $('.cardContainer').empty();
  var stats = '';
  state.userInput = ($('.js-query').val().toLowerCase());
  for(var keys in myObj) {
    newArr.push(keys);
  }
  newArr = newArr.reverse();
  for(var i = 0; i < newArr.length; i++) {
    let info = myObj[newArr[i]];
    if(newArr[i].toLowerCase() === state.userInput){
      stats += '<div class = "clearfix card"><div class = "card-container col-xs-12 col-md-6"><img class ="card-img-top pull-left" src ="https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + newArr[i] + '.png"><div class = "card-block"><h3 class = "card-title">' + info.name + '</h3><h4 class = "card-text">' + info.title + '</h4><div class = "stats"><p class = "col-xs-6">Health: ' + info.stats.hp + ' (+' + info.stats.hpperlevel + ' per level)</p><p class = "col-xs-6">Attack Damage: ' + info.stats.attackdamage + ' (+' + info.stats.attackdamageperlevel + ' per level)</p><p class = "col-xs-6">Movement Speed: ' + info.stats.movespeed + '</p><p class = "col-xs-6">Health Regen: ' + info.stats.hpregen + ' (+' + info.stats.hpregenperlevel + ' per level)</p><p class = "col-xs-6">Armor: ' + info.stats.armor + ' (+' + info.stats.armorperlevel + ' per level)</p><p class = "col-xs-6">Magic Resist: ' + info.stats.spellblock + ' (+' + info.stats.spellblockperlevel + ' per level)</p></div></div></div><div class = "loreContainer col-xs-12 col-md-6"><h3 class = "loretitle">Lore</h3><h5>' + info.blurb + '</h5></div></div>';
    } 
    }
  $('.cardContainer').append(stats);
}

function displaySkinName(obj) { //using userinput to search for champion to display it's skins
  var cardElement = '';
  state.userInput = ($('.js-query').val().toLowerCase());
  for (var i in obj.data) {
      //started at 1 bc 0 is default skin
      for (var y = 1; y < obj.data[i].skins.length; y++) {
        cardElement +=
          '<div class = "col-md-3 col-xs-12 profile"><div class = "panel panel-default"><div class="panel-thumbnail"><a href= "#" title ="' + obj.data[i].skins[y].name + '" class ="thumb" value=' + y + '><img src = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + i + '_' + obj.data[i].skins[y].num + '.jpg" value =' + y + ' class = "img-responsive img-rounded splash" data-toggle ="modal" data-target = ".modal-profile-lg"></a></div><div class = "panel-body"><p class ="profile-name" value =' + y + '>' + obj.data[i].skins[y].name + '</p></div></div></div>';
      }
    }
  $('div.panels').html(cardElement);
}

function renderVideoResult(data) { //appending the embed youtube link into 'modal-body' 
  var resultElement = '';
  if (data.items) {
    data.items.forEach(function (item) {
      resultElement += '<div class="embed-responsive embed-responsive-16by9"><iframe class = "embed-responsive-item" src= https://youtube.com/embed/' + item.id.videoId + '></iframe></div>';
    });
  }
  else {
    resultElement += '<p>Sorry... nothing came up</p>';
  }
  $('.modal-body').html(resultElement);
}

function searchSkins(champName) { //use youtube api to search for videos
  getDataFromYoutubeApi(champName, renderVideoResult);
}

function playYoutubeModal(Video) { //searching for vid to put in modal
  var imgValue = $('.modal-content').find('.modal-body').find('img').attr('value');
  var title = ($('a[value="' + imgValue + '"]').attr('title'));
  var content = $('.modal-body');
  content.empty();
  searchSkins(title + " champion skin spotlight");
};

function renderModalContent(splashArt) { //show modal with content
  var content = $('.modal-body');
  content.empty();
  var title = splashArt.attr("title");
  $('.modal-title').html(title);
  content.html(splashArt.html());
  $('.modal-profile').modal({ show: true });
}

function changeImage(Controller) { //change images in modal
  var imgValue = parseInt($('.modal-content').find('.modal-body').find('img').attr('value'));
  var content = $('.modal-body');
  if (Controller.attr('class') == 'carousel-control left') {
    imgValue--;
    state.splashImg = $('a[value="' + imgValue + '"]').html();
    state.title = ($('a[value="' + imgValue + '"]').attr('title'));
    content.empty();
    $('.modal-title').html(state.title);
    $(content).html(state.splashImg);
  }
  else {
    imgValue++;
    state.splashImg = $('a[value="' + imgValue + '"]').html();
    state.title = ($('a[value="' + imgValue + '"]').attr('title'));
    content.empty();
    $('.modal-title').html(state.title);
    $(content).html(state.splashImg);
  }
}

function showJumbotron(input) { //show jumbotron when input empty
  if (!input.val()) {
    $('.splash').fadeOut(200, function () {
      $(this).hide();
    });
    $('.jumbotron').fadeIn(300, function () {
      $(this).show();
    });
    $('.championList').fadeIn(300, function () {
      $(this).show();
    });
  };
};

function watchSubmit() {
  $('.js-search-form').submit(function (e) {
    e.preventDefault();
    $('.championList').hide();
    $('h3').fadeIn(function () {
      $(this).show();
    });
    $('.jumbotron').fadeOut(200, function () {
      $(this).hide();
    });
    $('.splash').show();
    getSkinData(($('.js-query').val()), displaySkinName);
    getDataFromServer($(this).find('.js-query').val(), displayChampionCard);
  });
}

//we need to grab user input, find a champion with that name from the server, then serve it back to the function to serve to the client

//before we were grabbing on click directly to serve it since we have data

$('.js-search-form').on('keyup', '.js-query', function (e) {
  e.preventDefault();
  if (e.keyCode == 8) {
    showJumbotron($(this));
  }
});

$(".modal").on('hidden.bs.modal', function () { //remove src when modal hidden
  $(this).find('iframe').attr("src", '');
});

$('.modal-content').on('click', '.youtubeVid', function () { //access video
  playYoutubeModal($(this));
  $('a.carousel-control.left, .carousel-control.right').hide();
  $('.modal-footer').hide();
});

$('.panels').on('click', 'a.thumb', function (e) {
  e.preventDefault();
  $('.modal-footer').show();
  $('a.carousel-control.left, .carousel-control.right').show();
  renderModalContent($(this));
});

$('.modal-content').on('click', '.carousel-control', function (e) {
  e.preventDefault();
  changeImage($(this));
});

$('.navbar-brand').click(function (e) { //reload to loading page
  e.preventDefault();
  location.reload();
})

$('.championList').on('click', '.sprite', function (e) { //event listener for sprites on loading page
  var spriteValue = $(this).attr('value');
  $('.js-query').val(spriteValue);
  $('.championList').hide();
  $('h3').fadeIn(function () {
    $(this).show();
  });
  $('.jumbotron').fadeOut(200, function () {
    $(this).hide();
  });
  $('.splash').show();
  getSkinData(($('.js-query').val()), displaySkinName);
  getDataFromServer($(this).find('.js-query').val(), displayChampionCard);
});

$body = $("body");

$(document).on({
  ajaxStart: function () {
    $body.addClass("loading");
  },
  ajaxStop: function () {
    $body.removeClass("loading");
  }
});

function getJson(myid, callback) {
  // Set the headers
  var api_key = 'RGAPI-2ae7140c-6dc7-4da7-b6f1-91c94357fd41';
  var options = {
    url: `https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=format&dataById=false&api_key=${api_key}`,
    method: 'GET',
    json: true
  }

  // Start the request
  request(options, function (error, response, body) {
    ;
    if (!error && response.statusCode == 200) {
      callback(body);
    }
    else
      console.log("error:" + error);
  })
}

$(document).ready(function () {
  getDataFromServer(state.userInput, displayChampionSprite);
});

watchSubmit();