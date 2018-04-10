/*
 * A list that holds all of my cards
 */

 let cards = $('.card');

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// for debug
// cards.addClass(' open show');

/*
///////////////////////////////////////
// start game self invoked function ***
///////////////////////////////////////
*/

function startGame() {
  // shuffle cards using shuffle function
  cards = shuffle(cards);

  /*
  ** loop through each card and create its HTML (ES06 amazing loop)
  ** add each card's HTML to the page
  */

  for (let card of cards){
  	$('.deck').append(card);
  }
}

startGame();

// reset game function
function resetGame() {

  // window.location.reload(); .. this is the easy way :D (refresh the page)

  // flib back all the cards
  if (cards.hasClass('match')) {
    cards.removeClass('match');
  }

  if (cards.hasClass('open')) {
    cards.removeClass('open');
  }

  if (cards.hasClass('show')) {
    cards.removeClass('show');
  }

  // re set the first element .. opening it .. and pushing it into the open cards array
  firstElement = cards.children(':eq(0)').parent('.card').addClass('open show clicked');
  openCardsArr = [firstElement];
  // reset the number of seconds to 0
  seconds = 0;
  clearInterval(counter);
  // reset the number of moves to 0
  move = 0
  $('.moves').html(move);
  // reset the number of stars to 3 and show full stars
  starsNumber = 3;
  firstStar.attr('class', 'star-one fa fa-star');
  secondStar.attr('class', 'star-two fa fa-star');
  LastStar.attr('class', 'star-three fa fa-star');
}

// this function loop through the cards and call another functions when click on any card of them
cards.each(function () {
  let $this = $(this);

  $this.on('click', function () {
    // if game is runing wait unitl it finishs
    if (!gameIsRunning) {
      // features functions
      if (!firstClick) {
        timer();
      }
      incrementMovecounter($this);
      decrementStars();

      // core functions
      displaySymbol($this);
      // if open cads array has less than one index .. execute the function .. and stord a card
      if (openCardsArr.length < 1 && !$this.hasClass('match')) {
        openCards($this);
        // else if the array has an element check if the two cards are matched .. and the taget card isn't clicked before and it isn't the cad itself but another cad
      } else if (openCardsArr.length == 1 && !$this.hasClass('clicked') && !$this.hasClass('match')) {
        matchedOrNotmatchedCards($this);
      }

      // after all of the core functions .. now check if all cards are matched .. * We can't check if they are matched until the game approach is ended :) *
      winGame();
    }
  });
});
// display the card symbol function

function displaySymbol(element) {
  // check if element has not match class .. because if the card is matched we don't need it again
  if (!element.hasClass('match')) {
    element.addClass('open show');
  }
}

// list of open cards
// firstElement is the random first open card , i used it to compare with the second element showen by click
let firstElement = $('.card.open.show');
let openCardsArr = [firstElement];

// open cards function which stores the open card from the first click then i use it to compare with the card which clicked secondly
function openCards(element) {
  openCardsArr.push(element);
  // check if element has not match class .. because if the card is matched we don't need it again
  if (!element.hasClass('match')) {
    element.addClass('clicked');
  }
}
// reset open cards function .. empty the array after every two cards flip .. and remove class clicked every two cards flip
function resetOpenCards() {
  openCardsArr = [];
  // if there is an element has class 'clicked' remove that class from that element
  if ($('.clicked').length) {
    $('.clicked').removeClass('clicked');
  }
}

let gameIsRunning = false;

function  matchedOrNotmatchedCards(element) {

  // (if condition) checks if : the openCardsArr is empty or not.. the game is running or not
  if (typeof openCardsArr !== 'undefined' && openCardsArr.length > 0) {

    gameIsRunning = true;

    let clickedElement = element;
    let openCardElement =  openCardsArr[openCardsArr.length - 1];
    let clickedClass = element.children().attr('class');
    let openCardClass = openCardsArr[openCardsArr.length - 1].children().attr('class');

      if (clickedClass === openCardClass) {
        // lock the cards
        clickedElement.removeClass('open show');
        clickedElement.addClass('match');

        openCardElement.removeClass('open show');
        openCardElement.addClass('match');

        // animate the two cards
        clickedElement.addClass('animated rubberBand');
        openCardElement.addClass('animated rubberBand');

        // remove animate class from the two cards after 1 second .. and end the game runing status
        setTimeout(function () {
          clickedElement.removeClass('animated rubberBand');
          openCardElement.removeClass('animated rubberBand');

          gameIsRunning = false;

        }, 1000);

        // push the two matched cards into matched cards array to use them in the winGame function
        matchedCardsArr.push(clickedElement, openCardElement);

        resetOpenCards();

      } else if (clickedClass !== openCardClass) {

        // animate the two cards
        clickedElement.addClass('animated wobble');
        openCardElement.addClass('animated wobble');
        // waint 1 second and : flip the card .. clear animate end the game runing status
        window.setTimeout(function () {
          // flip back the cards
          clickedElement.removeClass('open show');
          openCardElement.removeClass('open show');

          // remove animate class from the two cards
          clickedElement.removeClass('animated wobble');
          openCardElement.removeClass('animated wobble');

          gameIsRunning = false;

        }, 1000);

        resetOpenCards();

      }
  }
}

/*
/////////////////////
// Some features ***
/////////////////////
*/

// timer function .. count seconds from the game start to the end
let firstClick = false;
let counter;
let seconds = 0;

function timer() {
  firstClick = true;
  counter = setInterval(function () {
          seconds += 1;
      }, 1000);
}

// increment the move counter function

// this variable will be shown after wining the game
let move = 0;

function incrementMovecounter(element) {
  // this if condition to prevent the function from counting every clicked element
  if (!element.hasClass('clicked') && !element.hasClass('match')) {
    move += 1;
    $('.moves').html(move);
  }
}

// decrement the stars counter function

// this variable will be shown after wining the game
let starsNumber = 3;
// html indexed stars
let firstStar = $('.star-one');
let secondStar = $('.star-two');
let LastStar = $('.star-three');

function decrementStars() {
  // change the stat icon with an empty star

  // two stars
  if (move == 11) {
    starsNumber = 2;
    LastStar.attr('class', 'star-three fa fa-star-o');
  }
  // one star
  if (move == 16) {
    starsNumber = 1;
    secondStar.attr('class', 'star-two fa fa-star-o');
  }
  // zero
  if (move == 18) {
    starsNumber = 0;
    firstStar.attr('class', 'star-one fa fa-star-o');
  }
}

// win game function
let matchedCardsArr = [];
function winGame() {
  // if all cards are matched
  if (matchedCardsArr.length === 16) {

    //stop the timer immediately
    clearInterval(counter);

    // wait one second after the game runing status is false  .. which means : there is no matching function is runings and no animations ...
    window.setTimeout(function () {
      // show the message section
      $('#win-message-section').css({opacity: 1, visibility: 'visible'});
      // animate the svg
      $('.righ-mark').addClass('drawn');
      // animate the rest of elements
      $('.fade-out').addClass('fade-in');

      // show the game info :
      // number of moves
      $('#moves-number').text(move);
      // number of stars
      if (starsNumber === 1) {
        $('#stars-info').text(starsNumber + ' star');
      } else {
        $('#stars-info').text(starsNumber + ' stars');
      }

      // number of seconds
      if (seconds === 1) {
        $('#seconds-info').text(seconds + ' second');
      } else {
        $('#seconds-info').text(seconds + ' seconds');
      }

    }, 1000);
  }
}

// restart the game function
$('.restart').on('click', function () {
  // window.location.reload(); .. this is the easy way :D (refresh the page)
  resetGame();
  startGame();
});

// play again function
$('#play-again').on('click', function () {

  // for debug
  window.console.log('win');

  resetGame();
  startGame();

  // hide the message section
  $('#win-message-section').css({opacity: 0, visibility: 'hidden'});
  // animate the svg
  $('.righ-mark').removeClass('drawn');
  // animate the rest of elements
  $('.fade-out').removeClass('fade-in');
});
