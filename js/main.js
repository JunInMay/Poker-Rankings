"use strict"
console.log("Javascript Loaded");

// 클릭한 메인 카드 정의
let $selectedMainCard = null;
let selectedMainCardIndex = null;

// 메인 카드에 선택된 카드들이 각각 카드 셀렉터에 어느 위치에 저장되어 있는지 확인하기 위한 인덱스
const selectedCardInMainCard = [];

// 카드 이미지 경로 정의
const CARD_IMAGE_ROOT = '../resources/cards/';

// 카드 셀렉터 정의
const $CARD_SELECTOR = document.querySelector('.card-selector-container');

/*
이미지 정의 및 변수 초기화
*/
let imageStrings = [];
const CARD_SUITS = [
  "_of_clubs", "_of_diamonds", "_of_hearts", "_of_spades"
];
const png = ".png";
const CARD_NUMBERS = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"
];

// 카드 셀렉터 내부의 카드
const cardInCardSelector = [];

for (let i = 0; i < CARD_SUITS.length; i++) {
  for (let j = 0; j < CARD_NUMBERS.length; j++) {
    imageStrings[i * 13 + j] = CARD_NUMBERS[j] + CARD_SUITS[i];
  }
}

/*
카드 셀렉터에서 카드를 골랐을 때
*/
let cardSelect = function (e) {
  /*
  이미 선택되어있는 카드일 경우 선택할 수 없음
  */
  let suitIndex = e.target.suitIndex;
  let numberIndex = e.target.numberIndex;

  console.log(cardInCardSelector[suitIndex][numberIndex]);

  if (cardInCardSelector[suitIndex][numberIndex].selected) {
    return;
  }

  /*
  카드 선택 작업
  */
  let cardID = e.target.id;
  console.log(e.target);
  if (!$selectedMainCard || selectedMainCardIndex == null) return; // 변경할 메인카드가 골라져있지 않다면 Error.

  let imagePath = `${CARD_IMAGE_ROOT}${cardID}${png}`;
  $selectedMainCard.style.backgroundImage = `url(${imagePath})`;
  $selectedMainCard.style.backgroundSize = 'cover';
  cardInCardSelector[suitIndex][numberIndex].selected = true;

  e.target.style.filter = 'brightness(70%)';
  $CARD_SELECTOR.style.visibility = 'hidden';

  /*
  메인 카드에 선택한 카드 지정
  */
  if (selectedCardInMainCard[selectedMainCardIndex]) {
    let [preSelectedSuit, preSelectedNumber] = selectedCardInMainCard[selectedMainCardIndex];
    let cardPreSelected = cardInCardSelector[preSelectedSuit][preSelectedNumber];
    cardPreSelected.selected = false;
    cardPreSelected.style.filter = 'brightness(100%)';
  }
  selectedCardInMainCard[selectedMainCardIndex] = [suitIndex, numberIndex];
  console.log(selectedCardInMainCard)

  selectedMainCardIndex = null;
}

/*
카드 셀렉터 초기화
*/
let initCardSelector = function ($cardSelector) {
  for (let i = 0; i < 4; i++) {
    let line = document.createElement('div');
    line.classList.add('card-selector-suit');
    cardInCardSelector[i] = [];

    for (let j = 0; j < 13; j++) {
      let card = document.createElement('div');
      card.classList.add('card-selector-card');
      card.id = `${CARD_NUMBERS[j]}${CARD_SUITS[i]}`;

      // 해당 카드의 숫자와 문양 인덱스 속성 추가
      card.numberIndex = j;
      card.suitIndex = i;
      
      // 선택 여부 속성 추가
      card.selected = false;

      let imagePath = `${CARD_IMAGE_ROOT}${CARD_NUMBERS[j]}${CARD_SUITS[i]}${png}`;
      card.style.backgroundImage = `url(${imagePath})`;
      card.style.backgroundSize = 'cover';

      // 카드 셀렉터의 카드를 배열로 관리하기 위해 배열에 추가
      cardInCardSelector[i][j] = card;

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
  $selectedMainCard = document.querySelector('#' + mainCardID);
  selectedMainCardIndex = $selectedMainCard.id.at(-1) - 1;

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