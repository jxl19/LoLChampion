var state = {
  URL: {
    league: "https://na1.api.riotgames.com/lol/static-data/v3/champions",
    youtube: 'https://www.googleapis.com/youtube/v3/search',
  },
  splashImg: '',
  title: '',
  userInput: '',
}

//rate limit exceeded

function getDataFromLeagueApi(searchTerm, callback) {
  var query = {
    locale: 'en_US',
    tags: 'all',
    dataById: 'false',
    api_key: 'RGAPI-c233c6c9-e2f5-40c0-8870-342287c7ab8e',
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

function displayChampionSprite(obj) {
  var grids = '';
  var arr = [];
  for (var i in obj.data) {
    if (i === 'Fiddlesticks') {
      obj.data[i].key = obj.data[i].key.replace('s', 'S');
    };
    arr.push(obj.data[i].name);
    arr.sort;
    grids =
      '<div class = "col-xs-3 col-md-2 profile"><div class = panel-panel-default"><div class = panel-thumbnail"><img class = "sprite" value = "' + obj.data[i].name + '" src = "https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + obj.data[i].key + '.png"></a></div></div><div class = championName>' + obj.data[i].name + '</div>';
    $('.character-grid-container').append(grids);
  }
}

function displayChampionCard(obj) {
  $('.cardContainer').empty();
  var stats = '';
  state.userInput = ($('.js-query').val().toLowerCase());
  for (var i in obj.data) {
    if (obj.data[i].name.toLowerCase() === state.userInput || obj.data[i].key.toLowerCase() === state.userInput) {
      stats += '<div class = "clearfix card"><div class = "card-container col-xs-12 col-md-6"><img class ="card-img-top pull-left" src ="https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + obj.data[i].key + '.png"><div class = "card-block"><h3 class = "card-title">' + obj.data[i].name + '</h3><h4 class = "card-text">' + obj.data[i].title + '</h4><div class = "stats"><p class = "col-xs-6">Health: ' + obj.data[i].stats.hp + ' (+' + obj.data[i].stats.hpperlevel + ' per level)</p><p class = "col-xs-6">Attack Damage: ' + obj.data[i].stats.attackdamage + ' (+' + obj.data[i].stats.attackdamageperlevel + ' per level)</p><p class = "col-xs-6">Movement Speed: ' + obj.data[i].stats.movespeed + '</p><p class = "col-xs-6">Health Regen: ' + obj.data[i].stats.hpregen + ' (+' + obj.data[i].stats.hpregenperlevel + ' per level)</p><p class = "col-xs-6">Armor: ' + obj.data[i].stats.armor + ' (+' + obj.data[i].stats.armorperlevel + ' per level)</p><p class = "col-xs-6">Magic Resist: ' + obj.data[i].stats.spellblock + ' (+' + obj.data[i].stats.spellblockperlevel + ' per level)</p></div></div></div><div class = "loreContainer col-xs-12 col-md-6"><h3 class = "loretitle">Lore</h3><h5>' + obj.data[i].lore + '</h5></div></div>';
    }
  }
  $('.cardContainer').append(stats);
}

function displaySkinName(obj) { //using userinput to search for champion to display it's skins
  var cardElement = '';
  state.userInput = ($('.js-query').val().toLowerCase());
  for (var i in obj.data) {
    if (obj.data[i].name.toLowerCase() === state.userInput || obj.data[i].key.toLowerCase() === state.userInput) {
      for (var y = 1; y < obj.data[i].skins.length; y++) {
        cardElement +=
          '<div class = "col-md-3 col-xs-12 profile"><div class = "panel panel-default"><div class="panel-thumbnail"><a href= "#" title ="' + obj.data[i].skins[y].name + '" class ="thumb" value=' + y + '><img src = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + obj.data[i].key + '_' + obj.data[i].skins[y].num + '.jpg" value =' + y + ' class = "img-responsive img-rounded splash" data-toggle ="modal" data-target = ".modal-profile-lg"></a></div><div class = "panel-body"><p class ="profile-name" value =' + y + '>' + obj.data[i].skins[y].name + '</p></div></div></div>';
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
    getDataFromLeagueApi($(this).find('.js-query').val(), displaySkinName);
    getDataFromLeagueApi($(this).find('.js-query').val(), displayChampionCard);
  });
}

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
  getDataFromLeagueApi($(this).find('.js-query').val(), displaySkinName);
  getDataFromLeagueApi($(this).find('.js-query').val(), displayChampionCard);
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

$(document).ready(function () {
  getDataFromLeagueApi(state.userInput, displayChampionSprite);
});

watchSubmit();