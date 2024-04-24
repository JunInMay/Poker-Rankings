"use strict"
console.log("Javascript Loaded");

// 클릭한 메인 카드 정의
let selectedMainCard = null;

// 카드 이미지 경로 정의
const CARD_IMAGE_ROOT = '../resources/cards/';

// 카드 셀렉터 정의
const $CARD_SELECTOR = document.querySelector('.card-selector-container');

/*
이미지 정의 및 변수 초기화
*/
let imageStrings = [];
const cardSuits = [
  "_of_clubs", "_of_diamonds", "_of_hearts", "_of_spades"
];
const png = ".png";
const cardNumbers = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"
];

// 선택된 카드들 확인
const isCardSelected = [];
// 메인 카드에 선택된 카드들
const cardInMainCard = [];

for (let i = 0; i < cardSuits.length; i++) {
  isCardSelected[i] = [];
  for (let j = 0; j < cardNumbers.length; j++) {
    isCardSelected[i][j] = false;
    imageStrings[i * 13 + j] = cardNumbers[j] + cardSuits[i];
  }
}

/*
카드 셀렉터에서 카드 고르기
*/
let cardSelect = function (e) {
  /*
  이미 선택되어있는 카드일 경우 선택할 수 없음
  */
  let numberIndex = e.target.numberIndex;
  let suitIndex = e.target.suitIndex;

  if (isCardSelected[suitIndex][numberIndex]) {
    return;
  }

  /*
  카드 선택 작업
  */
  let cardID = e.target.id;
  console.log(e.target);
  if (!selectedMainCard) return; // 변경할 메인카드가 골라져있지 않다면 Error.

  let imagePath = `${CARD_IMAGE_ROOT}${cardID}${png}`;
  selectedMainCard.style.backgroundImage = `url(${imagePath})`;
  selectedMainCard.style.backgroundSize = 'cover';
  isCardSelected[suitIndex][numberIndex] = true;

  /*

  */

  e.target.style.filter = 'brightness(70%)';

  $CARD_SELECTOR.style.visibility = 'hidden';
}

/*
카드 셀렉터 초기화
*/
let initCardSelector = function ($cardSelector) {
  for (let i = 0; i < 4; i++) {
    let line = document.createElement('div');
    line.classList.add('card-selector-suit');

    for (let j = 0; j < 13; j++) {
      let card = document.createElement('div');
      card.classList.add('card-selector-card');
      card.id = `${cardNumbers[j]}${cardSuits[i]}`;

      // 해당 카드의 숫자와 문양 인덱스 속성 추가
      card.numberIndex = j;
      card.suitIndex = i;

      let imagePath = `${CARD_IMAGE_ROOT}${cardNumbers[j]}${cardSuits[i]}${png}`;
      card.style.backgroundImage = `url(${imagePath})`;
      card.style.backgroundSize = 'cover';

      // 카드 셀렉터 내부의 카드를 클릭했을 때 메인 카드에 입력
      card.addEventListener('click', cardSelect);

      line.appendChild(card);
    }
    $cardSelector.appendChild(line);
  }
}
initCardSelector($CARD_SELECTOR);

/*
메인 카드 클릭 시
카드 셀렉터 보여주기
*/
let showCardSelector = function (e) {
  let mainCardID = e.target.id;

  // 클릭한 메인카드
  selectedMainCard = document.querySelector('#' + mainCardID);
  console.log(e.target.id);
  const x = e.clientX;
  const y = e.clientY;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  $CARD_SELECTOR.style.top = y + 'px';

  if (x + $CARD_SELECTOR.offsetWidth > viewportWidth) {
    $CARD_SELECTOR.style.left = (viewportWidth - $CARD_SELECTOR.offsetWidth) + 'px';
  } else {
    $CARD_SELECTOR.style.left = x + 'px';
  }

  $CARD_SELECTOR.style.visibility = 'hidden';
  $CARD_SELECTOR.style.visibility = 'visible';
};

let $$cards = document.querySelectorAll('.main-card');

for (let i = 0; i < $$cards.length; i++) {
  $$cards[i].addEventListener('click', showCardSelector);
}

/*
카드 셀렉터 숨기기
*/
document.body.addEventListener('click', function (e) {
  // main card 혹은 card selector를 클릭하지 않았을 경우
  const isMainCard = e.target.closest('.main-card');
  const isCardSelector = e.target.closest('.card-selector-container');

  if (!isMainCard && !isCardSelector) {
    $CARD_SELECTOR.style.visibility = 'hidden';
  }
});

console.log(document)
console.log(document.body)