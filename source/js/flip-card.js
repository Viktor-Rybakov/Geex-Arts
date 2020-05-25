'use strict';

const CARD = document.querySelector('.js-flip-card');
const DESCRIPTION = CARD.querySelector('.js-flip-card__description');
const PHOTO = CARD.querySelector('.js-flip-card__photo');

CARD.addEventListener('click', function(event) {
  let target = event.target;

  if ( target.closest('.js-flip-card-forward') ) {
    DESCRIPTION.classList.add('flip-card__description--disabled');
    PHOTO.classList.remove('flip-card__photo--disabled');
  }

  if ( target.closest('.js-flip-card-back') ) {
    DESCRIPTION.classList.remove('flip-card__description--disabled');
    PHOTO.classList.add('flip-card__photo--disabled');
  }
});

