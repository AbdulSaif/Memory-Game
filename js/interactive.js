/*
 All game variables are stored here
 */
/*a list the stores cards deck of 16 cards that have 2 copies of 8
different cards */
var cardsDeck = ["red", "red", "blue", "blue", "yellow", "yellow", "green"
, "green", "white", "white", "black", "black", "orange", "orange", "grey"
, "grey"];
// a list that will be used to store the cards HTML
var cardsDeckHtml = [];
// an empty list that will be used to temperarly store flipped cards
var clickedList = [];
/* an empty list that will be used to temperarly store flipped cards
index and selector*/
var clickedIndexSelector = [];
// a variable that stores the score of the player
var score = 5;
// a counter for the number of clikcs a user makes
var movesCounter = 0;
/* time variables to be used in the stopwatch in the game-statistics
section of HTML*/
var sec = 0, min = 0;
var time = "0" + min + ":0" + sec;

/*
  The foundation of the game engine that holds all the functions used
  in Memory game
 */

/* Shuffle function from http://stackoverflow.com/a/2450976 to shuffle
and randomize cards position - input is array */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/* a function that loop through each card and create its HTML - takes
array as input and outputs array */
function createHtml (array) {
  var index = 0;
  var arrayHtml = [];
  while (index < array.length) {
    arrayHtml[index] = "<li class=\"card\"><i class=\"" + array[index] + "\"></i></li>";
    index += 1;
  }
  return arrayHtml;
}

/*a function that manipulate HTML DOM by adding whats contained in a
list - input is HTML selector and a list */
function manipulateHtmlDom (selector,list) {
  var index = 0;
  var hiddenCard = [];
  while (index < list.length) {
    hiddenCard[index] = list[index];
    selector.append(hiddenCard[index]);
    index += 1;
  };
}

// a function that shows the card symbol when the user clikcs on them
function showCardSymbol() {
  $('.card').click(function() {
    $(this).toggleClass("flipped");
    $(this).children().toggle();
  });
}

// stores clicked cards class names in a list
function addToList() {
  $(".card").click(function() {
    var clickCard = ($(this).children().attr("class"));
    var index = $(this).index();
    var nthChild = index + 1;
    var selector = ".cards-deck li:nth-child(" + nthChild + ")";
    clickedList.push(clickCard);
    clickedIndexSelector.push(selector);
  });
}

// A function that checks if the user clicks same card twice or not
function sameCard() {
    if (clickedIndexSelector[0] === clickedIndexSelector[1]) {
      clickedList = [];
      clickedIndexSelector = [];
      return true;
    };
}

// A function that locks the flipped cards so they cannot be cliked
function lockMatch() {
  $(clickedIndexSelector[0]).removeClass("card").addClass("matched");
  $(".matched").unbind("click");
  $(clickedIndexSelector[1]).removeClass("card").addClass("matched");
  $(".matched").unbind("click");
  clickedList = [];
  clickedIndexSelector = [];
}

// A function that hides the flipped cards
function hideNoMatch() {
  for (var i = 0; i < clickedIndexSelector.length; i += 1) {
    $(clickedIndexSelector[i]).toggleClass("flipped unmatch");
    $(clickedIndexSelector[i]).children().toggle();
  };
  clickedList = [];
  clickedIndexSelector = [];
}

/* checks if the flipped cards stored in clickedList match or not, if
match cards are locked if no they are flipped back */
function checkMatch() {
  $(".card").click(function(){
    if (clickedList.length === 2) {
      lockcards();
      if (sameCard()) {
        movesCounter += 1;
        unlockcards();
        return;
      }
      else if (clickedList[0] === clickedList[1]) {
        movesCounter += 1;
        lockMatch();
        } else {
          movesCounter += 1;
          for (var i = 0; i <clickedIndexSelector.length; i += 1) {
            $(clickedIndexSelector[i]).toggleClass("unmatch");
          }
          setTimeout(hideNoMatch,1000);
      }
      setTimeout(unlockcards,1000);
    };
  });
}

// a function that locks other cards when two are flipped
function lockcards() {
  $(".card").unbind("click");
}

// a function that unlocks other cards when two are flipped back
function unlockcards() {
  $(".card").bind("click",interact());
}

/* A function that display a conguratilations message stating score of
the player */
function congrats() {
    if (confirm("Excellent you won!! You Ended the Memory Game in " + min + " minutes and " + sec + " seconds with " + movesCounter + " moves and a score of " + score + " stars!!\nDo you want to play again to improve your timing or score ?")) {
        window.open("game.html");
    } else {
        window.close("game.html","Thank you for playing have a good day :)");
    }
}


/* A function that checks if a player has successfully matched all
cards and display a conguratilations message */
function endGame() {
  $(".card").click(function(){
    var index = 1;
    while (index < 17) {
      if ($(".cards-deck li:nth-child(" + index +")").attr("class") === "card") {
        return "EXIT";
      }
      index += 1;
    }
    pauseTime();
    setTimeout(congrats,1000);
  });
}

/* A function that update the number clicks a user makes and add to
HTML*/
function updatemovesCounter() {
  $(".card").click(function(){
    $(".clicks i").text("     " + movesCounter);
  });
}

// A function that creates a stopwatch
function updateTime() {
  sec += 1;
  if (sec === 60) {
    min += 1;
    sec = 0;
  }
  if (sec < 10 && min < 10) {
    time = "0" + min + ":0" + sec;
  } else if (sec < 10 && min > 9) {
    time = min + ":0" + sec;
  } else if (sec > 9 && min < 10) {
    time = "0" + min + ":" + sec;
  } else {
    time = min + ":" + sec;
  }
  $(".time i").text("     " + time);
  time=setTimeout("updateTime()",1000);
}

// A function that pause/stop the stopwatch
function pauseTime() {
  clearTimeout(time);
}

/* A function that create/update a stopwatch and add it to the game-
statistics section of HTML */
function stopwatch() {
  $(".time i").text("     " + time);
  updateTime();
}

/* A function that update the score in the game-statistics section of
HTML as the player plays the game */
function updateScore() {
  $(".card").click(function(){
    switch(movesCounter) {
      case 24:
        $(".score li:nth-child(2)").css("color", "white");
        return;
      case 12:
        $(".score li:nth-child(1)").css("color", "white");
        return;
      default:
        return;
    }
  });
}

// A function that calculates the score of the player
function scoreCalculator() {
  $(".card").click(function(){
    if (11 < movesCounter && movesCounter < 24) {
      score = 2;
    } else if (movesCounter > 23) {
      score = 1;
    }
  });
}

// A function that sets the clicks counter to zero
function setClicksToZero() {
  $(".clicks i").empty();
  $(".clicks i").text("     " + movesCounter);
}

// A function that sets the score to 5 stars again
function setScoreToFive() {
  $(".score").empty();
  var star = "<li><i class=\"fa fa-star\"></i></li>";
  for(var i = 0; i < 5; i += 1) {
    $(".score").append(star);
  };
}

/* A function that sets the pause-play button to play and start the
time if the game is paused and restart button is clicked */
function restartPausePlay() {
  if (($(".pause-play i").attr("class")==="fa fa-play-circle-o")) {
    $(".pause-play i").removeClass("fa fa-play-circle-o").addClass("fa fa-pause-circle-o");
    stopwatch();
  };
}

// A function that restart the game
function restart() {
  $(".restart").click(function() {
    // initialise all variables and set their values to original state
    cardsDeckHtml = [];
    clickedList = [];
    clickedIndexSelector = [];
    score = 5;
    movesCounter = 0;
    sec = 0, min = 0;
    // removing old cards deck
    $(".cards-deck").empty();
    // setting clicks counter to zero
    setClicksToZero();
    // setting score to 5 stars
    setScoreToFive();
    // setting the pausePlay button to play
    restartPausePlay();
    /* new game is restarted after creating new cards deck, clicks
    counter set to zero and score to 5 stars */
    startGame();
  });
}

// A function that pause the game
function pausePlay() {
  $(".pause-play").click(function() {
    if ($(".pause-play i").attr("class") === "fa fa-pause-circle-o") {
      $(".card").unbind("click");
      $(".pause-play i").removeClass("fa fa-pause-circle-o").addClass("fa fa-play-circle-o");
      pauseTime(time);
    } else {
      $(".pause-play i").removeClass("fa fa-play-circle-o").addClass("fa fa-pause-circle-o");
      $(".card").bind("click",interact());
      stopwatch();
    }
  });
}

// A function that holds all interaction functions in the game
function interact() {
  //display the card's symbol once its clicked
  $('.card').click(showCardSymbol());
  //add the card to "clickedList" of open cards
  $(".card").click(addToList());
  /* if two cards are flipped, they are checked. if they match they are
  locked if not they are fipped back */
  $(".card").click(checkMatch());
  /* Display the movesCounter in the game-statistics section of the
  HTML next to the mouse pointer */
  $(".clicks i").text("     " + movesCounter);
  //update the movesCounter and display it on the page
  $(".card").click(updatemovesCounter());
  /* calculating the score and update it in game-statistics section of
  the HTML */
  $(".card").click(scoreCalculator());
  $(".card").click(updateScore());
  //if all cards have matched, display a message with the final score
  $(".card").click(endGame());
}

// A function that start the game
function startGame() {
  // Display the cards on the page
  // shuffle the cards deck to randomize the cards position
  cardsDeck = shuffle(cardsDeck);
  // loop through each card and create its HTML
  cardsDeckHtml = createHtml(cardsDeck);
  // add each card's HTML to the page and hide the card
  manipulateHtmlDom($('.cards-deck'),cardsDeckHtml);
  $('.card i').toggle();
  // allow user to interact with the game
  interact();
}

/* End of foundation of the game engine that holds all the functions
used in Memory game section */

// Starting the game
startGame();
// starting a stopwatch as soon as user perform first click
stopwatch();
// restart game when restart icon is clicked
$(".restart").click(restart());
// pause-play the game when the pause-play icons are clicked
$(".pause-play").click(pausePlay());
