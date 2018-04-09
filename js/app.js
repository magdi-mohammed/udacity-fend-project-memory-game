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

  $('.deck').innerHtml = '';

  /*
  ** loop through each card and create its HTML (ES06 amazing loop)
  ** add each card's HTML to the page
  */
  for (let card of cards){
  	$('.deck').append(card);
  }
})()

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionat slity in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// this function loop through the cards and call another functions when click on any card of them
cards.each(function () {
  $(this).on('click', function () {
    displaySymbol($(this));
    // if open cads array has less than one index .. execute the function .. and stord a card
    if (openCardsArr.length < 1) {
      openCards($(this));
      // else if the array has an element check if the two cards are matched .. and the taget card isn't clicked before and it isn't the cad itself but another cad
    } else if (openCardsArr.length == 1 && !$(this).hasClass('clicked')) {
      matchedOrNotmatchedCards($(this));
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

        resetOpenCards();

      } else if (clickedClass !== openCardClass) {
        window.setTimeout(function () {
          clickedElement.removeClass('open show');
          openCardElement.removeClass('open show');
        }, 250);

        if ($('.clicked').length) {
          $('.clicked').removeClass('clicked');
        }
        resetOpenCards();

      }
  }
}

/*
/////////////////////
// Some features ***
/////////////////////
*/

// restart the game function
$('.restart').on('click', function () {
  window.location.reload()
});
