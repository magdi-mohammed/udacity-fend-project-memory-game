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

(function startGame() {
  // shuffle cards using shuffle function
  cards = shuffle(cards);

  /*
  ** loop through each card and create its HTML (ES06 amazing loop)
  ** add each card's HTML to the page
  */

  for (let card of cards){
  	$('.deck').append(card);
  }
})()

// this function loop through the cards and call another functions when click on any card of them
cards.each(function () {
  let $this = $(this);

  $this.on('click', function () {
    displaySymbol($this);
    // if open cads array has less than one index .. execute the function .. and stord a card
    if (openCardsArr.length < 1 && !$this.hasClass('match')) {
      openCards($this);
      // else if the array has an element check if the two cards are matched .. and the taget card isn't clicked before and it isn't the cad itself but another cad
    } else if (openCardsArr.length == 1 && !$this.hasClass('clicked') && !$this.hasClass('match')) {
      matchedOrNotmatchedCards($this);
    }

    // features functions
    if (!firstClick) {
      timer();
    }
    incrementMovecounter($this);
    decrementStars();
    winGame();
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


function  matchedOrNotmatchedCards(element) {
  // if condition checks if the openCardsArr is empty or not
  if (typeof openCardsArr !== 'undefined' && openCardsArr.length > 0) {
    let clickedElement = element;
    let openCardElement =  openCardsArr[openCardsArr.length - 1];
    let clickedClass = element.children().attr('class');
    let openCardClass = openCardsArr[openCardsArr.length - 1].children().attr('class');

      if (clickedClass === openCardClass) {

        clickedElement.removeClass('open show');
        clickedElement.addClass('match');

        openCardElement.removeClass('open show');
        openCardElement.addClass('match');

        // push the two matched cards into matched cards array to use them in the winGame function
        matchedCardsArr.push(clickedElement, openCardElement);

        resetOpenCards();

      } else if (clickedClass !== openCardClass) {
        window.setTimeout(function () {
          clickedElement.removeClass('open show');
          openCardElement.removeClass('open show');
        }, 250);

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

function timer() {
  firstClick = true;
  let seconds = 0;
  counter = setInterval(function () {
          seconds += 1;
      }, 1000);
}

// restart the game function
$('.restart').on('click', function () {
  window.location.reload()
});

// increment the move counter function

// this variable will be shown after wining the game
let move = 0;

function incrementMovecounter(element) {
  // this if condition to prevent the function from counting every clicked element .. an if i want to make it dosn't count the correct match as a move i should add this condition (if .. !element.hasClass('match'))
  if (!element.hasClass('clicked')) {
    move += 1;
    $('.moves').html(move);
  }
}

// decrement the stars counter function

// this variable will be shown after wining the game
let starsNumber = 3;

function decrementStars() {
  let firstStar = $('.star-one');
  let secondStar = $('.star-two');
  let LastStar = $('.star-three');

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
    window.setTimeout(function () {
      //stop the timer
      clearInterval(counter);
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

    }, 250);
  }
}
