import {fromJS, Map, List, Stack} from 'immutable';
import {expect} from 'chai';
import {nextTurn} from '../src/core';

describe('turn suite', () => {

  describe('when no current player is set', () => {

    it('make it the first player\'s turn', () => {
      const state = fromJS({ players: ['human', 'computer'] });
      const nextState = nextTurn(state);
      expect(nextState.get('currentPlayer')).to.equal('human');
    });

  });

  describe('when there is a current player', () => {
    
    it('make it the next player\'s turn', () => {
      const state = fromJS({ 
        players: ['human', 'computer'],
        currentPlayer: 'human'
      });
      const nextState = nextTurn(state);
      expect(nextState.get('currentPlayer')).to.equal('computer');
    });

  });

  describe('when the current player is the last', () => {
    
    it('make it the first player\'s turn again', () => {
      const state = fromJS({ 
        players: ['human', 'computer'],
        currentPlayer: 'computer'
      });
      const nextState = nextTurn(state);
      expect(nextState.get('currentPlayer')).to.equal('human');
    });

  });

});