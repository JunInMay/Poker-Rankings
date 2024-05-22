"use strict"
console.log("Javascript Loaded");

// 클릭한 메인 카드 정의
let $selectedMainCard = null;
let selectedMainCardIndex = null;

// 랭킹(족보) 표기 요소
const $RANKINGS_TEXT_CONTAINER_TEXT = document.querySelector('.rankings-text-container-text');

// 랭킹(족보) 리스트 하이라이트 요소 배열
const $$RANKINGS_LIST_TEXT_WRAPPER = Array.from(document.querySelectorAll('.rankings-list-text-wrapper'));

// 메인 카드에 선택된 카드들이 각각 카드 셀렉터에 어느 위치에 저장되어 있는지 확인하기 위한 인덱스
// [문양 인덱스(CARD_SUITS), 숫자 인덱스(CARD_NUMBERS)] 형식으로 저장
const selectedCardInMainCard = [];

// 카드 이미지 경로 정의
const CARD_IMAGE_ROOT = '../resources/cards/';

// 카드 셀렉터 정의
const $CARD_SELECTOR = document.querySelector('.card-selector-container');

/*
이미지 정의 및 변수 초기화
*/
const CARD_SUITS = [
  "_of_clubs", "_of_diamonds", "_of_hearts", "_of_spades"
];
const CARD_NUMBERS = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"
];
const png = ".png";


const RANKINGS_STRINGS = [
  "Highcard", "One pair", "Two pair", "Three of a kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush",
];

let imageStrings = []; // 사용되지 않음.
for (let i = 0; i < CARD_SUITS.length; i++) {
  for (let j = 0; j < CARD_NUMBERS.length; j++) {
    imageStrings[i * 13 + j] = CARD_NUMBERS[j] + CARD_SUITS[i];
  }
}

// 카드 셀렉터 내부의 카드
let cardInCardSelector = null;

/**
 * 요소 하이라이트 함수
 * @param
 * text : 문자열
 * @description
 * RANKINGS_STRINGS에 존재하는 족보(One Pair 따위) 문자열을 받아 해당 문자열에 해당하는 $$RANKINGS_LIST_TEXT_WRAPPER에
 * 하이라이트 처리. 하이라이트 되지 않는 요소는 하이라이트 하지 않음.
 * 하이라이트 처리/딤드 처리는 class 추가 및 제거로 구현
*/
let highlightRankingText = function (text) {
  const HIGHLIGHT_CLASS_NAME = 'highlighted-rankings-list-text';
  let rankingTextID = '#r-list-' + text.toLowerCase().replaceAll(' ', '-') + '-wrapper';
  
  $$RANKINGS_LIST_TEXT_WRAPPER.map((x) => x.classList.remove(HIGHLIGHT_CLASS_NAME));
  const $selectedRankingListWrapper = document.querySelector(rankingTextID);

  $selectedRankingListWrapper.classList.add(HIGHLIGHT_CLASS_NAME);
}


/**
 * 족보 체크
 * @param
 * None
 * @description
 * suit(문양)와 number(숫자)를 통해 어떤 문양, 어떤 숫자가 몇 개 골라졌는지에 따라 족보를 계산함
 */
let showRankings = function () {
  // 어떤 문양이 몇 개고, 어떤 숫자가 몇 개인지 담을 배열 초기화
  let suitsCount = [];
  let numbersCount = [];
  for (let i = 0; i < CARD_SUITS.length; i++) {
    suitsCount[i] = 0;
  }
  for (let i = 0; i < CARD_NUMBERS.length; i++) {
    numbersCount[i] = 0;
  }

  // 어떤 카드가 골라졌는지 확인하고, 개수를 체크
  for (let i = 0; i < 5; i++) {
    if (!selectedCardInMainCard[i]) continue;

    let suitIndex = selectedCardInMainCard[i][0];
    let numberIndex = selectedCardInMainCard[i][1];

    suitsCount[suitIndex] += 1;
    numbersCount[numberIndex] += 1;
  }

  // flush check
  let isFlush = false;
  for (let i = 0; i < CARD_SUITS.length; i++) {
    if (suitsCount[i] == 5) isFlush = true;
  }

  // pair check
  let isPair = 0;
  let isThree = 0;
  let isFour = 0;
  for (let i = 0; i < CARD_NUMBERS.length; i++) {
    if (numbersCount[i] == 2) {
      isPair += 1;
    } else if (numbersCount[i] == 3) {
      isThree += 1;
    } else if (numbersCount[i] == 4) {
      isFour += 1;
    }
  }

  // straight check
  let startIndex = null;
  let consecutiveCount = 0;
  let maxConsecutiveCount = -1;
  for (let i = -1; i < CARD_NUMBERS.length; i++) {
    // alternative index
    let ai = (i + CARD_NUMBERS.length) % CARD_NUMBERS.length;
    if (startIndex == null && numbersCount[ai]) {
      startIndex = ai;
      consecutiveCount = 1;
      continue;
    } else if (startIndex != null && !numbersCount[ai]) {
      startIndex = null;
      consecutiveCount = 0;
      continue;
    } else if (startIndex == null && !numbersCount[ai]) continue;
    consecutiveCount += 1;

    if (consecutiveCount == 5) break;
  }

  let isStraight = false;
  let isMountain = false;
  let isBackstraight = false;
  if (consecutiveCount == 5) {
    isStraight = true;
    if (startIndex == CARD_NUMBERS.length - 1) isBackstraight = true;
    if (startIndex == CARD_NUMBERS.length - 5) isMountain = true;
  }

  // 족보 텍스트 설정
  let rankingsIndex = 0;
  if (isFlush && isStraight) rankingsIndex = 8
  else if (isFour) rankingsIndex = 7
  else if (isThree && isPair) rankingsIndex = 6
  else if (isFlush) rankingsIndex = 5
  else if (isStraight) rankingsIndex = 4
  else if (isThree) rankingsIndex = 3
  else if (isPair == 2) rankingsIndex = 2
  else if (isPair == 1) rankingsIndex = 1
  $RANKINGS_TEXT_CONTAINER_TEXT.textContent = RANKINGS_STRINGS[rankingsIndex]
  
  /*
  마운틴, 백스트레이트도 있긴 한데 서양 정식 족보는 아니라 집계만 하고 표기에선 제외.
  */

  // 골라진 족보 하이라이트
  highlightRankingText(RANKINGS_STRINGS[rankingsIndex]);
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

  if (cardInCardSelector[suitIndex][numberIndex].selected) {
    return;
  }

  /*
  카드 선택 작업
  */
  let cardID = e.target.id;
  if (!$selectedMainCard || selectedMainCardIndex == null) return; // 변경할 메인카드가 골라져있지 않다면 Error.

  let imagePath = `${CARD_IMAGE_ROOT}${cardID}${png}`;
  $selectedMainCard.style.backgroundImage = `url(${imagePath})`;

  // 메인카드 텍스트 제거(hidden 처리)
  let $mainCardText = $selectedMainCard.querySelector('.main-card-text');
  $mainCardText.style.visibility = 'hidden';

  cardInCardSelector[suitIndex][numberIndex].selected = true;

  // 선택한 카드는 card selector 내부에서 밝기 조절됨
  e.target.style.filter = 'brightness(70%)';
  $CARD_SELECTOR.style.visibility = 'hidden';

  /*
  메인 카드에 카드가 선택됐음을 저장
  */
  if (selectedCardInMainCard[selectedMainCardIndex]) {
    let [preSelectedSuit, preSelectedNumber] = selectedCardInMainCard[selectedMainCardIndex];
    let cardPreSelected = cardInCardSelector[preSelectedSuit][preSelectedNumber];
    cardPreSelected.selected = false;
    cardPreSelected.style.filter = 'brightness(100%)';
  }
  selectedCardInMainCard[selectedMainCardIndex] = [suitIndex, numberIndex];

  selectedMainCardIndex = null;

  /*
  족보 보이기
  */
  showRankings();
}

/*
카드 셀렉터 초기화
*/
let initCardSelector = function ($cardSelector) {
  // 카드
  let $cardSelectorSuitContainer = document.createElement('div');
  $cardSelectorSuitContainer.classList.add('card-selector-suit-container');

  // 전역으로 선언했던 카드 셀렉터 내부의 카드들을 카드 셀렉터 초기화 시에 정의함
  cardInCardSelector = [];

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
    $cardSelectorSuitContainer.appendChild(line);
  }
  $cardSelector.prepend($cardSelectorSuitContainer);

}

/*
메인 카드 클릭 시
카드 셀렉터 보여주기
*/
let showCardSelector = function (e) {
  let mainCardID = e.target.closest('.main-card').id;

  // 클릭한 메인카드
  $selectedMainCard = document.querySelector('#' + mainCardID);
  selectedMainCardIndex = $selectedMainCard.id.at(-1) - 1;

  const x = e.clientX;
  const y = e.clientY;

  // 카드셀렉터 위치 조정
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  $CARD_SELECTOR.style.top = y + 'px';

  if (x + $CARD_SELECTOR.offsetWidth / 2 > viewportWidth) {
    $CARD_SELECTOR.style.left = (viewportWidth - $CARD_SELECTOR.offsetWidth) + 'px';
  } else if (x - $CARD_SELECTOR.offsetWidth / 2 < 0) {
    $CARD_SELECTOR.style.left = '0px';
  } else {
    $CARD_SELECTOR.style.left = x - $CARD_SELECTOR.offsetWidth / 2 + 'px';
  }

  $CARD_SELECTOR.style.visibility = 'hidden';
  $CARD_SELECTOR.style.visibility = 'visible';
};


// 메인 카드에 카드 셀렉터 보여주는 함수 매핑
let $$cards = document.querySelectorAll('.main-card');

for (let i = 0; i < $$cards.length; i++) {
  $$cards[i].addEventListener('click', showCardSelector);
}

/**
 * 리프레시
 * @param
 * none
 * @description
 * 고른 카드들을 모두 초기화하는 함수
 * 1. 메인 카드 이미지 없애기
 * 2. 메인 카드 텍스트 다시 추가하기
 * 3. 카드 셀렉터 서식 초기화하기
 * 4. 메인카드에 선택된 카드 셀렉터 요소 배열 초기화하기
 */
let refreshAll = function () {
  // 1. 전체 메인 카드 배경 이미지 초기화
  let $$MAIN_CARD = Array.from(document.querySelectorAll('.main-card'));
  $$MAIN_CARD.map((x) => {
    x.style.backgroundImage = '';
  })

  // 2. 메인카드 텍스트 복구
  let $$MAIN_CARD_TEXT = Array.from(document.querySelectorAll('.main-card-text'));
  $$MAIN_CARD_TEXT.map((x) => {
    x.style.visibility = 'visible';
  });

  // 3. 카드 셀렉터 서식 초기화
  cardInCardSelector.map((x) => {
    x.map(y => {
      y.style.filter = '';
      y.selected = false;
    });
  });

  // 4. 메인카드에 선택된 카드 셀렉터 요소 배열 초기화
  selectedCardInMainCard.length = 0;
  selectedMainCardIndex = null;

  showRankings();
  closeCardSelector();
}
// 리프레시 버튼 매핑
document.querySelector('#c-s-functional-refresh-button').addEventListener('click', refreshAll);

/**
 * 카드 셀렉터 닫기
 * @description
 * 카드 셀렉터 닫기 함수
 */
let closeCardSelector = function() {
  $CARD_SELECTOR.style.visibility = 'hidden';
}

// 카드 셀렉터 닫기 매핑
document.querySelector('#c-s-functional-cancel-button').addEventListener('click', closeCardSelector);
document.body.addEventListener('click', function (e) {
  // main card 혹은 card selector를 클릭하지 않았을 경우
  const isMainCard = e.target.closest('.main-card');
  const isCardSelector = e.target.closest('.card-selector-container');

  if (!isMainCard && !isCardSelector) {
    closeCardSelector();
  }
});

/**
 * 초기화
 * @description
 * 자바스크립트 최초 로드시 실행되는 함수 모음
 */
let init = function () {
  initCardSelector($CARD_SELECTOR);
  highlightRankingText(RANKINGS_STRINGS[0]); // highcard 하이라이팅
  showRankings();
}
init();
