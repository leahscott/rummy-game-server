import {fromJS, Map, List, Stack} from 'immutable';
import {expect} from 'chai';
import {nextTurn} from '../src/core';

describe('turn suite', function () {

  describe('when no current player is set', function () {

    it('make it the first player\'s turn', function () {
      const state = fromJS({ players: ['human', 'computer'] });
      const nextState = nextTurn(state);
      expect(nextState.get('currentPlayer')).to.equal('human');
    });

  });

  describe('when there is a current player', function () {
    
    it('make it the next player\'s turn', function () {
      const state = fromJS({ 
        players: ['human', 'computer'],
        currentPlayer: 'human'
      });
      const nextState = nextTurn(state);
      expect(nextState.get('currentPlayer')).to.equal('computer');
    });

  });

  describe('when the current player is the last', function () {
    
    it('make it the first player\'s turn again', function () {
      const state = fromJS({ 
        players: ['human', 'computer'],
        currentPlayer: 'computer'
      });
      const nextState = nextTurn(state);
      expect(nextState.get('currentPlayer')).to.equal('human');
    });

  });

});