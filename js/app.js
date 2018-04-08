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

// shuffle cards using shuffle function
cards = shuffle(cards);

/*
** loop through each card and create its HTML (ES06 amazing loop)
** add each card's HTML to the page
*/
for (let card of cards){
	$('.deck').append(card);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

cards.each(function () {
  $(this).on('click', function () {
    displaySymbol($(this));
    openCards($(this));
    matchedCards($(this));
  });
});
// display the card symbol function
function displaySymbol(element) {
  element.addClass('open show');
}

// list of open cards
// firstElement is the random first open card , i used it to compare with the second element showen by click
let firstElement = $('.card.open.show');
let openCardsArr = [firstElement];

function openCards(element) {
  openCardsArr.push(element);
}

/*
// to do :  بلفيه مشكلة في الفانكشن دي .. مفروض لما ادوس علي كارت يقارنه بالكارت ال دوست عليه قبله و لو  مطلعش زيه يعيد الفانكشن من الاول بحييث يقارن بين ال دوست عليه بعد م الفانكشن اشتغلت من الوال مش آخر واحد دوست عليه وخلا
*/

// if the open cards array has another open card .. check of the two cards is matched
function matchedCards(element) {
  // if condition checks if the openCardsArr is empty or not
  if (typeof openCardsArr !== 'undefined' && openCardsArr.length > 0) {
    let clickedElement = element;
    let openCardElement =  openCardsArr[openCardsArr.length - 2];
    let clickedClass = element.children().attr('class');
    let openCardClass = openCardsArr[openCardsArr.length - 2].children().attr('class');

      if (clickedClass === openCardClass) {
        window.console.log('matched');

        clickedElement.removeClass('open show');
        clickedElement.addClass('match');

        openCardElement.removeClass('open show');
        openCardElement.addClass('match');

      } else if (clickedClass !== openCardClass) {
        window.console.log('Dosn\'t match');
        clickedElement.removeClass('open show');
        openCardElement.removeClass('open show');
      }
  }
}
