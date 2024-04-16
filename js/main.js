console.log("Javascript Loaded");

/*
이미지 정의
*/
let imageStrings = [];
const cardSuits = [
  "_of_clubs", "_of_diamonds", "_of_hearts", "_of_spades"
];
const png = ".png";
const cardNumbers = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"
];

for (i = 0; i < cardSuits.length; i++) {
  for (j = 0; j < cardNumbers.length; j++) {
    imageStrings[i * 13 + j] = cardNumbers[j] + cardSuits[i];
  }
}

/*
카드 셀렉터 초기화
*/
$cardSelector = document.querySelector('.card-selector-container');

let initCardSelector = function ($cardSelector) {
  for (let i = 0; i < 4; i++) {
    let line = document.createElement('div');
    line.classList.add('card-selector-suit');

    for (let j = 0; j < 13; j++) {
      let card = document.createElement('div');
      card.classList.add('card-selector-card');
      card.id = `${cardNumbers[j]}${cardSuits[i]}`;

      let imagePath = `../resources/cards/${cardNumbers[j]}${cardSuits[i]}` + png;
      card.style.backgroundImage = `url(${imagePath})`;
      card.style.backgroundSize = 'cover';

      line.appendChild(card);
    }
    $cardSelector.appendChild(line);
  }
}
initCardSelector($cardSelector);

/*
카드 셀렉터 보여주기
*/
let showCardSelector = function (e) {
  const x = e.clientX;
  const y = e.clientY;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  $cardSelector.style.top = y + 'px';

  if (x + $cardSelector.offsetWidth > viewportWidth) {
    $cardSelector.style.left = (viewportWidth - $cardSelector.offsetWidth) + 'px';
  } else {
    $cardSelector.style.left = x + 'px';
  }

  $cardSelector.style.visibility = 'hidden';
  $cardSelector.style.visibility = 'visible';
};

let $$cards = document.querySelectorAll('.main-card');

for (i = 0; i < $$cards.length; i++) {
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
    $cardSelector.style.visibility = 'hidden';
  }
});

console.log(document)
console.log(document.body)