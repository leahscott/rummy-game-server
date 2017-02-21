import {fromJS, Map, List, Stack} from 'immutable';

export function createDeck() {
  const deck = [];
  const suits = ['diamonds', 'hearts', 'clubs', 'spades'];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({
        suit: suit,
        value: value
      });
    });
  });

  return deck;
}

export function setDeck(state, deck) {
  return state.set('deck', fromJS(deck));
}

export function shuffle(state) {
  const deck = state.get('deck');
  return state.update('deck', () => deck.sort(() => Math.random()));
}

export function drawFromStock(state) {
  const stock = state.get('deck');
  const player = state.get('currentPlayer');
  const isFirstTurn = !state.hasIn(['hands', player]);
  const numToDraw = isFirstTurn ? 10 : 1;

  const cardsDrawn = stock.take(numToDraw);
  const nextState = addToHand(state, player, cardsDrawn);

  return nextState.update('deck', deck => deck.skip(numToDraw));
}

export function drawFromDiscard(state) {
  const card = state.get('discardPile').take(1);
  const player = state.get('currentPlayer');
  const nextState = state.update(
    'discardPile',
    Stack(),
    pile => pile.shift()
  );

  return addToHand(nextState, player, card);
}

export function playMeld(state, cards) {
  if (isValidMeld(cards)) {
    const player = state.get('currentPlayer');
    const meldCards = cards.map((card) => {
      return card.set('owner', player);
    });

    const meld = Map({
      cards: meldCards,
      type: isSet(cards) ? 'set' : 'run'
    });

    const nextState = removeFromHand(state, player, cards);

    return nextState.update(
      'melds',
      List(),
      melds => melds.push(meld)
    );
  }

  return state;
}

export function layoff(state, targetMeld, card) {
  if(isValidLayoff(targetMeld, card)) {
    const player = state.get('currentPlayer'),
          newCard = card.set('owner', player),
          meldKey = state.get('melds').findKey((meld) => { return meld.get('cards').equals(targetMeld); });

    const nextState = removeFromHand(state, player, card);

    return nextState.updateIn(
      ['melds', meldKey, 'cards'],
      List(),
      cards => cards.push(newCard)
    );
  }
  
  return state;
}

export function discard(state, card) {
  const player = state.get('currentPlayer');
  const nextState = removeFromHand(state, player, card);

  if (nextState.getIn(['hands', player]).size === 0) {
    return score(state);
  }

  return nextState.update(
    'discardPile',
    Stack(),
    pile => pile.unshift(card)
  );
}

export function nextTurn(state) {
  if (state.has('currentPlayer')) {
    const players = state.get('players')
    const currentPlayer = state.get('currentPlayer');
    const nextPlayerIndex = players.findIndex(player => player === currentPlayer) + 1;

    if (nextPlayerIndex > (players.size - 1)) {
      return state.set('currentPlayer', players.first());
    } else {
      return state.set('currentPlayer', players.get(nextPlayerIndex));
    }

  } else {
    return state.set('currentPlayer', state.get('players').first());
  }
}

export function score(state) {
  
  var score = Map();

  // add points from melds
  const melds = state.get('melds');
  melds.forEach((meld) => {
    const cards = meld.get('cards');
    cards.forEach((card) => {
      score = score.update(card.get('owner'), 0 , points => points + scoreCard(card));
    });
  });

  // subtract points from hands
  const hands = state.get('hands');
  hands.forEach((hand, player) => {
    hand.forEach((card) => {
      score = score.update(player, 0, points => points - scoreCard(card))
    });
  });

  return state.merge({
    score: score,
    winner: getWinner(score)
  })  
}

/****************************************
           Private Methods
*****************************************/

function removeFromHand(state, player, cards) {
  const hand = state.getIn(['hands', player]);

  const culledHand = hand.filter((cardInHand) => {
    if (List.isList(cards)) {
      return !cards.includes(cardInHand);
    } else {
      return !cards.equals(cardInHand);
    }
  });

  return state.updateIn(
    ['hands', player],
    List(),
    hand => culledHand
  );
}

function addToHand(state, player, cards) {
  return state.updateIn(
    ['hands', player],
    List(),
    hand => hand.concat(cards)
  );
}

function isValidLayoff(meld, card) {
  return isValidMeld(meld.push(card));
}

function isValidMeld(cards) {
  if (cards.size >= 3) {
    const cardsSorted = sortCardsByValue(cards);
    return isSet(cardsSorted) || isRun(cardsSorted);
  }

  return false;
}

function isSet(cards) {
  const cardArr = cards.toArray();
  var setValue = cardArr[0].get('value');
  for (var i = 1; i < cardArr.length; i++) {
    if (cardArr[i].get('value') !== setValue) { return false; }
  }

  return true;
}

function isRun(cards) {
  const cardsArr = cards.toArray();
  const setSuit = cardsArr[0].get('suit');
  
  for (var i = 1; i < cardsArr.length; i++) {
    if (!isSameSuit(cardsArr[i], setSuit) || !isSequential(cardsArr[i], cardsArr[i-1])) { 
      return false; 
    }
  }

  return true;
}

function scoreCard(card) {
  const value = card.get('value');

  if (value === 1) {
    return 15;
  } else if (value <= 9) {
    return 5;
  } else {
    return 10;
  }
}

function getWinner(score) {
  return score.keyOf(score.max());
}

function sortCardsByValue(cards) {
  return cards.sortBy((card) => card.get('value'));
}

function isSameSuit(actualSuit, expectedSuit) {
  return actualSuit.get('suit') === expectedSuit;
}

function isSequential(currentCard, previousCard) {
  return currentCard.get('value') === previousCard.get('value') + 1;
}
