var state = {
  URL: {
    league: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion",
    youtube: 'https://www.googleapis.com/youtube/v3/search',
  },
  splashImg: '',
  title: '',
  userInput: '',
}

function getDataFromLeagueApi(searchTerm, callback) {
  var query = {
    champData: 'skins,lore,blurb,info,stats,image',
    api_key: 'RGAPI-b2ae3075-552d-4b32-bcd3-7523ec3fe407',
  }
  $.getJSON(state.URL.league, query, callback);
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

function firstLetterUppercase(str) { //function to split input and uppercase the first letter of each string
  var splitStr = str.toLowerCase().split(' ');
  var arr = [];
  for (i = 0; i < splitStr.length; i++) {
    arr.push(splitStr[i].charAt(0).toUpperCase() + splitStr[i].slice(1));
  }
  return arr.join(' ');
}

function displayChampionCard(obj) {
  $('.cardContainer').empty();
  var stats = '';
  state.userInput = firstLetterUppercase($('.js-query').val());
  for (var i in obj.data) {
    if (obj.data[i].name === state.userInput) {
      stats += '<div class = "clearfix card"><div class = "hold col-xs-6"><img class ="card-img-top pull-left" src ="http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + obj.data[i].key + '.png"><div class = "card-block"><h4 class = "card-title">' + obj.data[i].name + '</h4><p class = "card-text">' + obj.data[i].title + '</p><div class = "underneath"><p class = "col-xs-6">Health: ' + obj.data[i].stats.hp + ' (+' + obj.data[i].stats.hpperlevel + ' per level)</p><p class = "col-xs-6">Attack Damage: ' + obj.data[i].stats.attackdamage + ' (+' + obj.data[i].stats.attackdamageperlevel + ' per level)</p><p class = "col-xs-6">Movement Speed: ' + obj.data[i].stats.movespeed + '</p><p class = "col-xs-6">Health Regen: ' + obj.data[i].stats.hpregen + ' (+' + obj.data[i].stats.hpregenperlevel + ' per level)</p><p class = "col-xs-6">Armor: ' + obj.data[i].stats.armor + ' (+' + obj.data[i].stats.armorperlevel + ' per level)</p><p class = "col-xs-6">Magic Resist: ' + obj.data[i].stats.spellblock + ' (+' + obj.data[i].stats.spellblockperlevel + ' per level)</p></div></div></div><div class = "loreContainer"><h6 class="col-xs-6">' + obj.data[i].lore + '</h6></div></div>';
    }
  }
  $('.cardContainer').append(stats);
}

function displayChampionSprite(obj) {
  var grids = '';
  for (var i in obj.data) {
    if (i === 'Fiddlesticks'){
       obj.data[i].key = obj.data[i].key.replace('s','S');
    };
    grids =
      '<div class = "col-xs-3 col-md-2 profile"><div class = panel-panel-default"><div class = panel-thumbnail"><img class = "sprite" value = "' + obj.data[i].name + '" src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + obj.data[i].key + '.png"></a></div></div><div class = championName>' + obj.data[i].name + '</div>';
    $('.character-grid-container').append(grids);
  }
}
//fix kogmaw search and other names with comma -- add a or for the condition for commas

function displaySkinName(obj) { //using userinput to search for champion to display it's skins
  var cardElement = '';
  // var stats = '';
  state.userInput = firstLetterUppercase($('.js-query').val());
  for (var i in obj.data) {
    if (obj.data[i].name === state.userInput) {
      for (var y = 1; y < obj.data[i].skins.length; y++) {
        cardElement +=
          '<div class = "col-md-3 col-xs-12 profile"><div class = "panel panel-default"><div class="panel-thumbnail"><a href= "#" title ="' + obj.data[i].skins[y].name + '" class ="thumb" value=' + y + '><img src = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + obj.data[i].key + '_' + obj.data[i].skins[y].num + '.jpg" value =' + y + ' class = "img-responsive img-rounded splash" data-toggle ="modal" data-target = ".modal-profile-lg"></a></div><div class = "panel-body"><p class ="profile-name" value =' + y + '>' + obj.data[i].skins[y].name + '</p></div></div></div>';
      }
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
    state.userInput = $('.js-query').val();
    getDataFromLeagueApi($(this).find('.js-query').val(), displaySkinName);
    getDataFromLeagueApi($(this).find('.js-query').val(), displayChampionCard);
  });
}

$('.js-search-form').on('keyup', '.js-query', function (e) {
  e.preventDefault();
  $('.cardContainer').empty();
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

$('.navbar-brand').click(function (e) {
  e.preventDefault();
  location.reload();
})

$('.championList').on('click', '.sprite', function (e) {
  console.log('champ clicked');
  console.log($(this).attr('value'));
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
  getDataFromLeagueApi($(this).find('.js-query').val(), displaySkinName);
  getDataFromLeagueApi($(this).find('.js-query').val(), displayChampionCard);
});

watchSubmit();

$(document).ready(function () {
  getDataFromLeagueApi(state.userInput, displayChampionSprite);
});