import {Map, List} from 'immutable';

export function createDeck() {
  const deck = [];
  const suits = ['diamonds', 'hearts', 'clubs', 'spades'];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push(Map({
        suit: suit,
        value: value
      }));
    });
  });

  return deck;
}

export function setDeck(state, deck) {
  return state.set('deck', List(deck));
}

export function shuffle(state) {
  const deck = state.get('deck');
  return state.update('deck', () => deck.sort(() => Math.random()));
}

export function drawFromStock(state, player) {
  const deck = state.get('deck');
  const isFirstTurn = !state.hasIn(['hands', player]);

  const nextState = state.updateIn(
    ['hands', player],
    deck.take(9),
    hand => hand.push(deck.take(1))
  );

  if (isFirstTurn) {
    return nextState.update('deck', () => deck.skip(10));
  } else {
    return nextState.update('deck', () => deck.rest());
  }
}

export function pickCard(state, player, cardPosition) {
  const pickedCard = state.getIn(['hands', player, cardPosition]);
  const newState = setPicked(state, pickedCard);
  return newState.updateIn(
      ['hands', player],
      List(),
      hand => hand.delete(cardPosition)
  );
}

export function playPicked(state, player) {
  const picked = sortListByValue(state.get('picked'));
  const newState = state.delete('picked');

  if (isValidMeld(picked)) {
    const meld = Map({
      cards: picked,
      type: isSet(picked) ? 'set' : 'run'
    });

    return newState.updateIn(
      ['melds', player],
      List(),
      melds => melds.push(meld)
    );
  }

  return newState;
}

/*******************************
        Private Methods
********************************/

function setPicked(state, card) {
  return state.update(
    'picked',
    List(),
    pickedCards => pickedCards.push(card)
  );
}

function isValidMeld(picked) {
  if (picked.size >= 3) {
    return isSet(picked) || isRun(picked);
  }

  return false;
}

function isSet(picked) {
  const cards = picked.toArray();
  var setValue = cards[0].get('value');
  for (var i = 1; i < cards.length; i++) {
    if (cards[i].get('value') !== setValue) { return false; }
  }

  return true;
}

function isRun(picked) {
  const cards = picked.toArray();
  const setSuit = cards[0].get('suit');
  
  for (var i = 1; i < cards.length; i++) {
    if (!isSameSuit(cards[i], setSuit) || !isSequential(cards[i], cards[i-1])) { 
      return false; 
    }
  }

  return true;
}

function sortListByValue(list) {
  return list.sortBy((item) => item.get('value'))
}

function isSameSuit(actualSuit, expectedSuit) {
  return actualSuit.get('suit') === expectedSuit
}

function isSequential(currentCard, previousCard) {
  return currentCard.get('value') === previousCard.get('value') + 1;
}
