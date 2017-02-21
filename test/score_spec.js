import {fromJS, List, Map} from 'immutable';
import {expect} from 'chai';
import {score} from '../src/core';

describe('scoring suite', function () {
  
  it('should correctly score the melded cards for each user', function () {
    const state = fromJS({
      hands: {},
      melds: [
        {
          cards: [
            { suit: 'diamonds', value: 3, owner: 'human' },
            { suit: 'diamonds', value: 4, owner: 'human' },
            { suit: 'diamonds', value: 5, owner: 'human' }
          ],
          type: 'run'
        },
        {
          cards: [
            { suit: 'diamonds', value: 6, owner: 'computer' },
            { suit: 'spades', value: 6, owner: 'computer' },
            { suit: 'clubs', value: 6, owner: 'computer' },
            { suit: 'hearts', value: 6, owner: 'human' }
          ],
          type: 'set'
        },
        {
          cards: [
            { suit: 'spades', value: 10, owner: 'computer' },
            { suit: 'spades', value: 10, owner: 'computer' },
            { suit: 'spades', value: 10, owner: 'computer' },
          ],
          type: 'set'
        },
      ]
    });
    const winningState = score(state);
    expect(winningState.get('score')).to.equal(fromJS({
      human: 20,
      computer: 45
    }));
  });

  it('should subtract any hands from their user\'s score', function () {
    const state = fromJS({
      hands: { 
        computer: [{suit:'clubs',value:9},{suit:'clubs',value:1}],
      },
      melds: [
        {
          cards: [
            { suit: 'diamonds', value: 3, owner: 'human' },
            { suit: 'diamonds', value: 4, owner: 'human' },
            { suit: 'diamonds', value: 5, owner: 'human' }
          ],
          type: 'run'
        },
        {
          cards: [
            { suit: 'diamonds', value: 6, owner: 'computer' },
            { suit: 'spades', value: 6, owner: 'computer' },
            { suit: 'clubs', value: 6, owner: 'computer' },
            { suit: 'hearts', value: 6, owner: 'human' }
          ],
          type: 'set'
        },
        {
          cards: [
            { suit: 'spades', value: 10, owner: 'computer' },
            { suit: 'spades', value: 10, owner: 'computer' },
            { suit: 'spades', value: 10, owner: 'computer' },
          ],
          type: 'set'
        },
      ]
    });
    const winningState = score(state);
    expect(winningState.get('score')).to.equal(fromJS({
      human: 20,
      computer: 25
    }));
  });

  it('should declare a winner', function () {
    const state = fromJS({
      hands: { 
        computer: [{suit:'clubs',value:9},{suit:'clubs',value:1}],
      },
      melds: [
        {
          cards: [
            { suit: 'diamonds', value: 3, owner: 'human' },
            { suit: 'diamonds', value: 4, owner: 'human' },
            { suit: 'diamonds', value: 5, owner: 'human' }
          ],
          type: 'run'
        },
        {
          cards: [
            { suit: 'diamonds', value: 6, owner: 'computer' },
            { suit: 'spades', value: 6, owner: 'computer' },
            { suit: 'clubs', value: 6, owner: 'computer' },
            { suit: 'hearts', value: 6, owner: 'human' }
          ],
          type: 'set'
        },
        {
          cards: [
            { suit: 'spades', value: 10, owner: 'computer' },
            { suit: 'spades', value: 10, owner: 'computer' },
            { suit: 'spades', value: 10, owner: 'computer' },
          ],
          type: 'set'
        },
      ]
    });
    const winningState = score(state);
    expect(winningState).to.have.property('winner', 'computer');
  });


});