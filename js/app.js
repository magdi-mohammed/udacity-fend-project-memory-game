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

// for debug .. show all cards at once
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

  // after cards are shuffled and added to the html now show them all for a little time them hide them all
  showAllCards();

}

startGame();

// reset game function
function resetGame() {

  // window.location.reload(); .. this is the easy way :D (refresh the page)

  // flib back all the cards

  if (cards.hasClass('clicked')) {
    cards.removeClass('clicked');
  }

  if (cards.hasClass('open')) {
    cards.removeClass('open');
  }

  if (cards.hasClass('show')) {
    cards.removeClass('show');
  }

  if (cards.hasClass('match')) {
    cards.removeClass('match');
  }

  if (cards.hasClass('flipInY')) {
    cards.removeClass('flipInY');
  }

  // reset matched cards array
  matchedCardsArr = [];
  // reset open cards array
  openCardsArr = [];
  // reset the number of seconds to 0 .. stop the timer .. reset timer status (first click (true/false))
  seconds = 0;
  clearInterval(counter);
  $('#time-info').html('00 : 00');
  // reset the first click status
  firstClick = false; // to run the timer again
  // reset the number of moves to 0
  move = 0
  $('.moves').html(move);
  // reset the number of stars to 3 and show full stars
  starsNumber = 3;
  secondStar.attr('class', 'star-two fa fa-star');
  LastStar.attr('class', 'star-three fa fa-star');

  // reset the play status
  play = false;
}

// after cards are shuffled and added to the html now show them all for a little time them hide them all
let play = false;
function showAllCards() {
  // wait a little time then show the cards for performance
  setTimeout(function () {
    // open, show and flip all the cards
    cards.addClass('open show flipInY');

   setTimeout(function () {
     // on animation end remove animation class
     cards.removeClass('flipInY');

     setTimeout(function () {
       // flip back all the cards and close them .. with an animation
       cards.removeClass('open show');
       cards.addClass('flipInY');
       setTimeout(function () {
         // on animation end remove animation class
         cards.removeClass('flipInY');
         play = true;
       }, 320);

     }, 1020);

   }, 320);

  }, 250);
}

// this function loop through the cards and call another functions when click on any card of them
cards.each(function () {
  // cache $(this) in a variable to improve performance .. don't call it many times just once
  let $this = $(this);

  $this.on('click', function () {

    if (play) {
      // features function
      if (!firstClick) {
        timer();
      }

      // if game is runing wait unitl it finishs
      if (!gameIsRunning) {
        // core functions
        displaySymbol($this);
        // if open cads array has less than one index .. execute the function .. and stord a card
        if (openCardsArr.length < 1 && !$this.hasClass('match')) {
          openCards($this);
          // else if the array has an element check if the two cards are matched .. and the taget card isn't clicked before and it isn't the cad itself but another cad
        } else if (openCardsArr.length == 1 && !$this.hasClass('clicked') && !$this.hasClass('match')) {
          // set the (game is runing ?) status to true
          gameIsRunning = true;
          // features functions
          incrementMovecounter($this);
          decrementStars();

          setTimeout(function() {
            // core function
            matchedOrNotmatchedCards($this);

          }, 320);
        }
      }
    }

  });
});
// display the card symbol function

function displaySymbol(element) {
  // check if element has not match class .. because if the card is matched we don't need it again
  if (!element.hasClass('show') && !element.hasClass('match')) {
    element.addClass('open show flipInY');
  }

  setTimeout(function () {
    // remove flipInY class from the two cards
    element.removeClass('flipInY');
  }, 320);

}

// list of open cards

let openCardsArr = [];
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

    let clickedElement = element;
    let openCardElement =  openCardsArr[openCardsArr.length - 1];
    let clickedClass = element.children().attr('class');
    let openCardClass = openCardsArr[openCardsArr.length - 1].children().attr('class');

      // if the two cards are matched
      if (clickedClass === openCardClass) {
        // lock the cards
        clickedElement.removeClass('open show');
        clickedElement.addClass('match');

        openCardElement.removeClass('open show');
        openCardElement.addClass('match');

        // animate the two cards
        clickedElement.addClass('rubberBand');
        openCardElement.addClass('rubberBand');

        // remove animate class from the two cards after 1 second
        setTimeout(function () {
          clickedElement.removeClass('rubberBand');
          openCardElement.removeClass('rubberBand');

          // push the two matched cards into matched cards array to use them in the winGame function
          matchedCardsArr.push(clickedElement, openCardElement);

          /*
          ////////////////////
          // core function
          ///////////////////
          */

          // after all of the core functions .. now check if all cards are matched .. * We can't check if they are matched until the game approach is ended :) *
          winGame();

          // empty the open cards array
          resetOpenCards();
          // reset game status
          gameIsRunning = false;

        }, 1020);

      } else if (clickedClass !== openCardClass) {

        // animate the two cards
        clickedElement.addClass('wobble wrong-answer');
        openCardElement.addClass('wobble wrong-answer');

        // waint 1 second and : flip the card .. clear animate end the game runing status
        window.setTimeout(function () {

            // flip back the cards
            clickedElement.removeClass('wobble open show wrong-answer');
            openCardElement.removeClass('wobble open show wrong-answer');

            clickedElement.addClass('flipInY');
            openCardElement.addClass('flipInY');

            setTimeout(function () {
              clickedElement.removeClass('flipInY');
              openCardElement.removeClass('flipInY');
            }, 1020);

            resetOpenCards();
            gameIsRunning = false;

        }, 1020);

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
let second = 0;
let minute = 0;

function timer() {
  firstClick = true;
  counter = setInterval(function () {
          seconds += 1;

          second = (seconds % 60);
          minute = parseInt(seconds / 60);

          // if second < 10 add a 0 before the seconds
          if (second < 10) {
            second = `0${(seconds % 60)}`;
          }

          // if minutes < 10 add a 0 before the minutes
          if (minute < 10) {
            minute = `0${parseInt(seconds / 60)}`;
          }

          $('#time-info').html(`${minute} : ${second}`);

      }, 1000);
}

// increment the move counter function

// this variable will be shown after wining the game
let move = 0;

function incrementMovecounter(element) {
  // this if condition to prevent the function from counting every clicked element
  if (!element.hasClass('clicked')) {
    move += 1;
    $('.moves').html(move);
  }
}

// decrement the stars counter function

// this variable will be shown after wining the game
let starsNumber = 3;
// html indexed stars
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
      let minuteTxt = 'minutes';
      let secondTxt = 'seconds';

      if (second === '01') {
        secondTxt = 'second';
      }

      if (minute === '01') {
        minuteTxt = 'minute';
      }

      $('#seconds-info').text(`${minute} ${minuteTxt} and ${second} ${secondTxt}`);

    }, 1000);
  }
}

// restart the game function
$('#restart').on('click', function () {
  // window.location.reload(); .. this is the easy way :D (refresh the page)
  resetGame();
  startGame();
});

// play again function
$('#play-again').on('click', function () {

  resetGame();
  startGame();

  // hide the message section
  $('#win-message-section').css({opacity: 0, visibility: 'hidden'});
  // animate the svg
  $('.righ-mark').removeClass('drawn');
  // animate the rest of elements
  $('.fade-out').removeClass('fade-in');
});
