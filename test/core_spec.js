import {List, Map} from 'immutable';
import {expect} from 'chai';

import {
  createDeck,  
  setDeck, 
  shuffle, 
  drawFromStock, 
  pickCard,
  playPicked,
} from '../src/core';

describe('application logic', function() {

  describe('createDeck', function() {

    it('creates a new deck of cards', function() {
      const newDeck = createDeck();
      expect(newDeck.length).to.equal(52);
    });

  });

  
  describe('setDeck', function() {

    it('adds a new deck to the state', function() {
      const state = Map();
      const deckState = setDeck(state, createDeck());
      expect(deckState).to.equal(Map({
        deck: List(createDeck())
      }));
    });
    
  });

  describe('shuffle', function() {

    it('shuffles cards in the states deck', function() {
      const state = Map({
        deck: List(createDeck())
      });
      const shuffledState = shuffle(state);
      expect(state).to.not.equal(shuffledState);
    });
    
  });

  describe('drawFromStock', function() {

    describe('player\'s first turn', function() {
      
      it('draw 10 cards from stock', function() {
        const state = Map({ deck: List(createDeck()) });
        const nextTurn = drawFromStock(state, 'human');
        expect(nextTurn.get('deck').size).to.equal(42)
      });

    });

    describe('not player\'s first turn', function() {
      
      it('draw 1 card from stock', function() {
        const deck = List(createDeck());
        const state = Map({ 
          hands: Map({
            human: deck.take(10)
          }),
          deck: deck.skip(10)
        });
        const nextTurn = drawFromStock(state, 'human');
        expect(nextTurn.get('deck').size).to.equal(41);
      });

    });

  });

  describe('pickCard', function() {
    
    it('deletes picked card from player\'s hand', function() {
      const deck = List(createDeck());
      const state = Map({ 
        hands: Map({
          human: deck.take(10)
        }),
        deck: deck.skip(10)
      });
      const nextState = pickCard(state, 'human', 2);
      expect(nextState.getIn(['hands', 'human'])).to.equal(List.of(
        Map({ suit: 'diamonds', value: 1 }),
        Map({ suit: 'diamonds', value: 2 }),
        Map({ suit: 'diamonds', value: 4 }),
        Map({ suit: 'diamonds', value: 5 }),
        Map({ suit: 'diamonds', value: 6 }),
        Map({ suit: 'diamonds', value: 7 }),
        Map({ suit: 'diamonds', value: 8 }),
        Map({ suit: 'diamonds', value: 9 }),
        Map({ suit: 'diamonds', value: 10 }),
      ));
    });

    it('adds picked card to new state key', function() {
      const deck = List(createDeck());
      const state = Map({ 
        hands: Map({
          human: deck.take(10)
        }),
        deck: deck.skip(10)
      });
      const nextState = pickCard(state, 'human', 2);
      expect(nextState.get('picked')).to.equal(List.of(
        Map({ suit: 'diamonds', value: 3 })
      ));
    });

    it('adds picked card to existing state key', function() {
      const deck = List(createDeck());
      const state = Map({ 
        hands: Map({
          human: deck.take(10)
        }),
        deck: deck.skip(10)
      });
      const nextState = pickCard(state, 'human', 0);
      const finalState = pickCard(nextState, 'human', 0);
      expect(finalState.get('picked')).to.equal(List.of(
        Map({ suit: 'diamonds', value: 1 }),
        Map({ suit: 'diamonds', value: 2 })
      ));
    });

  });

  describe('playPicked', function() {

    describe('when picked cards are a valid set', function() {

      it('adds picked cards to melds', function() {
        const state = Map({
          picked: List.of(
            Map({ suit: 'spades', value: 2 }),
            Map({ suit: 'diamonds', value: 2 }),
            Map({ suit: 'hearts', value: 2 })
          )
        });
        const nextState = playPicked(state, 'human');
        expect(nextState.getIn(['melds', 'human'])).to.equal(List.of(
          Map({
            cards: List.of(
              Map({ suit: 'spades', value: 2 }),
              Map({ suit: 'diamonds', value: 2 }),
              Map({ suit: 'hearts', value: 2 })
            ),
            type: 'set'
          })
        ));
      });

      it('delete picked cards', function() {
        const state = Map({
          picked: List.of(
            Map({ suit: 'spades', value: 2 }),
            Map({ suit: 'diamonds', value: 2 }),
            Map({ suit: 'hearts', value: 2 })
          )
        });
        const nextState = playPicked(state, 'human');
        expect(nextState.has('picked')).to.equal(false);
      });

    });

    describe('when picked cards are an invalid set', function() {
      
      it('return current state', function() {
        const state = Map({
          picked: List.of(
            Map({ suit: 'spades', value: 2 }),
            Map({ suit: 'diamonds', value: 2 }),
            Map({ suit: 'hearts', value: 3 })
          )
        });
        const nextState = playPicked(state, 'human');
        expect(nextState).to.equal(Map());
      });

    });

    describe('when picked cards are a valid run', function() {
      const state = Map({
        picked: List.of(
          Map({ suit: 'spades', value: 2 }),
          Map({ suit: 'spades', value: 3 }),
          Map({ suit: 'spades', value: 4 })
        )
      });
      const nextState = playPicked(state, 'human');
      expect(nextState.getIn(['melds', 'human'])).to.equal(List.of(
        Map({
          cards: List.of(
            Map({ suit: 'spades', value: 2 }),
            Map({ suit: 'spades', value: 3 }),
            Map({ suit: 'spades', value: 4 })
          ),
          type: 'run'
        })
      ));
    });

    describe('when runs doen\'t have the same suit', function() {
      
      it('return current state', function() {
          const state = Map({
            picked: List.of(
              Map({ suit: 'spades', value: 8 }),
              Map({ suit: 'spades', value: 10 }),
              Map({ suit: 'hearts', value: 9 })
            )
          });
          const nextState = playPicked(state, 'human');
          expect(nextState).to.equal(Map());
      });

    });

    describe('when a run doesn\'t have sequential values', function() {

      it('return current state', function() {
        const state = Map({
          picked: List.of(
            Map({ suit: 'spades', value: 8 }),
            Map({ suit: 'spades', value: 11 }),
            Map({ suit: 'spades', value: 9 })
          )
        });
        const nextState = playPicked(state, 'human');
        expect(nextState).to.equal(Map());
      });

    });

  });

  describe('score', function () {

  });

});