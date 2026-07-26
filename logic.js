// ==============================================
// 코에(こえ) 앱의 동작 로직 모음
// data.js(단어/문제 등 정적 데이터)가 먼저 로드된 뒤에 실행됩니다.
// index.html에서 <script src="./data.js"></script> 다음에 이 파일을 불러옵니다.
// ==============================================

/**
 * words.js
 * 코토바 게임 단어 데이터 (연령대별: 12 / 18 / 24개월)
 * 이 파일은 kotoba-game.html 에서 별도의 스크립트 태그로 불러옵니다.
 */


/* 🔊 의성어·의태어 카드 게임 데이터 — 히라가나 의성어/의태어와 그와 연관된 단어를 짝지어 둡니다.
   동물 울음소리(의성어)뿐 아니라 날씨·동작·상태를 나타내는 의태어도 포함해 범위를 넓혔습니다.
   DICTIONARY에 이미 있는 단어와 이름(jp)을 맞춰 통계·발음이 자연스럽게 연동되게 합니다. */


/* 🤔 '나는 무엇일까요?' 수수께끼 게임 데이터
   정답 하나마다 히라가나 힌트 문장을 최대 3개까지 담아 두고,
   순서대로("동물이야" → "다리가 4개야" → "꿀꿀 소리를 내") 하나씩 들려주며
   이모지 보기 중에서 정답을 찾게 합니다. */
/* 🎨 표준 이모지만으로는 단어를 연상하기 어려운 경우를 위한 커스텀 SVG 아이콘 모음.
   예) 열기구(ききゅう)는 전용 이모지가 없어 실제로는 '풍선(🎈)'과 똑같은 글자를 쓰게 되어
   혼동을 주므로, 바구니·로프·세로줄무늬가 있는 열기구 모양을 직접 그려 보여줍니다.
   새로운 단어를 여기 추가하면(jp 발음을 key로) 자동으로 이모지 대신 이 그림이 쓰입니다. */
const CUSTOM_WORD_ICONS = {
  // 열기구: 둥근 파티 풍선(🎈)과 헷갈리지 않도록 바구니와 줄무늬를 넣어 구분했습니다.
  "ききゅう": () => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="custom-icon-svg">
      <path d="M50 6 C72 6 82 28 78 46 C75 60 65 66 58 70 L42 70 C35 66 25 60 22 46 C18 28 28 6 50 6 Z" fill="var(--hanko)" stroke="var(--sumi)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M50 6 C58 6 64 24 62 46 C61 58 56 66 52 70" fill="none" stroke="var(--gold)" stroke-width="4" opacity="0.85"/>
      <path d="M50 6 C42 6 36 24 38 46 C39 58 44 66 48 70" fill="none" stroke="var(--gold)" stroke-width="4" opacity="0.85"/>
      <line x1="42" y1="70" x2="38" y2="82" stroke="var(--sumi)" stroke-width="2.5"/>
      <line x1="58" y1="70" x2="62" y2="82" stroke="var(--sumi)" stroke-width="2.5"/>
      <rect x="36" y="82" width="28" height="14" rx="3" fill="#B08050" stroke="var(--sumi)" stroke-width="3"/>
    </svg>
  `,
  // 코스모스: 벚꽃(🌸)과 이모지가 겹쳐 헷갈리므로, 벚꽃보다 꽃잎이 가늘고 뾰족한 코스모스 모양으로 구분했습니다.
  "こすもす": () => {
    let petals = '';
    for(let i = 0; i < 8; i++){
      const angle = i * 45;
      petals += `<ellipse cx="50" cy="24" rx="7" ry="20" fill="var(--hanko)" stroke="var(--sumi)" stroke-width="2" transform="rotate(${angle} 50 50)"/>`;
    }
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="custom-icon-svg">
        ${petals}
        <circle cx="50" cy="50" r="11" fill="var(--gold)" stroke="var(--sumi)" stroke-width="2.5"/>
      </svg>
    `;
  }
};

/* 단어에 맞는 커스텀 SVG 아이콘이 CUSTOM_WORD_ICONS에 등록돼 있으면 그것을,
   없으면 기존 이모지를 그대로 보여주는 HTML 조각을 반환합니다. */
function renderWordVisual(word){
  const iconBuilder = CUSTOM_WORD_ICONS[word.jp];
  if(iconBuilder) return `<span class="custom-icon-wrap">${iconBuilder()}${posBadgeHTML(word)}</span>`;
  return emojiVisualHTML(word);
}

/* 🏷️ 품사(품사 기호) 배지 관련 헬퍼.
   이모지만으로 뜻을 유추하기 어려운 단어를 도와주기 위해,
   이모지 오른쪽 위에 명/동/형 등 품사 약자를 작은 태그로 붙여줍니다. */


/* DICTIONARY, ONOMATOPOEIA_ITEMS, RIDDLES 등 여러 데이터 배열이 같은 jp 단어를
   공유하므로, word 자체에 pos가 없으면 DICTIONARY에서 같은 jp를 찾아 재사용합니다. */
function getWordPos(word){
  if(!word) return null;
  if(word.pos) return word.pos;
  if(word.jp){
    const found = DICTIONARY.find(d => d.jp === word.jp);
    if(found) return found.pos || null;
  }
  return null;
}

function posBadgeHTML(word){
  const pos = getWordPos(word);
  const label = pos && POS_LABELS[pos];
  if(!label) return '';
  return `<span class="pos-badge pos-${pos}">${label}</span>`;
}

/* 단어 카드 갤러리의 이모지 오른쪽 위에 표시할 카테고리 배지 —
   설정/단어 카드 메뉴의 주제별 필터 버튼과 같은 이모지를 사용해 한눈에 주제를 알 수 있게 합니다 */


function categoryBadgeHTML(word){
  const cat = word && word.category;
  const emoji = cat && CATEGORY_BADGE_EMOJI[cat];
  if(!emoji) return '';
  return `<span class="category-badge">${emoji}</span>`;
}

/* 이모지 + 품사 배지를 함께 담은 span HTML을 반환합니다.
   기존에 word.emoji만 textContent로 넣던 자리를 이걸로 바꾸면 배지가 함께 표시됩니다. */
function emojiVisualHTML(word, extraClass){
  if(!word) return '';
  const cls = extraClass ? ` ${extraClass}` : '';
  return `<span class="emoji-pos-wrap${cls}">${word.emoji}${posBadgeHTML(word)}</span>`;
}



/* 🧩 '그림 반쪽 맞추기' 게임 데이터 — 종이 인쇄물로 흔한 "えあわせ・もじあわせ カード"(그림 반쪽+글자 반쪽
   맞추기 카드)를 화면 게임으로 옮긴 것입니다. 동물뿐 아니라 과일·음식 단어도 함께 모아두었으며,
   모두 글자를 앞/뒤 절반으로 정확히 나눌 수 있는 단어들입니다 */


/* 단어의 히라가나를 앞/뒤 절반으로 나눕니다 (글자 수가 홀수면 앞쪽에 한 글자 더 배정) */
function ewSplitWord(jp){
  const chars = Array.from(jp);
  const cut = Math.ceil(chars.length / 2);
  return { half1: chars.slice(0, cut).join(''), half2: chars.slice(cut).join('') };
}

/* ❓ '질문에 답하기' 게임 데이터
   36개월 전후 아이가 엄마와 나눌 법한 일상 대화를 주제로, 이모지 하나를 보여주고
   히라가나 질문을 음성으로 들려준 뒤, です・ます체 문장 4개(정답 1개 + 다른 문항의 대답 3개) 중에서
   알맞은 대답을 고르게 합니다. */


/* 🌈 '생활 문답' 게임 데이터 — 시간·온도·날씨 등 생활 속 질문에 히라가나로 답하는 게임.
   주제별 그림(SVG)을 오른쪽에 보여주고 '~는 무엇입니까?' 류의 질문을 음성으로 들려준 뒤,
   です・ます체 문장 4개(정답 1개 + 같은 주제의 다른 문장 3개) 중에서
   그림이 나타내는 내용과 일치하는 문장을 고르게 합니다. */

/* ⏰ 시간(時刻) 주제 — 시(時)와 분(分) 읽는 법의 불규칙한 부분
   (4時=よじ, 9時=くじ, ぷん/ふん 발음 변화 등)을 그대로 반영해 자동으로 문장을 생성합니다. */
const LIFEQA_CLOCK_QUESTION_JP = "いま なんじ なんぷんですか？";
const LIFEQA_CLOCK_QUESTION_KR = "지금은 몇 시 몇 분입니까?";



function clockMinuteReadingJp(min){
  const tensReading = {5:'ご', 10:'じゅっ', 15:'じゅうご', 20:'にじゅっ', 25:'にじゅうご', 30:'さんじゅっ', 35:'さんじゅうご', 40:'よんじゅっ', 45:'よんじゅうご', 50:'ごじゅっ', 55:'ごじゅうご'};
  const base = tensReading[min];
  return (min % 10 === 0) ? (base + 'ぷん') : (base + 'ふん');
}

function clockSentenceJp(hour, minute){
  const hourPart = CLOCK_HOUR_JP[hour] + 'じ';
  if(minute === 0) return `いま ${hourPart} ちょうどです。`;
  return `いま ${hourPart} ${clockMinuteReadingJp(minute)}です。`;
}

function clockSentenceKr(hour, minute){
  if(minute === 0) return `지금은 ${hour}시 정각입니다.`;
  return `지금은 ${hour}시 ${minute}분입니다.`;
}



/* 🌡️ 온도(気温) 주제 — 度(도) 읽는 법과 영하(マイナス) 표현을 반영합니다. */
const LIFEQA_TEMP_QUESTION_JP = "きょうの きおんは なんどですか？";
const LIFEQA_TEMP_QUESTION_KR = "오늘 기온은 몇 도입니까?";



function tempSentenceJp(temp){
  const abs = Math.abs(temp);
  const numPart = TEMP_NUMBER_JP[abs];
  const sign = temp < 0 ? 'マイナス' : '';
  return `きょうは ${sign}${numPart}どです。`;
}

function tempSentenceKr(temp){
  if(temp < 0) return `오늘은 영하 ${Math.abs(temp)}도입니다.`;
  return `오늘은 ${temp}도입니다.`;
}



/* ☀️ 날씨(天気) 주제 */
const LIFEQA_WEATHER_QUESTION_JP = "きょうの てんきは どうですか？";
const LIFEQA_WEATHER_QUESTION_KR = "오늘 날씨는 어떻습니까?";



/* 세 주제를 하나의 문제 풀(pool)로 합칩니다. 각 문항은 type으로 구분되며,
   보기(선택지)를 만들 때는 같은 type끼리만 묶어 정답과 헷갈릴 만한 오답을 고릅니다. */


for(let h = 1; h <= 12; h++){
  for(const m of CLOCK_MINUTES){
    LIFEQA_ITEMS.push({
      type:'clock', hour:h, minute:m,
      questionJp: LIFEQA_CLOCK_QUESTION_JP, questionKr: LIFEQA_CLOCK_QUESTION_KR,
      answerJp: clockSentenceJp(h,m), answerKr: clockSentenceKr(h,m)
    });
  }
}

for(const t of LIFEQA_TEMPS){
  LIFEQA_ITEMS.push({
    type:'temperature', temp:t,
    questionJp: LIFEQA_TEMP_QUESTION_JP, questionKr: LIFEQA_TEMP_QUESTION_KR,
    answerJp: tempSentenceJp(t), answerKr: tempSentenceKr(t)
  });
}

for(const w of WEATHER_TYPES){
  LIFEQA_ITEMS.push({
    type:'weather', weatherKey: w.key,
    questionJp: LIFEQA_WEATHER_QUESTION_JP, questionKr: LIFEQA_WEATHER_QUESTION_KR,
    answerJp: w.answerJp, answerKr: w.answerKr
  });
}

/* 시각(hour, minute)에 맞는 아날로그 시계판 SVG를 만들어 반환합니다. */
function buildClockFaceSvg(hour, minute){
  const minuteAngle = (minute / 60) * 360;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;
  let ticks = '';
  for(let i = 0; i < 12; i++){
    const angle = i * 30;
    const isMain = angle % 90 === 0;
    const r1 = isMain ? 74 : 80;
    const x1 = 100 + r1 * Math.sin(angle * Math.PI / 180);
    const y1 = 100 - r1 * Math.cos(angle * Math.PI / 180);
    const x2 = 100 + 86 * Math.sin(angle * Math.PI / 180);
    const y2 = 100 - 86 * Math.cos(angle * Math.PI / 180);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--sumi)" stroke-width="${isMain ? 4 : 2}" stroke-linecap="round"/>`;
  }
  const hx = 100 + 45 * Math.sin(hourAngle * Math.PI / 180);
  const hy = 100 - 45 * Math.cos(hourAngle * Math.PI / 180);
  const mx = 100 + 68 * Math.sin(minuteAngle * Math.PI / 180);
  const my = 100 - 68 * Math.cos(minuteAngle * Math.PI / 180);
  return `
    <svg class="lifeqa-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" fill="#fff" stroke="var(--sumi)" stroke-width="6"/>
      ${ticks}
      <line x1="100" y1="100" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="var(--sumi)" stroke-width="7" stroke-linecap="round"/>
      <line x1="100" y1="100" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="var(--hanko)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="100" cy="100" r="6" fill="var(--hanko)"/>
    </svg>
  `;
}

/* 기온(temp, ℃)에 맞는 온도계 SVG를 만들어 반환합니다. -10~40도 범위를 눈금으로 표시합니다. */
function buildThermometerSvg(temp){
  const minT = -10, maxT = 40;
  const tubeTop = 15, tubeBottom = 150;
  const clamped = Math.max(minT, Math.min(maxT, temp));
  const ratio = (clamped - minT) / (maxT - minT);
  const fillTop = tubeBottom - ratio * (tubeBottom - tubeTop);

  let ticks = '';
  for(const t of [-10,0,10,20,30,40]){
    const ty = tubeBottom - ((t - minT) / (maxT - minT)) * (tubeBottom - tubeTop);
    ticks += `<line x1="46" y1="${ty.toFixed(1)}" x2="54" y2="${ty.toFixed(1)}" stroke="var(--sumi)" stroke-width="2"/>`;
    ticks += `<text x="58" y="${(ty+4).toFixed(1)}" font-size="12" fill="var(--sumi)">${t}</text>`;
  }

  return `
    <svg class="lifeqa-svg" viewBox="0 0 90 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="${tubeTop}" width="16" height="${tubeBottom - tubeTop}" rx="8" fill="#fff" stroke="var(--sumi)" stroke-width="4"/>
      <circle cx="38" cy="175" r="20" fill="#fff" stroke="var(--sumi)" stroke-width="4"/>
      <rect x="34" y="${fillTop.toFixed(1)}" width="8" height="${(tubeBottom - fillTop + 12).toFixed(1)}" rx="4" fill="var(--hanko)"/>
      <circle cx="38" cy="175" r="13" fill="var(--hanko)"/>
      ${ticks}
    </svg>
  `;
}

/* 날씨(weatherKey)에 맞는 아이콘 SVG를 만들어 반환합니다. */
function buildWeatherSvg(weatherKey){
  const cloud = (cx, cy, fill) => `
    <ellipse cx="${cx-26}" cy="${cy}" rx="24" ry="19" fill="${fill}" stroke="var(--sumi)" stroke-width="3"/>
    <ellipse cx="${cx+10}" cy="${cy-9}" rx="30" ry="23" fill="${fill}" stroke="var(--sumi)" stroke-width="3"/>
    <ellipse cx="${cx+36}" cy="${cy+4}" rx="22" ry="17" fill="${fill}" stroke="var(--sumi)" stroke-width="3"/>
  `;
  const sun = (cx, cy) => {
    let rays = '';
    for(let i = 0; i < 8; i++){
      const angle = i * 45 * Math.PI / 180;
      const x1 = cx + 40 * Math.sin(angle), y1 = cy - 40 * Math.cos(angle);
      const x2 = cx + 55 * Math.sin(angle), y2 = cy - 55 * Math.cos(angle);
      rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#F9A825" stroke-width="5" stroke-linecap="round"/>`;
    }
    return `${rays}<circle cx="${cx}" cy="${cy}" r="32" fill="#FFC947" stroke="#F9A825" stroke-width="3"/>`;
  };
  const rainDrops = (cy) => {
    let drops = '';
    [40,75,110,145].forEach((x,i) => {
      const y = cy + 20 + (i % 2 === 0 ? 0 : 6);
      drops += `<line x1="${x}" y1="${y}" x2="${x-10}" y2="${y+22}" stroke="#4FA8E0" stroke-width="4" stroke-linecap="round"/>`;
    });
    return drops;
  };
  const snowFlakes = (cy) => {
    let flakes = '';
    [40,75,110,145].forEach((x,i) => {
      const y = cy + 24 + (i % 2 === 0 ? 0 : 8);
      flakes += `<text x="${x}" y="${y}" font-size="20" fill="#5FB8E8">❄</text>`;
    });
    return flakes;
  };
  const windLines = () => `
    <path d="M20 80 Q60 65 100 80 T180 80" fill="none" stroke="var(--sumi)" stroke-width="5" stroke-linecap="round"/>
    <path d="M35 105 Q70 92 110 105 T170 105" fill="none" stroke="var(--sumi)" stroke-width="5" stroke-linecap="round"/>
    <path d="M45 130 Q75 118 115 130" fill="none" stroke="var(--sumi)" stroke-width="5" stroke-linecap="round"/>
  `;

  let inner = '';
  if(weatherKey === 'sunny'){
    inner = sun(100, 80);
  } else if(weatherKey === 'cloudy'){
    inner = cloud(100, 90, '#DCE3E8');
  } else if(weatherKey === 'rainy'){
    inner = cloud(100, 70, '#B9C4CC') + rainDrops(70);
  } else if(weatherKey === 'snowy'){
    inner = cloud(100, 70, '#E9EEF2') + snowFlakes(70);
  } else if(weatherKey === 'windy'){
    inner = windLines();
  }

  return `
    <svg class="lifeqa-svg" viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg">
      ${inner}
    </svg>
  `;
}

/* 문항의 type에 맞는 이미지 SVG를 반환하는 통합 함수 */
function buildLifeqaImage(item){
  if(item.type === 'clock') return buildClockFaceSvg(item.hour, item.minute);
  if(item.type === 'temperature') return buildThermometerSvg(item.temp);
  if(item.type === 'weather') return buildWeatherSvg(item.weatherKey);
  return '';
}

/* 🏪 '가게 게임' 데이터 — 과일/음식 이모지와 가격(엔)을 맞히는 퀴즈 */






/* 100엔 단위 가격(예: 600)을 'ろっぴゃくえん'처럼 히라가나로 읽어줍니다 */
function shopPriceToHiragana(price){
  const hundreds = Math.round(price / 100);
  return (SHOP_HUNDRED_READINGS[hundreds] || "") + "えん";
}



/* 🌅 하루 일과 씬(scene) 데이터
   실제 아기가 배우는 방식처럼, 단어를 따로 외우게 하지 않고
   "그 상황에서 부모가 반복해서 하는 말"을 통째로 반복 노출시키기 위한 데이터입니다. */


/* 📖 엄마 목소리 동화책 — 일본 엄마들이 36개월 이하 아이에게 자주 읽어주는
   짧은 그림동화 테마 20편. 한 페이지에 문장 1개 + 그 문장을 나타내는 이모지 구성 */
/* 📚 니혼고 다독(たどく) 문고에서 무료로 공개한 그림책 PDF를 페이지 이미지로 보여주는 전자책 리더용 데이터입니다.
   이미지는 tadoku.org(NPO多言語多読)가 "無料で読む"로 직접 공개 호스팅하는 원본을 그대로 불러오며,
   각 책마다 출처 링크와 라이선스를 함께 표시합니다. */
/* 📚 EBOOKS: 니혼고 다독(たどく)이 CC BY-NC-ND 라이선스로 무료 공개한 그림책 소개 카드입니다.
   저작권 보호를 위해 본문 텍스트는 옮겨 싣지 않고, 표지·크레딧·공식 낭독 MP3만 담았습니다.
   전체 내용은 sourceUrl(tadoku.org 원문 페이지)에서 읽을 수 있습니다. */


/* 🍎 이모지 동화책 — 과일 이모지 10가지, 책마다 5페이지(①이름 소개 ②색깔 ③재미있는 사실 ④향 ⑤좋아하는 동물)
   ③ 페이지는 아이가 흥미를 가질 만한, 흔히 알려진 사실 위주로 구성했습니다.
   여기서 새로 쓰인 단어(あまい/すっぱい/たくさん/むく/なる/ある/け/とげ/あみ/だいだいいろ/かたち/かおり)는
   DICTIONARY(위쪽)에도 함께 등록해 두었습니다.
   각 페이지에는 jp/romaji(아기말투: 조사 생략·짧은 문장·ね/よ 종결) 외에
   jpFormal/romajiFormal(조사를 갖춘 문장 + です/ます 종결)을 함께 넣어 두었고,
   "아기말투로 보기" 토글로 두 스타일을 전환할 수 있습니다. */




/* 연령대(레벨) 선택 상태 — 선택한 레벨 이하의 단어를 모두 누적으로 사용합니다 */
let currentAppLevel = 36;
let currentJlptFilter = 'all';
let currentCategoryFilter = 'all';
function getActiveWords(){
  return DICTIONARY.filter(w => {
    if (w.level > currentAppLevel) return false;
    if (currentJlptFilter !== 'all' && w.jlpt !== currentJlptFilter) return false;
    if (currentCategoryFilter !== 'all' && w.category !== currentCategoryFilter) return false;
    return true;
  });
}

/* 😊 무조건적 긍정 피드백 — 저연령(12/18개월) 레벨에서는 오답을 부드럽게 표현합니다 */

function isGentleFeedbackMode(){
  return currentAppLevel <= 18;
}
function wrongFeedbackText(defaultText){
  if(isGentleFeedbackMode()){
    return GENTLE_WRONG_MESSAGES[Math.floor(Math.random() * GENTLE_WRONG_MESSAGES.length)];
  }
  return defaultText;
}
function wrongFeedbackColor(){
  return isGentleFeedbackMode() ? 'var(--wrong-gentle)' : 'var(--wrong)';
}

function updateFilterCount(){
  const count = getActiveWords().length;
  const countEl = document.getElementById('ageLevelCount');
  if(!countEl) return;
  if(count === 0){
    countEl.innerHTML = `⚠️ 조건에 맞는 단어가 없어요. 다른 조합을 선택해보세요.`;
  } else {
    countEl.innerHTML = `현재 <b>${count}</b>개 단어 사용 중`;
  }
}

/* 연령대/JLPT/주제 필터가 바뀔 때마다 현재 열려있는 게임 모드를 새 단어 범위로 다시 시작합니다 */
function refreshActiveModeAfterFilterChange(){
  // 😊 저연령 레벨에서는 오답 표시를 부드럽게(gentle-mode) 완화
  document.body.classList.toggle('gentle-mode', isGentleFeedbackMode());

  buildGallery();
  updateMatchGridAvailability();

  // 필터 조합 결과 단어가 하나도 없으면 현재 화면을 그대로 두고 새 문제를 만들지 않습니다
  if(getActiveWords().length === 0) return;

  const activeModeEl = document.querySelector('.mode-content.active');
  const activeModeId = activeModeEl ? activeModeEl.id : '';

  if(activeModeId === 'quizMode'){
    if(document.getElementById('quizQuestionScreen').style.display !== 'none') generateQuiz();
  } else if(activeModeId === 'audioEmojiMode'){
    generateAudioEmojiQuiz();
  } else if(activeModeId === 'writingMode'){
    generateWritingQuestion();
  } else if(activeModeId === 'matchingMode'){
    initMatchGame();
  } else if(activeModeId === 'pronounceMode'){
    generatePronounceQuestion();
  } else if(activeModeId === 'sentenceMode'){
    if(document.getElementById('sentenceQuestionScreen').style.display !== 'none') generateSentenceQuiz();
  } else if(activeModeId === 'compoundMode'){
    if(document.getElementById('compoundQuestionScreen').style.display !== 'none') generateCompoundQuiz();
  } else if(activeModeId === 'exposureMode'){
    generateExposureQuestion();
  } else if(activeModeId === 'traceMode'){
    generateTraceQuestion();
  } else if(activeModeId === 'speechMode'){
    currentText = "";
    lastMatchedJp = null;
    renderStream("", null);
  } else if(activeModeId === 'spellingMode'){
    generateSpellingQuestion();
  }
}

function changeAppLevel(level){
  currentAppLevel = level;

  document.querySelectorAll('#ageLevelSelect .lvl-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`ageLvlBtn${level}`);
  if(activeBtn) activeBtn.classList.add('active');

  updateFilterCount();
  refreshActiveModeAfterFilterChange();
}

/* 🎓 JLPT 급수별 단어 범위 필터 (연령대 범위와 함께 AND 조건으로 적용) */
function changeJlptFilter(level){
  currentJlptFilter = level;

  document.querySelectorAll('#jlptLevelSelect .lvl-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.jlpt === level);
  });

  updateFilterCount();
  refreshActiveModeAfterFilterChange();
}

/* 📚 주제별 단어 범위 필터 (연령대 범위와 함께 AND 조건으로 적용) */
function changeCategoryFilter(cat){
  currentCategoryFilter = cat;

  // 설정 화면과 단어 카드 메뉴 상단, 두 곳의 카테고리 버튼 그룹을 모두 동기화합니다
  document.querySelectorAll('.category-select-group .lvl-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });

  updateFilterCount();
  refreshActiveModeAfterFilterChange();
}



const streamEl = document.getElementById('stream');
const placeholderEl = document.getElementById('placeholder');
const micBtn = document.getElementById('micBtn');
const statusLabel = document.getElementById('statusLabel');
const statusSub = document.getElementById('statusSub');
const unsupportedMsg = document.getElementById('unsupportedMsg');
const stampCard = document.getElementById('stampCard');
const stampEmoji = document.getElementById('stampEmoji');
const stampJp = document.getElementById('stampJp');
const stampRomaji = document.getElementById('stampRomaji');
const stampKr = document.getElementById('stampKr');
const logList = document.getElementById('logList');
const galleryEl = document.getElementById('gallery');
let wordStats = {}; // 📊 단어별 정답/오답 통계 { [jp]: { correct: number, wrong: number } } - 모든 게임 모드 공통 누적

/* ⚡ 히라가나 스피드게임 전역 상태 */
let hsQuestions = [];
let hsIndex = 0;
let hsScore = 0;
let hsCombo = 0;
let hsMaxCombo = 0;
let hsCorrectCount = 0;
let hsAnswered = false;
let hsTimer = null;
const HS_BASE_TIME_MS = 2000; // 기본(SRS 3단계 기준) 제한 시간
const HS_MIN_TIME_MS = 1000;  // 아무리 안정된 글자라도 최소한 이 시간은 보장
let hsAdvanceTimer = null;
let currentHsQuestion = null;

/* ⚡ 히라가나 스피드게임 - 글자별 정답/오답 누적 통계 (브라우저에 저장되어 다음 플레이에도 유지됨)
   틀리거나 시간 초과된 글자는 오답 횟수가 올라가 다음 문제 세트에 더 자주 등장하고,
   게임 시작 화면의 46자 그리드에 정답/오답 횟수와 오답률 색상으로 표시됩니다 */
const HS_STATS_KEY = 'kotobaHsCharStats';

/* ⚡ 히라가나 스피드게임 - 오답 가중치 강도 (0=균등, 1=약하게, 2=보통(기본), 3=강하게, 4=오답만)
   글자별 오답 횟수에 이 배수를 곱해 다음 문제 세트에서 얼마나 더 자주 나올지 결정합니다.
   4(오답만)를 고르면 배수 대신, 오답률이 30% 이상인 글자만 출제 대상으로 걸러냅니다.
   브라우저에 저장되어 다음 플레이에도 선택했던 강도가 유지됩니다 */
const HS_WEIGHT_KEY = 'kotobaHsWeightLevel';

const HS_WEIGHT_ONLY_WRONG_LEVEL = 4;
const HS_WEIGHT_SRS_LEVEL = 5; // 🧠 간격 반복(SRS) 모드 전용 레벨 번호

/* 🧠 간격 반복 시스템(SRS, Spaced Repetition System) 공용 설정
   히라가나 카드찾기(hs)와 히라가나 쓰기(hw) 두 게임이 함께 사용합니다.
   - 각 글자는 0~7단계의 "숙련 단계(srsStage)"를 가지며, 단계가 높을수록
     오래 지나도 잘 기억한다고 보고 복습 간격을 늘립니다.
   - SRS_STAGE_DAYS[단계] = 그 단계의 "기억 안정도(S, 일 단위)".
     에빙하우스의 망각 곡선을 R(기억 유지 확률) = e^(-경과일수 / S) 로 근사해서,
     안정도가 클수록 시간이 지나도 R이 천천히 줄어듭니다(=오래 기억함).
   - 정답을 맞히면 단계 +1 (다음 복습까지 더 오래 걸림),
     틀리면 단계 -2 (다음 복습이 훨씬 빨리 돌아옴) — SM-2 계열 간이 알고리즘입니다 */
 // 약 30분·12시간·1일·3일·7일·16일·35일·90일
const SRS_MS_PER_DAY = 24 * 60 * 60 * 1000;

/* 🌙 수면 의존 기억 공고화 — 같은 경과 "시간"이라도 그 사이에 잠을 한 번이라도
   자고 왔는지가 장기 정착 여부를 크게 좌우합니다. 그런데 ms 경과량만 보면
   "오늘 저녁 11시 50분에 봤다가 자정 10분 뒤에 또 보는 것"과 "낮에 5분 간격으로
   두 번 보는 것"이 똑같이 취급됩니다. 그래서 ms 차이가 아니라 "달력상 자정을
   몇 번 넘겼는지"를 별도로 계산합니다(로컬 타임존 기준 날짜). */
function calendarDayNumber(ts) {
  const d = new Date(ts);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / SRS_MS_PER_DAY);
}

/* 마지막 복습 이후 "달력상 며칠이 지났는지"(자정 경계 기준)를 반환합니다.
   한 번도 복습한 적 없으면 null */
function daysSinceLastReviewCalendar(lastReviewAt, now) {
  if (!lastReviewAt) return null;
  return calendarDayNumber(now) - calendarDayNumber(lastReviewAt);
}

/* 하루 안에서 같은 글자를 몇 번까지는 정상적으로 SRS 단계를 올려주되(자연스러운
   반복 학습), 그 이상 반복하면 "잠을 안 자고 우겨넣는" 것과 같으므로 상승 폭을
   절반 정도로 낮춥니다 — 자고 온 복습만큼의 가치는 인정하지 않는다는 뜻입니다 */
const SRS_SAME_DAY_FULL_CREDIT_LIMIT = 3;

/* 🧠 정답/오답 결과를 글자별 SRS 상태(stat)에 반영합니다.
   stat 객체에 srsStage(숙련 단계)와 lastReviewAt(마지막 복습 시각)를 직접 갱신하며,
   히라가나 카드찾기(hsCharStats)와 히라가나 쓰기(hwCharStats) 양쪽 모두에서 재사용합니다.
   🌙 수면 의존 기억 공고화: 오늘 이미 여러 번(SRS_SAME_DAY_FULL_CREDIT_LIMIT번) 맞혀서
   단계를 올렸다면, 그 이후로는 한 번 걸러 한 번만 단계를 올립니다(=상승 폭을 절반으로) —
   실제로 밤을 한 번 자고 온 복습만큼의 안정화 효과는 없다고 보기 때문입니다.
   달력 날짜가 바뀌면(자정을 넘기면) 오늘 카운트를 자동으로 리셋합니다 */
function srsUpdateStat(stat, isCorrect) {
  if (typeof stat.srsStage !== 'number') stat.srsStage = 0;
  const now = Date.now();
  const today = calendarDayNumber(now);
  if (stat.lastReviewCalendarDay !== today) {
    stat.lastReviewCalendarDay = today;
    stat.sameDayCorrectCount = 0;
  }
  if (isCorrect) {
    stat.sameDayCorrectCount = (stat.sameDayCorrectCount || 0) + 1;
    const extra = stat.sameDayCorrectCount - SRS_SAME_DAY_FULL_CREDIT_LIMIT;
    // extra <= 0: 오늘 아직 한도 안 넘음 → 평소처럼 매번 상승
    // extra > 0: 한도 넘음 → 짝수 번째(2, 4, 6...)만 상승시켜 대략 절반 속도로
    const shouldRaiseStage = extra <= 0 || extra % 2 === 0;
    if (shouldRaiseStage) {
      // 맞혔으면 한 단계 올려 다음 복습 주기를 늘립니다 (최대 7단계, 90일)
      stat.srsStage = Math.min(stat.srsStage + 1, SRS_STAGE_DAYS.length - 1);
    }
  } else {
    // 틀렸으면 두 단계 내려 다음 복습이 훨씬 빨리 돌아오게 합니다 (최소 0단계)
    stat.srsStage = Math.max(stat.srsStage - 2, 0);
  }
  stat.lastReviewAt = now;
}

/* 🧠 에빙하우스 망각 곡선 근사식 R = e^(-t/S)를 이용해 "지금 이 글자를 잊어버렸을 확률"을
   0~1 사이 값으로 계산합니다. t = 마지막 복습 이후 지난 일수, S = 현재 단계의 기억 안정도.
   한 번도 복습한 적 없는 글자는 아직 전혀 기억이 자리잡지 않은 것으로 보고 망각 확률을
   최댓값(1)으로 둬서 최우선으로 노출되게 합니다 */
function srsForgetProbability(stat, now) {
  const stage = typeof stat.srsStage === 'number' ? stat.srsStage : 0;
  const stability = SRS_STAGE_DAYS[stage] || SRS_STAGE_DAYS[0];
  if (!stat.lastReviewAt) return 1;
  const elapsedDays = (now - stat.lastReviewAt) / SRS_MS_PER_DAY;
  const retention = Math.exp(-elapsedDays / stability);
  return 1 - retention;
}

/* 🧠 SRS 가중 무작위 뽑기 (히라가나 카드찾기/쓰기 공용).
   망각 확률이 높을수록(=복습 시점이 다가왔거나 이미 지났을수록) 더 높은 확률로 뽑히고,
   최근에 잘 기억하고 있는 글자는 낮은 확률로 뽑힙니다. 완전히 0으로 만들지는 않고
   최소 가중치(0.05)를 남겨서, 이미 잘 아는 글자도 가끔 등장해 장기 기억이 실제로
   유지되고 있는지 계속 점검하게 합니다 */
function srsWeightedPick(list, statsObj, count) {
  const now = Date.now();
  const pool = list.map(item => {
    const stat = statsObj[item.ch] || { srsStage: 0, lastReviewAt: null };
    const forget = srsForgetProbability(stat, now);
    return { item, weight: 0.05 + forget * 0.95 };
  });
  const result = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
    let r = Math.random() * totalWeight;
    let pickIdx = pool.length - 1;
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].weight;
      if (r <= 0) { pickIdx = j; break; }
    }
    result.push(pool[pickIdx].item);
    pool.splice(pickIdx, 1);
  }
  return result;
}

/* ⏱️ 난이도(시간 제한) 조절 — 이 글자의 SRS 단계에 맞는 시간 제한(ms)을 계산합니다.
   baseMs(원래 기본 시간)에 단계별 배수(SRS_TIME_MULTIPLIER)를 곱하고, 게임을 아예
   플레이할 수 없어지지 않도록 minMs 밑으로는 내려가지 않게 막습니다 */
function stageAdjustedTimeMs(baseMs, stage, minMs) {
  const mult = SRS_TIME_MULTIPLIER[stage] !== undefined ? SRS_TIME_MULTIPLIER[stage] : 1;
  return Math.max(minMs, Math.round(baseMs * mult));
}

/* 🧠 장기기억 현황판 — 카드찾기(hs, 재인)·쓰기(hw, 회상)·읽기(hr, 발화) 세 게임의
   SRS 통계(srsStage/lastReviewAt)를 종합해 글자 하나하나가 "지금 장기기억에 얼마나
   잘 저장돼 있는지"를 하나의 등급으로 판정합니다.
   - 회상(직접 산출)인 쓰기(hw)가 재인(hs)·발화(hr)보다 더 엄격한 증거라고 보고
     가중치를 2배로 둡니다.
   - 아무 게임에서도 안 풀어본 글자는 '미학습'.
   - 쓰기 기준 간격이 7일 이상(SRS 4단계 이상) 벌어졌고 유지율도 높으면 '장기기억 정착'.
   - 종합 유지율이 낮으면(=최근에 잊었을 가능성이 큼) '복습 필요', 그 사이는 '학습 중' */
function computeLtmStatus(ch) {
  const now = Date.now();

  function channelInfo(name, weight, stat) {
    const attempted = (stat.correct + stat.wrong) > 0;
    const retention = attempted ? (1 - srsForgetProbability(stat, now)) : null;
    const stage = typeof stat.srsStage === 'number' ? stat.srsStage : 0;
    return { name, weight, attempted, retention, stage, correct: stat.correct, wrong: stat.wrong, timeouts: stat.timeouts || 0, lastReviewAt: stat.lastReviewAt };
  }

  const channels = [
    channelInfo('카드찾기', 1, hsStats.getStat(ch)),
    channelInfo('쓰기', 2, hwStats.getStat(ch)),
    channelInfo('읽기', 1, hrStats.getStat(ch))
  ];
  const attemptedChannels = channels.filter(c => c.attempted);

  if (attemptedChannels.length === 0) {
    return { level: 'none', label: '미학습', avgRetention: null, channels };
  }

  const weightSum = attemptedChannels.reduce((s, c) => s + c.weight, 0);
  const avgRetention = attemptedChannels.reduce((s, c) => s + c.retention * c.weight, 0) / weightSum;

  const writingChannel = channels[1];
  const writingStable = writingChannel.attempted && writingChannel.stage >= 4 && writingChannel.retention >= 0.85;

  let level, label;
  if (writingStable && avgRetention >= 0.8) {
    level = 'stable'; label = '🟢 장기기억 정착';
  } else if (avgRetention < 0.5) {
    level = 'review'; label = '🔴 복습 필요';
  } else {
    level = 'progress'; label = '🟡 학습 중';
  }
  return { level, label, avgRetention, channels };
}

/* 46자 오십음도 그리드에 종합 등급(정착/학습중/복습필요/미학습)을 색상으로 렌더링하고,
   상단에 등급별 글자 수 요약을 보여줍니다. 패널을 열 때마다 최신 localStorage 값을
   다시 불러와서(load) 다른 게임에서 방금 갱신된 기록도 바로 반영합니다 */
function renderLtmDashboard() {
  hsStats.load();
  hwStats.load();
  hrStats.load();

  renderActiveSetPanel();

  const grid = document.getElementById('ltmStatGrid');
  if (!grid) return;
  grid.innerHTML = '';
  closeLtmDetail();

  grid.appendChild(document.createElement('div'));
  HS_COL_HEADS.forEach(head => {
    const h = document.createElement('div');
    h.className = 'hs-stat-colhead';
    h.textContent = head;
    grid.appendChild(h);
  });

  const counts = { stable: 0, progress: 0, review: 0, none: 0 };
  const colorClassByLevel = {
    stable: 'hs-stat-green',
    progress: 'hs-stat-yellow',
    review: 'hs-stat-red',
    none: 'hs-stat-neutral'
  };

  HS_TABLE_ROWS.forEach(row => {
    const rowHead = document.createElement('div');
    rowHead.className = 'hs-stat-rowhead';
    rowHead.textContent = row.label;
    grid.appendChild(rowHead);

    row.chars.forEach(ch => {
      if (!ch) {
        grid.appendChild(document.createElement('div'));
        return;
      }
      const status = computeLtmStatus(ch);
      counts[status.level] += 1;

      const cell = document.createElement('div');
      cell.className = 'hs-stat-cell ' + colorClassByLevel[status.level];
      const pctText = status.avgRetention === null ? '' : Math.round(status.avgRetention * 100) + '%';
      cell.innerHTML = `
        <span class="hs-stat-ch">${ch}</span>
        <span class="ltm-stat-pct">${pctText}</span>
      `;
      cell.addEventListener('click', () => showLtmDetail(ch, status));
      grid.appendChild(cell);
    });
  });

  const stableEl = document.getElementById('ltmCountStable');
  const progressEl = document.getElementById('ltmCountProgress');
  const reviewEl = document.getElementById('ltmCountReview');
  const noneEl = document.getElementById('ltmCountNone');
  if (stableEl) stableEl.textContent = counts.stable;
  if (progressEl) progressEl.textContent = counts.progress;
  if (reviewEl) reviewEl.textContent = counts.review;
  if (noneEl) noneEl.textContent = counts.none;

  const descEl = document.getElementById('ltmReviewDesc');
  if (descEl) {
    if (counts.review > 0) {
      descEl.textContent = `🔴 복습이 필요한 글자 ${counts.review}개 · 카드찾기·쓰기·읽기를 랜덤으로 섞어 복습해요`;
    } else if (counts.progress > 0) {
      descEl.textContent = `복습이 급한 글자는 없어요! 학습 중인 글자 ${counts.progress}개로 대신 다져볼까요?`;
    } else {
      descEl.textContent = '지금은 복습할 글자가 없어요 🎉';
    }
  }
}

/* 🔁 복습 세트 — 장기기억에 도움되는 회상형 게임(카드찾기·쓰기·읽기)을 랜덤 순서로
   섞어서, '복습 필요' 등급 글자만 골라 반복 학습시킵니다.
   - 복습이 급한 글자가 없으면 '학습 중' 글자로 대신 세트를 만듭니다.
   - 한 세트는 카드찾기/쓰기/읽기 3게임을 순서만 랜덤으로 섞어 한 번씩 진행합니다.
   - 각 게임이 끝나면(결과 화면) 잠시 뒤 자동으로 다음 게임으로 넘어갑니다 */
let reviewSessionActive = false;
let reviewSessionChars = [];
let reviewSessionGameQueue = [];
let reviewSessionRoundIndex = 0;
const REVIEW_GAME_TYPES = ['hiraganaSpeed', 'hiraganaWrite', 'hiraganaRead'];
const REVIEW_SESSION_ROUNDS = REVIEW_GAME_TYPES.length;

function getReviewCandidateChars() {
  const allChars = HIRAGANA_LIST.map(item => item.ch);
  const reviewChars = allChars.filter(ch => computeLtmStatus(ch).level === 'review');
  if (reviewChars.length > 0) return reviewChars;
  // 복습이 급한 글자가 없으면 '학습 중' 글자까지 포함해서 세트를 만듭니다
  return allChars.filter(ch => {
    const lvl = computeLtmStatus(ch).level;
    return lvl === 'review' || lvl === 'progress';
  });
}

function buildReviewGameQueue(rounds) {
  const queue = [];
  while (queue.length < rounds) {
    queue.push(...REVIEW_GAME_TYPES.slice().sort(() => Math.random() - 0.5));
  }
  return queue.slice(0, rounds);
}

function startReviewSession() {
  hsStats.load();
  hwStats.load();
  hrStats.load();

  const chars = getReviewCandidateChars();
  if (chars.length === 0) {
    alert('지금은 복습이 필요한 글자가 없어요! 정말 잘하고 있어요 🎉');
    return;
  }

  reviewSessionChars = chars;
  reviewSessionGameQueue = buildReviewGameQueue(REVIEW_SESSION_ROUNDS);
  reviewSessionRoundIndex = 0;
  reviewSessionActive = true;
  playNextReviewRound();
}

function playNextReviewRound() {
  if (reviewSessionRoundIndex >= reviewSessionGameQueue.length) {
    finishReviewSession();
    return;
  }
  const gameType = reviewSessionGameQueue[reviewSessionRoundIndex];
  reviewSessionRoundIndex += 1;
  updateReviewSessionBanner();

  launchGame(gameType);
  // 시작 화면을 거치지 않고, 복습 대상 글자만으로 바로 게임을 시작합니다
  if (gameType === 'hiraganaSpeed') startHiraganaSpeedGame();
  else if (gameType === 'hiraganaWrite') startHiraganaWriteGame();
  else if (gameType === 'hiraganaRead') startHiraganaReadGame();
}

/* 게임 결과 화면이 뜬 뒤, 복습 세트 진행 중이라면 잠시 보여준 다음 자동으로 다음 게임으로 넘어갑니다 */
function scheduleNextReviewRound() {
  if (!reviewSessionActive) return;
  setTimeout(() => { playNextReviewRound(); }, 2200);
}

function finishReviewSession() {
  reviewSessionActive = false;
  updateReviewSessionBanner();
  alert('복습 세트를 모두 마쳤어요! 🎉 장기기억 현황에서 얼마나 좋아졌는지 확인해보세요.');
  exitGameFullscreen();
  showTopMenu();
  openMenuPanel('menuLtmLevel');
  renderLtmDashboard();
}

/* "이전 메뉴"로 중간에 나가는 등, 세트를 끝까지 마치지 않고 멈출 때 호출됩니다 */
function cancelReviewSession() {
  if (!reviewSessionActive) return;
  reviewSessionActive = false;
  reviewSessionChars = [];
  reviewSessionGameQueue = [];
  reviewSessionRoundIndex = 0;
  updateReviewSessionBanner();
}

function updateReviewSessionBanner() {
  const banner = document.getElementById('reviewSessionBanner');
  if (!banner) return;
  if (!reviewSessionActive) {
    banner.style.display = 'none';
    banner.innerHTML = '';
    return;
  }
  const total = reviewSessionGameQueue.length;
  const current = Math.min(reviewSessionRoundIndex, total);
  banner.style.display = 'flex';
  banner.innerHTML = `
    <span>🔁 복습 세트 ${current}/${total} 진행 중</span>
    <button class="review-session-cancel-btn" onclick="cancelReviewSession()">그만하기</button>
  `;
}

/* 🎯 활성 학습 세트 컨트롤러 — 한 번에 학습 대상으로 올려두는 글자 수(활성 세트 크기)를
   전체 46자 중 일부만으로 시작해서, 최근 학습 반응(정확도·시간초과율·SRS 안정도)을 보고
   자동으로 늘리거나 보류합니다. 카드찾기/쓰기/읽기의 문제 출제 풀은 이 활성 세트 안에서만
   뽑히고(복습 세트는 예외), 장기기억 현황판의 46자 그리드 자체는 그대로 전체를 보여줍니다.
   확장 기준(필요 정확도/허용 시간초과율)도 고정값이 아니라, 방금 늘린 세트가 순조로웠는지/
   버거웠는지에 따라 strictness 값으로 조금씩 더 엄격해지거나 느슨해집니다 */
const ACTIVE_SET_STATE_KEY = 'kotobaActiveSetState';
const ACTIVE_SET_DEFAULT_SIZE = 5;
const ACTIVE_SET_LOG_MAX = 40;
const ACTIVE_SET_EVENT_LOG_MAX = 20;
const ACTIVE_SET_MIN_STRICTNESS = 0.8;
const ACTIVE_SET_MAX_STRICTNESS = 1.3;
const ACTIVE_SET_BASE_ACCURACY_THRESHOLD = 0.85;
const ACTIVE_SET_BASE_TIMEOUT_THRESHOLD = 0.15;

let activeSetState = null;

function loadActiveSetStateIfNeeded() {
  if (activeSetState) return;
  try {
    const raw = localStorage.getItem(ACTIVE_SET_STATE_KEY);
    activeSetState = raw ? JSON.parse(raw) : null;
  } catch (e) {
    activeSetState = null;
  }
  if (!activeSetState || typeof activeSetState !== 'object') {
    activeSetState = { size: ACTIVE_SET_DEFAULT_SIZE, strictness: 1.0, log: [], events: [], pendingCheck: false };
  }
  if (typeof activeSetState.size !== 'number') activeSetState.size = ACTIVE_SET_DEFAULT_SIZE;
  if (typeof activeSetState.strictness !== 'number') activeSetState.strictness = 1.0;
  if (!Array.isArray(activeSetState.log)) activeSetState.log = [];
  if (!Array.isArray(activeSetState.events)) activeSetState.events = [];
  if (typeof activeSetState.pendingCheck !== 'boolean') activeSetState.pendingCheck = false;
}

function saveActiveSetState() {
  try {
    localStorage.setItem(ACTIVE_SET_STATE_KEY, JSON.stringify(activeSetState));
  } catch (e) {
    /* 저장 실패해도 게임 진행에는 지장 없음 */
  }
}

/* 🧩 청킹(Chunking) — activeSetState.size는 계속 "글자 개수" 단위로 증감하지만, 실제로
   화면에 보여주고 문제를 뽑는 범위는 항상 행(あ행/か행/…) 경계에 맞춰 올림 처리합니다.
   예: size가 7이면 あ행(5자) + か행 앞 2자에서 끊기는 게 아니라, か행 전체까지 포함한
   10자로 반올림해서 "행 중간에서 잘린 세트"가 되지 않도록 합니다. 이미 진행 중이던
   사용자(localStorage에 저장된 size가 행 경계와 안 맞는 경우)도 강제 초기화 없이
   자동으로 다음 행 경계까지 흡수됩니다 */
function roundSizeUpToRowBoundary(size) {
  if (typeof HIRAGANA_ROW_GROUPS === 'undefined' || !HIRAGANA_ROW_GROUPS.length) return size;
  for (const group of HIRAGANA_ROW_GROUPS) {
    if (size <= group.endIndex) return group.endIndex;
  }
  return HIRAGANA_LIST.length;
}

/* 주어진(반올림된) size가 지금 어느 행까지 포함하고 있는지 반환합니다 (UI 표시용) */
function getCurrentRowGroupInfo(size) {
  if (typeof HIRAGANA_ROW_GROUPS === 'undefined' || !HIRAGANA_ROW_GROUPS.length) return null;
  let current = null;
  for (const group of HIRAGANA_ROW_GROUPS) {
    if (size >= group.startIndex + 1) current = group;
    else break;
  }
  return current;
}

/* 지금 학습 대상인 글자 목록(오십음도 순서 앞에서부터, 행 경계까지 올림한 개수만큼) */
function getActiveCharList() {
  loadActiveSetStateIfNeeded();
  const roundedSize = roundSizeUpToRowBoundary(activeSetState.size);
  const size = Math.min(roundedSize, HIRAGANA_LIST.length);
  return HIRAGANA_LIST.slice(0, size);
}

function logActiveSetEvent(text) {
  loadActiveSetStateIfNeeded();
  activeSetState.events.push({ text, ts: Date.now() });
  if (activeSetState.events.length > ACTIVE_SET_EVENT_LOG_MAX) {
    activeSetState.events = activeSetState.events.slice(-ACTIVE_SET_EVENT_LOG_MAX);
  }
  saveActiveSetState();
}

/* 카드찾기/쓰기/읽기에서 정답·오답·시간초과가 나올 때마다 호출됩니다.
   "지금 활성 세트 안"의 글자에 대한 시도만 커리큘럼 확장 판단 재료로 씁니다 —
   이미 안정된 옛 글자를 복습하다 튀어나온 오답 때문에 확장이 잘못 보류되지 않도록 합니다 */
function recordActiveSetAttempt(ch, isCorrect, isTimeout) {
  loadActiveSetStateIfNeeded();
  const activeChars = getActiveCharList().map(item => item.ch);
  if (!activeChars.includes(ch)) return;
  activeSetState.log.push({ correct: isCorrect, timeout: !!isTimeout, ts: Date.now() });
  if (activeSetState.log.length > ACTIVE_SET_LOG_MAX) {
    activeSetState.log = activeSetState.log.slice(-ACTIVE_SET_LOG_MAX);
  }
  saveActiveSetState();
}

/* 게임 한 판(10문제)이 끝날 때마다 호출됩니다. 최근 로그를 보고 활성 세트를 늘릴지/보류할지
   판단하고, 확장 기준(strictness)도 방금 확장이 순조로웠는지에 따라 함께 조정합니다 */
function evaluateActiveSetExpansion() {
  loadActiveSetStateIfNeeded();
  if (activeSetState.size >= HIRAGANA_LIST.length) return; // 이미 46자 전부 활성화됨

  const log = activeSetState.log;

  // 방금 확장한 직후라면, 그 확장이 순조로웠는지 먼저 점검해서 확장 기준(strictness)을 조정합니다
  if (activeSetState.pendingCheck && log.length >= 12) {
    const checkWindow = log.slice(0, 15);
    const checkAccuracy = checkWindow.filter(r => r.correct).length / checkWindow.length;
    if (checkAccuracy < 0.55) {
      activeSetState.strictness = Math.min(ACTIVE_SET_MAX_STRICTNESS, activeSetState.strictness + 0.15);
      logActiveSetEvent('🔧 방금 늘린 글자들이 조금 버거웠어요 — 다음부터는 더 신중하게 늘릴게요');
    } else if (checkAccuracy >= 0.9) {
      activeSetState.strictness = Math.max(ACTIVE_SET_MIN_STRICTNESS, activeSetState.strictness - 0.1);
      logActiveSetEvent('🔧 순조롭게 잘 따라오고 있어요 — 다음부터는 조금 더 빠르게 늘릴게요');
    }
    activeSetState.pendingCheck = false;
    saveActiveSetState();
  }

  if (log.length < 10) return; // 판단하기엔 데이터가 아직 부족함

  const recent = log.slice(-20);
  const accuracy = recent.filter(r => r.correct).length / recent.length;
  const timeoutRate = recent.filter(r => r.timeout).length / recent.length;

  const activeChars = getActiveCharList().map(item => item.ch);
  // 회상(직접 산출)인 쓰기(hw) 기준이 가장 엄격한 증거라서 확장 판단은 이 기준으로 합니다
  const stages = activeChars.map(ch => hwStats.getStat(ch).srsStage);
  const avgStage = stages.reduce((a, b) => a + b, 0) / stages.length;
  const minStage = Math.min(...stages);

  const accuracyThreshold = ACTIVE_SET_BASE_ACCURACY_THRESHOLD * activeSetState.strictness;
  const timeoutThreshold = ACTIVE_SET_BASE_TIMEOUT_THRESHOLD / activeSetState.strictness;

  const readyToExpand = avgStage >= 2 && minStage >= 1 && accuracy >= accuracyThreshold && timeoutRate <= timeoutThreshold;
  const struggling = accuracy < 0.6 || timeoutRate >= 0.35;

  if (readyToExpand) {
    let increment = 2;
    if (accuracy >= 0.95 && timeoutRate <= 0.05) increment = 5;
    else if (accuracy >= 0.9) increment = 3;
    // strictness가 높을수록(최근에 버거웠던 이력이 있을수록) 한 번에 늘리는 양도 보수적으로 줄입니다
    increment = Math.max(1, Math.round(increment / activeSetState.strictness));

    const before = activeSetState.size;
    activeSetState.size = Math.min(activeSetState.size + increment, HIRAGANA_LIST.length);
    activeSetState.log = [];
    activeSetState.pendingCheck = true;
    saveActiveSetState();

    // 청킹: 로그 메시지도 "글자 수"가 아니라 실제로 노출되는 행 경계 기준 크기로 보여줍니다
    const roundedBefore = roundSizeUpToRowBoundary(before);
    const roundedAfter = roundSizeUpToRowBoundary(activeSetState.size);
    const rowInfo = getCurrentRowGroupInfo(roundedAfter);
    const rowText = rowInfo ? ` (${rowInfo.name} 완료)` : '';
    if (roundedAfter > roundedBefore) {
      logActiveSetEvent(`✅ 활성 글자 ${roundedBefore}자 → ${roundedAfter}자로 확장${rowText} (정답률 ${Math.round(accuracy * 100)}%, 시간초과 ${Math.round(timeoutRate * 100)}%)`);
    } else {
      logActiveSetEvent(`📈 다음 행까지 조금 더 가까워졌어요 (정답률 ${Math.round(accuracy * 100)}%, 시간초과 ${Math.round(timeoutRate * 100)}%)`);
    }
  } else if (struggling) {
    logActiveSetEvent(`⏸️ 확장 보류 — 정답률 ${Math.round(accuracy * 100)}%, 시간초과 ${Math.round(timeoutRate * 100)}% (지금 글자에 더 집중해요)`);
  }
}

/* "장기기억 현황" 패널 상단의 활성 세트 진행 카드를 갱신합니다 */
function renderActiveSetPanel() {
  loadActiveSetStateIfNeeded();
  const countEl = document.getElementById('ltmActiveSetCount');
  if (!countEl) return;

  const total = HIRAGANA_LIST.length;
  const size = Math.min(roundSizeUpToRowBoundary(activeSetState.size), total);
  countEl.textContent = `${size} / ${total}자`;

  const barFillEl = document.getElementById('ltmActiveSetBarFill');
  if (barFillEl) barFillEl.style.width = Math.round((size / total) * 100) + '%';

  const charsEl = document.getElementById('ltmActiveSetChars');
  if (charsEl) {
    charsEl.innerHTML = getActiveCharList().map(item => `<span class="ltm-activeset-ch">${item.ch}</span>`).join('');
  }

  // 청킹: 지금 어느 행(あ행/か행/…)까지 학습 중인지 함께 보여줍니다
  const rangeEl = document.getElementById('ltmActiveSetRange');
  if (rangeEl) {
    const rowInfo = getCurrentRowGroupInfo(size);
    if (size >= total) {
      rangeEl.textContent = '오십음도 전체를 학습하고 있어요';
    } else if (rowInfo) {
      rangeEl.textContent = `${rowInfo.name}까지 학습 중이에요 (행 단위로 묶어서 배워요)`;
    } else {
      rangeEl.textContent = '';
    }
  }

  const logEl = document.getElementById('ltmActiveSetLog');
  if (logEl) {
    const events = activeSetState.events.slice(-6).reverse();
    logEl.innerHTML = events.length > 0
      ? events.map(e => `<div class="ltm-activeset-log-row">${e.text}</div>`).join('')
      : '<div class="ltm-activeset-log-row">아직 기록이 없어요 — 게임을 몇 판 하면 자동으로 조절이 시작돼요</div>';
  }
}

/* 활성 세트를 처음(기본 5자)부터 다시 늘려가도록 되돌립니다. 글자별 정답/오답 기록 자체는 지우지 않습니다 */
function resetActiveSetProgress() {
  const confirmed = confirm('지금 배우는 글자 범위를 처음(5자)부터 다시 늘려가도록 되돌릴까요?\n(이미 쌓인 글자별 정답/오답 기록 자체는 지워지지 않아요)');
  if (!confirmed) return;
  activeSetState = { size: ACTIVE_SET_DEFAULT_SIZE, strictness: 1.0, log: [], events: [], pendingCheck: false };
  saveActiveSetState();
  renderActiveSetPanel();
}

/* 그리드의 글자 칸을 누르면 게임별(카드찾기/쓰기/읽기) 정답·오답 횟수, 유지율(%),
   마지막 복습 시점을 자세히 보여줍니다 */
/* 🧠 메타인지 — 이 글자에 대해 지금까지 남긴 "확실해요/헷갈려요" 예측과 실제 정답 여부를
   비교해 요약합니다. 자기판단 기록이 하나도 없으면 null을 반환해서 상세보기에서 해당
   섹션을 아예 표시하지 않게 합니다 (쓰기 게임의 회상 검증에서만 기록됨) */
function computeSelfJudgmentSummary(ch) {
  const stat = hwStats.getStat(ch);
  const judgments = Array.isArray(stat.selfJudgments) ? stat.selfJudgments : [];
  if (judgments.length === 0) return null;
  const confident = judgments.filter(j => j.predicted === 'confident');
  const unsure = judgments.filter(j => j.predicted === 'unsure');
  return {
    confidentCount: confident.length,
    confidentWrong: confident.filter(j => !j.wasCorrect).length,
    unsureCount: unsure.length,
    unsureCorrect: unsure.filter(j => j.wasCorrect).length
  };
}

/* 🔤 처리 수준 이론 — 이 글자로 시작하는 대표 단어를 상세보기 하단에 보여줘서
   글자를 "모양-발음"만이 아니라 "뜻"까지 함께 만나게 합니다(깊은 처리 유도).
   해당 글자에 등록된 단어가 없으면(예: を, ん) 안내 문구(note)만 보여줍니다.
   HIRAGANA_SAMPLE_WORDS에 아예 데이터가 없는 글자(탁음/요음 등)는 섹션 자체를 생략합니다 */
function renderHiraganaSampleWordsHtml(ch) {
  const entry = HIRAGANA_SAMPLE_WORDS[ch];
  if (!entry) return '';
  if (Array.isArray(entry.words) && entry.words.length > 0) {
    const chips = entry.words.map(w => `<span class="ltm-detail-word-chip"><b>${w.jp}</b> · ${w.kr}</span>`).join('');
    return `
    <div class="ltm-detail-words">
      <div class="ltm-detail-words-title">🔤 이 글자로 시작하는 단어</div>
      <div class="ltm-detail-word-list">${chips}</div>
    </div>`;
  }
  if (entry.note) {
    return `
    <div class="ltm-detail-words">
      <div class="ltm-detail-words-title">🔤 이 글자로 시작하는 단어</div>
      <div class="ltm-detail-words-note">${entry.note}</div>
    </div>`;
  }
  return '';
}

/* 🌙 수면 의존 기억 공고화 — 오늘 이미 한도(SRS_SAME_DAY_FULL_CREDIT_LIMIT)를 넘겨서
   반복한 채널이 있으면, "더 풀어도 상승 폭이 절반으로 줄어든다"는 걸 부드럽게 안내합니다.
   해당 사항이 없으면 빈 문자열(섹션 생략) */
function computeSleepConsolidationNote(ch) {
  const today = calendarDayNumber(Date.now());
  const engines = [hsStats, hwStats, hrStats];
  const cappedToday = engines.some(engine => {
    const stat = engine.getStat(ch);
    return stat.lastReviewCalendarDay === today && stat.sameDayCorrectCount > SRS_SAME_DAY_FULL_CREDIT_LIMIT;
  });
  if (!cappedToday) return '';
  return `<div class="ltm-detail-row ltm-detail-sleep">🌙 오늘 이미 여러 번 복습했어요 — 지금부터는 하루 자고 다시 만나야 더 오래 기억에 남아요</div>`;
}

function showLtmDetail(ch, status) {
  const box = document.getElementById('ltmDetailBox');
  if (!box) return;
  const now = Date.now();

  const rowsHtml = status.channels.map(c => {
    if (!c.attempted) {
      return `<div class="ltm-detail-row"><b>${c.name}</b><span>아직 안 풀어봤어요</span></div>`;
    }
    const pct = Math.round(c.retention * 100);
    const daysAgo = c.lastReviewAt ? Math.floor((now - c.lastReviewAt) / SRS_MS_PER_DAY) : null;
    const agoText = daysAgo === null ? '' : (daysAgo <= 0 ? ' · 오늘 복습' : ` · ${daysAgo}일 전 복습`);
    const timeoutText = c.timeouts > 0 ? `(시간초과 ${c.timeouts})` : '';
    return `<div class="ltm-detail-row"><b>${c.name}</b><span>정답 ${c.correct} · 오답 ${c.wrong}${timeoutText} · 유지율 약 ${pct}%${agoText}</span></div>`;
  }).join('');

  // 🧠 메타인지 — 이 글자에 대한 자기판단 예측 정확도(기록이 있을 때만 표시)
  const judgmentSummary = computeSelfJudgmentSummary(ch);
  let judgmentHtml = '';
  if (judgmentSummary) {
    const parts = [];
    if (judgmentSummary.confidentCount > 0) {
      parts.push(judgmentSummary.confidentWrong > 0
        ? `😎 확실하다고 한 ${judgmentSummary.confidentCount}번 중 ${judgmentSummary.confidentWrong}번 틀렸어요 — 과신 주의!`
        : `😎 확실하다고 한 ${judgmentSummary.confidentCount}번 모두 맞혔어요`);
    }
    if (judgmentSummary.unsureCount > 0) {
      const pct = Math.round((judgmentSummary.unsureCorrect / judgmentSummary.unsureCount) * 100);
      parts.push(`🤔 헷갈린다고 한 ${judgmentSummary.unsureCount}번 중 실제로 맞힌 비율 ${pct}%`);
    }
    judgmentHtml = `<div class="ltm-detail-row ltm-detail-judgment"><b>🧠 자기 예측 vs 실제</b><span>${parts.join(' · ')}</span></div>`;
  }

  // 🔤 처리 수준 — 이 글자로 시작하는 대표 단어(있을 때만)
  const sampleWordsHtml = renderHiraganaSampleWordsHtml(ch);

  // 🌙 수면 의존 기억 공고화 — 오늘 이미 여러 번 반복했다면 안내(해당 없으면 빈 문자열)
  const sleepNoteHtml = computeSleepConsolidationNote(ch);

  box.innerHTML = `
    <div class="ltm-detail-header">
      <span class="ltm-detail-ch">${ch}</span>
      <span class="ltm-detail-label">${status.label}</span>
      <button class="ltm-detail-close" onclick="closeLtmDetail()">✕</button>
    </div>
    ${rowsHtml}
    ${judgmentHtml}
    ${sampleWordsHtml}
    ${sleepNoteHtml}
  `;
  box.style.display = 'block';
}

function closeLtmDetail() {
  const box = document.getElementById('ltmDetailBox');
  if (box) box.style.display = 'none';
}

/* ⚡ 히라가나 스피드게임 - 문제마다 보여줄 카드 개수(정답 카드 포함, 2~4장)
   브라우저에 저장되어 다음 플레이에도 선택했던 개수가 유지됩니다 */
const HS_CARD_COUNT_KEY = 'kotobaHsCardCount';
let hsCardCount = 2;

/* 🖊️ 히라가나 쓰기 스피드게임 전역 상태 (5초 안에 글자를 따라 써보는 게임) */
let hwQuestions = [];
let hwIndex = 0;
let hwScore = 0;
let hwCombo = 0;
let hwMaxCombo = 0;
let hwCorrectCount = 0;
let hwAnswered = false;
let hwLocked = false; // 문제당 한 번만 쓰도록(잠금) 처리하는 플래그
let hwTimer = null;
let hwAdvanceTimer = null;
let currentHwQuestion = null;
const HW_TIME_LIMIT = 5000; // 기본(SRS 3단계 기준) 제한 시간 5초
const HW_MIN_TIME_MS = 3000; // 아무리 안정된 글자라도 실제로 쓸 시간은 보장

/* 🖊️ 히라가나 쓰기 캔버스 상태 (히라가나 스피드게임의 카드 선택과 달리, 실제로 손으로 그려서 판정합니다) */
const HW_CELL = 8;
const HW_MATCH_THRESHOLD = 60;
let hwGuideCanvas, hwGuideCtx, hwDrawCanvas, hwDrawCtx;
let hwCharBox = null; // 획순/따라쓰기 점선 오버레이 계산에 쓰이는 현재 안내 글자의 위치·크기 정보
let hwCanvasInited = false;
let hwDrawHandle = null; // 그리기 도중 문제가 바뀔 때 강제로 리셋하는 데 사용 (hwInkEngine.setupDrawing이 반환)
let hwTargetMask = null;
let hwGridCols = 0, hwGridRows = 0, hwTargetCount = 0;

/* 🖊️ 히라가나 쓰기 스피드게임 - 글자별 성공/실패 누적 통계.
   히라가나 스피드게임(HS_STATS_KEY)과는 별도의 키에 저장되어 서로 통계가 섞이지 않습니다 */
const HW_STATS_KEY = 'kotobaHwCharStats';

/* 🖊️ 히라가나 쓰기 스피드게임 - 실패(오답) 가중치 강도. 히라가나 스피드게임과 동일한
   배수/오답만 필터 규칙(HS_WEIGHT_MULTIPLIERS, HS_WEIGHT_ONLY_WRONG_LEVEL)을 그대로
   재사용하되, 저장 키와 통계 데이터는 별도로 관리합니다 */
const HW_WEIGHT_KEY = 'kotobaHwWeightLevel';

/* 🎤 히라가나 읽기 게임 전역 상태
   히라가나 글자를 보고 소리 내어 읽으면, 음성 인식으로 맞았는지 판정하는 게임.
   - 문제당 최대 2번 시도할 수 있고, 시도마다 4.5초의 인식 제한 시간이 있음
   - 1차 시도에서 맞히면: 정답 점수 +2, 바로 다음 문제
   - 1차 시도에서 틀리면(오인식/시간초과): 2초 대기 후 2차 시도
   - 2차 시도에서 맞히면: 정답 점수 +1, 다음 문제 / 2차도 틀리면: 오답 점수 +2, 다음 문제
   - 총 10문제 풀고 결과 화면(정답 점수/오답 점수) 표시 */
let hrQuestions = [];
let hrIndex = 0;
let hrCorrectScore = 0;
let hrWrongScore = 0;
let hrAttempt = 0; // 1 또는 2
let hrAnswered = false;
let hrListening = false;
let hrRecognition = null;
let hrAttemptTimer = null; // 시도당 인식 제한 타이머
let hrRetryTimer = null;   // 1차 실패 후 2차 시도까지 대기하는 타이머
let hrAdvanceTimer = null;
let currentHrQuestion = null;
const HR_ATTEMPT_TIME_LIMIT = 4500; // 기본(SRS 3단계 기준) 시도당 제한 시간 (음성 인식 서버 왕복 시간을 고려해 2초에서 늘림)
const HR_MIN_TIME_MS = 3000; // 인식 서버 왕복 시간을 감안해 이보다 짧게는 줄이지 않음
const HR_RETRY_DELAY = 2000; // 1차 실패 후 2차 시도까지 대기 시간
let hrCurrentTimeLimit = HR_ATTEMPT_TIME_LIMIT; // 이번 문제의 SRS 단계로 조정된 실제 제한 시간
let hrAnyTimeoutThisQuestion = false; // 이번 문제에서 시도 중 시간초과가 있었는지(오답과 구분用)

/* 🎤 히라가나 읽기 게임 - 글자별 성공/실패 누적 통계 및 출제 가중치.
   히라가나 쓰기(HW_STATS_KEY)와는 별도의 키에 저장되어 서로 통계가 섞이지 않습니다 */
const HR_STATS_KEY = 'kotobaHrCharStats';
const HR_WEIGHT_KEY = 'kotobaHrWeightLevel';


/* 🧠 단어 메모리 게임 전역 상태 */
let wmCount = 2;
let wmQuestionIndex = 0;
let wmScore = 0;
let wmCombo = 0;
let wmMaxCombo = 0;
let wmCorrectCount = 0;
let wmSequence = [];
let wmUserProgress = 0;
let wmAnswered = false;
let wmTimer = null;
let wmAdvanceTimer = null;
let wmSequenceTimer = null;

/* 🧩 그림 반쪽 맞추기 게임 설정값 */
const EAWASE_TOTAL_QUESTIONS = 10;

/* 🌑 실루엣 맞추기 게임 설정값 (이모지 실루엣 + 발음을 보고/듣고 히라가나 이름을
   4지선다로 맞히면, 실루엣에 색이 채워지며 이름을 다시 읽어주는 게임)
   단어 데이터는 그림 반쪽 맞추기와 동일한 EAWASE_WORDS를 재사용합니다 */
const SIL_TOTAL_QUESTIONS = 10;


let riddleScore = 0;
let riddleCombo = 0;
let currentRiddle = null;
let previousRiddleJp = null;
let riddleHintIndex = 0;
let riddleTranslationRevealCount = 0; // 지금까지 정답을 시도해 한글 뜻이 공개된 힌트 개수
let isRiddleAnswering = false;
let riddleAdvanceTimer = null;
let riddleHintTimer = null; // 힌트가 1초마다 자동으로 다음 힌트로 넘어가게 하는 타이머
let riddleHintSlots = null; // 이번 문제에 쓸 5개짜리 힌트(일본어+한글) 배열
const RIDDLE_TOTAL_HINTS = 5;

/* 🌈 '생활 문답' 게임 상태 변수 (주제 필터는 changeLifeqaTopic/getLifeqaPool에서 계속 사용) */
let lifeqaTopicFilter = 'all';

/* 🗣️ 24개월 전후 아기가 많이 쓰는 2단어 문장(二語文) 데이터
   words: 실제로 말하는 순서 그대로의 두 단어(jp 기준, DICTIONARY와 매칭됨) */


/* 🧩 두 단어가 합쳐져 새로운 하나의 단어가 되는 합성어(複合語) 데이터
   (예: あさ+ごはん → あさごはん / 아침+밥 → 아침밥)
   p1, p2: 합쳐지는 두 부분(순서대로), jp/romaji/kr/emoji: 합쳐진 결과 단어
   실제 발음이 살짝 바뀌는 경우(연탁, 예: ひ→び)도 있는데, 이는 실제 일본어에서도
   자연스럽게 일어나는 현상이라 그대로 반영했습니다. */


/* 합성어 오답 선택지(방해 요소)용 — 모든 합성어의 부분 단어를 중복 없이 모아둡니다 */
const COMPOUND_PARTS = (function(){
  const seen = new Map();
  COMPOUNDS.forEach(c => {
    [c.p1, c.p2].forEach(p => { if(!seen.has(p.jp)) seen.set(p.jp, p); });
  });
  return Array.from(seen.values());
})();

/* 합성어 맞추기 / 2단어 문장 맞히기 게임의 점수·타이머 등 상태는
   createSequencePickQuizGame() 엔진 내부 클로저에서 관리합니다. */

let writeScore = 0;
let writeCombo = 0;
let currentWritingLevel = 1;
let currentInputType = 'A';
let currentWritingWord = null;
let isWritingAnswering = false;

/* 🃏 MATCHING CARD GAME VARIABLES */
let currentGridSize = 4; // 기본 4x4
let matchCards = [];
let selectedFlippedCards = [];
let matchedPairsCount = 0;
let totalPairsCount = 0;
let matchTimerInterval = null;
let matchTimeElapsed = 0;
let isMatchGameProcessing = false;

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/* 🎉 정답 시 화면에 간단한 종이 폭죽(confetti)을 터뜨려 성취감을 시각적으로 강화 */


let confettiBusy = false;

function launchConfetti() {
  try {
    // 짧은 시간 내 연속 정답 시 중첩되어 과하게 쏟아지지 않도록 살짝 쿨다운을 둠
    if (confettiBusy) return;
    confettiBusy = true;
    setTimeout(() => { confettiBusy = false; }, 350);

    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const pieceCount = 26;
    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement('div');
      const useEmoji = Math.random() < 0.25;

      if (useEmoji) {
        piece.className = 'confetti-piece shape-emoji';
        piece.textContent = CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];
      } else {
        const isCircle = Math.random() < 0.5;
        piece.className = 'confetti-piece ' + (isCircle ? 'shape-circle' : 'shape-strip');
        const size = 6 + Math.random() * 7;
        piece.style.width = size + 'px';
        piece.style.height = (isCircle ? size : size * 0.4) + 'px';
        piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      }

      piece.style.left = (Math.random() * 100) + '%';
      piece.style.animationDuration = (0.9 + Math.random() * 0.8) + 's';
      piece.style.animationDelay = (Math.random() * 0.18) + 's';
      piece.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
      piece.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      container.appendChild(piece);
    }

    setTimeout(() => { container.remove(); }, 2100);
  } catch (e) {
    console.log("Confetti error", e);
  }
}

/* ✨ 정답으로 강조된 요소(이모지, 카드 등)에 통통 튀는 축하 모션을 살짝 더해줌 */
function celebrateElement(el) {
  if (!el) return;
  el.classList.remove('celebrate-bounce');
  void el.offsetWidth;
  el.classList.add('celebrate-bounce');
}

/* 🌟 정답 이모지를 화면 전체 크기로 확대했다가 제자리로 되돌리는 풀스크린 축하 연출 */
let fullscreenCelebrateTimer = null;
function celebrateFullscreenEmoji(emoji) {
  const overlay = document.getElementById('fullscreenCelebrate');
  const emojiEl = document.getElementById('fullscreenCelebrateEmoji');
  if (!overlay || !emojiEl || !emoji) return;
  clearTimeout(fullscreenCelebrateTimer);
  overlay.classList.remove('play');
  void overlay.offsetWidth;
  emojiEl.textContent = emoji;
  overlay.classList.add('play');
  fullscreenCelebrateTimer = setTimeout(() => {
    overlay.classList.remove('play');
  }, 950);
}

/* 🐾 정답을 맞힌 단어가 동물이면 이모지·정답음과 함께 그 동물의 울음소리를 재생 —
   시각(확대되는 이모지)·청각(울음소리)·정답음이 동시에 일치하도록 하여 연합 학습 효율을 높임 */


function playCryTone(ctx, startTime, freqFrom, freqTo, duration, type, gainPeak, delay) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const t0 = startTime + (delay || 0);
  osc.frequency.setValueAtTime(freqFrom, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqTo, 1), t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(gainPeak, t0 + duration * 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.03);
}

function playAnimalCry(word) {
  return; // 🔇 동물 울음소리 효과음은 모든 게임에서 비활성화되었습니다 (사용자 요청)
  if (!word || !word.jp) return;
  const kind = ANIMAL_CRY_MAP[word.jp];
  if (!kind) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime + 0.05; // 정답음과 살짝 겹치지 않게 아주 짧게 지연
    if (kind === 'dog') {
      playCryTone(ctx, now, 300, 190, 0.13, 'sawtooth', 0.2, 0);
      playCryTone(ctx, now, 320, 200, 0.13, 'sawtooth', 0.2, 0.18);
    } else if (kind === 'cat') {
      playCryTone(ctx, now, 500, 950, 0.35, 'sine', 0.16, 0);
    } else if (kind === 'bird') {
      playCryTone(ctx, now, 1500, 2200, 0.09, 'sine', 0.12, 0);
      playCryTone(ctx, now, 1800, 2600, 0.09, 'sine', 0.12, 0.12);
      playCryTone(ctx, now, 1600, 2400, 0.09, 'sine', 0.12, 0.24);
    } else if (kind === 'horse') {
      playCryTone(ctx, now, 220, 480, 0.3, 'sawtooth', 0.18, 0);
    } else if (kind === 'bear') {
      playCryTone(ctx, now, 160, 90, 0.5, 'sawtooth', 0.2, 0);
    } else if (kind === 'fish') {
      playCryTone(ctx, now, 700, 1100, 0.06, 'sine', 0.08, 0);
      playCryTone(ctx, now, 700, 1100, 0.06, 'sine', 0.08, 0.1);
    }
  } catch (e) {
    console.log("Animal cry audio error", e);
  }
}

/* ✅ 정답 시 통통 튀기+풀스크린 확대+(동물이면) 울음소리까지 한번에 실행하는 통합 축하 함수 */
function celebrateCorrect(el, word, emojiOverride) {
  celebrateElement(el);
  celebrateFullscreenEmoji(emojiOverride || (word && word.emoji));
  playAnimalCry(word);
}

/* ✅ 공용 톤 재생 헬퍼 — oscillator type, 주파수 스텝, gain, 길이만 받아서
   playCorrectSound/playWrongSound/playFlipSound가 공통으로 사용 (7순위 통합) */
function playTone({ type, freqSteps, gainStart, gainEnd, duration }) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = type;
    freqSteps.forEach(step => {
      const t = now + step.time;
      if (step.ramp === 'linear') {
        osc1.frequency.linearRampToValueAtTime(step.value, t);
      } else if (step.ramp === 'exponential') {
        osc1.frequency.exponentialRampToValueAtTime(step.value, t);
      } else {
        osc1.frequency.setValueAtTime(step.value, t);
      }
    });
    gain1.gain.setValueAtTime(gainStart, now);
    gain1.gain.exponentialRampToValueAtTime(gainEnd, now + duration);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + duration);
  } catch (e) {
    console.log("Audio play error", e);
  }
}

function playCorrectSound() {
  launchConfetti();
  playTone({
    type: 'sine',
    freqSteps: [
      { time: 0, value: 523.25 },
      { time: 0.08, value: 659.25 },
      { time: 0.16, value: 783.99 },
    ],
    gainStart: 0.12,
    gainEnd: 0.01,
    duration: 0.4,
  });
}

function playWrongSound() {
  playTone({
    type: 'triangle',
    freqSteps: [
      { time: 0, value: 220.00 },
      { time: 0.25, value: 146.83, ramp: 'linear' },
    ],
    gainStart: 0.15,
    gainEnd: 0.01,
    duration: 0.3,
  });
}

function playFlipSound() {
  playTone({
    type: 'sine',
    freqSteps: [
      { time: 0, value: 330 },
      { time: 0.08, value: 440, ramp: 'exponential' },
    ],
    gainStart: 0.06,
    gainEnd: 0.01,
    duration: 0.1,
  });
}

function buildGallery(){
  galleryEl.innerHTML = "";
  const sorted = getActiveWords().slice().sort((a,b)=> a.jp.localeCompare(b.jp,'ja'));
  sorted.forEach(w=>{
    const c = document.createElement('div');
    c.className='gcard';
    c.dataset.jp = w.jp;
    const rateCls = getWrongRateClass(w.jp);
    if (rateCls) c.classList.add(rateCls);
    c.innerHTML = `
      <div class="emo">${w.emoji}${categoryBadgeHTML(w)}</div>
      <div class="jp">${w.jp}</div>
      <div class="kr">${w.kr}</div>
    `;
    c.addEventListener('click', (e) => {
      e.stopPropagation();
      c.classList.toggle('show-kr');
      speakWithHighlight(w.jp, c.querySelector('.jp'), { rate: 0.85 });
    });
    galleryEl.appendChild(c);
  });
}
buildGallery();

function switchMode(mode) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.mode-content').forEach(content => content.classList.remove('active'));

  if(mode === 'speech') {
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.getElementById('speechMode').classList.add('active');
    stopPronounceListening();
  } else if (mode === 'quiz') {
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    document.getElementById('quizMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    initQuizGame();
    getAudioContext();
  } else if (mode === 'audioEmoji') {
    document.querySelectorAll('.tab-btn')[2].classList.add('active');
    document.getElementById('audioEmojiMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    generateAudioEmojiQuiz();
    getAudioContext();
  } else if (mode === 'writing') {
    document.querySelectorAll('.tab-btn')[3].classList.add('active');
    document.getElementById('writingMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    generateWritingQuestion();
    getAudioContext();
    initKeyboard();
    initCanvas();
  } else if (mode === 'matching') {
    document.querySelectorAll('.tab-btn')[4].classList.add('active');
    document.getElementById('matchingMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initMatchGame();
  } else if (mode === 'pronounce') {
    document.querySelectorAll('.tab-btn')[5].classList.add('active');
    document.getElementById('pronounceMode').classList.add('active');
    stopListening();
    generatePronounceQuestion();
    getAudioContext();
  } else if (mode === 'sentence') {
    document.querySelectorAll('.tab-btn')[6].classList.add('active');
    document.getElementById('sentenceMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    initSentenceGame();
    getAudioContext();
  } else if (mode === 'scene') {
    document.querySelectorAll('.tab-btn')[7].classList.add('active');
    document.getElementById('sceneMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    initSceneMode();
  } else if (mode === 'compound') {
    document.querySelectorAll('.tab-btn')[8].classList.add('active');
    document.getElementById('compoundMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    initCompoundGame();
    getAudioContext();
  } else if (mode === 'exposure') {
    document.querySelectorAll('.tab-btn')[9].classList.add('active');
    document.getElementById('exposureMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    generateExposureQuestion();
    getAudioContext();
  } else if (mode === 'songs') {
    document.querySelectorAll('.tab-btn')[10].classList.add('active');
    document.getElementById('songsMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    renderSongList();
    closeSongDetail();
  } else if (mode === 'linematch') {
    document.querySelectorAll('.tab-btn')[13].classList.add('active');
    document.getElementById('lineMatchMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initLineMatchGame();
  } else if (mode === 'onomatopoeia') {
    document.querySelectorAll('.tab-btn')[14].classList.add('active');
    document.getElementById('onomatopoeiaMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    generateOnomatopoeiaQuestion();
  } else if (mode === 'trace') {
    document.querySelectorAll('.tab-btn')[11].classList.add('active');
    document.getElementById('traceMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initTraceCanvas();
    setTraceStudyMode('word');
  } else if (mode === 'storybook') {
    document.querySelectorAll('.tab-btn')[12].classList.add('active');
    document.getElementById('storybookMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    initStorybookMode();
  } else if (mode === 'emojiStorybook') {
    document.getElementById('emojiStorybookMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    initEmojiStorybookMode();
  } else if (mode === 'karaoke') {
    document.querySelectorAll('.tab-btn')[13].classList.add('active');
    document.getElementById('karaokeMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    renderKaraokeList();
    closeKaraokeSong();
  } else if (mode === 'ebook') {
    document.querySelectorAll('.tab-btn')[16].classList.add('active');
    document.getElementById('ebookMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    initEbookMode();
  } else if (mode === 'riddle') {
    document.querySelectorAll('.tab-btn')[17].classList.add('active');
    document.getElementById('riddleMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    generateRiddleQuestion();
  } else if (mode === 'qa') {
    document.querySelectorAll('.tab-btn')[18].classList.add('active');
    document.getElementById('qaMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    generateQaQuestion();
  } else if (mode === 'lifeqa') {
    document.querySelectorAll('.tab-btn')[19].classList.add('active');
    document.getElementById('lifeqaMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    generateLifeqaQuestion();
  } else if (mode === 'shop') {
    document.querySelectorAll('.tab-btn')[20].classList.add('active');
    document.getElementById('shopMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    generateShopQuestion();
  } else if (mode === 'spelling') {
    document.querySelectorAll('.tab-btn')[21].classList.add('active');
    document.getElementById('spellingMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    generateSpellingQuestion();
  } else if (mode === 'wordsearch') {
    document.querySelectorAll('.tab-btn')[22].classList.add('active');
    document.getElementById('wordsearchMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initWordSearchGame();
  } else if (mode === 'worksheet') {
    document.querySelectorAll('.tab-btn')[23].classList.add('active');
    document.getElementById('worksheetMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initWorksheetMode();
  } else if (mode === 'hiraganaSpeed') {
    document.querySelectorAll('.tab-btn')[24].classList.add('active');
    document.getElementById('hiraganaSpeedMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initHiraganaSpeedGame();
  } else if (mode === 'wordMemory') {
    document.querySelectorAll('.tab-btn')[25].classList.add('active');
    document.getElementById('wordMemoryMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initWordMemoryGame();
  } else if (mode === 'hiraganaWrite') {
    document.querySelectorAll('.tab-btn')[26].classList.add('active');
    document.getElementById('hiraganaWriteMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initHiraganaWriteGame();
  } else if (mode === 'dakuonTest') {
    document.querySelectorAll('.tab-btn')[27].classList.add('active');
    document.getElementById('dakuonTestMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initDtTestMode();
  } else if (mode === 'eawase') {
    document.querySelectorAll('.tab-btn')[28].classList.add('active');
    document.getElementById('eawaseMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initEawaseGame();
  } else if (mode === 'silhouette') {
    document.querySelectorAll('.tab-btn')[29].classList.add('active');
    document.getElementById('silhouetteMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initSilhouetteGame();
  } else if (mode === 'hiraganaRead') {
    document.querySelectorAll('.tab-btn')[30].classList.add('active');
    document.getElementById('hiraganaReadMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initHiraganaReadGame();
  } else if (mode === 'kanjiCards') {
    document.getElementById('kanjiCardsMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initKanjiCardsMode();
  } else if (mode === 'adjective') {
    document.getElementById('adjectiveMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initAdjectiveGame();
  } else if (mode === 'placement') {
    document.getElementById('placementMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initPlacementQuiz();
  } else if (mode === 'phonoTest') {
    document.getElementById('phonoTestMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initPhonoTest();
  } else if (mode === 'wmsSpan') {
    document.getElementById('wmsSpanMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initWmsSpanTest();
  } else if (mode === 'palTest') {
    document.getElementById('palTestMode').classList.add('active');
    stopListening();
    stopPronounceListening();
    stopHrListening();
    getAudioContext();
    initPalTest();
  }
  if (mode !== 'scene') stopSceneAutoplay();
  if (mode !== 'songs') stopSongPlayback();
  if (mode !== 'trace') stopTraceAudioLoop();
  if (mode !== 'storybook') stopStorybookAutoplay();
  if (mode !== 'emojiStorybook') stopEmojiStorybookAutoplay();
  if (mode !== 'karaoke') stopKaraokePlayback();
  if (mode !== 'wordsearch') stopWordSearchDrag();
  if (mode !== 'hiraganaRead') stopHrListening();
}

function speakCurrentWord() { quizGame.speakCurrent(); }

function speakAudioEmojiWord() { audioEmojiGame.speakCurrent(); }

function speakWritingWord() {
  if (!currentWritingWord) return;
  speakTTS(currentWritingWord.jp);
}

/* 🍼 아기말투(motherese/child-directed speech) 토글 상태 */
let babyTalkMode = false;
function toggleBabyTalk(checked){
  babyTalkMode = checked;
}

/* 🇰🇷 한글 함께 보기 — 설정 화면의 토글 하나로 앱 전체(모든 게임)의 한글 뜻/번역 표시 여부를 일괄 제어합니다.
   기본값은 켜짐(true)이며, 꺼지면 body에 hide-korean-display 클래스를 붙여 CSS로 모든 한글 요소를 숨깁니다.
   개별 게임(예: 이모지 동화책)에 이미 있던 자체 한글 토글은 이 설정이 켜져 있을 때만 그대로 동작하고,
   이 설정을 꺼두면 그 게임의 자체 토글 상태와 상관없이 항상 숨겨집니다. */
let koreanDisplayEnabled = true;
function toggleKoreanDisplay(checked){
  koreanDisplayEnabled = checked;
  document.body.classList.toggle('hide-korean-display', !checked);

  // 이모지 동화책처럼 자체 한글 토글이 있는 게임은, 전체 설정을 켰을 때 화면상 체크 상태도
  // 헷갈리지 않도록 함께 맞춰줍니다(개별 게임의 표시 로직은 그 게임의 함수가 계속 담당합니다).
  const emojiKrToggle = document.getElementById('emojiStorybookKoreanToggle');
  if(emojiKrToggle) emojiKrToggle.disabled = !checked;
}

function speakTTS(text, opts) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  opts = opts || {};
  const rate = babyTalkMode ? 0.6 : 0.85;
  const pitch = babyTalkMode ? 1.35 : 1.0;
  // 🔊 부호화 다양성(Encoding Variability): 같은 글자를 매번 똑같은 속도/음높이로만 들으면
  // 그 특정 목소리 패턴에 종속된 얕은 청각 기억이 형성될 수 있어요. opts.jitter가 켜지면
  // 속도/음높이를 매번 아주 살짝(±5%) 무작위로 흔들어 조금씩 다른 소리로 들려줍니다.
  const jitterRate = opts.jitter ? rate * (0.95 + Math.random() * 0.1) : rate;
  const jitterPitch = opts.jitter ? pitch * (0.95 + Math.random() * 0.1) : pitch;
  const repeatCount = babyTalkMode ? 2 : 1;
  let playedCount = 0;

  function playOnce(){
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = jitterRate;
    utterance.pitch = jitterPitch;
    playedCount++;
    if(playedCount < repeatCount){
      utterance.onend = () => { setTimeout(playOnce, 450); };
    }
    // cancel() 직후 같은 틱에서 바로 speak()를 부르면 취소 처리가 끝나기 전이라
    // 재생 요청이 씹히는 경우가 있어(특히 화면 전환 직후 첫 재생), 아주 짧게 지연시켜 호출
    setTimeout(() => { window.speechSynthesis.speak(utterance); }, 50);
  }
  playOnce();
}

/* 🎤 발음을 들려주면서 해당 히라가나를 순서대로 다른 색으로 강조 표시합니다.
   브라우저가 onboundary 이벤트(글자 단위 타이밍)를 지원하면 그것에 맞춰 하이라이트하고,
   이벤트가 드물게 오거나 지원하지 않으면 실제 경과 시간을 바탕으로 속도를 계속 재보정한
   타이머로 대체합니다 — 이렇게 하면 초반 추정이 틀려도 점점 실제 발음 속도에 맞춰집니다. */
function speakWithHighlight(text, containerEl, opts){
  opts = opts || {};
  const rate = opts.rate || 0.8;
  const pitch = opts.pitch || 1.0;
  const onEnd = opts.onEnd || function(){};

  if(!containerEl){ speakTTS(text); onEnd(); return; }

  const chars = Array.from(text);
  containerEl.innerHTML = chars.map(c => `<span class="tts-char">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  const spans = containerEl.querySelectorAll('.tts-char');

  function highlightIndex(idx){
    spans.forEach((s,i) => {
      s.classList.toggle('tts-char-done', i < idx);
      s.classList.toggle('tts-char-active', i === idx);
    });
  }

  if(!('speechSynthesis' in window)){ onEnd(); return; }
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  // (아래 utter 설정/이벤트 등록 후, speak() 호출은 cancel() 처리 지연을 고려해 뒤에서 setTimeout으로 감쌈)
  utter.lang = 'ja-JP';
  utter.rate = rate;
  utter.pitch = pitch;

  let startTime = null;
  let fallbackTimer = null;
  // 초기 추정치: 실제 발음이 이 추정보다 항상 빨랐다는 피드백을 반영해 값을 낮춰(빠르게) 시작하고,
  // onboundary가 들어올 때마다 실측값으로 계속 보정합니다.
  let msPerChar = Math.max(70, 170 / rate);

  function scheduleFallback(fromIdx){
    clearTimeout(fallbackTimer);
    let i = fromIdx;
    if(i >= chars.length) return;
    function tick(){
      highlightIndex(i);
      i++;
      if(i < chars.length){
        fallbackTimer = setTimeout(tick, msPerChar);
      }
    }
    tick();
  }

  utter.onboundary = (e)=>{
    clearTimeout(fallbackTimer);
    // charIndex(원문 문자열 기준)를 화면에 그려진 글자 배열 인덱스로 변환
    let count = 0, idx = chars.length - 1;
    for(let i=0;i<chars.length;i++){
      if(count >= e.charIndex){ idx = i; break; }
      count += chars[i].length;
    }
    // 실제 경과 시간 대비 여기까지 온 글자 수로 초당 속도를 다시 계산해,
    // 다음 boundary가 올 때까지의 구간도 실제 속도에 맞춰 진행되도록 보정합니다.
    if(startTime !== null && idx > 0){
      const elapsed = performance.now() - startTime;
      const measured = elapsed / idx;
      if(isFinite(measured) && measured > 20){
        msPerChar = measured;
      }
    }
    highlightIndex(idx);
    scheduleFallback(idx + 1);
  };

  utter.onstart = ()=>{
    startTime = performance.now();
    scheduleFallback(0);
  };

  utter.onend = ()=>{
    clearTimeout(fallbackTimer);
    highlightIndex(chars.length); // 전부 다 읽었으니 마지막 상태로
    onEnd();
  };
  utter.onerror = ()=>{
    clearTimeout(fallbackTimer);
    onEnd();
  };

  // cancel() 직후 같은 틱에서 바로 speak()를 부르면 취소 처리가 끝나기 전이라
  // 재생 요청이 씹히는 경우가 있어(특히 모드 진입 직후 첫 자동 재생), 아주 짧게 지연시켜 호출
  setTimeout(() => { window.speechSynthesis.speak(utter); }, 50);
}

/* ============================================================
   4지선다 단어 고르기 게임 공통 엔진
   (발음 듣고 알맞은 단어 고르기 - 5초 타이머·10문제·결과화면이 있는
    도전 모드 / 듣고 이모지 고르기 - 타이머·결과화면 없이 계속 이어지는
    연습 모드가 이 엔진 하나를 공유합니다. cfg.timed 플래그로 두 모드를
    가릅니다: true면 시작화면·5초 타이머·10문제 후 결과화면이 있고,
    false면 시작화면 없이 곧바로 문제가 나오고 정답을 맞히면 바로 다음
    문제로 넘어갑니다(오답이어도 시간에 쫓기지 않고 다시 고를 수 있음).
   ============================================================ */
function createWordChoiceQuizGame(cfg) {
  const P = cfg.idPrefix;
  const el = (suffix) => document.getElementById(P + suffix);
  const optionButtons = () => document.querySelectorAll(`#${P}Options .${cfg.btnClass}`);

  let score = 0, combo = 0, maxCombo = 0, correctCount = 0, index = 0;
  let currentQuestion = null, isAnswering = false;
  let timer = null, advanceTimer = null;

  function speakCurrent() {
    if (!currentQuestion) return;
    speakTTS(currentQuestion.jp);
  }

  function init() {
    clearTimeout(timer); clearTimeout(advanceTimer);
    if (cfg.timed) {
      el('StartScreen').style.display = 'block';
      el('QuestionScreen').style.display = 'none';
      el('ResultScreen').style.display = 'none';
      el('Progress').textContent = '0';
    }
    score = 0; combo = 0; maxCombo = 0; correctCount = 0; index = 0;
    el('Score').textContent = '0';
    el('Combo').textContent = '0';
  }

  function start() {
    clearTimeout(timer); clearTimeout(advanceTimer);
    score = 0; combo = 0; maxCombo = 0; correctCount = 0; index = 0;
    el('Score').textContent = '0';
    el('Combo').textContent = '0';

    el('StartScreen').style.display = 'none';
    el('ResultScreen').style.display = 'none';
    el('QuestionScreen').style.display = 'block';

    generateQuiz();
  }

  function generateQuiz() {
    if (cfg.timed && index >= 10) {
      showResult();
      return;
    }

    isAnswering = false;
    clearTimeout(timer);
    clearTimeout(advanceTimer);
    if (cfg.timed) el('Progress').textContent = index + 1;
    el(cfg.audioBtnSuffix).disabled = false;

    const activeWords = getActiveWords();
    const randomIndex = Math.floor(Math.random() * activeWords.length);
    const correctWord = activeWords[randomIndex];
    currentQuestion = correctWord;

    if (cfg.renderQuestion) cfg.renderQuestion(correctWord);

    speakCurrent();

    const choices = [correctWord];
    const pool = activeWords.filter(w => w.jp !== correctWord.jp);
    while (choices.length < 4 && pool.length > 0) {
      const rIdx = Math.floor(Math.random() * pool.length);
      choices.push(pool.splice(rIdx, 1)[0]);
    }
    choices.sort(() => Math.random() - 0.5);

    const optionsContainer = el('Options');
    optionsContainer.innerHTML = '';

    choices.forEach(word => {
      const btn = document.createElement('button');
      btn.className = cfg.btnClass;
      btn.dataset.jp = word.jp;
      btn.dataset.kr = word.kr;
      btn.innerHTML = cfg.renderChoiceInner(word);
      btn.addEventListener('click', () => selectAnswer(btn, word));
      optionsContainer.appendChild(btn);
    });

    if (cfg.timed) {
      // 5초 타이머 바 애니메이션 (가득 찬 상태에서 0으로 줄어듦)
      const fill = el('TimerFill');
      fill.style.transition = 'none';
      fill.style.width = '100%';
      void fill.offsetWidth;
      fill.style.transition = 'width 5s linear';
      fill.style.width = '0%';

      timer = setTimeout(() => {
        timeExpired();
      }, 5000);
    }
  }

  function revealChoiceButtons(allButtons) {
    if (!cfg.revealAnswerText) return;
    allButtons.forEach(btn => {
      btn.innerHTML = cfg.revealAnswerText(btn.dataset.jp, btn.dataset.kr);
    });
  }

  function selectAnswer(selectedButton, word) {
    if (isAnswering) return;

    const scoreEl = el('Score');
    const comboEl = el('Combo');
    const allButtons = optionButtons();

    if (word.jp === currentQuestion.jp) {
      isAnswering = true;
      clearTimeout(timer);
      score += 10;
      combo += 1;
      if (combo > maxCombo) maxCombo = combo;
      correctCount += 1;
      scoreEl.textContent = score;
      comboEl.textContent = combo;
      playCorrectSound();
      cfg.celebrate(selectedButton, currentQuestion);

      el(cfg.audioBtnSuffix).disabled = true;
      addLogChip(currentQuestion);
      recordWordResult(currentQuestion, true);

      allButtons.forEach(btn => {
        if (btn.dataset.jp === currentQuestion.jp) {
          btn.classList.add('correct');
        }
      });
      revealChoiceButtons(allButtons);

      advanceTimer = setTimeout(() => {
        if (cfg.timed) index += 1;
        generateQuiz();
      }, cfg.correctAdvanceDelay);

    } else {
      selectedButton.classList.add('wrong');
      combo = 0;
      comboEl.textContent = combo;
      playWrongSound();
      recordWordResult(currentQuestion, false);

      allButtons.forEach(btn => {
        if (btn.dataset.jp === currentQuestion.jp) {
          btn.classList.add('correct-hint');
        }
      });
      revealChoiceButtons(allButtons);

      setTimeout(() => {
        selectedButton.classList.remove('wrong');
      }, 800);
    }
  }

  function timeExpired() {
    if (isAnswering) return;
    isAnswering = true;
    clearTimeout(timer);
    combo = 0;
    el('Combo').textContent = combo;
    el(cfg.audioBtnSuffix).disabled = true;
    recordWordResult(currentQuestion, false);
    playWrongSound();

    const allButtons = optionButtons();
    allButtons.forEach(btn => {
      if (btn.dataset.jp === currentQuestion.jp) {
        btn.classList.add('correct-hint');
      }
    });
    revealChoiceButtons(allButtons);

    advanceTimer = setTimeout(() => {
      index += 1;
      generateQuiz();
    }, 1200);
  }

  function showResult() {
    clearTimeout(timer);
    clearTimeout(advanceTimer);
    el('QuestionScreen').style.display = 'none';
    el('ResultScreen').style.display = 'block';
    el('ResultCorrect').textContent = correctCount;
    el('ResultMaxCombo').textContent = maxCombo;
    el('ResultScore').textContent = score;
  }

  return { init, start, generateQuiz, speakCurrent };
}

/* 단어 퀴즈 풀기 게임 설정 — 발음을 듣고 5초 안에 알맞은 단어를 고릅니다 (총 10문제) */
const quizGame = createWordChoiceQuizGame({
  idPrefix: 'quiz',
  btnClass: 'quiz-btn',
  audioBtnSuffix: 'AudioBtn',
  timed: true,
  correctAdvanceDelay: 1200,

  renderQuestion(word) {
    const quizEmojiEl = document.getElementById('quizEmoji');
    quizEmojiEl.innerHTML = emojiVisualHTML(word);
    quizEmojiEl.style.animation = 'none';
    void quizEmojiEl.offsetWidth;
    quizEmojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';
  },

  renderChoiceInner(word) {
    return `<span>${word.jp}</span>`;
  },

  // 정답 확인 후에는 모든 선택지에 한글 뜻을 함께 보여줍니다
  revealAnswerText(jp, kr) {
    return `<span>${jp}</span><span class="btn-kr">(${kr})</span>`;
  },

  celebrate(selectedButton, word) {
    celebrateCorrect(document.getElementById('quizEmoji'), word);
  }
});

function initQuizGame() { quizGame.init(); }
function startQuizGame() { quizGame.start(); }
function generateQuiz() { quizGame.generateQuiz(); }

/* 🎯 진단 기반 개인별 커리큘럼 오케스트레이션(Part 2, learning-theory-roadmap.md §1) —
   "이 학습자는 어떤 사람인가"를 저장해두는 프로필. 아직은 4번(사전지식 배치 퀴즈) 결과만
   채워지고, 나머지 필드(청지각 변별력/작업기억 스팬/연상학습 속도)는 각각의 진단 미니게임을
   구현하는 다음 세션들에서 하나씩 채워질 예정. "1회성 확정"이 아니라 계속 갱신되는 살아있는
   프로필이라, 저장 시 기존 값을 항상 병합(merge)하고 통째로 덮어쓰지 않는다. */
const LEARNER_PROFILE_KEY = 'kotobaLearnerProfile';

function loadLearnerProfile() {
  let profile = null;
  try {
    const raw = localStorage.getItem(LEARNER_PROFILE_KEY);
    profile = raw ? JSON.parse(raw) : null;
  } catch (e) {
    profile = null;
  }
  if (!profile || typeof profile !== 'object') profile = {};
  return profile;
}

function saveLearnerProfilePatch(patch) {
  try {
    const profile = loadLearnerProfile();
    Object.assign(profile, patch, { lastRecalibratedAt: Date.now() });
    localStorage.setItem(LEARNER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    /* 저장 실패해도 진단 결과 화면 자체는 그대로 보여줌 */
  }
}

/* 🎯 사전지식 배치 퀴즈 (Adaptive Placement Quiz) — 진단 4가지 중 리스크가 가장 낮은 항목.
   기존 연령대 필터(ageLevelSelect, currentAppLevel)가 이미 6~42개월 8단계로 나뉘어 있고
   DICTIONARY의 모든 단어에 그 8단계 중 하나가 level로 매겨져 있어, 별도 문제 데이터 없이
   기존 quiz 화면 포맷(발음 듣고 4지선다)만 재사용해 적응형으로 난이도를 조정한다.
   맞히면 단계를 올리고 틀리면 내리되, 매 문제마다 이동 폭(step)을 절반으로 줄여
   이진탐색처럼 정답 근처로 수렴시킨다(고전적인 적응형 검사 방식). */
const PLACEMENT_AGE_LEVELS = [6, 9, 12, 18, 24, 30, 36, 42]; // ageLevelSelect 버튼과 동일한 8단계
const PLACEMENT_QUESTION_COUNT = 6;
const PLACEMENT_START_INDEX = 3; // 18개월 — 극단으로 치우치지 않은 중간값에서 시작

let placementLevelIndex = PLACEMENT_START_INDEX;
let placementStep = 2;
let placementQuestionNum = 0;
let placementCorrectCount = 0;
let placementCurrentWord = null;
let placementIsAnswering = false;
let placementAdvanceTimer = null;

function initPlacementQuiz() {
  clearTimeout(placementAdvanceTimer);
  document.getElementById('placementIntroScreen').style.display = '';
  document.getElementById('placementQuestionScreen').style.display = 'none';
  document.getElementById('placementResultScreen').style.display = 'none';
}

function startPlacementQuiz() {
  clearTimeout(placementAdvanceTimer);
  placementLevelIndex = PLACEMENT_START_INDEX;
  placementStep = 2;
  placementQuestionNum = 0;
  placementCorrectCount = 0;
  placementIsAnswering = false;

  document.getElementById('placementIntroScreen').style.display = 'none';
  document.getElementById('placementResultScreen').style.display = 'none';
  document.getElementById('placementQuestionScreen').style.display = '';

  generatePlacementQuestion();
}

function speakPlacementCurrent() {
  if (!placementCurrentWord) return;
  speakTTS(placementCurrentWord.jp);
}

function generatePlacementQuestion() {
  if (placementQuestionNum >= PLACEMENT_QUESTION_COUNT) {
    showPlacementResult();
    return;
  }

  placementIsAnswering = false;
  document.getElementById('placementProgress').textContent = placementQuestionNum + 1;
  document.getElementById('placementAudioBtn').disabled = false;

  // 후보 단계(level)에 정확히 매칭되는 단어 중에서 출제 — 없으면(단어 수가 적은 극단 레벨)
  // 그 단계 이하 전체에서 고름
  const candidateLevel = PLACEMENT_AGE_LEVELS[placementLevelIndex];
  let levelPool = DICTIONARY.filter(w => w.level === candidateLevel);
  if (levelPool.length === 0) levelPool = DICTIONARY.filter(w => w.level <= candidateLevel);
  if (levelPool.length === 0) levelPool = DICTIONARY;

  const correctWord = levelPool[Math.floor(Math.random() * levelPool.length)];
  placementCurrentWord = correctWord;

  const emojiEl = document.getElementById('placementEmoji');
  emojiEl.innerHTML = emojiVisualHTML(correctWord);
  emojiEl.style.animation = 'none';
  void emojiEl.offsetWidth;
  emojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';

  speakPlacementCurrent();

  // 오답 선택지는 전체 사전에서 골라 (연령대 필터와 무관하게) 항상 4개를 채울 수 있게 함
  const choices = [correctWord];
  const distractorPool = DICTIONARY.filter(w => w.jp !== correctWord.jp);
  while (choices.length < 4 && distractorPool.length > 0) {
    const rIdx = Math.floor(Math.random() * distractorPool.length);
    choices.push(distractorPool.splice(rIdx, 1)[0]);
  }
  choices.sort(() => Math.random() - 0.5);

  const optionsContainer = document.getElementById('placementOptions');
  optionsContainer.innerHTML = '';
  choices.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.dataset.jp = word.jp;
    btn.innerHTML = `<span>${word.jp}</span>`;
    btn.addEventListener('click', () => selectPlacementAnswer(btn, word));
    optionsContainer.appendChild(btn);
  });
}

function selectPlacementAnswer(selectedButton, word) {
  if (placementIsAnswering) return;
  placementIsAnswering = true;
  document.getElementById('placementAudioBtn').disabled = true;

  const isCorrect = word.jp === placementCurrentWord.jp;
  const allButtons = document.querySelectorAll('#placementOptions .quiz-btn');

  if (isCorrect) {
    selectedButton.classList.add('correct');
    placementCorrectCount += 1;
    playCorrectSound();
  } else {
    selectedButton.classList.add('wrong');
    allButtons.forEach(btn => {
      if (btn.dataset.jp === placementCurrentWord.jp) btn.classList.add('correct-hint');
    });
    playWrongSound();
  }

  // 이진탐색처럼: 맞으면 단계 상승, 틀리면 하강. 이동 폭은 문제마다 절반으로 줄여 수렴시킴
  placementLevelIndex = isCorrect
    ? Math.min(placementLevelIndex + placementStep, PLACEMENT_AGE_LEVELS.length - 1)
    : Math.max(placementLevelIndex - placementStep, 0);
  placementStep = Math.max(1, Math.ceil(placementStep / 2));
  placementQuestionNum += 1;

  placementAdvanceTimer = setTimeout(() => {
    generatePlacementQuestion();
  }, 900);
}

function showPlacementResult() {
  document.getElementById('placementQuestionScreen').style.display = 'none';
  document.getElementById('placementResultScreen').style.display = '';

  const finalLevel = PLACEMENT_AGE_LEVELS[placementLevelIndex];
  const priorKnowledgeLevel = Math.round(
    (placementLevelIndex / (PLACEMENT_AGE_LEVELS.length - 1)) * 100
  );
  saveLearnerProfilePatch({ priorKnowledgeLevel, diagnosedAt: Date.now() });

  const levelLabel = finalLevel === 42 ? '36개월 초과' : `${finalLevel}개월 이하`;
  document.getElementById('placementResultText').innerHTML =
    `<b>${placementCorrectCount}</b> / ${PLACEMENT_QUESTION_COUNT}문제를 맞혔어요.<br>` +
    `지금은 <b>${levelLabel}</b> 수준의 단어가 잘 맞을 것 같아요!`;
}

/* 진단 결과를 실제로 적용 — 기존 연령대 필터(changeAppLevel)를 바로 그 레벨로 바꿔줌 */
function applyPlacementResult() {
  changeAppLevel(PLACEMENT_AGE_LEVELS[placementLevelIndex]);
  backToCategoryFromGame();
}

/* 🎧 청지각 변별력 진단 (Phonological Discrimination) — learning-theory-roadmap.md
   Part 2 §1-1. 신규 문제 화면을 새로 만들되, 사전지식 배치 퀴즈(placement)와 같은
   "인트로 → 문제 → 결과" 3단계 구조·클래스(.quiz-container, .hs-start-desc, .quiz-audio-btn,
   .hs-result-title 등)를 그대로 재사용해 톤을 통일함. PHONO_MINIMAL_PAIRS(data.js)에서
   모라 쌍을 하나 뽑아, 매 문제 50% 확률로 "같은 소리 두 번" 또는 "서로 다른 두 소리"를 순서
   섞어 재생하고, 아이가 "같아요/달라요"를 고르게 함. 정답 여부만으로 채점하고, 최종 정확도
   (0.0~1.0)를 learnerProfile.phonoDiscrimination에 저장함. */
const PHONO_QUESTION_COUNT = 8;
const PHONO_REPLAY_GAP_MS = 900; // 두 소리 사이 간격 — 너무 짧으면 변별이 어렵고 너무 길면 첫 소리를 잊어버림

let phonoQuestionNum = 0;
let phonoCorrectCount = 0;
let phonoCurrentSounds = null; // 이번 문제에서 실제로 재생할 [첫소리, 둘째소리] — data.js 원본 객체는 건드리지 않음
let phonoIsSameAnswer = false; // 이번 문제의 실제 정답(같음/다름)
let phonoIsAnswering = false;
let phonoAdvanceTimer = null;
let phonoPlaybackTimer = null;

function initPhonoTest() {
  clearTimeout(phonoAdvanceTimer);
  clearTimeout(phonoPlaybackTimer);
  document.getElementById('phonoIntroScreen').style.display = '';
  document.getElementById('phonoQuestionScreen').style.display = 'none';
  document.getElementById('phonoResultScreen').style.display = 'none';
}

function startPhonoTest() {
  clearTimeout(phonoAdvanceTimer);
  clearTimeout(phonoPlaybackTimer);
  phonoQuestionNum = 0;
  phonoCorrectCount = 0;
  phonoIsAnswering = false;

  document.getElementById('phonoIntroScreen').style.display = 'none';
  document.getElementById('phonoResultScreen').style.display = 'none';
  document.getElementById('phonoQuestionScreen').style.display = '';

  generatePhonoQuestion();
}

/* 이번 문제의 소리 두 개를 순서(재생 순서)까지 정해 배열로 반환 —
   같은 문제라도 매번 새로 뽑아야 하므로 재생할 때마다 호출하지 않고 문제 생성 시 한 번만 고정 */
function pickPhonoSounds(pair, isSame) {
  if (isSame) {
    // 같음 문제: a 또는 b 중 하나를 무작위로 골라 두 번 재생
    const sound = Math.random() < 0.5 ? pair.a : pair.b;
    return [sound, sound];
  }
  // 다름 문제: a·b 순서를 무작위로 섞어 재생
  return Math.random() < 0.5 ? [pair.a, pair.b] : [pair.b, pair.a];
}

function generatePhonoQuestion() {
  if (phonoQuestionNum >= PHONO_QUESTION_COUNT) {
    showPhonoResult();
    return;
  }

  phonoIsAnswering = false;
  document.getElementById('phonoProgress').textContent = phonoQuestionNum + 1;
  document.getElementById('phonoAudioBtn').disabled = false;
  document.querySelectorAll('#phonoOptions .quiz-btn').forEach(btn => {
    btn.classList.remove('correct', 'wrong', 'correct-hint');
  });

  const pair = PHONO_MINIMAL_PAIRS[Math.floor(Math.random() * PHONO_MINIMAL_PAIRS.length)];
  phonoIsSameAnswer = Math.random() < 0.5;
  phonoCurrentSounds = pickPhonoSounds(pair, phonoIsSameAnswer);

  playPhonoPair();
}

/* 두 소리를 PHONO_REPLAY_GAP_MS 간격으로 순서대로 재생 — "다시 듣기" 버튼으로 언제든 재생 가능 */
function playPhonoPair() {
  clearTimeout(phonoPlaybackTimer);
  if (!phonoCurrentSounds) return;
  const [first, second] = phonoCurrentSounds;
  speakTTS(first);
  phonoPlaybackTimer = setTimeout(() => {
    speakTTS(second);
  }, PHONO_REPLAY_GAP_MS);
}

function selectPhonoAnswer(guessedSame, selectedButton) {
  if (phonoIsAnswering) return;
  phonoIsAnswering = true;
  document.getElementById('phonoAudioBtn').disabled = true;

  const isCorrect = guessedSame === phonoIsSameAnswer;
  if (isCorrect) {
    selectedButton.classList.add('correct');
    phonoCorrectCount += 1;
    playCorrectSound();
  } else {
    selectedButton.classList.add('wrong');
    playWrongSound();
  }

  phonoQuestionNum += 1;
  phonoAdvanceTimer = setTimeout(() => {
    generatePhonoQuestion();
  }, 900);
}

function showPhonoResult() {
  clearTimeout(phonoPlaybackTimer);
  document.getElementById('phonoQuestionScreen').style.display = 'none';
  document.getElementById('phonoResultScreen').style.display = '';

  const accuracy = phonoCorrectCount / PHONO_QUESTION_COUNT;
  saveLearnerProfilePatch({ phonoDiscrimination: accuracy, diagnosedAt: Date.now() });

  let levelText;
  if (accuracy >= 0.85) levelText = '아주 잘 구별해요! 비슷한 소리도 귀가 밝네요 👂✨';
  else if (accuracy >= 0.6) levelText = '대체로 잘 구별해요. 헷갈리는 소리는 천천히 다시 들어보면 좋아요.';
  else levelText = '비슷한 소리를 아직은 많이 헷갈려해요. 듣기 위주 학습으로 천천히 귀를 익혀볼게요.';

  document.getElementById('phonoResultText').innerHTML =
    `<b>${phonoCorrectCount}</b> / ${PHONO_QUESTION_COUNT}문제를 맞혔어요.<br>${levelText}`;
}

/* 🧩 작업기억 스팬 진단 (Working Memory Span) — learning-theory-roadmap.md Part 2 §1-2.
   숫자 대신 색깔 도형 이모지를 사용 — 어린 학습자에게는 숫자 역순 암기보다 직관적이고,
   히라가나/일본어 지식과도 무관해 순수하게 작업기억만 측정할 수 있음. 3개 스팬부터 시작해
   맞힐 때마다 1개씩 늘리고(3→4→5…), 틀리는 순간 바로 종료해 "실패 직전 스팬"을 측정하는
   고전적 스팬 테스트 방식(단, 시간 절약을 위해 레벨당 1회 시행만 봄 — 2회 시행 평균을 내는
   정식 심리검사보다는 간이 버전). */
const WMS_SHAPES = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⚫', '⭐', '❤️']; // 최대 스팬(9)만큼 서로 다른 도형 9개
const WMS_START_SPAN = 3;
const WMS_MAX_SPAN = 9;
const WMS_SHOW_INTERVAL_MS = 900; // 도형 하나가 화면에 보이는 시간
const WMS_GAP_MS = 350; // 도형 사이 공백(다음 도형과 헷갈리지 않도록) / 마지막 도형 후 답변 화면 전환 전 대기

let wmsCurrentSpan = WMS_START_SPAN;
let wmsSequence = [];
let wmsUserPicks = [];
let wmsHighestCompletedSpan = 0; // 역순으로 맞게 고른 가장 긴 스팬 (0이면 시작 스팬부터 실패)
let wmsShowTimer = null;

function initWmsSpanTest() {
  clearTimeout(wmsShowTimer);
  document.getElementById('wmsIntroScreen').style.display = '';
  document.getElementById('wmsShowScreen').style.display = 'none';
  document.getElementById('wmsAnswerScreen').style.display = 'none';
  document.getElementById('wmsResultScreen').style.display = 'none';
}

function startWmsSpanTest() {
  clearTimeout(wmsShowTimer);
  wmsCurrentSpan = WMS_START_SPAN;
  wmsHighestCompletedSpan = 0;

  document.getElementById('wmsIntroScreen').style.display = 'none';
  document.getElementById('wmsResultScreen').style.display = 'none';

  runWmsRound();
}

/* 이번 라운드(스팬 길이 wmsCurrentSpan)를 새로 시작 — 최대 스팬을 넘기면 바로 결과로 종료 */
function runWmsRound() {
  if (wmsCurrentSpan > WMS_MAX_SPAN) {
    showWmsResult();
    return;
  }

  document.getElementById('wmsAnswerScreen').style.display = 'none';
  document.getElementById('wmsShowScreen').style.display = '';
  document.getElementById('wmsSpanLabel').textContent = wmsCurrentSpan;

  const pool = WMS_SHAPES.slice();
  wmsSequence = [];
  for (let i = 0; i < wmsCurrentSpan; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    wmsSequence.push(pool.splice(idx, 1)[0]);
  }
  wmsUserPicks = [];

  playWmsSequence(0);
}

/* 도형을 하나씩 순서대로 재생 — 재생 중간에 빈 화면을 잠깐 끼워 넣어 도형이 바뀌는
   순간을 명확히 구분되게 함(연속 재생 시 두 도형이 겹쳐 보이는 착시 방지) */
function playWmsSequence(index) {
  const emojiEl = document.getElementById('wmsShowEmoji');
  if (index >= wmsSequence.length) {
    wmsShowTimer = setTimeout(showWmsAnswerScreen, WMS_GAP_MS);
    return;
  }

  emojiEl.textContent = wmsSequence[index];
  emojiEl.style.animation = 'none';
  void emojiEl.offsetWidth;
  emojiEl.style.animation = 'quizAppear .3s cubic-bezier(.175, .885, .32, 1.275)';

  wmsShowTimer = setTimeout(() => {
    emojiEl.textContent = '';
    wmsShowTimer = setTimeout(() => playWmsSequence(index + 1), WMS_GAP_MS);
  }, WMS_SHOW_INTERVAL_MS);
}

function showWmsAnswerScreen() {
  document.getElementById('wmsShowScreen').style.display = 'none';
  document.getElementById('wmsAnswerScreen').style.display = '';
  document.getElementById('wmsAnswerSpanLabel').textContent = wmsCurrentSpan;
  document.getElementById('wmsPickedRow').innerHTML = '';

  const shuffled = wmsSequence.slice().sort(() => Math.random() - 0.5);
  const optionsEl = document.getElementById('wmsOptions');
  optionsEl.innerHTML = '';
  shuffled.forEach(shape => {
    const btn = document.createElement('button');
    btn.className = 'wms-shape-btn';
    btn.textContent = shape;
    btn.addEventListener('click', () => pickWmsShape(shape, btn));
    optionsEl.appendChild(btn);
  });
}

function pickWmsShape(shape, btnEl) {
  if (btnEl.classList.contains('picked')) return;
  if (wmsUserPicks.length >= wmsSequence.length) return;

  wmsUserPicks.push(shape);
  btnEl.classList.add('picked');

  const chip = document.createElement('span');
  chip.className = 'wms-picked-chip';
  chip.textContent = shape;
  document.getElementById('wmsPickedRow').appendChild(chip);

  if (wmsUserPicks.length === wmsSequence.length) {
    setTimeout(checkWmsAnswer, 400);
  }
}

function checkWmsAnswer() {
  const expected = wmsSequence.slice().reverse();
  const isCorrect = expected.every((shape, i) => shape === wmsUserPicks[i]);

  if (isCorrect) {
    wmsHighestCompletedSpan = wmsCurrentSpan;
    wmsCurrentSpan += 1;
    runWmsRound();
  } else {
    showWmsResult();
  }
}

function showWmsResult() {
  clearTimeout(wmsShowTimer);
  document.getElementById('wmsShowScreen').style.display = 'none';
  document.getElementById('wmsAnswerScreen').style.display = 'none';
  document.getElementById('wmsResultScreen').style.display = '';

  // 한 번도 성공하지 못했으면(시작 스팬부터 실패) 시작 스팬-1로 기록 — 그 이하 능력이라는 뜻
  const recordedSpan = wmsHighestCompletedSpan > 0 ? wmsHighestCompletedSpan : WMS_START_SPAN - 1;
  saveLearnerProfilePatch({ workingMemorySpan: recordedSpan, diagnosedAt: Date.now() });

  let levelText;
  if (recordedSpan >= 7) levelText = '한 번에 기억하는 힘이 아주 좋아요! 새 글자를 여러 개씩 배워도 잘 따라올 것 같아요.';
  else if (recordedSpan >= 5) levelText = '보통 수준으로 잘 기억해요. 지금 속도로 차근차근 늘려가면 좋아요.';
  else levelText = '아직은 한 번에 기억하는 양이 적은 편이에요. 새 글자를 조금씩, 천천히 늘려가는 게 더 잘 맞을 것 같아요.';

  document.getElementById('wmsResultText').innerHTML =
    `한 번에 <b>${recordedSpan}개</b>까지 거꾸로 기억해냈어요.<br>${levelText}`;
}

/* 🔗 연상학습 속도 진단 (Paired-Associate Learning Rate) — learning-theory-roadmap.md Part 2 §1-3.
   히라가나가 아닌 추상 도형(PAL_SYMBOL_SOUND_PAIRS, data.js)과 무의미 카타카나 이름을 짝지어
   "노출(전체 쌍을 보여주고 이름을 들려줌) → 테스트(도형만 보여주고 이름 맞히기)"를 5라운드
   반복한다. 라운드별 정확도가 몇 번 만에 오르는지를 보고 fast/medium/slow로 분류함으로써,
   기존 지식(어휘력)의 영향 없이 순수한 "새 짝 암기 속도"만 측정하려는 목적. */
const PAL_ROUNDS = 5;
const PAL_EXPOSURE_SHOW_MS = 1100; // 노출 단계에서 쌍 하나가 보이는 시간
const PAL_EXPOSURE_GAP_MS = 300;   // 노출 단계 쌍 사이 공백
const PAL_ACCURACY_TARGET = 0.8;   // 이 정확도(5개 중 4개)에 처음 도달한 라운드로 속도를 판정

let palCurrentRound = 1;
let palRoundAccuracies = [];
let palTestOrder = [];
let palTestIndex = 0;
let palRoundCorrectCount = 0;
let palTimer = null;

function initPalTest() {
  clearTimeout(palTimer);
  document.getElementById('palIntroScreen').style.display = '';
  document.getElementById('palExposureScreen').style.display = 'none';
  document.getElementById('palTestScreen').style.display = 'none';
  document.getElementById('palResultScreen').style.display = 'none';
}

function startPalTest() {
  clearTimeout(palTimer);
  palCurrentRound = 1;
  palRoundAccuracies = [];

  document.getElementById('palIntroScreen').style.display = 'none';
  document.getElementById('palResultScreen').style.display = 'none';

  runPalRound();
}

/* 라운드(palCurrentRound)를 새로 시작 — 노출 단계부터 진행. 5라운드를 다 마치면 결과로 종료 */
function runPalRound() {
  if (palCurrentRound > PAL_ROUNDS) {
    showPalResult();
    return;
  }

  document.getElementById('palTestScreen').style.display = 'none';
  document.getElementById('palExposureScreen').style.display = '';
  document.getElementById('palRoundLabel').textContent = palCurrentRound;
  document.getElementById('palRoundLabelTest').textContent = palCurrentRound;

  playPalExposureSequence(0);
}

/* 도형-이름 쌍 전체를 하나씩 순서대로 보여주고 TTS로 이름을 읽어줌(부호화 단계) */
function playPalExposureSequence(index) {
  const symbolEl = document.getElementById('palExposureSymbol');
  const nameEl = document.getElementById('palExposureName');

  if (index >= PAL_SYMBOL_SOUND_PAIRS.length) {
    palTimer = setTimeout(startPalTestPhase, PAL_EXPOSURE_GAP_MS);
    return;
  }

  const pair = PAL_SYMBOL_SOUND_PAIRS[index];
  symbolEl.textContent = pair.symbol;
  nameEl.textContent = pair.name;
  speakTTS(pair.name);

  palTimer = setTimeout(() => {
    symbolEl.textContent = '';
    nameEl.textContent = '';
    palTimer = setTimeout(() => playPalExposureSequence(index + 1), PAL_EXPOSURE_GAP_MS);
  }, PAL_EXPOSURE_SHOW_MS);
}

/* 노출이 끝나면 도형 순서를 섞어 하나씩 "이 도형 이름이 뭐였죠?" 테스트 진행(인출 단계) */
function startPalTestPhase() {
  palTestOrder = PAL_SYMBOL_SOUND_PAIRS.map((_, i) => i).sort(() => Math.random() - 0.5);
  palTestIndex = 0;
  palRoundCorrectCount = 0;

  document.getElementById('palExposureScreen').style.display = 'none';
  document.getElementById('palTestScreen').style.display = '';

  showPalTestQuestion();
}

function showPalTestQuestion() {
  const pair = PAL_SYMBOL_SOUND_PAIRS[palTestOrder[palTestIndex]];
  document.getElementById('palTestProgress').textContent = palTestIndex + 1;
  document.getElementById('palTestSymbol').textContent = pair.symbol;

  const options = PAL_SYMBOL_SOUND_PAIRS.map(p => p.name).sort(() => Math.random() - 0.5);
  const optionsEl = document.getElementById('palTestOptions');
  optionsEl.innerHTML = '';
  options.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.innerHTML = `<span>${name}</span>`;
    btn.addEventListener('click', () => selectPalAnswer(name, pair.name, btn));
    optionsEl.appendChild(btn);
  });
}

function selectPalAnswer(picked, correctName, btnEl) {
  document.querySelectorAll('#palTestOptions .quiz-btn').forEach(b => b.disabled = true);

  const isCorrect = picked === correctName;
  btnEl.classList.add(isCorrect ? 'correct' : 'wrong');
  if (isCorrect) palRoundCorrectCount++;
  else {
    document.querySelectorAll('#palTestOptions .quiz-btn').forEach(b => {
      if (b.textContent.trim() === correctName) b.classList.add('correct');
    });
  }

  palTimer = setTimeout(() => {
    palTestIndex++;
    if (palTestIndex < palTestOrder.length) {
      showPalTestQuestion();
    } else {
      finishPalRound();
    }
  }, 900);
}

function finishPalRound() {
  const accuracy = palRoundCorrectCount / PAL_SYMBOL_SOUND_PAIRS.length;
  palRoundAccuracies.push(accuracy);
  palCurrentRound++;
  runPalRound();
}

/* 정확도가 PAL_ACCURACY_TARGET(0.8)에 처음 도달한 라운드를 기준으로 fast/medium/slow 판정.
   끝까지 도달 못 하면 'slow'로 기록 — 3단계 습득 속도는 §3 오케스트레이터에서
   노출(A단계) 비중·재인→회상 전환 기준을 조정하는 입력값으로 쓸 계획(아직 미연동). */
function computePalLearningRate(accuracies) {
  const reachedIndex = accuracies.findIndex(a => a >= PAL_ACCURACY_TARGET);
  if (reachedIndex === -1) return 'slow';
  if (reachedIndex <= 1) return 'fast';   // 1~2라운드 만에 도달
  if (reachedIndex <= 3) return 'medium'; // 3~4라운드 만에 도달
  return 'slow';
}

function showPalResult() {
  clearTimeout(palTimer);
  document.getElementById('palExposureScreen').style.display = 'none';
  document.getElementById('palTestScreen').style.display = 'none';
  document.getElementById('palResultScreen').style.display = '';

  const rate = computePalLearningRate(palRoundAccuracies);
  saveLearnerProfilePatch({ assocLearningRate: rate, diagnosedAt: Date.now() });

  const rateText = {
    fast: '새로운 짝을 아주 빨리 외우는 편이에요! 새 글자를 배울 때도 노출은 짧게, 바로 문제를 풀어보는 게 잘 맞을 것 같아요.',
    medium: '보통 속도로 새 짝을 익혀요. 지금처럼 차근차근 반복하면 잘 늘어갈 거예요.',
    slow: '새로운 짝은 여러 번 봐야 익숙해지는 편이에요. 새 글자를 배울 때 노출 시간을 조금 더 넉넉하게 주는 게 좋을 것 같아요.'
  }[rate];

  const roundsText = palRoundAccuracies
    .map((a, i) => `${i + 1}회차 ${Math.round(a * PAL_SYMBOL_SOUND_PAIRS.length)}/${PAL_SYMBOL_SOUND_PAIRS.length}`)
    .join(' · ');

  document.getElementById('palResultText').innerHTML =
    `${roundsText}<br>${rateText}`;
}

/* 🎧 듣고 이모지 고르기 게임 설정 — 타이머·결과화면 없이 계속 이어지는 연습 모드 */
const audioEmojiGame = createWordChoiceQuizGame({
  idPrefix: 'audioEmoji',
  btnClass: 'emoji-btn',
  audioBtnSuffix: 'PlayBtn',
  timed: false,
  correctAdvanceDelay: 1500,

  renderChoiceInner(word) {
    return `
      ${emojiVisualHTML(word)}
      <span class="btn-text-sub">${word.jp} (${word.kr})</span>
    `;
  },

  celebrate(selectedButton, word) {
    celebrateCorrect(selectedButton, word);
  }
});

function generateAudioEmojiQuiz() { audioEmojiGame.generateQuiz(); }

/* 🔤 SPELLING GAME LOGIC (글자를 한 글자씩 듣고, 순서대로 눌러서 완성하는 게임)
   - 단어의 히라가나를 한 글자씩 재생 → 화면에는 섞인 글자 버튼이 표시됨
   - 버튼을 정답 순서대로 누르면 칸이 하나씩 채워지고, 다 채우면 이모지 + 전체 발음 재생 */
let currentSpellingWord = null;
let spellingTargetChars = [];   // 정답 순서의 전체 글자 배열 (Array.from(word.jp))
let spellingRemaining = [];     // 아직 눌러야 할 글자들 (앞에서부터 하나씩 제거됨)
let spellingScore = 0;
let spellingCombo = 0;
let isSpellingAnswering = false;
let spellingAdvanceTimer = null;

function generateSpellingQuestion(){
  clearTimeout(spellingAdvanceTimer);
  isSpellingAnswering = false;

  const feedbackEl = document.getElementById('spellingFeedback');
  if(feedbackEl) feedbackEl.textContent = '';
  const revealEl = document.getElementById('spellingEmojiReveal');
  if(revealEl){
    revealEl.style.display = 'none';
    revealEl.querySelector('.spelling-emoji-big').textContent = '';
  }

  // 글자가 2개 이상인 단어만 사용 (한 글자 단어는 순서 맞추기 게임에 적합하지 않음)
  const activeWords = getActiveWords();
  const spellablePool = activeWords.filter(w => Array.from(w.jp).length >= 2);
  const pool = spellablePool.length > 0 ? spellablePool : activeWords;
  const randomIndex = Math.floor(Math.random() * pool.length);
  currentSpellingWord = pool[randomIndex];

  spellingTargetChars = Array.from(currentSpellingWord.jp);
  spellingRemaining = spellingTargetChars.slice();

  const krHintEl = document.getElementById('spellingKrHint');
  if(krHintEl) krHintEl.textContent = currentSpellingWord.kr;

  renderSpellingSlots();
  renderSpellingLetterOptions();

  const playBtn = document.getElementById('spellingPlayBtn');
  if(playBtn) playBtn.disabled = false;

  playSpellingSequence();
}

function renderSpellingSlots(){
  const slotsEl = document.getElementById('spellingAnswerSlots');
  if(!slotsEl) return;
  slotsEl.innerHTML = '';
  spellingTargetChars.forEach((ch, i) => {
    const slot = document.createElement('div');
    slot.className = 'spelling-slot';
    slot.id = `spellingSlot${i}`;
    slotsEl.appendChild(slot);
  });
}

function renderSpellingLetterOptions(){
  const optionsContainer = document.getElementById('spellingLetterOptions');
  if(!optionsContainer) return;
  optionsContainer.innerHTML = '';

  // 같은 글자가 여러 번 나오는 단어(예: こうこうせい)도 각 글자마다 별도 버튼을 만들어 섞습니다
  const tiles = spellingTargetChars.map((ch, i) => ({ char: ch, tileId: i }));
  tiles.sort(() => Math.random() - 0.5);

  tiles.forEach(tile => {
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.textContent = tile.char;
    btn.dataset.char = tile.char;
    btn.dataset.tileId = tile.tileId;
    btn.addEventListener('click', () => selectSpellingLetter(btn));
    optionsContainer.appendChild(btn);
  });
}

/* 정답 단어를 한 글자씩 끊어서 순서대로 들려줍니다 (예: こ, う, こ, う, せ, い) */
function playSpellingSequence(){
  if(!currentSpellingWord) return;
  if(!('speechSynthesis' in window)) return;

  const playBtn = document.getElementById('spellingPlayBtn');
  if(playBtn) playBtn.disabled = true;
  window.speechSynthesis.cancel();

  const rate = babyTalkMode ? 0.6 : 0.8;
  const pitch = babyTalkMode ? 1.35 : 1.0;
  const chars = spellingTargetChars;
  let i = 0;

  function playNext(){
    if(i >= chars.length){
      if(playBtn) playBtn.disabled = false;
      return;
    }
    const utter = new SpeechSynthesisUtterance(chars[i]);
    utter.lang = 'ja-JP';
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onend = () => { i++; setTimeout(playNext, 400); };
    utter.onerror = () => { i++; setTimeout(playNext, 400); };
    window.speechSynthesis.speak(utter);
  }
  setTimeout(playNext, 50);
}

/* 버튼을 누를 때마다 그 글자 하나의 발음을 즉시 들려줍니다 (정답/오답과 무관하게 매번 재생).
   onEnd을 넘기면 그 발음이 끝난 뒤(onend/onerror) 콜백을 실행합니다 — 정답을 완성시키는
   마지막 글자처럼, 이 발음이 끝나야만 다음 재생(정답 축하 시퀀스)을 시작해야 할 때 사용합니다.
   콜백 없이 그냥 "발사 후 신경 안 쓰는(fire-and-forget)" 방식으로 두면, 뒤이어 곧바로 실행되는
   다른 재생 함수의 즉시 speak() 호출과 큐 순서가 뒤엉켜 엉뚱한 글자가 튀어나오는 문제가 있었습니다. */
function playSpellingLetterSound(char, onEnd){
  if(!('speechSynthesis' in window)){ if(onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();
  const rate = babyTalkMode ? 0.6 : 0.8;
  const pitch = babyTalkMode ? 1.35 : 1.0;
  const utter = new SpeechSynthesisUtterance(char);
  utter.lang = 'ja-JP';
  utter.rate = rate;
  utter.pitch = pitch;
  if(onEnd){
    utter.onend = onEnd;
    utter.onerror = onEnd;
  }
  setTimeout(() => { window.speechSynthesis.speak(utter); }, 30);
}

/* 단어를 완성했을 때: 단어 전체 발음 → 글자를 한 글자씩 다시 발음 → 단어 전체 발음을 한 번 더 들려주어
   기억에 남도록 돕고, 모두 끝나면 onAllDone 콜백으로 다음 문제로 넘어갑니다.
   (이 함수는 항상 이전 발음이 완전히 끝난 뒤(onend 콜백 안에서) 호출되어야 순서가 꼬이지 않습니다) */
function playSpellingCompletionAudio(word, chars, onAllDone){
  if(!('speechSynthesis' in window)){ if(onAllDone) onAllDone(); return; }

  const rate = babyTalkMode ? 0.6 : 0.8;
  const pitch = babyTalkMode ? 1.35 : 1.0;

  function speakOnce(text, gapAfter, cb){
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onend = () => setTimeout(cb, gapAfter);
    utter.onerror = () => setTimeout(cb, gapAfter);
    window.speechSynthesis.speak(utter);
  }

  function playLettersThen(cb){
    let i = 0;
    function next(){
      if(i >= chars.length){ cb(); return; }
      speakOnce(chars[i], 400, () => { i++; next(); });
    }
    next();
  }

  // 1) 단어 전체 발음
  speakOnce(word.jp, 500, () => {
    // 2) 히라가나 한 글자씩 다시 발음
    playLettersThen(() => {
      // 3) 단어 전체 발음 한 번 더
      speakOnce(word.jp, 500, () => {
        if(onAllDone) onAllDone();
      });
    });
  });
}

function selectSpellingLetter(btn){
  if(isSpellingAnswering || btn.disabled) return;

  const nextChar = spellingRemaining[0];
  const clickedChar = btn.dataset.char;
  const feedbackEl = document.getElementById('spellingFeedback');

  if(clickedChar === nextChar){
    const slotIndex = spellingTargetChars.length - spellingRemaining.length;
    const slotEl = document.getElementById(`spellingSlot${slotIndex}`);
    if(slotEl){
      slotEl.textContent = clickedChar;
      slotEl.classList.add('filled');
    }
    btn.disabled = true;
    btn.classList.add('used');
    spellingRemaining.shift();
    if(feedbackEl) feedbackEl.textContent = '';

    if(spellingRemaining.length === 0){
      // 단어 완성!
      isSpellingAnswering = true;
      spellingScore += 10;
      spellingCombo += 1;
      const scoreEl = document.getElementById('spellingScore');
      const comboEl = document.getElementById('spellingCombo');
      if(scoreEl) scoreEl.textContent = spellingScore;
      if(comboEl) comboEl.textContent = spellingCombo;

      playCorrectSound();
      celebrateCorrect(btn, currentSpellingWord);
      addLogChip(currentSpellingWord);
      recordWordResult(currentSpellingWord, true);

      const revealEl = document.getElementById('spellingEmojiReveal');
      if(revealEl){
        revealEl.style.display = 'block';
        revealEl.querySelector('.spelling-emoji-big').innerHTML = emojiVisualHTML(currentSpellingWord);
      }

      // 마지막 글자의 클릭 발음이 완전히 끝난 뒤에야(onEnd 콜백 안에서) 정답 축하 발음
      // (단어 전체 → 글자별 → 단어 전체) 시퀀스를 시작합니다. 이렇게 해야 재생 순서가 꼬이지 않습니다.
      const wordForPlayback = currentSpellingWord;
      const charsForPlayback = spellingTargetChars.slice();
      playSpellingLetterSound(clickedChar, () => {
        playSpellingCompletionAudio(wordForPlayback, charsForPlayback, () => {
          spellingAdvanceTimer = setTimeout(() => {
            generateSpellingQuestion();
          }, 500);
        });
      });
    } else {
      // 아직 남은 글자가 있으면, 누른 글자의 발음만 바로 들려줍니다
      playSpellingLetterSound(clickedChar);
    }
  } else {
    playSpellingLetterSound(clickedChar);
    btn.classList.add('wrong');
    spellingCombo = 0;
    const comboEl = document.getElementById('spellingCombo');
    if(comboEl) comboEl.textContent = spellingCombo;
    playWrongSound();
    recordWordResult(currentSpellingWord, false);
    if(feedbackEl){
      feedbackEl.textContent = wrongFeedbackText('앗, 순서가 달라요! 다시 들어볼까요? 👂');
      feedbackEl.style.color = wrongFeedbackColor();
    }
    setTimeout(() => {
      btn.classList.remove('wrong');
    }, 500);
  }
}

/* 🔍 낱말 찾기 퍼즐 게임 로직
   상단에 정답 이모지 4개, 아래 격자(4x4~8x8 중 선택 가능)가 놓이고, 가로/세로/대각선으로
   연속한 칸을 손가락(또는 마우스)으로 끌어 4개 단어를 모두 찾으면 완료되는 게임입니다. */
const WS_MIN_SIZE = 4;
const WS_MAX_SIZE = 8;

const WS_FILLER_CHARS = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげございずぜぞだぢづでどばびぶべぼぱぴぷぺぽ'.split('');

let wsGridSize = 8;        // 4~8 중 선택된 격자 한 변의 칸 수
let wsPuzzle = null;       // { grid, placedWords: [{word, chars, cells}] }
let wsFound = [];          // boolean[4]
let wsCellEls = [];        // wsCellEls[r][c] -> DOM element
let wsCombo = 0;
let wsDragging = false;
let wsStartRC = null;
let wsCurrentPath = [];
let wsBound = false;
let wsHintTimer = null;
let wsHintToken = 0;

function initWordSearchGame(){
  wsCombo = 0;
  const comboEl = document.getElementById('wsCombo');
  if(comboEl) comboEl.textContent = wsCombo;
  updateWordSearchSizeButtons();
  renderWordSearchPuzzle();
  attachWordSearchPointerEvents();
}

/* 🔢 격자 크기 선택 버튼 클릭 시 호출 — 크기를 바꾸고 새 퍼즐을 만듭니다 */
function setWordSearchGridSize(size){
  size = Math.max(WS_MIN_SIZE, Math.min(WS_MAX_SIZE, parseInt(size, 10) || 8));
  if(size === wsGridSize){
    renderWordSearchPuzzle();
    return;
  }
  wsGridSize = size;
  updateWordSearchSizeButtons();
  renderWordSearchPuzzle();
}

function updateWordSearchSizeButtons(){
  document.querySelectorAll('.ws-size-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.size, 10) === wsGridSize);
  });
}

/* 단어 후보 고르기: 선택된 격자 크기에 들어갈 수 있도록 글자 수 2자~격자 크기 이하인
   활성 단어 중 4개를 무작위로 선택 (조건에 맞는 단어가 부족하면 전체 사전에서 보충) */
function pickWordSearchWords(){
  const fitsGrid = (w) => {
    const len = Array.from(w.jp).length;
    return len >= 2 && len <= wsGridSize;
  };
  let pool = getActiveWords().filter(fitsGrid);
  if(pool.length < 4){
    pool = DICTIONARY.filter(fitsGrid);
  }
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  // jp가 중복되지 않는 단어만 선택
  const chosen = [];
  const seen = new Set();
  for(const w of shuffled){
    if(seen.has(w.jp)) continue;
    seen.add(w.jp);
    chosen.push(w);
    if(chosen.length >= 4) break;
  }
  return chosen;
}

function placeWordInGrid(grid, chars, SIZE){
  const dirsShuffled = WS_DIRECTIONS.slice().sort(() => Math.random() - 0.5);
  const len = chars.length;
  for(let tries = 0; tries < 200; tries++){
    const dir = dirsShuffled[tries % dirsShuffled.length];
    let minR = 0, maxR = SIZE - 1, minC = 0, maxC = SIZE - 1;
    if(dir.dr === 1) maxR = SIZE - len;
    if(dir.dr === -1) minR = len - 1;
    if(dir.dc === 1) maxC = SIZE - len;
    if(dir.dc === -1) minC = len - 1;
    if(minR > maxR || minC > maxC) continue;
    const startR = minR + Math.floor(Math.random() * (maxR - minR + 1));
    const startC = minC + Math.floor(Math.random() * (maxC - minC + 1));
    const cells = [];
    let fits = true;
    for(let i = 0; i < len; i++){
      const r = startR + dir.dr * i;
      const c = startC + dir.dc * i;
      const existing = grid[r][c];
      if(existing && existing !== chars[i]){ fits = false; break; }
      cells.push({r, c});
    }
    if(fits){
      cells.forEach((cell, i) => { grid[cell.r][cell.c] = chars[i]; });
      return cells;
    }
  }
  return null;
}

function buildWordSearchPuzzle(){
  const words = pickWordSearchWords();
  let grid, placedWords, ok = false, safety = 0;
  while(!ok && safety < 40){
    safety++;
    grid = Array.from({length: wsGridSize}, () => Array(wsGridSize).fill(null));
    placedWords = [];
    for(const w of words){
      const chars = Array.from(w.jp);
      const cells = placeWordInGrid(grid, chars, wsGridSize);
      if(cells) placedWords.push({word: w, chars, cells});
    }
    ok = placedWords.length === words.length && placedWords.length >= 2;
  }
  for(let r = 0; r < wsGridSize; r++){
    for(let c = 0; c < wsGridSize; c++){
      if(!grid[r][c]) grid[r][c] = WS_FILLER_CHARS[Math.floor(Math.random() * WS_FILLER_CHARS.length)];
    }
  }
  return { grid, placedWords };
}

function renderWordSearchPuzzle(){
  clearTimeout(wsHintTimer);
  wsHintToken++;
  wsPuzzle = buildWordSearchPuzzle();
  wsFound = wsPuzzle.placedWords.map(() => false);
  wsCombo = 0;
  const comboEl = document.getElementById('wsCombo');
  if(comboEl) comboEl.textContent = wsCombo;
  const hintBtn = document.getElementById('wsHintBtn');
  if(hintBtn) hintBtn.disabled = false;

  const emojiRow = document.getElementById('wsEmojiRow');
  if(emojiRow){
    emojiRow.innerHTML = wsPuzzle.placedWords.map((pw, i) => `
      <div class="ws-emoji-box" id="wsEmoji${i}">
        <span class="ws-emoji-icon">${pw.word.emoji}${posBadgeHTML(pw.word)}</span>
        <span class="ws-emoji-jp">${pw.word.jp}</span>
        <span class="ws-emoji-kr">${pw.word.kr}</span>
      </div>
    `).join('');
  }

  const gridEl = document.getElementById('wsGrid');
  if(gridEl){
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${wsGridSize}, 1fr)`;
    wsCellEls = Array.from({length: wsGridSize}, () => Array(wsGridSize).fill(null));
    for(let r = 0; r < wsGridSize; r++){
      for(let c = 0; c < wsGridSize; c++){
        const cell = document.createElement('div');
        cell.className = 'ws-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = wsPuzzle.grid[r][c];
        gridEl.appendChild(cell);
        wsCellEls[r][c] = cell;
      }
    }
  }

  const countEl = document.getElementById('wsFoundCount');
  if(countEl) countEl.textContent = '0';
  setWsFeedback('', null);
}

function attachWordSearchPointerEvents(){
  if(wsBound) return;
  wsBound = true;
  const gridEl = document.getElementById('wsGrid');
  if(gridEl) gridEl.addEventListener('pointerdown', wsOnPointerDown);
  document.addEventListener('pointermove', wsOnPointerMove);
  document.addEventListener('pointerup', wsOnPointerUp);
  document.addEventListener('pointercancel', wsOnPointerUp);
}

function wsCellFromEvent(e){
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if(!el) return null;
  const cellEl = el.closest ? el.closest('.ws-cell') : null;
  if(!cellEl) return null;
  return { r: parseInt(cellEl.dataset.row, 10), c: parseInt(cellEl.dataset.col, 10) };
}

function wsOnPointerDown(e){
  const modeEl = document.getElementById('wordsearchMode');
  if(!modeEl || !modeEl.classList.contains('active')) return;
  const cell = wsCellFromEvent(e);
  if(!cell) return;
  e.preventDefault();
  wsDragging = true;
  wsStartRC = cell;
  wsCurrentPath = [cell];
  wsHighlightPath(wsCurrentPath);
}

function wsOnPointerMove(e){
  if(!wsDragging) return;
  const cell = wsCellFromEvent(e);
  if(!cell) return;
  const dr = cell.r - wsStartRC.r;
  const dc = cell.c - wsStartRC.c;
  if(dr === 0 && dc === 0){
    wsCurrentPath = [cell];
    wsHighlightPath(wsCurrentPath);
    return;
  }
  const isStraight = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
  if(!isStraight) return;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const path = [];
  for(let i = 0; i <= steps; i++){
    path.push({ r: wsStartRC.r + stepR * i, c: wsStartRC.c + stepC * i });
  }
  wsCurrentPath = path;
  wsHighlightPath(path);
}

function wsOnPointerUp(){
  if(!wsDragging) return;
  wsDragging = false;
  wsCheckSelection(wsCurrentPath);
  wsCurrentPath = [];
}

function stopWordSearchDrag(){
  wsDragging = false;
  wsCurrentPath = [];
  clearTimeout(wsHintTimer);
  wsHintToken++;
  if(wsCellEls && wsCellEls.length){
    wsCellEls.forEach(row => row.forEach(el => { if(el){ el.classList.remove('selecting'); el.classList.remove('hint'); } }));
  }
  const hintBtn = document.getElementById('wsHintBtn');
  if(hintBtn) hintBtn.disabled = false;
}

/* 💡 힌트 보기: 아직 못 찾은 단어 중 하나를 골라 격자에서 깜빡이며 위치를 알려주고 발음도 들려줌 */
function showWordSearchHint(){
  if(!wsPuzzle) return;
  const remainingIdx = wsPuzzle.placedWords
    .map((pw, i) => i)
    .filter(i => !wsFound[i]);
  if(remainingIdx.length === 0){
    setWsFeedback('이미 모두 찾았어요! 🎉', true);
    return;
  }
  clearTimeout(wsHintTimer);
  wsHintToken++;
  const myToken = wsHintToken;

  const idx = remainingIdx[Math.floor(Math.random() * remainingIdx.length)];
  const pw = wsPuzzle.placedWords[idx];

  // 이전에 남아있을 수 있는 힌트 표시를 정리
  wsCellEls.forEach(row => row.forEach(el => { if(el) el.classList.remove('hint'); }));

  pw.cells.forEach(cell => {
    const el = wsCellEls[cell.r] && wsCellEls[cell.r][cell.c];
    if(el && !el.classList.contains('found')) el.classList.add('hint');
  });

  speakTTS(pw.word.jp);
  setWsFeedback(`힌트: "${pw.word.kr}" 를 찾아보세요 👀`, null);

  const hintBtn = document.getElementById('wsHintBtn');
  if(hintBtn) hintBtn.disabled = true;

  wsHintTimer = setTimeout(() => {
    if(myToken !== wsHintToken) return; // 그 사이 새 퍼즐이 생성되었거나 다른 힌트가 눌린 경우 무시
    pw.cells.forEach(cell => {
      const el = wsCellEls[cell.r] && wsCellEls[cell.r][cell.c];
      if(el) el.classList.remove('hint');
    });
    const btn = document.getElementById('wsHintBtn');
    if(btn) btn.disabled = false;
  }, 2200);
}

function wsHighlightPath(path){
  if(!wsCellEls.length) return;
  wsCellEls.forEach(row => row.forEach(el => { if(el) el.classList.remove('selecting'); }));
  path.forEach(p => {
    const el = wsCellEls[p.r] && wsCellEls[p.r][p.c];
    if(el && !el.classList.contains('found')) el.classList.add('selecting');
  });
}

function setWsFeedback(text, isCorrect){
  const el = document.getElementById('wsFeedback');
  if(!el) return;
  el.textContent = text;
  el.classList.remove('correct', 'wrong');
  if(isCorrect === true) el.classList.add('correct');
  if(isCorrect === false) el.classList.add('wrong');
}

function wsCheckSelection(path){
  wsCellEls.forEach(row => row.forEach(el => { if(el) el.classList.remove('selecting'); }));
  if(!wsPuzzle || path.length < 2) return;

  // 선택한 순서 그대로(정방향)일 때만 정답으로 인정 — 거꾸로 고르면 오답 처리됩니다
  const letters = path.map(p => wsPuzzle.grid[p.r][p.c]).join('');

  let matchedIdx = -1;
  wsPuzzle.placedWords.forEach((pw, i) => {
    if(wsFound[i]) return;
    if(pw.word.jp === letters) matchedIdx = i;
  });

  if(matchedIdx >= 0){
    wsFound[matchedIdx] = true;
    const matchedWord = wsPuzzle.placedWords[matchedIdx].word;
    path.forEach(p => {
      const el = wsCellEls[p.r][p.c];
      if(el) el.classList.add('found', 'found-' + matchedIdx);
    });
    const emojiEl = document.getElementById('wsEmoji' + matchedIdx);
    if(emojiEl) emojiEl.classList.add('found');

    wsCombo++;
    const comboEl = document.getElementById('wsCombo');
    if(comboEl) comboEl.textContent = wsCombo;

    playCorrectSound();
    celebrateCorrect(emojiEl, matchedWord);
    recordWordResult(matchedWord, true);
    addLogChip(matchedWord);
    speakTTS(matchedWord.jp);

    const foundCount = wsFound.filter(Boolean).length;
    const countEl = document.getElementById('wsFoundCount');
    if(countEl) countEl.textContent = foundCount;

    if(foundCount >= wsPuzzle.placedWords.length){
      setWsFeedback(`${matchedWord.kr} 맞아요! 모두 다 찾았어요! 🌟🎊`, true);
      setTimeout(() => { launchConfetti(); }, 200);
    } else {
      setWsFeedback(`${matchedWord.kr} 찾았어요! 🎉`, true);
    }
  } else {
    wsCombo = 0;
    const comboEl = document.getElementById('wsCombo');
    if(comboEl) comboEl.textContent = wsCombo;
    playWrongSound();
    path.forEach(p => {
      const el = wsCellEls[p.r] && wsCellEls[p.r][p.c];
      if(el && !el.classList.contains('found')) el.classList.add('wrong-flash');
    });
    setTimeout(() => {
      path.forEach(p => {
        const el = wsCellEls[p.r] && wsCellEls[p.r][p.c];
        if(el) el.classList.remove('wrong-flash');
      });
    }, 350);
    setWsFeedback(wrongFeedbackText('다시 한번 찾아보세요 🔍'), false);
  }
}

/* 🤔 '나는 무엇일까요?' 수수께끼 게임 로직
   — 힌트는 총 5개이며, 정답을 맞히든 못 맞히든 1초마다 자동으로 다음 힌트가 나옵니다.
   — 몇 번째 힌트에서 맞혔는지에 따라 점수가 달라집니다: 1번째 5점, 2번째 4점, 3번째 3점, 4번째 2점, 5번째 1점. */
function generateRiddleQuestion(){
  clearTimeout(riddleAdvanceTimer);
  clearTimeout(riddleHintTimer);
  isRiddleAnswering = false;
  const feedbackEl = document.getElementById('riddleFeedback');
  if(feedbackEl) feedbackEl.textContent = '';

  let pool = RIDDLES;
  if(pool.length > 1 && previousRiddleJp){
    pool = pool.filter(r => r.jp !== previousRiddleJp);
  }
  const riddle = pool[Math.floor(Math.random() * pool.length)];
  currentRiddle = riddle;
  previousRiddleJp = riddle.jp;
  riddleHintIndex = 1;
  riddleTranslationRevealCount = 0;
  riddleHintSlots = buildRiddleHintSlots(riddle);

  renderRiddleHints(true);
  buildRiddleChoices();
}

/* 이 문제에서 쓸 5개짜리 힌트를 미리 계산해둡니다.
   1~3번째는 데이터에 있는 실제 힌트, 4번째는 정답의 앞글자를 하나씩 더 보여주는 힌트,
   5번째(마지막)는 항상 고정된 문구로 마무리합니다. */
function buildRiddleHintSlots(riddle){
  const dataHints = riddle.hints || [];
  const dataHintsKr = riddle.hintsKr || [];
  const slots = [];
  const fillerCount = RIDDLE_TOTAL_HINTS - 1; // 마지막 1개는 고정 문구용으로 남겨둡니다
  for(let i = 0; i < fillerCount; i++){
    if(i < dataHints.length){
      slots.push({ jp: dataHints[i], kr: dataHintsKr[i] || '' });
    } else {
      const revealCount = i - dataHints.length + 1;
      const revealed = riddle.jp.slice(0, revealCount);
      slots.push({
        jp: `さいしょの もじは ${revealed} だよ。`,
        kr: `첫 글자는 ${revealed}예요.`
      });
    }
  }
  slots.push({ jp: `わたしは ${riddle.jp}です。`, kr: `나는 ${riddle.kr}입니다.` });
  return slots;
}

/* 힌트의 발음이 끝난 뒤 2초가 지나면 자동으로 다음 힌트를 보여주는 콜백 체인.
   5번째 힌트까지 다 나온 뒤에도 답을 못 맞히면, 발음이 끝나고 2초 뒤 정답을 공개합니다. */
function onRiddleHintSpeechEnd(){
  clearTimeout(riddleHintTimer);
  if(isRiddleAnswering) return;
  if(riddleHintIndex >= RIDDLE_TOTAL_HINTS){
    riddleHintTimer = setTimeout(() => {
      if(!isRiddleAnswering) revealRiddleAnswerByTimeout();
    }, 2000);
    return;
  }
  riddleHintTimer = setTimeout(() => {
    if(isRiddleAnswering) return;
    riddleHintIndex += 1;
    renderRiddleHints(true); // 다음 힌트를 보여주고 발음하면, 발음이 끝난 뒤 다시 이 함수가 호출됩니다
  }, 2000);
}

/* 지금까지 나온 힌트를 순서대로 화면에 쌓아 보여주고, 가장 최근 힌트만 소리 내어 읽어줍니다.
   정답을 맞히거나 힌트가 넘어간 뒤에는 한글 뜻을 함께 보여줍니다. */
function renderRiddleHints(speakLatest){
  if(!currentRiddle || !riddleHintSlots) return;
  const list = document.getElementById('riddleHintList');
  list.innerHTML = '';
  for(let i = 0; i < riddleHintIndex; i++){
    const item = document.createElement('div');
    item.className = 'riddle-hint-item';
    item.innerHTML = `<span class="riddle-hint-text" id="riddleHintText${i}"></span>`;
    list.appendChild(item);
    const textEl = item.querySelector('.riddle-hint-text');
    const hintText = riddleHintSlots[i].jp;
    if(i === riddleHintIndex - 1 && speakLatest){
      speakWithHighlight(hintText, textEl, {rate:0.75, onEnd: onRiddleHintSpeechEnd});
    } else {
      textEl.textContent = hintText;
    }
    // 이 힌트가 지나갔거나(자동으로 다음 힌트로 넘어갔거나) 정답을 맞힌 뒤라면 한글 뜻을 괄호로 같은 줄에 보여줍니다.
    if(i < riddleTranslationRevealCount){
      const krEl = document.createElement('span');
      krEl.className = 'riddle-hint-kr';
      krEl.textContent = ` (${riddleHintSlots[i].kr})`;
      item.appendChild(krEl);
    }
  }
  const counterEl = document.getElementById('riddleHintCounter');
  if(counterEl) counterEl.textContent = `힌트 ${riddleHintIndex} / ${riddleHintSlots.length}`;
}

function buildRiddleChoices(){
  const optionsContainer = document.getElementById('riddleOptions');
  optionsContainer.innerHTML = '';
  if(!currentRiddle) return;

  const choices = [currentRiddle];
  const pool = RIDDLES.filter(r => r.jp !== currentRiddle.jp).sort(() => Math.random() - 0.5);
  while(choices.length < 4 && pool.length > 0){
    choices.push(pool.pop());
  }
  choices.sort(() => Math.random() - 0.5);

  choices.forEach(riddle => {
    const btn = document.createElement('button');
    btn.className = 'emoji-btn';
    btn.dataset.jp = riddle.jp;
    btn.innerHTML = `
      ${renderWordVisual(riddle)}
      <span class="btn-text-jp">${riddle.jp}</span>
      <span class="btn-text-kr">${riddle.kr}</span>
    `;
    btn.addEventListener('click', () => selectRiddleAnswer(btn, riddle));
    optionsContainer.appendChild(btn);
  });
}

/* 힌트 5개를 다 쓰고도 답을 못 맞혔을 때, 자동으로 정답을 공개하고 다음 문제로 넘어갑니다. */
function revealRiddleAnswerByTimeout(){
  if(!currentRiddle) return;
  isRiddleAnswering = true;
  const feedbackEl = document.getElementById('riddleFeedback');
  const allButtons = document.querySelectorAll('#riddleOptions .emoji-btn');

  riddleCombo = 0;
  const comboEl = document.getElementById('riddleCombo');
  if(comboEl) comboEl.textContent = riddleCombo;

  recordWordResult(currentRiddle, false);
  if(feedbackEl) feedbackEl.textContent = `정답은 ${currentRiddle.jp}(${currentRiddle.kr})였어요!`;
  riddleTranslationRevealCount = riddleHintIndex;
  renderRiddleHints(false);
  allButtons.forEach(btn => {
    if(btn.dataset.jp === currentRiddle.jp) btn.classList.add('correct-hint');
  });

  riddleAdvanceTimer = setTimeout(() => {
    generateRiddleQuestion();
  }, 2200);
}

function selectRiddleAnswer(selectedButton, riddle){
  if(isRiddleAnswering || !currentRiddle) return;

  const scoreEl = document.getElementById('riddleScore');
  const comboEl = document.getElementById('riddleCombo');
  const feedbackEl = document.getElementById('riddleFeedback');
  const allButtons = document.querySelectorAll('#riddleOptions .emoji-btn');

  if(riddle.jp === currentRiddle.jp){
    isRiddleAnswering = true;
    clearTimeout(riddleHintTimer); // 정답을 맞혔으니 자동 힌트 진행을 멈춥니다
    // 몇 번째 힌트에서 맞혔는지에 따라 점수를 차등 지급합니다: 1번째 5점 ~ 5번째 1점
    const earnedScore = Math.max(1, (RIDDLE_TOTAL_HINTS + 1) - riddleHintIndex);
    riddleScore += earnedScore;
    riddleCombo += 1;
    scoreEl.textContent = riddleScore;
    comboEl.textContent = riddleCombo;
    feedbackEl.textContent = `정답이에요! 🎉 +${earnedScore}점 · ${currentRiddle.jp}(${currentRiddle.kr})`;
    playCorrectSound();
    // 다른 게임과 달리 여기서는 동물 울음 합성음(playAnimalCry) 대신,
    // 이모지가 커졌다 작아지는 연출에 맞춰 정답 히라가나를 소리 내어 읽어줍니다.
    celebrateElement(selectedButton);
    celebrateFullscreenEmoji(currentRiddle.emoji);
    speakTTS(currentRiddle.jp);
    addLogChip(currentRiddle);
    recordWordResult(currentRiddle, true);

    allButtons.forEach(btn => {
      if(btn.dataset.jp === currentRiddle.jp) btn.classList.add('correct');
    });

    // 정답을 맞혔으니 지금까지 나온 힌트들의 한글 뜻을 모두 공개합니다.
    riddleTranslationRevealCount = riddleHintIndex;
    renderRiddleHints(false);

    riddleAdvanceTimer = setTimeout(() => {
      generateRiddleQuestion();
    }, 1800);

  } else {
    selectedButton.classList.add('wrong');
    riddleCombo = 0;
    comboEl.textContent = riddleCombo;
    playWrongSound();
    feedbackEl.textContent = wrongFeedbackText('아직 아니에요! 다음 힌트를 들어봐요 🔍');
    setTimeout(() => { selectedButton.classList.remove('wrong'); }, 800);
    // 힌트는 정답 여부와 상관없이 onRiddleHintSpeechEnd()가 발음이 끝난 뒤 2초마다 자동으로 넘겨줍니다.
  }
}

/* ============================================================
   무제한 4지선다 문답 게임 공통 엔진
   ('질문에 답하기' / '생활 문답' / '가게 게임'이 이 엔진 하나를 공유합니다.
    세 게임 모두 '질문을 히라가나로 보여주며 음성으로 읽어주기 → 4개의
    문장 선택지 중 알맞은 답 고르기 → 정답 시 축하 효과 + 정답 문장
    음성 재생 후 2초 뒤 다음 문제' 구조가 동일합니다. 정답 선택지 자체의
    jp/kr 문구가 곧 정답 피드백 문구·음성 낭독 내용으로 그대로 재사용되는
    공통 패턴이라 그 부분은 엔진이 자동 처리하고, 문제 출제 방식(pickItem)·
    선택지 구성(buildChoiceList)·상단 시각 요소 렌더링(renderQuestionVisual)·
    질문 문장(questionText)·정답 축하 이모지(celebrateEmoji)·오답 힌트
    문구(wrongHintText)만 cfg로 게임별로 분리했습니다. )
   ============================================================ */
function createUnlimitedChoiceQuizGame(cfg) {
  const P = cfg.idPrefix;
  const el = (suffix) => document.getElementById(P + suffix);
  const questionEl = () => el('QuestionJp');

  let score = 0, combo = 0, currentItem = null, previousKey = null, isAnswering = false;
  let advanceTimer = null;

  function clearPrevious() { previousKey = null; }

  function cancelAdvance() { clearTimeout(advanceTimer); }

  function replay() {
    if (!currentItem) return;
    speakWithHighlight(cfg.questionText(currentItem), questionEl(), {rate: 0.75});
  }

  function generate() {
    clearTimeout(advanceTimer);
    isAnswering = false;
    const feedbackEl = el('Feedback');
    if (feedbackEl) feedbackEl.textContent = '';

    const picked = cfg.pickItem(previousKey);
    currentItem = picked.item;
    previousKey = picked.key;

    cfg.renderQuestionVisual(currentItem);
    speakWithHighlight(cfg.questionText(currentItem), questionEl(), {rate: 0.75});

    buildChoices();
  }

  function buildChoices() {
    const container = el('Choices');
    container.innerHTML = '';
    container.classList.remove('revealed');
    if (!currentItem) return;

    const choices = cfg.buildChoiceList(currentItem);

    choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'qa-choice-btn';
      btn.dataset.correct = choice.isCorrect ? '1' : '0';
      btn.innerHTML = `
        <span class="qa-choice-num">${idx + 1}</span>
        <span class="qa-choice-text">
          <span class="qa-choice-jp">${choice.jp}</span>
          <span class="qa-choice-kr">${choice.kr}</span>
        </span>
      `;
      btn.addEventListener('click', () => selectChoice(btn, choice));
      container.appendChild(btn);
    });
  }

  function selectChoice(selectedButton, choice) {
    if (isAnswering || !currentItem) return;

    const scoreEl = el('Score');
    const comboEl = el('Combo');
    const feedbackEl = el('Feedback');
    const allButtons = document.querySelectorAll(`#${P}Choices .qa-choice-btn`);

    if (choice.isCorrect) {
      isAnswering = true;
      score += 10;
      combo += 1;
      scoreEl.textContent = score;
      comboEl.textContent = combo;
      // 정답 선택지의 jp/kr 문구를 그대로 피드백 문구로 재사용합니다
      feedbackEl.textContent = `정답이에요! 🎉 ${choice.jp}(${choice.kr})`;
      playCorrectSound();
      celebrateElement(selectedButton);
      celebrateFullscreenEmoji(cfg.celebrateEmoji(currentItem, choice));
      speakTTS(choice.jp);

      allButtons.forEach(btn => {
        if (btn.dataset.correct === '1') btn.classList.add('correct');
      });
      el('Choices').classList.add('revealed');

      advanceTimer = setTimeout(() => {
        generate();
      }, 2000);

    } else {
      selectedButton.classList.add('wrong');
      combo = 0;
      comboEl.textContent = combo;
      playWrongSound();
      feedbackEl.textContent = wrongFeedbackText(cfg.wrongHintText);

      allButtons.forEach(btn => {
        if (btn.dataset.correct === '1') btn.classList.add('correct-hint');
      });

      setTimeout(() => {
        selectedButton.classList.remove('wrong');
      }, 800);
    }
  }

  return { generate, replay, clearPrevious, cancelAdvance };
}

/* ❓ '질문에 답하기' 게임 설정 — 이모지를 보여주며 히라가나 질문을 음성으로 들려주고,
   4개의 문장 선택지(정답 1개 + 다른 문항의 대답 3개) 중 알맞은 대답을 고르게 합니다. */
const qaGame = createUnlimitedChoiceQuizGame({
  idPrefix: 'qa',
  wrongHintText: '다시 들어보고 골라봐요 🔍',

  pickItem(prevKey) {
    let pool = QA_ITEMS;
    if (pool.length > 1 && prevKey) {
      pool = pool.filter(q => q.answerJp !== prevKey);
    }
    const item = pool[Math.floor(Math.random() * pool.length)];
    return { item, key: item.answerJp };
  },

  renderQuestionVisual(item) {
    const emojiEl = document.getElementById('qaEmoji');
    if (emojiEl) emojiEl.textContent = item.emoji;
  },

  questionText(item) { return item.questionJp; },

  buildChoiceList(item) {
    const choices = [item];
    const pool = QA_ITEMS.filter(q => q.answerJp !== item.answerJp).sort(() => Math.random() - 0.5);
    while (choices.length < 4 && pool.length > 0) {
      choices.push(pool.pop());
    }
    choices.sort(() => Math.random() - 0.5);
    return choices.map(q => ({ jp: q.answerJp, kr: q.answerKr, isCorrect: q.answerJp === item.answerJp }));
  },

  celebrateEmoji(item) { return item.emoji; }
});

function generateQaQuestion() { qaGame.generate(); }
/* 질문 음성을 다시 들려줍니다 (화면에 이미 그려진 글자를 다시 하이라이트하며 읽어줌) */
function replayQaQuestion() { qaGame.replay(); }

/* 🌈 '생활 문답' 게임 설정 — 주제(시간/온도/날씨)에 맞는 그림을 오른쪽에 보여주며
   질문을 히라가나로 표시하고 음성으로 들려준 뒤, 4개의 문장 선택지(정답 1개 + 같은 주제의
   다른 문장 3개) 중 그림과 일치하는 문장을 고르게 합니다. */
function getLifeqaPool(){
  if(lifeqaTopicFilter === 'all') return LIFEQA_ITEMS;
  return LIFEQA_ITEMS.filter(q => q.type === lifeqaTopicFilter);
}

const lifeqaGame = createUnlimitedChoiceQuizGame({
  idPrefix: 'lifeqa',
  wrongHintText: '그림을 다시 잘 보고 골라봐요 🔍',

  pickItem(prevKey) {
    let pool = getLifeqaPool();
    if (pool.length > 1 && prevKey) {
      pool = pool.filter(q => q.answerJp !== prevKey);
    }
    const item = pool[Math.floor(Math.random() * pool.length)];
    return { item, key: item.answerJp };
  },

  renderQuestionVisual(item) {
    const imageEl = document.getElementById('lifeqaImage');
    if (imageEl) imageEl.innerHTML = buildLifeqaImage(item);
  },

  questionText(item) { return item.questionJp; },

  buildChoiceList(item) {
    const choices = [item];
    const samePool = LIFEQA_ITEMS.filter(q => q.type === item.type && q.answerJp !== item.answerJp).sort(() => Math.random() - 0.5);
    while (choices.length < 4 && samePool.length > 0) {
      choices.push(samePool.pop());
    }
    choices.sort(() => Math.random() - 0.5);
    return choices.map(q => ({ jp: q.answerJp, kr: q.answerKr, isCorrect: q.answerJp === item.answerJp }));
  },

  celebrateEmoji(item) { return LIFEQA_CELEBRATE_EMOJI[item.type] || '🎉'; }
});

function changeLifeqaTopic(topic){
  lifeqaTopicFilter = topic;
  document.querySelectorAll('.lifeqa-topic-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.topic === topic);
  });
  lifeqaGame.clearPrevious();
  lifeqaGame.generate();
}

function generateLifeqaQuestion() { lifeqaGame.generate(); }
/* 질문 음성을 다시 들려줍니다 */
function replayLifeqaQuestion() { lifeqaGame.replay(); }

/* 🏪 '가게 게임' 설정 — 과일/음식 이모지 4개와 가격을 상단에 보여주고,
   그중 하나의 가격을 히라가나로 물어본 뒤, 4개 항목의 가격 문장(모두 참인 문장)을
   이모지 순서와 다르게 섞어 보여줘서 질문에 해당하는 문장을 고르게 합니다. */
const SHOP_QUESTION_SUFFIX = "は いくらですか？";

function pickShopRoundItems(){
  const shuffledItems = [...SHOP_ITEMS_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
  const shuffledPrices = [...SHOP_PRICES].sort(() => Math.random() - 0.5).slice(0, 4);
  return shuffledItems.map((item, idx) => ({ item, price: shuffledPrices[idx] }));
}

/* 상단에 이모지 4개 + 가격을 카드 형태로 보여줍니다 */
function renderShopItemsDisplay(roundItems){
  const displayEl = document.getElementById('shopItemsDisplay');
  if(!displayEl) return;
  displayEl.innerHTML = '';
  roundItems.forEach(({item, price}) => {
    const card = document.createElement('div');
    card.className = 'shop-item-card';
    card.innerHTML = `
      <div class="shop-item-emoji">${item.emoji}</div>
      <div class="shop-item-price">${price}円</div>
    `;
    displayEl.appendChild(card);
  });
}

const shopGame = createUnlimitedChoiceQuizGame({
  idPrefix: 'shop',
  wrongHintText: '가격표를 다시 잘 보고 골라봐요 🔍',

  pickItem(prevKey) {
    const roundItems = pickShopRoundItems();
    let targetIndex = Math.floor(Math.random() * roundItems.length);
    if (prevKey && roundItems[targetIndex].item.jp === prevKey && roundItems.length > 1) {
      targetIndex = (targetIndex + 1) % roundItems.length;
    }
    return { item: { roundItems, targetIndex }, key: roundItems[targetIndex].item.jp };
  },

  renderQuestionVisual(item) {
    renderShopItemsDisplay(item.roundItems);
  },

  questionText(item) {
    return `${item.roundItems[item.targetIndex].item.jp}${SHOP_QUESTION_SUFFIX}`;
  },

  buildChoiceList(item) {
    const { roundItems, targetIndex } = item;
    const shuffled = roundItems
      .map((entry, idx) => ({ item: entry.item, price: entry.price, isCorrect: idx === targetIndex }))
      .sort(() => Math.random() - 0.5);
    return shuffled.map(entry => ({
      jp: `${entry.item.jp}は ${shopPriceToHiragana(entry.price)}です。`,
      kr: `${entry.item.kr}는 ${entry.price}엔입니다.`,
      isCorrect: entry.isCorrect
    }));
  },

  celebrateEmoji(item) { return item.roundItems[item.targetIndex].item.emoji; }
});

function generateShopQuestion() { shopGame.generate(); }
/* 질문 음성을 다시 들려줍니다 */
function replayShopQuestion() { shopGame.replay(); }


/* ============================================================
   순서대로 이모지 2개를 정해진 순서로 골라 정답을 맞히는 게임 공통 엔진
   (2단어 문장 맞히기 / 합성어 맞추기 게임이 이 엔진 하나를 공유합니다.
    두 게임 모두 '5초 안에 이모지 2개를 순서대로 고르기 → 정답/오답 처리
    → 10문제 후 결과화면' 구조가 동일하되, 세부 동작(SRS 기록 방식,
    상단 타깃 표시 여부 등)은 cfg 콜백으로 분리해 그대로 보존합니다.
    DOM id는 `${idPrefix}Score`, `${idPrefix}Options` 처럼
    idPrefix + 고정 접미사 규칙을 따릅니다.)
   ============================================================ */
function createSequencePickQuizGame(cfg) {
  const P = cfg.idPrefix;
  const el = (suffix) => document.getElementById(P + suffix);
  const optionButtons = () => document.querySelectorAll(`#${P}Options .sentence-btn`);

  let score = 0, combo = 0, maxCombo = 0, correctCount = 0, index = 0;
  let currentItem = null, picked = [], isAnswering = false;
  let timer = null, advanceTimer = null;

  function updateProgress() {
    const progressEl = el('Progress');
    const slots = ['❓', '❓'];
    picked.forEach((p, i) => { slots[i] = p.emoji; });
    progressEl.innerHTML = slots.map(s => `<span class="blank">${s}</span>`).join(' ');
  }

  function speakCurrent() {
    if (!currentItem) return;
    currentItem.speak();
  }

  function init() {
    clearTimeout(timer); clearTimeout(advanceTimer);
    el('StartScreen').style.display = 'block';
    el('QuestionScreen').style.display = 'none';
    el('ResultScreen').style.display = 'none';
    score = 0; combo = 0; maxCombo = 0; correctCount = 0; index = 0;
    el('Score').textContent = '0';
    el('Combo').textContent = '0';
    el('QuestionProgress').textContent = '0';
  }

  function start() {
    clearTimeout(timer); clearTimeout(advanceTimer);
    score = 0; combo = 0; maxCombo = 0; correctCount = 0; index = 0;
    el('Score').textContent = '0';
    el('Combo').textContent = '0';

    el('StartScreen').style.display = 'none';
    el('ResultScreen').style.display = 'none';
    el('QuestionScreen').style.display = 'block';

    generateQuiz();
  }

  function generateQuiz() {
    if (index >= 10) {
      showResult();
      return;
    }

    isAnswering = false;
    clearTimeout(timer);
    clearTimeout(advanceTimer);
    el('QuestionProgress').textContent = index + 1;
    picked = [];
    el('AudioBtn').disabled = false;
    el('AnswerBox').style.display = 'none';

    const activeWords = getActiveWords();
    currentItem = cfg.buildItem(activeWords);
    if (cfg.renderTarget) cfg.renderTarget(currentItem);

    updateProgress();
    speakCurrent();

    // 정답 2개 + 오답(방해) 7개 = 총 9개 이모지, 이모지 중복 없이 구성
    const part1 = currentItem.part1, part2 = currentItem.part2;
    const usedEmojis = new Set([part1.emoji, part2.emoji]);
    const choices = [part1, part2];
    const distractorPool = cfg.getDistractors(activeWords, currentItem);
    distractorPool.sort(() => Math.random() - 0.5);

    for (const p of distractorPool) {
      if (choices.length >= 9) break;
      if (usedEmojis.has(p.emoji)) continue;
      usedEmojis.add(p.emoji);
      choices.push(p);
    }
    choices.sort(() => Math.random() - 0.5);

    const optionsContainer = el('Options');
    optionsContainer.innerHTML = '';

    choices.forEach(part => {
      const btn = document.createElement('button');
      btn.className = 'sentence-btn';
      btn.dataset.jp = part.jp;
      if (part.kr !== undefined) btn.dataset.kr = part.kr;
      btn.innerHTML = cfg.renderChoiceInner(part);
      btn.addEventListener('click', () => pickPart(btn, part));
      optionsContainer.appendChild(btn);
    });

    // 5초 타이머 바 애니메이션 (가득 찬 상태에서 0으로 줄어듦)
    const fill = el('TimerFill');
    fill.style.transition = 'none';
    fill.style.width = '100%';
    void fill.offsetWidth;
    fill.style.transition = 'width 5s linear';
    fill.style.width = '0%';

    timer = setTimeout(() => {
      timeExpired();
    }, 5000);
  }

  function pickPart(selectedButton, part) {
    if (isAnswering) return;
    if (selectedButton.classList.contains('picked')) return;

    const scoreEl = el('Score');
    const comboEl = el('Combo');
    const allButtons = optionButtons();
    const expectedPart = [currentItem.part1, currentItem.part2][picked.length];

    if (part.jp === expectedPart.jp) {
      // 순서가 맞는 정답 선택
      picked.push(part);
      selectedButton.classList.add('picked');
      const badge = document.createElement('span');
      badge.className = 'order-badge';
      badge.textContent = picked.length;
      selectedButton.appendChild(badge);
      updateProgress();

      if (picked.length < 2) {
        // 첫 번째 항목만 맞은 상태 — 계속 진행
        return;
      }

      // 두 항목 모두 순서대로 맞춤!
      isAnswering = true;
      clearTimeout(timer);
      score += 20;
      combo += 1;
      if (combo > maxCombo) maxCombo = combo;
      correctCount += 1;
      scoreEl.textContent = score;
      comboEl.textContent = combo;
      playCorrectSound();
      cfg.celebrate(selectedButton, currentItem);

      el('AudioBtn').disabled = true;
      cfg.onCorrect(currentItem);

      const hint = currentItem.hint();
      el('AnswerBox').style.display = 'block';
      el('JpHint').textContent = hint.jp;
      el('KrHint').textContent = hint.kr;

      allButtons.forEach(btn => {
        if (btn.dataset.jp === currentItem.part1.jp || btn.dataset.jp === currentItem.part2.jp) {
          btn.classList.add('correct');
        }
      });

      setTimeout(() => {
        speakCurrent();
      }, 600);

      advanceTimer = setTimeout(() => {
        index += 1;
        generateQuiz();
      }, 2800);

    } else {
      // 순서가 틀렸거나 관계없는 항목 — 처음부터 다시
      selectedButton.classList.add('wrong');
      combo = 0;
      comboEl.textContent = combo;
      playWrongSound();
      if (cfg.onWrongPick) cfg.onWrongPick(currentItem, expectedPart);

      setTimeout(() => {
        selectedButton.classList.remove('wrong');
      }, 800);

      // 진행 중이던 선택 초기화 (배지 제거)
      picked = [];
      allButtons.forEach(btn => {
        btn.classList.remove('picked');
        const badge = btn.querySelector('.order-badge');
        if (badge) badge.remove();
      });
      updateProgress();
    }
  }

  function timeExpired() {
    if (isAnswering) return;
    isAnswering = true;
    clearTimeout(timer);
    combo = 0;
    el('Combo').textContent = combo;
    el('AudioBtn').disabled = true;
    playWrongSound();
    cfg.onTimeExpired(currentItem);

    const hint = currentItem.hint();
    el('AnswerBox').style.display = 'block';
    el('JpHint').textContent = hint.jp;
    el('KrHint').textContent = hint.kr;

    optionButtons().forEach(btn => {
      if (btn.dataset.jp === currentItem.part1.jp || btn.dataset.jp === currentItem.part2.jp) {
        btn.classList.add('correct-hint');
      }
    });

    advanceTimer = setTimeout(() => {
      index += 1;
      generateQuiz();
    }, 1500);
  }

  function showResult() {
    clearTimeout(timer);
    clearTimeout(advanceTimer);
    el('QuestionScreen').style.display = 'none';
    el('ResultScreen').style.display = 'block';
    el('ResultCorrect').textContent = correctCount;
    el('ResultMaxCombo').textContent = maxCombo;
    el('ResultScore').textContent = score;
  }

  return { init, start, generateQuiz, speakCurrent };
}

/* 2단어 문장 맞히기 게임 설정 — 문장을 듣고 순서에 맞는 단어 2개를 고릅니다 */
const sentenceGame = createSequencePickQuizGame({
  idPrefix: 'sentence',

  buildItem(activeWords) {
    const activeJpSet = new Set(activeWords.map(w => w.jp));
    // 현재 연령대 단어 범위에서 두 단어 모두 사용 가능한 문장만 후보로 삼음
    const validSentences = SENTENCES.filter(s => s.words.every(jp => activeJpSet.has(jp)));
    const pool = validSentences.length > 0 ? validSentences : SENTENCES;
    const sentence = pool[Math.floor(Math.random() * pool.length)];
    const word1 = DICTIONARY.find(w => w.jp === sentence.words[0]);
    const word2 = DICTIONARY.find(w => w.jp === sentence.words[1]);
    return {
      part1: word1,
      part2: word2,
      speak() { speakTTS(`${word1.jp} ${word2.jp}`); },
      hint() { return { jp: `${word1.jp} ${word2.jp}`, kr: sentence.kr }; }
    };
  },

  getDistractors(activeWords, item) {
    return activeWords.filter(w => w.jp !== item.part1.jp && w.jp !== item.part2.jp);
  },

  renderChoiceInner(word) {
    return `
      ${emojiVisualHTML(word)}
      <span class="btn-text-sub">${word.jp} (${word.kr})</span>
    `;
  },

  celebrate(btn, item) {
    celebrateCorrect(btn, item.part1, item.part1.emoji + item.part2.emoji);
  },

  onCorrect(item) {
    playAnimalCry(item.part2);
    addLogChip(item.part1);
    addLogChip(item.part2);
    recordWordResult(item.part1, true);
    recordWordResult(item.part2, true);
  },

  // sentence 게임은 오답 선택 시에도 SRS에 기록합니다 (compound는 기록하지 않음 — 기존 동작 유지)
  onWrongPick(item, expectedPart) {
    recordWordResult(expectedPart, false);
  },

  onTimeExpired(item) {
    recordWordResult(item.part1, false);
    recordWordResult(item.part2, false);
  }
});

function initSentenceGame() { sentenceGame.init(); }
function startSentenceGame() { sentenceGame.start(); }
function generateSentenceQuiz() { sentenceGame.generateQuiz(); }
function speakCurrentSentence() { sentenceGame.speakCurrent(); }

/* 🧩 합성어 맞추기 게임 설정 — 두 단어가 순서대로 합쳐져 새로운 단어가 되는 것을 학습합니다 */
const compoundGame = createSequencePickQuizGame({
  idPrefix: 'compound',

  buildItem(activeWords) {
    const validCompounds = COMPOUNDS.filter(c => c.level <= currentAppLevel);
    const pool = validCompounds.length > 0 ? validCompounds : COMPOUNDS;
    const compound = pool[Math.floor(Math.random() * pool.length)];
    return {
      part1: compound.p1,
      part2: compound.p2,
      compound,
      speak() { speakTTS(compound.jp); },
      hint() {
        return {
          jp: `${compound.p1.jp} + ${compound.p2.jp} = ${compound.jp}`,
          kr: `${compound.p1.kr} + ${compound.p2.kr} = ${compound.kr}`
        };
      }
    };
  },

  getDistractors(activeWords, item) {
    return COMPOUND_PARTS.filter(p => p.jp !== item.part1.jp && p.jp !== item.part2.jp);
  },

  renderChoiceInner(part) {
    return `
      <span>${part.emoji}</span>
      <span class="btn-text-sub">${part.jp} (${part.kr})</span>
    `;
  },

  // compound만 상단에 타깃 이모지를 보여줌 (sentence에는 없는 요소)
  renderTarget(item) {
    const emojiEl = document.getElementById('compoundTargetEmoji');
    emojiEl.textContent = item.compound.emoji;
    emojiEl.style.animation = 'none';
    void emojiEl.offsetWidth;
    emojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';
  },

  celebrate(btn, item) {
    celebrateCorrect(btn, item.compound);
  },

  onCorrect(item) {
    addLogChip(item.compound);
    // sentence는 단어 2개를 개별로 기록하지만 compound는 합성어 전체를 1개로 기록 (기존 동작 유지)
    recordWordResult({ jp: item.compound.jp }, true);
  },

  onTimeExpired(item) {
    recordWordResult({ jp: item.compound.jp }, false);
  }
});

function initCompoundGame() { compoundGame.init(); }
function startCompoundGame() { compoundGame.start(); }
function generateCompoundQuiz() { compoundGame.generateQuiz(); }
function speakCurrentCompound() { compoundGame.speakCurrent(); }


function changeInputType(type) {
  if (isWritingAnswering) return;
  currentInputType = type;
  document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`typeBtn${type}`).classList.add('active');

  const kbdBox = document.getElementById('kanaKeyboard');
  const drawBox = document.getElementById('handwritingBox');

  if (type === 'A') {
    kbdBox.classList.add('show');
    drawBox.classList.remove('show');
  } else {
    kbdBox.classList.remove('show');
    drawBox.classList.add('show');
    clearCanvas();
  }
}

function initKeyboard() {
  const grid = document.getElementById('kbdGrid');
  if (grid.children.length > 0) return;

  grid.innerHTML = '';
  
  KANA_LAYOUT.forEach(key => {
    const btn = document.createElement('button');
    if (key === '') {
      btn.className = 'kbd-key empty';
    } else {
      btn.className = 'kbd-key';
      btn.textContent = key;
      btn.onclick = () => {
        if (isWritingAnswering) return;
        const input = document.getElementById('writeInput');
        input.value += key;
      };
    }
    grid.appendChild(btn);
  });

  const backspaceBtn = document.createElement('button');
  backspaceBtn.className = 'kbd-key func';
  backspaceBtn.textContent = '한 글자 지우기 ⌫';
  backspaceBtn.style.gridColumn = 'span 2';
  backspaceBtn.onclick = () => {
    const input = document.getElementById('writeInput');
    input.value = input.value.slice(0, -1);
  };

  const clearBtn = document.createElement('button');
  clearBtn.className = 'kbd-key func';
  clearBtn.textContent = '전체 지우기 🗑️';
  clearBtn.style.gridColumn = 'span 3';
  clearBtn.onclick = () => {
    document.getElementById('writeInput').value = '';
  };

  grid.appendChild(backspaceBtn);
  grid.appendChild(clearBtn);
}

let canvas, ctx;
let drawing = false;
let strokes = [];
let currentStroke = [];

function initCanvas() {
  canvas = document.getElementById('paintCanvas');
  ctx = canvas.getContext('2d');
  
  ctx.strokeStyle = '#211D19';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  canvas.onmousedown = (e) => startDraw(e.offsetX, e.offsetY);
  canvas.onmousemove = (e) => draw(e.offsetX, e.offsetY);
  canvas.onmouseup = () => endDraw();
  canvas.onmouseleave = () => endDraw();

  canvas.ontouchstart = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    startDraw(x, y);
  };
  canvas.ontouchmove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    draw(x, y);
  };
  canvas.ontouchend = () => endDraw();
}

function startDraw(x, y) {
  if (isWritingAnswering) return;
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(x, y);
  currentStroke = [{ x, y }];
}

function draw(x, y) {
  if (!drawing || isWritingAnswering) return;
  ctx.lineTo(x, y);
  ctx.stroke();
  currentStroke.push({ x, y });
}

function endDraw() {
  if (!drawing) return;
  drawing = false;
  if (currentStroke.length > 1) {
    strokes.push(currentStroke);
    recognizeHandwriting();
  }
  currentStroke = [];
}

function clearCanvas() {
  if (!canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes = [];
  document.getElementById('candidatesRow').innerHTML = '<span style="color:#a89f8e; font-size:13px;">필기 영역에 선을 그려보세요.</span>';
}

function undoCanvas() {
  if (strokes.length === 0) return;
  strokes.pop();
  redrawCanvas();
  if (strokes.length > 0) {
    recognizeHandwriting();
  } else {
    document.getElementById('candidatesRow').innerHTML = '<span style="color:#a89f8e; font-size:13px;">필기 영역에 선을 그려보세요.</span>';
  }
}

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes.forEach(stroke => {
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    ctx.stroke();
  });
}

function recognizeHandwriting() {
  if (strokes.length === 0) return;

  let allPts = [];
  strokes.forEach(s => allPts = allPts.concat(s));
  if (allPts.length === 0) return;

  let minX = Math.min(...allPts.map(p => p.x));
  let maxX = Math.max(...allPts.map(p => p.x));
  let minY = Math.min(...allPts.map(p => p.y));
  let maxY = Math.max(...allPts.map(p => p.y));

  const width = (maxX - minX) || 1;
  const height = (maxY - minY) || 1;
  const strokeCount = strokes.length;

  const candidates = KANA_LAYOUT.filter(k => k !== '').map(kana => {
    let score = 0;
    
    if (kana === 'つ' || kana === 'し' || kana === 'く' || kana === 'へ' || kana === 'の') {
      if (strokeCount === 1) score += 40;
    }
    if (kana === 'い' || kana === 'こ' || kana === 'り' || kana === 'う') {
      if (strokeCount === 2) score += 40;
    }
    if (kana === 'た' || kana === 'に' || kana === 'よ' || kana === 'ま' || kana === 'は') {
      if (strokeCount >= 3) score += 30;
    }
    
    const ratio = width / height;
    if (kana === 'し' || kana === 'り' || kana === 'い') {
      if (ratio < 0.8) score += 20;
    }
    if (kana === 'つ' || kana === 'く' || kana === 'へ' || kana === 'こ') {
      if (ratio > 1.2) score += 20;
    }

    score += Math.floor(Math.random() * 15);

    return { kana, score };
  });

  candidates.sort((a, b) => b.score - a.score);
  
  const topCandidates = candidates.slice(0, 5);
  const row = document.getElementById('candidatesRow');
  row.innerHTML = '';

  topCandidates.forEach(cand => {
    const btn = document.createElement('button');
    btn.className = 'candidate-btn';
    btn.textContent = cand.kana;
    btn.onclick = () => {
      if (isWritingAnswering) return;
      const input = document.getElementById('writeInput');
      input.value += cand.kana;
      clearCanvas();
    };
    row.appendChild(btn);
  });
}

function changeLevel(level) {
  if (isWritingAnswering) return;
  currentWritingLevel = level;
  document.querySelectorAll('.lvl-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`lvlBtn${level}`).classList.add('active');
  generateWritingQuestion();
}

function generateWritingQuestion() {
  isWritingAnswering = false;
  
  const inputEl = document.getElementById('writeInput');
  const feedbackEl = document.getElementById('writeFeedback');
  const emojiEl = document.getElementById('writeEmoji');
  const jpHintEl = document.getElementById('writeJpHint');
  const krHintEl = document.getElementById('writeKrHint');
  
  inputEl.value = '';
  inputEl.className = 'write-input';
  feedbackEl.textContent = '';
  feedbackEl.style.color = 'var(--sumi)';

  const randomIndex = Math.floor(Math.random() * getActiveWords().length);
  currentWritingWord = getActiveWords()[randomIndex];

  emojiEl.style.animation = 'none';
  void emojiEl.offsetWidth;
  emojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';

  if (currentWritingLevel === 1) {
    emojiEl.innerHTML = emojiVisualHTML(currentWritingWord);
    jpHintEl.textContent = currentWritingWord.jp;
    jpHintEl.style.display = 'block';
    krHintEl.textContent = currentWritingWord.kr;
    krHintEl.style.display = 'block';
  } 
  else if (currentWritingLevel === 2) {
    emojiEl.innerHTML = emojiVisualHTML(currentWritingWord);
    jpHintEl.style.display = 'none';
    krHintEl.textContent = currentWritingWord.kr;
    krHintEl.style.display = 'block';
  } 
  else if (currentWritingLevel === 3) {
    emojiEl.textContent = '🎧';
    jpHintEl.style.display = 'none';
    krHintEl.style.display = 'none';
    
    setTimeout(() => {
      speakWritingWord();
    }, 200);
  }

  changeInputType(currentInputType);
}

function checkWritingAnswer() {
  if (isWritingAnswering || !currentWritingWord) return;

  const inputEl = document.getElementById('writeInput');
  const feedbackEl = document.getElementById('writeFeedback');
  const scoreEl = document.getElementById('writeScore');
  const comboEl = document.getElementById('writeCombo');
  const jpHintEl = document.getElementById('writeJpHint');
  const krHintEl = document.getElementById('writeKrHint');
  const emojiEl = document.getElementById('writeEmoji');

  const userAnswer = inputEl.value.trim();
  const correctAnswer = currentWritingWord.jp;

  if (userAnswer === correctAnswer) {
    isWritingAnswering = true;
    inputEl.classList.add('correct');
    
    playCorrectSound();
    celebrateCorrect(emojiEl, currentWritingWord);
    
    writeScore += 15;
    writeCombo += 1;
    scoreEl.textContent = writeScore;
    comboEl.textContent = writeCombo;

    addLogChip(currentWritingWord);
    recordWordResult(currentWritingWord, true);

    feedbackEl.textContent = '🎉 정답입니다!';
    feedbackEl.style.color = 'var(--correct)';
    
    emojiEl.innerHTML = emojiVisualHTML(currentWritingWord);
    jpHintEl.textContent = currentWritingWord.jp;
    jpHintEl.style.display = 'block';
    krHintEl.textContent = `${currentWritingWord.kr} (${currentWritingWord.romaji})`;
    krHintEl.style.display = 'block';

    setTimeout(() => {
      generateWritingQuestion();
    }, 1200);

  } else {
    inputEl.classList.add('wrong');
    playWrongSound();
    recordWordResult(currentWritingWord, false);

    writeCombo = 0;
    comboEl.textContent = writeCombo;

    feedbackEl.textContent = wrongFeedbackText('❌ 틀렸습니다. 다시 입력해보세요!');
    feedbackEl.style.color = wrongFeedbackColor();

    setTimeout(() => {
      inputEl.classList.remove('wrong');
    }, 800);
  }
}

document.getElementById('writeInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    checkWritingAnswer();
  }
});


/* ✍️ TRACE (따라쓰기 트레이싱) MODE LOGIC
   이모지 + 2초 간격 발음 재생 → 아래에 흐린 히라가나 가이드 → 그 위에 손글씨로 따라 쓰면
   격자 단위로 가이드 글자와 겹치는 비율(일치율)을 계산해 80% 이상이면 자동으로 다음 단어로 넘어갑니다 */
let traceGuideCanvas, traceGuideCtx, traceDrawCanvas, traceDrawCtx;
let traceStrokes = [];
let currentTraceWord = null;
let traceAudioInterval = null;
let traceTargetMask = null;
let traceTargetCount = 0;
let traceGridCols = 0, traceGridRows = 0;
const TRACE_CELL = 8;
const TRACE_MATCH_THRESHOLD = 80;
let traceScore = 0;
let traceCombo = 0;
let traceMatched = false;
let traceCanvasInited = false;
let traceCharBoxes = [];
let traceStudyMode = 'word'; // 'word' (단어 학습) 또는 'hiragana' (히라가나 학습)

/* 🈁 히라가나 학습 모드용 기본 46자 목록 (글자 + 로마자 읽기) */


/* 학습 모드 전환: '따라쓰기 트레이싱'(단어)과 '히라가나 쓰기' 각 모드 진입 시 호출해
   traceStudyMode를 맞춰주고 새 문제를 생성합니다 */
function setTraceStudyMode(mode){
  traceStudyMode = mode;

  traceCombo = 0;
  const comboEl = document.getElementById('traceCombo');
  if (comboEl) comboEl.textContent = traceCombo;

  generateTraceQuestion();
}

/* 🔢 히라가나/가타카나 획순 데이터
   문자별로 획(스트로크) 배열을 저장합니다. 각 획은 글자 박스 내부의 정규화 좌표(0~1, x:왼→오, y:위→아래)로 이루어진 점들의 목록이며,
   화면에는 시작점 번호와 진행 방향 화살표로 표시되어 실제 붓글씨처럼 정밀하지는 않지만 쓰는 순서와 방향을 안내합니다 */
/* 히라가나 46자(+작은 글자 9자) 획순 좌표 — animCJK 프로젝트(오픈소스, LGPL)의 실제 폰트 기반
   stroke median 데이터에서 추출 후 0~1 범위로 정규화한 값입니다. 기존에는 손으로 대충 찍은
   2~4점 꺾은선이라 실제 글자 모양과 거리가 있었지만, 이제는 실제 글자 획의 중심선 좌표를
   그대로 사용하므로 정확도가 크게 개선되었습니다. わ, を, ん, ろ 4자도 이번에 animCJK의
   graphicsJaKana.txt(median 좌표 원본 텍스트 데이터)에서 정확한 좌표를 구해 교체했습니다. */


/* 🔧 좌표계 보정: animCJK 폰트에서 추출한 획순 데이터는 y값이 위로 갈수록 커지는 "폰트 좌표계"
   (기준선=0, 위쪽이 양수)를 사용하지만, 캔버스는 y값이 아래로 갈수록 커지는 반대 좌표계라서
   그대로 그리면 모든 히라가나 글자의 트레이싱 점선이 상하로 뒤집혀 표시됩니다.
   わ・を・ん・ろ 4자도 이번에 animCJK 폰트 좌표 데이터로 교체되었으므로, 나머지 글자와
   마찬가지로 y값을 (1 - y)로 뒤집어 캔버스 좌표계에 맞춥니다(더 이상 예외 없음). */
const CANVAS_ORIENTED_HIRAGANA = new Set();
Object.keys(HIRAGANA_STROKES).forEach(ch => {
  if (CANVAS_ORIENTED_HIRAGANA.has(ch)) return;
  HIRAGANA_STROKES[ch] = HIRAGANA_STROKES[ch].map(stroke => stroke.map(p => [p[0], 1 - p[1]]));
});






const STROKE_ORDER_DATA = {};
Object.assign(STROKE_ORDER_DATA, HIRAGANA_STROKES, KATAKANA_STROKES);
STROKE_ORDER_DATA['ー'] = LONG_VOWEL_STROKE;



Object.entries(DAKUTEN_PAIRS).forEach(([base, voiced]) => {
  if (HIRAGANA_STROKES[base]) STROKE_ORDER_DATA[voiced] = [...HIRAGANA_STROKES[base], ...DAKUTEN_MARK];
});
Object.entries(HANDAKUTEN_PAIRS).forEach(([base, semi]) => {
  if (HIRAGANA_STROKES[base]) STROKE_ORDER_DATA[semi] = [...HIRAGANA_STROKES[base], ...HANDAKUTEN_MARK];
});
if (KATAKANA_STROKES['ハ']) STROKE_ORDER_DATA['バ'] = [...KATAKANA_STROKES['ハ'], ...DAKUTEN_MARK];


Object.entries(SMALL_KANA_MAP).forEach(([small, base]) => {
  if (!HIRAGANA_STROKES[small] && HIRAGANA_STROKES[base]) STROKE_ORDER_DATA[small] = HIRAGANA_STROKES[base];
});

function drawStrokeArrowhead(ctx, from, to) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const size = 5;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - size * Math.cos(angle - Math.PI / 6), to.y - size * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(to.x - size * Math.cos(angle + Math.PI / 6), to.y - size * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = 'rgba(43,58,85,0.55)';
  ctx.fill();
}

/* ✅ 획순 점선 가이드 + 화살표 + 번호 원을 하나의 글자 박스에 그리는 공용 헬퍼.
   트레이싱 화면(여러 칸을 순회)과 쓰기게임(칸 1개)이 원 크기/폰트/선굵기/점선
   간격만 다르게 써서 8순위로 통합했습니다 */
function drawStrokesForBox(ctx, box, opts) {
  const strokes = STROKE_ORDER_DATA[box.ch];
  if (!strokes) return;
  strokes.forEach((stroke, idx) => {
    const pts = stroke.map(p => ({
      x: box.x + p[0] * box.width,
      y: box.y + p[1] * box.size
    }));

    ctx.strokeStyle = 'rgba(43,58,85,0.5)';
    ctx.lineWidth = opts.lineWidth;
    ctx.setLineDash(opts.dash);
    ctx.beginPath();
    drawSmoothPathThroughPoints(ctx, pts);
    ctx.stroke();
    ctx.setLineDash([]);

    if (pts.length >= 2) drawStrokeArrowhead(ctx, pts[pts.length - 2], pts[pts.length - 1]);

    const start = pts[0];
    ctx.beginPath();
    ctx.arc(start.x, start.y, opts.dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(183,65,14,0.8)';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = opts.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(idx + 1), start.x, start.y + 0.5);
  });
}

function drawStrokeOrderOverlay() {
  if (!traceCharBoxes.length) return;
  traceGuideCtx.save();
  traceCharBoxes.forEach(box => {
    // showGuide가 명시적으로 false인 칸(2x2 반복 연습에서 왼쪽 위를 제외한 나머지)은 점선 가이드를 그리지 않습니다
    if (box.showGuide === false) return;
    drawStrokesForBox(traceGuideCtx, box, {
      dotRadius: 7,
      font: '700 9px "Noto Sans KR", sans-serif',
      lineWidth: 1.5,
      dash: [3, 3],
    });
  });
  traceGuideCtx.restore();
}

/* 캔버스에 마우스/터치로 그림을 그릴 수 있게 하는 공용 이벤트 바인딩 —
   좌표를 캔버스 내부 좌표계로 변환한 뒤 handlers.onStart/onMove/onEnd를 호출합니다.
   트레이싱(trace)과 쓰기 스피드게임(hw)이 이 좌표 변환 + 이벤트 연결 코드를
   그대로 복붙해서 쓰고 있었는데, 실제 그리기/채점 동작은 각 게임 콜백에 맡기고
   이벤트 배선만 공통화합니다 */
function bindCanvasDrawEvents(canvas, handlers) {
  const getPos = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  canvas.onmousedown = (e) => { const p = getPos(e.clientX, e.clientY); handlers.onStart(p.x, p.y); };
  canvas.onmousemove = (e) => { const p = getPos(e.clientX, e.clientY); handlers.onMove(p.x, p.y); };
  canvas.onmouseup = () => handlers.onEnd();
  canvas.onmouseleave = () => handlers.onEnd();

  canvas.ontouchstart = (e) => {
    e.preventDefault();
    const p = getPos(e.touches[0].clientX, e.touches[0].clientY);
    handlers.onStart(p.x, p.y);
  };
  canvas.ontouchmove = (e) => {
    e.preventDefault();
    const p = getPos(e.touches[0].clientX, e.touches[0].clientY);
    handlers.onMove(p.x, p.y);
  };
  canvas.ontouchend = () => handlers.onEnd();
}

/* 안내 캔버스(ctx)를 cell 크기의 격자로 나눠, 잉크가 있는 칸을 목표 마스크로 만듭니다.
   트레이싱/쓰기게임이 각각 자기 안내 캔버스에 대해 이 함수를 호출해 목표 마스크를 얻습니다 */
function computeInkMask(ctx, w, h, cell) {
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const mask = new Uint8Array(cols * rows);
  let count = 0;
  const imgData = ctx.getImageData(0, 0, w, h).data;
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x0 = gx * cell, y0 = gy * cell;
      const x1 = Math.min(x0 + cell, w), y1 = Math.min(y0 + cell, h);
      let ink = 0, total = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          total++;
          if (imgData[(y * w + x) * 4 + 3] > 40) ink++;
        }
      }
      const idx = gy * cols + gx;
      if (total > 0 && (ink / total) > 0.15) { mask[idx] = 1; count++; }
    }
  }
  return { mask, cols, rows, count };
}

/* 그린 캔버스(ctx)가 목표 마스크와 몇 % 겹치는지 계산합니다 */
function computeInkMatchPercent(ctx, w, h, mask, cols, rows, cell, count) {
  if (!mask || count === 0) return 0;
  const imgData = ctx.getImageData(0, 0, w, h).data;
  let matched = 0;
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const idx = gy * cols + gx;
      if (!mask[idx]) continue;
      const x0 = gx * cell, y0 = gy * cell;
      const x1 = Math.min(x0 + cell, w), y1 = Math.min(y0 + cell, h);
      let hasInk = false;
      for (let y = y0; y < y1 && !hasInk; y++) {
        for (let x = x0; x < x1; x++) {
          if (imgData[(y * w + x) * 4 + 3] > 40) { hasInk = true; break; }
        }
      }
      if (hasInk) matched++;
    }
  }
  return Math.round((matched / count) * 100);
}

/* 진행률 바(채운 비율 %)를 렌더링합니다 — threshold 이상이면 'trace-ready' 강조 클래스를 붙입니다 */
function renderInkMatchProgress(fillId, labelId, percent, threshold) {
  const fillEl = document.getElementById(fillId);
  const labelEl = document.getElementById(labelId);
  if (!fillEl || !labelEl) return;
  const clamped = Math.max(0, Math.min(100, percent));
  fillEl.style.width = clamped + '%';
  labelEl.textContent = clamped + '%';
  fillEl.classList.toggle('trace-ready', clamped >= threshold);
}

/* trace 전용 판정 엔진 인스턴스 — worksheet/dt와 같은 createInkMatchEngine을 쓰되,
   캔버스 하나짜리(단일) 모드 + 진행률 콜백 + 획 기록(recordStrokes) 옵션을 켭니다 */
const traceInkEngine = createInkMatchEngine({
  threshold: TRACE_MATCH_THRESHOLD,
  recordStrokes: true,
  canDraw: () => !!currentTraceWord && !traceMatched,
  getCtx: () => ({
    drawCanvas: traceDrawCanvas, drawCtx: traceDrawCtx,
    mask: traceTargetMask, cols: traceGridCols, rows: traceGridRows, cell: TRACE_CELL,
    count: traceTargetCount, matched: traceMatched
  }),
  onProgress: updateTraceProgress,
  onStroke: (stroke) => { traceStrokes.push(stroke); },
  onMatch: () => { traceMatched = true; handleTraceSuccess(); }
});

function initTraceCanvas() {
  if (traceCanvasInited) return;
  traceCanvasInited = true;

  traceGuideCanvas = document.getElementById('traceGuideCanvas');
  traceGuideCtx = traceGuideCanvas.getContext('2d');
  traceDrawCanvas = document.getElementById('traceDrawCanvas');
  traceDrawCtx = traceDrawCanvas.getContext('2d');

  traceDrawCtx.strokeStyle = '#B7410E';
  traceDrawCtx.lineWidth = 7;
  traceDrawCtx.lineCap = 'round';
  traceDrawCtx.lineJoin = 'round';

  traceInkEngine.setupDrawing(traceDrawCanvas, traceDrawCtx);
}

function clearTraceCanvas() {
  if (!traceDrawCtx) return;
  traceDrawCtx.clearRect(0, 0, traceDrawCanvas.width, traceDrawCanvas.height);
  traceStrokes = [];
  traceMatched = false;
  updateTraceProgress(0);
  const feedbackEl = document.getElementById('traceFeedback');
  if (feedbackEl) feedbackEl.textContent = '';
}

function drawTraceGuide(jpText) {
  const w = traceGuideCanvas.width, h = traceGuideCanvas.height;
  traceGuideCtx.clearRect(0, 0, w, h);

  let fontSize = 84;
  traceGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  while (traceGuideCtx.measureText(jpText).width > w - 20 && fontSize > 20) {
    fontSize -= 2;
    traceGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  }

  const chars = Array.from(jpText);
  const widths = chars.map(ch => traceGuideCtx.measureText(ch).width);
  const totalWidth = widths.reduce((a, b) => a + b, 0);

  traceGuideCtx.fillStyle = 'rgba(33,29,25,0.24)';
  traceGuideCtx.textAlign = 'left';
  traceGuideCtx.textBaseline = 'middle';

  const centerY = h / 2;
  let curX = (w - totalWidth) / 2;
  traceCharBoxes = [];

  chars.forEach((ch, i) => {
    const cw = widths[i];
    // 일본어 폰트는 em box 안에서 살짝 위쪽에 그려지는 경향이 있어, 획순 트레이싱 점선(아래
    // traceCharBoxes 기준)과 맞추기 위해 살짝 아래로 보정합니다 (워크시트 모드와 동일한 보정값)
    traceGuideCtx.fillText(ch, curX, centerY + fontSize * 0.06);
    traceCharBoxes.push({ ch, x: curX, y: centerY - fontSize / 2, size: fontSize, width: cw });
    curX += cw;
  });
}

/* 🈁 히라가나 학습 모드 전용: 같은 글자를 2×2 격자(위 2칸 + 아래 2칸)로 배치해 반복 연습하게 합니다.
   기본 칸 크기에 맞춘 글자 크기보다 1.2배 크게 그리고, 획순 점선/화살표 가이드는 왼쪽 위 칸에만
   표시합니다(showGuide:false인 나머지 3칸은 흐린 글자만 보이고 사용자가 스스로 따라 씁니다). */
function drawTraceGuideKanaGrid(ch) {
  const w = traceGuideCanvas.width, h = traceGuideCanvas.height;
  traceGuideCtx.clearRect(0, 0, w, h);

  const cols = 2, rows = 2;
  const cellW = w / cols, cellH = h / rows;

  // 먼저 칸 안에 딱 맞는 기본 크기를 찾은 뒤, 요청대로 1.2배 키웁니다
  let fontSize = 70;
  traceGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  while (traceGuideCtx.measureText(ch).width > cellW - 20 && fontSize > 20) {
    fontSize -= 2;
    traceGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  }
  fontSize = Math.round(fontSize * 1.2);
  traceGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  const cw = traceGuideCtx.measureText(ch).width;

  traceGuideCtx.fillStyle = 'rgba(33,29,25,0.24)';
  traceGuideCtx.textAlign = 'left';
  traceGuideCtx.textBaseline = 'middle';

  traceCharBoxes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const centerX = cellW * c + cellW / 2;
      const centerY = cellH * r + cellH / 2;
      const curX = centerX - cw / 2;
      traceGuideCtx.fillText(ch, curX, centerY + fontSize * 0.06);
      traceCharBoxes.push({
        ch, x: curX, y: centerY - fontSize / 2, size: fontSize, width: cw,
        showGuide: (r === 0 && c === 0)
      });
    }
  }
}

function computeTraceTargetMask() {
  const w = traceGuideCanvas.width, h = traceGuideCanvas.height;
  const result = computeInkMask(traceGuideCtx, w, h, TRACE_CELL);
  traceGridCols = result.cols;
  traceGridRows = result.rows;
  traceTargetMask = result.mask;
  traceTargetCount = result.count;
}

/* 판정(잉크 겹침 계산 → threshold 체크)은 이제 traceInkEngine이 담당합니다.
   진행률 바 렌더링만 onProgress 콜백으로 계속 이 함수를 사용합니다 */
function updateTraceProgress(percent) {
  renderInkMatchProgress('traceProgressFill', 'traceProgressLabel', percent, TRACE_MATCH_THRESHOLD);
}

function handleTraceSuccess() {
  stopTraceAudioLoop();
  playCorrectSound();
  celebrateCorrect(document.getElementById('traceEmoji'), currentTraceWord);

  traceScore += 15;
  traceCombo += 1;
  document.getElementById('traceScore').textContent = traceScore;
  document.getElementById('traceCombo').textContent = traceCombo;

  const feedbackEl = document.getElementById('traceFeedback');

  if (traceStudyMode === 'hiragana') {
    // 히라가나 학습 모드는 단어장 통계·오늘의 로그에는 남기지 않고, 글자와 읽기만 알려줍니다
    feedbackEl.textContent = `🎉 잘 따라 썼어요! (${currentTraceWord.jp} · ${currentTraceWord.romaji})`;
  } else {
    addLogChip(currentTraceWord);
    recordWordResult(currentTraceWord, true);
    feedbackEl.textContent = `🎉 잘 따라 썼어요! (${currentTraceWord.jp} · ${currentTraceWord.kr})`;
  }
  feedbackEl.style.color = 'var(--correct)';

  speakTTS(currentTraceWord.jp);

  setTimeout(() => { generateTraceQuestion(); }, 1400);
}

function skipTraceWord() {
  if (!currentTraceWord) return;
  traceCombo = 0;
  document.getElementById('traceCombo').textContent = traceCombo;
  generateTraceQuestion();
}

function startTraceAudioLoop() {
  stopTraceAudioLoop();
  if (!currentTraceWord) return;
  speakTTS(currentTraceWord.jp);
  traceAudioInterval = setInterval(() => {
    if (currentTraceWord && !traceMatched) speakTTS(currentTraceWord.jp);
  }, 2000);
}

function stopTraceAudioLoop() {
  if (traceAudioInterval) {
    clearInterval(traceAudioInterval);
    traceAudioInterval = null;
  }
}

function replayTraceAudio() {
  if (!currentTraceWord) return;
  speakTTS(currentTraceWord.jp);
}

function generateTraceQuestion() {
  traceMatched = false;
  const emojiEl = document.getElementById('traceEmoji');
  const krHintEl = document.getElementById('traceKrHint');
  let isHiraganaGrid = false;

  if (traceStudyMode === 'hiragana') {
    const randomIndex = Math.floor(Math.random() * HIRAGANA_LIST.length);
    const kana = HIRAGANA_LIST[randomIndex];
    // 히라가나 학습 모드에서는 이모지 대신 히라가나 한 글자를 보여주고, 로마자 읽기를 함께 표시합니다
    currentTraceWord = { jp: kana.ch, kr: '히라가나', romaji: kana.romaji, emoji: kana.ch };

    emojiEl.textContent = kana.ch;
    emojiEl.classList.add('trace-emoji-kana');
    krHintEl.textContent = `읽기: ${kana.romaji}`;
    isHiraganaGrid = true;
  } else {
    const activeWords = getActiveWords();
    if (activeWords.length === 0) return;

    const randomIndex = Math.floor(Math.random() * activeWords.length);
    currentTraceWord = activeWords[randomIndex];

    emojiEl.innerHTML = emojiVisualHTML(currentTraceWord);
    emojiEl.classList.remove('trace-emoji-kana');
    krHintEl.textContent = `${currentTraceWord.kr} (${currentTraceWord.romaji})`;
  }

  emojiEl.style.animation = 'none';
  void emojiEl.offsetWidth;
  emojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';

  document.getElementById('traceFeedback').textContent = '';

  if (isHiraganaGrid) {
    // 필기 인식 상자 안에 같은 글자를 2×2 격자로 반복 배치하고, 왼쪽 위 칸에만 획순 가이드를 표시합니다
    drawTraceGuideKanaGrid(currentTraceWord.jp);
  } else {
    drawTraceGuide(currentTraceWord.jp);
  }
  computeTraceTargetMask();
  drawStrokeOrderOverlay();
  clearTraceCanvas();

  startTraceAudioLoop();
}


/* 📝 히라가나 쓰기 워크시트 MODE LOGIC
   업로드된 예시 워크시트(「い」の れんしゅう 등)와 같은 형식 —
   글자 제목 + 이름 칸 + 획순 안내 데모 박스 + 점점 흐려지는 5번 반복 연습 칸 +
   그 글자로 시작하는 단어 예시를 보여줍니다. 기존 STROKE_ORDER_DATA(획순 좌표)를 그대로 재사용합니다. */

const WORKSHEET_ALL_CHARS = WORKSHEET_GROUPS.flatMap(g => g.chars);


let currentWorksheetChar = 'あ';
let worksheetPracticeCtx = [];

/* 글자 도안을 캔버스에 그려주는 범용 함수 —
   예전에는 STROKE_ORDER_DATA의 손수 입력한 2~4점 꺾은선만으로 글자 '모양' 전체를
   그렸기 때문에, 실제 히라가나와 거리가 먼 형태(선택한 글자와 전혀 다르게 보이는 문제)가
   나타났습니다. 이제는 트레이싱 모드와 동일하게 실제 일본어 폰트(Shippori Mincho)로
   글자 본연의 모양을 그리고, STROKE_ORDER_DATA는 그 위에 '몇 번째 획을 어디서 시작하는지'
   알려주는 보조 번호 표시(획순 힌트)로만 사용합니다. opacity/numbered 옵션으로 데모 박스와
   5개 연습 칸의 진하기를 서로 다르게 표현합니다 */
function drawWorksheetStrokeGuide(ctx, canvas, ch, opts) {
  opts = opts || {};
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const pad = opts.pad !== undefined ? opts.pad : 0.14;
  const size = Math.min(w, h) * (1 - pad * 2);
  const offX = (w - size) / 2;
  const offY = (h - size) / 2;

  // 1) 실제 폰트로 글자 본연의 모양을 그립니다 (형태 정확도의 핵심 수정 지점)
  ctx.save();
  ctx.globalAlpha = opts.opacity !== undefined ? opts.opacity : 1;
  ctx.fillStyle = opts.color || '#B7410E';
  ctx.font = `700 ${size}px 'Shippori Mincho', serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // 일본어 폰트는 em box 안에서 살짝 위쪽에 그려지는 경향이 있어 살짝 아래로 보정
  ctx.fillText(ch, offX + size / 2, offY + size / 2 + size * 0.06);
  ctx.restore();

  // 2) STROKE_ORDER_DATA는 획순 번호(몇 번째 획을 어디서 시작하는지)만 보조로 표시
  if (opts.numbered) {
    const strokes = STROKE_ORDER_DATA[ch];
    if (strokes) {
      ctx.save();
      strokes.forEach((stroke, idx) => {
        const start = { x: offX + stroke[0][0] * size, y: offY + stroke[0][1] * size };
        ctx.beginPath();
        ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = opts.numColor || '#2B3A55';
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '700 10px "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(idx + 1), start.x, start.y + 0.5);
      });
      ctx.restore();
    }
  }
}

/* 좌표점을 직선으로 잇지 않고 각 점 사이를 부드러운 곡선(2차 베지어, 중점 보간)으로 이어줍니다.
   원본 STROKE_ORDER_DATA는 점 2~4개짜리 꺾은선이라, 직선으로 그리면 き처럼 곡선이 필요한 글자가
   夫 같은 전혀 다른 한자처럼 각지게 보이는 문제가 있었습니다. 이 함수로 모든 획 렌더링을
   통일해서 실제 히라가나 형태에 가깝게 부드럽게 그립니다. */
function drawSmoothPathThroughPoints(ctx, pts) {
  if (pts.length < 2) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  if (pts.length === 2) {
    ctx.lineTo(pts[1].x, pts[1].y);
    return;
  }
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i].x + pts[i + 1].x) / 2;
    const midY = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last.x, last.y);
}

/* ✍️ 잉크 겹침 판정 캔버스 엔진 — 워크시트 연습칸(worksheet), 탁음·반탁음·요음·촉음
   테스트 빈칸(dt), 히라가나 쓰기 스피드게임(hw), 트레이싱 연습(trace)이 모두
   "손으로 그리기 → 목표 글자 마스크와 겹침 비율 계산 → threshold 이상이면 정답 처리"
   로직을 그대로 공유하므로 createInkMatchEngine(cfg)로 공통화합니다.
   여러 칸(배열)을 쓰는 worksheet/dt와, 캔버스 하나만 쓰는 hw/trace를 모두 지원하며
   그 차이는 아래 cfg 옵션으로 켜고 끕니다:
   - getCtx(boxIndex): { drawCanvas, drawCtx, mask, cols, rows, cell, count, matched } 반환.
     여러 칸 모드는 boxIndex로 배열에서 꺼내고, 단일 모드는 boxIndex 없이 항상 최신 상태를 반환하면 됩니다.
   - canDraw(boxIndex): 지금 획을 시작해도 되는지 (생략하면 항상 허용 — worksheet/dt가 이 방식)
   - onProgress(percent, boxIndex): 획을 뗄 때마다 진행률(%)을 알려줌 (hw/trace의 진행률 바용, worksheet/dt는 생략)
   - recordStrokes + onStroke(stroke, boxIndex): 그린 획의 좌표를 기록하고 싶을 때 켜기 (trace 전용 옵션).
     켜져 있으면 한 점짜리(길이 1 이하) 획은 판정하지 않습니다 — 기존 트레이싱 동작과 동일 */
function createInkMatchEngine(cfg) {
  function setupDrawing(drawCanvas, drawCtx, boxIndex) {
    let drawing = false;
    let stroke = null;
    function canDraw() { return cfg.canDraw ? cfg.canDraw(boxIndex) : true; }
    function start(x, y) {
      if (!canDraw()) return;
      drawing = true;
      drawCtx.beginPath();
      drawCtx.moveTo(x, y);
      if (cfg.recordStrokes) stroke = [{ x, y }];
    }
    function move(x, y) {
      if (!drawing || !canDraw()) return;
      drawCtx.lineTo(x, y);
      drawCtx.stroke();
      if (cfg.recordStrokes && stroke) stroke.push({ x, y });
    }
    function end() {
      if (!drawing) return;
      drawing = false;
      let shouldCheck = true;
      if (cfg.recordStrokes) {
        shouldCheck = !!(stroke && stroke.length > 1);
        if (shouldCheck && cfg.onStroke) cfg.onStroke(stroke, boxIndex);
        stroke = null;
      }
      if (shouldCheck) checkMatch(boxIndex);
    }

    bindCanvasDrawEvents(drawCanvas, { onStart: start, onMove: move, onEnd: end });

    // 그리는 중간에 문제가 바뀌는 등, 밖에서 강제로 그리기 상태를 리셋해야 할 때 사용
    return { reset: () => { drawing = false; stroke = null; } };
  }

  function checkMatch(boxIndex) {
    const c = cfg.getCtx(boxIndex);
    if (!c || !c.mask || c.count === 0 || c.matched) return;

    const w = c.drawCanvas.width, h = c.drawCanvas.height;
    const percent = computeInkMatchPercent(c.drawCtx, w, h, c.mask, c.cols, c.rows, c.cell, c.count);
    if (cfg.onProgress) cfg.onProgress(percent, boxIndex);

    if (percent >= cfg.threshold) {
      c.matched = true;
      cfg.onMatch(boxIndex, c);
    }
  }

  return { setupDrawing, checkMatch };
}

/* 목표 글자 모양을 (화면에 보이는 흐릿한 안내선과 무관하게) 항상 진하고 곧게 렌더링한 뒤
   작은 격자로 나눠서, 어느 칸에 '잉크가 있어야 하는지' 마스크를 만들어둡니다.
   이후 사용자가 그린 그림과 이 마스크를 겹쳐보며 일치율(%)을 계산합니다 */
function computeWorksheetTargetMask(ch, w, h) {
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  const octx = off.getContext('2d');
  drawWorksheetStrokeGuide(octx, off, ch, {
    opacity: 1, color: '#000000', lineWidth: 10, dashed: false, numbered: false, pad: 0.14
  });
  const imgData = octx.getImageData(0, 0, w, h).data;
  const cell = 6;
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const mask = new Uint8Array(cols * rows);
  let count = 0;
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x0 = gx * cell, y0 = gy * cell;
      const x1 = Math.min(x0 + cell, w), y1 = Math.min(y0 + cell, h);
      let ink = 0, total = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          total++;
          if (imgData[(y * w + x) * 4 + 3] > 40) ink++;
        }
      }
      const idx = gy * cols + gx;
      if (total > 0 && (ink / total) > 0.15) { mask[idx] = 1; count++; }
    }
  }
  return { mask, cols, rows, cell, count };
}

const WORKSHEET_MATCH_THRESHOLD = 80;

const worksheetInkEngine = createInkMatchEngine({
  threshold: WORKSHEET_MATCH_THRESHOLD,
  getCtx: (boxIndex) => worksheetPracticeCtx[boxIndex],
  onMatch: (boxIndex) => {
    const boxEl = document.getElementById('worksheetBox' + boxIndex);
    if (boxEl) boxEl.classList.add('worksheet-box-correct');
    speakTTS(currentWorksheetChar);
  }
});

/* 마우스/터치로 실제 손가락처럼 따라 쓸 수 있게 하는 그리기 핸들러 —
   trace/hw 모드와 같은 createInkMatchEngine을 공유합니다. 한 획을 다 그으면(펜을 떼면)
   해당 칸의 목표 글자 모양과 몇 % 겹치는지 검사합니다 */
function setupWorksheetDrawing(drawCanvas, drawCtx, boxIndex) {
  worksheetInkEngine.setupDrawing(drawCanvas, drawCtx, boxIndex);
}

/* 연습 칸 하나(boxIndex)의 그림이 목표 글자와 80% 이상 겹치면 정답 처리하고
   히라가나를 소리내어 읽어준 뒤 칸에 초록 테두리 + 체크 표시를 보여줍니다 */
function checkWorksheetBoxMatch(boxIndex) {
  worksheetInkEngine.checkMatch(boxIndex);
}

/* 연습 칸 5개(DOM + 캔버스)는 최초 1회만 생성하고, 글자가 바뀔 때는 안내선만 다시 그립니다 */
function buildWorksheetPracticeBoxes() {
  const row = document.getElementById('worksheetPracticeRow');
  if (!row || row.dataset.built) return;
  row.dataset.built = '1';

  let html = '';
  for (let i = 0; i < 5; i++) {
    html += `
      <div class="worksheet-practice-box" id="worksheetBox${i}">
        <div class="worksheet-practice-canvas-wrap">
          <canvas class="worksheet-guide-canvas" id="worksheetGuideCanvas${i}" width="90" height="100"></canvas>
          <canvas class="worksheet-draw-canvas" id="worksheetDrawCanvas${i}" width="90" height="100"></canvas>
        </div>
        <div class="worksheet-practice-num">${i + 1}</div>
      </div>`;
  }
  row.innerHTML = html;

  worksheetPracticeCtx = [];
  for (let i = 0; i < 5; i++) {
    const guideCanvas = document.getElementById('worksheetGuideCanvas' + i);
    const drawCanvas = document.getElementById('worksheetDrawCanvas' + i);
    const drawCtx = drawCanvas.getContext('2d');
    drawCtx.strokeStyle = '#2B3A55';
    drawCtx.lineWidth = 5;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    setupWorksheetDrawing(drawCanvas, drawCtx, i);
    worksheetPracticeCtx.push({ guideCanvas, guideCtx: guideCanvas.getContext('2d'), drawCanvas, drawCtx, matched: false });
  }
}

/* 글자 선택 그리드(あ행/か행/…/탁음/반탁음)는 최초 1회만 생성합니다 */
function renderWorksheetPicker() {
  const wrap = document.getElementById('worksheetPicker');
  if (!wrap || wrap.dataset.built) return;
  wrap.dataset.built = '1';

  let html = '';
  WORKSHEET_GROUPS.forEach(group => {
    html += `<div class="worksheet-picker-group"><div class="worksheet-picker-label">${group.label}</div><div class="worksheet-picker-row">`;
    group.chars.forEach(ch => {
      html += `<button type="button" class="worksheet-char-btn" data-ch="${ch}" onclick="selectWorksheetChar('${ch}')">${ch}</button>`;
    });
    html += `</div></div>`;
  });
  wrap.innerHTML = html;
}

/* 그 글자로 시작하는 단어를 사전(DICTIONARY)에서 찾아 이모지 카드로 보여줍니다 */
function renderWorksheetWordExamples(ch) {
  const grid = document.getElementById('worksheetWordsGrid');
  if (!grid) return;
  const matches = DICTIONARY.filter(w => w.jp.startsWith(ch)).slice(0, 4);

  if (matches.length === 0) {
    grid.innerHTML = `<div class="worksheet-words-empty">앗, 예시 단어를 아직 준비하지 못했어요 🙏</div>`;
    return;
  }
  grid.innerHTML = '';
  matches.forEach(w => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'worksheet-word-card';
    card.innerHTML = `
      <div class="worksheet-word-emoji">${w.emoji}</div>
      <div class="worksheet-word-jp">${w.jp}</div>
      <div class="worksheet-word-kr">${w.kr}</div>
    `;
    card.addEventListener('click', () => speakTTS(w.jp));
    grid.appendChild(card);
  });
}

/* 현재 선택된 글자에 맞춰 제목/데모 박스/연습 칸 5개/단어 예시를 모두 갱신합니다 */
function renderWorksheetChar() {
  const ch = currentWorksheetChar;
  document.getElementById('worksheetTitleChar').textContent = ch;
  document.getElementById('worksheetInstruction').textContent = `せんを なぞって、「${ch}」を かこう。`;
  document.getElementById('worksheetWordsTitle').textContent = `「${ch}」로 시작하는 단어는 무엇일까요?`;

  document.querySelectorAll('.worksheet-char-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.ch === ch);
  });

  buildWorksheetPracticeBoxes();

  const demoCanvas = document.getElementById('worksheetDemoCanvas');
  drawWorksheetStrokeGuide(demoCanvas.getContext('2d'), demoCanvas, ch, {
    opacity: 0.95, color: '#B7410E', lineWidth: 6, dashed: false, numbered: true, pad: 0.14
  });

  worksheetPracticeCtx.forEach((c, i) => {
    c.drawCtx.clearRect(0, 0, c.drawCanvas.width, c.drawCanvas.height);
    const style = WORKSHEET_PRACTICE_STYLES[i];
    drawWorksheetStrokeGuide(c.guideCtx, c.guideCanvas, ch, Object.assign(
      { color: '#B7410E', numbered: (i === 0), pad: 0.14 }, style
    ));
    Object.assign(c, computeWorksheetTargetMask(ch, c.drawCanvas.width, c.drawCanvas.height));
    c.matched = false;
    const boxEl = document.getElementById('worksheetBox' + i);
    if (boxEl) boxEl.classList.remove('worksheet-box-correct');
  });

  renderWorksheetWordExamples(ch);
}

function selectWorksheetChar(ch) {
  if (!STROKE_ORDER_DATA[ch]) return;
  currentWorksheetChar = ch;
  renderWorksheetChar();
  speakTTS(ch);
}

/* step만큼 워크시트 글자 인덱스를 이동합니다 (-1: 이전, +1: 다음) */
function stepWorksheetChar(step) {
  const idx = WORKSHEET_ALL_CHARS.indexOf(currentWorksheetChar);
  const nextIdx = (idx + step + WORKSHEET_ALL_CHARS.length) % WORKSHEET_ALL_CHARS.length;
  selectWorksheetChar(WORKSHEET_ALL_CHARS[nextIdx]);
}
function prevWorksheetChar() { stepWorksheetChar(-1); }
function nextWorksheetChar() { stepWorksheetChar(1); }

/* 캔버스 잉크를 지우고 matched 상태와 정답 표시 클래스를 초기화하는 공통 처리 */
function clearInkBox(c, elId, correctClass) {
  if (!c) return;
  c.drawCtx.clearRect(0, 0, c.drawCanvas.width, c.drawCanvas.height);
  c.matched = false;
  const el = document.getElementById(elId);
  if (el) el.classList.remove(correctClass);
}

function clearAllWorksheetBoxes() {
  worksheetPracticeCtx.forEach((c, i) => clearInkBox(c, 'worksheetBox' + i, 'worksheet-box-correct'));
}

function initWorksheetMode() {
  renderWorksheetPicker();
  buildWorksheetPracticeBoxes();
  renderWorksheetChar();
}

/* ✏️ 탁음・반탁음・요음・촉음 쓰기 테스트 (DT)
   히라가나 쓰기 스피드게임(hw)처럼 한 화면에 문제 하나만 크게 보여주는 타임어택 테스트입니다.
   그림+단어를 보여주고, 단어 중 한 글자만 빈칸(큰 쓰기 칸)으로 남겨둡니다. 빈칸에는 흐린 정답
   글자와 획순 가이드가 항상 보이며, 상단 타이머가 5초 동안 줄어듭니다. hw와 달리 쓰는 도중에는
   채점하지 않고, 5초가 다 지난 시점에 손으로 쓴 그림과 정답 글자 마스크를 딱 한 번 비교해서
   일치하면 1점을 더합니다. 총 10문제이며, DT_TESTS 전체(6세트×4단어 = 24개) 중 무작위로 뽑습니다 */

const DT_MATCH_THRESHOLD = 55;
const DT_TIME_LIMIT = 5000; // 문제당 5초
const DT_CELL = 8;
const DT_TOTAL_QUESTIONS = 10;

// DT_TESTS(6세트×4단어)를 낱개 문제 24개로 펼쳐두고, 매 게임마다 이 중 10개를 무작위로 뽑습니다
const DT_ALL_QUESTIONS = DT_TESTS.flat().map(w => ({
  emoji: w.emoji, kr: w.kr, word: w.word, chars: w.chars,
  blankIndex: w.blankIndex, targetChar: w.chars[w.blankIndex]
}));

let dtScore = 0;
let dtCorrectCount = 0;
let dtIndex = 0;
let dtQuestions = [];
let currentDtQuestion = null;
let dtAnswered = false;
let dtTimer = null;
let dtAdvanceTimer = null;

let dtGuideCanvas, dtGuideCtx, dtDrawCanvas, dtDrawCtx;
let dtDrawHandle = null;
let dtCharBox = null;
let dtTargetMask = null, dtGridCols = 0, dtGridRows = 0, dtTargetCount = 0;

/* 빈칸 캔버스는 매 문제마다 새로 생성되므로(blankIndex가 문제마다 달라 위치가 바뀜),
   진행률 표시만 실시간으로 보여주고 실제 정답 처리(onMatch)는 비워둡니다 —
   이 테스트는 5초를 다 채운 뒤 dtGradeAnswer()에서 딱 한 번만 채점합니다 */
const dtInkEngine = createInkMatchEngine({
  threshold: DT_MATCH_THRESHOLD,
  canDraw: () => !!currentDtQuestion && !dtAnswered,
  getCtx: () => ({
    drawCanvas: dtDrawCanvas, drawCtx: dtDrawCtx,
    mask: dtTargetMask, cols: dtGridCols, rows: dtGridRows, cell: DT_CELL,
    count: dtTargetCount, matched: false
  }),
  onProgress: (percent) => renderInkMatchProgress('dtProgressFill', 'dtProgressLabel', percent, DT_MATCH_THRESHOLD),
  onMatch: () => {}
});

/* 문제마다 빈칸 캔버스 엘리먼트를 새로 그리므로, 매번 다시 엘리먼트를 찾아
   그리기 스타일을 세팅하고 이벤트를 새로 바인딩합니다 */
function initDtCanvas() {
  dtGuideCanvas = document.getElementById('dtGuideCanvas');
  dtGuideCtx = dtGuideCanvas.getContext('2d');
  dtDrawCanvas = document.getElementById('dtDrawCanvas');
  dtDrawCtx = dtDrawCanvas.getContext('2d');

  dtDrawCtx.strokeStyle = '#2B3A55';
  dtDrawCtx.lineWidth = 9;
  dtDrawCtx.lineCap = 'round';
  dtDrawCtx.lineJoin = 'round';

  dtDrawHandle = dtInkEngine.setupDrawing(dtDrawCanvas, dtDrawCtx);
}

/* 안내 글자를 히라가나 쓰기 스피드게임과 같은 크기로 흐리게 그려서 빈칸을 가득 채웁니다.
   이 흐린 글자 모양이 그대로 정답 판정 기준(목표 마스크)이 됩니다 */
function drawDtGuideChar(ch) {
  const w = dtGuideCanvas.width, h = dtGuideCanvas.height;
  dtGuideCtx.clearRect(0, 0, w, h);

  let fontSize = 60;
  dtGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  while (dtGuideCtx.measureText(ch).width > (w / 2 - 16) && fontSize > 16) {
    fontSize -= 2;
    dtGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  }
  fontSize = Math.round(fontSize * 3);
  dtGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  while ((dtGuideCtx.measureText(ch).width > w - 24 || fontSize > h - 24) && fontSize > 16) {
    fontSize -= 2;
    dtGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  }

  const cw = dtGuideCtx.measureText(ch).width;
  dtGuideCtx.fillStyle = 'rgba(33,29,25,0.24)';
  dtGuideCtx.textAlign = 'left';
  dtGuideCtx.textBaseline = 'middle';

  const x = (w - cw) / 2;
  const y = h / 2;
  dtGuideCtx.fillText(ch, x, y + fontSize * 0.06);

  dtCharBox = { ch, x, y: y - fontSize / 2, size: fontSize, width: cw };
}

/* 흐린 안내 글자 위에 획순 번호 + 점선 화살표를 겹쳐 그립니다.
   목표 마스크 계산 이후에 호출해야 정답 판정에 영향을 주지 않습니다 */
function drawDtStrokeOrderOverlay() {
  if (!dtCharBox) return;
  dtGuideCtx.save();
  drawStrokesForBox(dtGuideCtx, dtCharBox, {
    dotRadius: 10,
    font: '700 12px "Noto Sans KR", sans-serif',
    lineWidth: 2,
    dash: [4, 4],
  });
  dtGuideCtx.restore();
}

function computeDtTargetMask() {
  const w = dtGuideCanvas.width, h = dtGuideCanvas.height;
  const result = computeInkMask(dtGuideCtx, w, h, DT_CELL);
  dtGridCols = result.cols;
  dtGridRows = result.rows;
  dtTargetMask = result.mask;
  dtTargetCount = result.count;
}

/* DT_ALL_QUESTIONS(24개) 중 10개를 무작위 순서로 뽑습니다 */
function dtPickQuestions(count) {
  const pool = DT_ALL_QUESTIONS.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function initDtTestMode() {
  clearTimeout(dtTimer);
  clearTimeout(dtAdvanceTimer);
  showDrillScreen('dt', 'start');
  dtScore = 0; dtCorrectCount = 0; dtIndex = 0;
  document.getElementById('dtScore').textContent = '0';
  document.getElementById('dtProgress').textContent = '0';
}

function startDtTestGame() {
  clearTimeout(dtTimer);
  clearTimeout(dtAdvanceTimer);
  dtScore = 0; dtCorrectCount = 0; dtIndex = 0;
  document.getElementById('dtScore').textContent = '0';

  dtQuestions = dtPickQuestions(DT_TOTAL_QUESTIONS);

  showDrillScreen('dt', 'question');
  showDtQuestion();
}

function showDtQuestion() {
  if (dtIndex >= dtQuestions.length) {
    dtShowResult();
    return;
  }

  dtAnswered = false;
  clearTimeout(dtTimer);
  clearTimeout(dtAdvanceTimer);

  document.getElementById('dtProgress').textContent = dtIndex + 1;

  const q = dtQuestions[dtIndex];
  currentDtQuestion = q;

  document.getElementById('dtEmoji').textContent = q.emoji;
  document.getElementById('dtWordKr').textContent = q.kr;
  document.getElementById('dtFeedback').textContent = '';

  // 빈칸 위치가 문제마다 다르므로, 주어진 글자 박스 + 빈칸 캔버스를 매번 새로 그립니다
  const row = document.getElementById('dtCharsRow');
  let html = '';
  q.chars.forEach((ch, idx) => {
    if (idx === q.blankIndex) {
      html += `<div class="dt-game-blank-wrap trace-canvas-wrap">
        <canvas id="dtGuideCanvas" width="260" height="260"></canvas>
        <canvas id="dtDrawCanvas" width="260" height="260"></canvas>
      </div>`;
    } else {
      html += `<div class="dt-game-char-box">${ch}</div>`;
    }
  });
  row.innerHTML = html;

  initDtCanvas();

  // 안내 글자(흐린 정답 + 획순 가이드)를 그리고, 판정 기준이 되는 목표 마스크를 계산합니다
  drawDtGuideChar(q.targetChar);
  computeDtTargetMask();
  drawDtStrokeOrderOverlay();

  dtDrawCtx.clearRect(0, 0, dtDrawCanvas.width, dtDrawCanvas.height);
  renderInkMatchProgress('dtProgressFill', 'dtProgressLabel', 0, DT_MATCH_THRESHOLD);

  speakTTS(q.word);

  animateTimerBar('dtTimerFill', DT_TIME_LIMIT);

  dtTimer = setTimeout(() => {
    dtGradeAnswer();
  }, DT_TIME_LIMIT);
}

/* 5초가 다 지난 시점에 딱 한 번만 채점합니다: 손으로 쓴 그림이 정답 글자의
   목표 마스크와 DT_MATCH_THRESHOLD% 이상 겹치면 정답 처리하고 점수를 1점 더합니다 */
function dtGradeAnswer() {
  if (dtAnswered) return;
  dtAnswered = true;
  clearTimeout(dtTimer);

  const w = dtDrawCanvas.width, h = dtDrawCanvas.height;
  const percent = computeInkMatchPercent(dtDrawCtx, w, h, dtTargetMask, dtGridCols, dtGridRows, DT_CELL, dtTargetCount);
  renderInkMatchProgress('dtProgressFill', 'dtProgressLabel', percent, DT_MATCH_THRESHOLD);

  const feedbackEl = document.getElementById('dtFeedback');
  const wrapEl = document.querySelector('#dtCharsRow .dt-game-blank-wrap');

  if (percent >= DT_MATCH_THRESHOLD) {
    dtScore += 1;
    dtCorrectCount += 1;
    document.getElementById('dtScore').textContent = dtScore;
    if (wrapEl) wrapEl.classList.add('dt-blank-correct');
    if (typeof playCorrectSound === 'function') playCorrectSound();
    feedbackEl.textContent = `🎉 정답! (${currentDtQuestion.targetChar})`;
    feedbackEl.style.color = 'var(--correct)';
    speakTTS(currentDtQuestion.targetChar);
    setTimeout(() => speakTTS(currentDtQuestion.word), 500);
  } else {
    if (wrapEl) wrapEl.classList.add('dt-blank-wrong');
    if (typeof playWrongSound === 'function') playWrongSound();
    feedbackEl.textContent = `⏰ 시간 종료! 정답은 (${currentDtQuestion.targetChar})`;
    feedbackEl.style.color = 'var(--wrong)';
    speakTTS(currentDtQuestion.word);
  }

  dtAdvanceTimer = setTimeout(() => {
    dtIndex += 1;
    showDtQuestion();
  }, 1200);
}

function dtReplaySound() {
  if (currentDtQuestion) speakTTS(currentDtQuestion.word);
}

function dtShowResult() {
  showDrillScreen('dt', 'result');
  document.getElementById('dtResultCorrect').textContent = dtCorrectCount;
  document.getElementById('dtResultScore').textContent = dtScore;
}

/* 🈴 히라가나 글자별 통계 엔진 (카드찾기/쓰기/읽기 3개 게임 공용)
   localStorage에 { "あ": {correct, wrong, srsStage, lastReviewAt}, ... } 형태로 글자별
   성적을 저장하고, 오답 가중치(균등/약하게/보통/강하게/오답만/SRS)에 따라 다음 문제 세트를
   가중 무작위로 뽑아주며, 오십음도 모양 통계 그리드도 렌더링합니다.
   세 게임은 저장 키(statsKey/weightKey)와 DOM id 접두사(prefix), 초기화 확인 문구만 다르고
   나머지 동작은 완전히 동일해서, 이 팩토리로 게임별 인스턴스를 만들어 재사용합니다.
   id 규칙: #{prefix}StatGrid, #{prefix}WeightRow, #{prefix}WeightBtn{level}, #{prefix}SrsNote */
/* 🧠 메타인지/학습판단 보정(Metacognition, Judgment of Learning) — 답하기 전 스스로
   "확실해요/헷갈려요"를 예측하게 하고, 실제 정답 여부와 비교해 과신(overconfidence)을
   교정하거나 자기주도적 복습 우선순위를 세울 수 있게 돕습니다. 글자당 최근 기록만 남기고
   너무 오래된 예측은 잘라내서 저장 용량이 무한정 커지지 않게 합니다 */
const SELF_JUDGMENT_LOG_MAX = 30;

function createHiraganaStatsEngine(cfg) {
  let charStats = {};
  let weightLevel = cfg.defaultWeightLevel;

  function load() {
    try {
      const raw = localStorage.getItem(cfg.statsKey);
      charStats = raw ? JSON.parse(raw) : {};
    } catch (e) {
      charStats = {};
    }
  }

  function save() {
    try {
      localStorage.setItem(cfg.statsKey, JSON.stringify(charStats));
    } catch (e) {
      /* 저장 실패해도 게임 진행에는 지장 없음 */
    }
  }

  function reset() {
    const confirmed = confirm(cfg.confirmMessage);
    if (!confirmed) return;
    charStats = {};
    save();
    renderStatGrid();
  }

  function getStat(ch) {
    if (!charStats[ch]) charStats[ch] = { correct: 0, wrong: 0, srsStage: 0, lastReviewAt: null, timeouts: 0, selfJudgments: [], sameDayCorrectCount: 0, lastReviewCalendarDay: null };
    // 기존에 저장된 통계(구버전 데이터)에는 SRS/시간초과/자기판단/수면공고화 필드가 없을 수 있으므로 없으면 채워줍니다
    if (typeof charStats[ch].srsStage !== 'number') charStats[ch].srsStage = 0;
    if (charStats[ch].lastReviewAt === undefined) charStats[ch].lastReviewAt = null;
    if (typeof charStats[ch].timeouts !== 'number') charStats[ch].timeouts = 0;
    if (!Array.isArray(charStats[ch].selfJudgments)) charStats[ch].selfJudgments = [];
    if (typeof charStats[ch].sameDayCorrectCount !== 'number') charStats[ch].sameDayCorrectCount = 0;
    if (charStats[ch].lastReviewCalendarDay === undefined) charStats[ch].lastReviewCalendarDay = null;
    return charStats[ch];
  }

  function updateWeightButtons(level) {
    document.querySelectorAll('#' + cfg.prefix + 'WeightRow .lvl-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(cfg.prefix + 'WeightBtn' + level);
    if (activeBtn) activeBtn.classList.add('active');
    const note = document.getElementById(cfg.prefix + 'SrsNote');
    if (note) note.classList.toggle('active', level === HS_WEIGHT_SRS_LEVEL);
  }

  /* 저장된 가중치 강도를 불러옵니다. 저장된 값이 없으면 기본값(보통=1)을 사용합니다 */
  function loadWeightLevel() {
    try {
      const raw = localStorage.getItem(cfg.weightKey);
      const n = Number(raw);
      weightLevel = raw !== null && [0, 1, 3, 4, 5].includes(n) ? n : 1;
    } catch (e) {
      weightLevel = 1;
    }
    updateWeightButtons(weightLevel);
  }

  /* 사용자가 가중치 강도 버튼을 누르면 값을 저장하고 버튼 강조를 갱신합니다 */
  function setWeightLevel(level) {
    weightLevel = level;
    try {
      localStorage.setItem(cfg.weightKey, String(level));
    } catch (e) {
      /* 저장 실패해도 게임 진행에는 지장 없음 */
    }
    updateWeightButtons(level);
  }

  /* 오답/시간초과: 오답 횟수를 amount만큼 올림 (기본 1) + SRS 단계를 2단계 낮춰
     해당 글자의 다음 복습 시점을 앞당깁니다.
     isTimeout=true면 "몰라서 오답"이 아니라 "시간 안에 답을 못한 것"이라는 뜻으로
     timeouts 카운트도 별도로 남깁니다(정확도와 속도/유창성을 구분해서 기록) */
  function recordMistake(ch, amount = 1, isTimeout = false) {
    const stat = getStat(ch);
    stat.wrong += amount;
    if (isTimeout) stat.timeouts += amount;
    srsUpdateStat(stat, false);
    save();
  }

  /* 정답: 정답 횟수를 amount만큼 올림 (기본 1) + SRS 단계를 1단계 올려
     해당 글자의 다음 복습 시점을 뒤로 미룹니다 */
  function recordCorrect(ch, amount = 1) {
    const stat = getStat(ch);
    stat.correct += amount;
    srsUpdateStat(stat, true);
    save();
  }

  /* 답하기 전 스스로 예측한 "확실해요(confident)/헷갈려요(unsure)"와, 실제로 맞혔는지(wasCorrect)를
     짝지어 기록합니다. 과신(확실하다고 했는데 틀림) 여부를 나중에 장기기억 상세보기에서 계산하는 데 씁니다 */
  function recordSelfJudgment(ch, predicted, wasCorrect) {
    const stat = getStat(ch);
    stat.selfJudgments.push({ predicted, wasCorrect, ts: Date.now() });
    if (stat.selfJudgments.length > SELF_JUDGMENT_LOG_MAX) {
      stat.selfJudgments = stat.selfJudgments.slice(-SELF_JUDGMENT_LOG_MAX);
    }
    save();
  }

  /* 오답 횟수를 반영해 중복 없이 count개를 뽑는 가중 무작위 샘플링.
     기본 가중치 1에 (누적 오답 횟수 × 선택한 배수)를 더해서, 예전에 많이 틀렸던 글자일수록
     같은 세트 안에서도 더 높은 확률로 뽑히게 합니다. 배수는 시작 화면에서 사용자가 고른
     가중치 강도(균등/약하게/보통/강하게)에 따라 달라집니다.
     '오답만'(레벨 4)을 고르면 배수 방식 대신, 오답률이 30% 이상인 글자만 출제 대상으로
     걸러내어 그 안에서만 균등하게 뽑습니다. 30% 이상인 글자가 하나도 없으면 전체 46자에서
     균등하게 뽑습니다.
     '🧠 SRS 복습'(레벨 5)을 고르면 오답 횟수 누적치 대신, 글자별 SRS 단계와 마지막 복습
     시각을 바탕으로 계산한 "지금 잊어버렸을 확률"에 따라 뽑습니다(srsWeightedPick 참고) */
  function weightedPick(count) {
    // 🎯 문제 출제는 "지금 활성 세트로 학습 중인 글자"들 안에서만 뽑습니다.
    // 전체 46자를 한꺼번에 다 대상으로 두면 반복 노출 간격이 벌어져 장기기억화에 불리하므로,
    // 활성 세트 컨트롤러가 늘려준 만큼만 사용합니다
    const activeList = getActiveCharList();

    if (weightLevel === HS_WEIGHT_SRS_LEVEL) {
      return srsWeightedPick(activeList, charStats, count);
    }
    if (weightLevel === HS_WEIGHT_ONLY_WRONG_LEVEL) {
      const onlyWrongList = activeList.filter(item => {
        const stat = charStats[item.ch] || { correct: 0, wrong: 0 };
        const total = stat.correct + stat.wrong;
        return total > 0 && (stat.wrong / total) >= 0.30;
      });
      const sourceList = onlyWrongList.length > 0 ? onlyWrongList : activeList;
      const shuffled = sourceList.slice().sort(() => Math.random() - 0.5);
      // 뽑을 개수가 대상 글자 수보다 많으면 부족한 만큼 다시 섞어서 채웁니다 (중복 출제 허용)
      const result = [];
      while (result.length < count) {
        const remaining = count - result.length;
        const take = Math.min(remaining, shuffled.length);
        result.push(...shuffled.slice(0, take));
        shuffled.sort(() => Math.random() - 0.5);
      }
      return result;
    }

    const multiplier = HS_WEIGHT_MULTIPLIERS[weightLevel] !== undefined ? HS_WEIGHT_MULTIPLIERS[weightLevel] : 2;
    const pool = activeList.map(item => {
      const stat = charStats[item.ch] || { correct: 0, wrong: 0 };
      return { item, weight: 1 + stat.wrong * multiplier };
    });
    const result = [];
    const n = Math.min(count, pool.length);
    for (let i = 0; i < n; i++) {
      const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
      let r = Math.random() * totalWeight;
      let pickIdx = pool.length - 1;
      for (let j = 0; j < pool.length; j++) {
        r -= pool[j].weight;
        if (r <= 0) { pickIdx = j; break; }
      }
      result.push(pool[pickIdx].item);
      pool.splice(pickIdx, 1);
    }
    // 활성 세트가 count보다 작으면(예: 5자인데 10문제) 모자란 만큼 반복 출제합니다
    while (result.length < count && activeList.length > 0) {
      result.push(activeList[Math.floor(Math.random() * activeList.length)]);
    }
    return result;
  }

  /* 게임 시작 화면에 46자를 오십음도 표 모양으로 배치하고, 글자별 정답/오답 횟수와
     오답률 색상(10% 이하=초록, 30% 이하=노랑, 초과=빨강, 미풀이=흰색)을 보여줍니다.
     hsPlayStatCellPreview는 통계와 무관하게 발음만 들려주는 공용 미리듣기 함수라
     세 게임이 그대로 함께 사용합니다 */
  function renderStatGrid() {
    const grid = document.getElementById(cfg.prefix + 'StatGrid');
    if (!grid) return;
    grid.innerHTML = '';

    // 좌측 상단 빈 모서리 칸
    grid.appendChild(document.createElement('div'));

    // 맨 위 열 헤더 행 (a, i, u, e, o)
    HS_COL_HEADS.forEach(head => {
      const h = document.createElement('div');
      h.className = 'hs-stat-colhead';
      h.textContent = head;
      grid.appendChild(h);
    });

    // 각 행마다 좌측 행 헤더 + 5개의 글자 칸(없는 자리는 빈 칸)을 순서대로 추가
    HS_TABLE_ROWS.forEach(row => {
      const rowHead = document.createElement('div');
      rowHead.className = 'hs-stat-rowhead';
      rowHead.textContent = row.label;
      grid.appendChild(rowHead);

      row.chars.forEach(ch => {
        if (!ch) {
          grid.appendChild(document.createElement('div'));
          return;
        }
        const stat = charStats[ch] || { correct: 0, wrong: 0 };
        const total = stat.correct + stat.wrong;
        const wrongRate = total === 0 ? null : stat.wrong / total;

        let colorClass = 'hs-stat-neutral';
        if (wrongRate !== null) {
          if (wrongRate <= 0.10) colorClass = 'hs-stat-green';
          else if (wrongRate <= 0.30) colorClass = 'hs-stat-yellow';
          else colorClass = 'hs-stat-red';
        }

        const cell = document.createElement('div');
        cell.className = 'hs-stat-cell ' + colorClass;
        cell.innerHTML = `
          <span class="hs-stat-correct">${stat.correct}</span>
          <span class="hs-stat-ch">${ch}</span>
          <span class="hs-stat-wrong">${stat.wrong}</span>
        `;
        cell.addEventListener('click', () => hsPlayStatCellPreview(cell, ch));
        grid.appendChild(cell);
      });
    });
  }

  /* 🔁 복습 세트 전용 — 주어진 글자 목록(chars) 안에서만 count개를 뽑습니다.
     대상 글자 수가 count보다 적으면 다시 섞어서 채워 중복 출제를 허용합니다 */
  function pickFromSubset(chars, count) {
    const list = HIRAGANA_LIST.filter(item => chars.includes(item.ch));
    if (list.length === 0) return [];
    const shuffled = list.slice().sort(() => Math.random() - 0.5);
    const result = [];
    while (result.length < count) {
      const remaining = count - result.length;
      const take = Math.min(remaining, shuffled.length);
      result.push(...shuffled.slice(0, take));
      shuffled.sort(() => Math.random() - 0.5);
    }
    return result;
  }

  return {
    get charStats() { return charStats; },
    get weightLevel() { return weightLevel; },
    load, save, reset, getStat,
    loadWeightLevel, setWeightLevel,
    recordMistake, recordCorrect, recordSelfJudgment,
    weightedPick, pickFromSubset, renderStatGrid
  };
}

/* ⚡ 히라가나 카드찾기(hs) - 공용 통계 엔진 인스턴스 */
const hsStats = createHiraganaStatsEngine({
  prefix: 'hs',
  statsKey: HS_STATS_KEY,
  weightKey: HS_WEIGHT_KEY,
  defaultWeightLevel: 2,
  confirmMessage: '히라가나 카드찾기의 글자별 정답/오답 통계 기록을 모두 초기화할까요?\n이 작업은 되돌릴 수 없어요.'
});
function loadHsCharStats() { hsStats.load(); }
function saveHsCharStats() { hsStats.save(); }
function resetHsCharStats() { hsStats.reset(); }
function hsGetStat(ch) { return hsStats.getStat(ch); }
function loadHsWeightLevel() { hsStats.loadWeightLevel(); }
function setHsWeightLevel(level) { hsStats.setWeightLevel(level); }
function renderHsStatGrid() { hsStats.renderStatGrid(); }

/* 저장된 카드 개수를 불러옵니다. 저장된 값이 없으면 기본값(2장)을 사용합니다 */
/* hsCardCountRow 버튼 중 count에 해당하는 것만 active로 표시합니다 */
function highlightHsCardCountBtn(count) {
  document.querySelectorAll('#hsCardCountRow .lvl-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('hsCardCountBtn' + count);
  if (activeBtn) activeBtn.classList.add('active');
}

function loadHsCardCount() {
  try {
    const raw = localStorage.getItem(HS_CARD_COUNT_KEY);
    const n = Number(raw);
    hsCardCount = raw !== null && [2, 3, 4].includes(n) ? n : 2;
  } catch (e) {
    hsCardCount = 2;
  }
  highlightHsCardCountBtn(hsCardCount);
}

/* 사용자가 카드 개수 버튼을 누르면 값을 저장하고 버튼 강조를 갱신합니다 */
function setHsCardCount(count) {
  hsCardCount = count;
  try {
    localStorage.setItem(HS_CARD_COUNT_KEY, String(count));
  } catch (e) {
    /* 저장 실패해도 게임 진행에는 지장 없음 */
  }
  highlightHsCardCountBtn(count);
}

/* 카드 개수에 따라 정답/오답 카운트를 몇 점씩 올릴지 정하는 가중치.
   카드가 많을수록(선택지가 많을수록) 더 확실히 아는지/헷갈리는지를 보여주므로
   2장=1점, 3장=2점, 4장=4점씩 반영합니다 */
function hsCountWeight() {
  if (hsCardCount === 4) return 4;
  if (hsCardCount === 3) return 2;
  return 1;
}

function hsRecordMistake(ch, amount = 1, isTimeout = false) { hsStats.recordMistake(ch, amount, isTimeout); recordActiveSetAttempt(ch, false, isTimeout); }
function hsRecordCorrect(ch, amount = 1) { hsStats.recordCorrect(ch, amount); recordActiveSetAttempt(ch, true, false); }
function hsWeightedPick(count) { return hsStats.weightedPick(count); }

/* 46자 통계 그리드에서 글자 하나를 클릭하면, 그 글자가 커졌다 작아지는 애니메이션과
   함께 발음을 두 번 들려줍니다 (통계 기록에는 영향을 주지 않는 단순 미리듣기 기능) */
function hsPlayStatCellPreview(cell, ch) {
  const chEl = cell.querySelector('.hs-stat-ch');
  if (chEl) {
    chEl.classList.remove('hs-stat-ch-pulse');
    void chEl.offsetWidth;
    chEl.classList.add('hs-stat-ch-pulse');
  }
  speakTTS(ch);
  setTimeout(() => speakTTS(ch), 700);
}

/* 🎮 시작/문제/결과 3개 화면 중 하나만 보이도록 전환합니다.
   히라가나 스피드게임(hs)/쓰기게임(hw)/읽기게임(hr)이 모두
   `{prefix}StartScreen` / `{prefix}QuestionScreen` / `{prefix}ResultScreen`라는
   동일한 id 규칙을 쓰면서 이 3줄짜리 전환 코드를 그대로 복붙해서 쓰고 있었습니다 */
function showDrillScreen(prefix, activeScreen) {
  const screens = { start: prefix + 'StartScreen', question: prefix + 'QuestionScreen', result: prefix + 'ResultScreen' };
  Object.keys(screens).forEach(key => {
    const el = document.getElementById(screens[key]);
    if (el) el.style.display = (key === activeScreen) ? 'block' : 'none';
  });
}

/* 진행바를 가득 찬 상태에서 durationMs 동안 0%로 줄어드는 CSS 트랜지션으로 애니메이션합니다.
   hs/hw/hr 세 게임 모두 이 트랜지션 세팅 코드를 그대로 복붙해서 쓰고 있었습니다 */
function animateTimerBar(fillElId, durationMs) {
  const fill = document.getElementById(fillElId);
  if (!fill) return;
  fill.style.transition = 'none';
  fill.style.width = '100%';
  void fill.offsetWidth;
  fill.style.transition = `width ${durationMs / 1000}s linear`;
  fill.style.width = '0%';
}

/* 콤보가 이어질수록 가산점이 커지는 점수 계산 공식 (기본 10점 + (콤보-1)×5)을
   히라가나 스피드게임(hs)/쓰기게임(hw)이 동일하게 쓰고 있어 공용화합니다 */
function comboScoreGain(comboAfterIncrement) {
  return 10 + (comboAfterIncrement - 1) * 5;
}

/* ⚡ 히라가나 스피드게임 로직
   발음(로마자 표기 + 음성)을 듣고 2초 안에 알맞은 히라가나 카드를 고르는 게임.
   - 정답을 고르면: 점수 상승(콤보가 이어질수록 가산점 증가) 후 바로 다음 문제
   - 오답을 고르면: 콤보가 끊기고 정답 카드가 표시된 후 바로 다음 문제
   - 2초 안에 아무 것도 고르지 않으면: 콤보가 끊기고 자동으로 다음 문제
   - 10문제가 끝나면 맞힌 개수 / 최고 콤보 / 콤보 가산이 반영된 총점을 보여줌
   - 이전 게임에서 틀리거나 시간 초과된 글자는 가중치가 붙어 다음 게임 문제 세트에
     더 자주 등장하고, 잘 맞히는 글자는 점점 덜 나오게 됩니다 */
function initHiraganaSpeedGame() {
  clearTimeout(hsTimer);
  clearTimeout(hsAdvanceTimer);
  showDrillScreen('hs', 'start');
  hsScore = 0; hsCombo = 0; hsMaxCombo = 0; hsCorrectCount = 0; hsIndex = 0;
  document.getElementById('hsScore').textContent = '0';
  document.getElementById('hsCombo').textContent = '0';
  document.getElementById('hsProgress').textContent = '0';

  // 저장된 글자별 정답/오답 통계를 불러와 시작 화면의 46자 그리드에 표시합니다
  loadHsCharStats();
  renderHsStatGrid();

  // 저장된 가중치 강도(균등/약하게/보통/강하게)를 불러와 버튼 강조를 갱신합니다
  loadHsWeightLevel();

  // 저장된 카드 개수(2~4장)를 불러와 버튼 강조를 갱신합니다
  loadHsCardCount();
}

function startHiraganaSpeedGame() {
  clearTimeout(hsTimer);
  clearTimeout(hsAdvanceTimer);
  hsScore = 0; hsCombo = 0; hsMaxCombo = 0; hsCorrectCount = 0; hsIndex = 0;
  document.getElementById('hsScore').textContent = '0';
  document.getElementById('hsCombo').textContent = '0';

  // HIRAGANA_LIST 46자 중 10개를 뽑아 문제 세트를 만듭니다.
  // 이전 게임들에서 자주 틀린 글자일수록 더 높은 확률로 뽑히도록 오답 통계를 반영합니다
  loadHsCharStats();
  hsQuestions = reviewSessionActive ? hsStats.pickFromSubset(reviewSessionChars, 10) : hsWeightedPick(10);

  showDrillScreen('hs', 'question');

  showHiraganaSpeedQuestion();
}

/* 🔤 부호화 다양성(Encoding Variability): 같은 글자를 매번 똑같은 폰트로만 보여주면
   그 특정 자형에만 종속된 얕은 기억이 형성될 수 있어요. 카드찾기(재인)와 읽기(발화) 문제에
   등장할 때마다 폰트를 무작위로 바꿔서, 맥락(자형)과 무관하게 글자를 알아보는 힘을 길러줍니다.
   단, 히라가나 쓰기 트레이싱 가이드(획순 캔버스, drawHwGuideChar)는 표준 자형을 유지해야
   정확한 획순 판정이 가능하므로 절대 이 변주 대상에 포함하지 않습니다. */
const HIRAGANA_FONT_VARIANTS = [
  "'Shippori Mincho', serif",
  "'Yuji Syuku', serif",
  "'Zen Kurenaido', sans-serif"
];
function pickCharFontVariant(ch) {
  return HIRAGANA_FONT_VARIANTS[Math.floor(Math.random() * HIRAGANA_FONT_VARIANTS.length)];
}

function showHiraganaSpeedQuestion() {
  if (hsIndex >= hsQuestions.length) {
    hsShowResult();
    return;
  }

  hsAnswered = false;
  clearTimeout(hsTimer);
  clearTimeout(hsAdvanceTimer);

  document.getElementById('hsProgress').textContent = hsIndex + 1;

  const correct = hsQuestions[hsIndex];
  currentHsQuestion = correct;

  const romajiEl = document.getElementById('hsPromptRomaji');
  romajiEl.textContent = correct.romaji;
  romajiEl.style.animation = 'none';
  void romajiEl.offsetWidth;
  romajiEl.style.animation = 'quizAppear .35s cubic-bezier(.175, .885, .32, 1.275)';

  // 발음을 음성으로 들려줍니다 (부호화 다양성: 매번 살짝 다른 속도/음높이로)
  speakTTS(correct.ch, {jitter: true});

  // 정답 카드 1개 + 오답 카드 (hsCardCount - 1)개를 무작위로 뽑아 순서를 섞습니다.
  // 오답 선택지도 가급적 "지금 배우는 글자" 안에서 골라야 실제로 헷갈릴 만한 연습이 됩니다
  const activePool = getActiveCharList().filter(h => h.ch !== correct.ch);
  const pool = activePool.length >= (hsCardCount - 1) ? activePool : HIRAGANA_LIST.filter(h => h.ch !== correct.ch);
  const shuffledPool = pool.slice().sort(() => Math.random() - 0.5);
  const wrongOnes = shuffledPool.slice(0, hsCardCount - 1);
  const cards = [correct, ...wrongOnes].sort(() => Math.random() - 0.5);

  const cardsContainer = document.getElementById('hsCards');
  cardsContainer.innerHTML = '';
  cardsContainer.style.pointerEvents = 'auto';
  cardsContainer.classList.remove('hs-cards-3', 'hs-cards-4');
  if (hsCardCount === 3) cardsContainer.classList.add('hs-cards-3');
  if (hsCardCount === 4) cardsContainer.classList.add('hs-cards-4');

  cards.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn hs-card';
    btn.dataset.ch = item.ch;
    btn.innerHTML = `<span style="font-family:${pickCharFontVariant(item.ch)}">${item.ch}</span>`;
    btn.addEventListener('click', () => hsSelectAnswer(btn, item.ch === correct.ch));
    cardsContainer.appendChild(btn);
  });

  // 이 글자의 SRS 단계에 맞춰 제한 시간을 조절합니다(잘 아는 글자일수록 짧게, 아직 안 외운 글자는 넉넉하게)
  const hsStage = hsStats.getStat(correct.ch).srsStage;
  const hsTimeLimit = stageAdjustedTimeMs(HS_BASE_TIME_MS, hsStage, HS_MIN_TIME_MS);
  animateTimerBar('hsTimerFill', hsTimeLimit);

  hsTimer = setTimeout(() => {
    hsTimeExpired();
  }, hsTimeLimit);
}

function hsSelectAnswer(btn, isCorrect) {
  if (hsAnswered) return;
  hsAnswered = true;
  clearTimeout(hsTimer);

  document.getElementById('hsCards').style.pointerEvents = 'none';
  const allBtns = document.querySelectorAll('#hsCards .hs-card');

  if (isCorrect) {
    hsCombo += 1;
    if (hsCombo > hsMaxCombo) hsMaxCombo = hsCombo;
    hsScore += comboScoreGain(hsCombo);
    hsCorrectCount += 1;
    btn.classList.add('correct');
    if (typeof playCorrectSound === 'function') playCorrectSound();
    // 카드 개수(선택지 수)에 따라 정답 카운트 가중치를 다르게 반영합니다
    // (2장=1, 3장=2, 4장=4)
    hsRecordCorrect(currentHsQuestion.ch, hsCountWeight());
  } else {
    hsCombo = 0;
    btn.classList.add('wrong');
    allBtns.forEach(b => {
      if (b.dataset.ch === currentHsQuestion.ch) b.classList.add('correct-hint');
    });
    if (typeof playWrongSound === 'function') playWrongSound();
    // 정답 글자와 사용자가 잘못 고른 글자, 둘 다 헷갈린 것으로 보고 오답 횟수를
    // 카드 개수(선택지 수)에 따른 가중치만큼 함께 올립니다 (2장=1, 3장=2, 4장=4)
    const hsMistakeWeight = hsCountWeight();
    hsRecordMistake(currentHsQuestion.ch, hsMistakeWeight);
    if (btn.dataset.ch !== currentHsQuestion.ch) {
      hsRecordMistake(btn.dataset.ch, hsMistakeWeight);
    }
  }

  document.getElementById('hsScore').textContent = hsScore;
  document.getElementById('hsCombo').textContent = hsCombo;

  hsAdvanceTimer = setTimeout(() => {
    hsIndex += 1;
    showHiraganaSpeedQuestion();
  }, 550);
}

function hsTimeExpired() {
  if (hsAnswered) return;
  hsAnswered = true;
  hsCombo = 0;
  document.getElementById('hsCombo').textContent = hsCombo;

  const cardsContainer = document.getElementById('hsCards');
  cardsContainer.style.pointerEvents = 'none';
  document.querySelectorAll('#hsCards .hs-card').forEach(b => {
    if (b.dataset.ch === currentHsQuestion.ch) b.classList.add('correct-hint');
  });
  if (typeof playWrongSound === 'function') playWrongSound();
  hsRecordMistake(currentHsQuestion.ch, hsCountWeight(), true);

  hsAdvanceTimer = setTimeout(() => {
    hsIndex += 1;
    showHiraganaSpeedQuestion();
  }, 500);
}

function hsReplaySound() {
  if (currentHsQuestion) speakTTS(currentHsQuestion.ch, {jitter: true});
}

function hsShowResult() {
  showDrillScreen('hs', 'result');
  document.getElementById('hsResultCorrect').textContent = hsCorrectCount;
  document.getElementById('hsResultMaxCombo').textContent = hsMaxCombo;
  document.getElementById('hsResultScore').textContent = hsScore;
  if (!reviewSessionActive) evaluateActiveSetExpansion();
  scheduleNextReviewRound();
}

/* 🖊️ 히라가나 쓰기(hw) - 공용 통계 엔진 인스턴스.
   히라가나 카드찾기(hsStats)와 완전히 별도의 localStorage 키를 사용하므로
   두 게임의 통계는 서로 영향을 주지 않습니다 */
const hwStats = createHiraganaStatsEngine({
  prefix: 'hw',
  statsKey: HW_STATS_KEY,
  weightKey: HW_WEIGHT_KEY,
  defaultWeightLevel: 1,
  confirmMessage: '히라가나 쓰기의 글자별 성공/실패 통계 기록을 모두 초기화할까요?\n이 작업은 되돌릴 수 없어요.'
});
function loadHwCharStats() { hwStats.load(); }
function saveHwCharStats() { hwStats.save(); }
function resetHwCharStats() { hwStats.reset(); }
function hwGetStat(ch) { return hwStats.getStat(ch); }
function loadHwWeightLevel() { hwStats.loadWeightLevel(); }
function setHwWeightLevel(level) { hwStats.setWeightLevel(level); }
function renderHwStatGrid() { hwStats.renderStatGrid(); }
function hwRecordMistake(ch, amount = 1, isTimeout = false) { hwStats.recordMistake(ch, amount, isTimeout); recordActiveSetAttempt(ch, false, isTimeout); }
function hwRecordCorrect(ch) { hwStats.recordCorrect(ch); recordActiveSetAttempt(ch, true, false); }
function hwRecordSelfJudgment(ch, predicted, wasCorrect) { hwStats.recordSelfJudgment(ch, predicted, wasCorrect); }
function hwWeightedPick(count) { return hwStats.weightedPick(count); }

/* 🖊️ 히라가나 쓰기 캔버스 초기화 — 손으로 그린 궤적을 판정용 캔버스(hwDrawCanvas)에 그리고,
   안내선(hwGuideCanvas)은 판정 기준(목표 마스크)을 계산하는 용도로만 사용합니다 */
/* hw 전용 판정 엔진 인스턴스 — worksheet/dt/trace와 같은 createInkMatchEngine을 쓰되,
   캔버스 하나짜리(단일) 모드 + 진행률 콜백 옵션만 켭니다 (획 기록은 트레이싱 전용이라 꺼둠) */
const hwInkEngine = createInkMatchEngine({
  threshold: HW_MATCH_THRESHOLD,
  canDraw: () => !!currentHwQuestion && !hwLocked && !hwAnswered,
  getCtx: () => ({
    drawCanvas: hwDrawCanvas, drawCtx: hwDrawCtx,
    mask: hwTargetMask, cols: hwGridCols, rows: hwGridRows, cell: HW_CELL,
    count: hwTargetCount, matched: hwAnswered
  }),
  onProgress: updateHwProgress,
  onMatch: hwHandleSuccess
});

/* 🖊️ 히라가나 쓰기 캔버스 초기화 — 손으로 그린 궤적을 판정용 캔버스(hwDrawCanvas)에 그리고,
   안내선(hwGuideCanvas)은 판정 기준(목표 마스크)을 계산하는 용도로만 사용합니다 */
function initHwCanvas() {
  if (hwCanvasInited) return;
  hwCanvasInited = true;

  hwGuideCanvas = document.getElementById('hwGuideCanvas');
  hwGuideCtx = hwGuideCanvas.getContext('2d');
  hwDrawCanvas = document.getElementById('hwDrawCanvas');
  hwDrawCtx = hwDrawCanvas.getContext('2d');

  hwDrawCtx.strokeStyle = '#B7410E';
  hwDrawCtx.lineWidth = 9;
  hwDrawCtx.lineCap = 'round';
  hwDrawCtx.lineJoin = 'round';

  hwDrawHandle = hwInkEngine.setupDrawing(hwDrawCanvas, hwDrawCtx);
}

/* 안내 글자를 기존 히라가나 연습(2×2 격자칸)에서 한 칸에 쓰던 기준 크기의 2배로 키워
   쓰기 칸에 크게 표시합니다. 반투명하게 그려서 판정 기준(목표 마스크) 계산에도 그대로 사용합니다 */
function drawHwGuideChar(ch) {
  const w = hwGuideCanvas.width, h = hwGuideCanvas.height;
  hwGuideCtx.clearRect(0, 0, w, h);

  // 캔버스 절반 너비에 맞는 기준 크기를 먼저 구한 뒤 3배로 키우면, 이전(2배)보다
  // 다시 1.5배 더 커진 글자가 됩니다. 이후 캔버스 폭/높이를 벗어나지 않도록
  // 안전하게 한 번 더 확인해 줄입니다
  let fontSize = 60;
  hwGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  while (hwGuideCtx.measureText(ch).width > (w / 2 - 16) && fontSize > 16) {
    fontSize -= 2;
    hwGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  }
  fontSize = Math.round(fontSize * 3);
  hwGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  while ((hwGuideCtx.measureText(ch).width > w - 24 || fontSize > h - 24) && fontSize > 16) {
    fontSize -= 2;
    hwGuideCtx.font = `800 ${fontSize}px 'Shippori Mincho', serif`;
  }

  const cw = hwGuideCtx.measureText(ch).width;
  hwGuideCtx.fillStyle = 'rgba(33,29,25,0.24)';
  hwGuideCtx.textAlign = 'left';
  hwGuideCtx.textBaseline = 'middle';

  const x = (w - cw) / 2;
  const y = h / 2;
  hwGuideCtx.fillText(ch, x, y + fontSize * 0.06);

  hwCharBox = { ch, x, y: y - fontSize / 2, size: fontSize, width: cw };
}

/* 이전 히라가나 연습(트레이싱)과 동일하게, 흐리게 그려진 안내 글자 위에 획순 번호와
   따라 그릴 방향을 알려주는 점선 화살표를 겹쳐 그립니다. computeHwTargetMask()로
   목표 마스크를 먼저 계산한 뒤에 호출해야 이 점선/번호가 정답 판정(잉크 비교)에
   섞여 들어가지 않습니다 */
function drawHwStrokeOrderOverlay() {
  if (!hwCharBox) return;
  hwGuideCtx.save();
  drawStrokesForBox(hwGuideCtx, hwCharBox, {
    dotRadius: 10,
    font: '700 12px "Noto Sans KR", sans-serif',
    lineWidth: 2,
    dash: [4, 4],
  });
  hwGuideCtx.restore();
}

function computeHwTargetMask() {
  const w = hwGuideCanvas.width, h = hwGuideCanvas.height;
  const result = computeInkMask(hwGuideCtx, w, h, HW_CELL);
  hwGridCols = result.cols;
  hwGridRows = result.rows;
  hwTargetMask = result.mask;
  hwTargetCount = result.count;
}

/* 판정(잉크 겹침 계산 → threshold 체크)은 이제 hwInkEngine이 담당합니다.
   진행률 바 렌더링만 onProgress 콜백으로 계속 이 함수를 사용합니다 */
function updateHwProgress(percent) {
  renderInkMatchProgress('hwProgressFill', 'hwProgressLabel', percent, HW_MATCH_THRESHOLD);
}

/* 🖊️ 히라가나 쓰기 스피드게임 로직
   히라가나 글자가 나오면 5초 안에 쓰기 칸에 따라 써보는 게임.
   - 5초 안에 60% 이상 비슷하게 쓰면: 성공(콤보 가산점) 후 바로 다음 문제
   - 5초 안에 60%에 도달하지 못하면: 콤보가 끊기고 정답을 알려준 뒤 바로 다음 문제
   - 문제당 딱 한 번만 쓸 수 있고(전체 지우기/다시 쓰기 없음), 10문제가 끝나면
     성공 개수/최고 콤보/총점을 보여줌
   - 이전 게임에서 실패(시간초과 포함)한 글자는 가중치가 붙어 다음 게임 문제 세트에
     더 자주 등장합니다. 통계는 히라가나 스피드게임과 별도로(HW_STATS_KEY) 저장됩니다 */
function initHiraganaWriteGame() {
  clearTimeout(hwTimer);
  clearTimeout(hwAdvanceTimer);
  showDrillScreen('hw', 'start');
  hwScore = 0; hwCombo = 0; hwMaxCombo = 0; hwCorrectCount = 0; hwIndex = 0;
  document.getElementById('hwScore').textContent = '0';
  document.getElementById('hwCombo').textContent = '0';
  document.getElementById('hwProgress').textContent = '0';

  // 저장된 글자별 성공/실패 통계를 불러와 시작 화면의 46자 그리드에 표시합니다
  loadHwCharStats();
  renderHwStatGrid();

  // 저장된 가중치 강도(균등/약하게/보통/강하게/오답만)를 불러와 버튼 강조를 갱신합니다
  loadHwWeightLevel();

  initHwCanvas();
}

function startHiraganaWriteGame() {
  clearTimeout(hwTimer);
  clearTimeout(hwAdvanceTimer);
  hwScore = 0; hwCombo = 0; hwMaxCombo = 0; hwCorrectCount = 0; hwIndex = 0;
  document.getElementById('hwScore').textContent = '0';
  document.getElementById('hwCombo').textContent = '0';

  // HIRAGANA_LIST 46자 중 10개를 뽑아 문제 세트를 만듭니다.
  // 이전 게임들에서 자주 실패한 글자일수록 더 높은 확률로 뽑히도록 통계를 반영합니다
  loadHwCharStats();
  hwQuestions = reviewSessionActive ? hwStats.pickFromSubset(reviewSessionChars, 10) : hwWeightedPick(10);

  showDrillScreen('hw', 'question');

  initHwCanvas();
  showHiraganaWriteQuestion();
}

/* 💡 이중부호화(Dual Coding) — 쓰기 게임 문제 화면에 글자별 시각적 연상(이모지)과 짧은
   이야기를 보조 힌트로 보여줍니다. 카드 앞면이 아니라 "필요할 때만 펼치는" 토글로 설계해서
   불필요한 인지 부하를 늘리지 않습니다 */
let hwMnemonicVisible = false;

function renderMnemonicHint(ch) {
  const hintEl = document.getElementById('hwMnemonicHint');
  if (!hintEl) return;
  const data = (typeof HIRAGANA_MNEMONICS !== 'undefined') ? HIRAGANA_MNEMONICS[ch] : null;
  if (!data) {
    hintEl.innerHTML = '';
    return;
  }
  hintEl.innerHTML = `<span class="mnemonic-hint-image">${data.image}</span><span class="mnemonic-hint-story">${data.story}</span>`;
}

function toggleMnemonicHint() {
  hwMnemonicVisible = !hwMnemonicVisible;
  applyMnemonicHintVisibility();
}

function applyMnemonicHintVisibility() {
  const hintEl = document.getElementById('hwMnemonicHint');
  const btnEl = document.getElementById('hwMnemonicToggleBtn');
  if (hintEl) hintEl.style.display = hwMnemonicVisible ? 'flex' : 'none';
  if (btnEl) btnEl.textContent = hwMnemonicVisible ? '💡 힌트 접기' : '💡 연상 힌트';
}

/* 🧠 메타인지 마이크로 UI — 답하기 전 "확실해요/헷갈려요"를 선택할 수 있게 합니다.
   선택은 완전히 선택 사항이라(안 눌러도 진행 가능), 문제 풀이 흐름을 방해하지 않습니다.
   회상 검증(직접 손으로 쓰기)에서만 물어봐서 너무 자주 물어 피로해지지 않게 했습니다 */
let hwPredictedJudgment = null;

function selectHwJudgment(predicted) {
  if (hwAnswered) return; // 이미 채점된 문제에는 뒤늦게 예측을 남기지 않음
  hwPredictedJudgment = (hwPredictedJudgment === predicted) ? null : predicted; // 같은 걸 다시 누르면 선택 취소
  updateHwJudgmentButtons();
}

function updateHwJudgmentButtons() {
  const confidentBtn = document.getElementById('hwJudgmentConfidentBtn');
  const unsureBtn = document.getElementById('hwJudgmentUnsureBtn');
  if (confidentBtn) confidentBtn.classList.toggle('active', hwPredictedJudgment === 'confident');
  if (unsureBtn) unsureBtn.classList.toggle('active', hwPredictedJudgment === 'unsure');
}

function showHiraganaWriteQuestion() {
  if (hwIndex >= hwQuestions.length) {
    hwShowResult();
    return;
  }

  hwAnswered = false;
  hwLocked = false;
  if (hwDrawHandle) hwDrawHandle.reset();
  clearTimeout(hwTimer);
  clearTimeout(hwAdvanceTimer);

  hwPredictedJudgment = null;
  updateHwJudgmentButtons();

  document.getElementById('hwProgress').textContent = hwIndex + 1;

  const q = hwQuestions[hwIndex];
  currentHwQuestion = q;

  const romajiEl = document.getElementById('hwPromptRomaji');
  romajiEl.textContent = q.romaji;
  romajiEl.style.animation = 'none';
  void romajiEl.offsetWidth;
  romajiEl.style.animation = 'quizAppear .35s cubic-bezier(.175, .885, .32, 1.275)';

  document.getElementById('hwFeedback').textContent = '';

  // 안내 글자(2배 크기)를 그리고, 판정 기준이 되는 목표 마스크를 새로 계산합니다
  drawHwGuideChar(q.ch);
  computeHwTargetMask();
  // 목표 마스크 계산 후에 획순 번호/점선 화살표를 겹쳐 그려야 정답 판정에 영향을 주지 않습니다
  drawHwStrokeOrderOverlay();

  // 이전 문제의 잉크를 지우고 이번 문제는 아직 한 번도 쓰지 않은 상태로 되돌립니다
  hwDrawCtx.clearRect(0, 0, hwDrawCanvas.width, hwDrawCanvas.height);
  updateHwProgress(0);

  // 부호화 다양성: 매번 살짝 다른 속도/음높이로 들려줍니다
  speakTTS(q.ch, {jitter: true});

  // 이 글자의 SRS 단계에 맞춰 제한 시간을 조절합니다(잘 아는 글자일수록 짧게, 아직 안 외운 글자는 넉넉하게)
  const hwStage = hwStats.getStat(q.ch).srsStage;
  const hwTimeLimit = stageAdjustedTimeMs(HW_TIME_LIMIT, hwStage, HW_MIN_TIME_MS);
  animateTimerBar('hwTimerFill', hwTimeLimit);

  // 이중부호화 힌트: 처음 배우는 글자(SRS stage 0~1)는 기본으로 펼쳐두고,
  // 이미 익숙해진 글자(stage 4+)는 접어둔 채 시작합니다 (필요하면 버튼으로 언제든 토글 가능)
  renderMnemonicHint(q.ch);
  hwMnemonicVisible = hwStage <= 1;
  applyMnemonicHintVisibility();

  hwTimer = setTimeout(() => {
    hwTimeExpired();
  }, hwTimeLimit);
}

function hwHandleSuccess() {
  if (hwAnswered) return;
  hwAnswered = true;
  hwLocked = true;
  clearTimeout(hwTimer);

  hwCombo += 1;
  if (hwCombo > hwMaxCombo) hwMaxCombo = hwCombo;
  hwScore += comboScoreGain(hwCombo);
  hwCorrectCount += 1;

  document.getElementById('hwScore').textContent = hwScore;
  document.getElementById('hwCombo').textContent = hwCombo;

  if (typeof playCorrectSound === 'function') playCorrectSound();
  hwRecordCorrect(currentHwQuestion.ch);
  if (hwPredictedJudgment) hwRecordSelfJudgment(currentHwQuestion.ch, hwPredictedJudgment, true);

  const feedbackEl = document.getElementById('hwFeedback');
  feedbackEl.textContent = `🎉 성공! (${currentHwQuestion.ch} · ${currentHwQuestion.romaji})`;
  feedbackEl.style.color = 'var(--correct)';

  hwAdvanceTimer = setTimeout(() => {
    hwIndex += 1;
    showHiraganaWriteQuestion();
  }, 900);
}

function hwTimeExpired() {
  if (hwAnswered) return;
  hwAnswered = true;
  hwLocked = true;
  hwCombo = 0;
  document.getElementById('hwCombo').textContent = hwCombo;

  if (typeof playWrongSound === 'function') playWrongSound();
  hwRecordMistake(currentHwQuestion.ch, 1, true);
  if (hwPredictedJudgment) hwRecordSelfJudgment(currentHwQuestion.ch, hwPredictedJudgment, false);

  const feedbackEl = document.getElementById('hwFeedback');
  feedbackEl.textContent = `⏰ 시간 종료! 정답은 (${currentHwQuestion.ch} · ${currentHwQuestion.romaji})`;
  feedbackEl.style.color = 'var(--wrong)';

  hwAdvanceTimer = setTimeout(() => {
    hwIndex += 1;
    showHiraganaWriteQuestion();
  }, 900);
}

function hwReplaySound() {
  if (currentHwQuestion) speakTTS(currentHwQuestion.ch, {jitter: true});
}

function hwShowResult() {
  showDrillScreen('hw', 'result');
  document.getElementById('hwResultCorrect').textContent = hwCorrectCount;
  document.getElementById('hwResultMaxCombo').textContent = hwMaxCombo;
  document.getElementById('hwResultScore').textContent = hwScore;
  if (!reviewSessionActive) evaluateActiveSetExpansion();
  scheduleNextReviewRound();
}

/* 🧠 단어 메모리 게임 로직
   이모지+발음이 선택한 개수(2/3/4)만큼 순서대로 나온 뒤, 아래 히라가나 단어 카드를
   무작위 순서로 표시합니다. 5초 안에 본 순서 그대로 카드를 누르면 성공, 순서를
   틀리거나 5초를 넘기면 실패 처리하고 바로 다음 문제로 넘어갑니다. 10문제가 끝나면
   맞힌 개수 / 최고 콤보 / 콤보 가산이 반영된 총점을 보여줍니다. */
function setWordMemoryCount(n) {
  wmCount = n;
  document.querySelectorAll('#wordMemoryMode .wm-size-row .lvl-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`wmSizeBtn${n}`);
  if (activeBtn) activeBtn.classList.add('active');
}

function initWordMemoryGame() {
  clearTimeout(wmTimer);
  clearTimeout(wmAdvanceTimer);
  clearTimeout(wmSequenceTimer);
  document.getElementById('wmStartScreen').style.display = 'block';
  document.getElementById('wmSequenceScreen').style.display = 'none';
  document.getElementById('wmCardScreen').style.display = 'none';
  document.getElementById('wmResultScreen').style.display = 'none';
  wmScore = 0; wmCombo = 0; wmMaxCombo = 0; wmCorrectCount = 0; wmQuestionIndex = 0;
  document.getElementById('wmScore').textContent = '0';
  document.getElementById('wmCombo').textContent = '0';
  document.getElementById('wmProgress').textContent = '0';
}

function startWordMemoryGame() {
  clearTimeout(wmTimer);
  clearTimeout(wmAdvanceTimer);
  clearTimeout(wmSequenceTimer);
  wmScore = 0; wmCombo = 0; wmMaxCombo = 0; wmCorrectCount = 0; wmQuestionIndex = 0;
  document.getElementById('wmScore').textContent = '0';
  document.getElementById('wmCombo').textContent = '0';

  document.getElementById('wmStartScreen').style.display = 'none';
  document.getElementById('wmResultScreen').style.display = 'none';

  showWordMemoryQuestion();
}

function showWordMemoryQuestion() {
  if (wmQuestionIndex >= 10) {
    wmShowResult();
    return;
  }

  wmAnswered = false;
  wmUserProgress = 0;
  clearTimeout(wmTimer);
  clearTimeout(wmAdvanceTimer);
  clearTimeout(wmSequenceTimer);

  document.getElementById('wmProgress').textContent = wmQuestionIndex + 1;
  document.getElementById('wmCardScreen').style.display = 'none';
  document.getElementById('wmSequenceScreen').style.display = 'block';

  // 현재 레벨의 활성 단어 중 무작위로 wmCount개를 중복 없이 뽑습니다
  // (활성 단어가 너무 적을 경우 전체 사전에서 대신 뽑아 문제 생성이 막히지 않도록 합니다)
  let pool = getActiveWords().slice();
  if (pool.length < wmCount) pool = DICTIONARY.slice();
  pool = pool.sort(() => Math.random() - 0.5);
  wmSequence = pool.slice(0, wmCount);

  wmPlaySequence(0);
}

function wmPlaySequence(i) {
  if (i >= wmSequence.length) {
    wmSequenceTimer = setTimeout(() => {
      wmRevealCards();
    }, 400);
    return;
  }

  const word = wmSequence[i];
  const emojiEl = document.getElementById('wmSequenceEmoji');
  emojiEl.innerHTML = emojiVisualHTML(word);
  emojiEl.style.animation = 'none';
  void emojiEl.offsetWidth;
  emojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';

  document.getElementById('wmSequenceDots').textContent = `${i + 1} / ${wmSequence.length}`;

  speakTTS(word.jp);

  wmSequenceTimer = setTimeout(() => {
    wmPlaySequence(i + 1);
  }, 1300);
}

function wmRevealCards() {
  document.getElementById('wmSequenceScreen').style.display = 'none';
  document.getElementById('wmCardScreen').style.display = 'block';

  const shuffled = wmSequence.slice().sort(() => Math.random() - 0.5);
  const cardsContainer = document.getElementById('wmCards');
  cardsContainer.innerHTML = '';
  cardsContainer.style.pointerEvents = 'auto';
  cardsContainer.style.gridTemplateColumns = wmSequence.length <= 3 ? `repeat(${wmSequence.length}, 1fr)` : 'repeat(2, 1fr)';

  shuffled.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn wm-card';
    btn.dataset.jp = word.jp;
    btn.innerHTML = `<span>${word.jp}</span>`;
    btn.addEventListener('click', () => wmSelectCard(btn, word));
    cardsContainer.appendChild(btn);
  });

  // 5초 타이머 바 애니메이션
  const fill = document.getElementById('wmTimerFill');
  fill.style.transition = 'none';
  fill.style.width = '100%';
  void fill.offsetWidth;
  fill.style.transition = 'width 5s linear';
  fill.style.width = '0%';

  wmTimer = setTimeout(() => {
    wmTimeExpired();
  }, 5000);
}

function wmSelectCard(btn, word) {
  if (wmAnswered) return;
  const expected = wmSequence[wmUserProgress];

  if (expected && word.jp === expected.jp) {
    wmUserProgress += 1;
    btn.classList.add('correct');
    btn.disabled = true;
    const badge = document.createElement('span');
    badge.className = 'wm-order-badge';
    badge.textContent = wmUserProgress;
    btn.appendChild(badge);

    if (wmUserProgress >= wmSequence.length) {
      wmHandleSuccess();
    }
  } else {
    wmHandleFail(btn);
  }
}

function wmHandleSuccess() {
  if (wmAnswered) return;
  wmAnswered = true;
  clearTimeout(wmTimer);
  document.getElementById('wmCards').style.pointerEvents = 'none';

  wmCombo += 1;
  if (wmCombo > wmMaxCombo) wmMaxCombo = wmCombo;
  const comboBonus = (wmCombo - 1) * 5; // 콤보가 이어질수록 가산점이 커짐
  wmScore += wmSequence.length * 10 + comboBonus;
  wmCorrectCount += 1;

  document.getElementById('wmScore').textContent = wmScore;
  document.getElementById('wmCombo').textContent = wmCombo;
  if (typeof playCorrectSound === 'function') playCorrectSound();

  wmAdvanceTimer = setTimeout(() => {
    wmQuestionIndex += 1;
    showWordMemoryQuestion();
  }, 700);
}

function wmHandleFail(wrongBtn) {
  if (wmAnswered) return;
  wmAnswered = true;
  clearTimeout(wmTimer);
  document.getElementById('wmCards').style.pointerEvents = 'none';

  wmCombo = 0;
  document.getElementById('wmCombo').textContent = wmCombo;
  if (wrongBtn) wrongBtn.classList.add('wrong');
  if (typeof playWrongSound === 'function') playWrongSound();

  // 정답 순서를 카드 위에 숫자 배지로 보여줍니다 (이미 맞춘 카드는 건너뜀)
  const allBtns = document.querySelectorAll('#wmCards .wm-card');
  wmSequence.forEach((word, idx) => {
    allBtns.forEach(b => {
      if (b.dataset.jp === word.jp && !b.querySelector('.wm-order-badge')) {
        b.classList.add('correct-hint');
        const badge = document.createElement('span');
        badge.className = 'wm-order-badge';
        badge.textContent = idx + 1;
        b.appendChild(badge);
      }
    });
  });

  wmAdvanceTimer = setTimeout(() => {
    wmQuestionIndex += 1;
    showWordMemoryQuestion();
  }, 1200);
}

function wmTimeExpired() {
  if (wmAnswered) return;
  wmHandleFail(null);
}

function wmShowResult() {
  document.getElementById('wmSequenceScreen').style.display = 'none';
  document.getElementById('wmCardScreen').style.display = 'none';
  document.getElementById('wmResultScreen').style.display = 'block';
  document.getElementById('wmResultCorrect').textContent = wmCorrectCount;
  document.getElementById('wmResultMaxCombo').textContent = wmMaxCombo;
  document.getElementById('wmResultScore').textContent = wmScore;
}

/* 🧩🌑 짝 맞추기형 미니게임 엔진 (그림 반쪽 맞추기 / 실루엣 맞추기 공용)
   두 게임 모두 "단어를 하나 뽑아 문제를 보여주고, 선택지 중 정답을 고르면 점수·콤보가
   오르고 정답을 시각적으로 드러낸 뒤 다음 문제로 넘어간다"는 흐름이 동일해서,
   문제 렌더링(renderQuestion)·선택지 구성(buildOptions)·정답 공개 연출(onCorrectReveal)만
   게임별 콜백으로 분리하고 나머지 흐름은 엔진이 공용으로 처리합니다.
   id 규칙: #{idPrefix}StartScreen/PlayScreen/ResultScreen, #{idPrefix}Score/Combo/Progress,
   #{idPrefix}Options, #{idPrefix}ResultCorrect/ResultMaxCombo/ResultScore */
function createMatchRevealQuizGame(cfg) {
  const P = cfg.idPrefix;
  const el = (suffix) => document.getElementById(P + suffix);

  let score = 0, combo = 0, maxCombo = 0, correctCount = 0, questionIndex = 0;
  let currentWord = null, answered = false, advanceTimer = null;

  function resetState() {
    clearTimeout(advanceTimer);
    score = 0; combo = 0; maxCombo = 0; correctCount = 0; questionIndex = 0; currentWord = null;
    el('Score').textContent = '0';
    el('Combo').textContent = '0';
  }

  function cancelAdvance() { clearTimeout(advanceTimer); }

  function init() {
    resetState();
    el('StartScreen').style.display = 'block';
    el('PlayScreen').style.display = 'none';
    el('ResultScreen').style.display = 'none';
    const progressEl = el('Progress');
    if (progressEl) progressEl.textContent = '0';
  }

  function start() {
    resetState();
    el('StartScreen').style.display = 'none';
    el('ResultScreen').style.display = 'none';
    showQuestion();
  }

  function pickWord() {
    let pool = cfg.words;
    if (currentWord) pool = cfg.words.filter(w => w.jp !== currentWord.jp);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function showQuestion() {
    if (questionIndex >= cfg.totalQuestions) {
      showResult();
      return;
    }

    answered = false;
    clearTimeout(advanceTimer);

    const progressEl = el('Progress');
    if (progressEl) progressEl.textContent = questionIndex + 1;
    el('StartScreen').style.display = 'none';
    el('ResultScreen').style.display = 'none';
    el('PlayScreen').style.display = 'block';

    const word = pickWord();
    currentWord = word;

    cfg.renderQuestion(word);

    const options = cfg.buildOptions(word);
    const container = el('Options');
    container.innerHTML = '';
    container.style.pointerEvents = 'auto';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.dataset.correct = opt.isCorrect ? '1' : '0';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => selectOption(btn, opt));
      container.appendChild(btn);
    });
  }

  function replay() {
    if (currentWord) speakTTS(currentWord.jp);
  }

  function selectOption(selectedButton, choice) {
    if (answered) return;
    const allButtons = document.querySelectorAll(`#${P}Options .quiz-btn`);

    if (choice.isCorrect) {
      answered = true;
      el('Options').style.pointerEvents = 'none';

      combo += 1;
      if (combo > maxCombo) maxCombo = combo;
      const comboBonus = (combo - 1) * 5;
      score += 10 + comboBonus;
      correctCount += 1;
      el('Score').textContent = score;
      el('Combo').textContent = combo;

      selectedButton.classList.add('correct');
      playCorrectSound();
      celebrateCorrect(selectedButton, currentWord);
      addLogChip(currentWord);
      recordWordResult(currentWord, true);

      cfg.onCorrectReveal(currentWord, () => {
        advanceTimer = setTimeout(() => {
          questionIndex += 1;
          showQuestion();
        }, 0);
      });
    } else {
      selectedButton.classList.add('wrong');
      combo = 0;
      el('Combo').textContent = combo;
      playWrongSound();
      recordWordResult(currentWord, false);

      allButtons.forEach(btn => {
        if (btn.dataset.correct === '1') btn.classList.add('correct-hint');
      });

      setTimeout(() => {
        selectedButton.classList.remove('wrong');
      }, 800);
    }
  }

  function showResult() {
    el('PlayScreen').style.display = 'none';
    el('ResultScreen').style.display = 'block';
    el('ResultCorrect').textContent = correctCount;
    el('ResultMaxCombo').textContent = maxCombo;
    el('ResultScore').textContent = score;
  }

  return { init, start, replay, cancelAdvance };
}

/* 🧩 그림 반쪽 맞추기 게임 설정 — 그림(이모지)과 단어의 앞쪽 절반만 먼저 보여주고,
   아래 글자 카드 중에서 나머지 절반을 고르게 합니다. 정답을 고르면 그림의 나머지 반쪽과
   글자의 나머지 반쪽이 함께 나타나며 완성된 단어를 소리 내어 읽어줍니다 */
const ewGame = createMatchRevealQuizGame({
  idPrefix: 'ew',
  totalQuestions: EAWASE_TOTAL_QUESTIONS,
  words: EAWASE_WORDS,

  renderQuestion(word) {
    const { half1 } = ewSplitWord(word.jp);
    const emojiLeftEl = document.getElementById('ewEmojiLeft');
    const emojiRightEl = document.getElementById('ewEmojiRight');
    emojiLeftEl.textContent = word.emoji;
    emojiRightEl.textContent = word.emoji;
    emojiRightEl.style.display = 'none';
    emojiRightEl.classList.remove('ew-reveal-anim');
    document.getElementById('ewRightCardBack').style.display = 'flex';

    document.getElementById('ewWordLeft').textContent = half1;
    document.getElementById('ewWordRight').textContent = '？';
    document.getElementById('ewWordBox').classList.remove('ew-word-complete');
  },

  buildOptions(word) {
    const { half2 } = ewSplitWord(word.jp);
    const distractorPool = Array.from(new Set(
      EAWASE_WORDS
        .filter(w => w.jp !== word.jp)
        .map(w => ewSplitWord(w.jp).half2)
        .filter(h2 => h2 !== half2)
    ));
    distractorPool.sort(() => Math.random() - 0.5);
    const distractors = distractorPool.slice(0, 2);
    const options = [half2, ...distractors];
    options.sort(() => Math.random() - 0.5);
    return options.map(h => ({ label: h, isCorrect: h === half2 }));
  },

  onCorrectReveal(word, advance) {
    const { half2 } = ewSplitWord(word.jp);
    document.getElementById('ewRightCardBack').style.display = 'none';
    const emojiRightEl = document.getElementById('ewEmojiRight');
    emojiRightEl.style.display = 'block';
    emojiRightEl.classList.add('ew-reveal-anim');

    document.getElementById('ewWordRight').textContent = half2;
    document.getElementById('ewWordBox').classList.add('ew-word-complete');

    setTimeout(() => {
      speakTTS(word.jp);
    }, 350);
    setTimeout(advance, 1800);
  }
});

function initEawaseGame() { ewGame.init(); }
function startEawaseGame() { ewGame.start(); }

/* 🎞️ 실루엣 문제 등장 연출 4종 — 문제가 나올 때마다 이 중 하나를 무작위로 골라 실루엣을
   보여줍니다. 연출이 끝나면 항상 기본 실루엣(#silEmoji, 정지·검정 상태)으로 정리되므로,
   정답을 고르는 로직(onCorrectReveal)은 이 연출들과 무관하게 그대로 동작합니다. */
let silEffectTimers = [];

function silClearEffectTimers() {
  silEffectTimers.forEach(t => clearTimeout(t));
  silEffectTimers = [];
}

/* 진행 중이던 연출을 즉시 정리하고, 기본 실루엣(#silEmoji)만 보이는 상태로 되돌립니다 */
function silShowPlainSilhouette() {
  silClearEffectTimers();
  const emojiEl = document.getElementById('silEmoji');
  const mosaicEl = document.getElementById('silMosaicCanvas');
  const jigsawEl = document.getElementById('silJigsaw');
  if (emojiEl) {
    emojiEl.style.display = '';
    emojiEl.classList.remove('sil-fx-zoom', 'sil-fx-settle', 'sil-fx-slide');
  }
  if (mosaicEl) mosaicEl.style.display = 'none';
  if (jigsawEl) jigsawEl.style.display = 'none';
}

/* (1) 확대→축소: 실루엣이 일부만 크게 확대된 채 나타났다가 서서히 원래 크기로 줄어듭니다 */
function silRunZoomEffect() {
  const emojiEl = document.getElementById('silEmoji');
  emojiEl.classList.remove('sil-fx-settle');
  emojiEl.classList.add('sil-fx-zoom');
  void emojiEl.offsetWidth; // 강제 리플로우로 확대 상태를 먼저 확정시킵니다
  const t = setTimeout(() => emojiEl.classList.add('sil-fx-settle'), 30);
  silEffectTimers.push(t);
}

/* (4) 횡이동: 실루엣이 좌우로 흔들리며 나타났다가 서서히 진폭이 줄어들며 멈춰 섭니다 */
function silRunSlideEffect() {
  const emojiEl = document.getElementById('silEmoji');
  emojiEl.classList.remove('sil-fx-slide');
  void emojiEl.offsetWidth;
  emojiEl.classList.add('sil-fx-slide');
}

/* 이모지를 캔버스에 그려 모자이크 연출의 원본(고해상도) 이미지를 만듭니다 */
function silBuildMosaicSource(emoji, w, h) {
  const src = document.createElement('canvas');
  src.width = w; src.height = h;
  const ctx = src.getContext('2d');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '130px sans-serif';
  ctx.fillText(emoji, w / 2, h / 2 + 6);
  return src;
}

/* blockSize가 클수록 성긴 모자이크, 1이면 원본 그대로를 캔버스에 그립니다 */
function silDrawMosaicStep(canvas, src, blockSize) {
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  if (blockSize <= 1) {
    ctx.drawImage(src, 0, 0);
    return;
  }
  const smallW = Math.max(1, Math.round(w / blockSize));
  const smallH = Math.max(1, Math.round(h / blockSize));
  const tmp = document.createElement('canvas');
  tmp.width = smallW; tmp.height = smallH;
  const tctx = tmp.getContext('2d');
  tctx.imageSmoothingEnabled = true;
  tctx.drawImage(src, 0, 0, w, h, 0, 0, smallW, smallH);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, smallW, smallH, 0, 0, w, h);
}

/* (2) 모자이크→선명: 저해상도 블록으로 그려진 실루엣이 단계적으로 원래 해상도로 선명해집니다 */
function silRunMosaicEffect(word) {
  const emojiEl = document.getElementById('silEmoji');
  const canvas = document.getElementById('silMosaicCanvas');
  emojiEl.style.display = 'none';
  canvas.style.display = 'block';

  const src = silBuildMosaicSource(word.emoji, canvas.width, canvas.height);
  const steps = [46, 32, 22, 14, 9, 5, 1];
  steps.forEach((blockSize, i) => {
    const t = setTimeout(() => silDrawMosaicStep(canvas, src, blockSize), i * 150);
    silEffectTimers.push(t);
  });
  const finalT = setTimeout(() => {
    canvas.style.display = 'none';
    emojiEl.style.display = '';
  }, steps.length * 150 + 250);
  silEffectTimers.push(finalT);
}

/* (3) 직소 퍼즐: 실루엣이 4조각으로 나뉘어 흩어진 채 나타났다가 서서히 제자리를 찾아갑니다 */
function silRunJigsawEffect(word) {
  const emojiEl = document.getElementById('silEmoji');
  const jigsaw = document.getElementById('silJigsaw');
  const pieces = jigsaw.querySelectorAll('.sil-jigsaw-piece');
  emojiEl.style.display = 'none';
  jigsaw.style.display = 'block';

  pieces.forEach(p => {
    p.querySelector('.sil-emoji-copy').textContent = word.emoji;
    p.style.transition = 'none';
    const dx = (Math.random() * 130 + 60) * (Math.random() < 0.5 ? -1 : 1);
    const dy = (Math.random() * 110 + 50) * (Math.random() < 0.5 ? -1 : 1);
    const rot = Math.random() * 56 - 28;
    p.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
  });
  void jigsaw.offsetWidth; // 흩어진 초기 위치를 먼저 확정시킵니다

  const t = setTimeout(() => {
    pieces.forEach(p => {
      p.style.transition = 'transform 1.05s cubic-bezier(.22, .68, .36, 1)';
      p.style.transform = 'translate(0, 0) rotate(0)';
    });
  }, 30);
  silEffectTimers.push(t);

  const finalT = setTimeout(() => {
    jigsaw.style.display = 'none';
    emojiEl.style.display = '';
  }, 1250);
  silEffectTimers.push(finalT);
}

const SIL_REVEAL_EFFECTS = [silRunZoomEffect, silRunMosaicEffect, silRunJigsawEffect, silRunSlideEffect];

/* 🌑 실루엣 맞추기 게임 설정 — 그림 반쪽 맞추기와 같은 단어 데이터(EAWASE_WORDS)를 사용하되,
   그림을 반쪽으로 자르는 대신 CSS filter로 새까만 실루엣을 만들어 보여줍니다.
   - 문제가 시작되면: 실루엣 그림을 보여주며 발음을 한 번 들려줍니다
   - 히라가나 이름 4개(정답 1개 + 오답 3개) 중에서 정답을 고르면: 실루엣에 색이 채워지고,
     "전체 발음 → 한 글자씩 발음 → 전체 발음"을 차례로 들려준 뒤 자동으로 다음 문제로
     넘어갑니다 (글자별 순차 재생은 철자 순서 맞추기 게임의 playSpellingCompletionAudio를
     그대로 재사용합니다) */
const silGame = createMatchRevealQuizGame({
  idPrefix: 'sil',
  totalQuestions: SIL_TOTAL_QUESTIONS,
  words: EAWASE_WORDS,

  renderQuestion(word) {
    // 그림을 새까만 실루엣 상태로 되돌립니다.
    // 필터 트랜지션이 걸린 채로 sil-revealed 클래스를 떼면 방금 봤던 컬러 이모지가
    // 0.5초에 걸쳐 서서히 검게 변하는 게 보여버리므로, 트랜지션을 잠깐 꺼서
    // 처음부터 완성된 실루엣 상태로 바로 나타나게 합니다
    const emojiEl = document.getElementById('silEmoji');
    emojiEl.style.transition = 'none';
    emojiEl.textContent = word.emoji;
    emojiEl.classList.remove('sil-revealed', 'sil-reveal-anim');
    void emojiEl.offsetWidth; // 강제 리플로우로 위 변경 사항을 즉시 반영시킵니다
    emojiEl.style.transition = '';

    // 이름 표시도 숨겨둡니다
    const wordRevealEl = document.getElementById('silWordReveal');
    wordRevealEl.textContent = '';
    wordRevealEl.classList.remove('sil-word-visible');

    // 문제가 나올 때마다 4가지 등장 연출(확대축소/모자이크/직소퍼즐/횡이동) 중
    // 하나를 무작위로 골라 실루엣을 보여줍니다
    silShowPlainSilhouette();
    const effect = SIL_REVEAL_EFFECTS[Math.floor(Math.random() * SIL_REVEAL_EFFECTS.length)];
    effect(word);

    // 실루엣을 보여주며 발음을 들려줍니다
    speakTTS(word.jp);
  },

  buildOptions(word) {
    const distractorPool = EAWASE_WORDS.filter(w => w.jp !== word.jp).sort(() => Math.random() - 0.5);
    const distractors = distractorPool.slice(0, 3);
    const options = [word, ...distractors];
    options.sort(() => Math.random() - 0.5);
    return options.map(w => ({ label: w.jp, isCorrect: w.jp === word.jp }));
  },

  onCorrectReveal(word, advance) {
    // 등장 연출(모자이크/직소퍼즐 등)이 아직 끝나지 않았을 수 있으므로,
    // 정답 공개 전에 항상 기본 실루엣 상태로 먼저 정리합니다
    silShowPlainSilhouette();
    const emojiEl = document.getElementById('silEmoji');
    emojiEl.classList.add('sil-revealed', 'sil-reveal-anim');

    const wordRevealEl = document.getElementById('silWordReveal');
    wordRevealEl.textContent = word.jp;
    wordRevealEl.classList.add('sil-word-visible');

    // 전체 발음 → 한 글자씩 발음 → 전체 발음을 순서대로 들려준 뒤 다음 문제로 이동합니다
    // (playSpellingCompletionAudio는 철자 순서 맞추기 게임과 공용으로 사용하는 함수입니다)
    const chars = Array.from(word.jp);
    setTimeout(() => {
      playSpellingCompletionAudio(word, chars, () => {
        setTimeout(advance, 400);
      });
    }, 350);
  }
});

function initSilhouetteGame() { silClearEffectTimers(); silGame.init(); }
function startSilhouetteGame() { silGame.start(); }
/* 실루엣 상태에서 발음을 다시 듣고 싶을 때 누르는 버튼 */
function silReplaySound() { silGame.replay(); }


/* 🃏 CARD MATCHING GAME LOGIC */
function changeMatchGridSize(size) {
  const needed = (size * size) / 2;
  if (needed > getActiveWords().length) return; // 현재 레벨 단어 수로는 지원 불가능한 크기
  currentGridSize = size;
  document.querySelectorAll('#matchingMode .lvl-btn').forEach(btn => {
    if (btn.id === `sizeBtn${size}`) {
      btn.classList.add('active');
    } else if (btn.id.startsWith('sizeBtn')) {
      btn.classList.remove('active');
    }
  });
  initMatchGame();
}

function updateMatchGridAvailability() {
  const count = getActiveWords().length;
  [4, 6, 8].forEach(size => {
    const btn = document.getElementById(`sizeBtn${size}`);
    if (!btn) return;
    const neededPairs = (size * size) / 2;
    if (neededPairs > count) {
      btn.disabled = true;
      btn.style.opacity = 0.4;
      btn.style.cursor = 'not-allowed';
    } else {
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = '';
    }
  });

  // 현재 선택된 그리드가 지금 레벨의 단어 수로 더 이상 불가능하면 가능한 가장 큰 크기로 자동 전환
  const neededForCurrent = (currentGridSize * currentGridSize) / 2;
  if (neededForCurrent > count) {
    let fallback = 4;
    if (count >= 32) fallback = 8;
    else if (count >= 18) fallback = 6;
    currentGridSize = fallback;
    document.querySelectorAll('#matchingMode .lvl-btn').forEach(btn => {
      if (btn.id === `sizeBtn${fallback}`) btn.classList.add('active');
      else if (btn.id.startsWith('sizeBtn')) btn.classList.remove('active');
    });
  }
}

function initMatchGame() {
  updateMatchGridAvailability();

  const board = document.getElementById('gridBoard');
  board.className = `grid-board grid-${currentGridSize}x${currentGridSize}`;
  
  // 기존 그리드 사이즈 클래스 완전히 리셋 및 적용
  board.classList.remove('grid-4x4', 'grid-6x6', 'grid-8x8');
  board.classList.add(`grid-${currentGridSize}x${currentGridSize}`);

  // 게임 변수 리셋
  selectedFlippedCards = [];
  matchedPairsCount = 0;
  isMatchGameProcessing = false;
  
  totalPairsCount = (currentGridSize * currentGridSize) / 2;
  document.getElementById('matchCount').textContent = "0";
  document.getElementById('matchTotal').textContent = totalPairsCount;

  // 타이머 작동
  clearInterval(matchTimerInterval);
  matchTimeElapsed = 0;
  document.getElementById('matchTimer').textContent = "00:00";
  matchTimerInterval = setInterval(() => {
    matchTimeElapsed++;
    const min = String(Math.floor(matchTimeElapsed / 60)).padStart(2, '0');
    const sec = String(matchTimeElapsed % 60).padStart(2, '0');
    document.getElementById('matchTimer').textContent = `${min}:${sec}`;
  }, 1000);

  // 사전에 무작위 카드 쌍 빌드 (딕셔너리 리스트 셔플 후 필요한 만큼 추출)
  const dictShuffled = getActiveWords().slice().sort(() => Math.random() - 0.5);
  const selectedWords = dictShuffled.slice(0, totalPairsCount);

  // 이모지 타입 카드 노드와 히라가나 타입 카드 노드 리스트를 만듦
  let cardPool = [];
  selectedWords.forEach((word, index) => {
    cardPool.push({
      id: `${index}-emoji`,
      pairId: index,
      type: 'emoji',
      content: word.emoji,
      originalWord: word
    });
    cardPool.push({
      id: `${index}-jp`,
      pairId: index,
      type: 'jp',
      content: word.jp,
      originalWord: word
    });
  });

  // 카드 풀 완전 셔플
  cardPool.sort(() => Math.random() - 0.5);

  board.innerHTML = '';
  cardPool.forEach(cardData => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card-item';
    cardEl.dataset.id = cardData.id;
    cardEl.dataset.pairId = cardData.pairId;
    
    // 카드 3D 면 구성구현
    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front ${cardData.type === 'emoji' ? 'emoji-node' : 'text-node'}">
          ${cardData.type === 'emoji' ? emojiVisualHTML(cardData.originalWord) : cardData.content}
        </div>
      </div>
    `;

    cardEl.addEventListener('click', () => {
      handleCardClick(cardEl, cardData);
    });

    board.appendChild(cardEl);
  });
}

function handleCardClick(cardEl, cardData) {
  // 이미 활성화 되었거나, 뒤집힌 경우, 또는 처리 락 걸린 경우 패스
  if (isMatchGameProcessing) return;
  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

  // 1. 카드 뒤집기 효과음 재생
  playFlipSound();

  // 🔊 [발음 연동] 카드를 뒤집을 때마다 해당 단어의 원어민(TTS) 발음 즉시 들려주기
  if (cardData.originalWord && cardData.originalWord.jp) {
    speakTTS(cardData.originalWord.jp);
  }

  // 2. 카드 뒤집기 애니메이션 적용
  cardEl.classList.add('flipped');
  selectedFlippedCards.push({ element: cardEl, data: cardData });

  if (selectedFlippedCards.length === 2) {
    isMatchGameProcessing = true;
    const card1 = selectedFlippedCards[0];
    const card2 = selectedFlippedCards[1];

    if (card1.data.pairId === card2.data.pairId) {
      // 짝 맞추기 매칭 성공!
      setTimeout(() => {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        
        playCorrectSound();
        celebrateCorrect(card2.element, card1.data.originalWord);
        addLogChip(card1.data.originalWord); // 오늘 맞춘 기록 연동
        recordWordResult(card1.data.originalWord, true);

        matchedPairsCount++;
        document.getElementById('matchCount').textContent = matchedPairsCount;

        // 전체 쌍 성공 시 타이머 중지 및 축하 음성 출력
        if (matchedPairsCount === totalPairsCount) {
          clearInterval(matchTimerInterval);
          setTimeout(() => {
            speakTTS("おめでとうございます!"); // 오메데토고자이마스! (축하합니다)
            alert(`🎉 축하합니다! ${document.getElementById('matchTimer').textContent}만에 완료했습니다.`);
          }, 600);
        }

        selectedFlippedCards = [];
        isMatchGameProcessing = false;
      }, 500);
    } else {
      // 실패 시 다시 되돌림
      setTimeout(() => {
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
        playWrongSound();
        recordWordResult(card1.data.originalWord, false);
        recordWordResult(card2.data.originalWord, false);

        selectedFlippedCards = [];
        isMatchGameProcessing = false;
      }, 900);
    }
  }
}


/* ✏️ 선긋기(단어-뜻 연결) 게임 로직
   왼쪽에 일본어 단어 5개, 오른쪽에 한글 뜻 5개를 각각 무작위 순서로 배치하고,
   서로 관련된(같은 단어의) 짝을 순서대로 클릭해 선으로 연결하면 성공하는 게임입니다. */
let lineMatchPairs = [];       // 이번 판에 사용되는 단어 5개 (원본 데이터)
let lineMatchSelectedLeft = null; // 현재 선택된 왼쪽 항목의 pairId
let lineMatchMatchedCount = 0;
let lineMatchTotal = 5;
let lineMatchResizeHandler = null;

function initLineMatchGame() {
  const svg = document.getElementById('lineMatchSvg');
  const leftCol = document.getElementById('lineMatchLeftCol');
  const rightCol = document.getElementById('lineMatchRightCol');
  const clearMsg = document.getElementById('lineMatchClearMsg');
  if (!svg || !leftCol || !rightCol) return;

  // 상태 초기화
  lineMatchSelectedLeft = null;
  lineMatchMatchedCount = 0;
  clearMsg.style.display = 'none';
  svg.innerHTML = '';

  // 활성 단어 목록에서 5개(부족하면 있는 만큼) 무작위 추출
  const pool = getActiveWords().slice().sort(() => Math.random() - 0.5);
  lineMatchTotal = Math.min(5, pool.length);
  lineMatchPairs = pool.slice(0, lineMatchTotal);

  document.getElementById('lineMatchCount').textContent = '0';
  document.getElementById('lineMatchTotal').textContent = lineMatchTotal;

  const leftShuffled = lineMatchPairs.slice().sort(() => Math.random() - 0.5);
  const rightShuffled = lineMatchPairs.slice().sort(() => Math.random() - 0.5);

  leftCol.innerHTML = '';
  rightCol.innerHTML = '';

  leftShuffled.forEach(word => {
    const item = document.createElement('div');
    item.className = 'linematch-item';
    item.dataset.pairId = word.jp;
    item.textContent = word.jp;
    item.addEventListener('click', () => selectLineMatchLeft(item, word));
    leftCol.appendChild(item);
  });

  rightShuffled.forEach(word => {
    const item = document.createElement('div');
    item.className = 'linematch-item';
    item.dataset.pairId = word.jp;
    item.innerHTML = emojiVisualHTML(word);
    item.addEventListener('click', () => selectLineMatchRight(item, word));
    rightCol.appendChild(item);
  });

  // 창 크기가 바뀌면 완성된 선들의 좌표를 다시 계산합니다
  if (lineMatchResizeHandler) window.removeEventListener('resize', lineMatchResizeHandler);
  lineMatchResizeHandler = () => redrawLineMatchLines();
  window.addEventListener('resize', lineMatchResizeHandler);
}

function selectLineMatchLeft(itemEl, word) {
  if (itemEl.classList.contains('matched')) return;
  // 이미 선택된 왼쪽 항목을 다시 누르면 선택 해제
  document.querySelectorAll('#lineMatchLeftCol .linematch-item').forEach(el => el.classList.remove('selected'));
  if (lineMatchSelectedLeft === word.jp) {
    lineMatchSelectedLeft = null;
    return;
  }
  lineMatchSelectedLeft = word.jp;
  itemEl.classList.add('selected');
  playFlipSound();
  speakTTS(word.jp);
}

function selectLineMatchRight(itemEl, word) {
  if (itemEl.classList.contains('matched')) return;
  if (!lineMatchSelectedLeft) return; // 왼쪽을 먼저 선택해야 함

  const leftItem = document.querySelector(`#lineMatchLeftCol .linematch-item[data-pair-id="${CSS.escape(lineMatchSelectedLeft)}"]`);

  if (lineMatchSelectedLeft === word.jp) {
    // ✅ 짝 맞음 — 초록 선으로 고정
    leftItem.classList.remove('selected');
    leftItem.classList.add('matched');
    itemEl.classList.add('matched');
    drawLineMatchLine(leftItem, itemEl, 'var(--correct)', true);

    playCorrectSound();
    addLogChip(word);
    recordWordResult(word, true);

    lineMatchMatchedCount++;
    document.getElementById('lineMatchCount').textContent = lineMatchMatchedCount;
    lineMatchSelectedLeft = null;

    if (lineMatchMatchedCount >= lineMatchTotal) {
      setTimeout(() => {
        speakTTS('できました!');
        document.getElementById('lineMatchClearMsg').style.display = 'block';
      }, 400);
    }
  } else {
    // ❌ 짝 틀림 — 잠깐 빨간 선을 보여준 뒤 되돌림
    const tempLine = drawLineMatchLine(leftItem, itemEl, 'var(--wrong)', false);
    itemEl.classList.add('wrong-flash');
    leftItem.classList.add('wrong-flash');
    playWrongSound();

    const wrongWord = lineMatchPairs.find(w => w.jp === lineMatchSelectedLeft);
    if (wrongWord) recordWordResult(wrongWord, false);
    recordWordResult(word, false);

    setTimeout(() => {
      itemEl.classList.remove('wrong-flash');
      leftItem.classList.remove('wrong-flash', 'selected');
      if (tempLine && tempLine.parentNode) tempLine.parentNode.removeChild(tempLine);
      lineMatchSelectedLeft = null;
    }, 550);
  }
}

/* 두 항목의 중심점을 계산해 SVG 위에 직선을 그립니다.
   permanent가 true면 lineMatchPairId를 기록해 리사이즈 시 다시 계산할 수 있게 합니다. */
function drawLineMatchLine(leftEl, rightEl, color, permanent) {
  const svg = document.getElementById('lineMatchSvg');
  const board = document.getElementById('lineMatchBoard');
  if (!svg || !board || !leftEl || !rightEl) return null;

  const boardRect = board.getBoundingClientRect();
  const l = leftEl.getBoundingClientRect();
  const r = rightEl.getBoundingClientRect();

  const x1 = l.right - boardRect.left;
  const y1 = l.top + l.height / 2 - boardRect.top;
  const x2 = r.left - boardRect.left;
  const y2 = r.top + r.height / 2 - boardRect.top;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '3');
  line.setAttribute('stroke-linecap', 'round');
  if (permanent) {
    line.dataset.pairId = leftEl.dataset.pairId;
  }
  svg.appendChild(line);
  return line;
}

/* 창 크기 변경 시, 이미 연결된(초록) 선들만 새 좌표로 다시 그립니다 */
function redrawLineMatchLines() {
  const svg = document.getElementById('lineMatchSvg');
  if (!svg) return;
  svg.innerHTML = '';
  document.querySelectorAll('#lineMatchLeftCol .linematch-item.matched').forEach(leftEl => {
    const pairId = leftEl.dataset.pairId;
    const rightEl = document.querySelector(`#lineMatchRightCol .linematch-item[data-pair-id="${CSS.escape(pairId)}"]`);
    if (rightEl) drawLineMatchLine(leftEl, rightEl, 'var(--correct)', true);
  });
}

/* 🔊 의성어·의태어 카드 게임 로직
   상단에 의성어/의태어(히라가나)가 나오고 글자가 하이라이트되며 읽어줍니다.
   아래 카드 8장은 처음부터 뒤집히지 않은 채(이모지+단어가 바로 보이는 상태) 나오고,
   그중 문제와 연관된 단어 카드를 클릭해서 찾으면 정답입니다. */
let onomatopoeiaScore = 0;
let onomatopoeiaCurrent = null;
let onomatopoeiaLocked = false;
let onomatopoeiaCardCount = 8;

function generateOnomatopoeiaQuestion() {
  onomatopoeiaLocked = false;

  const cardsWrap = document.getElementById('onomatopoeiaCards');
  const promptEl = document.getElementById('onomatopoeiaPromptText');
  if (!cardsWrap || !promptEl) return;

  document.getElementById('onomatopoeiaScore').textContent = onomatopoeiaScore;

  // 정답 단어 하나를 뽑고, 나머지 오답 단어(중복 없이)를 뽑아 카드 8장을 구성합니다
  const shuffled = ONOMATOPOEIA_ITEMS.slice().sort(() => Math.random() - 0.5);
  onomatopoeiaCurrent = shuffled[0];
  const cardCount = Math.min(onomatopoeiaCardCount, ONOMATOPOEIA_ITEMS.length);
  const options = shuffled.slice(0, cardCount).sort(() => Math.random() - 0.5);

  cardsWrap.innerHTML = '';
  options.forEach(option => {
    const cardEl = document.createElement('div');
    cardEl.className = 'onomatopoeia-card';
    cardEl.innerHTML = `
      <span class="onomatopoeia-card-emoji">${option.emoji}${posBadgeHTML(option)}</span>
      <span class="onomatopoeia-card-word"></span>
      <span class="onomatopoeia-card-sound"></span>
    `;
    // 카드는 뒤집지 않고 처음부터 내용이 바로 보입니다. 문자 하이라이트를 위해 span에 글자를 채워둡니다.
    // 연결된 의성어/의태어(sound)는 스포일러가 되지 않도록 클릭 전까지는 비워둡니다.
    const wordEl = cardEl.querySelector('.onomatopoeia-card-word');
    wordEl.textContent = option.jp;
    cardEl.addEventListener('click', () => handleOnomatopoeiaCardClick(cardEl, option));
    cardsWrap.appendChild(cardEl);
  });

  // 문제 의성어/의태어를 히라가나로 표시하며 하이라이트 낭독
  playOnomatopoeiaPromptTTS();
}

function playOnomatopoeiaPromptTTS() {
  const promptEl = document.getElementById('onomatopoeiaPromptText');
  if (!promptEl || !onomatopoeiaCurrent) return;
  speakWithHighlight(onomatopoeiaCurrent.sound, promptEl, { rate: 0.65, pitch: 1.15 });
}

function replayOnomatopoeiaPrompt() {
  playOnomatopoeiaPromptTTS();
}

function handleOnomatopoeiaCardClick(cardEl, option) {
  if (onomatopoeiaLocked) return;
  if (cardEl.classList.contains('correct-pick') || cardEl.classList.contains('disabled-pick')) return;

  playFlipSound();

  const wordEl = cardEl.querySelector('.onomatopoeia-card-word');
  const soundEl = cardEl.querySelector('.onomatopoeia-card-sound');
  const isCorrect = option.jp === onomatopoeiaCurrent.jp;

  // 카드를 클릭하면 그 단어(히라가나)를 먼저 하이라이트하며 읽어준 뒤,
  // 이어서 그 단어와 연결된 의성어/의태어도 함께 읽어줘서 "단어 ↔ 소리" 연결 학습을 돕습니다.
  // ⏱ [타이밍 수정] 이전에는 "다음 문제로 넘어가기"가 고정된 setTimeout(1400ms)으로 걸려 있어서,
  // 단어+의성어 낭독이 그보다 오래 걸리면 다음 문제의 speakWithHighlight가 speechSynthesis를
  // cancel()하면서 의성어 낭독이 끝까지 재생되지 못하고 잘렸습니다.
  // 이제는 낭독이 실제로 끝나는 시점(onEnd)에 맞춰서만 다음 문제로 넘어가도록 바꿨습니다.
  function speakWordThenSound(onAllDone) {
    if (!wordEl) { if (onAllDone) onAllDone(); return; }
    speakWithHighlight(option.jp, wordEl, {
      rate: 0.7, pitch: 1.15,
      onEnd: () => {
        if (!soundEl) { if (onAllDone) onAllDone(); return; }
        soundEl.textContent = option.sound;
        setTimeout(() => {
          speakWithHighlight(option.sound, soundEl, {
            rate: 0.65, pitch: 1.15,
            onEnd: () => { if (onAllDone) onAllDone(); }
          });
        }, 150);
      }
    });
  }

  if (isCorrect) {
    // ✅ 정답!
    onomatopoeiaLocked = true;
    cardEl.classList.add('correct-pick');
    playCorrectSound();
    // 🔇 [소음 수정] 기존에는 celebrateCorrect()를 호출했는데, 이 함수 내부의 playAnimalCry()가
    // 톱니파(sawtooth) 오실레이터로 동물 울음소리를 합성해 정답음과 동시에 재생하면서
    // 파형이 겹쳐 간헐적으로 "찌직" 하는 클리핑(clipping) 잡음이 났습니다.
    // 이 게임은 이미 실제 일본어 음성(TTS)으로 의성어를 들려주므로 그 합성음이 필요 없어,
    // 시각 연출(이모지 확대·바운스)만 남기고 playAnimalCry 호출은 완전히 제거했습니다.
    celebrateElement(cardEl);
    celebrateFullscreenEmoji(option.emoji);
    addLogChip(option);
    recordWordResult(option, true);
    onomatopoeiaScore++;
    document.getElementById('onomatopoeiaScore').textContent = onomatopoeiaScore;

    speakWordThenSound(() => {
      setTimeout(() => generateOnomatopoeiaQuestion(), 500);
    });
  } else {
    // ❌ 오답 — 살짝 흔들리며 표시된 뒤, 다시 시도할 수 있도록 비활성화만 해둡니다
    recordWordResult(option, false);
    cardEl.classList.add('wrong-pick');
    playWrongSound();
    setTimeout(() => {
      cardEl.classList.remove('wrong-pick');
      cardEl.classList.add('disabled-pick');
    }, 500);
    speakWordThenSound();
  }
}

function addLogChip(word) {
  const existing = Array.from(logList.children).some(chip => chip.textContent.includes(word.jp));
  if (!existing) {
    const chip = document.createElement('div');
    chip.className = 'log-chip';
    chip.innerHTML = `${emojiVisualHTML(word)}<span>${word.jp}</span>`;
    logList.prepend(chip);
  }
}

/* 📊 단어별 정답/오답 통계 유틸 함수 (모든 게임 모드 공통 누적) */
function recordWordResult(word, isCorrect) {
  if (!word || !word.jp) return;
  if (!wordStats[word.jp]) wordStats[word.jp] = { correct: 0, wrong: 0 };
  if (isCorrect) {
    wordStats[word.jp].correct += 1;
  } else {
    wordStats[word.jp].wrong += 1;
  }
  updateGalleryCardRate(word.jp);
}

function getWrongRate(jp) {
  const stat = wordStats[jp];
  if (!stat) return null;
  const total = stat.correct + stat.wrong;
  if (total === 0) return null;
  return (stat.wrong / total) * 100;
}

function getWrongRateClass(jp) {
  const rate = getWrongRate(jp);
  if (rate === null) return null;
  if (rate >= 50) return 'rate-pink';
  if (rate >= 10) return 'rate-yellow';
  return 'rate-green'; // 0% 이상 10% 미만
}

function updateGalleryCardRate(jp) {
  const card = galleryEl.querySelector(`.gcard[data-jp="${CSS.escape(jp)}"]`);
  if (!card) return;
  card.classList.remove('rate-pink', 'rate-yellow', 'rate-green');
  const cls = getWrongRateClass(jp);
  if (cls) card.classList.add(cls);
}

let renderedLength = 0;
let currentText = "";
let lastMatchedJp = null;
let matchResetTimer = null;

function findMatch(text){
  for(const w of getActiveWords()){
    if(text.includes(w.jp)) return w;
  }
  return null;
}

function renderStream(text, matchedWord){
  placeholderEl.style.display = text.length ? 'none' : 'block';
  streamEl.innerHTML = '';
  const chars = Array.from(text);
  const matchStart = matchedWord ? text.indexOf(matchedWord.jp) : -1;
  const matchEnd = matchedWord ? matchStart + matchedWord.jp.length : -1;
  chars.forEach((ch, i)=>{
    const span = document.createElement('span');
    span.className = 'ch' + ((matchedWord && i>=matchStart && i<matchEnd) ? ' matched':'');
    span.style.animationDelay = (i * 0.02) + 's';
    span.textContent = ch;
    streamEl.appendChild(span);
  });
}

function showStamp(word){
  stampEmoji.innerHTML = emojiVisualHTML(word);
  stampJp.textContent = word.jp;
  stampRomaji.textContent = word.romaji;
  stampKr.textContent = word.kr;
  stampCard.classList.remove('show');
  void stampCard.offsetWidth;
  stampCard.classList.add('show');

  addLogChip(word);
}

function handleText(text){
  currentText = text;
  const match = findMatch(text);
  renderStream(text, match);
  if(match && match.jp !== lastMatchedJp){
    lastMatchedJp = match.jp;
    showStamp(match);
    clearTimeout(matchResetTimer);
    matchResetTimer = setTimeout(()=>{
      currentText = "";
      renderStream("", null);
      lastMatchedJp = null;
    }, 1600);
  }
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;
let finalTranscript = "";

if(!SpeechRecognitionAPI){
  unsupportedMsg.style.display = 'block';
  micBtn.disabled = true;
  micBtn.style.opacity = 0.4;
  micBtn.style.cursor = 'not-allowed';
} else {
  recognition = new SpeechRecognitionAPI();
  recognition.lang = 'ja-JP';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event)=>{
    let interim = "";
    for(let i = event.resultIndex; i < event.results.length; i++){
      const res = event.results[i];
      if(res.isFinal){
        finalTranscript += res[0].transcript;
      } else {
        interim += res[0].transcript;
      }
    }
    handleText(finalTranscript + interim);
  };

  recognition.onerror = (e)=>{
    statusLabel.textContent = '오류가 발생했어요';
    statusSub.textContent = e.error === 'not-allowed'
      ? '마이크 권한이 차단되어 있어요. 아래 텍스트 테스트를 이용해주세요.'
      : ('오류: ' + e.error);
    stopListening();
  };

  recognition.onend = ()=>{
    if(listening){
      try{ recognition.start(); }catch(e){}
    }
  };
}

function startListening(){
  if(!recognition) return;
  listening = true;
  finalTranscript = "";
  currentText = "";
  lastMatchedJp = null;
  renderStream("", null);
  micBtn.classList.add('listening');
  statusLabel.textContent = '듣는 중… 일본어로 말해보세요';
  statusSub.textContent = '단어를 말하면 히라가나로 표시돼요';
  try{ recognition.start(); }catch(e){}
}

function stopListening(){
  listening = false;
  micBtn.classList.remove('listening');
  statusLabel.textContent = '마이크를 눌러 시작하세요';
  statusSub.textContent = '일본어(ja-JP) 음성 인식을 사용합니다';
  if(recognition){ try{ recognition.stop(); }catch(e){} }
}

micBtn.addEventListener('click', ()=>{
  if(listening) stopListening(); else startListening();
});

const fallbackInput = document.getElementById('fallbackInput');
const fallbackBtn = document.getElementById('fallbackBtn');

function runFallback(){
  const val = fallbackInput.value.trim();
  if(!val) return;
  let i = 0;
  let acc = "";
  const timer = setInterval(()=>{
    acc += val[i];
    handleText(acc);
    i++;
    if(i >= val.length) clearInterval(timer);
  }, 90);
  fallbackInput.value = "";
}
fallbackBtn.addEventListener('click', runFallback);
fallbackInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') runFallback(); });

/* 🎤 PRONUNCIATION PRACTICE GAME LOGIC */
let pronounceScore = 0;
let pronounceCombo = 0;
let currentPronounceWord = null;
let pronounceAttemptCount = 0;
let pronounceListening = false;
let pronounceRecognition = null;

const pronounceEmojiEl = document.getElementById('pronounceEmoji');
const pronounceMicBtn = document.getElementById('pronounceMicBtn');
const pronounceStatusLabel = document.getElementById('pronounceStatusLabel');
const pronounceStatusSub = document.getElementById('pronounceStatusSub');
const pronounceFeedback = document.getElementById('pronounceFeedback');
const pronounceAnswerBox = document.getElementById('pronounceAnswerBox');
const pronounceJpHint = document.getElementById('pronounceJpHint');
const pronounceKrHint = document.getElementById('pronounceKrHint');
const pronounceUnsupportedMsg = document.getElementById('pronounceUnsupportedMsg');
const pronounceScoreEl = document.getElementById('pronounceScore');
const pronounceComboEl = document.getElementById('pronounceCombo');

function speakPronounceWord() {
  if (!currentPronounceWord) return;
  speakTTS(currentPronounceWord.jp);
}

/* 🗣️ 확장 발화(expansion) — 실제 부모가 아이의 한 단어 말을 문장으로 넓혀서
   되돌려주는 육아 방식(expansion technique)을 재현합니다.
   단어에 expand 필드가 있으면 아기말→실제 단어 확장을, 없으면 칭찬 확장을 사용합니다. */
function getExpansionPhrase(word){
  if(word.expand){
    return { jp: `そう、${word.jp}だね！${word.expand}だね！`, kr: word.expandKr || `${word.kr}, 참 잘했어요` };
  }
  return { jp: `そう、${word.jp}だね！じょうずだね！`, kr: `맞아요, ${word.kr}예요! 참 잘했어요` };
}

function speakExpansion(word){
  const phrase = getExpansionPhrase(word);
  const box = document.getElementById('pronounceExpansionBox');
  const jpEl = document.getElementById('pronounceExpansionJp');
  const krEl = document.getElementById('pronounceExpansionKr');
  if(krEl) krEl.textContent = phrase.kr;
  if(box) box.classList.add('show');

  speakWithHighlight(phrase.jp, jpEl, { rate: 0.8, pitch: 1.15 });
}

function generatePronounceQuestion() {
  pronounceAttemptCount = 0;
  pronounceScoreEl.textContent = pronounceScore;
  pronounceComboEl.textContent = pronounceCombo;

  const activeWords = getActiveWords();
  const randomIndex = Math.floor(Math.random() * activeWords.length);
  currentPronounceWord = activeWords[randomIndex];

  pronounceEmojiEl.innerHTML = emojiVisualHTML(currentPronounceWord);
  pronounceEmojiEl.style.animation = 'none';
  void pronounceEmojiEl.offsetWidth;
  pronounceEmojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';

  pronounceAnswerBox.style.display = 'none';
  pronounceFeedback.textContent = '';
  pronounceFeedback.style.color = '';
  pronounceStatusLabel.textContent = '이모지를 보고 발음을 들어보세요';
  pronounceStatusSub.textContent = '마이크를 눌러 따라 말해보세요';
  document.getElementById('pronounceExpansionBox').classList.remove('show');

  // 이모지 등장 직후 자동으로 정답 발음을 들려줌
  setTimeout(()=>{ speakPronounceWord(); }, 300);
}

function normalizePronounceText(s){
  return (s || '').replace(/[\s。、！？,\.!?]/g, '');
}

function checkPronounceAnswer(spokenText){
  const target = currentPronounceWord;
  if(!target) return;
  const norm = normalizePronounceText(spokenText);
  const isCorrect = norm.length > 0 && norm.includes(target.jp);

  if(isCorrect){
    pronounceScore += 10;
    pronounceCombo += 1;
    pronounceScoreEl.textContent = pronounceScore;
    pronounceComboEl.textContent = pronounceCombo;
    playCorrectSound();
    celebrateCorrect(pronounceEmojiEl, target);
    addLogChip(target);
    recordWordResult(target, true);

    pronounceAnswerBox.style.display = 'block';
    pronounceJpHint.textContent = target.jp;
    pronounceKrHint.textContent = target.kr;

    pronounceFeedback.style.color = 'var(--correct)';
    pronounceFeedback.textContent = `정확해요! 🎉 "${spokenText}" → ${target.jp} (${target.kr})`;
    pronounceStatusLabel.textContent = '정답이에요!';
    pronounceStatusSub.textContent = '잠시 후 다음 문제로 넘어가요';

    // 🗣️ 확장 발화(expansion): 아이가 한 단어를 말하면 부모가 문장으로 확장해서 되돌려주는 방식
    setTimeout(()=>{ speakExpansion(target); }, 700);

    setTimeout(()=>{ generatePronounceQuestion(); }, 3400);
  } else {
    pronounceCombo = 0;
    pronounceComboEl.textContent = pronounceCombo;
    pronounceAttemptCount += 1;
    playWrongSound();
    recordWordResult(target, false);

    pronounceFeedback.style.color = wrongFeedbackColor();
    pronounceFeedback.textContent = wrongFeedbackText(
      spokenText
        ? `다시 시도해보세요! (인식된 발음: "${spokenText}")`
        : '다시 시도해보세요! 발음이 인식되지 않았어요.'
    );
    pronounceStatusLabel.textContent = isGentleFeedbackMode() ? '잘 듣고 있어요, 한 번 더!' : '아쉬워요, 한 번 더!';
    pronounceStatusSub.textContent = '🔊 버튼으로 발음을 다시 듣고 마이크로 따라 해보세요';

    if(pronounceAttemptCount >= 2){
      pronounceAnswerBox.style.display = 'block';
      pronounceJpHint.textContent = target.jp;
      pronounceKrHint.textContent = target.kr;
    }
  }
}

const PronounceRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
if(!PronounceRecognitionAPI){
  pronounceUnsupportedMsg.style.display = 'block';
  pronounceMicBtn.disabled = true;
  pronounceMicBtn.style.opacity = 0.4;
  pronounceMicBtn.style.cursor = 'not-allowed';
} else {
  pronounceRecognition = new PronounceRecognitionAPI();
  pronounceRecognition.lang = 'ja-JP';
  pronounceRecognition.continuous = false;
  pronounceRecognition.interimResults = false;
  pronounceRecognition.maxAlternatives = 3;

  pronounceRecognition.onresult = (event)=>{
    let spoken = "";
    for(let i = 0; i < event.results.length; i++){
      spoken += event.results[i][0].transcript;
    }
    checkPronounceAnswer(spoken.trim());
  };

  pronounceRecognition.onerror = (e)=>{
    pronounceStatusLabel.textContent = '오류가 발생했어요';
    pronounceStatusSub.textContent = e.error === 'not-allowed'
      ? '마이크 권한이 차단되어 있어요. 아래 텍스트 테스트를 이용해주세요.'
      : ('오류: ' + e.error);
    stopPronounceListening();
  };

  pronounceRecognition.onend = ()=>{
    stopPronounceListening();
  };
}

function startPronounceListening(){
  if(!pronounceRecognition || pronounceListening) return;
  pronounceListening = true;
  pronounceMicBtn.classList.add('listening');
  pronounceStatusLabel.textContent = '듣는 중… 따라 말해보세요';
  pronounceStatusSub.textContent = currentPronounceWord ? `"${currentPronounceWord.jp}" 라고 말해보세요` : '';
  try{ pronounceRecognition.start(); }catch(e){}
}

function stopPronounceListening(){
  pronounceListening = false;
  pronounceMicBtn.classList.remove('listening');
  if(pronounceRecognition){ try{ pronounceRecognition.stop(); }catch(e){} }
}

pronounceMicBtn.addEventListener('click', ()=>{
  if(pronounceListening) stopPronounceListening(); else startPronounceListening();
});

const pronounceFallbackInput = document.getElementById('pronounceFallbackInput');
const pronounceFallbackBtn = document.getElementById('pronounceFallbackBtn');

function runPronounceFallback(){
  const val = pronounceFallbackInput.value.trim();
  if(!val) return;
  checkPronounceAnswer(val);
  pronounceFallbackInput.value = "";
}
pronounceFallbackBtn.addEventListener('click', runPronounceFallback);
pronounceFallbackInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') runPronounceFallback(); });

/* 🎤 히라가나 읽기 게임 로직
   히라가나 글자를 보고 소리 내어 읽으면, 음성 인식으로 정답 여부를 판정하는 게임.
   - 왼쪽엔 문제 글자, 오른쪽엔 마이크로 인식된 글자를 보여줌
   - 시도당 2초의 인식 제한 시간이 있고, 문제당 최대 2번까지 시도할 수 있음
   - 1차 시도 성공: 정답 점수 +2 / 1차 실패 → 2초 대기 후 2차 시도
   - 2차 시도 성공: 정답 점수 +1 / 2차도 실패: 오답 점수 +2
   - 총 10문제를 풀고 정답/오답 점수를 결과 화면에 보여줌 */
const HrRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

/* 🎤 히라가나 읽기(hr) - 공용 통계 엔진 인스턴스.
   히라가나 쓰기와 동일한 구조를 그대로 재사용하되, 저장 키와 데이터는 별도로 관리합니다 */
const hrStats = createHiraganaStatsEngine({
  prefix: 'hr',
  statsKey: HR_STATS_KEY,
  weightKey: HR_WEIGHT_KEY,
  defaultWeightLevel: 1,
  confirmMessage: '히라가나 읽기의 글자별 성공/실패 통계 기록을 모두 초기화할까요?\n이 작업은 되돌릴 수 없어요.'
});
function loadHrCharStats() { hrStats.load(); }
function saveHrCharStats() { hrStats.save(); }
function resetHrCharStats() { hrStats.reset(); }
function hrGetStat(ch) { return hrStats.getStat(ch); }
function loadHrWeightLevel() { hrStats.loadWeightLevel(); }
function setHrWeightLevel(level) { hrStats.setWeightLevel(level); }
function renderHrStatGrid() { hrStats.renderStatGrid(); }
function hrRecordMistake(ch, amount = 1, isTimeout = false) { hrStats.recordMistake(ch, amount, isTimeout); recordActiveSetAttempt(ch, false, isTimeout); }
function hrRecordCorrect(ch) { hrStats.recordCorrect(ch); recordActiveSetAttempt(ch, true, false); }
function hrWeightedPick(count) { return hrStats.weightedPick(count); }

function initHiraganaReadGame(){
  clearTimeout(hrAttemptTimer);
  clearTimeout(hrRetryTimer);
  clearTimeout(hrAdvanceTimer);
  stopHrListening();
  showDrillScreen('hr', 'start');
  hrCorrectScore = 0; hrWrongScore = 0; hrIndex = 0;
  document.getElementById('hrCorrectScore').textContent = '0';
  document.getElementById('hrWrongScore').textContent = '0';
  document.getElementById('hrProgress').textContent = '0';

  // 저장된 글자별 성공/실패 통계를 불러와 시작 화면의 46자 그리드에 표시합니다
  loadHrCharStats();
  renderHrStatGrid();

  // 저장된 가중치 강도(균등/약하게/보통/강하게/오답만/SRS)를 불러와 버튼 강조를 갱신합니다
  loadHrWeightLevel();

  if(!HrRecognitionAPI){
    document.getElementById('hrUnsupportedMsg').style.display = 'block';
  }
}

function startHiraganaReadGame(){
  clearTimeout(hrAttemptTimer);
  clearTimeout(hrRetryTimer);
  clearTimeout(hrAdvanceTimer);
  stopHrListening();
  hrCorrectScore = 0; hrWrongScore = 0; hrIndex = 0;
  document.getElementById('hrCorrectScore').textContent = '0';
  document.getElementById('hrWrongScore').textContent = '0';

  // HIRAGANA_LIST 46자 중 10개를 뽑아 이번 판의 문제 세트를 만듭니다.
  // 이전 게임들에서 자주 틀린 글자일수록 더 높은 확률로 뽑히도록 통계를 반영합니다
  loadHrCharStats();
  hrQuestions = reviewSessionActive ? hrStats.pickFromSubset(reviewSessionChars, 10) : hrWeightedPick(10);

  showDrillScreen('hr', 'question');

  showHiraganaReadQuestion();
}

function showHiraganaReadQuestion(){
  if(hrIndex >= hrQuestions.length){
    hrShowResult();
    return;
  }
  hrAnswered = false;
  hrAttempt = 1;
  hrAnyTimeoutThisQuestion = false;
  clearTimeout(hrAttemptTimer);
  clearTimeout(hrRetryTimer);
  clearTimeout(hrAdvanceTimer);

  document.getElementById('hrProgress').textContent = hrIndex + 1;

  const q = hrQuestions[hrIndex];
  currentHrQuestion = q;

  // 이 글자의 SRS 단계에 맞춰 시도당 제한 시간을 조절합니다(잘 아는 글자일수록 짧게, 아직 안 외운 글자는 넉넉하게)
  hrCurrentTimeLimit = stageAdjustedTimeMs(HR_ATTEMPT_TIME_LIMIT, hrStats.getStat(q.ch).srsStage, HR_MIN_TIME_MS);

  const targetEl = document.getElementById('hrTargetChar');
  targetEl.textContent = q.ch;
  targetEl.style.fontFamily = pickCharFontVariant(q.ch);
  targetEl.style.animation = 'none';
  void targetEl.offsetWidth;
  targetEl.style.animation = 'quizAppear .35s cubic-bezier(.175, .885, .32, 1.275)';

  const recognizedEl = document.getElementById('hrRecognizedChar');
  recognizedEl.textContent = '준비중';
  recognizedEl.classList.remove('listening');
  recognizedEl.classList.add('preparing');

  document.getElementById('hrAttemptLabel').textContent = '1번째 시도';
  document.getElementById('hrFeedback').textContent = '';

  hrStartAttempt();
}

function hrStartAttempt(){
  if(!HrRecognitionAPI){
    // 음성 인식을 지원하지 않는 브라우저라면 시도할 수 없으니 바로 최종 실패로 처리합니다.
    hrHandleFinalFail();
    return;
  }

  const recognizedEl = document.getElementById('hrRecognizedChar');
  // 아직 마이크가 실제로 듣기 시작한 건 아니므로 '준비중'으로 표시합니다
  // (onstart 이벤트가 들어와야 진짜로 듣기 시작한 '대기중' 상태가 됩니다)
  recognizedEl.textContent = '준비중';
  recognizedEl.classList.remove('listening');
  recognizedEl.classList.add('preparing');

  // 시도당 제한을 보여주는 타이머 바 애니메이션
  animateTimerBar('hrTimerFill', hrCurrentTimeLimit);

  hrRecognition = new HrRecognitionAPI();
  hrRecognition.lang = 'ja-JP';
  hrRecognition.continuous = false;
  // 첫 글자가 인식되는 즉시 반응할 수 있도록 중간(임시) 인식 결과도 받습니다
  hrRecognition.interimResults = true;
  hrRecognition.maxAlternatives = 1;
  hrListening = true;
  let hrResultHandled = false;

  // 마이크가 실제로 켜져서 듣기를 시작하면 '대기중'으로 전환합니다 (아직 음성 신호는 없는 상태)
  hrRecognition.onstart = () => {
    recognizedEl.classList.remove('preparing');
    recognizedEl.classList.add('listening');
    recognizedEl.textContent = '대기중';
  };

  // 마이크에 음성 신호가 들어오기 시작했지만 아직 인식 결과가 나오기 전이면 '인식중'으로 바꿔 보여줍니다.
  hrRecognition.onspeechstart = () => {
    recognizedEl.textContent = '인식중';
  };

  // 첫 히라가나 글자가 인식되는 즉시(임시 결과 포함) 듣기를 중단하고 판정합니다.
  hrRecognition.onresult = (event) => {
    if(hrResultHandled) return;
    let spoken = "";
    for(let i = 0; i < event.results.length; i++){
      spoken += event.results[i][0].transcript;
    }
    spoken = spoken.trim();
    if(!spoken) return; // 아직 아무 글자도 인식되지 않았으면 계속 기다립니다
    hrResultHandled = true;
    try{ hrRecognition.stop(); }catch(e){}
    hrHandleRecognitionResult(spoken);
  };

  // 권한 거부 등 오류가 나도 '이번 시도에서 못 맞힘'으로 처리해 게임 흐름이 멈추지 않게 합니다.
  hrRecognition.onerror = () => {
    if(hrResultHandled) return;
    hrResultHandled = true;
    hrHandleRecognitionResult('');
  };

  hrRecognition.onend = () => {
    hrListening = false;
  };

  try{ hrRecognition.start(); }catch(e){}

  clearTimeout(hrAttemptTimer);
  hrAttemptTimer = setTimeout(() => {
    // 제한 시간 안에 인식 결과가 오지 않으면 이번 시도는 실패로 처리합니다.
    if(hrResultHandled) return;
    hrResultHandled = true;
    hrAnyTimeoutThisQuestion = true;
    hrHandleRecognitionResult('');
  }, hrCurrentTimeLimit);
}

function hrHandleRecognitionResult(spokenText){
  if(hrAnswered) return;
  clearTimeout(hrAttemptTimer);
  stopHrListening();

  const recognizedEl = document.getElementById('hrRecognizedChar');
  recognizedEl.classList.remove('listening');
  recognizedEl.classList.remove('preparing');
  recognizedEl.textContent = spokenText ? spokenText : '( 인식 안 됨 )';

  const norm = normalizePronounceText(spokenText);
  const isCorrect = norm.length > 0 && norm.includes(currentHrQuestion.ch);

  if(isCorrect){
    hrHandleSuccess();
  } else if(hrAttempt === 1){
    hrAttempt = 2;
    document.getElementById('hrAttemptLabel').textContent = '2번째 시도';
    document.getElementById('hrFeedback').textContent = wrongFeedbackText('아쉬워요! 2초 후 한 번 더 들어볼게요');
    hrRetryTimer = setTimeout(() => {
      // 틀린 글자를 지우고 다시 듣기 준비 상태로 돌아갑니다
      recognizedEl.textContent = '';
      hrStartAttempt();
    }, HR_RETRY_DELAY);
  } else {
    hrHandleFinalFail();
  }
}

/* hrHandleSuccess/hrHandleFinalFail 공통 시작부: 중복 처리 방지 + 타이머/리스닝 정리.
   이미 답변 처리된 상태면 false를 반환해 호출부가 그대로 리턴하게 합니다 */
function hrBeginFinish(){
  if(hrAnswered) return false;
  hrAnswered = true;
  clearTimeout(hrAttemptTimer);
  clearTimeout(hrRetryTimer);
  stopHrListening();
  return true;
}

/* 정답/오답 표시 후 delay(ms) 뒤 다음 문제로 넘어가는 타이머를 예약합니다 */
function hrScheduleAdvance(delay){
  hrAdvanceTimer = setTimeout(() => {
    hrIndex += 1;
    showHiraganaReadQuestion();
  }, delay);
}

function hrHandleSuccess(){
  if(!hrBeginFinish()) return;

  const earned = hrAttempt === 1 ? 2 : 1;
  hrCorrectScore += earned;
  document.getElementById('hrCorrectScore').textContent = hrCorrectScore;

  if(typeof playCorrectSound === 'function') playCorrectSound();
  hrRecordCorrect(currentHrQuestion.ch);

  const feedbackEl = document.getElementById('hrFeedback');
  feedbackEl.style.color = 'var(--correct)';
  feedbackEl.textContent = `🎉 정답이에요! (+${earned}점) · ${currentHrQuestion.ch} (${currentHrQuestion.romaji})`;

  hrScheduleAdvance(1200);
}

function hrHandleFinalFail(){
  if(!hrBeginFinish()) return;

  hrWrongScore += 2;
  document.getElementById('hrWrongScore').textContent = hrWrongScore;

  if(typeof playWrongSound === 'function') playWrongSound();
  hrRecordMistake(currentHrQuestion.ch, 1, hrAnyTimeoutThisQuestion);

  const feedbackEl = document.getElementById('hrFeedback');
  feedbackEl.style.color = wrongFeedbackColor();
  feedbackEl.textContent = `아쉬워요! 정답은 ${currentHrQuestion.ch} (${currentHrQuestion.romaji})이었어요`;

  hrScheduleAdvance(1400);
}

function hrShowResult(){
  showDrillScreen('hr', 'result');
  document.getElementById('hrResultCorrect').textContent = hrCorrectScore;
  document.getElementById('hrResultWrong').textContent = hrWrongScore;
  if (!reviewSessionActive) evaluateActiveSetExpansion();
  scheduleNextReviewRound();
}

/* 게임을 벗어나거나 문제가 바뀔 때 마이크와 관련 타이머를 모두 정리합니다 */
function stopHrListening(){
  hrListening = false;
  clearTimeout(hrAttemptTimer);
  clearTimeout(hrRetryTimer);
  const recognizedEl = document.getElementById('hrRecognizedChar');
  if(recognizedEl){
    recognizedEl.classList.remove('listening');
    recognizedEl.classList.remove('preparing');
  }
  if(hrRecognition){
    try{
      hrRecognition.onstart = null;
      hrRecognition.onspeechstart = null;
      hrRecognition.onresult = null;
      hrRecognition.onerror = null;
      hrRecognition.onend = null;
      hrRecognition.stop();
    }catch(e){}
  }
}

/* 🌅 하루 일과 씬(scene) 모드 로직
   실제 아기가 배우는 방식처럼, 단어를 낱개로 퀴즈 풀게 하지 않고
   상황(기상/식사/목욕/놀이/취침) 속에서 부모가 하는 말을 반복해서 들려줍니다. */
let currentSceneIndex = 0;
let currentSceneLineIndex = 0;
let sceneAutoplayTimer = null;
let sceneSpeakTimer = null;

function initSceneMode(){
  renderSceneSelector();
  selectScene(currentSceneIndex, true);
}

function renderSceneSelector(){
  const wrap = document.getElementById('sceneSelect');
  if(wrap.childElementCount === SCENES.length) return; // 이미 만들어져 있으면 다시 만들지 않음
  wrap.innerHTML = '';
  SCENES.forEach((scene, idx)=>{
    const btn = document.createElement('button');
    btn.className = 'scene-btn' + (idx === currentSceneIndex ? ' active' : '');
    btn.textContent = `${scene.emoji} ${scene.title}`;
    btn.onclick = ()=> selectScene(idx);
    wrap.appendChild(btn);
  });
}

function selectScene(idx, autoplayFirst){
  stopSceneAutoplay();
  currentSceneIndex = idx;
  currentSceneLineIndex = 0;
  document.querySelectorAll('#sceneSelect .scene-btn').forEach((btn,i)=> btn.classList.toggle('active', i===idx));
  renderSceneLine();
  if(autoplayFirst !== false) playSceneLine(true);
}

function renderSceneLine(){
  const scene = SCENES[currentSceneIndex];
  const line = scene.lines[currentSceneLineIndex];
  document.getElementById('sceneLineEmoji').textContent = scene.emoji;
  const jpEl = document.getElementById('sceneLineJp');
  jpEl.textContent = line.jp;
  jpEl.style.animation = 'none';
  void jpEl.offsetWidth;
  jpEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';
  document.getElementById('sceneLineRomaji').textContent = line.romaji;
  document.getElementById('sceneLineKr').textContent = line.kr;
  renderSceneDots();
  updateSceneNavButtons();
}

function renderSceneDots(){
  const scene = SCENES[currentSceneIndex];
  const wrap = document.getElementById('sceneProgressDots');
  wrap.innerHTML = '';
  scene.lines.forEach((_, i)=>{
    const dot = document.createElement('div');
    dot.className = 'scene-dot' + (i < currentSceneLineIndex ? ' done' : '') + (i === currentSceneLineIndex ? ' current' : '');
    wrap.appendChild(dot);
  });
}

function updateSceneNavButtons(){
  const scene = SCENES[currentSceneIndex];
  document.getElementById('scenePrevBtn').disabled = currentSceneLineIndex === 0;
  document.getElementById('sceneNextBtn').disabled = currentSceneLineIndex === scene.lines.length - 1;
}

/* 실제 육아 루틴처럼 같은 문장을 천천히, 다정한 톤으로 두 번 반복해서 들려줍니다 */
function playSceneLine(autoAdvance){
  clearTimeout(sceneSpeakTimer);
  clearTimeout(sceneAutoplayTimer);
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const scene = SCENES[currentSceneIndex];
  const line = scene.lines[currentSceneLineIndex];
  const jpEl = document.getElementById('sceneLineJp');

  const speakOnce = (cb)=>{
    speakWithHighlight(line.jp, jpEl, { rate: 0.78, pitch: 1.1, onEnd: cb });
  };

  speakOnce(()=>{
    sceneSpeakTimer = setTimeout(()=>{
      speakOnce(()=>{
        if(autoAdvance && document.getElementById('sceneAutoplayToggle').checked){
          sceneAutoplayTimer = setTimeout(advanceSceneAuto, 1300);
        }
      });
    }, 500);
  });
}

function advanceSceneAuto(){
  const scene = SCENES[currentSceneIndex];
  if(currentSceneLineIndex < scene.lines.length - 1){
    currentSceneLineIndex++;
    renderSceneLine();
    playSceneLine(true);
  } else {
    // 한 장면이 끝나면 하루 일과처럼 자연스럽게 다음 장면으로 넘어감
    const nextIdx = (currentSceneIndex + 1) % SCENES.length;
    sceneAutoplayTimer = setTimeout(()=>{ selectScene(nextIdx, true); }, 1600);
  }
}

function nextSceneLine(){
  stopSceneAutoplay();
  const scene = SCENES[currentSceneIndex];
  if(currentSceneLineIndex < scene.lines.length - 1){
    currentSceneLineIndex++;
    renderSceneLine();
    playSceneLine(false);
  }
}

function prevSceneLine(){
  stopSceneAutoplay();
  if(currentSceneLineIndex > 0){
    currentSceneLineIndex--;
    renderSceneLine();
    playSceneLine(false);
  }
}

function stopSceneAutoplay(){
  clearTimeout(sceneAutoplayTimer);
  clearTimeout(sceneSpeakTimer);
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
}

/* 🔁 반복 노출(번역 없이) 학습 모드 로직
   그림/소리만 3번 먼저 들려주고, 사용자가 뜻을 유추해본 뒤에 정답을 공개합니다 */
let currentExposureWord = null;
let exposurePlayCount = 0;
const EXPOSURE_REQUIRED_PLAYS = 3;

function generateExposureQuestion(){
  const activeWords = getActiveWords();
  const randomIndex = Math.floor(Math.random() * activeWords.length);
  currentExposureWord = activeWords[randomIndex];
  exposurePlayCount = 0;

  const emojiEl = document.getElementById('exposureEmoji');
  emojiEl.innerHTML = emojiVisualHTML(currentExposureWord);
  emojiEl.style.animation = 'none';
  void emojiEl.offsetWidth;
  emojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';

  document.getElementById('exposureGuessArea').style.display = 'none';
  document.getElementById('exposureAnswerBox').style.display = 'none';
  document.getElementById('exposurePlayCount').textContent = '0';
  updateExposureDots();

  setTimeout(()=>{ playExposureAudio(); }, 300);
}

function updateExposureDots(){
  const dots = document.querySelectorAll('#exposureDots .exposure-dot');
  dots.forEach((d,i)=>{ d.classList.toggle('filled', i < exposurePlayCount); });
}

function playExposureAudio(){
  if(!currentExposureWord) return;

  speakTTS(currentExposureWord.jp);

  if(exposurePlayCount < EXPOSURE_REQUIRED_PLAYS){
    exposurePlayCount++;
    document.getElementById('exposurePlayCount').textContent = String(exposurePlayCount);
    updateExposureDots();

    if(exposurePlayCount >= EXPOSURE_REQUIRED_PLAYS){
      showExposureGuessOptions();
    }
  }
}

function showExposureGuessOptions(){
  const activeWords = getActiveWords();
  const correctWord = currentExposureWord;
  const choices = [correctWord];
  const pool = activeWords.filter(w => w.jp !== correctWord.jp);
  while(choices.length < 4 && pool.length > 0){
    const rIdx = Math.floor(Math.random() * pool.length);
    choices.push(pool.splice(rIdx, 1)[0]);
  }
  choices.sort(() => Math.random() - 0.5);

  const optionsContainer = document.getElementById('exposureOptions');
  optionsContainer.innerHTML = '';
  choices.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.dataset.jp = word.jp;
    btn.innerHTML = `<span>${word.kr}</span>`;
    btn.addEventListener('click', () => checkExposureGuess(btn, word));
    optionsContainer.appendChild(btn);
  });

  document.getElementById('exposureGuessArea').style.display = 'block';
}

function checkExposureGuess(selectedButton, word){
  const target = currentExposureWord;
  const allButtons = document.querySelectorAll('#exposureOptions .quiz-btn');
  allButtons.forEach(b => b.disabled = true);

  const isCorrect = word.jp === target.jp;
  if(isCorrect){
    selectedButton.classList.add('correct');
    playCorrectSound();
    celebrateCorrect(document.getElementById('exposureEmoji'), target);
    recordWordResult(target, true);
  } else {
    selectedButton.classList.add('wrong');
    playWrongSound();
    recordWordResult(target, false);
    allButtons.forEach(b => {
      if(b.dataset.jp === target.jp) b.classList.add('correct-hint');
    });
  }

  addLogChip(target);

  document.getElementById('exposureAnswerBox').style.display = 'block';
  document.getElementById('exposureJpHint').textContent = target.jp;
  document.getElementById('exposureKrHint').textContent = `${target.kr} (${target.romaji})`;

  setTimeout(()=>{ speakTTS(target.jp); }, 500);
  setTimeout(()=>{ generateExposureQuestion(); }, 2600);
}

/* 🎶 わらべうた 손동작 노래 모드 로직 — 짧은 전래동요 2~3곡을 손동작 힌트와 함께 따라 부릅니다 */


let currentSongIndex = null;
let songPlaybackTimer = null;

/* ✅ "목록 컨테이너를 비우고, 각 항목마다 카드 div를 만들어 채운 뒤 클릭 핸들러를 붙인다"
   패턴이 노래목록/가라오케목록/한자그리드 3곳에서 반복되어 9순위로 공용화했습니다.
   카드 내부 HTML과 클릭 시 열리는 화면만 각자 다르므로 그 두 가지만 인자로 받습니다 */
function renderCardList(containerId, items, cardClassName, buildInnerHTML, onCardClick){
  const containerEl = document.getElementById(containerId);
  if(!containerEl) return;
  containerEl.innerHTML = '';
  items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = cardClassName;
    card.innerHTML = buildInnerHTML(item);
    card.addEventListener('click', () => onCardClick(idx));
    containerEl.appendChild(card);
  });
}

function renderSongList(){
  renderCardList('songList', SONGS, 'song-card',
    song => `<div class="song-card-title">🎵 ${song.title}</div><div class="song-card-sub">${song.sub}</div>`,
    openSongDetail);
}

function openSongDetail(idx){
  stopSongPlayback();
  currentSongIndex = idx;
  const song = SONGS[idx];

  document.getElementById('songList').style.display = 'none';
  document.getElementById('songDetail').style.display = 'block';
  document.getElementById('songTitle').textContent = song.title;

  const lyricsEl = document.getElementById('songLyrics');
  lyricsEl.innerHTML = '';
  song.lines.forEach((line, lineIdx) => {
    const lineEl = document.createElement('div');
    lineEl.className = 'song-line';
    lineEl.id = `songLine_${lineIdx}`;
    lineEl.innerHTML = `<div class="song-line-jp">${line.jp}</div><div class="song-line-gesture">🤲 ${line.gesture}</div>`;
    lineEl.addEventListener('click', () => speakTTS(line.jp));
    lyricsEl.appendChild(lineEl);
  });
}

/* 상세/재생 화면을 닫고 목록으로 돌아가는 공통 처리.
   stopFn: 재생 중지 함수, listId/detailId: 목록·상세 엘리먼트 id,
   listDisplay: 목록을 다시 보일 때 쓸 display 값(flex/grid 등), resetFn: 추가 상태 초기화 */
function closeDetailView(stopFn, listId, detailId, listDisplay, resetFn){
  stopFn();
  const listEl = document.getElementById(listId);
  const detailEl = document.getElementById(detailId);
  if(listEl) listEl.style.display = listDisplay;
  if(detailEl) detailEl.style.display = 'none';
  if(resetFn) resetFn();
}

function closeSongDetail(){
  closeDetailView(stopSongPlayback, 'songList', 'songDetail', 'flex', () => { currentSongIndex = null; });
}

function playFullSong(){
  if(currentSongIndex === null) return;
  stopSongPlayback();
  const song = SONGS[currentSongIndex];
  let i = 0;

  function playNextLine(){
    document.querySelectorAll('.song-line').forEach(el => el.classList.remove('active-line'));
    if(i >= song.lines.length) return;
    const lineEl = document.getElementById(`songLine_${i}`);
    if(lineEl) lineEl.classList.add('active-line');
    speakTTS(song.lines[i].jp);
    i++;
    songPlaybackTimer = setTimeout(playNextLine, 2000);
  }
  playNextLine();
}

function stopSongPlayback(){
  if(songPlaybackTimer){ clearTimeout(songPlaybackTimer); songPlaybackTimer = null; }
  document.querySelectorAll('.song-line').forEach(el => el.classList.remove('active-line'));
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
}

/* 🎤🎶 동요 가라오케 모드 로직 —
   일본 엄마들이 36개월 전후 아이에게 실제로 불러주는 손유희·전래 동요(わらべうた) 20곡을
   노래방처럼 재생합니다. 가사를 그냥 읽어주는 게 아니라, 음절(모라) 하나하나를 그 음절에
   맞는 멜로디 음높이로 "노래"하듯 발음하고, 그 순간 피아노 반주음을 함께 울리며, 딱 그 글자를
   하이라이트합니다 — 목소리·피아노·하이라이트가 전부 같은 타이밍(음성 발화가 끝나는 순간)에
   맞물려 진행되므로 셋이 서로 어긋나지 않습니다.
   ※ 실제 작곡가·작사가가 있는 현대 동요(きらきら星, ぞうさん 등)의 가사는 저작권 보호를
   받을 수 있어 포함하지 않았고, 작자 미상의 오래된 전래 손유희 동요와 저작권이 만료된
   あめふり(1925년, 저작권 보호기간 만료)만 담았습니다. */


let currentKaraokeIndex = null;
let currentKaraokeLineIndex = 0;
let karaokeAutoplayTimer = null;
let karaokeIsPlaying = false;
let karaokePlaybackGen = 0;

function renderKaraokeList(){
  renderCardList('karaokeList', KARAOKE_SONGS, 'karaoke-card',
    song => `
      <div class="karaoke-card-emoji">${song.cover}</div>
      <div class="karaoke-card-title">${song.title}</div>
      <div class="karaoke-card-sub">${song.sub}</div>
    `,
    openKaraokeSong);
}


/* 👩 실제 일본 엄마가 부른 あめふり 원곡 mp3(참고용). 사용자가 제공한 파일을 그대로
   base64로 담아, 별도 파일 없이도 이 HTML 하나만으로 재생됩니다. 정확한 음절別 동기화는
   하지 않고(그러기엔 원본 실제 가창 타이밍을 추정해야 해서 부정확할 위험이 있음),
   아이가 "진짜 사람이 부르면 이런 느낌이구나"를 참고할 수 있도록 전체 재생/일시정지만 제공합니다. */
const AMEFURI_REAL_VOICE_SRC = "data:audio/mpeg;base64,SUQzAwAAAAAHdlRDT04AAAAGAAAAT3RoZXJHRU9CAAAAGQAAAAAAU2ZNYXJrZXJzAAwAAABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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U72qDRKVbf/jMMCrIxv+mb54jNm6o9Ffener1bejv6PvoqKj12VLPu7oieaxNUItpW5Hyohz02ZmM5ESzpUgJpMOmPz+DyWX8vS7sd+yd5aqff5I+N7uHdZiff+O8F/oKcckltu222wGhmQS1dbEytqy5fMZrsO/uc+HYawwambBPI4jXasshHcGvl51ZaWKtedKTo2uWF19GsxMrl+qpZSKSP/jIsCtGmqGnl5ghLUlPzzT6KhXiWHfc7mHyc1gmta3mUuedKFP2+dwW6/zavzxX9/e2Xa9BSdb6H6W0Fr5NJbbbbaWAETblxus3NjEBW9hkf5WbLK2FKlkUpBgI0ZjdWMGM2y/KCZmjf/jMMCfHGomkl5gxrVX+rVI/EgEeCobcoChIlqPGnlYFBVSCwcbh3USeePFQby51wSNZYJFXT06eXUaqBWqHYtfDIieDR5eHSPEqg6ABKV1ltstsskMUd/Na1zACx9DA6BUAsdZIrUX8xcrKlD1kkVFWaYZm/1FakVqZqVgOjqupS+bhRKGmQKJuUhl6sZ+yOVAJy/K2gEKzARl9f/jIsC8Gwligb5IxpAujJ0MVkf0foZ8qFCiWsjylqFavDAUSulhLEIdyx2GlHuiWB1wmEpHyxb////////////////////////////////////////////////////////////////////jMMCrHkMCTl5CBLj////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////jIsDBB4ACXAAAAAD///////////////////////////////////////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAP/jMMD/I8ACXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jIsD/FwACXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRBRwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM";

function toggleKaraokeRealVoice(){
  const audio = document.getElementById('karaokeRealVoiceAudio');
  const btn = document.getElementById('karaokeRealVoiceBtn');
  if(!audio || !btn) return;
  if(!audio.src){
    audio.src = AMEFURI_REAL_VOICE_SRC;
    audio.addEventListener('ended', () => { btn.textContent = '👩 실제 노래 참고로 듣기'; });
    audio.addEventListener('pause', () => { btn.textContent = '👩 실제 노래 참고로 듣기'; });
  }
  if(audio.paused){
    stopKaraokePlayback();
    audio.play().catch(()=>{});
    btn.textContent = '⏸ 일시정지';
  } else {
    audio.pause();
  }
}

function openKaraokeSong(idx){
  stopKaraokePlayback();
  getAudioContext();
  currentKaraokeIndex = idx;
  currentKaraokeLineIndex = 0;
  const song = KARAOKE_SONGS[idx];

  document.getElementById('karaokeList').style.display = 'none';
  document.getElementById('karaokePlayer').style.display = 'block';
  document.getElementById('karaokeTitle').textContent = song.title;
  document.getElementById('karaokeStageEmoji').textContent = song.cover;
  document.getElementById('karaokeEndMsg').style.display = 'none';

  const realVoiceBtn = document.getElementById('karaokeRealVoiceBtn');
  if(realVoiceBtn) realVoiceBtn.style.display = song.realVoiceSrc ? 'inline-block' : 'none';

  renderKaraokeLyrics();
  renderKaraokeDots();
}

function closeKaraokeSong(){
  closeDetailView(stopKaraokePlayback, 'karaokeList', 'karaokePlayer', 'grid', () => {
    currentKaraokeIndex = null;
    currentKaraokeLineIndex = 0;
  });
}

function renderKaraokeLyrics(){
  if(currentKaraokeIndex === null) return;
  const song = KARAOKE_SONGS[currentKaraokeIndex];
  const box = document.getElementById('karaokeLyricsBox');
  box.innerHTML = '';
  song.lines.forEach((line, i) => {
    const lineEl = document.createElement('div');
    lineEl.className = 'karaoke-line';
    lineEl.id = `karaokeLine_${i}`;
    lineEl.textContent = line.jp;
    lineEl.addEventListener('click', () => {
      stopKaraokePlayback();
      currentKaraokeLineIndex = i;
      playKaraokeLine(i, false);
    });
    box.appendChild(lineEl);
  });
}

function renderKaraokeDots(){
  if(currentKaraokeIndex === null) return;
  const song = KARAOKE_SONGS[currentKaraokeIndex];
  const dotsEl = document.getElementById('karaokeProgressDots');
  dotsEl.innerHTML = '';
  song.lines.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'scene-dot';
    if(i < currentKaraokeLineIndex) dot.classList.add('done');
    if(i === currentKaraokeLineIndex) dot.classList.add('current');
    dotsEl.appendChild(dot);
  });
}

/* 🎵 반주 멜로디용 5음 음계(펜타토닉, 도레미솔라 2옥타브) — 어떤 음을 골라 이어붙여도
   불협화음 없이 항상 동요처럼 들리도록 다장조 펜타토닉만 사용합니다 */


/* 🎼 노래 20곡의 소절별 멜로디 — 각 소절마다 음높이와 박자를 직접 작곡해 넣었습니다.
   형식: [음계 인덱스(KARAOKE_SCALE), 박자 길이] 쌍의 배열.
   박자 길이 단위: 1=짧게(8분음표 느낌) 2=보통(4분음표) 3=길게(점4분음표, 소절 중간의 숨쉬기)
   4=아주 길게(마디 끝 종지음, 노래처럼 딱 멈춰서 여운을 줌).
   같은 가사가 반복되는 소절(예: げんこつ山의 "また あした", かごめかごめ의 되풀이 등)은
   실제 동요처럼 같은 소절 끝에서는 안정적으로 '도'로 돌아오도록(종지) 설계했습니다. */


/* 데이터가 없는 소절을 위한 안전한 대체 멜로디(항상 도-미-솔로 자연스럽게) */
function fallbackMelodyLine(charCount){
  const shape = [0,2,3,2,4];
  const noteCount = Math.max(2, Math.min(shape.length, Math.ceil(charCount / 1.5)));
  const line = [];
  for(let i=0;i<noteCount;i++) line.push([shape[i % shape.length], i === noteCount-1 ? 3 : 2]);
  return line;
}

/* 노래 번호·소절 번호로 미리 작곡해 둔 멜로디를 가져옵니다(재생할 때마다 바뀌지 않음) */
function getKaraokeMelodyForLine(songIdx, lineIdx, charCount){
  const song = KARAOKE_MELODIES[songIdx];
  const line = song && song[lineIdx];
  return line || fallbackMelodyLine(charCount);
}

/* 🎶 소절 하나가 불리는 동안(대략적인 소요 시간) 그 소절에 작곡된 음높이·박자 그대로 연주합니다.
   실제 발음 속도(rate)와 글자 수로 소절 길이를 추정하므로, 가사가 빠르면 반주도 빠르게,
   느리게 부르면 반주도 느리게 자연스럽게 맞춰지되, 음마다 지정된 박자 비율(짧은음/긴음)은
   그대로 유지되어 진짜 동요처럼 리듬감이 살아납니다. */
/* 실제로 음표들을 스케줄링해서 재생하는 내부 함수. ctx.currentTime을 기준으로 시간을 잡으므로,
   반드시 오디오 컨텍스트가 'running' 상태가 된 "직후"에 호출해야 소리가 씹히지 않습니다. */
/* 🎼 잔향(리버브)용 임펄스 응답을 코드로 직접 생성합니다(외부 오디오 파일 불필요).
   짧게 감쇠하는 노이즈 버퍼를 컨볼버에 물리면 "방 안에서 울리는" 자연스러운 여운이 생겨서
   기존의 뚝뚝 끊기던 단발음이 오르골처럼 부드럽게 이어집니다. AudioContext당 한 번만 만들어 재사용합니다. */
const karaokeReverbCache = new WeakMap();
function getKaraokeReverbNode(ctx){
  if(karaokeReverbCache.has(ctx)) return karaokeReverbCache.get(ctx);
  const duration = 1.1, decay = 2.8;
  const length = Math.floor(ctx.sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for(let ch = 0; ch < 2; ch++){
    const data = impulse.getChannelData(ch);
    for(let i = 0; i < length; i++){
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  const wetGain = ctx.createGain();
  wetGain.gain.value = 0.16;
  convolver.connect(wetGain);
  wetGain.connect(ctx.destination);
  karaokeReverbCache.set(ctx, convolver);
  return convolver;
}

/* 🎹 음 하나를 "피아노" 톤으로 재생합니다.
   기본음을 살짝 어긋나게(디튠) 2개 겹쳐 피아노 특유의 현 울림(코러스감)을 내고,
   배음마다 감쇠 속도를 다르게(고음 배음일수록 빨리 잦아듦) 줘서 실제 피아노처럼
   "쨍하게 시작해 은은하게 여운이 남는" 소리가 나도록 합니다. */
function playKaraokePianoNote(ctx, freq, t0, noteLen, convolver){
  const velocity = 0.85 + Math.random() * 0.15;
  const partials = [
    { mult: 1,    gain: 0.5,   decay: 1.0,  detune: -3 },
    { mult: 1,    gain: 0.5,   decay: 1.0,  detune: 3 },
    { mult: 2,    gain: 0.20,  decay: 0.7 },
    { mult: 3.01, gain: 0.10,  decay: 0.5 },
    { mult: 4.02, gain: 0.055, decay: 0.38 },
    { mult: 5.04, gain: 0.03,  decay: 0.28 }
  ];
  const attack = 0.006;
  const busGain = ctx.createGain();
  busGain.gain.value = 1;
  busGain.connect(ctx.destination);
  busGain.connect(convolver);

  partials.forEach(p => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * p.mult, t0);
    if(p.detune) osc.detune.setValueAtTime(p.detune, t0);
    const pGain = ctx.createGain();
    const peak = p.gain * velocity;
    const decayTime = Math.max(0.2, noteLen * p.decay + 0.35);
    pGain.gain.setValueAtTime(0.0001, t0);
    pGain.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    pGain.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decayTime);
    osc.connect(pGain);
    pGain.connect(busGain);
    osc.start(t0);
    osc.stop(t0 + attack + decayTime + 0.05);
  });
}

/* 지정한 음계 인덱스(scaleIdx)의 피아노 음을 "지금" 한 번, noteLenSec 길이만큼 울립니다.
   noteLenSec은 아래 computeKaraokeSchedule이 악보의 실제 음표 길이(units) 비율 그대로
   계산해 넘겨주므로, 점4분음표처럼 긴 음은 실제로 길게 울리고 16분음표처럼 짧은 음은
   짧게 끊어집니다 — 모든 음이 똑같이 짧게 재생되던 문제를 근본적으로 해결합니다. */
function playKaraokePianoForScale(scaleIdx, noteLenSec){
  const toggle = document.getElementById('karaokeChimeToggle');
  if(toggle && !toggle.checked) return;
  try {
    const ctx = getAudioContext();
    const freq = KARAOKE_SCALE[Math.max(0, Math.min(KARAOKE_SCALE.length - 1, scaleIdx))];
    const noteLen = Math.max(0.16, Math.min((noteLenSec || 0.3) * 0.92, 1.8));
    const play = () => {
      const convolver = getKaraokeReverbNode(ctx);
      playKaraokePianoNote(ctx, freq, ctx.currentTime + 0.02, noteLen, convolver);
    };
    if(ctx.state !== 'running'){
      ctx.resume().then(play).catch((e) => console.log("AudioContext resume failed", e));
    } else {
      play();
    }
  } catch(e) {
    console.log("Karaoke piano note error", e);
  }
}



const KARAOKE_BURST_KANA = new Set(['か','が','き','ぎ','く','ぐ','け','げ','こ','ご','さ','ざ','し','じ','す','ず','せ','ぜ','そ','ぞ','た','だ','ち','ぢ','つ','づ','て','で','と','ど','は','ば','ぱ','ひ','び','ぴ','ふ','ぶ','ぷ','へ','べ','ぺ','ほ','ぼ','ぽ','カ','ガ','キ','ギ','ク','グ','ケ','ゲ','コ','ゴ','サ','ザ','シ','ジ','ス','ズ','セ','ゼ','ソ','ゾ','タ','ダ','チ','ヂ','ツ','ヅ','テ','デ','ト','ド','ハ','バ','パ','ヒ','ビ','ピ','フ','ブ','プ','ヘ','ベ','ペ','ホ','ボ','ポ']);

/* 🎤 "읽어주기"가 아니라 진짜 "노래 부르기"를 만드는 사람 목소리 합성 엔진.
   브라우저 TTS(speechSynthesis)는 음절마다 새로 문장을 시작해서 발화 엔진이 매번
   처음부터 다시 준비하다 보니 소리가 뚝뚝 끊기고 "읽는" 느낌이 났습니다.
   대신 여기서는 실제 사람 목소리처럼 모음(아/이/우/에/오)을 포먼트(공명 주파수) 필터로
   만들어서, 음표의 정확한 음높이·길이 그대로 "아~" 하고 붙잡아 부르듯 이어지게 합니다.
   음과 음 사이는 짧게 미끄러지듯(포르타멘토) 이어붙여 사람이 실제로 노래할 때처럼
   자연스럽게 연결됩니다. */

const karaokeSingingState = new WeakMap();
function getKaraokeVowelInfo(text, prevVowel){
  const chars = Array.from(text || '');
  if(chars.length === 0) return { vowel: prevVowel || 'a', burst: false, sokuonOnly: false };
  const last = chars[chars.length - 1];
  if(last === 'ー') return { vowel: prevVowel || 'a', burst: false, sokuonOnly: false };
  if(chars.length >= 2){
    const combo = chars[chars.length - 2] + last;
    if(last === 'ゃ' || last === 'ゅ' || last === 'ょ'){
      const v = last === 'ゃ' ? 'a' : (last === 'ゅ' ? 'u' : 'o');
      const firstCh = chars[0];
      return { vowel: v, burst: KARAOKE_BURST_KANA.has(firstCh), sokuonOnly: false };
    }
  }
  if(last === 'っ' || last === 'ッ'){
    if(chars.length === 1) return { vowel: prevVowel || 'a', burst: true, sokuonOnly: true };
  }
  const v = KARAOKE_KANA_VOWEL[last];
  if(v === undefined || v === null){
    return { vowel: prevVowel || 'a', burst: false, sokuonOnly: false };
  }
  const firstCh = chars[0];
  return { vowel: v, burst: KARAOKE_BURST_KANA.has(firstCh), sokuonOnly: false };
}
/* 실제로 모음을 "노래"하는 소리를 만듭니다: 톱니파(성대 떨림과 비슷한 배음 구조)를
   포먼트 대역통과 필터 3개에 통과시켜 사람 목소리 같은 "아/이/우/에/오" 색깔을 내고,
   살짝 비브라토(떨림)와 음 시작 부분의 자연스러운 목소리 흔들림(지터)을 더해
   기계음이 아니라 실제로 부르는 소리처럼 들리게 합니다. */
function playKaraokeSingSyllable(ctx, freq, info, t0, durSec, convolver, prevFreq){
  const dur = Math.max(0.12, durSec);
  const vowel = info.vowel;
  const formants = KARAOKE_VOWEL_FORMANTS[vowel] || KARAOKE_VOWEL_FORMANTS.a;

  const src = ctx.createOscillator();
  src.type = 'sawtooth';
  const glideFrom = (prevFreq && !info.sokuonOnly) ? prevFreq : freq;
  src.frequency.setValueAtTime(Math.max(80, glideFrom), t0);
  src.frequency.linearRampToValueAtTime(freq, t0 + Math.min(0.06, dur * 0.3));

  // 비브라토: 사람이 노래할 때 음을 살짝 떨듯이
  const vibrato = ctx.createOscillator();
  vibrato.type = 'sine';
  vibrato.frequency.value = 5.5;
  const vibratoGain = ctx.createGain();
  vibratoGain.gain.value = freq * 0.012;
  vibrato.connect(vibratoGain);
  vibratoGain.connect(src.frequency);
  vibrato.start(t0);
  vibrato.stop(t0 + dur + 0.05);

  const master = ctx.createGain();
  const attack = info.sokuonOnly ? 0.005 : Math.min(0.035, dur * 0.25);
  const release = Math.min(0.09, dur * 0.35);
  const peak = info.sokuonOnly ? 0.05 : 0.22;
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.linearRampToValueAtTime(peak, t0 + attack);
  master.gain.setValueAtTime(peak, t0 + Math.max(attack, dur - release));
  master.gain.linearRampToValueAtTime(0.0001, t0 + dur);

  formants.forEach(([f, gain, q]) => {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = f;
    bp.Q.value = Math.max(1, q / 20);
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(bp);
    bp.connect(g);
    g.connect(master);
  });

  master.connect(ctx.destination);
  if(convolver) master.connect(convolver);

  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

/* 🈂️ 가사를 "모라(음절)" 단위로 쪼갭니다. 작은 ゃゅょ(요음)는 앞 글자와 합쳐 한 음절로 묶고,
   공백은 다음 음절 앞에 붙여둡니다. 음표 개수(noteCount)보다 음절이 많으면 음표 개수만큼
   균등하게 묶어(예: 12음절을 8음표에 나누면 4곳은 음절 2개, 4곳은 1개) 모든 음표에 가사가
   골고루 배분되도록 합니다. 반환된 각 조각의 startIdx~endIdx는 renderKaraokeLyrics가 만든
   글자별 span의 인덱스와 그대로 대응해서, 노래하는 음절과 하이라이트되는 글자가 항상 일치합니다. */
function tokenizeKaraokeMora(text, noteCount){
  const rawChars = Array.from(text);
  const youon = new Set(['ゃ','ゅ','ょ','ャ','ュ','ョ']);
  const morae = [];
  let pendingSpace = '';
  let pendingStart = null;
  for(let i = 0; i < rawChars.length; i++){
    const c = rawChars[i];
    if(c === ' ' || c === '　'){
      pendingSpace += c;
      if(pendingStart === null) pendingStart = i;
      continue;
    }
    if(youon.has(c) && morae.length > 0){
      const prev = morae[morae.length - 1];
      prev.text += c;
      prev.endIdx = i;
      continue;
    }
    const startIdx = pendingStart !== null ? pendingStart : i;
    morae.push({ text: pendingSpace + c, startIdx, endIdx: i });
    pendingSpace = '';
    pendingStart = null;
  }
  if(pendingSpace && morae.length){
    morae[morae.length - 1].text += pendingSpace;
    morae[morae.length - 1].endIdx = rawChars.length - 1;
  }
  const n = morae.length;
  if(n === 0) return [];
  if(n <= noteCount){
    return morae.map(m => ({ text: m.text, startIdx: m.startIdx, endIdx: m.endIdx }));
  }
  const groups = [];
  for(let g = 0; g < noteCount; g++){
    const start = Math.floor(g * n / noteCount);
    const end = Math.floor((g + 1) * n / noteCount);
    const slice = morae.slice(start, end);
    if(slice.length === 0) continue;
    groups.push({
      text: slice.map(m => m.text).join(''),
      startIdx: slice[0].startIdx,
      endIdx: slice[slice.length - 1].endIdx
    });
  }
  return groups;
}

/* 음계 인덱스 → 도(C4) 기준 반음 거리. 목소리 피치를 음높이만큼 실제로 흔들어서
   "가사를 읽어주는" 게 아니라 "음높이가 있는 노래"로 들리게 하는 핵심 매핑입니다. */

function karaokePitchForScaleIdx(scaleIdx, basePitch){
  const semitone = KARAOKE_SEMITONES[scaleIdx] !== undefined ? KARAOKE_SEMITONES[scaleIdx] : 4;
  const pitch = basePitch + (semitone - 4) * 0.032;
  return Math.max(0.3, Math.min(2, pitch));
}

/* 🎼 소절 하나의 음표 배열(units)을 실제 "길이(초)"로 환산합니다. 악보의 음표 길이 단위(units)
   비율을 그대로 유지한 채, 소절 전체 길이를 글자 수·발화 속도로 추정한 총 시간에 맞춰
   나눠주므로 — 점4분음표(6)는 16분음표(1)보다 실제로 6배 오래 붙잡히고, 종지음(마지막 긴 음)은
   확실히 늘어져서 "노래를 마무리 짓는" 여운이 남습니다. */
function computeKaraokeSchedule(text, rate, notePairs){
  const charCount = Array.from(text.replace(/[ 　!！]/g, '')).length || 1;
  const msPerChar = Math.max(110, 230 / (rate || 0.7));
  const durationSec = Math.max(0.7, (charCount * msPerChar) / 1000);
  const totalUnits = notePairs.reduce((sum, n) => sum + n[1], 0) || 1;
  const secPerUnit = durationSec / totalUnits;
  return notePairs.map(([scaleIdx, units]) => ({
    scaleIdx,
    units,
    ms: Math.max(190, units * secPerUnit * 1000)
  }));
}

/* 🎵 긴 음(점4분음표·종지음 등)일수록 모음을 장음 부호(ー)로 늘려서 발음 자체가
   그 음표 길이만큼 길게 늘어지도록 합니다. 실제로 동요를 부를 때 긴 음을 "라~"처럼
   모음을 끌어서 부르는 것과 같은 원리입니다. 음표가 짧으면(1~2단위) 원래 글자 그대로 둡니다. */
function elongateForSinging(text, units){
  const extra = units >= 6 ? 2 : units >= 4 ? 1 : 0;
  if(extra <= 0) return text;
  return text + 'ー'.repeat(extra);
}

/* 🎤 음절을 하나씩 "노래"합니다. 각 음절마다:
   1) 해당 글자 구간을 하이라이트하고,
   2) 그 음표의 실제 길이(schedule의 ms)만큼 피아노 반주를 울리고,
   3) 그 음표의 음높이로 목소리 피치를 바꿔, 긴 음이면 장음 부호로 늘려서 발음합니다.
   다음 음절로의 진행은 음성 발화가 끝나기를 기다리지 않고(브라우저별로 발화 시간이 들쭉날쭉해
   싱크가 어긋났던 원인) 악보에서 계산한 그 음표의 실제 길이(schedule ms)만큼만 정확히
   기다렸다가 진행합니다 — 그래서 모든 음이 짧게 끊기지 않고 악보의 리듬 그대로 흘러갑니다. */
function playKaraokeToken(gen, tokens, schedule, tokenIdx, spans, rate, pitchBase, onLineDone, sungState){
  if(gen !== karaokePlaybackGen) return;
  if(tokenIdx >= tokens.length){ onLineDone(); return; }

  const token = tokens[tokenIdx];
  const step = schedule[tokenIdx] || { scaleIdx: 2, units: 2, ms: 220 };
  const noteLenSec = step.ms / 1000;

  spans.forEach((s, i) => {
    s.classList.toggle('tts-char-done', i < token.startIdx);
    s.classList.toggle('tts-char-active', i >= token.startIdx && i <= token.endIdx);
  });

  if(sungState){
    /* 🎵 あめふり처럼 "진짜 노래"로 설정된 곡은 브라우저 TTS 대신, 악보 그대로의
       음높이·길이로 모음을 붙잡아 부르는 사람 목소리 합성 엔진을 사용합니다.
       음표마다 새로 "읽기"를 시작하지 않고 이전 음에서 미끄러지듯(포르타멘토) 이어지므로
       끊기지 않고 실제로 노래 부르는 것처럼 들립니다. */
    try {
      const ctx = getAudioContext();
      const play = () => {
        const freq = KARAOKE_SCALE[Math.max(0, Math.min(KARAOKE_SCALE.length - 1, step.scaleIdx))];
        const convolver = getKaraokeReverbNode(ctx);
        const info = getKaraokeVowelInfo(token.text, sungState.prevVowel);
        const t0 = ctx.currentTime + 0.02;
        playKaraokeSingSyllable(ctx, freq, info, t0, noteLenSec * 0.95, convolver, sungState.prevFreq);
        sungState.prevVowel = info.vowel;
        sungState.prevFreq = freq;
      };
      if(ctx.state !== 'running'){ ctx.resume().then(play).catch(()=>{}); } else { play(); }
    } catch(e) { console.log("Karaoke singing voice error", e); }
    playKaraokePianoForScale(step.scaleIdx, noteLenSec);
  } else {
    playKaraokePianoForScale(step.scaleIdx, noteLenSec);
    if('speechSynthesis' in window && token.text.trim()){
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(elongateForSinging(token.text, step.units));
      utter.lang = 'ja-JP';
      utter.rate = rate;
      utter.pitch = karaokePitchForScaleIdx(step.scaleIdx, pitchBase);
      window.speechSynthesis.speak(utter);
    }
  }

  karaokeAutoplayTimer = setTimeout(() => {
    if(gen !== karaokePlaybackGen) return;
    playKaraokeToken(gen, tokens, schedule, tokenIdx + 1, spans, rate, pitchBase, onLineDone, sungState);
  }, step.ms);
}

function playKaraokeLine(i, continueAfter){
  if(currentKaraokeIndex === null) return;
  const song = KARAOKE_SONGS[currentKaraokeIndex];
  if(i >= song.lines.length){
    karaokeIsPlaying = false;
    document.getElementById('karaokeEndMsg').style.display = 'block';
    return;
  }
  const gen = ++karaokePlaybackGen;
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  clearTimeout(karaokeAutoplayTimer);
  document.getElementById('karaokeEndMsg').style.display = 'none';

  document.querySelectorAll('.karaoke-line').forEach((el, idx) => {
    el.classList.toggle('active-line', idx === i);
    el.classList.toggle('done-line', idx < i);
  });
  const lineEl = document.getElementById(`karaokeLine_${i}`);
  if(lineEl) lineEl.scrollIntoView({block:'nearest', behavior:'smooth'});

  const stageEmoji = document.getElementById('karaokeStageEmoji');
  stageEmoji.textContent = song.lines[i].emoji;
  stageEmoji.classList.remove('pop');
  void stageEmoji.offsetWidth;
  stageEmoji.classList.add('pop');

  currentKaraokeLineIndex = i;
  renderKaraokeDots();

  const text = song.lines[i].jp;
  const chars = Array.from(text);
  if(lineEl){
    lineEl.innerHTML = chars.map(c => `<span class="tts-char">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  }
  const spans = lineEl ? lineEl.querySelectorAll('.tts-char') : [];

  const charCount = Array.from(text.replace(/[ 　!！]/g, '')).length || 1;
  const notePairs = getKaraokeMelodyForLine(currentKaraokeIndex, i, charCount);
  const tokens = tokenizeKaraokeMora(text, notePairs.length);

  const speakRate = babyTalkMode ? 0.55 : 0.7;
  const pitchBase = babyTalkMode ? 1.35 : 1.15;
  const schedule = computeKaraokeSchedule(text, speakRate, notePairs);

  getAudioContext();

  const sungState = song.sung ? { prevVowel: 'a', prevFreq: null } : null;

  playKaraokeToken(gen, tokens, schedule, 0, spans, speakRate, pitchBase, () => {
    if(gen !== karaokePlaybackGen) return;
    if(!continueAfter) return;
    const toggle = document.getElementById('karaokeAutoplayToggle');
    if(!toggle || !toggle.checked){ karaokeIsPlaying = false; return; }
    karaokeAutoplayTimer = setTimeout(() => {
      playKaraokeLine(i + 1, true);
    }, 650);
  }, sungState);
}

function playKaraokeSong(){
  if(currentKaraokeIndex === null) return;
  getAudioContext();
  stopKaraokePlayback();
  karaokeIsPlaying = true;
  playKaraokeLine(0, true);
}

/* 자동재생 타이머와 진행 중인 음성 합성을 멈춥니다 (다음/이전 줄 이동 전 공통 처리) */
function karaokeStopAutoAndSpeech(){
  clearTimeout(karaokeAutoplayTimer);
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function nextKaraokeLine(){
  if(currentKaraokeIndex === null) return;
  karaokeStopAutoAndSpeech();
  const song = KARAOKE_SONGS[currentKaraokeIndex];
  const next = Math.min(currentKaraokeLineIndex + 1, song.lines.length - 1);
  playKaraokeLine(next, karaokeIsPlaying);
}

function prevKaraokeLine(){
  if(currentKaraokeIndex === null) return;
  karaokeStopAutoAndSpeech();
  const prev = Math.max(currentKaraokeLineIndex - 1, 0);
  playKaraokeLine(prev, karaokeIsPlaying);
}

function stopKaraokePlayback(){
  karaokeIsPlaying = false;
  karaokePlaybackGen++;
  clearTimeout(karaokeAutoplayTimer);
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  const realAudio = document.getElementById('karaokeRealVoiceAudio');
  if(realAudio && !realAudio.paused) realAudio.pause();
  document.querySelectorAll('.karaoke-line').forEach(el => el.classList.remove('active-line', 'done-line'));
}

/* 📖 동화책 읽어주기 리더 엔진 — 엄마 목소리 동화책(storybook)과 이모지 과일 동화책
   (emojiStorybook)이 거의 동일한 "책장 → 페이지 넘기며 낭독" 구조를 공유하므로,
   createStorybookReader(cfg) 팩토리로 공통화하고 각 게임은 데이터셋/DOM id/
   말투 전환 여부만 cfg로 분리합니다. */
function createStorybookReader(cfg){
  let bookIndex = null;
  let pageIndex = 0;
  let autoplayTimer = null;

  function el(key){ return document.getElementById(cfg.ids[key]); }

  function getPageText(page){
    return cfg.getPageText ? cfg.getPageText(page) : { jp: page.jp, romaji: page.romaji };
  }

  function init(){
    close();
    renderShelf();
  }

  function renderShelf(){
    const shelf = el('shelf');
    if(!shelf) return;
    shelf.innerHTML = '';
    cfg.books.forEach((book, idx) => {
      const card = document.createElement('div');
      card.className = 'storybook-cover-card';
      card.innerHTML = `
        <div class="storybook-cover-emoji">${book.cover}</div>
        <div class="storybook-cover-title">${book.title}</div>
        <div class="storybook-cover-sub">${book.sub}</div>
      `;
      card.addEventListener('click', () => open(idx));
      shelf.appendChild(card);
    });
  }

  function open(idx){
    stopAutoplay();
    bookIndex = idx;
    pageIndex = 0;
    el('shelf').style.display = 'none';
    el('reader').style.display = 'block';
    el('readerTitle').textContent = cfg.books[idx].title;
    renderPage();
    playPage(true);
  }

  function close(){
    stopAutoplay();
    const shelf = el('shelf');
    const reader = el('reader');
    if(shelf) shelf.style.display = 'grid';
    if(reader) reader.style.display = 'none';
    bookIndex = null;
  }

  function renderPage(){
    if(bookIndex === null) return;
    const book = cfg.books[bookIndex];
    const page = book.pages[pageIndex];
    const text = getPageText(page);

    const emojiEl = el('pageEmoji');
    emojiEl.textContent = page.emoji;
    emojiEl.style.animation = 'none';
    void emojiEl.offsetWidth;
    emojiEl.style.animation = 'quizAppear .4s cubic-bezier(.175, .885, .32, 1.275)';

    // jp 텍스트는 speakWithHighlight가 낭독 시점에 글자별 span으로 다시 그려줍니다
    el('pageJp').textContent = text.jp;
    el('pageRomaji').textContent = text.romaji;
    const krEl = el('pageKr');
    krEl.textContent = page.kr;
    if(cfg.krVisible) krEl.style.display = cfg.krVisible() ? 'block' : 'none';

    el('prevBtn').disabled = (pageIndex === 0);
    el('endMsg').style.display = 'none';

    const dotsEl = el('progressDots');
    dotsEl.innerHTML = '';
    book.pages.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'scene-dot';
      if(i < pageIndex) dot.classList.add('done');
      if(i === pageIndex) dot.classList.add('current');
      dotsEl.appendChild(dot);
    });
  }

  function playPage(isAutoStart){
    if(bookIndex === null) return;
    const book = cfg.books[bookIndex];
    const page = book.pages[pageIndex];
    const text = getPageText(page);
    const jpEl = el('pageJp');

    clearTimeout(autoplayTimer);

    // 엄마가 아이에게 동화책을 읽어주는 느낌을 내기 위해 속도를 조금 더 느리고 다정한 톤으로 설정
    speakWithHighlight(text.jp, jpEl, {
      rate: babyTalkMode ? 0.55 : 0.68,
      pitch: babyTalkMode ? 1.3 : 1.15,
      onEnd: () => {
        const toggle = el('autoplayToggle');
        if(!toggle || !toggle.checked) return;
        const isLastPage = pageIndex >= book.pages.length - 1;
        if(!isLastPage){
          autoplayTimer = setTimeout(() => { autoAdvance(); }, 1400);
        } else {
          el('endMsg').style.display = 'block';
        }
      }
    });
  }

  function autoAdvance(){
    const book = cfg.books[bookIndex];
    if(pageIndex < book.pages.length - 1){
      pageIndex++;
      renderPage();
      playPage(true);
    }
  }

  function next(){
    stopAutoplay();
    const book = cfg.books[bookIndex];
    if(pageIndex < book.pages.length - 1){
      pageIndex++;
      renderPage();
      playPage(false);
    }
  }

  function prev(){
    stopAutoplay();
    if(pageIndex > 0){
      pageIndex--;
      renderPage();
      playPage(false);
    }
  }

  function stopAutoplay(){
    clearTimeout(autoplayTimer);
    if('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  return { init, renderShelf, open, close, renderPage, playPage, autoAdvance, next, prev, stopAutoplay };
}

const storybookReader = createStorybookReader({
  books: STORYBOOKS,
  ids: {
    shelf: 'storybookShelf', reader: 'storybookReader', readerTitle: 'storybookReaderTitle',
    pageEmoji: 'storybookPageEmoji', pageJp: 'storybookPageJp', pageRomaji: 'storybookPageRomaji',
    pageKr: 'storybookPageKr', prevBtn: 'storybookPrevBtn', endMsg: 'storybookEndMsg',
    progressDots: 'storybookProgressDots', autoplayToggle: 'storybookAutoplayToggle'
  }
});

function initStorybookMode(){ storybookReader.init(); }
function renderStorybookShelf(){ storybookReader.renderShelf(); }
function openStorybook(idx){ storybookReader.open(idx); }
function closeStorybookReader(){ storybookReader.close(); }
function renderStorybookPage(){ storybookReader.renderPage(); }
function playStorybookPage(isAutoStart){ storybookReader.playPage(isAutoStart); }
function autoAdvanceStorybookPage(){ storybookReader.autoAdvance(); }
function nextStorybookPage(){ storybookReader.next(); }
function prevStorybookPage(){ storybookReader.prev(); }
function stopStorybookAutoplay(){ storybookReader.stopAutoplay(); }

/* 🍎 이모지 동화책 로직 — 위 storybookReader와 동일한 엔진을 과일 10권 데이터에 그대로 적용합니다 */
let fruitStorybookKoreanVisible = true;
let fruitStorybookBabyTalkText = true; // true=아기말투 문장(jp/romaji), false=조사를 갖춘 문장(jpFormal/romajiFormal)

const emojiStorybookReader = createStorybookReader({
  books: FRUIT_STORYBOOKS,
  ids: {
    shelf: 'emojiStorybookShelf', reader: 'emojiStorybookReader', readerTitle: 'emojiStorybookReaderTitle',
    pageEmoji: 'emojiStorybookPageEmoji', pageJp: 'emojiStorybookPageJp', pageRomaji: 'emojiStorybookPageRomaji',
    pageKr: 'emojiStorybookPageKr', prevBtn: 'emojiStorybookPrevBtn', endMsg: 'emojiStorybookEndMsg',
    progressDots: 'emojiStorybookProgressDots', autoplayToggle: 'emojiStorybookAutoplayToggle'
  },
  getPageText: getEmojiStorybookPageText,
  krVisible: () => fruitStorybookKoreanVisible
});

function initEmojiStorybookMode(){ emojiStorybookReader.init(); }
function renderEmojiStorybookShelf(){ emojiStorybookReader.renderShelf(); }
function openEmojiStorybook(idx){ emojiStorybookReader.open(idx); }
function closeEmojiStorybookReader(){ emojiStorybookReader.close(); }
function getEmojiStorybookPageText(page){
  if(fruitStorybookBabyTalkText || !page.jpFormal){
    return { jp: page.jp, romaji: page.romaji };
  }
  return { jp: page.jpFormal, romaji: page.romajiFormal || page.romaji };
}
function renderEmojiStorybookPage(){ emojiStorybookReader.renderPage(); }
function playEmojiStorybookPage(isAutoStart){ emojiStorybookReader.playPage(isAutoStart); }
function autoAdvanceEmojiStorybookPage(){ emojiStorybookReader.autoAdvance(); }
function nextEmojiStorybookPage(){ emojiStorybookReader.next(); }
function prevEmojiStorybookPage(){ emojiStorybookReader.prev(); }
function stopEmojiStorybookAutoplay(){ emojiStorybookReader.stopAutoplay(); }

function toggleEmojiStorybookKorean(){
  const toggle = document.getElementById('emojiStorybookKoreanToggle');
  fruitStorybookKoreanVisible = toggle ? toggle.checked : true;
  const krEl = document.getElementById('emojiStorybookPageKr');
  if(krEl) krEl.style.display = fruitStorybookKoreanVisible ? 'block' : 'none';
}

function toggleEmojiStorybookBabyTalk(){
  const toggle = document.getElementById('emojiStorybookBabyTalkToggle');
  fruitStorybookBabyTalkText = toggle ? toggle.checked : true;
  emojiStorybookReader.stopAutoplay();
  emojiStorybookReader.renderPage();
}

/* 📚 전자책 읽기 — tadoku.org(NPO多言語多読)가 공개한 그림책 PDF 페이지 이미지를 넘겨보는 리더 */
let currentEbookIndex = null;

let currentEbookLevelFilter = '전체';

function getEbookLevels(){
  const levels = [];
  EBOOKS.forEach(book => { if(!levels.includes(book.level)) levels.push(book.level); });
  return levels;
}

function renderEbookLevelFilter(){
  const box = document.getElementById('ebookLevelFilter');
  if(!box) return;
  box.innerHTML = '';
  const levels = ['전체', ...getEbookLevels()];
  levels.forEach(level => {
    const btn = document.createElement('button');
    btn.className = 'ebook-level-btn' + (level === currentEbookLevelFilter ? ' active' : '');
    btn.textContent = level;
    btn.addEventListener('click', () => {
      currentEbookLevelFilter = level;
      renderEbookLevelFilter();
      renderEbookShelf();
    });
    box.appendChild(btn);
  });
}

function initEbookMode(){
  stopEbookAudio();
  closeEbookReader();
  renderEbookLevelFilter();
  renderEbookShelf();
}

function renderEbookShelf(){
  const shelf = document.getElementById('ebookShelf');
  if(!shelf) return;
  shelf.innerHTML = '';
  EBOOKS.forEach((book, idx) => {
    if(currentEbookLevelFilter !== '전체' && book.level !== currentEbookLevelFilter) return;
    const card = document.createElement('div');
    card.className = 'storybook-cover-card';
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" style="width:100%; border-radius:10px; margin-bottom:8px;">
      <div class="storybook-cover-title">${book.title}</div>
      <div class="storybook-cover-sub">${book.level} · ${book.desc}</div>
    `;
    card.addEventListener('click', () => openEbook(idx));
    shelf.appendChild(card);
  });
}

function openEbook(idx){
  stopEbookAudio();
  currentEbookIndex = idx;
  const book = EBOOKS[idx];
  document.getElementById('ebookShelf').style.display = 'none';
  document.getElementById('ebookReader').style.display = 'block';
  document.getElementById('ebookReaderTitle').textContent = book.title;

  document.getElementById('ebookPageImage').src = book.cover;
  document.getElementById('ebookPageImage').alt = book.title + ' 표지';
  document.getElementById('ebookLevelBadge').textContent = book.level;
  document.getElementById('ebookDesc').textContent = book.desc;

  const sourceLink = document.getElementById('ebookSourceLink');
  sourceLink.href = book.sourceUrl;

  const playBtn = document.getElementById('ebookPlayBtn');
  playBtn.textContent = '🔊 낭독 듣기';
  playBtn.disabled = !book.mp3;

  const audioEl = document.getElementById('ebookAudioEl');
  audioEl.src = book.mp3 || '';
  audioEl.onended = () => { playBtn.textContent = '🔊 낭독 듣기'; };

  const pdfBtn = document.getElementById('ebookPdfBtn');
  pdfBtn.textContent = '📄 PDF로 읽기';
  pdfBtn.disabled = !book.pdf;
  document.getElementById('ebookImageView').style.display = 'block';
  document.getElementById('ebookPdfView').style.display = 'none';
  document.getElementById('ebookPdfFrame').src = '';
  document.getElementById('ebookPdfDirectLink').href = book.pdf || '#';

  document.getElementById('ebookLicense').innerHTML =
    `${book.credit}<br>출처: <a href="${book.sourceUrl}" target="_blank" rel="noopener">tadoku.org（にほんごたどく）</a>　`
    + `라이선스: <a href="${book.licenseUrl}" target="_blank" rel="noopener">${book.license}</a>`;
}

function toggleEbookPdf(){
  if(currentEbookIndex === null) return;
  const book = EBOOKS[currentEbookIndex];
  if(!book.pdf) return;
  // 중간에 "열기" 링크를 한 번 더 누르게 하지 않고, 버튼 클릭 즉시
  // 새 탭을 열어 브라우저 기본 PDF 뷰어가 곧바로 전체 화면으로 표시되게 합니다.
  window.open(book.pdf, '_blank', 'noopener');
}

function closeEbookReader(){
  stopEbookAudio();
  const imageView = document.getElementById('ebookImageView');
  const pdfView = document.getElementById('ebookPdfView');
  const pdfFrame = document.getElementById('ebookPdfFrame');
  if(imageView) imageView.style.display = 'block';
  if(pdfView) pdfView.style.display = 'none';
  if(pdfFrame) pdfFrame.src = '';
  const shelf = document.getElementById('ebookShelf');
  const reader = document.getElementById('ebookReader');
  if(shelf) shelf.style.display = 'grid';
  if(reader) reader.style.display = 'none';
  currentEbookIndex = null;
}

const EBOOK_PLAY_LABEL = '🔊 낭독 듣기';

/* 이북 오디오 엘리먼트와 재생 버튼을 함께 가져오는 공통 처리 */
function ebookAudioEls(){
  return {
    audioEl: document.getElementById('ebookAudioEl'),
    playBtn: document.getElementById('ebookPlayBtn')
  };
}

function toggleEbookAudio(){
  if(currentEbookIndex === null) return;
  const { audioEl, playBtn } = ebookAudioEls();
  if(!audioEl.src) return;
  if(audioEl.paused){
    audioEl.play();
    playBtn.textContent = '⏸ 일시정지';
  } else {
    audioEl.pause();
    playBtn.textContent = EBOOK_PLAY_LABEL;
  }
}

function stopEbookAudio(){
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  const { audioEl, playBtn } = ebookAudioEls();
  if(audioEl){
    audioEl.pause();
    audioEl.currentTime = 0;
  }
  if(playBtn) playBtn.textContent = EBOOK_PLAY_LABEL;
}

/* 🗂️ 상위 메뉴 → 하위 메뉴 → 게임 전체화면 계층 내비게이션
   기존 switchMode()/탭 로직은 그대로 재사용하고, 그 위에 메뉴 단계와
   전체화면 표시만 새로 얹습니다. */
/* 🈴 초등 1학년 한자 플래시카드 데이터 — 큰 글씨(한자) + 그림(이모지) + 읽기 + 낱말 3개 */


let currentKanjiIndex = 0;
let kanjiCardFlipped = false;

function initKanjiCardsMode(){
  currentKanjiIndex = 0;
  kanjiCardFlipped = false;
  renderKanjiGrid();
  showKanjiGrid();
}

function renderKanjiGrid(){
  renderCardList('kcGrid', KANJI_CARDS, 'kc-tile',
    card => `
      <div class="kc-tile-char">${card.kanji}</div>
      <div class="kc-tile-reading">${card.reading}</div>
    `,
    openKanjiCard);
}

function showKanjiGrid(){
  document.getElementById('kcGridScreen').style.display = 'block';
  document.getElementById('kcCardScreen').style.display = 'none';
}

function openKanjiCard(idx){
  currentKanjiIndex = idx;
  kanjiCardFlipped = false;
  document.getElementById('kcGridScreen').style.display = 'none';
  document.getElementById('kcCardScreen').style.display = 'block';
  renderKanjiCard();
}

function renderKanjiCard(){
  const card = KANJI_CARDS[currentKanjiIndex];
  document.getElementById('kcProgress').textContent = `${currentKanjiIndex + 1} / ${KANJI_CARDS.length}`;
  document.getElementById('kcChar').textContent = card.kanji;
  document.getElementById('kcEmoji').textContent = card.emoji;
  document.getElementById('kcReading').textContent = card.reading;

  const wordsBox = document.getElementById('kcWords');
  wordsBox.innerHTML = '';
  card.words.forEach(w => {
    const wEl = document.createElement('div');
    wEl.className = 'kc-word';
    wEl.textContent = w;
    wordsBox.appendChild(wEl);
  });

  document.getElementById('kcCardFront').style.display = kanjiCardFlipped ? 'none' : 'flex';
  document.getElementById('kcCardBack').style.display = kanjiCardFlipped ? 'flex' : 'none';
}

function flipKanjiCard(){
  kanjiCardFlipped = !kanjiCardFlipped;
  renderKanjiCard();
}

function prevKanjiCard(){
  currentKanjiIndex = (currentKanjiIndex - 1 + KANJI_CARDS.length) % KANJI_CARDS.length;
  kanjiCardFlipped = false;
  renderKanjiCard();
}

function nextKanjiCard(){
  currentKanjiIndex = (currentKanjiIndex + 1) % KANJI_CARDS.length;
  kanjiCardFlipped = false;
  renderKanjiCard();
}

function speakCurrentKanjiCard(){
  const card = KANJI_CARDS[currentKanjiIndex];
  if(!card) return;

  // 카드가 뒤집혀 뒷면(읽기·낱말)이 보이는 상태라면, 낱말을 하나씩 순서대로 읽으면서
  // 해당 낱말 상자를 하이라이트합니다. 앞면이 보이는 상태라면 하이라이트할 곳이 없으므로 그냥 재생합니다.
  if(!kanjiCardFlipped){
    speakTTS(card.words.join('、'));
    return;
  }

  const wordEls = document.querySelectorAll('#kcWords .kc-word');
  const rate = babyTalkMode ? 0.6 : 0.85;
  const pitch = babyTalkMode ? 1.35 : 1.0;
  let i = 0;
  function playNext(){
    if(i >= wordEls.length || i >= card.words.length) return;
    const el = wordEls[i];
    const word = card.words[i];
    speakWithHighlight(word, el, {
      rate, pitch,
      onEnd: () => { i++; playNext(); }
    });
  }
  playNext();
}

/* 🌱🐘 형용사 배우기 게임 데이터 — ちびむすドリル 반의어 형용사 워크시트(ふとい・ほそい /
   ながい・みじかい / たかい・ひくい / おおい・すくない / おおきい・ちいさい) 기반.
   각 짝은 대표 예시(intro) + 비교 퀴즈용 낱말 목록(items) + (일부는) 분류 퀴즈(classify)를 가집니다.
   shapeType은 두 낱말을 시각적으로 비교해서 보여줄 모양의 종류를 정합니다. */


/* 🌱🐘 형용사 배우기 게임 전역 상태 */
let adjCurrentSet = null;      // 현재 고른 형용사 짝(ADJECTIVE_SETS의 한 원소)
let adjQuestions = [];         // 이번 판의 문제 순서(낱말 배열을 섞은 것)
let adjQIndex = 0;             // 현재 몇 번째 문제인지
let adjCurrentTarget = null;   // 이번 문제에서 찾아야 하는 쪽('A' 또는 'B')
let adjCorrectCount = 0;       // 비교 퀴즈에서 맞힌 개수
let adjClassifyWords = [];     // 분류 퀴즈용 낱말 순서
let adjClassifyIdx = 0;
let adjClassifyCorrect = 0;

/* 형용사 게임 목록(셸프) 화면을 그립니다 */
function initAdjectiveGame(){
  document.getElementById('adjShelfScreen').style.display = '';
  document.getElementById('adjPracticeScreen').style.display = 'none';
  const grid = document.getElementById('adjShelfGrid');
  grid.innerHTML = '';
  ADJECTIVE_SETS.forEach(set => {
    const card = document.createElement('div');
    card.className = 'adj-shelf-card';
    card.onclick = () => openAdjectiveSet(set.id);
    card.innerHTML = `
      <div class="adj-shelf-emoji">${set.emoji}</div>
      <div class="adj-shelf-title">${set.title}</div>
      <div class="adj-shelf-sub">${set.sub}</div>
    `;
    grid.appendChild(card);
  });
}

function backToAdjShelf(){
  window.speechSynthesis && window.speechSynthesis.cancel();
  document.getElementById('adjShelfScreen').style.display = '';
  document.getElementById('adjPracticeScreen').style.display = 'none';
}

/* 형용사 짝 하나를 골라 소개 화면을 보여줍니다 */
function openAdjectiveSet(setId){
  adjCurrentSet = ADJECTIVE_SETS.find(s => s.id === setId);
  if(!adjCurrentSet) return;
  document.getElementById('adjShelfScreen').style.display = 'none';
  document.getElementById('adjPracticeScreen').style.display = '';
  document.getElementById('adjHeaderTitle').textContent = `${adjCurrentSet.title} (${adjCurrentSet.sub})`;
  showAdjIntro();
}

function showAdjIntro(){
  const set = adjCurrentSet;
  document.getElementById('adjIntroScreen').style.display = '';
  document.getElementById('adjQuizScreen').style.display = 'none';
  document.getElementById('adjClassifyScreen').style.display = 'none';
  document.getElementById('adjResultScreen').style.display = 'none';
  document.getElementById('adjIntroEmoji').textContent = set.emoji;
  document.getElementById('adjIntroWord').textContent = `${set.intro.jp} (${set.intro.kr})`;
  document.getElementById('adjIntroDesc').textContent = `「${set.adjA.jp}(${set.adjA.kr})」와 「${set.adjB.jp}(${set.adjB.kr})」를 비교해서 배워봐요`;
  const shapesBox = document.getElementById('adjIntroShapes');
  shapesBox.innerHTML = `
    <div class="adj-intro-shape-col">
      ${renderAdjShape(set.shapeType, true)}
      <div class="adj-intro-shape-label">${set.adjA.jp}</div>
    </div>
    <div class="adj-intro-shape-col">
      ${renderAdjShape(set.shapeType, false)}
      <div class="adj-intro-shape-label">${set.adjB.jp}</div>
    </div>
  `;
}

function speakAdjIntro(){
  const set = adjCurrentSet;
  if(!set) return;
  speakTTS(`${set.intro.jp}が ${set.adjA.jp}。 ${set.intro.jp}が ${set.adjB.jp}。`);
}

/* 굵기/길이/높이/양/크기를 나타내는 모양 하나를 HTML 문자열로 만듭니다.
   isLarge가 true면 adjA(굵다/길다/높다/많다/크다) 쪽의 큰 모양을, false면 adjB 쪽의 작은 모양을 그립니다 */
function renderAdjShape(shapeType, isLarge){
  if(shapeType === 'thickness'){
    const w = isLarge ? 58 : 20;
    return `<div class="adj-shape-wrap" style="min-height:118px;"><div style="width:${w}px;height:108px;border-radius:10px;background:#8a5a35;"></div></div>`;
  }
  if(shapeType === 'length'){
    const w = isLarge ? 170 : 55;
    return `<div class="adj-shape-wrap" style="min-height:40px;align-items:center;"><div style="width:${w}px;height:22px;border-radius:12px;background:#5a8a3f;"></div></div>`;
  }
  if(shapeType === 'height'){
    const h = isLarge ? 160 : 55;
    return `<div class="adj-shape-wrap" style="min-height:170px;"><div style="width:48px;height:${h}px;border-radius:8px 8px 4px 4px;background:#4a6fa5;"></div></div>`;
  }
  if(shapeType === 'size'){
    const d = isLarge ? 120 : 46;
    return `<div class="adj-shape-wrap" style="min-height:130px;"><div style="width:${d}px;height:${d}px;border-radius:50%;background:#d94f4f;"></div></div>`;
  }
  if(shapeType === 'quantity'){
    const n = isLarge ? 9 : 2;
    let dots = '';
    for(let i=0;i<n;i++) dots += '<div class="adj-dot"></div>';
    return `<div class="adj-shape-wrap" style="min-height:106px;"><div class="adj-quantity-cup">${dots}</div></div>`;
  }
  return '';
}

/* 비교 퀴즈를 시작합니다: 낱말 목록을 섞어서 문제 순서를 정합니다 */
function startAdjectiveQuiz(){
  const set = adjCurrentSet;
  adjQuestions = [...set.items].sort(() => Math.random() - 0.5);
  adjQIndex = 0;
  adjCorrectCount = 0;
  document.getElementById('adjIntroScreen').style.display = 'none';
  document.getElementById('adjQuizScreen').style.display = '';
  renderAdjQuestion();
}

function renderAdjQuestion(){
  const set = adjCurrentSet;
  const item = adjQuestions[adjQIndex];
  document.getElementById('adjProgress').textContent = `문제 ${adjQIndex+1} / ${adjQuestions.length}`;
  document.getElementById('adjItemJp').textContent = `${item.jp} (${item.kr})`;
  // 이번 문제에서 찾아야 할 쪽(A 또는 B)을 무작위로 정해, 두 형용사를 골고루 연습합니다
  adjCurrentTarget = Math.random() < 0.5 ? 'A' : 'B';
  const targetAdj = adjCurrentTarget === 'A' ? set.adjA : set.adjB;
  document.getElementById('adjPrompt').textContent = `「${targetAdj.jp}(${targetAdj.kr})」 쪽은 어느 것일까요?`;
  document.getElementById('adjFeedback').textContent = '';
  document.getElementById('adjFeedback').className = 'adj-feedback';
  document.getElementById('adjRevealSentence').textContent = '';
  document.getElementById('adjNextBtn').style.display = 'none';

  // 왼쪽/오른쪽 중 어디에 A(큰 쪽)를 놓을지도 무작위로 정합니다
  const aIsLeft = Math.random() < 0.5;
  const row = document.getElementById('adjShapesRow');
  row.innerHTML = '';
  const sideOrder = aIsLeft ? ['A','B'] : ['B','A'];
  sideOrder.forEach(side => {
    const btn = document.createElement('button');
    btn.className = 'adj-shape-btn';
    btn.id = `adjShapeBtn-${side === adjCurrentTarget ? 'target' : 'other'}`;
    btn.setAttribute('data-side', side);
    btn.onclick = () => pickAdjSide(side, btn);
    btn.innerHTML = renderAdjShape(set.shapeType, side === 'A') + `<div class="adj-shape-tap-label">눌러서 고르기</div>`;
    row.appendChild(btn);
  });

  speakTTS(`${targetAdj.jp}の ほうは どっち？`);
}

function pickAdjSide(side, btnEl){
  if(document.getElementById('adjNextBtn').style.display !== 'none') return; // 이미 답한 문제
  const set = adjCurrentSet;
  const item = adjQuestions[adjQIndex];
  const correct = side === adjCurrentTarget;
  const wrap = btnEl.querySelector('.adj-shape-wrap');
  wrap.classList.add(correct ? 'adj-shape-correct' : 'adj-shape-wrong');
  // 정답이 아닌 쪽을 눌렀다면, 진짜 정답 쪽도 초록색으로 함께 표시해줍니다
  if(!correct){
    document.querySelectorAll('#adjShapesRow .adj-shape-btn').forEach(b => {
      if(b.getAttribute('data-side') === adjCurrentTarget){
        b.querySelector('.adj-shape-wrap').classList.add('adj-shape-correct');
      }
    });
  }
  document.querySelectorAll('#adjShapesRow .adj-shape-btn').forEach(b => b.disabled = true);

  const targetAdj = adjCurrentTarget === 'A' ? set.adjA : set.adjB;
  const fb = document.getElementById('adjFeedback');
  if(correct){
    adjCorrectCount++;
    fb.textContent = '정답이에요! 🎉';
    fb.className = 'adj-feedback adj-fb-correct';
  } else {
    fb.textContent = '다시 한 번 생각해봐요';
    fb.className = 'adj-feedback adj-fb-wrong';
  }
  const sentence = `${item.jp}が ${targetAdj.jp}`;
  document.getElementById('adjRevealSentence').textContent = sentence;
  speakTTS(sentence);
  document.getElementById('adjNextBtn').style.display = '';
}

function nextAdjQuestion(){
  adjQIndex++;
  if(adjQIndex < adjQuestions.length){
    renderAdjQuestion();
  } else if(adjCurrentSet.classify){
    startAdjClassify();
  } else {
    showAdjResult();
  }
}

/* おおい・すくない, おおきい・ちいさい 짝에만 있는 분류 퀴즈 */
function startAdjClassify(){
  const set = adjCurrentSet;
  adjClassifyWords = [...set.classify.words].sort(() => Math.random() - 0.5);
  adjClassifyIdx = 0;
  adjClassifyCorrect = 0;
  document.getElementById('adjQuizScreen').style.display = 'none';
  document.getElementById('adjClassifyScreen').style.display = '';
  document.getElementById('adjClassifyPrompt').textContent = set.classify.prompt;
  renderAdjClassify();
}

function renderAdjClassify(){
  const set = adjCurrentSet;
  const word = adjClassifyWords[adjClassifyIdx];
  document.getElementById('adjClassifyProgress').textContent = `분류 문제 ${adjClassifyIdx+1} / ${adjClassifyWords.length}`;
  document.getElementById('adjClassifyJp').textContent = word.jp;
  document.getElementById('adjClassifyKr').textContent = word.kr;
  document.getElementById('adjClassifyFeedback').textContent = '';
  document.getElementById('adjClassifyFeedback').className = 'adj-feedback';
  document.getElementById('adjClassifyNextBtn').style.display = 'none';

  const row = document.getElementById('adjClassifyBtnRow');
  row.innerHTML = '';
  [{side:'A', adj:set.adjA}, {side:'B', adj:set.adjB}].forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'adj-classify-btn';
    btn.setAttribute('data-side', opt.side);
    btn.textContent = `${opt.adj.jp} (${opt.adj.kr})`;
    btn.onclick = () => pickAdjClassify(opt.side, btn);
    row.appendChild(btn);
  });

  speakTTS(word.jp);
}

function pickAdjClassify(side, btnEl){
  if(document.getElementById('adjClassifyNextBtn').style.display !== 'none') return;
  const word = adjClassifyWords[adjClassifyIdx];
  const correct = side === word.answer;
  btnEl.classList.add(correct ? 'adj-classify-correct' : 'adj-classify-wrong');
  if(!correct){
    document.querySelectorAll('#adjClassifyBtnRow .adj-classify-btn').forEach(b => {
      if(b.getAttribute('data-side') === word.answer) b.classList.add('adj-classify-correct');
    });
  }
  document.querySelectorAll('#adjClassifyBtnRow .adj-classify-btn').forEach(b => b.disabled = true);

  const fb = document.getElementById('adjClassifyFeedback');
  if(correct){
    adjClassifyCorrect++;
    fb.textContent = '정답이에요! 🎉';
    fb.className = 'adj-feedback adj-fb-correct';
  } else {
    fb.textContent = '다시 한 번 생각해봐요';
    fb.className = 'adj-feedback adj-fb-wrong';
  }
  document.getElementById('adjClassifyNextBtn').style.display = '';
}

function nextAdjClassify(){
  adjClassifyIdx++;
  if(adjClassifyIdx < adjClassifyWords.length){
    renderAdjClassify();
  } else {
    showAdjResult();
  }
}

function showAdjResult(){
  document.getElementById('adjQuizScreen').style.display = 'none';
  document.getElementById('adjClassifyScreen').style.display = 'none';
  document.getElementById('adjResultScreen').style.display = '';
  const totalCorrect = adjCorrectCount + adjClassifyCorrect;
  const totalCount = adjQuestions.length + adjClassifyWords.length;
  document.getElementById('adjResultCorrect').textContent = totalCorrect;
  document.getElementById('adjResultTotal').textContent = totalCount;
}

function restartAdjectiveSet(){
  showAdjIntro();
}



let currentMenuCategoryId = null;

/* 초기 메뉴에 함께 노출할 '설정' / '단어 카드' 항목 — 게임 카테고리와 달리
   하위 게임 목록이 아니라 전용 패널을 직접 엽니다 */
const TOP_MENU_EXTRA_ITEMS = [
  {
    id: 'placement', title: '시작 진단', emoji: '🎯',
    desc: '문제 6개로 지금 수준을 가늠해서 알맞은 단어 범위를 추천해줘요',
    action: () => launchGame('placement')
  },
  {
    id: 'phonoTest', title: '소리 구별 진단', emoji: '👂',
    desc: '비슷한 소리 8쌍을 듣고 같은지 다른지 맞혀서 귀가 얼마나 밝은지 확인해요',
    action: () => launchGame('phonoTest')
  },
  {
    id: 'wmsSpan', title: '기억 스팬 진단', emoji: '🧩',
    desc: '도형을 순서대로 보여주고 거꾸로 기억해내는 힘을 확인해요',
    action: () => launchGame('wmsSpan')
  },
  {
    id: 'palTest', title: '새 짝 암기 속도 진단', emoji: '🔗',
    desc: '처음 보는 도형과 이름을 몇 번 만에 외우는지 확인해요',
    action: () => launchGame('palTest')
  },
  {
    id: 'settings', title: '설정', emoji: '⚙️',
    desc: '연령대·JLPT·주제별 단어 범위와 아기말투 재생을 설정해요',
    action: () => openMenuPanel('menuSettingsLevel')
  },
  {
    id: 'wordcards', title: '단어 카드', emoji: '📇',
    desc: '오늘 맞춘 단어와 전체 단어 카드를 모아봐요',
    action: () => openMenuPanel('menuWordcardsLevel')
  },
  {
    id: 'videos', title: '히라가나 영상', emoji: '🎬',
    desc: '일본 学研키즈TV의 히라가나 학습 영상 시리즈를 봐요',
    action: () => openMenuPanel('menuVideosLevel')
  },
  {
    id: 'ltm', title: '장기기억 현황', emoji: '🧠',
    desc: '히라가나 글자별로 장기기억에 얼마나 잘 저장됐는지 확인해요',
    action: () => { openMenuPanel('menuLtmLevel'); renderLtmDashboard(); }
  },
  {
    id: 'theory', title: '학습이론', emoji: '📚',
    desc: '이 앱에 적용된 장기기억 학습 이론과 기능을 그림으로 설명해요',
    action: () => openMenuPanel('menuTheoryLevel')
  }
];

/* GAME_STAGE_MAP(data.js) 조회 헬퍼 — learning-theory-roadmap.md Part 2 §2.
   §3 오케스트레이터가 "이 게임은 몇 단계인가"를 물어볼 때 사용할 예정(아직 호출부 없음).
   매핑에 없는 모드(진단용 모드 등)는 null을 반환함. */
function getGameStage(mode) {
  return GAME_STAGE_MAP[mode] || null;
}

/* 특정 단계(A~D)에 해당하는 게임 모드 목록을 반환 — §3에서 "오늘 세션에 이 단계 게임을
   몇 개 낼까" 정할 때 후보 풀로 사용할 예정(아직 호출부 없음). E단계는 특정 모드에
   고정되지 않으므로(복습 세트/재감상) 여기서 조회 대상이 아님. */
function getModesForStage(stage) {
  return Object.keys(GAME_STAGE_MAP).filter(mode => GAME_STAGE_MAP[mode] === stage);
}

/* ============================================================
   🧭 §3 오케스트레이터 Phase 1(규칙 기반) — learning-theory-roadmap.md Part 2 §3.
   "오늘 이 학습자에게 어떤 게임을 추천할까"를 계산하는 최초 버전.

   범위: Part 2 §2에서 미뤄뒀던 "항목별 단계 이동 규칙"을 전체 30여 개 게임 모드로
   한 번에 일반화하지 않고, 이미 3채널(재인·회상·발화) SRS 통계가 갖춰진
   히라가나 학습 축에만 우선 적용함(회귀 리스크가 가장 낮고, §1 진단 4개 필드를
   실제로 연결해보는 목적에는 이 정도 범위로도 충분). 다른 게임 카테고리(단어 퀴즈,
   문장 조합 등)로 넓히는 것은 별도 세션의 다음 과제로 남겨둠.
   ============================================================ */

/* 히라가나 한 글자가 지금 A~E 중 어느 단계에 있는지 판정.
   - 세 채널(hsStats 재인/hwStats 회상/hrStats 발화) 중 아무것도 시도한 적 없으면 'A'
   - computeLtmStatus가 이미 '장기기억 정착'으로 판단했으면 'E'
   - 발화(hr)까지 일정 단계 이상 진행됐으면 'D', 회상(hw)이면 'C', 그 외 시도만 있으면 'B' */
function computeCharGameStage(ch) {
  const hs = hsStats.getStat(ch);
  const hw = hwStats.getStat(ch);
  const hr = hrStats.getStat(ch);
  const attempted = (stat) => (stat.correct + stat.wrong) > 0;

  if (!attempted(hs) && !attempted(hw) && !attempted(hr)) return 'A';

  const status = computeLtmStatus(ch);
  if (status.level === 'stable') return 'E';
  if (attempted(hr) && hr.srsStage >= 1) return 'D';
  if (attempted(hw) && hw.srsStage >= 2) return 'C';
  return 'B';
}

/* 활성 학습 세트(getActiveCharList) 글자들이 지금 A~E에 얼마나 분포돼 있는지 집계 */
function computeActiveSetStageDistribution() {
  const chars = getActiveCharList().map(item => item.ch);
  const dist = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  chars.forEach(ch => { dist[computeCharGameStage(ch)] += 1; });
  return { dist, total: chars.length };
}

/* 진단 프로필(§1의 4개 필드)로 학습자 성향을 3분류.
   - phonoDiscrimination(청지각 변별력)이 낮거나, assocLearningRate가 'slow'이거나,
     workingMemorySpan(작업기억 스팬)이 낮으면 → 'cautious'(신중한 학습자, A단계 비중↑)
   - assocLearningRate가 'fast'이면서 작업기억도 넉넉하거나, priorKnowledgeLevel(사전지식)이
     높으면 → 'fast'(빠른 습득자, A단계는 최소화하고 D·E 비중↑)
   - 그 외는 'normal' */
function classifyLearnerTendency(profile) {
  const rate = profile.assocLearningRate;
  const wms = typeof profile.workingMemorySpan === 'number' ? profile.workingMemorySpan : null;
  const prior = typeof profile.priorKnowledgeLevel === 'number' ? profile.priorKnowledgeLevel : null;
  const phono = typeof profile.phonoDiscrimination === 'number' ? profile.phonoDiscrimination : null;

  if (rate === 'slow' || (wms !== null && wms <= 4) || (phono !== null && phono < 0.6)) {
    return 'cautious';
  }
  if ((rate === 'fast' && (wms === null || wms >= 6)) || (prior !== null && prior >= 70)) {
    return 'fast';
  }
  return 'normal';
}

/* 오늘 세션에 어떤 게임을 추천할지 정하는 Phase 1 규칙 기반 함수.
   1) 진단 프로필로 목표 단계 비율(LEARNER_STAGE_RATIO)을 정하고
   2) 활성 세트 글자들의 실제 현재 단계 분포를 구한 뒤
   3) 목표 대비 가장 부족한(비중이 낮은) 단계 하나를 골라 그 단계에 맞는 게임을 추천함.
   E단계가 가장 부족하면 특정 게임 대신 기존 복습 세트(startReviewSession)를 추천함. */
function pickNextGameForSession() {
  const profile = loadLearnerProfile();
  const tendency = classifyLearnerTendency(profile);
  const targetRatio = LEARNER_STAGE_RATIO[tendency];

  const { dist, total } = computeActiveSetStageDistribution();
  if (total === 0) {
    return { stage: 'A', mode: 'exposure', tendency, reason: '아직 활성화된 글자가 없어요 — 가볍게 듣기부터 시작해봐요' };
  }

  let worstStage = 'A';
  let worstGap = -Infinity;
  ['A', 'B', 'C', 'D', 'E'].forEach(stage => {
    const actualRatio = dist[stage] / total;
    const gap = targetRatio[stage] - actualRatio;
    if (gap > worstGap) { worstGap = gap; worstStage = stage; }
  });

  const stageLabel = GAME_STAGE_INFO[worstStage] ? GAME_STAGE_INFO[worstStage].label : worstStage;

  if (worstStage === 'E') {
    return {
      stage: 'E', mode: null, useReviewSession: true, tendency,
      reason: `이미 잘 아는 글자들을 새 맥락에서 다시 만나 "${stageLabel}"할 시간이에요`
    };
  }

  return {
    stage: worstStage, mode: STAGE_TO_HIRAGANA_MODE[worstStage], tendency,
    reason: `지금 배우는 글자 중 "${stageLabel}" 단계 비중이 목표보다 낮아요`
  };
}

/* "오늘의 추천" 배너 — 상위 메뉴 화면 상단에 pickNextGameForSession() 결과를 보여줌.
   추천 결과는 startRecommendedGame()에서 그대로 쓸 수 있게 모듈 전역에 잠깐 저장해둠. */
let lastSessionRecommendation = null;

function renderTodayRecommendation() {
  const banner = document.getElementById('todayRecommendBanner');
  if (!banner) return;

  loadActiveSetStateIfNeeded();
  hsStats.load();
  hwStats.load();
  hrStats.load();

  const rec = pickNextGameForSession();
  lastSessionRecommendation = rec;

  const stageEmoji = { A: '👂', B: '🔍', C: '✍️', D: '🗣️', E: '🌱' };
  const stageLabel = rec.stage === 'E' ? '유지·재맥락화' : (GAME_STAGE_INFO[rec.stage] ? GAME_STAGE_INFO[rec.stage].label : rec.stage);

  banner.style.display = 'flex';
  banner.innerHTML = `
    <div class="today-recommend-body">
      <div class="today-recommend-emoji">${stageEmoji[rec.stage] || '🎯'}</div>
      <div class="today-recommend-text">
        <div class="today-recommend-title">오늘의 추천 · ${stageLabel}</div>
        <div class="today-recommend-desc">${rec.reason}</div>
      </div>
    </div>
    <button class="today-recommend-btn" onclick="startRecommendedGame()">지금 시작하기</button>
  `;
}

function startRecommendedGame() {
  if (!lastSessionRecommendation) return;
  if (lastSessionRecommendation.useReviewSession) {
    startReviewSession();
    return;
  }
  if (lastSessionRecommendation.mode) {
    launchGame(lastSessionRecommendation.mode);
  }
}

function hideAllMenuPanels(){
  ['menuCategoryLevel', 'menuSettingsLevel', 'menuWordcardsLevel', 'menuVideosLevel', 'menuLtmLevel', 'menuTheoryLevel'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
}

function openMenuPanel(panelId){
  document.getElementById('menuTopLevel').style.display = 'none';
  hideAllMenuPanels();
  const panel = document.getElementById(panelId);
  if(panel) panel.style.display = 'block';
}

function renderTopMenu(){
  const grid = document.getElementById('menuTopGrid');
  if(!grid) return;
  grid.innerHTML = '';
  MENU_CATEGORIES.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="menu-card-emoji">${cat.emoji}</div>
      <div class="menu-card-title">${cat.title}</div>
      <div class="menu-card-sub">${cat.desc}</div>
    `;
    card.addEventListener('click', () => {
      if(cat.directMode){
        launchGame(cat.directMode);
      } else {
        openMenuCategory(cat.id);
      }
    });
    grid.appendChild(card);
  });
  TOP_MENU_EXTRA_ITEMS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="menu-card-emoji">${item.emoji}</div>
      <div class="menu-card-title">${item.title}</div>
      <div class="menu-card-sub">${item.desc}</div>
    `;
    card.addEventListener('click', () => item.action());
    grid.appendChild(card);
  });
}

function openMenuCategory(catId){
  const cat = MENU_CATEGORIES.find(c => c.id === catId);
  if(!cat) return;
  currentMenuCategoryId = catId;

  document.getElementById('menuCategoryTitle').textContent = `${cat.emoji} ${cat.title}`;
  document.getElementById('menuCategoryDesc').textContent = cat.desc;

  const grid = document.getElementById('menuCategoryGrid');
  grid.innerHTML = '';
  cat.games.forEach(g => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="menu-card-emoji">${g.emoji}</div>
      <div class="menu-card-title">${g.title}</div>
    `;
    card.addEventListener('click', () => launchGame(g.mode));
    grid.appendChild(card);
  });

  document.getElementById('menuTopLevel').style.display = 'none';
  hideAllMenuPanels();
  document.getElementById('menuCategoryLevel').style.display = 'block';
}

function showTopMenu(){
  currentMenuCategoryId = null;
  hideAllMenuPanels();
  document.getElementById('menuTopLevel').style.display = 'block';
  renderTodayRecommendation();
}

/* 게임을 고르면 기존 switchMode()로 해당 모드를 실제로 활성화한 뒤,
   화면 전체를 덮어 아이가 콘텐츠에 더 집중할 수 있게 합니다 */
function launchGame(mode){
  switchMode(mode);

  document.body.classList.add('game-fullscreen');
  const container = document.getElementById('gameScreenContainer');
  if(container){
    container.classList.add('game-active');
    container.scrollTop = 0;
  }

  // 브라우저 전체화면 API도 함께 시도합니다 (지원하지 않거나 차단되어도 위 오버레이로 집중 효과는 유지됩니다)
  const rootEl = document.documentElement;
  if(rootEl.requestFullscreen){
    rootEl.requestFullscreen().catch(() => {});
  }
}

/* 게임 화면 왼쪽 상단의 "이전 메뉴" 버튼 — 방금 고른 하위 메뉴로 돌아갑니다.
   단, 히라가나 스피드게임의 결과 화면에서는 상위 카테고리 선택 화면으로 나가는 대신
   글자별 통계와 "게임 시작하기" 버튼이 있는 시작 화면으로 돌아갑니다 */
function backToCategoryFromGame(){
  if (reviewSessionActive) cancelReviewSession();

  const hiraganaSpeedModeEl = document.getElementById('hiraganaSpeedMode');
  const hsResultScreenEl = document.getElementById('hsResultScreen');
  if (hiraganaSpeedModeEl && hiraganaSpeedModeEl.classList.contains('active') &&
      hsResultScreenEl && hsResultScreenEl.style.display !== 'none') {
    initHiraganaSpeedGame();
    return;
  }

  exitGameFullscreen();
  if(currentMenuCategoryId){
    document.getElementById('menuCategoryLevel').style.display = 'block';
  } else {
    document.getElementById('menuTopLevel').style.display = 'block';
  }
}

function exitGameFullscreen(){
  document.body.classList.remove('game-fullscreen');
  const container = document.getElementById('gameScreenContainer');
  if(container) container.classList.remove('game-active');

  if(document.fullscreenElement && document.exitFullscreen){
    document.exitFullscreen().catch(() => {});
  }

  // 어떤 게임 화면에서 나오든 재생/듣기 중이던 소리와 타이머를 모두 정지합니다
  stopListening();
  stopPronounceListening();
  stopSceneAutoplay();
  stopSongPlayback();
  stopTraceAudioLoop();
  stopStorybookAutoplay();
  stopEmojiStorybookAutoplay();
  stopKaraokePlayback();
  stopEbookAudio();
  stopWordSearchDrag();
  clearTimeout(riddleAdvanceTimer);
  clearTimeout(riddleHintTimer);
  qaGame.cancelAdvance();
  lifeqaGame.cancelAdvance();
  shopGame.cancelAdvance();
  clearTimeout(spellingAdvanceTimer);
  clearTimeout(hsTimer);
  clearTimeout(hsAdvanceTimer);
  clearTimeout(wmTimer);
  clearTimeout(wmAdvanceTimer);
  clearTimeout(wmSequenceTimer);
  clearTimeout(hwTimer);
  clearTimeout(hwAdvanceTimer);
  ewGame.cancelAdvance();
  silGame.cancelAdvance();
  if (lineMatchResizeHandler) { window.removeEventListener('resize', lineMatchResizeHandler); lineMatchResizeHandler = null; }
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
}

// 사용자가 Esc 키 등으로 브라우저 전체화면을 직접 빠져나갔을 때도 오버레이 상태를 함께 정리합니다
document.addEventListener('fullscreenchange', () => {
  if(!document.fullscreenElement && document.body.classList.contains('game-fullscreen')){
    backToCategoryFromGame();
  }
});

/* 페이지 로드 시 연령대 라벨/버튼 상태를 실제 데이터와 동기화 */
(function initAppLevelUI(){
  const countEl = document.getElementById('ageLevelCount');
  if(countEl) countEl.innerHTML = `현재 <b>${getActiveWords().length}</b>개 단어 사용 중`;
  updateMatchGridAvailability();
  document.body.classList.toggle('gentle-mode', isGentleFeedbackMode());
  renderTopMenu();
  renderTodayRecommendation();
})();

// PWA 설치/오프라인 지원을 위한 서비스워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
