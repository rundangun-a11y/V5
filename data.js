// 🗂️ 앱에서 쓰는 정적 데이터 모음 (단어 사전, 이야기, 퀴즈 문제 등)
// index.html의 인라인 스크립트보다 먼저 로드되어야 합니다.

const DICTIONARY = [

  {jp:"ねこ", romaji:"neko", kr:"고양이", emoji:"🐱", level:12, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"いぬ", romaji:"inu", kr:"강아지", emoji:"🐶", level:12, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"さかな", romaji:"sakana", kr:"물고기", emoji:"🐟", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"とり", romaji:"tori", kr:"새", emoji:"🐦", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"うま", romaji:"uma", kr:"말", emoji:"🐴", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"くるま", romaji:"kuruma", kr:"자동차", emoji:"🚗", level:12, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"でんしゃ", romaji:"densha", kr:"전철", emoji:"🚆", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"じてんしゃ", romaji:"jitensha", kr:"자전거", emoji:"🚲", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ひこうき", romaji:"hikouki", kr:"비행기", emoji:"✈️", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ふね", romaji:"fune", kr:"배", emoji:"🚢", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"りんご", romaji:"ringo", kr:"사과", emoji:"🍎", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"みかん", romaji:"mikan", kr:"귤", emoji:"🍊", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぶどう", romaji:"budou", kr:"포도", emoji:"🍇", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"みず", romaji:"mizu", kr:"물", emoji:"💧", level:12, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぱん", romaji:"pan", kr:"빵", emoji:"🍞", level:12, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"たまご", romaji:"tamago", kr:"계란", emoji:"🥚", level:12, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ほん", romaji:"hon", kr:"책", emoji:"📖", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"かばん", romaji:"kaban", kr:"가방", emoji:"🎒", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"とけい", romaji:"tokei", kr:"시계", emoji:"⏰", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"めがね", romaji:"megane", kr:"안경", emoji:"👓", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"かさ", romaji:"kasa", kr:"우산", emoji:"☂️", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"くつ", romaji:"kutsu", kr:"신발", emoji:"👟", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"いえ", romaji:"ie", kr:"집", emoji:"🏠", level:12, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"がっこう", romaji:"gakkou", kr:"학교", emoji:"🏫", level:18, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"はな", romaji:"hana", kr:"꽃", emoji:"🌸", level:12, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"つき", romaji:"tsuki", kr:"달", emoji:"🌙", level:12, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"ほし", romaji:"hoshi", kr:"별", emoji:"⭐", level:12, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"たいよう", romaji:"taiyou", kr:"태양", emoji:"☀️", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"あめ", romaji:"ame", kr:"비", emoji:"🌧️", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"ゆき", romaji:"yuki", kr:"눈", emoji:"❄️", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"たべる", romaji:"taberu", kr:"먹다", emoji:"🍽️", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"のむ", romaji:"nomu", kr:"마시다", emoji:"🥤", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"あるく", romaji:"aruku", kr:"걷다", emoji:"🚶", level:24, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"はしる", romaji:"hashiru", kr:"뛰다", emoji:"🏃", level:24, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"ねる", romaji:"neru", kr:"자다", emoji:"😴", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"よむ", romaji:"yomu", kr:"읽다", emoji:"📚", level:24, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"みる", romaji:"miru", kr:"보다", emoji:"👀", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"わらう", romaji:"warau", kr:"웃다", emoji:"😄", level:24, category:"verbs", pos:"verb", jlpt:"N5"},

  /* ▼ 24개월 전후 아기가 실제로 쓰는 일본어 단어 추가분 */
  // 가족 호칭
  {jp:"まま", romaji:"mama", kr:"엄마", emoji:"👩", level:6, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"ぱぱ", romaji:"papa", kr:"아빠", emoji:"👨", level:6, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"じいじ", romaji:"jiji", kr:"할아버지", emoji:"👴", level:24, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"ばあば", romaji:"baba", kr:"할머니", emoji:"👵", level:24, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"あかちゃん", romaji:"akachan", kr:"아기", emoji:"👶", level:24, category:"family", pos:"noun", jlpt:"N5"},

  // 아기말(유아어) 표현
  {jp:"わんわん", romaji:"wanwan", kr:"멍멍이", emoji:"🐕", level:9, expand:"いぬ", expandKr:"멍멍이는 강아지(いぬ)라고도 해", category:"greetings", pos:"noun", jlpt:null},
  {jp:"にゃんにゃん", romaji:"nyannyan", kr:"야옹이", emoji:"😺", level:9, expand:"ねこ", expandKr:"야옹이는 고양이(ねこ)라고도 해", category:"greetings", pos:"noun", jlpt:null},
  {jp:"ぶーぶー", romaji:"buubuu", kr:"붕붕(자동차)", emoji:"🚙", level:9, expand:"くるま", expandKr:"붕붕이는 자동차(くるま)라고도 해", category:"greetings", pos:"noun", jlpt:null},
  {jp:"まんま", romaji:"manma", kr:"맘마(밥)", emoji:"🍚", level:9, expand:"ごはん", expandKr:"맘마는 밥(ごはん)이라고도 해", category:"greetings", pos:"noun", jlpt:null},
  {jp:"ねんね", romaji:"nenne", kr:"코자자(잠)", emoji:"💤", level:9, expand:"ねる", expandKr:"코자자는 자다(ねる)라는 뜻이야", category:"greetings", pos:"noun", jlpt:null},
  {jp:"だっこ", romaji:"dakko", kr:"안아줘", emoji:"🤗", level:9, expand:"うれしいね", expandKr:"안아주면 기분이 좋지", category:"greetings", pos:"noun", jlpt:null},
  {jp:"くっく", romaji:"kukku", kr:"신발(아기말)", emoji:"👞", level:9, expand:"くつ", expandKr:"쿡쿡은 신발(くつ)이라고도 해", category:"greetings", pos:"noun", jlpt:null},
  {jp:"ちょうだい", romaji:"choudai", kr:"주세요", emoji:"🙏", level:24, category:"greetings", pos:"interj", jlpt:"N5"},
  {jp:"どうぞ", romaji:"douzo", kr:"여기요", emoji:"🤲", level:24, category:"greetings", pos:"interj", jlpt:"N5"},
  {jp:"ばいばい", romaji:"baibai", kr:"빠이빠이", emoji:"👋", level:9, category:"greetings", pos:"interj", jlpt:"N5"},

  // 신체 부위
  {jp:"め", romaji:"me", kr:"눈", emoji:"👁️", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"みみ", romaji:"mimi", kr:"귀", emoji:"👂", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"くち", romaji:"kuchi", kr:"입", emoji:"👄", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"て", romaji:"te", kr:"손", emoji:"✋", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"あし", romaji:"ashi", kr:"발", emoji:"🦶", level:24, category:"body", pos:"noun", jlpt:"N5"},

  // 동물
  {jp:"くま", romaji:"kuma", kr:"곰", emoji:"🐻", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"うさぎ", romaji:"usagi", kr:"토끼", emoji:"🐰", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ぞう", romaji:"zou", kr:"코끼리", emoji:"🐘", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"きりん", romaji:"kirin", kr:"기린", emoji:"🦒", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ぱんだ", romaji:"panda", kr:"판다", emoji:"🐼", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ぶた", romaji:"buta", kr:"돼지", emoji:"🐷", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かえる", romaji:"kaeru", kr:"개구리", emoji:"🐸", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ちょう", romaji:"chou", kr:"나비", emoji:"🦋", level:24, category:"animals", pos:"noun", jlpt:"N5"},

  // 음식
  {jp:"ばなな", romaji:"banana", kr:"바나나", emoji:"🍌", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"いちご", romaji:"ichigo", kr:"딸기", emoji:"🍓", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"にんじん", romaji:"ninjin", kr:"당근", emoji:"🥕", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"おちゃ", romaji:"ocha", kr:"차", emoji:"🍵", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぎゅうにゅう", romaji:"gyuunyuu", kr:"우유", emoji:"🥛", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"おかし", romaji:"okashi", kr:"과자", emoji:"🍪", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"じゅーす", romaji:"juusu", kr:"주스", emoji:"🧃", level:24, category:"food", pos:"noun", jlpt:"N5"},

  // 장난감 & 물건
  {jp:"ぼーる", romaji:"booru", kr:"공", emoji:"⚽", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"つみき", romaji:"tsumiki", kr:"블록", emoji:"🧱", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"にんぎょう", romaji:"ningyou", kr:"인형", emoji:"🪆", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ふうせん", romaji:"fuusen", kr:"풍선", emoji:"🎈", level:24, category:"toys", pos:"noun", jlpt:"N5"},

  // 옷
  {jp:"ふく", romaji:"fuku", kr:"옷", emoji:"👕", level:24, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"ぼうし", romaji:"boushi", kr:"모자", emoji:"🧢", level:24, category:"clothes", pos:"noun", jlpt:"N5"},

  // 자연
  {jp:"そら", romaji:"sora", kr:"하늘", emoji:"🌤️", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"うみ", romaji:"umi", kr:"바다", emoji:"🌊", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"やま", romaji:"yama", kr:"산", emoji:"⛰️", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"き", romaji:"ki", kr:"나무", emoji:"🌳", level:24, category:"nature", pos:"noun", jlpt:"N5"},

  // 인사말 & 동작
  {jp:"おはよう", romaji:"ohayou", kr:"안녕(아침 인사)", emoji:"🌅", level:24, category:"greetings", pos:"interj", jlpt:"N5"},
  {jp:"おやすみ", romaji:"oyasumi", kr:"잘자", emoji:"😴", level:24, category:"greetings", pos:"interj", jlpt:"N5"},
  {jp:"ありがとう", romaji:"arigatou", kr:"고마워", emoji:"😊", level:24, category:"greetings", pos:"interj", jlpt:"N5"},
  {jp:"あそぶ", romaji:"asobu", kr:"놀다", emoji:"🎮", level:24, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"すわる", romaji:"suwaru", kr:"앉다", emoji:"🪑", level:24, category:"verbs", pos:"verb", jlpt:"N5"},

  /* ▼ 18개월 전후 아기가 실제로 쓰는 일본어 단어 추가분 */
  // 동물
  {jp:"さる", romaji:"saru", kr:"원숭이", emoji:"🐒", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"らいおん", romaji:"raion", kr:"사자", emoji:"🦁", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かめ", romaji:"kame", kr:"거북이", emoji:"🐢", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ひよこ", romaji:"hiyoko", kr:"병아리", emoji:"🐤", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"あひる", romaji:"ahiru", kr:"오리", emoji:"🦆", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"くじら", romaji:"kujira", kr:"고래", emoji:"🐳", level:18, category:"animals", pos:"noun", jlpt:"N5"},

  // 음식
  {jp:"すいか", romaji:"suika", kr:"수박", emoji:"🍉", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"もも", romaji:"momo", kr:"복숭아", emoji:"🍑", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"とまと", romaji:"tomato", kr:"토마토", emoji:"🍅", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"きゅうり", romaji:"kyuuri", kr:"오이", emoji:"🥒", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"にく", romaji:"niku", kr:"고기", emoji:"🍖", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"おにぎり", romaji:"onigiri", kr:"주먹밥", emoji:"🍙", level:18, category:"food", pos:"noun", jlpt:"N5"},

  // 색깔
  {jp:"あか", romaji:"aka", kr:"빨강", emoji:"🔴", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"あお", romaji:"ao", kr:"파랑", emoji:"🔵", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"きいろ", romaji:"kiiro", kr:"노랑", emoji:"🟡", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"みどり", romaji:"midori", kr:"초록", emoji:"🟢", level:18, category:"colors", pos:"noun", jlpt:"N5"},

  // 숫자
  {jp:"いち", romaji:"ichi", kr:"하나(1)", emoji:"1️⃣", level:18, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"に", romaji:"ni", kr:"둘(2)", emoji:"2️⃣", level:18, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"さん", romaji:"san", kr:"셋(3)", emoji:"3️⃣", level:18, category:"numbers", pos:"num", jlpt:"N5"},

  // 자연
  {jp:"かわ", romaji:"kawa", kr:"강", emoji:"🏞️", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"いし", romaji:"ishi", kr:"돌", emoji:"🪨", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"くさ", romaji:"kusa", kr:"풀", emoji:"🌿", level:18, category:"nature", pos:"noun", jlpt:"N5"},

  // 생활용품
  {jp:"おふろ", romaji:"ofuro", kr:"목욕", emoji:"🛁", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"せっけん", romaji:"sekken", kr:"비누", emoji:"🧼", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"はみがき", romaji:"hamigaki", kr:"양치질", emoji:"🪥", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ふとん", romaji:"futon", kr:"이불", emoji:"🛏️", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"まくら", romaji:"makura", kr:"베개", emoji:"🛌", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"たおる", romaji:"taoru", kr:"수건", emoji:"🧻", level:18, category:"household", pos:"noun", jlpt:"N5"},

  // 동사
  {jp:"あける", romaji:"akeru", kr:"열다", emoji:"🔓", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"しめる", romaji:"shimeru", kr:"닫다", emoji:"🔒", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"なく", romaji:"naku", kr:"울다", emoji:"😢", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"おきる", romaji:"okiru", kr:"일어나다", emoji:"⏰", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"たつ", romaji:"tatsu", kr:"서다", emoji:"🧍", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"いく", romaji:"iku", kr:"가다", emoji:"➡️", level:18, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"くる", romaji:"kuru", kr:"오다", emoji:"⬅️", level:18, category:"verbs", pos:"verb", jlpt:"N5"},

  // 놀이
  {jp:"すべりだい", romaji:"suberidai", kr:"미끄럼틀", emoji:"🛝", level:18, category:"toys", pos:"noun", jlpt:"N5"},

  /* ▼ 12개월 전후 아기가 실제로 쓰는 일본어 단어 추가분 */
  // 생활용품
  {jp:"おっぱい", romaji:"oppai", kr:"모유", emoji:"🤱", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"みるく", romaji:"miruku", kr:"분유", emoji:"🍼", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"こっぷ", romaji:"koppu", kr:"컵", emoji:"🥤", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"おさら", romaji:"osara", kr:"접시", emoji:"🍽️", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"すぷーん", romaji:"supuun", kr:"숟가락", emoji:"🥄", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"くつした", romaji:"kutsushita", kr:"양말", emoji:"🧦", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"かぎ", romaji:"kagi", kr:"열쇠", emoji:"🔑", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"でんき", romaji:"denki", kr:"전등(불)", emoji:"💡", level:12, category:"household", pos:"noun", jlpt:"N5"},

  // 신체
  {jp:"あたま", romaji:"atama", kr:"머리", emoji:"🧠", level:12, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"ゆび", romaji:"yubi", kr:"손가락", emoji:"👆", level:12, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"かみ", romaji:"kami", kr:"머리카락", emoji:"💇", level:12, category:"body", pos:"noun", jlpt:"N5"},

  // 작은 동물/곤충
  {jp:"あり", romaji:"ari", kr:"개미", emoji:"🐜", level:12, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"むし", romaji:"mushi", kr:"벌레", emoji:"🐛", level:12, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"てんとうむし", romaji:"tentoumushi", kr:"무당벌레", emoji:"🐞", level:12, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かたつむり", romaji:"katatsumuri", kr:"달팽이", emoji:"🐌", level:12, category:"animals", pos:"noun", jlpt:"N5"},

  // 의성어·의태어
  {jp:"ぱちぱち", romaji:"pachipachi", kr:"짝짝(박수)", emoji:"👏", level:12, category:"greetings", pos:"adv", jlpt:null},
  {jp:"じゃあじゃあ", romaji:"jaajaa", kr:"콸콸(물소리)", emoji:"🚰", level:12, category:"greetings", pos:"adv", jlpt:null},
  {jp:"とんとん", romaji:"tonton", kr:"똑똑(두드리는 소리)", emoji:"🚪", level:12, category:"greetings", pos:"adv", jlpt:null},
  {jp:"ばあ", romaji:"baa", kr:"까꿍", emoji:"🙈", level:12, category:"greetings", pos:"interj", jlpt:null},
  {jp:"わあ", romaji:"waa", kr:"와~", emoji:"😲", level:12, category:"greetings", pos:"interj", jlpt:null},

  // 식사 표현
  {jp:"もっと", romaji:"motto", kr:"더(더 줘)", emoji:"➕", level:12, category:"greetings", pos:"adv", jlpt:"N5"},
  {jp:"あーん", romaji:"aan", kr:"아~(입 벌리기)", emoji:"😮", level:12, category:"greetings", pos:"interj", jlpt:null},
  {jp:"おいしい", romaji:"oishii", kr:"맛있다", emoji:"😋", level:12, category:"greetings", pos:"adj", jlpt:"N5"},
  {jp:"いただきます", romaji:"itadakimasu", kr:"잘 먹겠습니다", emoji:"🙏", level:12, category:"greetings", pos:"interj", jlpt:"N5"},
  {jp:"ごちそうさま", romaji:"gochisousama", kr:"잘 먹었습니다", emoji:"😊", level:12, category:"greetings", pos:"interj", jlpt:"N5"},

  // 대답
  {jp:"はい", romaji:"hai", kr:"네(여기요)", emoji:"👍", level:12, category:"greetings", pos:"interj", jlpt:"N5"},
  {jp:"うん", romaji:"un", kr:"응(그래)", emoji:"🆗", level:12, category:"greetings", pos:"interj", jlpt:"N5"},
  {jp:"いや", romaji:"iya", kr:"싫어", emoji:"🙅", level:12, category:"greetings", pos:"interj", jlpt:"N5"},

  // 자연
  {jp:"くも", romaji:"kumo", kr:"구름", emoji:"☁️", level:12, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"かぜ", romaji:"kaze", kr:"바람", emoji:"💨", level:12, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"ひ", romaji:"hi", kr:"불", emoji:"🔥", level:12, category:"nature", pos:"noun", jlpt:"N5"}
,

  /* ============================================================
     아래부터는 확장 어휘 (이모지로 직관적으로 연상 가능한 단어들)
     주로 18~24개월 이후 아이가 그림책·일상에서 접하는 확장 단어입니다.
     ============================================================ */
  {jp:"たぬき", romaji:"tanuki", kr:"너구리", emoji:"🦝", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"しか", romaji:"shika", kr:"사슴", emoji:"🦌", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"やぎ", romaji:"yagi", kr:"염소", emoji:"🐐", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"うし", romaji:"ushi", kr:"소", emoji:"🐮", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"にわとり", romaji:"niwatori", kr:"닭", emoji:"🐔", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ひつじ", romaji:"hitsuji", kr:"양", emoji:"🐑", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"こうもり", romaji:"koumori", kr:"박쥐", emoji:"🦇", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"りす", romaji:"risu", kr:"다람쥐", emoji:"🐿️", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"はりねずみ", romaji:"harinezumi", kr:"고슴도치", emoji:"🦔", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ねずみ", romaji:"nezumi", kr:"쥐", emoji:"🐭", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"おおかみ", romaji:"ookami", kr:"늑대", emoji:"🐺", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"とら", romaji:"tora", kr:"호랑이", emoji:"🐯", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ごりら", romaji:"gorira", kr:"고릴라", emoji:"🦍", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かば", romaji:"kaba", kr:"하마", emoji:"🦛", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"さい", romaji:"sai", kr:"코뿔소", emoji:"🦏", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"らくだ", romaji:"rakuda", kr:"낙타", emoji:"🐫", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"しまうま", romaji:"shimauma", kr:"얼룩말", emoji:"🦓", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"こあら", romaji:"koara", kr:"코알라", emoji:"🐨", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かんがるー", romaji:"kangaruu", kr:"캥거루", emoji:"🦘", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"なまけもの", romaji:"namakemono", kr:"나무늘보", emoji:"🦥", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かわうそ", romaji:"kawauso", kr:"수달", emoji:"🦦", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"あざらし", romaji:"azarashi", kr:"물범", emoji:"🦭", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ふくろう", romaji:"fukurou", kr:"부엉이", emoji:"🦉", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"わし", romaji:"washi", kr:"독수리", emoji:"🦅", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"つる", romaji:"tsuru", kr:"학", emoji:"🦩", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"くじゃく", romaji:"kujaku", kr:"공작새", emoji:"🦚", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"おうむ", romaji:"oumu", kr:"앵무새", emoji:"🦜", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"はと", romaji:"hato", kr:"비둘기", emoji:"🕊️", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"すずめ", romaji:"suzume", kr:"참새", emoji:"🐦", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かも", romaji:"kamo", kr:"오리(청둥)", emoji:"🦆", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"しちめんちょう", romaji:"shichimenchou", kr:"칠면조", emoji:"🦃", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"いるか", romaji:"iruka", kr:"돌고래", emoji:"🐬", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"たこ", romaji:"tako", kr:"문어", emoji:"🐙", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"いか", romaji:"ika", kr:"오징어", emoji:"🦑", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かに", romaji:"kani", kr:"게", emoji:"🦀", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"えび", romaji:"ebi", kr:"새우", emoji:"🦐", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"さめ", romaji:"same", kr:"상어", emoji:"🦈", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かい", romaji:"kai", kr:"조개", emoji:"🐚", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"さんご", romaji:"sango", kr:"산호", emoji:"🪸", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"はち", romaji:"hachi", kr:"벌", emoji:"🐝", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"せみ", romaji:"semi", kr:"매미", emoji:"🦗", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かぶとむし", romaji:"kabutomushi", kr:"장수풍뎅이", emoji:"🪲", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ほたる", romaji:"hotaru", kr:"반딧불이", emoji:"✨", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"メロン", romaji:"meron", kr:"멜론", emoji:"🍈", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"なし", romaji:"nashi", kr:"배", emoji:"🍐", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"さくらんぼ", romaji:"sakuranbo", kr:"체리", emoji:"🍒", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"れもん", romaji:"remon", kr:"레몬", emoji:"🍋", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"きうい", romaji:"kiui", kr:"키위", emoji:"🥝", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"あんず", romaji:"anzu", kr:"살구", emoji:"🍑", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"すもも", romaji:"sumomo", kr:"자두", emoji:"🍑", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"まんごー", romaji:"mangoo", kr:"망고", emoji:"🥭", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぱいなっぷる", romaji:"painappuru", kr:"파인애플", emoji:"🍍", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ここなつ", romaji:"kokonatsu", kr:"코코넛", emoji:"🥥", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぶるーべりー", romaji:"buruuberii", kr:"블루베리", emoji:"🫐", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"じゃがいも", romaji:"jagaimo", kr:"감자", emoji:"🥔", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"さつまいも", romaji:"satsumaimo", kr:"고구마", emoji:"🍠", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"たまねぎ", romaji:"tamanegi", kr:"양파", emoji:"🧅", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"にんにく", romaji:"ninniku", kr:"마늘", emoji:"🧄", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"かぼちゃ", romaji:"kabocha", kr:"호박", emoji:"🎃", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"なす", romaji:"nasu", kr:"가지", emoji:"🍆", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"とうもろこし", romaji:"toumorokoshi", kr:"옥수수", emoji:"🌽", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぴーまん", romaji:"piiman", kr:"피망", emoji:"🫑", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぶろっこりー", romaji:"burokkorii", kr:"브로콜리", emoji:"🥦", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"れたす", romaji:"retasu", kr:"양상추", emoji:"🥬", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"まめ", romaji:"mame", kr:"콩", emoji:"🫘", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"かれー", romaji:"karee", kr:"카레", emoji:"🍛", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"すし", romaji:"sushi", kr:"초밥", emoji:"🍣", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"らーめん", romaji:"raamen", kr:"라멘", emoji:"🍜", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"おでん", romaji:"oden", kr:"오뎅", emoji:"🍢", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"てんぷら", romaji:"tenpura", kr:"튀김", emoji:"🍤", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぎょうざ", romaji:"gyouza", kr:"만두", emoji:"🥟", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぴざ", romaji:"piza", kr:"피자", emoji:"🍕", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"はんばーがー", romaji:"hanbaagaa", kr:"햄버거", emoji:"🍔", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ほっとどっぐ", romaji:"hottodoggu", kr:"핫도그", emoji:"🌭", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"さんどいっち", romaji:"sandoicchi", kr:"샌드위치", emoji:"🥪", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"たこす", romaji:"takosu", kr:"타코", emoji:"🌮", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"すーぷ", romaji:"suupu", kr:"수프", emoji:"🍲", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"さらだ", romaji:"sarada", kr:"샐러드", emoji:"🥗", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"おかゆ", romaji:"okayu", kr:"죽", emoji:"🥣", level:12, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"みそしる", romaji:"misoshiru", kr:"된장국", emoji:"🍲", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ちーず", romaji:"chiizu", kr:"치즈", emoji:"🧀", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ばたー", romaji:"bataa", kr:"버터", emoji:"🧈", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"はちみつ", romaji:"hachimitsu", kr:"꿀", emoji:"🍯", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"あいす", romaji:"aisu", kr:"아이스크림", emoji:"🍦", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ちょこれーと", romaji:"chokoreeto", kr:"초콜릿", emoji:"🍫", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"きゃんでぃ", romaji:"kyandi", kr:"사탕", emoji:"🍬", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"どーなつ", romaji:"doonatsu", kr:"도넛", emoji:"🍩", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぷりん", romaji:"purin", kr:"푸딩", emoji:"🍮", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"わらびもち", romaji:"warabimochi", kr:"떡", emoji:"🍡", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"もち", romaji:"mochi", kr:"찹쌀떡", emoji:"🍡", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぱんけーき", romaji:"pankeeki", kr:"팬케이크", emoji:"🥞", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"わっふる", romaji:"waffuru", kr:"와플", emoji:"🧇", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"たると", romaji:"taruto", kr:"타르트", emoji:"🥧", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"まかろん", romaji:"makaron", kr:"마카롱", emoji:"🍬", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ろりぽっぷ", romaji:"roripoppu", kr:"막대사탕", emoji:"🍭", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"こーひー", romaji:"koohii", kr:"커피", emoji:"☕", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"こーら", romaji:"koora", kr:"콜라", emoji:"🥤", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"わいん", romaji:"wain", kr:"와인", emoji:"🍷", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"びーる", romaji:"biiru", kr:"맥주", emoji:"🍺", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"らいむ", romaji:"raimu", kr:"라임", emoji:"🍋‍🟩", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"あおりんご", romaji:"aoringo", kr:"청사과", emoji:"🍏", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"おりーぶ", romaji:"oriibu", kr:"올리브", emoji:"🫒", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"あぼかど", romaji:"abokado", kr:"아보카도", emoji:"🥑", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"とうがらし", romaji:"tougarashi", kr:"고추", emoji:"🌶️", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぴーなつ", romaji:"piinatsu", kr:"땅콩", emoji:"🥜", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"くり", romaji:"kuri", kr:"밤", emoji:"🌰", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"しょうが", romaji:"shouga", kr:"생강", emoji:"🫚", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"えんどうまめ", romaji:"endoumame", kr:"완두콩", emoji:"🫛", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"くろわっさん", romaji:"kurowassan", kr:"크루아상", emoji:"🥐", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ばげっと", romaji:"bagetto", kr:"바게트", emoji:"🥖", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ふらっとぶれっど", romaji:"furattobureddo", kr:"플랫브레드", emoji:"🫓", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぷれっつぇる", romaji:"purettsueru", kr:"프레첼", emoji:"🥨", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"べーぐる", romaji:"beeguru", kr:"베이글", emoji:"🥯", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ちきんれっぐ", romaji:"chikinreggu", kr:"닭다리", emoji:"🍗", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"すてーき", romaji:"suteeki", kr:"스테이크", emoji:"🥩", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"べーこん", romaji:"beekon", kr:"베이컨", emoji:"🥓", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ふらいどぽてと", romaji:"furaidopoteto", kr:"감자튀김", emoji:"🍟", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぶりと", romaji:"buriito", kr:"부리토", emoji:"🌯", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"たまーれ", romaji:"tamaare", kr:"타말레", emoji:"🫔", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"けばぶ", romaji:"kebabu", kr:"케밥", emoji:"🥙", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ふぁらふぇる", romaji:"farafueru", kr:"팔라펠", emoji:"🧆", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"めだまやき", romaji:"medamayaki", kr:"계란후라이", emoji:"🍳", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぱえりや", romaji:"paeriya", kr:"빠에야", emoji:"🥘", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ふぉんでゅ", romaji:"fondyu", kr:"퐁뒤", emoji:"🫕", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ぽっぷこーん", romaji:"poppukoon", kr:"팝콘", emoji:"🍿", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"しお", romaji:"shio", kr:"소금", emoji:"🧂", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"かんづめ", romaji:"kanzume", kr:"통조림", emoji:"🥫", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"べんとう", romaji:"bentou", kr:"도시락", emoji:"🍱", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"せんべい", romaji:"senbei", kr:"센베이", emoji:"🍘", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"すぱげてぃ", romaji:"supagetii", kr:"스파게티", emoji:"🍝", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"なると", romaji:"naruto", kr:"나루토(어묵)", emoji:"🍥", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"げっぺい", romaji:"geppei", kr:"월병", emoji:"🥮", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ふぉーちゅんくっきー", romaji:"foochunkukkii", kr:"포춘쿠키", emoji:"🥠", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ていくあうとばこ", romaji:"teikuautobako", kr:"테이크아웃 상자", emoji:"🥡", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"かきごおり", romaji:"kakigoori", kr:"빙수", emoji:"🍧", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"あいすくりーむ", romaji:"aisukuriimu", kr:"아이스크림", emoji:"🍨", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ばーすでーけーき", romaji:"baasudeekeeki", kr:"생일케이크", emoji:"🎂", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"しょーとけーき", romaji:"shootokeeki", kr:"조각케이크", emoji:"🍰", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"かっぷけーき", romaji:"kappukeeki", kr:"컵케이크", emoji:"🧁", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ほにゅうびん", romaji:"honyuubin", kr:"젖병", emoji:"🍼", level:12, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"きゅうす", romaji:"kyuusu", kr:"찻주전자", emoji:"🫖", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"おさけ", romaji:"osake", kr:"사케", emoji:"🍶", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"しゃんぱん", romaji:"shanpan", kr:"샴페인", emoji:"🍾", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"かくてる", romaji:"kakuteru", kr:"칵테일", emoji:"🍸", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"とろぴかるどりんく", romaji:"toropikarudorinku", kr:"트로피컬 칵테일", emoji:"🍹", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"びーるじょっき", romaji:"biirujokki", kr:"맥주잔(건배)", emoji:"🍻", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"しゃんぱんぐらす", romaji:"shanpanguraasu", kr:"건배(와인잔)", emoji:"🥂", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"うぃすきー", romaji:"uisukii", kr:"위스키", emoji:"🥃", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"そそぐえきたい", romaji:"sosoguekitai", kr:"따르는 액체", emoji:"🫗", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"たぴおかみるくてぃー", romaji:"tapiokamirukutii", kr:"버블티", emoji:"🧋", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"まてちゃ", romaji:"matecha", kr:"마테차", emoji:"🧉", level:36, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"こおり", romaji:"koori", kr:"얼음", emoji:"🧊", level:18, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ばす", romaji:"basu", kr:"버스", emoji:"🚌", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"たくしー", romaji:"takushii", kr:"택시", emoji:"🚕", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"とらっく", romaji:"torakku", kr:"트럭", emoji:"🚚", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"しょうぼうしゃ", romaji:"shouboushya", kr:"소방차", emoji:"🚒", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"きゅうきゅうしゃ", romaji:"kyuukyuushya", kr:"구급차", emoji:"🚑", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ぱとかー", romaji:"patokaa", kr:"경찰차", emoji:"🚓", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ばいく", romaji:"baiku", kr:"오토바이", emoji:"🏍️", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ろけっと", romaji:"roketto", kr:"로켓", emoji:"🚀", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"へりこぷたー", romaji:"herikoputaa", kr:"헬리콥터", emoji:"🚁", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"せんすいかん", romaji:"sensuikan", kr:"잠수함", emoji:"🚤", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"きしゃ", romaji:"kisha", kr:"기차", emoji:"🚂", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ひざ", romaji:"hiza", kr:"무릎", emoji:"🦵", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"かた", romaji:"kata", kr:"어깨", emoji:"💪", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"せなか", romaji:"senaka", kr:"등", emoji:"🔙", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"ゆびさき", romaji:"yubisaki", kr:"손끝", emoji:"☝️", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"つめ", romaji:"tsume", kr:"손톱", emoji:"💅", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"は", romaji:"ha", kr:"이(치아)", emoji:"🦷", level:18, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"した", romaji:"shita", kr:"혀", emoji:"👅", level:24, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"ずぼん", romaji:"zubon", kr:"바지", emoji:"👖", level:18, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"すかーと", romaji:"sukaato", kr:"치마", emoji:"👗", level:18, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"せーたー", romaji:"seetaa", kr:"스웨터", emoji:"🧥", level:18, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"ぱじゃま", romaji:"pajama", kr:"잠옷", emoji:"👘", level:18, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"みずぎ", romaji:"mizugi", kr:"수영복", emoji:"🩱", level:24, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"ねくたい", romaji:"nekutai", kr:"넥타이", emoji:"👔", level:24, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"ゆびわ", romaji:"yubiwa", kr:"반지", emoji:"💍", level:24, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"さいふ", romaji:"saifu", kr:"지갑", emoji:"👛", level:24, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"かんむり", romaji:"kanmuri", kr:"왕관", emoji:"👑", level:18, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"いす", romaji:"isu", kr:"의자", emoji:"🪑", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"てーぶる", romaji:"teeburu", kr:"테이블", emoji:"🍽️", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"べっど", romaji:"beddo", kr:"침대", emoji:"🛏️", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"そふぁ", romaji:"sofa", kr:"소파", emoji:"🛋️", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"でんわ", romaji:"denwa", kr:"전화", emoji:"☎️", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"てれび", romaji:"terebi", kr:"텔레비전", emoji:"📺", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"れいぞうこ", romaji:"reizouko", kr:"냉장고", emoji:"🧊", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"せんたくき", romaji:"sentakuki", kr:"세탁기", emoji:"🧺", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ごみばこ", romaji:"gomibako", kr:"쓰레기통", emoji:"🗑️", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"かがみ", romaji:"kagami", kr:"거울", emoji:"🪞", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"らんぷ", romaji:"ranpu", kr:"램프", emoji:"🪔", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ろうそく", romaji:"rousoku", kr:"양초", emoji:"🕯️", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"はさみ", romaji:"hasami", kr:"가위", emoji:"✂️", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ふでばこ", romaji:"fudebako", kr:"필통", emoji:"🖊️", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"えんぴつ", romaji:"enpitsu", kr:"연필", emoji:"✏️", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"くれよん", romaji:"kureyon", kr:"크레용", emoji:"🖍️", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"のり", romaji:"nori", kr:"풀(접착)", emoji:"🖇️", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"しんぶん", romaji:"shinbun", kr:"신문", emoji:"📰", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"てがみ", romaji:"tegami", kr:"편지", emoji:"✉️", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ぷれぜんと", romaji:"purezento", kr:"선물", emoji:"🎁", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ふうとう", romaji:"fuutou", kr:"봉투", emoji:"✉️", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"がくしゅう", romaji:"gakushuu", kr:"공부", emoji:"📖", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"こくばん", romaji:"kokuban", kr:"칠판", emoji:"📋", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"つくえ", romaji:"tsukue", kr:"책상", emoji:"🗄️", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"らんどせる", romaji:"randoseru", kr:"책가방", emoji:"🎒", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"さっかー", romaji:"sakkaa", kr:"축구", emoji:"⚽", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"やきゅう", romaji:"yakyuu", kr:"야구", emoji:"⚾", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ばすけ", romaji:"basuke", kr:"농구", emoji:"🏀", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"てにす", romaji:"tenisu", kr:"테니스", emoji:"🎾", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"すいえい", romaji:"suiei", kr:"수영", emoji:"🏊", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"すきー", romaji:"sukii", kr:"스키", emoji:"⛷️", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ぼうりんぐ", romaji:"bouringu", kr:"볼링", emoji:"🎳", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"たこあげ", romaji:"takoage", kr:"연날리기", emoji:"🪁", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"しゃぼんだま", romaji:"shabondama", kr:"비눗방울", emoji:"🫧", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ぴあの", romaji:"piano", kr:"피아노", emoji:"🎹", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"たいこ", romaji:"taiko", kr:"북", emoji:"🥁", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ぎたー", romaji:"gitaa", kr:"기타", emoji:"🎸", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"らっぱ", romaji:"rappa", kr:"나팔", emoji:"🎺", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"バイオリン", romaji:"baiorin", kr:"바이올린", emoji:"🎻", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"すず", romaji:"suzu", kr:"방울", emoji:"🔔", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"たんばりん", romaji:"tanbarin", kr:"탬버린", emoji:"🪘", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"びょういん", romaji:"byouin", kr:"병원", emoji:"🏥", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"こうえん", romaji:"kouen", kr:"공원", emoji:"🏞️", level:18, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"すーぱー", romaji:"suupaa", kr:"슈퍼마켓", emoji:"🏪", level:18, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"としょかん", romaji:"toshokan", kr:"도서관", emoji:"📚", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"どうぶつえん", romaji:"doubutsuen", kr:"동물원", emoji:"🦁", level:18, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"すいぞくかん", romaji:"suizokukan", kr:"수족관", emoji:"🐠", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"えき", romaji:"eki", kr:"역", emoji:"🚉", level:18, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"くうこう", romaji:"kuukou", kr:"공항", emoji:"✈️", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"じんじゃ", romaji:"jinja", kr:"신사", emoji:"⛩️", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"おしろ", romaji:"oshiro", kr:"성", emoji:"🏰", level:18, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"たわー", romaji:"tawaa", kr:"타워", emoji:"🗼", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"きょうかい", romaji:"kyoukai", kr:"교회", emoji:"⛪", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"にじ", romaji:"niji", kr:"무지개", emoji:"🌈", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"かみなり", romaji:"kaminari", kr:"천둥번개", emoji:"⚡", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"たいふう", romaji:"taifuu", kr:"태풍", emoji:"🌀", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"ゆきだるま", romaji:"yukidaruma", kr:"눈사람", emoji:"⛄", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"もり", romaji:"mori", kr:"숲", emoji:"🌲", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"しま", romaji:"shima", kr:"섬", emoji:"🏝️", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"たき", romaji:"taki", kr:"폭포", emoji:"💧", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"いわ", romaji:"iwa", kr:"바위", emoji:"🪨", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"すな", romaji:"suna", kr:"모래", emoji:"🏖️", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"つち", romaji:"tsuchi", kr:"흙", emoji:"🟤", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"ちきゅう", romaji:"chikyuu", kr:"지구", emoji:"🌍", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"うちゅう", romaji:"uchuu", kr:"우주", emoji:"🌌", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"わくせい", romaji:"wakusei", kr:"행성", emoji:"🪐", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"きょう", romaji:"kyou", kr:"오늘", emoji:"📅", level:24, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"あした", romaji:"ashita", kr:"내일", emoji:"🌅", level:24, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"よる", romaji:"yoru", kr:"밤", emoji:"🌙", level:18, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"あさ", romaji:"asa", kr:"아침", emoji:"🌄", level:18, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"ひる", romaji:"hiru", kr:"낮", emoji:"🌞", level:18, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"まる", romaji:"maru", kr:"동그라미", emoji:"⚪", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"さんかく", romaji:"sankaku", kr:"세모", emoji:"🔺", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"しかく", romaji:"shikaku", kr:"네모", emoji:"🟦", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"はーと", romaji:"haato", kr:"하트", emoji:"❤️", level:12, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"むらさき", romaji:"murasaki", kr:"보라", emoji:"🟣", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"ちゃいろ", romaji:"chairo", kr:"갈색", emoji:"🟤", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"しろ", romaji:"shiro", kr:"하양", emoji:"⚪", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"くろ", romaji:"kuro", kr:"검정", emoji:"⚫", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"ぴんく", romaji:"pinku", kr:"분홍", emoji:"🩷", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"よん", romaji:"yon", kr:"넷(4)", emoji:"4️⃣", level:18, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"ご", romaji:"go", kr:"다섯(5)", emoji:"5️⃣", level:18, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"ろく", romaji:"roku", kr:"여섯(6)", emoji:"6️⃣", level:24, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"なな", romaji:"nana", kr:"일곱(7)", emoji:"7️⃣", level:24, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"きゅう", romaji:"kyuu", kr:"아홉(9)", emoji:"9️⃣", level:24, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"じゅう", romaji:"juu", kr:"열(10)", emoji:"🔟", level:24, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"にこにこ", romaji:"nikoniko", kr:"방긋(웃음)", emoji:"😊", level:18, category:"emotions", pos:"adv", jlpt:"N5"},
  {jp:"わくわく", romaji:"wakuwaku", kr:"두근두근", emoji:"🤩", level:24, category:"emotions", pos:"adv", jlpt:"N5"},
  {jp:"おこる", romaji:"okoru", kr:"화나다", emoji:"😠", level:24, category:"emotions", pos:"verb", jlpt:"N5"},
  {jp:"びっくり", romaji:"bikkuri", kr:"깜짝", emoji:"😲", level:18, category:"emotions", pos:"adv", jlpt:"N5"},
  {jp:"ねむい", romaji:"nemui", kr:"졸리다", emoji:"😴", level:18, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"げんき", romaji:"genki", kr:"건강해요", emoji:"💪", level:18, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"だいすき", romaji:"daisuki", kr:"정말 좋아해", emoji:"😍", level:18, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"おにいちゃん", romaji:"oniichan", kr:"형/오빠", emoji:"👦", level:18, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"おねえちゃん", romaji:"oneechan", kr:"누나/언니", emoji:"👧", level:18, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"おとこのこ", romaji:"otokonoko", kr:"남자아이", emoji:"👦", level:18, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"おんなのこ", romaji:"onnanoko", kr:"여자아이", emoji:"👧", level:18, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"せんせい", romaji:"sensei", kr:"선생님", emoji:"🧑‍🏫", level:24, category:"people", pos:"noun", jlpt:"N5"},
  {jp:"おいしゃさん", romaji:"oishasan", kr:"의사 선생님", emoji:"👩‍⚕️", level:24, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"けいかん", romaji:"keikan", kr:"경찰관", emoji:"👮", level:18, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"しょうぼうし", romaji:"shouboushi", kr:"소방관", emoji:"👨‍🚒", level:18, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"こっく", romaji:"kokku", kr:"요리사", emoji:"👨‍🍳", level:24, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"でんきゅう", romaji:"denkyuu", kr:"전구", emoji:"💡", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"かめら", romaji:"kamera", kr:"카메라", emoji:"📷", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"けいたい", romaji:"keitai", kr:"휴대폰", emoji:"📱", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ぱそこん", romaji:"pasokon", kr:"컴퓨터", emoji:"💻", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"じしゃく", romaji:"jishaku", kr:"자석", emoji:"🧲", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"ふうりん", romaji:"fuurin", kr:"풍경(바람종)", emoji:"🎐", level:24, category:"greetings", pos:"noun", jlpt:"N5"},
  {jp:"たいまつ", romaji:"taimatsu", kr:"횃불", emoji:"🔦", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"わらいなき", romaji:"warainaki", kr:"웃프다", emoji:"😂", level:24, category:"emotions", pos:"noun", jlpt:"N5"},
  {jp:"キス", romaji:"kisu", kr:"뽀뽀", emoji:"😘", level:18, category:"greetings", pos:"noun", jlpt:"N5"},
  {jp:"おこりんぼ", romaji:"okorinbo", kr:"심술쟁이", emoji:"😤", level:24, category:"emotions", pos:"noun", jlpt:"N5"},
  {jp:"なきむし", romaji:"nakimushi", kr:"울보", emoji:"😭", level:18, category:"emotions", pos:"noun", jlpt:"N5"},
  {jp:"てれる", romaji:"tereru", kr:"부끄러워하다", emoji:"😳", level:24, category:"emotions", pos:"verb", jlpt:"N5"},
  {jp:"かんがえる", romaji:"kangaeru", kr:"생각하다", emoji:"🤔", level:24, category:"emotions", pos:"verb", jlpt:"N5"},
  {jp:"あくび", romaji:"akubi", kr:"하품", emoji:"🥱", level:18, category:"emotions", pos:"noun", jlpt:"N5"},
  {jp:"びょうき", romaji:"byouki", kr:"아프다", emoji:"🤒", level:24, category:"emotions", pos:"noun", jlpt:"N5"},
  {jp:"けが", romaji:"kega", kr:"다치다", emoji:"🤕", level:24, category:"emotions", pos:"noun", jlpt:"N5"},
  {jp:"マスク", romaji:"masuku", kr:"마스크", emoji:"😷", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"さむい", romaji:"samui", kr:"춥다", emoji:"🥶", level:18, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"あつい", romaji:"atsui", kr:"덥다", emoji:"🥵", level:18, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"はなたば", romaji:"hanataba", kr:"꽃다발", emoji:"💐", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"けーき", romaji:"keeki", kr:"케이크", emoji:"🎂", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"くらっかー", romaji:"kurakkaa", kr:"축하폭죽", emoji:"🎉", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"りぼん", romaji:"ribon", kr:"리본", emoji:"🎀", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"めだる", romaji:"medaru", kr:"메달", emoji:"🏅", level:24, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"とろふぃー", romaji:"torofii", kr:"트로피", emoji:"🏆", level:24, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"はた", romaji:"hata", kr:"깃발", emoji:"🚩", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"にほんのはた", romaji:"nihonnohata", kr:"일본 국기", emoji:"🇯🇵", level:24, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"かんこくのはた", romaji:"kankokunohata", kr:"한국 국기", emoji:"🇰🇷", level:24, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"ほうき", romaji:"houki", kr:"빗자루", emoji:"🧹", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"ばけつ", romaji:"baketsu", kr:"양동이", emoji:"🪣", level:18, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"すぽんじ", romaji:"suponji", kr:"스펀지", emoji:"🧽", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"かなづち", romaji:"kanazuchi", kr:"망치", emoji:"🔨", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"どらいばー", romaji:"doraibaa", kr:"드라이버", emoji:"🪛", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"のこぎり", romaji:"nokogiri", kr:"톱", emoji:"🪚", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"はしご", romaji:"hashigo", kr:"사다리", emoji:"🪜", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"すいっち", romaji:"suicchi", kr:"스위치", emoji:"🔌", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"でんち", romaji:"denchi", kr:"건전지", emoji:"🔋", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"いま", romaji:"ima", kr:"지금", emoji:"⏱️", level:24, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"まいにち", romaji:"mainichi", kr:"매일", emoji:"🗓️", level:24, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"たんじょうび", romaji:"tanjoubi", kr:"생일", emoji:"🎂", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"くりすます", romaji:"kurisumasu", kr:"크리스마스", emoji:"🎄", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"はろうぃん", romaji:"harowin", kr:"할로윈", emoji:"🎃", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"はなび", romaji:"hanabi", kr:"불꽃놀이", emoji:"🎆", level:18, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"まつり", romaji:"matsuri", kr:"축제", emoji:"🏮", level:24, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"さくら", romaji:"sakura", kr:"벚꽃", emoji:"🌸", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"ひまわり", romaji:"himawari", kr:"해바라기", emoji:"🌻", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"ちゅーりっぷ", romaji:"chuurippu", kr:"튤립", emoji:"🌷", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"たんぽぽ", romaji:"tanpopo", kr:"민들레", emoji:"🌼", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"えだ", romaji:"eda", kr:"나뭇가지", emoji:"🌿", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"たね", romaji:"tane", kr:"씨앗", emoji:"🌱", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"きのこ", romaji:"kinoko", kr:"버섯", emoji:"🍄", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"まつぼっくり", romaji:"matsubokkuri", kr:"솔방울", emoji:"🌰", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"うちゅうひこうし", romaji:"uchuuhikoushi", kr:"우주비행사", emoji:"🧑‍🚀", level:24, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"がか", romaji:"gaka", kr:"화가", emoji:"🧑‍🎨", level:24, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"かしゅ", romaji:"kashu", kr:"가수", emoji:"🧑‍🎤", level:24, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"のうふ", romaji:"noufu", kr:"농부", emoji:"🧑‍🌾", level:24, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"だいく", romaji:"daiku", kr:"목수", emoji:"👷", level:24, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"うんてんしゅ", romaji:"untenshu", kr:"운전기사", emoji:"👨‍✈️", level:24, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"じゃんぐるじむ", romaji:"janngurujimu", kr:"정글짐", emoji:"🧗", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"たいそう", romaji:"taisou", kr:"체조", emoji:"🤸", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"だんす", romaji:"dansu", kr:"춤", emoji:"💃", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"けーぶるかー", romaji:"keeburukaa", kr:"케이블카", emoji:"🚡", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ふぇりー", romaji:"ferii", kr:"페리", emoji:"⛴️", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ようと", romaji:"youto", kr:"요트", emoji:"⛵", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"きゃんぴんぐかー", romaji:"kyanpingukaa", kr:"캠핑카", emoji:"🚐", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ゆうらんしゃ", romaji:"yuuransha", kr:"관람차", emoji:"🎡", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"じぇっとこーすたー", romaji:"jettokoosutaa", kr:"롤러코스터", emoji:"🎢", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"よーよー", romaji:"yooyoo", kr:"요요", emoji:"🪀", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"はっぱ", romaji:"happa", kr:"나뭇잎", emoji:"🍃", level:18, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"かいてんもくば", romaji:"kaitenmokuba", kr:"회전목마", emoji:"🎠", level:18, category:"toys", pos:"noun", jlpt:"N5"},

  /* ▼ 36개월 전후(만 3세) 아이가 실제로 쓰는 일본어 단어 추가분 */
  // 성질 형용사
  {jp:"おおきい", romaji:"ookii", kr:"크다", emoji:"🐘", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"ちいさい", romaji:"chiisai", kr:"작다", emoji:"🐜", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"ながい", romaji:"nagai", kr:"길다", emoji:"🐍", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"みじかい", romaji:"mijikai", kr:"짧다", emoji:"🩳", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"たかい", romaji:"takai", kr:"높다(비싸다)", emoji:"🦒", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"ひくい", romaji:"hikui", kr:"낮다", emoji:"🔽", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"はやい", romaji:"hayai", kr:"빠르다", emoji:"🐆", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"おそい", romaji:"osoi", kr:"느리다", emoji:"🐢", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"おもい", romaji:"omoi", kr:"무겁다", emoji:"🏋️", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"かるい", romaji:"karui", kr:"가볍다", emoji:"🪶", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"つよい", romaji:"tsuyoi", kr:"강하다", emoji:"💪", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"よわい", romaji:"yowai", kr:"약하다", emoji:"🥺", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"あかるい", romaji:"akarui", kr:"밝다", emoji:"🔆", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"くらい", romaji:"kurai", kr:"어둡다", emoji:"🌑", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"きれい", romaji:"kirei", kr:"예쁘다(깨끗하다)", emoji:"✨", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"きたない", romaji:"kitanai", kr:"더럽다", emoji:"💩", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"あたらしい", romaji:"atarashii", kr:"새것", emoji:"🆕", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"ふるい", romaji:"furui", kr:"낡다", emoji:"🏚️", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"やさしい", romaji:"yasashii", kr:"다정하다", emoji:"🥰", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"むずかしい", romaji:"muzukashii", kr:"어렵다", emoji:"😵", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"たのしい", romaji:"tanoshii", kr:"즐겁다", emoji:"🎉", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"おおい", romaji:"ooi", kr:"많다", emoji:"🔼", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"すくない", romaji:"sukunai", kr:"적다", emoji:"➖", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"おなじ", romaji:"onaji", kr:"같다", emoji:"🟰", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"ちがう", romaji:"chigau", kr:"다르다", emoji:"🔀", level:36, category:"adjectives", pos:"verb", jlpt:"N5"},

  // 의문사
  {jp:"だれ", romaji:"dare", kr:"누구", emoji:"🙋", level:30, category:"position", pos:"pron", jlpt:"N5"},
  {jp:"なに", romaji:"nani", kr:"무엇", emoji:"❓", level:30, category:"position", pos:"pron", jlpt:"N5"},
  {jp:"どこ", romaji:"doko", kr:"어디", emoji:"📍", level:30, category:"position", pos:"pron", jlpt:"N5"},
  {jp:"いつ", romaji:"itsu", kr:"언제", emoji:"🕐", level:30, category:"position", pos:"pron", jlpt:"N5"},
  {jp:"どうして", romaji:"doushite", kr:"왜", emoji:"🤔", level:30, category:"position", pos:"adv", jlpt:"N5"},
  {jp:"どっち", romaji:"docchi", kr:"어느 것", emoji:"🤷", level:30, category:"position", pos:"pron", jlpt:"N5"},

  // 계절 & 시간
  {jp:"はる", romaji:"haru", kr:"봄", emoji:"🌸", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"なつ", romaji:"natsu", kr:"여름", emoji:"🏖️", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"あき", romaji:"aki", kr:"가을", emoji:"🍁", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"ふゆ", romaji:"fuyu", kr:"겨울", emoji:"⛄", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"きのう", romaji:"kinou", kr:"어제", emoji:"⏮️", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"ゆう", romaji:"yuu", kr:"저녁", emoji:"🌆", level:30, category:"season", pos:"noun", jlpt:"N5"},

  // 위치 & 공간
  {jp:"うえ", romaji:"ue", kr:"위", emoji:"⬆️", level:30, category:"position", pos:"noun", jlpt:"N5"},
  {jp:"なか", romaji:"naka", kr:"안", emoji:"📦", level:30, category:"position", pos:"noun", jlpt:"N5"},
  {jp:"そと", romaji:"soto", kr:"밖", emoji:"🚪", level:30, category:"position", pos:"noun", jlpt:"N5"},
  {jp:"まえ", romaji:"mae", kr:"앞", emoji:"⏩", level:30, category:"position", pos:"noun", jlpt:"N5"},
  {jp:"うしろ", romaji:"ushiro", kr:"뒤", emoji:"⏪", level:30, category:"position", pos:"noun", jlpt:"N5"},
  {jp:"よこ", romaji:"yoko", kr:"옆", emoji:"↔️", level:30, category:"position", pos:"noun", jlpt:"N5"},
  {jp:"あいだ", romaji:"aida", kr:"사이", emoji:"🔲", level:30, category:"position", pos:"noun", jlpt:"N5"},

  // 가족 확장 호칭
  {jp:"いもうと", romaji:"imouto", kr:"여동생", emoji:"👧", level:30, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"おとうと", romaji:"otouto", kr:"남동생", emoji:"👦", level:30, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"おじさん", romaji:"ojisan", kr:"아저씨(삼촌)", emoji:"🧔", level:30, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"おばさん", romaji:"obasan", kr:"아주머니(이모)", emoji:"👩‍🦳", level:30, category:"family", pos:"noun", jlpt:"N5"},

  // 신체 부위 확장
  {jp:"おなか", romaji:"onaka", kr:"배", emoji:"🫃", level:30, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"おしり", romaji:"oshiri", kr:"엉덩이", emoji:"🍑", level:30, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"ひじ", romaji:"hiji", kr:"팔꿈치", emoji:"🦾", level:30, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"くび", romaji:"kubi", kr:"목", emoji:"🧣", level:30, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"ほっぺ", romaji:"hoppe", kr:"볼", emoji:"😊", level:30, category:"body", pos:"noun", jlpt:"N5"},

  // 감정 확장
  {jp:"うれしい", romaji:"ureshii", kr:"기쁘다", emoji:"😆", level:36, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"かなしい", romaji:"kanashii", kr:"슬프다", emoji:"😢", level:36, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"こわい", romaji:"kowai", kr:"무섭다", emoji:"😱", level:36, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"いたい", romaji:"itai", kr:"아프다", emoji:"🤕", level:36, category:"emotions", pos:"adj", jlpt:"N5"},

  // 동사 확장
  {jp:"つくる", romaji:"tsukuru", kr:"만들다", emoji:"🛠️", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"かく", romaji:"kaku", kr:"그리다(쓰다)", emoji:"✏️", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"きる", romaji:"kiru", kr:"자르다(입다)", emoji:"✂️", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"あらう", romaji:"arau", kr:"씻다", emoji:"🧼", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"きがえる", romaji:"kigaeru", kr:"옷 갈아입다", emoji:"👕", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"てつだう", romaji:"tetsudau", kr:"돕다", emoji:"🤝", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"まつ", romaji:"matsu", kr:"기다리다", emoji:"⏳", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"はなす", romaji:"hanasu", kr:"말하다", emoji:"🗣️", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"きく", romaji:"kiku", kr:"듣다", emoji:"👂", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"わかる", romaji:"wakaru", kr:"알다", emoji:"💡", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"とぶ", romaji:"tobu", kr:"날다", emoji:"🐦", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"およぐ", romaji:"oyogu", kr:"수영하다", emoji:"🏊", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"のぼる", romaji:"noboru", kr:"오르다", emoji:"🧗", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"おりる", romaji:"oriru", kr:"내리다", emoji:"⬇️", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"おす", romaji:"osu", kr:"밀다", emoji:"👉", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"ひく", romaji:"hiku", kr:"당기다", emoji:"👈", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"なげる", romaji:"nageru", kr:"던지다", emoji:"🤾", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"とる", romaji:"toru", kr:"잡다(찍다)", emoji:"📷", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"さがす", romaji:"sagasu", kr:"찾다", emoji:"🔍", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"かくれる", romaji:"kakureru", kr:"숨다", emoji:"🙈", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"わたす", romaji:"watasu", kr:"건네다", emoji:"🤲", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"あげる", romaji:"ageru", kr:"주다", emoji:"🎁", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"もらう", romaji:"morau", kr:"받다", emoji:"🙌", level:36, category:"verbs", pos:"verb", jlpt:"N5"},

  // 기타 (음식/명사)
  {jp:"ごはん", romaji:"gohan", kr:"밥", emoji:"🍚", level:30, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"いろ", romaji:"iro", kr:"색", emoji:"🎨", level:30, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"かず", romaji:"kazu", kr:"수(개수)", emoji:"🔢", level:30, category:"numbers", pos:"noun", jlpt:"N5"},

  /* ▼ N4·N5 어휘 보강분 (2026-07 추가) */
  {jp:"にじゅう", romaji:"nijuu", kr:"스물(20)", emoji:"2️⃣0️⃣", level:30, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"さんじゅう", romaji:"sanjuu", kr:"서른(30)", emoji:"3️⃣0️⃣", level:30, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"ひゃく", romaji:"hyaku", kr:"백(100)", emoji:"💯", level:30, category:"numbers", pos:"num", jlpt:"N5"},
  {jp:"げつようび", romaji:"getsuyoubi", kr:"월요일", emoji:"📅", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"かようび", romaji:"kayoubi", kr:"화요일", emoji:"📅", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"すいようび", romaji:"suiyoubi", kr:"수요일", emoji:"📅", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"もくようび", romaji:"mokuyoubi", kr:"목요일", emoji:"📅", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"きんようび", romaji:"kinyoubi", kr:"금요일", emoji:"📅", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"どようび", romaji:"doyoubi", kr:"토요일", emoji:"📅", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"にちようび", romaji:"nichiyoubi", kr:"일요일", emoji:"📅", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"せんしゅう", romaji:"senshuu", kr:"지난주", emoji:"📆", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"らいしゅう", romaji:"raishuu", kr:"다음주", emoji:"📆", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"こんしゅう", romaji:"konshuu", kr:"이번주", emoji:"📆", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"まいしゅう", romaji:"maishuu", kr:"매주", emoji:"📆", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"せんげつ", romaji:"sengetsu", kr:"지난달", emoji:"🗓️", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"らいげつ", romaji:"raigetsu", kr:"다음달", emoji:"🗓️", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"こんげつ", romaji:"kongetsu", kr:"이번달", emoji:"🗓️", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"きょねん", romaji:"kyonen", kr:"작년", emoji:"🗓️", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"らいねん", romaji:"rainen", kr:"내년", emoji:"🗓️", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"ことし", romaji:"kotoshi", kr:"올해", emoji:"🗓️", level:30, category:"season", pos:"noun", jlpt:"N5"},
  {jp:"てんき", romaji:"tenki", kr:"날씨", emoji:"🌤️", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"くもり", romaji:"kumori", kr:"흐림", emoji:"☁️", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"はれ", romaji:"hare", kr:"맑음", emoji:"☀️", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"かう", romaji:"kau", kr:"사다", emoji:"🛒", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"うる", romaji:"uru", kr:"팔다", emoji:"💰", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"はたらく", romaji:"hataraku", kr:"일하다", emoji:"💼", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"やすむ", romaji:"yasumu", kr:"쉬다", emoji:"😌", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"はじまる", romaji:"hajimaru", kr:"시작되다", emoji:"▶️", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"おわる", romaji:"owaru", kr:"끝나다", emoji:"⏹️", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"つかう", romaji:"tsukau", kr:"사용하다", emoji:"🔧", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"もつ", romaji:"motsu", kr:"들다(가지다)", emoji:"✋", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"わすれる", romaji:"wasureru", kr:"잊다", emoji:"😅", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"おぼえる", romaji:"oboeru", kr:"기억하다", emoji:"🧠", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"かりる", romaji:"kariru", kr:"빌리다", emoji:"🙏", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"かす", romaji:"kasu", kr:"빌려주다", emoji:"🤝", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"おくる", romaji:"okuru", kr:"보내다", emoji:"📤", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"とどく", romaji:"todoku", kr:"도착하다", emoji:"📬", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"よぶ", romaji:"yobu", kr:"부르다", emoji:"📢", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"けす", romaji:"kesu", kr:"끄다(지우다)", emoji:"⚫", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"はいる", romaji:"hairu", kr:"들어가다", emoji:"🚪", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"でる", romaji:"deru", kr:"나가다", emoji:"🚪", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"あがる", romaji:"agaru", kr:"올라가다", emoji:"⬆️", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"さがる", romaji:"sagaru", kr:"내려가다", emoji:"⬇️", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"わたる", romaji:"wataru", kr:"건너다", emoji:"🚸", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"まがる", romaji:"magaru", kr:"돌다(꺾다)", emoji:"↩️", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"とまる", romaji:"tomaru", kr:"멈추다", emoji:"🛑", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"うごく", romaji:"ugoku", kr:"움직이다", emoji:"🏃", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"かえす", romaji:"kaesu", kr:"돌려주다", emoji:"🔁", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"なおす", romaji:"naosu", kr:"고치다", emoji:"🔧", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"こわす", romaji:"kowasu", kr:"부수다", emoji:"💥", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"つかれる", romaji:"tsukareru", kr:"피곤하다", emoji:"😪", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"しる", romaji:"shiru", kr:"알다", emoji:"💡", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"おもう", romaji:"omou", kr:"생각하다", emoji:"💭", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"すむ", romaji:"sumu", kr:"살다(거주하다)", emoji:"🏠", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"うまれる", romaji:"umareru", kr:"태어나다", emoji:"👶", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"うたう", romaji:"utau", kr:"노래하다", emoji:"🎤", level:36, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"おどる", romaji:"odoru", kr:"춤추다", emoji:"💃", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"さわる", romaji:"sawaru", kr:"만지다", emoji:"👆", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"きえる", romaji:"kieru", kr:"사라지다", emoji:"💨", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"やすい", romaji:"yasui", kr:"싸다", emoji:"💰", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"べんりな", romaji:"benrina", kr:"편리하다", emoji:"👍", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"ふべんな", romaji:"fubenna", kr:"불편하다", emoji:"👎", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"かんたんな", romaji:"kantanna", kr:"쉽다(간단하다)", emoji:"✅", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"たいへんな", romaji:"taihenna", kr:"힘들다", emoji:"😥", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"たいせつな", romaji:"taisetsuna", kr:"소중하다", emoji:"❤️", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"ゆうめいな", romaji:"yuumeina", kr:"유명하다", emoji:"🌟", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"しんせつな", romaji:"shinsetsuna", kr:"친절하다", emoji:"🤗", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"しずかな", romaji:"shizukana", kr:"조용하다", emoji:"🤫", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"にぎやかな", romaji:"nigiyakana", kr:"북적이다(활기차다)", emoji:"🎉", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"じょうずな", romaji:"jouzuna", kr:"잘하다(능숙하다)", emoji:"👏", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"へたな", romaji:"hetana", kr:"서투르다", emoji:"😅", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"すきな", romaji:"sukina", kr:"좋아하다", emoji:"💗", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"きらいな", romaji:"kiraina", kr:"싫어하다", emoji:"👎", level:36, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"ひまな", romaji:"himana", kr:"한가하다", emoji:"🛌", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"いそがしい", romaji:"isogashii", kr:"바쁘다", emoji:"😰", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"ゆうびんきょく", romaji:"yuubinkyoku", kr:"우체국", emoji:"📮", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"ぎんこう", romaji:"ginkou", kr:"은행", emoji:"🏦", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"やっきょく", romaji:"yakkyoku", kr:"약국", emoji:"💊", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"びよういん", romaji:"biyouin", kr:"미용실", emoji:"💇", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"とこや", romaji:"tokoya", kr:"이발소", emoji:"💈", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"でぱーと", romaji:"depaato", kr:"백화점", emoji:"🏬", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"いちば", romaji:"ichiba", kr:"시장", emoji:"🏪", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"こうばん", romaji:"kouban", kr:"파출소", emoji:"🚨", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"きょうしつ", romaji:"kyoushitsu", kr:"교실", emoji:"🏫", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"じしょ", romaji:"jisho", kr:"사전", emoji:"📔", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"きょうかしょ", romaji:"kyoukasho", kr:"교과서", emoji:"📘", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"のーと", romaji:"nooto", kr:"공책", emoji:"📓", level:30, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"しゅくだい", romaji:"shukudai", kr:"숙제", emoji:"📝", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"じゅぎょう", romaji:"jugyou", kr:"수업", emoji:"🏫", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"しけん", romaji:"shiken", kr:"시험", emoji:"📝", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"もんだい", romaji:"mondai", kr:"문제", emoji:"❓", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"こたえ", romaji:"kotae", kr:"대답", emoji:"💬", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"しつもん", romaji:"shitsumon", kr:"질문", emoji:"❓", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"りょうしん", romaji:"ryoushin", kr:"부모님", emoji:"👪", level:42, category:"family", pos:"noun", jlpt:"N4"},
  {jp:"きょうだい", romaji:"kyoudai", kr:"형제자매", emoji:"👫", level:42, category:"family", pos:"noun", jlpt:"N4"},
  {jp:"かぞく", romaji:"kazoku", kr:"가족", emoji:"👨‍👩‍👧‍👦", level:30, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"こども", romaji:"kodomo", kr:"아이", emoji:"🧒", level:30, category:"family", pos:"noun", jlpt:"N5"},
  {jp:"かいしゃ", romaji:"kaisha", kr:"회사", emoji:"🏢", level:30, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"しごと", romaji:"shigoto", kr:"일(직업)", emoji:"💼", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"くすり", romaji:"kusuri", kr:"약", emoji:"💊", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"きっぷ", romaji:"kippu", kr:"표(승차권)", emoji:"🎫", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"ちず", romaji:"chizu", kr:"지도", emoji:"🗺️", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"にもつ", romaji:"nimotsu", kr:"짐", emoji:"🧳", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"かいぎ", romaji:"kaigi", kr:"회의", emoji:"🗣️", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"やくそく", romaji:"yakusoku", kr:"약속", emoji:"🤝", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"じゅんび", romaji:"junbi", kr:"준비", emoji:"🧰", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"よてい", romaji:"yotei", kr:"예정", emoji:"📅", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"きもち", romaji:"kimochi", kr:"기분(느낌)", emoji:"💓", level:42, category:"emotions", pos:"noun", jlpt:"N4"},
  {jp:"しゅみ", romaji:"shumi", kr:"취미", emoji:"🎨", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"いみ", romaji:"imi", kr:"의미", emoji:"💭", level:42, category:"household", pos:"noun", jlpt:"N4"},

  /* ▼ 교통·신체·감정 어휘 보강분 (2026-07 추가) */
  {jp:"のりもの", romaji:"norimono", kr:"탈것", emoji:"🚗", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"どうろ", romaji:"douro", kr:"도로", emoji:"🛣️", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"しんごう", romaji:"shingou", kr:"신호등", emoji:"🚦", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"はし", romaji:"hashi", kr:"다리(교량)", emoji:"🌉", level:42, category:"vehicles", pos:"noun", jlpt:"N4"},
  {jp:"ちかてつ", romaji:"chikatetsu", kr:"지하철", emoji:"🚇", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"しんかんせん", romaji:"shinkansen", kr:"신칸센(고속열차)", emoji:"🚄", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"とっきゅう", romaji:"tokkyuu", kr:"특급열차", emoji:"🚅", level:42, category:"vehicles", pos:"noun", jlpt:"N4"},
  {jp:"のりば", romaji:"noriba", kr:"승강장", emoji:"🚏", level:42, category:"vehicles", pos:"noun", jlpt:"N4"},
  {jp:"こうつう", romaji:"koutsuu", kr:"교통", emoji:"🚦", level:42, category:"vehicles", pos:"noun", jlpt:"N4"},
  {jp:"おうだんほどう", romaji:"oudanhodou", kr:"횡단보도", emoji:"🚸", level:42, category:"vehicles", pos:"noun", jlpt:"N4"},
  {jp:"かお", romaji:"kao", kr:"얼굴", emoji:"🙂", level:30, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"からだ", romaji:"karada", kr:"몸", emoji:"🧍", level:30, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"うで", romaji:"ude", kr:"팔", emoji:"💪", level:30, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"むね", romaji:"mune", kr:"가슴", emoji:"🫀", level:42, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"のど", romaji:"nodo", kr:"목(구멍)", emoji:"🗣️", level:42, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"くちびる", romaji:"kuchibiru", kr:"입술", emoji:"💋", level:42, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"ほね", romaji:"hone", kr:"뼈", emoji:"🦴", level:42, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"ち", romaji:"chi", kr:"피", emoji:"🩸", level:42, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"まゆげ", romaji:"mayuge", kr:"눈썹", emoji:"🤨", level:42, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"さびしい", romaji:"sabishii", kr:"외롭다", emoji:"😔", level:42, category:"emotions", pos:"adj", jlpt:"N4"},
  {jp:"しんぱいな", romaji:"shinpaina", kr:"걱정되다", emoji:"😟", level:42, category:"emotions", pos:"adj", jlpt:"N4"},
  {jp:"あんしんな", romaji:"anshinna", kr:"안심되다", emoji:"😌", level:42, category:"emotions", pos:"adj", jlpt:"N4"},
  {jp:"ふあんな", romaji:"fuanna", kr:"불안하다", emoji:"😰", level:42, category:"emotions", pos:"adj", jlpt:"N4"},
  {jp:"どきどき", romaji:"dokidoki", kr:"두근두근", emoji:"💓", level:36, category:"emotions", pos:"adv", jlpt:"N5"},
  {jp:"はずかしい", romaji:"hazukashii", kr:"부끄럽다", emoji:"🙈", level:42, category:"emotions", pos:"adj", jlpt:"N4"},
  {jp:"がっかり", romaji:"gakkari", kr:"실망하다", emoji:"😞", level:42, category:"emotions", pos:"adv", jlpt:"N4"},
  {jp:"つまらない", romaji:"tsumaranai", kr:"지루하다", emoji:"😑", level:42, category:"emotions", pos:"adj", jlpt:"N4"},
  {jp:"うるさい", romaji:"urusai", kr:"시끄럽다", emoji:"😖", level:42, category:"emotions", pos:"adj", jlpt:"N4"},
  {jp:"かわいい", romaji:"kawaii", kr:"귀엽다", emoji:"🥰", level:36, category:"emotions", pos:"adj", jlpt:"N5"},
  {jp:"すごい", romaji:"sugoi", kr:"대단하다", emoji:"😮", level:42, category:"emotions", pos:"adj", jlpt:"N4"},
  {jp:"だいじょうぶ", romaji:"daijoubu", kr:"괜찮다", emoji:"👌", level:36, category:"emotions", pos:"adj", jlpt:"N5"},
  // 🆕 JLPT N4 단어 추가 (설정에서 JLPT N4 필터로 확인 가능)
  {jp:"ともだち", romaji:"tomodachi", kr:"친구", emoji:"🧑‍🤝‍🧑", level:36, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"がくせい", romaji:"gakusei", kr:"학생", emoji:"🎓", level:42, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"かんごし", romaji:"kangoshi", kr:"간호사", emoji:"👩‍⚕️", level:36, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"せんしゅ", romaji:"senshu", kr:"선수", emoji:"🏅", level:36, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"はいゆう", romaji:"haiyuu", kr:"배우", emoji:"🎭", level:42, category:"people", pos:"noun", jlpt:"N4"},
  {jp:"むすこ", romaji:"musuko", kr:"아들", emoji:"👦", level:42, category:"family", pos:"noun", jlpt:"N4"},
  {jp:"むすめ", romaji:"musume", kr:"딸", emoji:"👧", level:42, category:"family", pos:"noun", jlpt:"N4"},
  {jp:"ちち", romaji:"chichi", kr:"아버지", emoji:"👨", level:42, category:"family", pos:"noun", jlpt:"N4"},
  {jp:"はは", romaji:"haha", kr:"어머니", emoji:"👩", level:42, category:"family", pos:"noun", jlpt:"N4"},
  {jp:"コンビニ", romaji:"konbini", kr:"편의점", emoji:"🏪", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"はくぶつかん", romaji:"hakubutsukan", kr:"박물관", emoji:"🏛️", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"えいがかん", romaji:"eigakan", kr:"영화관", emoji:"🎬", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"おてら", romaji:"otera", kr:"절", emoji:"🛕", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"ほんや", romaji:"honya", kr:"서점", emoji:"📚", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"はなや", romaji:"hanaya", kr:"꽃집", emoji:"💐", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"やおや", romaji:"yaoya", kr:"채소가게", emoji:"🥬", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"さかなや", romaji:"sakanaya", kr:"생선가게", emoji:"🐟", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"パンや", romaji:"panya", kr:"빵집", emoji:"🥖", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"じかん", romaji:"jikan", kr:"시간", emoji:"⏳", level:42, category:"season", pos:"noun", jlpt:"N4"},
  {jp:"ふん", romaji:"fun", kr:"분(시간)", emoji:"⏱️", level:42, category:"season", pos:"noun", jlpt:"N4"},
  {jp:"びょう", romaji:"byou", kr:"초(시간)", emoji:"⏲️", level:42, category:"season", pos:"noun", jlpt:"N4"},
  {jp:"おととい", romaji:"ototoi", kr:"그저께", emoji:"📅", level:42, category:"season", pos:"noun", jlpt:"N4"},
  {jp:"あさって", romaji:"asatte", kr:"모레", emoji:"📅", level:42, category:"season", pos:"noun", jlpt:"N4"},
  {jp:"きり", romaji:"kiri", kr:"안개", emoji:"🌫️", level:36, category:"nature", pos:"noun", jlpt:"N4"},
  {jp:"あんぜんな", romaji:"anzenna", kr:"안전하다", emoji:"🦺", level:30, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"きけんな", romaji:"kikenna", kr:"위험하다", emoji:"⚠️", level:30, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"ひつような", romaji:"hitsuyouna", kr:"필요하다", emoji:"🔖", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"まじめな", romaji:"majimena", kr:"성실하다", emoji:"🧐", level:42, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"けんこうな", romaji:"kenkouna", kr:"건강하다", emoji:"💪", level:36, category:"adjectives", pos:"adj", jlpt:"N4"},
  {jp:"がんばる", romaji:"ganbaru", kr:"힘내다", emoji:"💪", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"おどろく", romaji:"odoroku", kr:"놀라다", emoji:"😲", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"つづける", romaji:"tsuzukeru", kr:"계속하다", emoji:"🔄", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"はじめる", romaji:"hajimeru", kr:"시작하다", emoji:"▶️", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"おしえる", romaji:"oshieru", kr:"가르치다", emoji:"👩‍🏫", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"ならう", romaji:"narau", kr:"배우다", emoji:"📖", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"みつける", romaji:"mitsukeru", kr:"찾아내다", emoji:"🔍", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"こたえる", romaji:"kotaeru", kr:"대답하다", emoji:"💬", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"みがく", romaji:"migaku", kr:"닦다", emoji:"🪥", level:24, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"こまる", romaji:"komaru", kr:"곤란하다", emoji:"😥", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"よろこぶ", romaji:"yorokobu", kr:"기뻐하다", emoji:"😆", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"しんじる", romaji:"shinjiru", kr:"믿다", emoji:"🤞", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"おもいだす", romaji:"omoidasu", kr:"기억해내다", emoji:"💭", level:42, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"とめる", romaji:"tomeru", kr:"멈추다(세우다)", emoji:"🛑", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"のせる", romaji:"noseru", kr:"태우다(싣다)", emoji:"🚗", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"かざる", romaji:"kazaru", kr:"장식하다", emoji:"🎀", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"つつむ", romaji:"tsutsumu", kr:"포장하다(감싸다)", emoji:"🎁", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"わける", romaji:"wakeru", kr:"나누다", emoji:"➗", level:36, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"あつめる", romaji:"atsumeru", kr:"모으다", emoji:"🧺", level:30, category:"verbs", pos:"verb", jlpt:"N4"},
  {jp:"でんしれんじ", romaji:"denshirenji", kr:"전자레인지", emoji:"🔌", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"そうじき", romaji:"soujiki", kr:"청소기", emoji:"🧹", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"けしごむ", romaji:"keshigomu", kr:"지우개", emoji:"⬜", level:30, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"くうき", romaji:"kuuki", kr:"공기", emoji:"💨", level:42, category:"nature", pos:"noun", jlpt:"N4"},
  {jp:"におい", romaji:"nioi", kr:"냄새", emoji:"👃", level:36, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"あじ", romaji:"aji", kr:"맛", emoji:"👅", level:36, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"おと", romaji:"oto", kr:"소리", emoji:"🔊", level:36, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"こえ", romaji:"koe", kr:"목소리", emoji:"🗣️", level:36, category:"body", pos:"noun", jlpt:"N4"},
  {jp:"せん", romaji:"sen", kr:"천(1000)", emoji:"🔢", level:42, category:"numbers", pos:"num", jlpt:"N4"},
  {jp:"れんしゅう", romaji:"renshuu", kr:"연습", emoji:"📝", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"うんどう", romaji:"undou", kr:"운동", emoji:"🏃", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"さんぽ", romaji:"sanpo", kr:"산책", emoji:"🚶", level:24, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"りょこう", romaji:"ryokou", kr:"여행", emoji:"🧳", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"しゃしん", romaji:"shashin", kr:"사진", emoji:"📷", level:30, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"かいもの", romaji:"kaimono", kr:"쇼핑", emoji:"🛍️", level:30, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"せいかつ", romaji:"seikatsu", kr:"생활", emoji:"🏡", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"あいさつ", romaji:"aisatsu", kr:"인사", emoji:"🙇", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"けっこん", romaji:"kekkon", kr:"결혼", emoji:"💍", level:42, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"ゆめ", romaji:"yume", kr:"꿈", emoji:"💭", level:42, category:"emotions", pos:"noun", jlpt:"N4"},

  /* ================================================================
     이모지 표준 카테고리(동물 및 자연 / 음식 및 음료 / 여행 및 장소 / 활동 / 물건) 보강분
     기존 사전에 빠져 있던 대표 이모지 단어들을 폭넓게 추가했습니다. (2026-07 추가)
     ================================================================ */
  // 동물 및 자연 — 동물
  {jp:"おらんうーたん", romaji:"orangutan", kr:"오랑우탄", emoji:"🦧", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ばいそん", romaji:"baison", kr:"들소(바이슨)", emoji:"🦬", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"おうし", romaji:"oushi", kr:"황소", emoji:"🐂", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"すいぎゅう", romaji:"suigyuu", kr:"물소", emoji:"🐃", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"いのしし", romaji:"inoshishi", kr:"멧돼지", emoji:"🐗", level:30, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"らま", romaji:"rama", kr:"라마", emoji:"🦙", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"まんもす", romaji:"manmosu", kr:"매머드", emoji:"🦣", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"びーばー", romaji:"biibaa", kr:"비버", emoji:"🦫", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"あなぐま", romaji:"anaguma", kr:"오소리", emoji:"🦡", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"あしあと", romaji:"ashiato", kr:"발자국", emoji:"🐾", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ぺんぎん", romaji:"pengin", kr:"펭귄", emoji:"🐧", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"はくちょう", romaji:"hakuchou", kr:"백조", emoji:"🦢", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"どーどー", romaji:"doodoo", kr:"도도새", emoji:"🦤", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"わに", romaji:"wani", kr:"악어", emoji:"🐊", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"とかげ", romaji:"tokage", kr:"도마뱀", emoji:"🦎", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"りゅう", romaji:"ryuu", kr:"용", emoji:"🐉", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"きょうりゅう", romaji:"kyouryuu", kr:"공룡", emoji:"🦕", level:18, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"てぃらのさうるす", romaji:"tiranosaurusu", kr:"티라노사우루스", emoji:"🦖", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"ろぶすたー", romaji:"robusutaa", kr:"랍스터", emoji:"🦞", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"かき", romaji:"kaki", kr:"굴", emoji:"🦪", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"くも", romaji:"kumo", kr:"거미", emoji:"🕷️", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"くものす", romaji:"kumonosu", kr:"거미줄", emoji:"🕸️", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"さそり", romaji:"sasori", kr:"전갈", emoji:"🦂", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"か", romaji:"ka", kr:"모기", emoji:"🦟", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"はえ", romaji:"hae", kr:"파리", emoji:"🪰", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"みみず", romaji:"mimizu", kr:"지렁이", emoji:"🪱", level:24, category:"animals", pos:"noun", jlpt:"N5"},
  {jp:"びせいぶつ", romaji:"biseibutsu", kr:"미생물", emoji:"🦠", level:42, category:"animals", pos:"noun", jlpt:"N4"},
  {jp:"ごきぶり", romaji:"gokiburi", kr:"바퀴벌레", emoji:"🪳", level:36, category:"animals", pos:"noun", jlpt:"N5"},
  // 동물 및 자연 — 자연/날씨
  {jp:"ばら", romaji:"bara", kr:"장미", emoji:"🌹", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"はす", romaji:"hasu", kr:"연꽃", emoji:"🪷", level:36, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"はちうえ", romaji:"hachiue", kr:"화분", emoji:"🪴", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"やしのき", romaji:"yashinoki", kr:"야자수", emoji:"🌴", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"さぼてん", romaji:"saboten", kr:"선인장", emoji:"🌵", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"いね", romaji:"ine", kr:"벼", emoji:"🌾", level:36, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"よつばのくろーばー", romaji:"yotsuba no kuroobaa", kr:"네잎클로버", emoji:"🍀", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"おちば", romaji:"ochiba", kr:"낙엽", emoji:"🍂", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"まんげつ", romaji:"mangetsu", kr:"보름달", emoji:"🌕", level:24, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"じょうげんのつき", romaji:"jougen no tsuki", kr:"상현달", emoji:"🌓", level:42, category:"nature", pos:"noun", jlpt:"N4"},
  {jp:"かげんのつき", romaji:"kagen no tsuki", kr:"하현달", emoji:"🌗", level:42, category:"nature", pos:"noun", jlpt:"N4"},
  {jp:"おんどけい", romaji:"ondokei", kr:"온도계", emoji:"🌡️", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"うすぐもり", romaji:"usugumori", kr:"엷은 흐림", emoji:"⛅", level:36, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"たつまき", romaji:"tatsumaki", kr:"회오리바람", emoji:"🌪️", level:36, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"びーちぱらそる", romaji:"biichi parasoru", kr:"파라솔", emoji:"⛱️", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"すいせい", romaji:"suisei", kr:"혜성", emoji:"☄️", level:36, category:"nature", pos:"noun", jlpt:"N5"},
  // 음식 및 음료
  {jp:"はし", romaji:"hashi", kr:"젓가락", emoji:"🥢", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ふぉーくとないふ", romaji:"fooku to naifu", kr:"포크와 나이프", emoji:"🍴", level:24, category:"food", pos:"noun", jlpt:"N5"},
  {jp:"ほうちょう", romaji:"houchou", kr:"식칼", emoji:"🔪", level:36, category:"food", pos:"noun", jlpt:"N4"},
  {jp:"びん", romaji:"bin", kr:"병", emoji:"🫙", level:30, category:"food", pos:"noun", jlpt:"N5"},
  // 여행 및 장소 — 장소
  {jp:"にほんちず", romaji:"nihon chizu", kr:"일본지도", emoji:"🗾", level:36, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"らしんばん", romaji:"rashinban", kr:"나침반", emoji:"🧭", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"かざん", romaji:"kazan", kr:"화산", emoji:"🌋", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"ふじさん", romaji:"fujisan", kr:"후지산", emoji:"🗻", level:30, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"きゃんぷ", romaji:"kyanpu", kr:"캠핑", emoji:"🏕️", level:30, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"さばく", romaji:"sabaku", kr:"사막", emoji:"🏜️", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"きょうぎじょう", romaji:"kyougijou", kr:"경기장", emoji:"🏟️", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"こや", romaji:"koya", kr:"오두막", emoji:"🛖", level:36, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"ほてる", romaji:"hoteru", kr:"호텔", emoji:"🏨", level:30, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"こうじょう", romaji:"koujou", kr:"공장", emoji:"🏭", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"けっこんしき", romaji:"kekkonshiki", kr:"결혼식장", emoji:"💒", level:42, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"もすく", romaji:"mosuku", kr:"모스크", emoji:"🕌", level:42, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"しなごーぐ", romaji:"shinagoogu", kr:"시나고그", emoji:"🕍", level:42, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"ふんすい", romaji:"funsui", kr:"분수", emoji:"⛲", level:30, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"てんと", romaji:"tento", kr:"텐트", emoji:"⛺", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"とかい", romaji:"tokai", kr:"도시", emoji:"🏙️", level:36, category:"places", pos:"noun", jlpt:"N4"},
  {jp:"おんせん", romaji:"onsen", kr:"온천", emoji:"♨️", level:24, category:"places", pos:"noun", jlpt:"N5"},
  {jp:"さーかす", romaji:"saakasu", kr:"서커스", emoji:"🎪", level:30, category:"places", pos:"noun", jlpt:"N5"},
  // 여행 및 장소 — 탈것
  {jp:"ろめんでんしゃ", romaji:"romendensha", kr:"노면전차(트램)", emoji:"🚊", level:36, category:"vehicles", pos:"noun", jlpt:"N4"},
  {jp:"ものれーる", romaji:"monoreeru", kr:"모노레일", emoji:"🚝", level:36, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ぴっくあっぷとらっく", romaji:"pikkuappu torakku", kr:"픽업트럭", emoji:"🛻", level:36, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"とらくたー", romaji:"torakutaa", kr:"트랙터", emoji:"🚜", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"れーしんぐかー", romaji:"reeshingukaa", kr:"레이싱카", emoji:"🏎️", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"すくーたー", romaji:"sukuutaa", kr:"스쿠터", emoji:"🛵", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"くるまいす", romaji:"kurumaisu", kr:"휠체어", emoji:"🦽", level:36, category:"vehicles", pos:"noun", jlpt:"N4"},
  {jp:"おーとりきしゃ", romaji:"ootorikisha", kr:"오토릭샤", emoji:"🛺", level:42, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"きっくぼーど", romaji:"kikkuboodo", kr:"킥보드", emoji:"🛴", level:18, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"すけーとぼーど", romaji:"sukeetoboodo", kr:"스케이트보드", emoji:"🛹", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ろーらーすけーと", romaji:"rooraasukeeto", kr:"롤러스케이트", emoji:"🛼", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  // 여행 및 장소 — 장소
  {jp:"きゅうゆしょ", romaji:"kyuuyusho", kr:"주유소", emoji:"⛽", level:36, category:"places", pos:"noun", jlpt:"N4"},
  // 여행 및 장소 — 탈것
  {jp:"たいや", romaji:"taiya", kr:"바퀴", emoji:"🛞", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  // 여행 및 장소 — 장소
  {jp:"こうじちゅう", romaji:"koujichuu", kr:"공사중", emoji:"🚧", level:36, category:"places", pos:"noun", jlpt:"N4"},
  // 여행 및 장소 — 탈것
  {jp:"いかり", romaji:"ikari", kr:"닻", emoji:"⚓", level:36, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"かぬー", romaji:"kanuu", kr:"카누", emoji:"🛶", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  {jp:"ぱらしゅーと", romaji:"parashuuto", kr:"낙하산", emoji:"🪂", level:30, category:"vehicles", pos:"noun", jlpt:"N5"},
  // 동물 및 자연 — 자연/날씨
  {jp:"じんこうえいせい", romaji:"jinkoueisei", kr:"인공위성", emoji:"🛰️", level:36, category:"nature", pos:"noun", jlpt:"N4"},
  // 여행 및 장소 — 탈것
  {jp:"ゆーふぉー", romaji:"yuufoo", kr:"비행접시", emoji:"🛸", level:24, category:"vehicles", pos:"noun", jlpt:"N5"},
  // 활동 — 행사/메달
  {jp:"せんこうはなび", romaji:"senkou hanabi", kr:"손불꽃(스파클러)", emoji:"🎇", level:36, category:"events", pos:"noun", jlpt:"N5"},
  {jp:"ばくちく", romaji:"bakuchiku", kr:"폭죽", emoji:"🧨", level:36, category:"events", pos:"noun", jlpt:"N4"},
  {jp:"たなばたかざり", romaji:"tanabata kazari", kr:"칠석 대나무 장식", emoji:"🎋", level:36, category:"events", pos:"noun", jlpt:"N5"},
  {jp:"かどまつ", romaji:"kadomatsu", kr:"카도마츠(설날 장식)", emoji:"🎍", level:42, category:"events", pos:"noun", jlpt:"N5"},
  {jp:"ひなにんぎょう", romaji:"hina ningyou", kr:"히나인형", emoji:"🎎", level:42, category:"events", pos:"noun", jlpt:"N5"},
  {jp:"こいのぼり", romaji:"koinobori", kr:"잉어 깃발(고이노보리)", emoji:"🎏", level:36, category:"events", pos:"noun", jlpt:"N5"},
  {jp:"ぽちぶくろ", romaji:"pochibukuro", kr:"세뱃돈 봉투", emoji:"🧧", level:42, category:"events", pos:"noun", jlpt:"N5"},
  {jp:"きんめだる", romaji:"kinmedaru", kr:"금메달", emoji:"🥇", level:30, category:"events", pos:"noun", jlpt:"N5"},
  {jp:"ぎんめだる", romaji:"ginmedaru", kr:"은메달", emoji:"🥈", level:30, category:"events", pos:"noun", jlpt:"N5"},
  {jp:"どうめだる", romaji:"doumedaru", kr:"동메달", emoji:"🥉", level:30, category:"events", pos:"noun", jlpt:"N5"},
  // 활동 — 놀이/스포츠/악기
  {jp:"ばれーぼーる", romaji:"bareebooru", kr:"배구", emoji:"🏐", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"あめふと", romaji:"amefuto", kr:"미식축구", emoji:"🏈", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ふらいんぐでぃすく", romaji:"furaingu disuku", kr:"원반(플라잉디스크)", emoji:"🥏", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"あいすほっけー", romaji:"aisu hokkee", kr:"아이스하키", emoji:"🏒", level:30, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"たっきゅう", romaji:"takkyuu", kr:"탁구", emoji:"🏓", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ばどみんとん", romaji:"badominton", kr:"배드민턴", emoji:"🏸", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ぼくしんぐぐろーぶ", romaji:"bokushingu guroobu", kr:"권투 글러브", emoji:"🥊", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"どうぎ", romaji:"dougi", kr:"도복(무술복)", emoji:"🥋", level:36, category:"toys", pos:"noun", jlpt:"N4"},
  {jp:"ごるふ", romaji:"gorufu", kr:"골프", emoji:"⛳", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"あいすすけーと", romaji:"aisu sukeeto", kr:"아이스스케이트", emoji:"⛸️", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"つりざお", romaji:"tsurizao", kr:"낚싯대", emoji:"🎣", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"だいびんぐますく", romaji:"daibingu masuku", kr:"스노클링 마스크", emoji:"🤿", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"そり", romaji:"sori", kr:"썰매", emoji:"🛷", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"まと", romaji:"mato", kr:"과녁(다트)", emoji:"🎯", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"びりやーどのたま", romaji:"biriyaado no tama", kr:"당구공", emoji:"🎱", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"すいしょうだま", romaji:"suishoudama", kr:"수정구슬", emoji:"🔮", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"まほうのつえ", romaji:"mahou no tsue", kr:"마법지팡이", emoji:"🪄", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"じょいすてぃっく", romaji:"joisutikku", kr:"조이스틱", emoji:"🕹️", level:30, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"さいころ", romaji:"saikoro", kr:"주사위", emoji:"🎲", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ぱずる", romaji:"pazuru", kr:"퍼즐", emoji:"🧩", level:18, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"くまのぬいぐるみ", romaji:"kuma no nuigurumi", kr:"곰인형", emoji:"🧸", level:12, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ぴにゃーた", romaji:"piniyaata", kr:"피냐타", emoji:"🪅", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  // 물건 — 생활/도구
  {jp:"ぬいばり", romaji:"nuibari", kr:"바늘", emoji:"🪡", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"いと", romaji:"ito", kr:"실", emoji:"🧵", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"けいと", romaji:"keito", kr:"털실", emoji:"🧶", level:30, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"むすびめ", romaji:"musubime", kr:"매듭", emoji:"🪢", level:36, category:"household", pos:"noun", jlpt:"N5"},
  // 물건 — 패션
  {jp:"さんぐらす", romaji:"sangurasu", kr:"선글라스", emoji:"🕶️", level:24, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"ごーぐる", romaji:"googuru", kr:"고글(물안경)", emoji:"🥽", level:24, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"てぶくろ", romaji:"tebukuro", kr:"장갑", emoji:"🧤", level:18, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"はんどばっぐ", romaji:"handobaggu", kr:"핸드백", emoji:"👜", level:30, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"はいひーる", romaji:"haihiiru", kr:"하이힐", emoji:"👠", level:36, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"ばれえしゅーず", romaji:"baree shuuzu", kr:"발레슈즈", emoji:"🩰", level:30, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"しるくはっと", romaji:"shiruku hatto", kr:"실크햇", emoji:"🎩", level:36, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"ぼんねっと", romaji:"bonnetto", kr:"여성모자(보닛)", emoji:"👒", level:36, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"あんぜんぼう", romaji:"anzenbou", kr:"안전모", emoji:"⛑️", level:36, category:"clothes", pos:"noun", jlpt:"N4"},
  {jp:"くちべに", romaji:"kuchibeni", kr:"립스틱", emoji:"💄", level:36, category:"clothes", pos:"noun", jlpt:"N5"},
  {jp:"ほうせき", romaji:"houseki", kr:"보석", emoji:"💎", level:24, category:"clothes", pos:"noun", jlpt:"N5"},
  // 물건 — 생활/도구
  {jp:"めがほん", romaji:"megahon", kr:"메가폰(확성기)", emoji:"📣", level:36, category:"household", pos:"noun", jlpt:"N5"},
  // 활동 — 놀이/스포츠/악기
  {jp:"がくふ", romaji:"gakufu", kr:"악보", emoji:"🎼", level:36, category:"toys", pos:"noun", jlpt:"N4"},
  {jp:"おんぷ", romaji:"onpu", kr:"음표", emoji:"🎶", level:24, category:"toys", pos:"noun", jlpt:"N5"},
  // 물건 — 생활/도구
  {jp:"へっどほん", romaji:"heddohon", kr:"헤드폰", emoji:"🎧", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"らじお", romaji:"rajio", kr:"라디오", emoji:"📻", level:24, category:"household", pos:"noun", jlpt:"N5"},
  // 활동 — 놀이/스포츠/악기
  {jp:"さくそほーん", romaji:"sakusohoon", kr:"색소폰", emoji:"🎷", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"あこーでぃおん", romaji:"akoodeon", kr:"아코디언", emoji:"🪗", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  // 물건 — 생활/도구
  {jp:"ぷりんたー", romaji:"purintaa", kr:"프린터", emoji:"🖨️", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"きーぼーど", romaji:"kiiboodo", kr:"키보드", emoji:"⌨️", level:30, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"まうす", romaji:"mausu", kr:"마우스", emoji:"🖱️", level:30, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"そろばん", romaji:"soroban", kr:"주판", emoji:"🧮", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"えいがようかめら", romaji:"eigayou kamera", kr:"영화 카메라", emoji:"🎥", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"びでおかめら", romaji:"bideo kamera", kr:"비디오카메라", emoji:"📹", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"まきもの", romaji:"makimono", kr:"두루마리", emoji:"📜", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"らべる", romaji:"raberu", kr:"라벨(꼬리표)", emoji:"🏷️", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"こいん", romaji:"koin", kr:"동전", emoji:"🪙", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"えんさつ", romaji:"ensatsu", kr:"엔화 지폐", emoji:"💴", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"くれじっとかーど", romaji:"kurejitto kaado", kr:"신용카드", emoji:"💳", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"りょうしゅうしょ", romaji:"ryoushuusho", kr:"영수증", emoji:"🧾", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"ゆうびんうけ", romaji:"yuubinuke", kr:"우편함", emoji:"📫", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ふで", romaji:"fude", kr:"붓", emoji:"🖌️", level:30, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ふぁいる", romaji:"fairu", kr:"파일 폴더", emoji:"📁", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ぼうぐらふ", romaji:"bougurafu", kr:"막대그래프", emoji:"📊", level:42, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"がびょう", romaji:"gabyou", kr:"압정", emoji:"📌", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"くりっぷ", romaji:"kurippu", kr:"클립", emoji:"📎", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"じょうぎ", romaji:"jougi", kr:"자", emoji:"📏", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"おの", romaji:"ono", kr:"도끼", emoji:"🪓", level:36, category:"household", pos:"noun", jlpt:"N5"},
  // 활동 — 놀이/스포츠/악기
  {jp:"ぶーめらん", romaji:"buumeran", kr:"부메랑", emoji:"🪃", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"ゆみや", romaji:"yumiya", kr:"활과 화살", emoji:"🏹", level:36, category:"toys", pos:"noun", jlpt:"N5"},
  {jp:"たて", romaji:"tate", kr:"방패", emoji:"🛡️", level:30, category:"toys", pos:"noun", jlpt:"N5"},
  // 물건 — 생활/도구
  {jp:"はぐるま", romaji:"haguruma", kr:"톱니바퀴", emoji:"⚙️", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"てんびん", romaji:"tenbin", kr:"저울", emoji:"⚖️", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"りんく", romaji:"rinku", kr:"고리", emoji:"🔗", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ふっく", romaji:"fukku", kr:"갈고리(후크)", emoji:"🪝", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"もくざい", romaji:"mokuzai", kr:"나무(목재)", emoji:"🪵", level:36, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"しけんかん", romaji:"shikenkan", kr:"시험관", emoji:"🧪", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"でぃーえぬえー", romaji:"diieenuee", kr:"디엔에이(DNA)", emoji:"🧬", level:42, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"けんびきょう", romaji:"kenbikyou", kr:"현미경", emoji:"🔬", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"ぼうえんきょう", romaji:"bouenkyou", kr:"망원경", emoji:"🔭", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"ちゅうしゃき", romaji:"chuushaki", kr:"주사기", emoji:"💉", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"ばんそうこう", romaji:"bansoukou", kr:"반창고(밴드)", emoji:"🩹", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ちょうしんき", romaji:"choushinki", kr:"청진기", emoji:"🩺", level:30, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"えれべーたー", romaji:"erebeetaa", kr:"엘리베이터", emoji:"🛗", level:24, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"まど", romaji:"mado", kr:"창문", emoji:"🪟", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"といれ", romaji:"toire", kr:"변기(화장실)", emoji:"🚽", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"しゃわー", romaji:"shawaa", kr:"샤워", emoji:"🚿", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"ろーしょん", romaji:"rooshon", kr:"로션", emoji:"🧴", level:12, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"あんぜんぴん", romaji:"anzenpin", kr:"안전핀", emoji:"🧷", level:18, category:"household", pos:"noun", jlpt:"N5"},
  {jp:"しょうかき", romaji:"shoukaki", kr:"소화기", emoji:"🧯", level:36, category:"household", pos:"noun", jlpt:"N4"},
  {jp:"もあい", romaji:"moai", kr:"모아이 석상", emoji:"🗿", level:36, category:"household", pos:"noun", jlpt:"N5"},

  /* 🍎 이모지 동화책(과일 이야기) 재미있는 사실 페이지에 새로 등장한 단어 — 36개월 전후 아이가 이해할 수 있는 쉬운 단어 위주로 추가 */
  {jp:"あまい", romaji:"amai", kr:"달다(달콤하다)", emoji:"🍯", level:24, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"すっぱい", romaji:"suppai", kr:"시다(새콤하다)", emoji:"🍋", level:30, category:"adjectives", pos:"adj", jlpt:"N5"},
  {jp:"たくさん", romaji:"takusan", kr:"많이", emoji:"🙌", level:24, category:"adjectives", pos:"adv", jlpt:"N5"},
  {jp:"むく", romaji:"muku", kr:"(껍질을) 까다", emoji:"🍌", level:30, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"なる", romaji:"naru", kr:"(열매가) 열리다·되다", emoji:"🌳", level:30, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"ある", romaji:"aru", kr:"있다", emoji:"📍", level:24, category:"verbs", pos:"verb", jlpt:"N5"},
  {jp:"け", romaji:"ke", kr:"털", emoji:"🧸", level:30, category:"body", pos:"noun", jlpt:"N5"},
  {jp:"とげ", romaji:"toge", kr:"가시", emoji:"🌵", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"あみ", romaji:"ami", kr:"그물(무늬)", emoji:"🕸️", level:36, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"だいだいいろ", romaji:"daidai iro", kr:"주황", emoji:"🟠", level:18, category:"colors", pos:"noun", jlpt:"N5"},
  {jp:"かたち", romaji:"katachi", kr:"모양", emoji:"🔷", level:30, category:"nature", pos:"noun", jlpt:"N5"},
  {jp:"かおり", romaji:"kaori", kr:"향기", emoji:"🌸", level:36, category:"body", pos:"noun", jlpt:"N4"}

].filter(w => !w.jp.includes("가") && !w.jp.includes("의")).sort((a,b)=> b.jp.length - a.jp.length);

const ONOMATOPOEIA_ITEMS = [
  {sound:"わんわん", jp:"いぬ", kr:"강아지", emoji:"🐶"},
  {sound:"にゃーにゃー", jp:"ねこ", kr:"고양이", emoji:"🐱"},
  {sound:"もーもー", jp:"うし", kr:"소", emoji:"🐮"},
  {sound:"めーめー", jp:"ひつじ", kr:"양", emoji:"🐑"},
  {sound:"ぶーぶー", jp:"ぶた", kr:"돼지", emoji:"🐷"},
  {sound:"けろけろ", jp:"かえる", kr:"개구리", emoji:"🐸"},
  {sound:"ひひーん", jp:"うま", kr:"말", emoji:"🐴"},
  {sound:"こけこっこー", jp:"にわとり", kr:"닭", emoji:"🐔"},
  {sound:"ざあざあ", jp:"あめ", kr:"비", emoji:"🌧️"},
  {sound:"ぴかぴか", jp:"ほし", kr:"별", emoji:"⭐"},
  {sound:"ぽかぽか", jp:"たいよう", kr:"해", emoji:"☀️"},
  {sound:"ぴょんぴょん", jp:"うさぎ", kr:"토끼", emoji:"🐰"},
  {sound:"ぱくぱく", jp:"たべる", kr:"먹다", emoji:"🍽️"},
  {sound:"ごくごく", jp:"のむ", kr:"마시다", emoji:"🥤"},
  {sound:"すやすや", jp:"ねる", kr:"자다", emoji:"😴"},
  {sound:"にこにこ", jp:"わらう", kr:"웃다", emoji:"😄"}
];

const POS_LABELS = {
  noun: '명',    // 명사
  verb: '동',    // 동사
  adj: '형',     // 형용사
  adv: '부',     // 부사
  pron: '대',    // 대명사(의문사 포함)
  num: '수',     // 수사
  interj: '감'   // 감탄사·인사 표현
};

const CATEGORY_BADGE_EMOJI = {
  animals: '🐶', food: '🍎', body: '👀', nature: '🌳', vehicles: '🚗',
  household: '🏠', colors: '🎨', numbers: '🔢', family: '👪', people: '👩‍⚕️',
  clothes: '👕', toys: '🧸', greetings: '👋', position: '📍', season: '🍂',
  emotions: '😊', verbs: '🏃', adjectives: '✨', places: '🏫', events: '🎉'
};

const RIDDLES = [
  {jp:"ねこ", kr:"고양이", emoji:"🐱", hints:["わたしは どうぶつだよ。","ひげが ながいよ。","にゃーにゃー なくよ。"], hintsKr:["나는 동물이야.","수염이 길어.","야옹야옹 울어."]},
  {jp:"いぬ", kr:"강아지", emoji:"🐶", hints:["わたしは どうぶつだよ。","しっぽを ふるよ。","わんわん なくよ。"], hintsKr:["나는 동물이야.","꼬리를 흔들어.","멍멍 울어."]},
  {jp:"うし", kr:"소", emoji:"🐮", hints:["わたしは どうぶつだよ。","ミルクを だすよ。","もーもー なくよ。"], hintsKr:["나는 동물이야.","우유를 줘.","음매하고 울어."]},
  {jp:"ひつじ", kr:"양", emoji:"🐑", hints:["わたしは どうぶつだよ。","けが もこもこだよ。","めーめー なくよ。"], hintsKr:["나는 동물이야.","털이 보들보들해.","매애매애 울어."]},
  {jp:"ぶた", kr:"돼지", emoji:"🐷", hints:["わたしは どうぶつだよ。","あしが よんほん あるよ。","ぶーぶー なくよ。"], hintsKr:["나는 동물이야.","다리가 네 개 있어.","꿀꿀 울어."]},
  {jp:"かえる", kr:"개구리", emoji:"🐸", hints:["わたしは どうぶつだよ。","みずが だいすきだよ。","けろけろ なくよ。"], hintsKr:["나는 동물이야.","물을 아주 좋아해.","개굴개굴 울어."]},
  {jp:"うま", kr:"말", emoji:"🐴", hints:["わたしは どうぶつだよ。","はやく はしるよ。","ひひーん なくよ。"], hintsKr:["나는 동물이야.","빨리 달려.","히힝하고 울어."]},
  {jp:"にわとり", kr:"닭", emoji:"🐔", hints:["わたしは どうぶつだよ。","たまごを うむよ。","こけこっこーと なくよ。"], hintsKr:["나는 동물이야.","알을 낳아.","꼬끼오하고 울어."]},
  {jp:"うさぎ", kr:"토끼", emoji:"🐰", hints:["わたしは どうぶつだよ。","みみが ながいよ。","ぴょんぴょん はねるよ。"], hintsKr:["나는 동물이야.","귀가 길어.","깡충깡충 뛰어."]},
  {jp:"らいおん", kr:"사자", emoji:"🦁", hints:["わたしは どうぶつだよ。","たてがみが あるよ。","がおーと なくよ。"], hintsKr:["나는 동물이야.","갈기가 있어.","어흥하고 울어."]},
  {jp:"ぞう", kr:"코끼리", emoji:"🐘", hints:["わたしは どうぶつだよ。","はなが ながいよ。","からだが とても おおきいよ。"], hintsKr:["나는 동물이야.","코가 길어.","몸이 아주 커."]},
  {jp:"さる", kr:"원숭이", emoji:"🐒", hints:["わたしは どうぶつだよ。","きに のぼるよ。","バナナが だいすきだよ。"], hintsKr:["나는 동물이야.","나무에 올라가.","바나나를 아주 좋아해."]},
  {jp:"くま", kr:"곰", emoji:"🐻", hints:["わたしは どうぶつだよ。","ふゆに ねむるよ。","はちみつが だいすきだよ。"], hintsKr:["나는 동물이야.","겨울에 잠을 자.","꿀을 아주 좋아해."]},
  {jp:"さかな", kr:"물고기", emoji:"🐟", hints:["わたしは どうぶつだよ。","みずの なかに いるよ。","およぐのが じょうずだよ。"], hintsKr:["나는 동물이야.","물속에 있어.","헤엄을 잘 쳐."]},
  {jp:"きりん", kr:"기린", emoji:"🦒", hints:["わたしは どうぶつだよ。","くびが とても ながいよ。","たかい きの はっぱを たべるよ。"], hintsKr:["나는 동물이야.","목이 아주 길어.","높은 나무 잎을 먹어."]},
  {jp:"ぱんだ", kr:"판다", emoji:"🐼", hints:["わたしは どうぶつだよ。","からだが しろくて くろいよ。","ささを たべるよ。"], hintsKr:["나는 동물이야.","몸이 하얗고 까매.","대나무 잎을 먹어."]},
  {jp:"かめ", kr:"거북이", emoji:"🐢", hints:["わたしは どうぶつだよ。","せなかに こうらが あるよ。","ゆっくり あるくよ。"], hintsKr:["나는 동물이야.","등에 등딱지가 있어.","천천히 걸어."]},
  {jp:"あひる", kr:"오리", emoji:"🦆", hints:["わたしは どうぶつだよ。","みずの うえを およぐよ。","くちばしが ひらたいよ。"], hintsKr:["나는 동물이야.","물 위를 헤엄쳐.","부리가 납작해."]},
  {jp:"くじら", kr:"고래", emoji:"🐳", hints:["わたしは どうぶつだよ。","うみに すんでいるよ。","からだが とても おおきいよ。"], hintsKr:["나는 동물이야.","바다에 살아.","몸이 아주 커."]},
  {jp:"とら", kr:"호랑이", emoji:"🐯", hints:["わたしは どうぶつだよ。","しまもようが あるよ。","つよくて はやいよ。"], hintsKr:["나는 동물이야.","줄무늬가 있어.","힘세고 빨라."]},
  {jp:"しまうま", kr:"얼룩말", emoji:"🦓", hints:["わたしは どうぶつだよ。","しろと くろの しまもようだよ。","うまに にているよ。"], hintsKr:["나는 동물이야.","하얀색과 검은색 줄무늬야.","말이랑 닮았어."]},
  {jp:"こあら", kr:"코알라", emoji:"🐨", hints:["わたしは どうぶつだよ。","きの うえで ねむるよ。","ユーカリの はが だいすきだよ。"], hintsKr:["나는 동물이야.","나무 위에서 자.","유칼립투스 잎을 아주 좋아해."]},
  {jp:"かんがるー", kr:"캥거루", emoji:"🦘", hints:["わたしは どうぶつだよ。","おなかに ふくろが あるよ。","ぴょんぴょん とぶよ。"], hintsKr:["나는 동물이야.","배에 주머니가 있어.","폴짝폴짝 뛰어."]},
  {jp:"いるか", kr:"돌고래", emoji:"🐬", hints:["わたしは どうぶつだよ。","うみに すんでいるよ。","とても かしこいよ。"], hintsKr:["나는 동물이야.","바다에 살아.","아주 똑똑해."]},
  {jp:"たこ", kr:"문어", emoji:"🐙", hints:["わたしは どうぶつだよ。","あしが はっぽん あるよ。","うみの なかに いるよ。"], hintsKr:["나는 동물이야.","다리가 여덟 개 있어.","바닷속에 있어."]},
  {jp:"かに", kr:"게", emoji:"🦀", hints:["わたしは どうぶつだよ。","はさみが あるよ。","よこに あるくよ。"], hintsKr:["나는 동물이야.","집게가 있어.","옆으로 걸어."]},
  {jp:"はち", kr:"벌", emoji:"🐝", hints:["わたしは どうぶつだよ。","はなの みつを あつめるよ。","ぶんぶん とぶよ。"], hintsKr:["나는 동물이야.","꽃의 꿀을 모아.","붕붕 날아."]},
  {jp:"ちょう", kr:"나비", emoji:"🦋", hints:["わたしは どうぶつだよ。","きれいな はねが あるよ。","はなから はなへ とぶよ。"], hintsKr:["나는 동물이야.","예쁜 날개가 있어.","꽃에서 꽃으로 날아가."]},
  {jp:"とり", kr:"새", emoji:"🐦", hints:["わたしは どうぶつだよ。","そらを とぶよ。","はねが あるよ。"], hintsKr:["나는 동물이야.","하늘을 날아.","날개가 있어."]},
  {jp:"ひこうき", kr:"비행기", emoji:"✈️", hints:["わたしは のりものだよ。","そらを とぶよ。","つばさが あるよ。"], hintsKr:["나는 탈것이야.","하늘을 날아.","날개가 있어."]},
  {jp:"ふね", kr:"배", emoji:"🚢", hints:["わたしは のりものだよ。","うみを はしるよ。","みずに うくよ。"], hintsKr:["나는 탈것이야.","바다를 달려.","물에 떠."]},
  {jp:"たいよう", kr:"해", emoji:"☀️", hints:["わたしは そらに いるよ。","あさに でるよ。","あつくて まぶしいよ。"], hintsKr:["나는 하늘에 있어.","아침에 나와.","뜨겁고 눈부셔."]},
  {jp:"つき", kr:"달", emoji:"🌙", hints:["わたしは そらに いるよ。","よるに でるよ。","まるい かたちだよ。"], hintsKr:["나는 하늘에 있어.","밤에 나와.","동그란 모양이야."]},
  {jp:"りんご", kr:"사과", emoji:"🍎", hints:["わたしは くだものだよ。","あかい いろだよ。","あまくて まるいよ。"], hintsKr:["나는 과일이야.","빨간색이야.","달고 동글동글해."]},
  {jp:"みかん", kr:"귤", emoji:"🍊", hints:["わたしは くだものだよ。","だいだいいろだよ。","あまくて すっぱいよ。"], hintsKr:["나는 과일이야.","주황색이야.","달고 셔."]},
  {jp:"ぶどう", kr:"포도", emoji:"🍇", hints:["わたしは くだものだよ。","つぶつぶが たくさん あるよ。","むらさきいろだよ。"], hintsKr:["나는 과일이야.","알갱이가 많아.","보라색이야."]},
  {jp:"ばなな", kr:"바나나", emoji:"🍌", hints:["わたしは くだものだよ。","きいろくて ながいよ。","かわを むいて たべるよ。"], hintsKr:["나는 과일이야.","노랗고 길어.","껍질을 벗겨서 먹어."]},
  {jp:"いちご", kr:"딸기", emoji:"🍓", hints:["わたしは くだものだよ。","あかくて ちいさいよ。","つぶつぶが ついてるよ。"], hintsKr:["나는 과일이야.","빨갛고 작아.","알갱이가 붙어 있어."]},
  {jp:"すいか", kr:"수박", emoji:"🍉", hints:["わたしは くだものだよ。","とても おおきいよ。","なかが あかくて あまいよ。"], hintsKr:["나는 과일이야.","아주 커.","속이 빨갛고 달아."]},
  {jp:"もも", kr:"복숭아", emoji:"🍑", hints:["わたしは くだものだよ。","ピンクいろで まるいよ。","やわらかくて あまいよ。"], hintsKr:["나는 과일이야.","분홍색이고 동그래.","부드럽고 달아."]},
  {jp:"メロン", kr:"멜론", emoji:"🍈", hints:["わたしは くだものだよ。","あみもようの かわだよ。","あまくて みずみずしいよ。"], hintsKr:["나는 과일이야.","그물무늬 껍질이야.","달고 촉촉해."]},
  {jp:"なし", kr:"배(과일)", emoji:"🍐", hints:["わたしは くだものだよ。","きいろくて まるいよ。","シャキシャキして あまいよ。"], hintsKr:["나는 과일이야.","노랗고 동글동글해.","아삭아삭하고 달아."]},
  {jp:"さくらんぼ", kr:"체리", emoji:"🍒", hints:["わたしは くだものだよ。","あかくて ちいさいよ。","ふたつ くっついてるよ。"], hintsKr:["나는 과일이야.","빨갛고 작아.","두 개가 붙어 있어."]},
  {jp:"れもん", kr:"레몬", emoji:"🍋", hints:["わたしは くだものだよ。","きいろい いろだよ。","とても すっぱいよ。"], hintsKr:["나는 과일이야.","노란색이야.","아주 셔."]},
  {jp:"きうい", kr:"키위", emoji:"🥝", hints:["わたしは くだものだよ。","そとがわが ちゃいろいよ。","なかは みどりいろだよ。"], hintsKr:["나는 과일이야.","겉이 갈색이야.","속은 초록색이야."]},
  {jp:"まんごー", kr:"망고", emoji:"🥭", hints:["わたしは くだものだよ。","あつい くにの くだものだよ。","あまくて オレンジいろだよ。"], hintsKr:["나는 과일이야.","더운 나라의 과일이야.","달고 주황색이야."]},
  {jp:"ぱいなっぷる", kr:"파인애플", emoji:"🍍", hints:["わたしは くだものだよ。","そとがわに とげとげが あるよ。","あまくて すっぱいよ。"], hintsKr:["나는 과일이야.","겉에 뾰족뾰족한 게 있어.","달고 셔."]},

  /* 👔 직업 */
  {jp:"いしゃ", kr:"의사", emoji:"🩺", hints:["わたしは しごとを しているよ。","びょうきの ひとを たすけるよ。","びょういんで はたらくよ。"], hintsKr:["나는 직업을 갖고 있어.","아픈 사람을 도와줘.","병원에서 일해."]},
  {jp:"せんせい", kr:"선생님", emoji:"📚", hints:["わたしは しごとを しているよ。","がっこうで べんきょうを おしえるよ。","こどもたちが だいすきだよ。"], hintsKr:["나는 직업을 갖고 있어.","학교에서 공부를 가르쳐줘.","아이들을 아주 좋아해."]},
  {jp:"けいさつかん", kr:"경찰관", emoji:"👮", hints:["わたしは しごとを しているよ。","まちを まもるよ。","わるい ひとを つかまえるよ。"], hintsKr:["나는 직업을 갖고 있어.","마을을 지켜.","나쁜 사람을 잡아."]},
  {jp:"しょうぼうし", kr:"소방관", emoji:"🧯", hints:["わたしは しごとを しているよ。","かじを けすよ。","たいへんな ひとを たすけるよ。"], hintsKr:["나는 직업을 갖고 있어.","불을 꺼.","힘든 사람을 도와줘."]},
  {jp:"りょうりにん", kr:"요리사", emoji:"🧑‍🍳", hints:["わたしは しごとを しているよ。","おいしい りょうりを つくるよ。","レストランで はたらくよ。"], hintsKr:["나는 직업을 갖고 있어.","맛있는 요리를 만들어.","레스토랑에서 일해."]},
  {jp:"のうふ", kr:"농부", emoji:"👨‍🌾", hints:["わたしは しごとを しているよ。","やさいを そだてるよ。","はたけで はたらくよ。"], hintsKr:["나는 직업을 갖고 있어.","채소를 길러.","밭에서 일해."]},
  {jp:"かしゅ", kr:"가수", emoji:"🎤", hints:["わたしは しごとを しているよ。","うたを うたうよ。","マイクを もつよ。"], hintsKr:["나는 직업을 갖고 있어.","노래를 불러.","마이크를 들어."]},
  {jp:"がか", kr:"화가", emoji:"🎨", hints:["わたしは しごとを しているよ。","えを かくよ。","いろいろな いろを つかうよ。"], hintsKr:["나는 직업을 갖고 있어.","그림을 그려.","여러 가지 색을 써."]},
  {jp:"ゆうびんやさん", kr:"우체부", emoji:"📮", hints:["わたしは しごとを しているよ。","てがみを とどけるよ。","じてんしゃに のるよ。"], hintsKr:["나는 직업을 갖고 있어.","편지를 배달해줘.","자전거를 타."]},
  {jp:"びようし", kr:"미용사", emoji:"💇", hints:["わたしは しごとを しているよ。","かみを きるよ。","きれいに してあげるよ。"], hintsKr:["나는 직업을 갖고 있어.","머리카락을 잘라.","예쁘게 해줘."]},
  {jp:"パイロット", kr:"파일럿", emoji:"🧑‍✈️", hints:["わたしは しごとを しているよ。","ひこうきを そうじゅうするよ。","そらを とぶよ。"], hintsKr:["나는 직업을 갖고 있어.","비행기를 조종해.","하늘을 날아."]},
  {jp:"かんごし", kr:"간호사", emoji:"🩹", hints:["わたしは しごとを しているよ。","びょういんで はたらくよ。","おいしゃさんを てつだうよ。"], hintsKr:["나는 직업을 갖고 있어.","병원에서 일해.","의사 선생님을 도와줘."]},
  {jp:"だいく", kr:"목수", emoji:"🔨", hints:["わたしは しごとを しているよ。","いえを たてるよ。","くぎを うつよ。"], hintsKr:["나는 직업을 갖고 있어.","집을 지어.","못을 박아."]},
  {jp:"うちゅうひこうし", kr:"우주비행사", emoji:"🧑‍🚀", hints:["わたしは しごとを しているよ。","うちゅうに いくよ。","ロケットに のるよ。"], hintsKr:["나는 직업을 갖고 있어.","우주에 가.","로켓을 타."]},
  {jp:"じゅうい", kr:"수의사", emoji:"🐾", hints:["わたしは しごとを しているよ。","どうぶつを たすけるよ。","びょういんで はたらくよ。"], hintsKr:["나는 직업을 갖고 있어.","동물을 도와줘.","병원에서 일해."]},

  /* 🍽️ 음식 */
  {jp:"ごはん", kr:"밥", emoji:"🍚", hints:["わたしは たべものだよ。","まいにち たべるよ。","しろくて あついよ。"], hintsKr:["나는 음식이야.","매일 먹어.","하얗고 뜨거워."]},
  {jp:"パン", kr:"빵", emoji:"🍞", hints:["わたしは たべものだよ。","あさに たべるよ。","やわらかいよ。"], hintsKr:["나는 음식이야.","아침에 먹어.","부드러워."]},
  {jp:"おすし", kr:"초밥", emoji:"🍣", hints:["わたしは たべものだよ。","さかなが のっているよ。","にほんの たべものだよ。"], hintsKr:["나는 음식이야.","생선이 올라가 있어.","일본 음식이야."]},
  {jp:"らーめん", kr:"라멘", emoji:"🍜", hints:["わたしは たべものだよ。","あつくて おいしいよ。","めんを たべるよ。"], hintsKr:["나는 음식이야.","뜨겁고 맛있어.","면을 먹어."]},
  {jp:"かれーらいす", kr:"카레라이스", emoji:"🍛", hints:["わたしは たべものだよ。","からくて おいしいよ。","ごはんに かけるよ。"], hintsKr:["나는 음식이야.","맵고 맛있어.","밥에 뿌려."]},
  {jp:"おにぎり", kr:"주먹밥", emoji:"🍙", hints:["わたしは たべものだよ。","さんかくの かたちだよ。","のりが まいてあるよ。"], hintsKr:["나는 음식이야.","세모 모양이야.","김이 말려있어."]},
  {jp:"たまごやき", kr:"계란말이", emoji:"🍳", hints:["わたしは たべものだよ。","たまごで つくるよ。","きいろいよ。"], hintsKr:["나는 음식이야.","계란으로 만들어.","노란색이야."]},
  {jp:"ぎょうざ", kr:"만두", emoji:"🥟", hints:["わたしは たべものだよ。","なかに おにくが はいっているよ。","やいて たべるよ。"], hintsKr:["나는 음식이야.","안에 고기가 들어 있어.","구워서 먹어."]},
  {jp:"あいすくりーむ", kr:"아이스크림", emoji:"🍦", hints:["わたしは たべものだよ。","つめたくて あまいよ。","なつに たべるよ。"], hintsKr:["나는 음식이야.","차갑고 달아.","여름에 먹어."]},
  {jp:"けーき", kr:"케이크", emoji:"🍰", hints:["わたしは たべものだよ。","おたんじょうびに たべるよ。","あまくて やわらかいよ。"], hintsKr:["나는 음식이야.","생일에 먹어.","달고 부드러워."]},
  {jp:"ちょこれーと", kr:"초콜릿", emoji:"🍫", hints:["わたしは たべものだよ。","あまくて くろいよ。","とけやすいよ。"], hintsKr:["나는 음식이야.","달고 까매.","잘 녹아."]},
  {jp:"ぴざ", kr:"피자", emoji:"🍕", hints:["わたしは たべものだよ。","まるくて おおきいよ。","チーズが のっているよ。"], hintsKr:["나는 음식이야.","동그랗고 커.","치즈가 올라가 있어."]},
  {jp:"はんばーがー", kr:"햄버거", emoji:"🍔", hints:["わたしは たべものだよ。","パンで おにくを はさむよ。","てで たべるよ。"], hintsKr:["나는 음식이야.","빵으로 고기를 끼워.","손으로 먹어."]},
  {jp:"さらだ", kr:"샐러드", emoji:"🥗", hints:["わたしは たべものだよ。","やさいが たくさん はいっているよ。","からだに いいよ。"], hintsKr:["나는 음식이야.","채소가 많이 들어 있어.","몸에 좋아."]},
  {jp:"みそしる", kr:"된장국", emoji:"🍲", hints:["わたしは たべものだよ。","あたたかい しるだよ。","まいあさ のむよ。"], hintsKr:["나는 음식이야.","따뜻한 국물이야.","매일 아침 마셔."]},

  /* 🐾 동물 (추가) */
  {jp:"ふくろう", kr:"부엉이", emoji:"🦉", hints:["わたしは どうぶつだよ。","よるに めが さえるよ。","ほーほーと なくよ。"], hintsKr:["나는 동물이야.","밤에 눈이 밝아져.","부엉부엉 울어."]},
  {jp:"ぺんぎん", kr:"펭귄", emoji:"🐧", hints:["わたしは どうぶつだよ。","さむい くにに すんでいるよ。","およぐのが とくいだよ。"], hintsKr:["나는 동물이야.","추운 나라에 살아.","헤엄치는 걸 잘해."]},
  {jp:"へび", kr:"뱀", emoji:"🐍", hints:["わたしは どうぶつだよ。","あしが ないよ。","にょろにょろ うごくよ。"], hintsKr:["나는 동물이야.","다리가 없어.","스멀스멀 움직여."]},
  {jp:"とかげ", kr:"도마뱀", emoji:"🦎", hints:["わたしは どうぶつだよ。","しっぽが ながいよ。","はやく はしるよ。"], hintsKr:["나는 동물이야.","꼬리가 길어.","빨리 달려."]},
  {jp:"こうもり", kr:"박쥐", emoji:"🦇", hints:["わたしは どうぶつだよ。","よるに そらを とぶよ。","さかさまに ねむるよ。"], hintsKr:["나는 동물이야.","밤에 하늘을 날아.","거꾸로 매달려 자."]},
  {jp:"りす", kr:"다람쥐", emoji:"🐿️", hints:["わたしは どうぶつだよ。","しっぽが ふわふわだよ。","きの みが だいすきだよ。"], hintsKr:["나는 동물이야.","꼬리가 폭신폭신해.","나무 열매를 아주 좋아해."]},
  {jp:"やぎ", kr:"염소", emoji:"🐐", hints:["わたしは どうぶつだよ。","つのが あるよ。","めーと なくよ。"], hintsKr:["나는 동물이야.","뿔이 있어.","매하고 울어."]},
  {jp:"しか", kr:"사슴", emoji:"🦌", hints:["わたしは どうぶつだよ。","つのが りっぱだよ。","もりに すんでいるよ。"], hintsKr:["나는 동물이야.","뿔이 멋져.","숲에 살아."]},
  {jp:"おおかみ", kr:"늑대", emoji:"🐺", hints:["わたしは どうぶつだよ。","むれで くらすよ。","うおーんと なくよ。"], hintsKr:["나는 동물이야.","무리 지어 살아.","우~오~하고 울어."]},
  {jp:"きつね", kr:"여우", emoji:"🦊", hints:["わたしは どうぶつだよ。","しっぽが ふさふさだよ。","もりに すんでいるよ。"], hintsKr:["나는 동물이야.","꼬리가 복슬복슬해.","숲에 살아."]},
  {jp:"ねずみ", kr:"쥐", emoji:"🐭", hints:["わたしは どうぶつだよ。","からだが ちいさいよ。","チーズが だいすきだよ。"], hintsKr:["나는 동물이야.","몸이 작아.","치즈를 아주 좋아해."]},
  {jp:"わに", kr:"악어", emoji:"🐊", hints:["わたしは どうぶつだよ。","かわや ぬまに すんでいるよ。","はが するどいよ。"], hintsKr:["나는 동물이야.","강이나 늪에 살아.","이빨이 날카로워."]},
  {jp:"さい", kr:"코뿔소", emoji:"🦏", hints:["わたしは どうぶつだよ。","はなの うえに つのが あるよ。","からだが おおきいよ。"], hintsKr:["나는 동물이야.","코 위에 뿔이 있어.","몸이 커."]},
  {jp:"かば", kr:"하마", emoji:"🦛", hints:["わたしは どうぶつだよ。","みずの なかに いるよ。","くちが とても おおきいよ。"], hintsKr:["나는 동물이야.","물속에 있어.","입이 아주 커."]},
  {jp:"かたつむり", kr:"달팽이", emoji:"🐌", hints:["わたしは どうぶつだよ。","からを せおっているよ。","ゆっくり うごくよ。"], hintsKr:["나는 동물이야.","등에 껍데기를 지고 있어.","천천히 움직여."]},

  /* ⚽ 운동 */
  {jp:"さっかー", kr:"축구", emoji:"⚽", hints:["わたしは スポーツだよ。","ボールを あしで けるよ。","ゴールに いれるよ。"], hintsKr:["나는 스포츠야.","공을 발로 차.","골대에 넣어."]},
  {jp:"やきゅう", kr:"야구", emoji:"⚾", hints:["わたしは スポーツだよ。","バットで うつよ。","ボールを なげるよ。"], hintsKr:["나는 스포츠야.","배트로 쳐.","공을 던져."]},
  {jp:"ばすけっとぼーる", kr:"농구", emoji:"🏀", hints:["わたしは スポーツだよ。","ボールを てで つくよ。","たかい わに いれるよ。"], hintsKr:["나는 스포츠야.","공을 손으로 튀겨.","높은 골대에 넣어."]},
  {jp:"てにす", kr:"테니스", emoji:"🎾", hints:["わたしは スポーツだよ。","ラケットで うつよ。","ふたりで あそぶよ。"], hintsKr:["나는 스포츠야.","라켓으로 쳐.","둘이서 놀아."]},
  {jp:"すいえい", kr:"수영", emoji:"🏊", hints:["わたしは スポーツだよ。","みずの なかで するよ。","からだを うごかして およぐよ。"], hintsKr:["나는 스포츠야.","물속에서 해.","몸을 움직여서 헤엄쳐."]},
  {jp:"たっきゅう", kr:"탁구", emoji:"🏓", hints:["わたしは スポーツだよ。","ちいさい ボールを うつよ。","テーブルの うえで するよ。"], hintsKr:["나는 스포츠야.","작은 공을 쳐.","탁자 위에서 해."]},
  {jp:"ばれーぼーる", kr:"배구", emoji:"🏐", hints:["わたしは スポーツだよ。","ボールを てで うつよ。","あみを こえて とばすよ。"], hintsKr:["나는 스포츠야.","공을 손으로 쳐.","그물을 넘겨서 날려."]},
  {jp:"ごるふ", kr:"골프", emoji:"⛳", hints:["わたしは スポーツだよ。","クラブで ボールを うつよ。","あなに いれるよ。"], hintsKr:["나는 스포츠야.","클럽으로 공을 쳐.","구멍에 넣어."]},
  {jp:"すきー", kr:"스키", emoji:"⛷️", hints:["わたしは スポーツだよ。","ゆきの うえを すべるよ。","さむい ときに するよ。"], hintsKr:["나는 스포츠야.","눈 위를 미끄러져.","추울 때 해."]},
  {jp:"ぼくしんぐ", kr:"복싱", emoji:"🥊", hints:["わたしは スポーツだよ。","てぶくろを つけるよ。","うでで たたかうよ。"], hintsKr:["나는 스포츠야.","장갑을 껴.","팔로 싸워."]},
  {jp:"まらそん", kr:"마라톤", emoji:"🏃", hints:["わたしは スポーツだよ。","ながい きょりを はしるよ。","あしが つよくなるよ。"], hintsKr:["나는 스포츠야.","긴 거리를 달려.","다리가 튼튼해져."]},
  {jp:"たいそう", kr:"체조", emoji:"🤸", hints:["わたしは スポーツだよ。","からだを やわらかく うごかすよ。","とんだり はねたり するよ。"], hintsKr:["나는 스포츠야.","몸을 부드럽게 움직여.","뛰거나 튀거나 해."]},
  {jp:"ばどみんとん", kr:"배드민턴", emoji:"🏸", hints:["わたしは スポーツだよ。","はねを ラケットで うつよ。","ふたりで あそぶよ。"], hintsKr:["나는 스포츠야.","셔틀콕을 라켓으로 쳐.","둘이서 놀아."]},
  {jp:"ぼうりんぐ", kr:"볼링", emoji:"🎳", hints:["わたしは スポーツだよ。","おおきい ボールを ころがすよ。","ピンを たおすよ。"], hintsKr:["나는 스포츠야.","큰 공을 굴려.","핀을 쓰러뜨려."]},
  {jp:"すけーとぼーど", kr:"스케이트보드", emoji:"🛹", hints:["わたしは スポーツだよ。","いたに のって すべるよ。","タイヤが よんこ あるよ。"], hintsKr:["나는 스포츠야.","판 위에 올라타서 미끄러져.","타이어가 네 개 있어."]},

  /* 🚌 교통수단 */
  {jp:"でんしゃ", kr:"기차", emoji:"🚃", hints:["わたしは のりものだよ。","レールの うえを はしるよ。","たくさんの ひとが のるよ。"], hintsKr:["나는 탈것이야.","레일 위를 달려.","많은 사람이 타."]},
  {jp:"ばす", kr:"버스", emoji:"🚌", hints:["わたしは のりものだよ。","たくさんの ひとが のるよ。","きまった みちを はしるよ。"], hintsKr:["나는 탈것이야.","많은 사람이 타.","정해진 길을 달려."]},
  {jp:"じてんしゃ", kr:"자전거", emoji:"🚲", hints:["わたしは のりものだよ。","タイヤが ふたつ あるよ。","あしで こぐよ。"], hintsKr:["나는 탈것이야.","타이어가 두 개 있어.","발로 굴러."]},
  {jp:"ちかてつ", kr:"지하철", emoji:"🚇", hints:["わたしは のりものだよ。","ちかを はしるよ。","はやく うごくよ。"], hintsKr:["나는 탈것이야.","땅속을 달려.","빠르게 움직여."]},
  {jp:"たくしー", kr:"택시", emoji:"🚕", hints:["わたしは のりものだよ。","おきゃくさんを のせるよ。","いろが きいろいことが おおいよ。"], hintsKr:["나는 탈것이야.","손님을 태워.","노란색인 경우가 많아."]},
  {jp:"とらっく", kr:"트럭", emoji:"🚚", hints:["わたしは のりものだよ。","おもい にもつを はこぶよ。","おおきい くるまだよ。"], hintsKr:["나는 탈것이야.","무거운 짐을 옮겨.","큰 자동차야."]},
  {jp:"きゅうきゅうしゃ", kr:"구급차", emoji:"🚑", hints:["わたしは のりものだよ。","びょうきの ひとを はこぶよ。","サイレンが なるよ。"], hintsKr:["나는 탈것이야.","아픈 사람을 옮겨줘.","사이렌이 울려."]},
  {jp:"ぱとかー", kr:"순찰차", emoji:"🚓", hints:["わたしは のりものだよ。","けいさつが のるよ。","サイレンが なるよ。"], hintsKr:["나는 탈것이야.","경찰이 타.","사이렌이 울려."]},
  {jp:"おーとばい", kr:"오토바이", emoji:"🏍️", hints:["わたしは のりものだよ。","タイヤが ふたつ あるよ。","エンジンの おとが するよ。"], hintsKr:["나는 탈것이야.","타이어가 두 개 있어.","엔진 소리가 나."]},
  {jp:"へりこぷたー", kr:"헬리콥터", emoji:"🚁", hints:["わたしは のりものだよ。","プロペラで とぶよ。","たてに とびあがるよ。"], hintsKr:["나는 탈것이야.","프로펠러로 날아.","위로 곧장 날아올라."]},
  {jp:"ろけっと", kr:"로켓", emoji:"🚀", hints:["わたしは のりものだよ。","うちゅうへ とぶよ。","とても はやいよ。"], hintsKr:["나는 탈것이야.","우주로 날아가.","아주 빨라."]},
  {jp:"きしゃ", kr:"증기기관차", emoji:"🚂", hints:["わたしは のりものだよ。","むかしの でんしゃだよ。","けむりを だすよ。"], hintsKr:["나는 탈것이야.","옛날 기차야.","연기를 내뿜어."]},
  {jp:"よっと", kr:"요트", emoji:"⛵", hints:["わたしは のりものだよ。","かぜの ちからで うごくよ。","うみで あそぶよ。"], hintsKr:["나는 탈것이야.","바람의 힘으로 움직여.","바다에서 놀아."]},
  {jp:"ごんどら", kr:"곤돌라", emoji:"🚡", hints:["わたしは のりものだよ。","やまの うえまで はこぶよ。","そらを うごくよ。"], hintsKr:["나는 탈것이야.","산 위까지 옮겨줘.","하늘을 움직여."]},
  {jp:"ききゅう", kr:"열기구", emoji:"🎈", hints:["わたしは のりものだよ。","そらに ふわふわ うかぶよ。","おおきな ふうせんだよ。"], hintsKr:["나는 탈것이야.","하늘에 둥실둥실 떠.","커다란 풍선이야."]},

  /* 🚗 자동차 */
  {jp:"くるま", kr:"자동차", emoji:"🚗", hints:["わたしは くるまだよ。","よにんぐらい のれるよ。","まいにち みちを はしるよ。"], hintsKr:["나는 자동차야.","네 명 정도 탈 수 있어.","매일 길을 달려."]},
  {jp:"すぽーつかー", kr:"스포츠카", emoji:"🏎️", hints:["わたしは くるまだよ。","とても はやく はしるよ。","かっこいい かたちだよ。"], hintsKr:["나는 자동차야.","아주 빠르게 달려.","멋진 모양이야."]},
  {jp:"しょうぼうしゃ", kr:"소방차", emoji:"🚒", hints:["わたしは くるまだよ。","かじを けしに いくよ。","あかい いろだよ。"], hintsKr:["나는 자동차야.","불을 끄러 가.","빨간색이야."]},
  {jp:"みにばん", kr:"미니밴", emoji:"🚐", hints:["わたしは くるまだよ。","かぞくが たくさん のれるよ。","せが たかいよ。"], hintsKr:["나는 자동차야.","가족이 많이 탈 수 있어.","키가 커."]},
  {jp:"だんぷかー", kr:"덤프트럭", emoji:"🚛", hints:["わたしは くるまだよ。","つちや いしを はこぶよ。","にだいを かたむけるよ。"], hintsKr:["나는 자동차야.","흙이나 돌을 옮겨.","짐칸을 기울여."]},
  {jp:"とらくたー", kr:"트랙터", emoji:"🚜", hints:["わたしは くるまだよ。","はたけで つかうよ。","うしろに どうぐを つけるよ。"], hintsKr:["나는 자동차야.","밭에서 사용해.","뒤에 도구를 달아."]},
  {jp:"けいじどうしゃ", kr:"경차", emoji:"🚙", hints:["わたしは くるまだよ。","おおきさが ちいさいよ。","うんてんが しやすいよ。"], hintsKr:["나는 자동차야.","크기가 작아.","운전하기 쉬워."]},
  {jp:"でんきじどうしゃ", kr:"전기차", emoji:"🔌", hints:["わたしは くるまだよ。","でんきで うごくよ。","けむりが でないよ。"], hintsKr:["나는 자동차야.","전기로 움직여.","연기가 나지 않아."]},
  {jp:"れーしんぐかー", kr:"레이싱카", emoji:"🏁", hints:["わたしは くるまだよ。","レースで きょうそうするよ。","とても はやく はしるよ。"], hintsKr:["나는 자동차야.","경주로 겨뤄.","아주 빠르게 달려."]},

  /* 🌸 꽃 */
  {jp:"さくら", kr:"벚꽃", emoji:"🌸", hints:["わたしは はなだよ。","はるに さくよ。","ピンクいろだよ。"], hintsKr:["나는 꽃이야.","봄에 피어.","분홍색이야."]},
  {jp:"ひまわり", kr:"해바라기", emoji:"🌻", hints:["わたしは はなだよ。","たいようを むくよ。","きいろくて おおきいよ。"], hintsKr:["나는 꽃이야.","해를 바라봐.","노랗고 커."]},
  {jp:"ちゅーりっぷ", kr:"튤립", emoji:"🌷", hints:["わたしは はなだよ。","はるに さくよ。","コップの かたちだよ。"], hintsKr:["나는 꽃이야.","봄에 피어.","컵 모양이야."]},
  {jp:"ばら", kr:"장미", emoji:"🌹", hints:["わたしは はなだよ。","とげが あるよ。","あかい いろが おおいよ。"], hintsKr:["나는 꽃이야.","가시가 있어.","빨간색이 많아."]},
  {jp:"たんぽぽ", kr:"민들레", emoji:"🌼", hints:["わたしは はなだよ。","わたげが とぶよ。","きいろい はなだよ。"], hintsKr:["나는 꽃이야.","솜털이 날아가.","노란 꽃이야."]},
  {jp:"はす", kr:"연꽃", emoji:"🪷", hints:["わたしは はなだよ。","みずの うえに さくよ。","きれいな はなびらだよ。"], hintsKr:["나는 꽃이야.","물 위에 피어.","예쁜 꽃잎이야."]},
  {jp:"はいびすかす", kr:"히비스커스", emoji:"🌺", hints:["わたしは はなだよ。","あたたかい くにに さくよ。","おおきくて あかいよ。"], hintsKr:["나는 꽃이야.","따뜻한 나라에서 피어.","크고 빨개."]},
  {jp:"きく", kr:"국화", emoji:"🏵️", hints:["わたしは はなだよ。","あきに さくよ。","まるい かたちだよ。"], hintsKr:["나는 꽃이야.","가을에 피어.","동그란 모양이야."]},
  {jp:"こすもす", kr:"코스모스", emoji:"🌸", hints:["わたしは はなだよ。","あきかぜに ゆれるよ。","はなびらが うすい いろだよ。"], hintsKr:["나는 꽃이야.","가을바람에 흔들려.","꽃잎이 연한 색이야."]},
  {jp:"はなたば", kr:"꽃다발", emoji:"💐", hints:["わたしは はなだよ。","たくさんの はなを あつめたよ。","プレゼントに するよ。"], hintsKr:["나는 꽃이야.","꽃을 많이 모았어.","선물로 해."]},

  /* 🏠 집안 사물 */
  {jp:"てれび", kr:"텔레비전", emoji:"📺", hints:["わたしは いえに あるよ。","がめんに えいぞうが うつるよ。","リモコンで つけるよ。"], hintsKr:["나는 집에 있어.","화면에 영상이 나와.","리모컨으로 켜."]},
  {jp:"せんたくき", kr:"세탁기", emoji:"🧺", hints:["わたしは いえに あるよ。","ふくを あらうよ。","くるくる まわるよ。"], hintsKr:["나는 집에 있어.","옷을 빨아.","빙글빙글 돌아."]},
  {jp:"でんわ", kr:"전화기", emoji:"☎️", hints:["わたしは いえに あるよ。","はなしを するよ。","おとが なるよ。"], hintsKr:["나는 집에 있어.","이야기를 해.","소리가 나."]},
  {jp:"とけい", kr:"시계", emoji:"🕐", hints:["わたしは いえに あるよ。","じかんを おしえるよ。","はりが うごくよ。"], hintsKr:["나는 집에 있어.","시간을 알려줘.","바늘이 움직여."]},
  {jp:"かがみ", kr:"거울", emoji:"🪞", hints:["わたしは いえに あるよ。","じぶんの かおが うつるよ。","ガラスで できているよ。"], hintsKr:["나는 집에 있어.","내 얼굴이 비쳐.","유리로 만들어졌어."]},
  {jp:"そふぁー", kr:"소파", emoji:"🛋️", hints:["わたしは いえに あるよ。","すわって やすむよ。","やわらかいよ。"], hintsKr:["나는 집에 있어.","앉아서 쉬어.","부드러워."]},
  {jp:"べっど", kr:"침대", emoji:"🛏️", hints:["わたしは いえに あるよ。","よるに ねるよ。","やわらかい ふとんが あるよ。"], hintsKr:["나는 집에 있어.","밤에 자.","푹신한 이불이 있어."]},
  {jp:"でんき", kr:"전등", emoji:"💡", hints:["わたしは いえに あるよ。","へやを あかるく するよ。","スイッチで つけるよ。"], hintsKr:["나는 집에 있어.","방을 밝게 해줘.","스위치로 켜."]},
  {jp:"かさ", kr:"우산", emoji:"☂️", hints:["わたしは いえに あるよ。","あめの ひに つかうよ。","ひろげると まるいよ。"], hintsKr:["나는 집에 있어.","비 오는 날에 써.","펼치면 동그래."]},
  {jp:"ほうき", kr:"빗자루", emoji:"🧹", hints:["わたしは いえに あるよ。","ゆかを そうじするよ。","てで もつよ。"], hintsKr:["나는 집에 있어.","바닥을 청소해.","손으로 들어."]},
  {jp:"はさみ", kr:"가위", emoji:"✂️", hints:["わたしは いえに あるよ。","かみを きるよ。","きをつけて つかうよ。"], hintsKr:["나는 집에 있어.","머리카락을 잘라.","조심해서 사용해."]},
  {jp:"くつ", kr:"신발", emoji:"👞", hints:["わたしは いえに あるよ。","そとに でるときに はくよ。","あしに はくよ。"], hintsKr:["나는 집에 있어.","밖에 나갈 때 신어.","발에 신어."]},
  {jp:"かばん", kr:"가방", emoji:"🎒", hints:["わたしは いえに あるよ。","ものを いれて はこぶよ。","せなかに せおうよ。"], hintsKr:["나는 집에 있어.","물건을 넣어서 옮겨.","등에 짊어져."]},
  {jp:"ほん", kr:"책", emoji:"📖", hints:["わたしは いえに あるよ。","おはなしが かいてあるよ。","よむと たのしいよ。"], hintsKr:["나는 집에 있어.","이야기가 쓰여 있어.","읽으면 재밌어."]}
];

const EAWASE_WORDS = [
  /* 🐾 동물 */
  {jp:"ねこ", kr:"고양이", emoji:"🐱"},
  {jp:"いぬ", kr:"강아지", emoji:"🐶"},
  {jp:"うし", kr:"소", emoji:"🐮"},
  {jp:"うま", kr:"말", emoji:"🐴"},
  {jp:"ひつじ", kr:"양", emoji:"🐑"},
  {jp:"ぶた", kr:"돼지", emoji:"🐷"},
  {jp:"やぎ", kr:"염소", emoji:"🐐"},
  {jp:"うさぎ", kr:"토끼", emoji:"🐰"},
  {jp:"くま", kr:"곰", emoji:"🐻"},
  {jp:"とら", kr:"호랑이", emoji:"🐯"},
  {jp:"らいおん", kr:"사자", emoji:"🦁"},
  {jp:"ぞう", kr:"코끼리", emoji:"🐘"},
  {jp:"きりん", kr:"기린", emoji:"🦒"},
  {jp:"さる", kr:"원숭이", emoji:"🐒"},
  {jp:"しか", kr:"사슴", emoji:"🦌"},
  {jp:"きつね", kr:"여우", emoji:"🦊"},
  {jp:"たぬき", kr:"너구리", emoji:"🦝"},
  {jp:"ねずみ", kr:"쥐", emoji:"🐭"},
  {jp:"かめ", kr:"거북이", emoji:"🐢"},
  {jp:"かえる", kr:"개구리", emoji:"🐸"},
  {jp:"へび", kr:"뱀", emoji:"🐍"},
  {jp:"とり", kr:"새", emoji:"🐦"},
  {jp:"かに", kr:"게", emoji:"🦀"},
  {jp:"たこ", kr:"문어", emoji:"🐙"},
  {jp:"さかな", kr:"물고기", emoji:"🐟"},
  {jp:"くじら", kr:"고래", emoji:"🐳"},
  {jp:"いるか", kr:"돌고래", emoji:"🐬"},
  {jp:"ぱんだ", kr:"판다", emoji:"🐼"},
  {jp:"こあら", kr:"코알라", emoji:"🐨"},
  {jp:"ふくろう", kr:"부엉이", emoji:"🦉"},
  {jp:"こうもり", kr:"박쥐", emoji:"🦇"},
  {jp:"りす", kr:"다람쥐", emoji:"🐿️"},
  {jp:"かば", kr:"하마", emoji:"🦛"},
  {jp:"さい", kr:"코뿔소", emoji:"🦏"},
  {jp:"わに", kr:"악어", emoji:"🐊"},
  {jp:"ぺんぎん", kr:"펭귄", emoji:"🐧"},
  {jp:"おおかみ", kr:"늑대", emoji:"🐺"},
  {jp:"はち", kr:"벌", emoji:"🐝"},
  {jp:"ちょう", kr:"나비", emoji:"🦋"},
  {jp:"とかげ", kr:"도마뱀", emoji:"🦎"},

  /* 🍎 과일 */
  {jp:"りんご", kr:"사과", emoji:"🍎"},
  {jp:"みかん", kr:"귤", emoji:"🍊"},
  {jp:"ぶどう", kr:"포도", emoji:"🍇"},
  {jp:"ばなな", kr:"바나나", emoji:"🍌"},
  {jp:"いちご", kr:"딸기", emoji:"🍓"},
  {jp:"すいか", kr:"수박", emoji:"🍉"},
  {jp:"もも", kr:"복숭아", emoji:"🍑"},
  {jp:"なし", kr:"배(과일)", emoji:"🍐"},
  {jp:"れもん", kr:"레몬", emoji:"🍋"},
  {jp:"きうい", kr:"키위", emoji:"🥝"},

  /* 🍙 음식 */
  {jp:"ごはん", kr:"밥", emoji:"🍚"},
  {jp:"パン", kr:"빵", emoji:"🍞"},
  {jp:"おすし", kr:"초밥", emoji:"🍣"},
  {jp:"おにぎり", kr:"주먹밥", emoji:"🍙"},
  {jp:"たまごやき", kr:"계란말이", emoji:"🍳"},
  {jp:"ぎょうざ", kr:"만두", emoji:"🥟"},
  {jp:"けーき", kr:"케이크", emoji:"🍰"},
  {jp:"ぴざ", kr:"피자", emoji:"🍕"},
  {jp:"さらだ", kr:"샐러드", emoji:"🥗"},
  {jp:"みそしる", kr:"된장국", emoji:"🍲"}
];

const QA_ITEMS = [
  {emoji:"🍎", questionJp:"これは なにいろですか？", questionKr:"이것은 무슨 색입니까?", answerJp:"それは あかいろです。", answerKr:"그것은 빨간색입니다."},
  {emoji:"🍌", questionJp:"これは なにいろですか？", questionKr:"이것은 무슨 색입니까?", answerJp:"それは きいろです。", answerKr:"그것은 노란색입니다."},
  {emoji:"🍏", questionJp:"これは なにいろですか？", questionKr:"이것은 무슨 색입니까?", answerJp:"それは みどりいろです。", answerKr:"그것은 초록색입니다."},
  {emoji:"🫐", questionJp:"これは なにいろですか？", questionKr:"이것은 무슨 색입니까?", answerJp:"それは あおいろです。", answerKr:"그것은 파란색입니다."},
  {emoji:"🐶", questionJp:"いぬは どうやって なきますか？", questionKr:"강아지는 어떻게 웁니까?", answerJp:"わんわんと なきます。", answerKr:"멍멍하고 웁니다."},
  {emoji:"🐱", questionJp:"ねこは どうやって なきますか？", questionKr:"고양이는 어떻게 웁니까?", answerJp:"にゃーにゃーと なきます。", answerKr:"야옹야옹하고 웁니다."},
  {emoji:"😊", questionJp:"いまの きもちは どうですか？", questionKr:"지금 기분이 어떻습니까?", answerJp:"うれしいです。", answerKr:"기쁩니다."},
  {emoji:"😢", questionJp:"いまの きもちは どうですか？", questionKr:"지금 기분이 어떻습니까?", answerJp:"かなしいです。", answerKr:"슬픕니다."},
  {emoji:"🐘", questionJp:"ぞうは おおきいですか、ちいさいですか？", questionKr:"코끼리는 큽니까, 작습니까?", answerJp:"ぞうは おおきいです。", answerKr:"코끼리는 큽니다."},
  {emoji:"🐜", questionJp:"ありは おおきいですか、ちいさいですか？", questionKr:"개미는 큽니까, 작습니까?", answerJp:"ありは ちいさいです。", answerKr:"개미는 작습니다."},
  {emoji:"🍪", questionJp:"くっきーは どうですか？", questionKr:"쿠키는 어떻습니까?", answerJp:"くっきーは おいしいです。", answerKr:"쿠키는 맛있습니다."},
  {emoji:"☀️", questionJp:"きょうの てんきは どうですか？", questionKr:"오늘 날씨는 어떻습니까?", answerJp:"きょうは はれです。", answerKr:"오늘은 맑습니다."},
  {emoji:"🌧️", questionJp:"きょうの てんきは どうですか？", questionKr:"오늘 날씨는 어떻습니까?", answerJp:"きょうは あめです。", answerKr:"오늘은 비가 옵니다."},
  {emoji:"👩", questionJp:"これは だれですか？", questionKr:"이것은 누구입니까?", answerJp:"これは ままです。", answerKr:"이것은 엄마입니다."},
  {emoji:"👨", questionJp:"これは だれですか？", questionKr:"이것은 누구입니까?", answerJp:"これは ぱぱです。", answerKr:"이것은 아빠입니다."},
  {emoji:"🍎🍎", questionJp:"りんごは いくつ ありますか？", questionKr:"사과가 몇 개 있습니까?", answerJp:"りんごは ふたつ あります。", answerKr:"사과가 두 개 있습니다."}
];

const CLOCK_HOUR_JP = ['','いち','に','さん','よ','ご','ろく','しち','はち','く','じゅう','じゅういち','じゅうに'];

const CLOCK_MINUTES = [0,5,10,15,20,25,30,35,40,45,50,55];

const TEMP_NUMBER_JP = {0:'れい', 5:'ご', 10:'じゅう', 15:'じゅうご', 20:'にじゅう', 25:'にじゅうご', 30:'さんじゅう', 35:'さんじゅうご'};

const LIFEQA_TEMPS = [-5,0,5,10,15,20,25,30,35];

const WEATHER_TYPES = [
  { key:'sunny',  answerJp:"きょうは はれです。",       answerKr:"오늘은 맑습니다." },
  { key:'cloudy', answerJp:"きょうは くもりです。",     answerKr:"오늘은 흐립니다." },
  { key:'rainy',  answerJp:"きょうは あめです。",       answerKr:"오늘은 비가 옵니다." },
  { key:'snowy',  answerJp:"きょうは ゆきです。",       answerKr:"오늘은 눈이 옵니다." },
  { key:'windy',  answerJp:"きょうは かぜが つよいです。", answerKr:"오늘은 바람이 셉니다." }
];

const LIFEQA_ITEMS = [];

const SHOP_ITEMS_POOL = [
  {jp:"すいか", kr:"수박", emoji:"🍉"},
  {jp:"りんご", kr:"사과", emoji:"🍎"},
  {jp:"いちご", kr:"딸기", emoji:"🍓"},
  {jp:"パイナップル", kr:"파인애플", emoji:"🍍"},
  {jp:"バナナ", kr:"바나나", emoji:"🍌"},
  {jp:"みかん", kr:"귤", emoji:"🍊"},
  {jp:"ぶどう", kr:"포도", emoji:"🍇"},
  {jp:"もも", kr:"복숭아", emoji:"🍑"},
  {jp:"メロン", kr:"멜론", emoji:"🍈"},
  {jp:"おにぎり", kr:"주먹밥", emoji:"🍙"},
  {jp:"ぱん", kr:"빵", emoji:"🍞"},
  {jp:"たまご", kr:"계란", emoji:"🥚"}
];

const SHOP_PRICES = [100,200,300,400,500,600,700,800,900];

const SHOP_HUNDRED_READINGS = {
  1:"ひゃく", 2:"にひゃく", 3:"さんびゃく", 4:"よんひゃく",
  5:"ごひゃく", 6:"ろっぴゃく", 7:"ななひゃく", 8:"はっぴゃく", 9:"きゅうひゃく"
};

const SCENES = [
  {
    title: "아침에 일어나기", emoji: "🌅",
    lines: [
      {jp:"おはよう", romaji:"ohayou", kr:"좋은 아침이야"},
      {jp:"よくねたね", romaji:"yoku neta ne", kr:"잘 잤구나"},
      {jp:"きがえようね", romaji:"kigaeyou ne", kr:"옷 갈아입자"},
      {jp:"げんき？", romaji:"genki?", kr:"기분 좋아?"}
    ]
  },
  {
    title: "식사 시간", emoji: "🍚",
    lines: [
      {jp:"まんま、どうぞ", romaji:"manma, douzo", kr:"맘마 여기 있어"},
      {jp:"いただきます", romaji:"itadakimasu", kr:"잘 먹겠습니다"},
      {jp:"おいしいね", romaji:"oishii ne", kr:"맛있지"},
      {jp:"ごちそうさま", romaji:"gochisousama", kr:"잘 먹었습니다"}
    ]
  },
  {
    title: "목욕 시간", emoji: "🛁",
    lines: [
      {jp:"おふろ、はいろうか", romaji:"ofuro, hairou ka", kr:"목욕할까?"},
      {jp:"あったかいね", romaji:"attakai ne", kr:"따뜻하지"},
      {jp:"きれいきれい", romaji:"kirei kirei", kr:"깨끗깨끗 씻자"},
      {jp:"さっぱりしたね", romaji:"sappari shita ne", kr:"개운하지"}
    ]
  },
  {
    title: "놀이 시간", emoji: "🧸",
    lines: [
      {jp:"あそぼうね", romaji:"asobou ne", kr:"놀자"},
      {jp:"じょうずだね", romaji:"jouzu da ne", kr:"잘하네"},
      {jp:"もういっかい？", romaji:"mou ikkai?", kr:"한 번 더?"},
      {jp:"たのしいね", romaji:"tanoshii ne", kr:"재밌지"}
    ]
  },
  {
    title: "잠자리", emoji: "🌙",
    lines: [
      {jp:"ねんねしようね", romaji:"nenne shiyou ne", kr:"코 자자"},
      {jp:"だっこするね", romaji:"dakko suru ne", kr:"안아줄게"},
      {jp:"いいゆめをね", romaji:"ii yume wo ne", kr:"좋은 꿈 꿔"},
      {jp:"おやすみ", romaji:"oyasumi", kr:"잘 자"}
    ]
  }
];

const EBOOKS = [
  {
    title: "犬と肉〜イソップ物語より",
    level: "Level Start",
    desc: "배고픈 개가 고기를 물고 다리를 건너다 벌어지는 이솝우화예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/w0012t-inutoniku-v2-scaled.jpg",
    credit: "再話：NPO多言語多読　絵：高橋智子",
    sourceUrl: "https://tadoku.org/japanese/book/40182/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/w0012a-inutoniku.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/w0012e-inutoniku-v3.pdf"
  },
  {
    title: "あっ、まるい",
    level: "Level Start",
    desc: "잃어버린 둥근 공을 찾아 동네를 돌아다니는 강아지 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0094t-marui-v2.jpg",
    credit: "作：池田あきつ、田中麻美、田中るり子、中越尚美　絵：池田あきつ",
    sourceUrl: "https://tadoku.org/japanese/book/39479/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0094a-marui-v2.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0094e-marui-v4.pdf"
  },
  {
    title: "じゃんけん",
    level: "Level Start",
    desc: "케이크 두 조각을 셋이서 가위바위보로 나누는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0079t-janken-v2.jpg",
    credit: "作：長田奈都子　絵：長田奈都子、高橋智子",
    sourceUrl: "https://tadoku.org/japanese/book/8597/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0079a-janken-v2.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0079e-janken-v5-2.pdf"
  },
  {
    title: "どっち？",
    level: "Level Start",
    desc: "고양이에게 이것저것 물어보며 좋고 싫음을 알아가는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0071t-dotchi-v2.jpg",
    credit: "作：川名恭子",
    sourceUrl: "https://tadoku.org/japanese/book/8137/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0071a-dotchi-v2.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0071e-dotchi-v4.pdf"
  },
  {
    title: "どうぞどうも",
    level: "Level Start",
    desc: "\"どうぞ\"와 \"どうも\"라는 인사말이 오가며 이어지는 짧은 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0056t-douzodoumo-v2.jpg",
    credit: "作：片山智子、作田奈苗、ジョンソン知亜紀、宮城恵弥子",
    sourceUrl: "https://tadoku.org/japanese/book/6812/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0056a-douzodoumo-v2.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0056e-douzodoumo-v4.pdf"
  },
  {
    title: "TKG",
    level: "Level Start",
    desc: "일본인이 즐겨 먹는 계란밥(卵かけご飯) 문화를 소개하는 사진 그림책이에요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0052t-tkg-v3.jpg",
    credit: "作：粟野真紀子、大越貴子、川名恭子、熊谷由香",
    sourceUrl: "https://tadoku.org/japanese/book/6459/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0052a-tkg-v4.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0052e-tkg-v5.pdf"
  },
  {
    title: "何を飲みますか？",
    level: "Level Start",
    desc: "컵, 찻잔 등 음료를 담는 다양한 그릇의 이름을 소개하는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0050t-naniwonomimasuka-v2.jpg",
    credit: "作：川名恭子",
    sourceUrl: "https://tadoku.org/japanese/book/6447/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0050a-naniwonomimasuka-v2.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0050e-naniwonomimasuka-v4.pdf"
  },
  {
    title: "雨",
    level: "Level Start",
    desc: "다람쥐가 비를 만나며 다양한 빗소리 의성어를 배우는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0047t-ame-v2.jpg",
    credit: "作：曲云菲、ジェニングス榎本早苗、松田緑、横山りえこ　絵：いらすとや",
    sourceUrl: "https://tadoku.org/japanese/book/6301/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0047a-ame-v2.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0047e-ame-v4.pdf"
  },
  {
    title: "おばあちゃんがいない",
    level: "Level 1",
    desc: "치히로가 할머니 댁에서 혼자 자던 날, 낮잠에서 깨어보니 할머니가 사라진 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0116t-obaachangainai.jpg",
    credit: "作：くどうみさと、原千裕、Hao Wenyu　絵：くどうみさと",
    sourceUrl: "https://tadoku.org/japanese/book/48395/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0116a-obaachangainai.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0116e-obaachangainai.pdf"
  },
  {
    title: "ぼくのかぞく",
    level: "Level 1",
    desc: "아기 때부터 함께한 곰인형이 라이벌의 등장으로 '가장 소중한 자리'를 지키려는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0103t-bokunokazoku.jpg",
    credit: "作・絵：池田あきつ",
    sourceUrl: "https://tadoku.org/japanese/book/42390/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0103a-bokunokazoku.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0103e-bokunokazoku.pdf"
  },
  {
    title: "落花生はおもしろい！",
    level: "Level 1",
    desc: "모두가 좋아하는 땅콩(落花生)이 왜 그런 이름을 갖게 됐는지, 씨앗부터 길러보며 알아가는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0090t-rakkasei.jpg",
    credit: "作：川本かず子、田中るり子、中越尚美、松田緑",
    sourceUrl: "https://tadoku.org/japanese/book/38533/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0090a-rakkasei.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0090e-rakkasei-v2.pdf"
  },
  {
    title: "山に行きました",
    level: "Level 1",
    desc: "산을 좋아하는 강아지 윈리가 캠핑을 갔다가 뜻밖의 일을 겪는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0086t-yamani.jpg",
    credit: "作・絵：ディアナ・ボジャノバ",
    sourceUrl: "https://tadoku.org/japanese/book/9295/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0086a-yamani.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0086e-yamani-v4-1.pdf"
  },
  {
    title: "夜の図書館",
    level: "Level 2",
    desc: "밤마다 도서관에 누군가 책을 반납하러 오지만 책이 곧 사라지는, 조금 신비하고 뭉클한 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0110t-yorunotoshokan.jpg",
    credit: "作：和田朋也、任群、門倉未来　写真：作田奈苗",
    sourceUrl: "https://tadoku.org/japanese/book/44313/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0110a-yorunotoshokan.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0110e-yorunotoshokan-v2.pdf"
  },
  {
    title: "私の彼氏は油揚げが好き",
    level: "Level 2",
    desc: "새 동네에서 사귄 남자친구가 유부(油揚げ)를 좋아하는 진짜 이유를 알게 되는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0106t-watasinokaresi.jpg",
    credit: "作：くどうみさと、原千裕、Hao Wenyu、林実幸　絵：くどうみさと",
    sourceUrl: "https://tadoku.org/japanese/book/43170/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0106a-watasinokaresi.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0106e-watasinokaresi.pdf"
  },
  {
    title: "山田さんの大問題",
    level: "Level 2",
    desc: "마루오 군의 집에 이상한 얼굴을 한 사람들이 찾아오는, 한자를 재미있게 익히는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0092t-yamadasan.jpg",
    credit: "作：池田あきつ",
    sourceUrl: "https://tadoku.org/japanese/book/38919/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0092a-yamadasan.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0092e-yamadasan-v3.pdf"
  },
  {
    title: "北海道",
    level: "Level 2",
    desc: "일본 북쪽의 섬 홋카이도의 동물과 음식, 관광지를 사진과 함께 소개하는 이야기예요.",
    cover: "https://tadoku.org/japanese/wp-content/uploads/f0058t-hokkaido.jpg",
    credit: "作：遠藤和彦",
    sourceUrl: "https://tadoku.org/japanese/book/6987/",
    license: "CC BY-NC-ND 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    mp3: "https://tadoku.org/japanese/wp-content/uploads/f0058a-hokkaido.mp3",
    pdf: "https://tadoku.org/japanese/wp-content/uploads/f0058e-hokkaido.pdf"
  }
];

const FRUIT_STORYBOOKS = [
  {
    title: "りんご", cover: "🍎", sub: "사과 이야기",
    pages: [
      {emoji:"🍎", jp:"りんご", romaji:"ringo", kr:"사과"},
      {emoji:"🍎🔴", jp:"りんご あかいね", romaji:"ringo akai ne", jpFormal:"りんごは あかいです", romajiFormal:"ringo wa akai desu", kr:"사과는 빨개요"},
      {emoji:"🍎🌳", jp:"りんご きに なるよ", romaji:"ringo ki ni naru yo", jpFormal:"りんごは きに なります", romajiFormal:"ringo wa ki ni narimasu", kr:"사과는 나무에서 자라요"},
      {emoji:"🍎👃", jp:"りんご いいにおい", romaji:"ringo ii nioi", jpFormal:"りんごは いいにおいが します", romajiFormal:"ringo wa ii nioi ga shimasu", kr:"사과는 좋은 냄새가 나요"},
      {emoji:"🍎🐻", jp:"くまさん だいすき", romaji:"kumasan daisuki", jpFormal:"くまさんが だいすきです", romajiFormal:"kumasan ga daisuki desu", kr:"곰돌이가 정말 좋아해요"}
    ]
  },
  {
    title: "ばなな", cover: "🍌", sub: "바나나 이야기",
    pages: [
      {emoji:"🍌", jp:"ばなな", romaji:"banana", kr:"바나나"},
      {emoji:"🍌🟡", jp:"ばなな きいろいね", romaji:"banana kiiroi ne", jpFormal:"ばななは きいろいです", romajiFormal:"banana wa kiiroi desu", kr:"바나나는 노래요"},
      {emoji:"🍌✋", jp:"ばなな むいて たべるよ", romaji:"banana muite taberu yo", jpFormal:"ばななは かわを むいて たべます", romajiFormal:"banana wa kawa wo muite tabemasu", kr:"바나나는 껍질을 까서 먹어요"},
      {emoji:"🍌👃", jp:"ばなな あまいにおい", romaji:"banana amai nioi", jpFormal:"ばななは あまい においが します", romajiFormal:"banana wa amai nioi ga shimasu", kr:"바나나는 달콤한 냄새가 나요"},
      {emoji:"🍌🐵", jp:"さるさん だいすき", romaji:"sarusan daisuki", jpFormal:"さるさんが だいすきです", romajiFormal:"sarusan ga daisuki desu", kr:"원숭이가 정말 좋아해요"}
    ]
  },
  {
    title: "ぶどう", cover: "🍇", sub: "포도 이야기",
    pages: [
      {emoji:"🍇", jp:"ぶどう", romaji:"budou", kr:"포도"},
      {emoji:"🍇🟣", jp:"ぶどう むらさきだね", romaji:"budou murasaki da ne", jpFormal:"ぶどうは むらさきです", romajiFormal:"budou wa murasaki desu", kr:"포도는 보라색이에요"},
      {emoji:"🍇🧃", jp:"ぶどう じゅーすに なるよ", romaji:"budou juusu ni naru yo", jpFormal:"ぶどうは じゅーすに なります", romajiFormal:"budou wa juusu ni narimasu", kr:"포도로 주스도 만들어요"},
      {emoji:"🍇👃", jp:"ぶどう あまいにおい", romaji:"budou amai nioi", jpFormal:"ぶどうは あまい においが します", romajiFormal:"budou wa amai nioi ga shimasu", kr:"포도는 달콤한 냄새가 나요"},
      {emoji:"🍇🐦", jp:"ことりさん だいすき", romaji:"kotorisan daisuki", jpFormal:"ことりさんが だいすきです", romajiFormal:"kotorisan ga daisuki desu", kr:"작은 새가 정말 좋아해요"}
    ]
  },
  {
    title: "いちご", cover: "🍓", sub: "딸기 이야기",
    pages: [
      {emoji:"🍓", jp:"いちご", romaji:"ichigo", kr:"딸기"},
      {emoji:"🍓🔴", jp:"いちご あかいね", romaji:"ichigo akai ne", jpFormal:"いちごは あかいです", romajiFormal:"ichigo wa akai desu", kr:"딸기는 빨개요"},
      {emoji:"🍓🌱", jp:"いちご たねが そとに あるよ", romaji:"ichigo tane ga soto ni aru yo", jpFormal:"いちごは たねが そとに あります", romajiFormal:"ichigo wa tane ga soto ni arimasu", kr:"딸기는 씨가 겉에 있어요"},
      {emoji:"🍓👃", jp:"いちご いいかおり", romaji:"ichigo ii kaori", jpFormal:"いちごは いい かおりが します", romajiFormal:"ichigo wa ii kaori ga shimasu", kr:"딸기는 좋은 향이 나요"},
      {emoji:"🍓🐹", jp:"はむすたーさん だいすき", romaji:"hamusutaasan daisuki", jpFormal:"はむすたーさんが だいすきです", romajiFormal:"hamusutaasan ga daisuki desu", kr:"햄스터가 정말 좋아해요"}
    ]
  },
  {
    title: "すいか", cover: "🍉", sub: "수박 이야기",
    pages: [
      {emoji:"🍉", jp:"すいか", romaji:"suika", kr:"수박"},
      {emoji:"🍉🟢", jp:"そとがわ みどりいろ", romaji:"sotogawa midori iro", jpFormal:"そとがわは みどりいろです", romajiFormal:"sotogawa wa midori iro desu", kr:"겉은 초록색이에요"},
      {emoji:"🍉💧", jp:"すいか みずが たくさんだよ", romaji:"suika mizu ga takusan da yo", jpFormal:"すいかは みずが たくさん あります", romajiFormal:"suika wa mizu ga takusan arimasu", kr:"수박 안에는 물이 많아요"},
      {emoji:"🍉👃", jp:"すいか さわやかな におい", romaji:"suika sawayakana nioi", jpFormal:"すいかは さわやかな においが します", romajiFormal:"suika wa sawayakana nioi ga shimasu", kr:"수박은 상큼한 냄새가 나요"},
      {emoji:"🍉🐘", jp:"ぞうさん だいすき", romaji:"zousan daisuki", jpFormal:"ぞうさんが だいすきです", romajiFormal:"zousan ga daisuki desu", kr:"코끼리가 정말 좋아해요"}
    ]
  },
  {
    title: "もも", cover: "🍑", sub: "복숭아 이야기",
    pages: [
      {emoji:"🍑", jp:"もも", romaji:"momo", kr:"복숭아"},
      {emoji:"🍑🌸", jp:"もも ピンクいろ", romaji:"momo pinku iro", jpFormal:"ももは ピンクいろです", romajiFormal:"momo wa pinku iro desu", kr:"복숭아는 분홍색이에요"},
      {emoji:"🍑🧸", jp:"もも けが あるよ", romaji:"momo ke ga aru yo", jpFormal:"ももは けが あります", romajiFormal:"momo wa ke ga arimasu", kr:"복숭아 껍질에는 작은 털이 있어요"},
      {emoji:"🍑👃", jp:"もも いいかおり", romaji:"momo ii kaori", jpFormal:"ももは いい かおりが します", romajiFormal:"momo wa ii kaori ga shimasu", kr:"복숭아는 좋은 향이 나요"},
      {emoji:"🍑🐰", jp:"うさぎさん だいすき", romaji:"usagisan daisuki", jpFormal:"うさぎさんが だいすきです", romajiFormal:"usagisan ga daisuki desu", kr:"토끼가 정말 좋아해요"}
    ]
  },
  {
    title: "みかん", cover: "🍊", sub: "귤 이야기",
    pages: [
      {emoji:"🍊", jp:"みかん", romaji:"mikan", kr:"귤"},
      {emoji:"🍊🟠", jp:"みかん だいだいいろ", romaji:"mikan daidai iro", jpFormal:"みかんは だいだいいろです", romajiFormal:"mikan wa daidai iro desu", kr:"귤은 주황색이에요"},
      {emoji:"🍊⛄", jp:"みかん ふゆに たべるよ", romaji:"mikan fuyu ni taberu yo", jpFormal:"みかんは ふゆに たくさん たべます", romajiFormal:"mikan wa fuyu ni takusan tabemasu", kr:"귤은 겨울에 많이 먹는 과일이에요"},
      {emoji:"🍊👃", jp:"みかん あまずっぱい におい", romaji:"mikan amazuppai nioi", jpFormal:"みかんは あまずっぱい においが します", romajiFormal:"mikan wa amazuppai nioi ga shimasu", kr:"귤은 새콤달콤한 냄새가 나요"},
      {emoji:"🍊🐿️", jp:"りすさん だいすき", romaji:"risusan daisuki", jpFormal:"りすさんが だいすきです", romajiFormal:"risusan ga daisuki desu", kr:"다람쥐가 정말 좋아해요"}
    ]
  },
  {
    title: "れもん", cover: "🍋", sub: "레몬 이야기",
    pages: [
      {emoji:"🍋", jp:"れもん", romaji:"remon", kr:"레몬"},
      {emoji:"🍋🟡", jp:"れもん きいろいね", romaji:"remon kiiroi ne", jpFormal:"れもんは きいろいです", romajiFormal:"remon wa kiiroi desu", kr:"레몬은 노래요"},
      {emoji:"🍋😖", jp:"れもん すっぱいね", romaji:"remon suppai ne", jpFormal:"れもんは とても すっぱいです", romajiFormal:"remon wa totemo suppai desu", kr:"레몬은 아주 셔요"},
      {emoji:"🍋👃", jp:"れもん さっぱりした におい", romaji:"remon sappari shita nioi", jpFormal:"れもんは さっぱりした においが します", romajiFormal:"remon wa sappari shita nioi ga shimasu", kr:"레몬은 상큼한 냄새가 나요"},
      {emoji:"🍋🦋", jp:"ちょうちょさん だいすき", romaji:"chouchousan daisuki", jpFormal:"ちょうちょさんが だいすきです", romajiFormal:"chouchousan ga daisuki desu", kr:"나비가 정말 좋아해요"}
    ]
  },
  {
    title: "ぱいなっぷる", cover: "🍍", sub: "파인애플 이야기",
    pages: [
      {emoji:"🍍", jp:"ぱいなっぷる", romaji:"painappuru", kr:"파인애플"},
      {emoji:"🍍🟡", jp:"なか きいろいね", romaji:"naka kiiroi ne", jpFormal:"なかは きいろいです", romajiFormal:"naka wa kiiroi desu", kr:"속은 노래요"},
      {emoji:"🍍🌵", jp:"ぱいなっぷる とげが あるよ", romaji:"painappuru toge ga aru yo", jpFormal:"ぱいなっぷるは とげが あります", romajiFormal:"painappuru wa toge ga arimasu", kr:"파인애플 겉에는 가시가 있어요"},
      {emoji:"🍍👃", jp:"あまい かおりだね", romaji:"amai kaori da ne", jpFormal:"あまい かおりが します", romajiFormal:"amai kaori ga shimasu", kr:"달콤한 향이 나요"},
      {emoji:"🍍🦜", jp:"おうむさん だいすき", romaji:"oumusan daisuki", jpFormal:"おうむさんが だいすきです", romajiFormal:"oumusan ga daisuki desu", kr:"앵무새가 정말 좋아해요"}
    ]
  },
  {
    title: "めろん", cover: "🍈", sub: "멜론 이야기",
    pages: [
      {emoji:"🍈", jp:"めろん", romaji:"meron", kr:"멜론"},
      {emoji:"🍈🟢", jp:"みどりいろ だね", romaji:"midori iro da ne", jpFormal:"みどりいろです", romajiFormal:"midori iro desu", kr:"초록색이에요"},
      {emoji:"🍈🕸️", jp:"めろん あみが あるよ", romaji:"meron ami ga aru yo", jpFormal:"めろんは あみが あります", romajiFormal:"meron wa ami ga arimasu", kr:"멜론 겉에는 그물무늬가 있어요"},
      {emoji:"🍈👃", jp:"あまい におい", romaji:"amai nioi", jpFormal:"あまい においが します", romajiFormal:"amai nioi ga shimasu", kr:"달콤한 냄새가 나요"},
      {emoji:"🍈🦔", jp:"はりねずみさん だいすき", romaji:"harinezumisan daisuki", jpFormal:"はりねずみさんが だいすきです", romajiFormal:"harinezumisan ga daisuki desu", kr:"고슴도치가 정말 좋아해요"}
    ]
  }
];

const STORYBOOKS = [
  {
    title: "だるまさんが", cover: "🎎", sub: "데굴데굴 달마상 (대표 흔들흔들 놀이 그림책)",
    pages: [
      {emoji:"🎎", jp:"だるまさんが", romaji:"daruma-san ga", kr:"달마상이"},
      {emoji:"🌀", jp:"ぐらぐらぐら", romaji:"gura gura gura", kr:"흔들흔들 흔들"},
      {emoji:"💥", jp:"どてっ！", romaji:"dote!", kr:"쿵!"},
      {emoji:"😆", jp:"だいじょうぶ？", romaji:"daijoubu?", kr:"괜찮아?"},
      {emoji:"😊", jp:"にっこり わらった", romaji:"nikkori waratta", kr:"방긋 웃었어요"}
    ]
  },
  {
    title: "もこもこ くも", cover: "☁️", sub: "몽글몽글 구름이 모양을 바꿔요",
    pages: [
      {emoji:"☁️", jp:"もこもこ くも", romaji:"mokomoko kumo", kr:"몽글몽글 구름"},
      {emoji:"🐑", jp:"ひつじ みたいだね", romaji:"hitsuji mitai da ne", kr:"양 같아요"},
      {emoji:"🌬️", jp:"ふわふわ うごくよ", romaji:"fuwafuwa ugoku yo", kr:"둥실둥실 움직여요"},
      {emoji:"🌈", jp:"にじも でてきた", romaji:"niji mo detekita", kr:"무지개도 나왔어요"}
    ]
  },
  {
    title: "いない いない ばあ", cover: "🙈", sub: "가장 사랑받는 까꿍 놀이 그림책",
    pages: [
      {emoji:"🙈", jp:"いない いない", romaji:"inai inai", kr:"까꿍 까꿍"},
      {emoji:"😲", jp:"ばあ！", romaji:"baa!", kr:"짠!"},
      {emoji:"😄", jp:"わあ、いたね", romaji:"waa, ita ne", kr:"와, 여기 있었네"},
      {emoji:"🙈", jp:"もういっかい", romaji:"mou ikkai", kr:"한 번 더"},
      {emoji:"😂", jp:"たのしいね", romaji:"tanoshii ne", kr:"재밌지"}
    ]
  },
  {
    title: "くだもの だいすき", cover: "🍎", sub: "색깔과 맛으로 배우는 과일 그림책",
    pages: [
      {emoji:"🍎", jp:"りんご あかいね", romaji:"ringo akai ne", kr:"사과는 빨개요"},
      {emoji:"🍌", jp:"ばなな きいろいね", romaji:"banana kiiroi ne", kr:"바나나는 노래요"},
      {emoji:"🍇", jp:"ぶどう つぶつぶ", romaji:"budou tsubutsubu", kr:"포도는 알알이"},
      {emoji:"🍊", jp:"みかん あまいね", romaji:"mikan amai ne", kr:"귤은 달아요"}
    ]
  },
  {
    title: "どうぶつ えん", cover: "🦁", sub: "동물 소리를 흉내내며 노는 그림책",
    pages: [
      {emoji:"🦁", jp:"らいおん がおー", romaji:"raion gaoo", kr:"사자는 어흥"},
      {emoji:"🐘", jp:"ぞうさん おおきいね", romaji:"zousan ookii ne", kr:"코끼리는 커요"},
      {emoji:"🐒", jp:"さるさん ぴょんぴょん", romaji:"sarusan pyonpyon", kr:"원숭이는 깡충깡충"},
      {emoji:"🦒", jp:"きりんさん のっぽだね", romaji:"kirinsan noppo da ne", kr:"기린은 키가 커요"}
    ]
  },
  {
    title: "のりもの ぶーぶー", cover: "🚗", sub: "탈것 의성어로 배우는 그림책",
    pages: [
      {emoji:"🚗", jp:"くるま ぶーぶー", romaji:"kuruma buubuu", kr:"자동차 붕붕"},
      {emoji:"🚌", jp:"ばす がたごと", romaji:"basu gatagoto", kr:"버스 덜컹덜컹"},
      {emoji:"🚆", jp:"でんしゃ しゅっしゅっ", romaji:"densha shusshu", kr:"기차 칙칙폭폭"},
      {emoji:"✈️", jp:"ひこうき びゅーん", romaji:"hikouki byuun", kr:"비행기 슝"}
    ]
  },
  {
    title: "あめ ぽつぽつ", cover: "🌧️", sub: "비오는 날 창밖 풍경 그림책",
    pages: [
      {emoji:"🌧️", jp:"あめ ぽつぽつ", romaji:"ame potsupotsu", kr:"비가 똑똑"},
      {emoji:"☂️", jp:"かさ さそうね", romaji:"kasa sasou ne", kr:"우산 쓰자"},
      {emoji:"💧", jp:"ぴちゃぴちゃ みずたまり", romaji:"pichapicha mizutamari", kr:"찰방찰방 물웅덩이"},
      {emoji:"🌤️", jp:"あめ やんだね", romaji:"ame yanda ne", kr:"비가 그쳤어요"}
    ]
  },
  {
    title: "おふろ じゃぶじゃぶ", cover: "🛁", sub: "목욕 시간 루틴 그림책",
    pages: [
      {emoji:"🛁", jp:"おふろ はいろう", romaji:"ofuro hairou", kr:"목욕하자"},
      {emoji:"🫧", jp:"あわあわ できたよ", romaji:"awaawa dekita yo", kr:"거품이 생겼어요"},
      {emoji:"💦", jp:"じゃぶじゃぶ たのしいね", romaji:"jabujabu tanoshii ne", kr:"첨벙첨벙 재밌지"},
      {emoji:"🧴", jp:"きれいに なったね", romaji:"kirei ni natta ne", kr:"깨끗해졌네"}
    ]
  },
  {
    title: "ねんね の じかん", cover: "🌙", sub: "잠자리 루틴을 익히는 수면 그림책",
    pages: [
      {emoji:"🌙", jp:"おつきさま でたね", romaji:"otsukisama deta ne", kr:"달님이 떴어요"},
      {emoji:"🧸", jp:"くまさん といっしょ", romaji:"kumasan to issho", kr:"곰인형과 함께"},
      {emoji:"🛏️", jp:"ふとん あったかい", romaji:"futon attakai", kr:"이불이 따뜻해요"},
      {emoji:"😴", jp:"おやすみなさい", romaji:"oyasuminasai", kr:"잘 자요"}
    ]
  },
  {
    title: "わんわん にゃんにゃん", cover: "🐶", sub: "동물 울음소리 흉내 그림책",
    pages: [
      {emoji:"🐶", jp:"いぬさん わんわん", romaji:"inusan wanwan", kr:"강아지 멍멍"},
      {emoji:"🐱", jp:"ねこさん にゃんにゃん", romaji:"nekosan nyannyan", kr:"고양이 야옹"},
      {emoji:"🐮", jp:"うしさん もーもー", romaji:"ushisan moumou", kr:"소는 음메"},
      {emoji:"🐷", jp:"ぶたさん ぶーぶー", romaji:"butasan buubuu", kr:"돼지는 꿀꿀"}
    ]
  },
  {
    title: "おおきい ちいさい", cover: "📏", sub: "크기 비교로 배우는 그림책",
    pages: [
      {emoji:"🐘", jp:"ぞうさん おおきい", romaji:"zousan ookii", kr:"코끼리는 커요"},
      {emoji:"🐭", jp:"ねずみさん ちいさい", romaji:"nezumisan chiisai", kr:"쥐는 작아요"},
      {emoji:"🎈", jp:"ふうせん ふくらんだ", romaji:"fuusen fukuranda", kr:"풍선이 부풀었어요"},
      {emoji:"🔍", jp:"くらべてみよう", romaji:"kurabete miyou", kr:"비교해봐요"}
    ]
  },
  {
    title: "あか あお きいろ", cover: "🎨", sub: "색깔 이름을 익히는 그림책",
    pages: [
      {emoji:"🔴", jp:"あか いちご", romaji:"aka ichigo", kr:"빨간 딸기"},
      {emoji:"🔵", jp:"あお そら", romaji:"ao sora", kr:"파란 하늘"},
      {emoji:"🟡", jp:"きいろ ひまわり", romaji:"kiiro himawari", kr:"노란 해바라기"},
      {emoji:"🟢", jp:"みどり は っぱ", romaji:"midori happa", kr:"초록 나뭇잎"}
    ]
  },
  {
    title: "たべもの もぐもぐ", cover: "🍙", sub: "식사 시간 의성어 그림책",
    pages: [
      {emoji:"🍙", jp:"おにぎり ぱくっ", romaji:"onigiri paku", kr:"주먹밥 냠"},
      {emoji:"🍞", jp:"ぱん ふわふわ", romaji:"pan fuwafuwa", kr:"빵은 폭신폭신"},
      {emoji:"🥛", jp:"ぎゅうにゅう ごくごく", romaji:"gyuunyuu gokugoku", kr:"우유 꿀꺽꿀꺽"},
      {emoji:"😋", jp:"おいしいね", romaji:"oishii ne", kr:"맛있지"}
    ]
  },
  {
    title: "かぜ びゅーびゅー", cover: "🍃", sub: "바람 부는 날 풍경 그림책",
    pages: [
      {emoji:"🍃", jp:"かぜ びゅーびゅー", romaji:"kaze byuubyuu", kr:"바람이 휭휭"},
      {emoji:"🍂", jp:"はっぱ とんでいく", romaji:"happa tondeiku", kr:"나뭇잎이 날아가요"},
      {emoji:"🎏", jp:"こいのぼり ゆれるね", romaji:"koinobori yureru ne", kr:"잉어깃발이 흔들려요"},
      {emoji:"🌳", jp:"きの えだも ゆれるよ", romaji:"ki no eda mo yureru yo", kr:"나뭇가지도 흔들려요"}
    ]
  },
  {
    title: "おつきさま こんばんは", cover: "🌕", sub: "밤 인사를 나누는 잠자리 그림책",
    pages: [
      {emoji:"🌕", jp:"おつきさま こんばんは", romaji:"otsukisama konbanwa", kr:"달님 안녕하세요"},
      {emoji:"⭐", jp:"おほしさま きらきら", romaji:"ohoshisama kirakira", kr:"별님이 반짝반짝"},
      {emoji:"🦉", jp:"ふくろうさん おやすみ", romaji:"fukurousan oyasumi", kr:"부엉이도 잘 자요"},
      {emoji:"😴", jp:"みんな ねんねしようね", romaji:"minna nenne shiyou ne", kr:"다같이 코 자요"}
    ]
  },
  {
    title: "かぞえてみよう", cover: "🔢", sub: "사과로 숫자를 세어보는 그림책",
    pages: [
      {emoji:"🍎", jp:"りんご いっこ", romaji:"ringo ikko", kr:"사과 한 개"},
      {emoji:"🍎🍎", jp:"りんご にこ", romaji:"ringo niko", kr:"사과 두 개"},
      {emoji:"🍎🍎🍎", jp:"りんご さんこ", romaji:"ringo sanko", kr:"사과 세 개"},
      {emoji:"🎉", jp:"ぜんぶで さんこ", romaji:"zenbu de sanko", kr:"전부 세 개"}
    ]
  },
  {
    title: "うみ の いきもの", cover: "🐠", sub: "바다 생물 움직임을 흉내내는 그림책",
    pages: [
      {emoji:"🐠", jp:"さかな すいすい", romaji:"sakana suisui", kr:"물고기가 쓱쓱"},
      {emoji:"🐙", jp:"たこ にょろにょろ", romaji:"tako nyoronyoro", kr:"문어가 꿈틀꿈틀"},
      {emoji:"🦀", jp:"かに よこあるき", romaji:"kani yoko aruki", kr:"게는 옆으로 걸어요"},
      {emoji:"🐬", jp:"いるか ぴょーん", romaji:"iruka pyoon", kr:"돌고래는 폴짝"}
    ]
  },
  {
    title: "おはな が さいた", cover: "🌷", sub: "씨앗이 꽃이 되는 성장 그림책",
    pages: [
      {emoji:"🌱", jp:"めが でたよ", romaji:"me ga deta yo", kr:"싹이 났어요"},
      {emoji:"🌿", jp:"はっぱが ふえたね", romaji:"happa ga fueta ne", kr:"잎이 늘었어요"},
      {emoji:"🌷", jp:"おはなが さいた", romaji:"ohana ga saita", kr:"꽃이 피었어요"},
      {emoji:"🦋", jp:"ちょうちょが きたよ", romaji:"chouchou ga kita yo", kr:"나비가 왔어요"}
    ]
  },
  {
    title: "きゃっきゃっ わらおう", cover: "😆", sub: "스킨십 놀이 웃음 그림책",
    pages: [
      {emoji:"🤸", jp:"たかいたかい", romaji:"takai takai", kr:"높이 높이"},
      {emoji:"😆", jp:"きゃっきゃっ", romaji:"kyakkyaa", kr:"까르르"},
      {emoji:"🤗", jp:"ぎゅーっと だっこ", romaji:"gyuutto dakko", kr:"꼭 안아줘요"},
      {emoji:"😊", jp:"うれしいね", romaji:"ureshii ne", kr:"기쁘지"}
    ]
  },
  {
    title: "いってきます いってらっしゃい", cover: "👋", sub: "외출 인사말을 배우는 생활 그림책",
    pages: [
      {emoji:"👋", jp:"いってきます", romaji:"ittekimasu", kr:"다녀오겠습니다"},
      {emoji:"🚪", jp:"いってらっしゃい", romaji:"itterasshai", kr:"다녀오세요"},
      {emoji:"🏠", jp:"ただいま", romaji:"tadaima", kr:"다녀왔습니다"},
      {emoji:"🤗", jp:"おかえりなさい", romaji:"okaerinasai", kr:"어서 오세요"}
    ]
  },
  {
    title: "ちょっと来て！", cover: "🙋", sub: "가족을 불러서 자랑하는 생활 그림책 (Level S)",
    pages: [
      {emoji:"👩", jp:"お母さん、ちょっと来て！", romaji:"okaasan, chotto kite!", kr:"엄마, 잠깐 와봐!"},
      {emoji:"❓", jp:"なあに？", romaji:"naani?", kr:"왜 그러니?"},
      {emoji:"🤸", jp:"見て！すごいね！", romaji:"mite! sugoi ne!", kr:"봐봐! 대단하네!"},
      {emoji:"👨", jp:"お父さん、ちょっと来て！", romaji:"otousan, chotto kite!", kr:"아빠, 잠깐 와봐!"},
      {emoji:"🎹", jp:"聞いて！じょうずだね", romaji:"kiite! jouzu da ne", kr:"들어봐! 잘하네"},
      {emoji:"👴", jp:"おじいちゃん、おばあちゃん、ちょっと来て！", romaji:"ojiichan, obaachan, chotto kite!", kr:"할아버지, 할머니, 잠깐 와보세요!"},
      {emoji:"🖌️", jp:"見て！じょうずだね、うまいね", romaji:"mite! jouzu da ne, umai ne", kr:"봐봐! 잘하네, 멋지네"},
      {emoji:"👧", jp:"おねえちゃん、ちょっと来て！", romaji:"oneechan, chotto kite!", kr:"언니, 잠깐 와봐!"},
      {emoji:"🧸", jp:"あれ、とって！よいしょ！", romaji:"are, totte! yoisho!", kr:"저거 집어줘! 영차!"},
      {emoji:"👦", jp:"おにいちゃん、ちょっと来て！", romaji:"oniichan, chotto kite!", kr:"오빠, 잠깐 와봐!"},
      {emoji:"🤸‍♀️", jp:"見て！ふーん", romaji:"mite! fuun", kr:"봐봐! 흐음"},
      {emoji:"🤾", jp:"これ、できる？すごい！！", romaji:"kore, dekiru? sugoi!!", kr:"이거 할 수 있어? 대단해!!"},
      {emoji:"😱", jp:"あ！", romaji:"a!", kr:"아!"},
      {emoji:"🥤", jp:"お母さん、ちょっと来て！じぶんでやって", romaji:"okaasan, chotto kite! jibun de yatte", kr:"엄마, 잠깐 와봐! - 혼자서 해봐"},
      {emoji:"😅", jp:"は〜い！", romaji:"haai!", kr:"네~!"},
      {emoji:"🧽", jp:"ごしごし", romaji:"goshigoshi", kr:"쓱쓱"},
      {emoji:"✨", jp:"見て！わあ、きれい！", romaji:"mite! waa, kirei!", kr:"봐봐! 와, 깨끗해!"},
      {emoji:"👏", jp:"えらいね！すごいね！", romaji:"erai ne! sugoi ne!", kr:"장하네! 대단하네!"}
    ]
  }
];

const GENTLE_WRONG_MESSAGES = [
  '잘했어요! 다시 들어볼까요? 😊',
  '좋아요! 한 번 더 들어볼까요? 💛',
  '거의 다 왔어요! 다시 들어봐요 🌸',
  '괜찮아요, 다시 한 번 해볼까요? 🐣'
];

const KANA_LAYOUT = [
  'あ','い','う','え','お',
  'か','き','く','け','こ',
  'さ','し','す','せ','そ',
  'た','ち','つ','て','と',
  'な','に','ぬ','ね','の',
  'は','ひ','ふ','へ','ほ',
  'ま','み','む','め','も',
  'や','ゆ','よ','','',
  'ら','り','る','れ','ろ',
  'わ','を','ん','','',
  '가','ぎ','ぐ','げ','ご',
  'ざ','じ','ず','ぜ','ぞ',
  'だ','ぢ','づ','で','ど',
  'ば','び','ぶ','べ','ぼ',
  'ぱ','ぴ','ぷ','ぺ','ぽ',
  'っ','ゃ','ゅ','ょ',''
];

const HS_WEIGHT_MULTIPLIERS = { 0: 0, 1: 1, 2: 2, 3: 4 };

const SRS_STAGE_DAYS = [0.02, 0.5, 1, 3, 7, 16, 35, 90];

/* ⏱️ 난이도(시간 제한) 조절용 — SRS 단계별 시간 배수.
   같은 인덱스로 SRS_STAGE_DAYS와 짝을 이룹니다.
   - 초반 단계(아직 안 외운 글자): 시간을 넉넉히 줘서 "일단 성공적으로 떠올리는 경험"을 만들어줍니다.
   - 후반 단계(이미 안정된 글자): 시간을 줄여서 "정말 자동으로 튀어나오는지(유창성)"를 확인합니다. */
const SRS_TIME_MULTIPLIER = [1.5, 1.35, 1.15, 1.0, 0.85, 0.75, 0.65, 0.55];

const SENTENCES = [
  { words: ["まま", "だっこ"], kr: "엄마 안아줘" },
  { words: ["ぱぱ", "だっこ"], kr: "아빠 안아줘" },
  { words: ["じいじ", "だっこ"], kr: "할아버지 안아줘" },
  { words: ["ぱぱ", "ばいばい"], kr: "아빠 빠이빠이" },
  { words: ["ばあば", "ばいばい"], kr: "할머니 빠이빠이" },
  { words: ["わんわん", "ねんね"], kr: "멍멍이 잔다" },
  { words: ["わんわん", "まんま"], kr: "멍멍이 맘마(밥)" },
  { words: ["ねこ", "ねんね"], kr: "고양이 잔다" },
  { words: ["ぶーぶー", "ばいばい"], kr: "붕붕 빠이빠이" },
  { words: ["もっと", "ちょうだい"], kr: "더 주세요" },
  { words: ["もっと", "じゅーす"], kr: "더 주스" },
  { words: ["ちょうだい", "みず"], kr: "물 주세요" },
  { words: ["ぱん", "たべる"], kr: "빵 먹다" },
  { words: ["みず", "のむ"], kr: "물 마시다" },
  { words: ["あーん", "たべる"], kr: "아~ 먹자" },
  { words: ["あか", "くつ"], kr: "빨간 신발" },
  { words: ["あお", "そら"], kr: "파란 하늘" },
  { words: ["ふとん", "ねんね"], kr: "이불 덮고 잔다" }
];

const COMPOUNDS = [
  { p1:{jp:"あさ",kr:"아침",emoji:"🌅"}, p2:{jp:"ごはん",kr:"밥",emoji:"🍚"}, jp:"あさごはん", romaji:"asagohan", kr:"아침밥", emoji:"🍙", level:36 },
  { p1:{jp:"ひる",kr:"낮",emoji:"🌞"}, p2:{jp:"ごはん",kr:"밥",emoji:"🍚"}, jp:"ひるごはん", romaji:"hirugohan", kr:"점심밥", emoji:"🍱", level:36 },
  { p1:{jp:"ゆう",kr:"저녁",emoji:"🌆"}, p2:{jp:"ごはん",kr:"밥",emoji:"🍚"}, jp:"ゆうごはん", romaji:"yuugohan", kr:"저녁밥", emoji:"🍲", level:36 },
  { p1:{jp:"くつ",kr:"신발",emoji:"👟"}, p2:{jp:"した",kr:"발밑",emoji:"🦶"}, jp:"くつした", romaji:"kutsushita", kr:"양말", emoji:"🧦", level:36 },
  { p1:{jp:"あめ",kr:"비",emoji:"🌧️"}, p2:{jp:"くつ",kr:"신발",emoji:"👟"}, jp:"あまぐつ", romaji:"amagutsu", kr:"장화", emoji:"👢", level:36 },
  { p1:{jp:"はな",kr:"꽃",emoji:"🌸"}, p2:{jp:"ひ",kr:"불",emoji:"🔥"}, jp:"はなび", romaji:"hanabi", kr:"불꽃놀이", emoji:"🎆", level:36 },
  { p1:{jp:"あさ",kr:"아침",emoji:"🌅"}, p2:{jp:"ひ",kr:"해",emoji:"☀️"}, jp:"あさひ", romaji:"asahi", kr:"아침 해", emoji:"🌄", level:36 },
  { p1:{jp:"ゆう",kr:"저녁",emoji:"🌆"}, p2:{jp:"ひ",kr:"해",emoji:"☀️"}, jp:"ゆうひ", romaji:"yuuhi", kr:"석양", emoji:"🌇", level:36 },
  { p1:{jp:"みず",kr:"물",emoji:"💧"}, p2:{jp:"うみ",kr:"바다",emoji:"🌊"}, jp:"みずうみ", romaji:"mizuumi", kr:"호수", emoji:"🏞️", level:36 },
  { p1:{jp:"て",kr:"손",emoji:"✋"}, p2:{jp:"かみ",kr:"종이",emoji:"📄"}, jp:"てがみ", romaji:"tegami", kr:"편지", emoji:"✉️", level:36 },
  { p1:{jp:"あか",kr:"빨강",emoji:"🔴"}, p2:{jp:"ちゃん",kr:"~짱(호칭)",emoji:"🏷️"}, jp:"あかちゃん", romaji:"akachan", kr:"아기", emoji:"👶", level:36 },
  { p1:{jp:"あお",kr:"파랑",emoji:"🔵"}, p2:{jp:"そら",kr:"하늘",emoji:"🌤️"}, jp:"あおぞら", romaji:"aozora", kr:"파란 하늘", emoji:"🌈", level:36 },
  { p1:{jp:"くろ",kr:"검정",emoji:"⚫"}, p2:{jp:"ねこ",kr:"고양이",emoji:"🐱"}, jp:"くろねこ", romaji:"kuroneko", kr:"검은 고양이", emoji:"🐈‍⬛", level:36 },
  { p1:{jp:"しろ",kr:"하양",emoji:"⚪"}, p2:{jp:"くま",kr:"곰",emoji:"🐻"}, jp:"しろくま", romaji:"shirokuma", kr:"북극곰", emoji:"🐻‍❄️", level:36 }
];

/* 🏅 스트릭 배지·테마 해금(로드맵 15번 섹션) — 연속 학습일수 목표(days)에 도달하면 배지를
   얻습니다. theme이 null이면 장식용 배지, 문자열이면 그 배지를 얻은 뒤 `.theme-<값>`을
   선택해 쓸 수 있게 해줍니다(index.html의 body.theme-* CSS 변수 오버라이드와 짝을 이룸).
   한 번 얻은 배지는 스트릭이 끊겨도 사라지지 않습니다(연속 기록이 아니라 "누적 도달"만 기억). */
const STREAK_BADGES = [
  { days: 3, emoji: '🌱', label: '새싹', theme: null },
  { days: 7, emoji: '🌸', label: '벚꽃', theme: 'sakura' },
  { days: 14, emoji: '🌊', label: '파도', theme: 'ocean' },
  { days: 30, emoji: '🌙', label: '보름달', theme: 'night' }
];

const CONFETTI_COLORS = ['var(--hanko)', 'var(--gold)', 'var(--indigo)', 'var(--sage)', '#ffffff'];

const CONFETTI_EMOJIS = ['🌸', '✨'];

const ANIMAL_CRY_MAP = {
  'ねこ':'cat', 'にゃんにゃん':'cat', 'くろねこ':'cat',
  'いぬ':'dog', 'わんわん':'dog',
  'とり':'bird',
  'うま':'horse',
  'くま':'bear', 'しろくま':'bear',
  'さかな':'fish'
};

const WS_DIRECTIONS = [
  {dr:0,dc:1}, {dr:0,dc:-1}, {dr:1,dc:0}, {dr:-1,dc:0},
  {dr:1,dc:1}, {dr:1,dc:-1}, {dr:-1,dc:1}, {dr:-1,dc:-1}
];

const LIFEQA_CELEBRATE_EMOJI = { clock:'🕐', temperature:'🌡️', weather:'🌈' };

const HIRAGANA_LIST = [
  {ch:'あ',romaji:'a'},{ch:'い',romaji:'i'},{ch:'う',romaji:'u'},{ch:'え',romaji:'e'},{ch:'お',romaji:'o'},
  {ch:'か',romaji:'ka'},{ch:'き',romaji:'ki'},{ch:'く',romaji:'ku'},{ch:'け',romaji:'ke'},{ch:'こ',romaji:'ko'},
  {ch:'さ',romaji:'sa'},{ch:'し',romaji:'shi'},{ch:'す',romaji:'su'},{ch:'せ',romaji:'se'},{ch:'そ',romaji:'so'},
  {ch:'た',romaji:'ta'},{ch:'ち',romaji:'chi'},{ch:'つ',romaji:'tsu'},{ch:'て',romaji:'te'},{ch:'と',romaji:'to'},
  {ch:'な',romaji:'na'},{ch:'に',romaji:'ni'},{ch:'ぬ',romaji:'nu'},{ch:'ね',romaji:'ne'},{ch:'の',romaji:'no'},
  {ch:'は',romaji:'ha'},{ch:'ひ',romaji:'hi'},{ch:'ふ',romaji:'fu'},{ch:'へ',romaji:'he'},{ch:'ほ',romaji:'ho'},
  {ch:'ま',romaji:'ma'},{ch:'み',romaji:'mi'},{ch:'む',romaji:'mu'},{ch:'め',romaji:'me'},{ch:'も',romaji:'mo'},
  {ch:'や',romaji:'ya'},{ch:'ゆ',romaji:'yu'},{ch:'よ',romaji:'yo'},
  {ch:'ら',romaji:'ra'},{ch:'り',romaji:'ri'},{ch:'る',romaji:'ru'},{ch:'れ',romaji:'re'},{ch:'ろ',romaji:'ro'},
  {ch:'わ',romaji:'wa'},{ch:'を',romaji:'wo'},{ch:'ん',romaji:'n'}
];

/* 💡 이중부호화(Dual Coding, Paivio) — 글자를 발음 정보로만 저장하지 않고, 글자 모양에서
   떠올릴 수 있는 시각적 연상(이모지)과 짧은 이야기를 함께 묶어서 인출 경로를 하나 더
   만들어줍니다. 아이가 원할 때만 펼쳐보는 보조 힌트로만 쓰고, 카드 앞면에는 노출하지 않습니다.
   image는 이미지 에셋 추가 없이 배포 가능하도록 이모지로 시작하고, 추후 SVG 일러스트로
   교체할 수 있도록 story(텍스트)와 분리해뒀습니다 */
const HIRAGANA_MNEMONICS = {
  'あ': { image: '🦆', story: '오리가 부리를 크게 벌리며 "아~" 하고 울어요' },
  'い': { image: '🎋', story: '나뭇가지 두 개가 나란히 서서 "이~" 하고 인사해요' },
  'う': { image: '🌙', story: '초승달이 둥글게 휘어져서 "우~" 하고 소리내요' },
  'え': { image: '🐍', story: '뱀이 몸을 구불구불 움직이며 "에~" 하고 소리내요' },
  'お': { image: '🎀', story: '리본이 매듭지어진 모양처럼 꼬여서 "오~" 해요' },
  'か': { image: '🦌', story: '사슴뿔처럼 뻗은 모양이에요. "카!" 하고 뿔이 자라요' },
  'き': { image: '🔑', story: '열쇠 모양처럼 생겼어요. "키"로 문을 열어요' },
  'く': { image: '📐', story: '삼각자처럼 꺾인 모양이에요. "쿠" 하고 접혀요' },
  'け': { image: '🌿', story: '풀잎 두 개가 옆으로 자라난 모양이에요. "케~"' },
  'こ': { image: '🍥', story: '나루토(어묵) 두 조각이 겹쳐진 모양이에요. "코"' },
  'さ': { image: '🎣', story: '낚싯대를 던지는 모양이에요. "사~" 하고 던져요' },
  'し': { image: '🦯', story: '지팡이처럼 아래로 휘어진 모양이에요. "시~"' },
  'す': { image: '🌀', story: '소용돌이처럼 동그랗게 말린 모양이에요. "스~"' },
  'せ': { image: '🪜', story: '사다리 계단처럼 생겼어요. "세" 하고 올라가요' },
  'そ': { image: '🧵', story: '실이 지그재그로 엉킨 모양이에요. "소~"' },
  'た': { image: '🙆', story: '팔짱을 낀 사람 모양처럼 생겼어요. "타!"' },
  'ち': { image: '🎏', story: '깃발이 펄럭이며 감아 도는 모양이에요. "치~"' },
  'つ': { image: '🌊', story: '파도가 넘실거리는 모양이에요. "쓰~"' },
  'て': { image: '✋', story: '손을 번쩍 든 모양이에요. "테!" 하고 인사해요' },
  'と': { image: '🚪', story: '문이 열리며 꺾인 모양이에요. "토" 하고 들어가요' },
  'な': { image: '🎹', story: '피아노 건반처럼 여러 줄이 나란해요. "나~"' },
  'に': { image: '🥢', story: '젓가락 두 짝이 나란히 놓인 모양이에요. "니~"' },
  'ぬ': { image: '🍜', story: '면발이 돌돌 말린 모양이에요. "누~"' },
  'ね': { image: '🐱', story: '고양이 꼬리가 동그랗게 말린 모양이에요. "네~"' },
  'の': { image: '⭕', story: '동그라미를 그리듯 한 붓으로 쓰는 글자예요. "노~"' },
  'は': { image: '🚩', story: '깃발이 펄럭이는 모양이에요. "하!" 하고 흔들어요' },
  'ひ': { image: '🌙', story: '초승달처럼 휘어진 곡선이에요. "히~"' },
  'ふ': { image: '🗻', story: '후지산처럼 봉우리가 여러 개예요. "후~"' },
  'へ': { image: '⛰️', story: '산봉우리 모양처럼 뾰족해요. "헤"' },
  'ほ': { image: '⛩️', story: '신사 기둥(토리이)처럼 생겼어요. "호~"' },
  'ま': { image: '🎀', story: '리본 매듭처럼 동그랗게 말려요. "마~"' },
  'み': { image: '🐌', story: '달팽이처럼 동그랗게 말린 모양이에요. "미~"' },
  'む': { image: '🐛', story: '애벌레가 꿈틀대는 모양이에요. "무~"' },
  'め': { image: '😑', story: '눈을 지그시 감은 모양이에요. "메~"' },
  'も': { image: '🎋', story: '대나무 가지처럼 마디진 모양이에요. "모~"' },
  'や': { image: '🏹', story: '화살처럼 뻗어나가는 모양이에요. "야!"' },
  'ゆ': { image: '♨️', story: '온천 김이 모락모락 피어오르는 모양이에요. "유~"' },
  'よ': { image: '🎣', story: '낚싯줄처럼 아래로 늘어진 모양이에요. "요~"' },
  'ら': { image: '🎈', story: '풍선 끈처럼 아래로 늘어진 모양이에요. "라~"' },
  'り': { image: '🪝', story: '낚싯바늘처럼 아래로 휘어진 모양이에요. "리~"' },
  'る': { image: '🌀', story: '소용돌이처럼 동그랗게 감긴 모양이에요. "루~"' },
  'れ': { image: '🦵', story: '다리를 쭉 뻗은 모양처럼 생겼어요. "레~"' },
  'ろ': { image: '🧶', story: '동그랗게 감긴 실타래 모양이에요. "로~"' },
  'わ': { image: '🍡', story: '경단 두 개가 붙어있는 모양이에요. "와~"' },
  'を': { image: '🎏', story: '깃발이 휘날리는 모양이에요. 발음은 "오"와 같아요' },
  'ん': { image: '⚓', story: '닻처럼 아래로 고리진 모양이에요. "응~" 하고 콧소리를 내요' }
};

/* 📖 처리 수준 이론(Levels of Processing, Craik & Lockhart) — 히라가나 자체는 의미 없는
   기호라 글자만 학습하면 계속 '얕은 처리'에 머물러요. 그 글자로 시작하는 실제 단어를 함께
   보여주면 의미와 연결된 '깊은 처리'를 유도할 수 있어요. 기존 DICTIONARY(단어 사전)에서
   각 글자로 시작하는 짧고 쉬운 명사 위주로 1~2개씩 골라뒀어요(로마자 표기는 굳이 넣지 않고
   글자+뜻만으로 충분히 알아볼 수 있게 함). る/を/ん처럼 실제로 그 글자로 시작하는 고유
   일본어 단어가 없는 경우엔 words 대신 note로 이유를 설명해요 */
const HIRAGANA_SAMPLE_WORDS = {
  'あ': { words: [{ jp: 'あめ', kr: '비' }, { jp: 'あし', kr: '발' }] },
  'い': { words: [{ jp: 'いぬ', kr: '강아지' }, { jp: 'いえ', kr: '집' }] },
  'う': { words: [{ jp: 'うま', kr: '말' }, { jp: 'うみ', kr: '바다' }] },
  'え': { words: [{ jp: 'えび', kr: '새우' }, { jp: 'えき', kr: '역' }] },
  'お': { words: [{ jp: 'おちゃ', kr: '차' }, { jp: 'おかし', kr: '과자' }] },
  'か': { words: [{ jp: 'かさ', kr: '우산' }, { jp: 'かお', kr: '얼굴' }] },
  'き': { words: [{ jp: 'き', kr: '나무' }, { jp: 'きりん', kr: '기린' }] },
  'く': { words: [{ jp: 'くつ', kr: '신발' }, { jp: 'くち', kr: '입' }] },
  'け': { words: [{ jp: 'け', kr: '털' }, { jp: 'けしごむ', kr: '지우개' }] },
  'こ': { words: [{ jp: 'こえ', kr: '목소리' }, { jp: 'こおり', kr: '얼음' }] },
  'さ': { words: [{ jp: 'さる', kr: '원숭이' }, { jp: 'さかな', kr: '물고기' }] },
  'し': { words: [{ jp: 'しか', kr: '사슴' }, { jp: 'しお', kr: '소금' }] },
  'す': { words: [{ jp: 'すし', kr: '초밥' }, { jp: 'すいか', kr: '수박' }] },
  'せ': { words: [{ jp: 'せみ', kr: '매미' }, { jp: 'せんせい', kr: '선생님' }] },
  'そ': { words: [{ jp: 'そら', kr: '하늘' }, { jp: 'そと', kr: '밖' }] },
  'た': { words: [{ jp: 'たこ', kr: '문어' }, { jp: 'たいよう', kr: '태양' }] },
  'ち': { words: [{ jp: 'ちきゅう', kr: '지구' }, { jp: 'ちず', kr: '지도' }] },
  'つ': { words: [{ jp: 'つき', kr: '달' }, { jp: 'つくえ', kr: '책상' }] },
  'て': { words: [{ jp: 'て', kr: '손' }, { jp: 'てがみ', kr: '편지' }] },
  'と': { words: [{ jp: 'とり', kr: '새' }, { jp: 'とけい', kr: '시계' }] },
  'な': { words: [{ jp: 'なつ', kr: '여름' }, { jp: 'なし', kr: '배(과일)' }] },
  'に': { words: [{ jp: 'にく', kr: '고기' }, { jp: 'にじ', kr: '무지개' }] },
  'ぬ': { words: [{ jp: 'ぬの', kr: '천' }, { jp: 'ぬいぐるみ', kr: '봉제인형' }] },
  'ね': { words: [{ jp: 'ねこ', kr: '고양이' }, { jp: 'ねずみ', kr: '쥐' }] },
  'の': { words: [{ jp: 'のり', kr: '김' }, { jp: 'のど', kr: '목' }] },
  'は': { words: [{ jp: 'は', kr: '이(치아)' }, { jp: 'はな', kr: '꽃' }] },
  'ひ': { words: [{ jp: 'ひ', kr: '불' }, { jp: 'ひこうき', kr: '비행기' }] },
  'ふ': { words: [{ jp: 'ふね', kr: '배(선박)' }, { jp: 'ふうせん', kr: '풍선' }] },
  'へ': { words: [{ jp: 'へや', kr: '방' }, { jp: 'へび', kr: '뱀' }] },
  'ほ': { words: [{ jp: 'ほん', kr: '책' }, { jp: 'ほし', kr: '별' }] },
  'ま': { words: [{ jp: 'まど', kr: '창문' }, { jp: 'まつり', kr: '축제' }] },
  'み': { words: [{ jp: 'みず', kr: '물' }, { jp: 'みみ', kr: '귀' }] },
  'む': { words: [{ jp: 'むし', kr: '벌레' }, { jp: 'むね', kr: '가슴' }] },
  'め': { words: [{ jp: 'め', kr: '눈' }, { jp: 'めがね', kr: '안경' }] },
  'も': { words: [{ jp: 'もも', kr: '복숭아' }, { jp: 'もり', kr: '숲' }] },
  'や': { words: [{ jp: 'やま', kr: '산' }, { jp: 'やぎ', kr: '염소' }] },
  'ゆ': { words: [{ jp: 'ゆき', kr: '눈(날씨)' }, { jp: 'ゆび', kr: '손가락' }] },
  'よ': { words: [{ jp: 'よる', kr: '밤' }, { jp: 'よこ', kr: '옆' }] },
  'ら': { words: [{ jp: 'らくだ', kr: '낙타' }, { jp: 'らいおん', kr: '사자' }] },
  'り': { words: [{ jp: 'りんご', kr: '사과' }, { jp: 'りす', kr: '다람쥐' }] },
  'る': { words: [], note: '「る」로 시작하는 순우리말 수준의 쉬운 일본어 단어는 거의 없어요 — 대신 글자 모양 연상(💡 힌트)으로 기억해보세요' },
  'れ': { words: [{ jp: 'れもん', kr: '레몬' }, { jp: 'れいぞうこ', kr: '냉장고' }] },
  'ろ': { words: [{ jp: 'ろうそく', kr: '양초' }, { jp: 'ろけっと', kr: '로켓' }] },
  'わ': { words: [{ jp: 'わに', kr: '악어' }, { jp: 'わし', kr: '독수리' }] },
  'を': { words: [], note: '「を」는 "~을/를"에 해당하는 조사라서, 단어의 첫 글자로는 거의 쓰이지 않아요' },
  'ん': { words: [], note: '「ん」은 받침 같은 소리(콧소리)라서, 단어의 첫 글자로는 올 수 없어요' }
};

const HIRAGANA_STROKES = {
  'ぁ': [[[0.234,0.494],[0.295,0.455],[0.442,0.457],[0.644,0.508]],[[0.359,0.587],[0.429,0.55],[0.392,0.391],[0.388,0.2],[0.42,0.125],[0.438,0.087]],[[0.546,0.351],[0.577,0.315],[0.46,0.126],[0.257,0.041],[0.242,0.161],[0.368,0.26],[0.465,0.292],[0.602,0.304],[0.689,0.288],[0.755,0.221],[0.761,0.098],[0.649,0.015],[0.497,-0.026]]],
  'あ': [[[0.17,0.627],[0.245,0.578],[0.43,0.58],[0.681,0.644]],[[0.323,0.745],[0.41,0.698],[0.364,0.5],[0.358,0.262],[0.399,0.168],[0.421,0.12]],[[0.557,0.449],[0.596,0.406],[0.449,0.169],[0.195,0.062],[0.177,0.213],[0.334,0.336],[0.455,0.377],[0.626,0.392],[0.736,0.371],[0.818,0.287],[0.825,0.134],[0.687,0.03],[0.496,-0.021]]],
  'ぃ': [[[0.17,0.518],[0.213,0.491],[0.27,0.252],[0.309,0.162],[0.385,0.097],[0.387,0.163],[0.413,0.222]],[[0.626,0.499],[0.686,0.444],[0.749,0.343],[0.773,0.213]]],
  'い': [[[0.093,0.636],[0.146,0.604],[0.217,0.304],[0.266,0.191],[0.36,0.109],[0.363,0.193],[0.396,0.266]],[[0.662,0.612],[0.736,0.545],[0.816,0.418],[0.847,0.255]]],
  'ぅ': [[[0.405,0.61],[0.604,0.538]],[[0.259,0.368],[0.315,0.347],[0.479,0.408],[0.569,0.417],[0.627,0.391],[0.653,0.337],[0.617,0.16],[0.477,-0.014]]],
  'う': [[[0.391,0.769],[0.639,0.679]],[[0.208,0.466],[0.279,0.439],[0.482,0.516],[0.596,0.527],[0.668,0.494],[0.701,0.428],[0.656,0.205],[0.48,-0.011]]],
  'ぇ': [[[0.415,0.62],[0.604,0.538]],[[0.255,0.367],[0.317,0.348],[0.584,0.446],[0.612,0.424],[0.576,0.41],[0.26,0.112],[0.261,0.079],[0.361,0.153],[0.419,0.167],[0.478,0.144],[0.566,0.055],[0.721,0.055],[0.77,0.041]]],
  'え': [[[0.391,0.769],[0.639,0.679]],[[0.192,0.453],[0.271,0.43],[0.604,0.553],[0.639,0.524],[0.594,0.508],[0.198,0.135],[0.199,0.094],[0.325,0.187],[0.397,0.203],[0.471,0.174],[0.582,0.062],[0.774,0.063],[0.835,0.046]]],
  'ぉ': [[[0.184,0.444],[0.232,0.413],[0.352,0.414],[0.515,0.455]],[[0.32,0.619],[0.36,0.588],[0.339,0.035],[0.316,-0.005],[0.279,-0.011],[0.267,-0.006],[0.226,0.044],[0.22,0.1],[0.286,0.173],[0.507,0.278],[0.681,0.272],[0.749,0.157],[0.692,0.057],[0.556,-0.02]],[[0.651,0.549],[0.717,0.518],[0.774,0.424]]],
  'お': [[[0.108,0.563],[0.17,0.524],[0.319,0.525],[0.522,0.577]],[[0.28,0.781],[0.33,0.742],[0.304,0.052],[0.275,0.002],[0.229,-0.006],[0.213,0.0],[0.161,0.062],[0.154,0.133],[0.237,0.224],[0.513,0.355],[0.73,0.349],[0.815,0.204],[0.745,0.078],[0.574,-0.017]],[[0.693,0.694],[0.775,0.655],[0.848,0.537]]],
  'か': [[[0.102,0.429],[0.15,0.414],[0.403,0.487],[0.48,0.492],[0.531,0.47],[0.559,0.38],[0.399,0.019],[0.312,0.111]],[[0.346,0.751],[0.383,0.685],[0.14,0.063]],[[0.634,0.603],[0.816,0.448],[0.881,0.268]]],
  'き': [[[0.287,0.555],[0.423,0.545],[0.661,0.632]],[[0.367,0.379],[0.514,0.371],[0.759,0.463]],[[0.358,0.747],[0.404,0.742],[0.672,0.273],[0.672,0.202],[0.621,0.241],[0.559,0.252]],[[0.292,0.162],[0.267,0.104],[0.314,0.029],[0.613,-0.003]]],
  'く': [[[0.548,0.771],[0.591,0.703],[0.329,0.411],[0.338,0.368],[0.61,0.016]]],
  'け': [[[0.212,0.727],[0.248,0.682],[0.176,0.182],[0.214,0.057],[0.231,0.052],[0.279,0.257]],[[0.407,0.489],[0.768,0.54],[0.845,0.53]],[[0.621,0.763],[0.69,0.73],[0.677,0.272],[0.644,0.107],[0.552,-0.015]]],
  'こ': [[[0.281,0.662],[0.311,0.657],[0.523,0.67],[0.662,0.631],[0.698,0.603],[0.615,0.605],[0.506,0.56]],[[0.242,0.259],[0.239,0.182],[0.305,0.105],[0.499,0.059],[0.688,0.061],[0.765,0.048]]],
  'さ': [[[0.268,0.474],[0.733,0.586]],[[0.368,0.758],[0.42,0.757],[0.569,0.491],[0.721,0.318],[0.723,0.252],[0.662,0.302],[0.588,0.32]],[[0.31,0.182],[0.277,0.141],[0.291,0.081],[0.455,0.002],[0.674,-0.013]]],
  'し': [[[0.28,0.754],[0.338,0.691],[0.292,0.164],[0.32,0.065],[0.401,0.006],[0.555,0.006],[0.658,0.044],[0.793,0.127]]],
  'す': [[[0.126,0.542],[0.19,0.52],[0.457,0.573],[0.771,0.61],[0.872,0.583]],[[0.495,0.762],[0.557,0.728],[0.548,0.645],[0.553,0.231],[0.471,0.24],[0.41,0.286],[0.392,0.365],[0.426,0.433],[0.475,0.433],[0.523,0.397],[0.55,0.316],[0.548,0.186],[0.479,0.07],[0.359,-0.016]]],
  'せ': [[[0.096,0.317],[0.143,0.314],[0.399,0.399],[0.805,0.477],[0.913,0.448]],[[0.622,0.761],[0.68,0.709],[0.62,0.229],[0.593,0.174],[0.529,0.211]],[[0.306,0.685],[0.359,0.625],[0.36,0.112],[0.424,0.039],[0.773,0.021]]],
  'そ': [[[0.29,0.665],[0.335,0.649],[0.577,0.75],[0.606,0.729],[0.423,0.514],[0.221,0.334],[0.245,0.304],[0.714,0.474],[0.729,0.461],[0.649,0.419],[0.578,0.355],[0.509,0.277],[0.484,0.201],[0.495,0.147],[0.705,-0.015]]],
  'た': [[[0.189,0.548],[0.322,0.516],[0.66,0.596]],[[0.414,0.766],[0.453,0.707],[0.168,-0.016]],[[0.504,0.329],[0.713,0.377],[0.792,0.358]],[[0.493,0.121],[0.536,0.058],[0.838,0.031]]],
  'ち': [[[0.194,0.561],[0.357,0.543],[0.65,0.595]],[[0.415,0.773],[0.464,0.729],[0.304,0.216],[0.308,0.186],[0.504,0.317],[0.688,0.339],[0.774,0.279],[0.764,0.13],[0.647,0.035],[0.471,-0.017]]],
  'っ': [[[0.181,0.401],[0.224,0.381],[0.524,0.497],[0.716,0.493],[0.794,0.42],[0.783,0.302],[0.631,0.179],[0.494,0.13]]],
  'つ': [[[0.104,0.471],[0.157,0.441],[0.534,0.586],[0.772,0.582],[0.87,0.49],[0.857,0.342],[0.667,0.188],[0.496,0.128]]],
  'て': [[[0.139,0.549],[0.217,0.508],[0.738,0.716],[0.768,0.691],[0.662,0.64],[0.506,0.458],[0.471,0.312],[0.519,0.162],[0.741,0.012]]],
  'と': [[[0.216,0.726],[0.292,0.702],[0.397,0.398]],[[0.659,0.643],[0.745,0.597],[0.398,0.369],[0.282,0.247],[0.253,0.178],[0.256,0.115],[0.279,0.08],[0.4,0.038],[0.757,0.034]]],
  'な': [[[0.137,0.58],[0.26,0.562],[0.494,0.617],[0.561,0.615]],[[0.373,0.771],[0.402,0.707],[0.229,0.271]],[[0.744,0.564],[0.778,0.54],[0.861,0.446],[0.861,0.421],[0.823,0.454],[0.765,0.454]],[[0.617,0.426],[0.587,0.377],[0.58,0.05],[0.474,-0.014],[0.389,-0.002],[0.336,0.038],[0.332,0.09],[0.381,0.151],[0.752,-0.019]]],
  'に': [[[0.196,0.73],[0.236,0.649],[0.152,0.286],[0.164,0.069],[0.196,0.016],[0.196,0.089],[0.245,0.2]],[[0.501,0.592],[0.729,0.645],[0.816,0.623]],[[0.468,0.225],[0.484,0.161],[0.569,0.107],[0.862,0.112]]],
  'ぬ': [[[0.218,0.654],[0.307,0.271],[0.416,0.033]],[[0.479,0.757],[0.533,0.676],[0.381,0.226],[0.166,0.055],[0.115,0.136],[0.212,0.375],[0.459,0.533],[0.645,0.584],[0.83,0.514],[0.869,0.25],[0.732,0.123],[0.576,0.123],[0.565,0.207],[0.656,0.226],[0.901,0.042]]],
  'ね': [[[0.277,0.771],[0.331,0.731],[0.301,-0.01]],[[0.128,0.482],[0.176,0.484],[0.355,0.587],[0.393,0.563],[0.186,0.236],[0.13,0.131],[0.142,0.084],[0.352,0.328],[0.586,0.553],[0.732,0.615],[0.879,0.523],[0.87,0.287],[0.729,0.086],[0.586,0.094],[0.566,0.172],[0.669,0.229],[0.762,0.177],[0.93,0.021]]],
  'の': [[[0.493,0.646],[0.527,0.45],[0.457,0.288],[0.329,0.125],[0.197,0.106],[0.122,0.243],[0.129,0.399],[0.188,0.504],[0.322,0.621],[0.469,0.677],[0.64,0.685],[0.775,0.619],[0.867,0.443],[0.838,0.227],[0.689,0.094],[0.563,0.035]]],
  'は': [[[0.174,0.73],[0.22,0.66],[0.154,0.183],[0.188,0.025],[0.202,0.025],[0.266,0.176]],[[0.45,0.524],[0.571,0.513],[0.821,0.551]],[[0.64,0.742],[0.691,0.705],[0.678,0.083],[0.488,0.04],[0.401,0.08],[0.397,0.12],[0.423,0.154],[0.473,0.179],[0.629,0.148],[0.848,0.031]]],
  'ひ': [[[0.886,0.279],[0.673,0.707],[0.638,0.355],[0.54,0.093],[0.305,0.024],[0.198,0.139],[0.22,0.348],[0.407,0.684],[0.377,0.701],[0.263,0.646],[0.156,0.648]]],
  'ふ': [[[0.43,0.735],[0.545,0.671],[0.56,0.626],[0.44,0.58]],[[0.394,0.501],[0.394,0.424],[0.494,0.328],[0.558,0.15],[0.513,0.067],[0.402,0.059],[0.334,0.112]],[[0.104,0.211],[0.107,0.154],[0.177,0.052],[0.219,0.13]],[[0.732,0.327],[0.845,0.222],[0.884,0.116]]],
  'へ': [[[0.073,0.451],[0.135,0.421],[0.241,0.516],[0.366,0.577],[0.918,0.186]]],
  'ほ': [[[0.175,0.736],[0.202,0.66],[0.135,0.183],[0.176,0.028],[0.246,0.176]],[[0.476,0.701],[0.549,0.679],[0.799,0.725]],[[0.43,0.447],[0.496,0.42],[0.854,0.485]],[[0.64,0.665],[0.691,0.633],[0.678,0.083],[0.488,0.04],[0.44,0.08],[0.437,0.12],[0.462,0.154],[0.512,0.179],[0.629,0.148],[0.873,0.016]]],
  'ま': [[[0.249,0.612],[0.37,0.585],[0.683,0.651],[0.751,0.646]],[[0.252,0.378],[0.382,0.35],[0.752,0.411]],[[0.466,0.793],[0.518,0.752],[0.518,0.068],[0.469,0.02],[0.381,-0.01],[0.298,0.006],[0.273,0.064],[0.303,0.122],[0.391,0.134],[0.741,0.015],[0.773,-0.028]]],
  'み': [[[0.267,0.676],[0.332,0.648],[0.572,0.705],[0.261,0.132],[0.232,0.102],[0.186,0.074],[0.143,0.084],[0.118,0.143],[0.133,0.213],[0.263,0.345],[0.458,0.378],[0.91,0.156]],[[0.738,0.479],[0.768,0.386],[0.693,0.188],[0.504,0.004]]],
  'む': [[[0.134,0.565],[0.228,0.537],[0.571,0.607]],[[0.29,0.791],[0.35,0.742],[0.304,0.052],[0.275,0.002],[0.229,-0.006],[0.154,0.133],[0.15,0.232],[0.219,0.255],[0.417,0.036],[0.635,0.025],[0.735,0.168],[0.723,0.402]],[[0.714,0.724],[0.807,0.667],[0.866,0.546]]],
  'め': [[[0.213,0.656],[0.241,0.62],[0.293,0.319],[0.416,0.033]],[[0.479,0.757],[0.533,0.676],[0.381,0.226],[0.166,0.055],[0.115,0.136],[0.212,0.375],[0.459,0.533],[0.645,0.584],[0.831,0.528],[0.869,0.245],[0.765,0.12],[0.557,0.047]]],
  'も': [[[0.381,0.791],[0.424,0.729],[0.366,0.089],[0.462,-0.009],[0.646,0.022],[0.698,0.142],[0.657,0.324]],[[0.216,0.601],[0.317,0.572],[0.59,0.606]],[[0.213,0.344],[0.317,0.301],[0.597,0.354]]],
  'ゃ': [[[0.161,0.291],[0.214,0.279],[0.481,0.399],[0.676,0.457],[0.77,0.452],[0.817,0.376],[0.736,0.286],[0.604,0.264]],[[0.491,0.613],[0.575,0.564],[0.585,0.529],[0.512,0.532]],[[0.346,0.528],[0.312,0.531],[0.312,0.476],[0.371,0.287],[0.499,-0.021]]],
  'や': [[[0.079,0.374],[0.145,0.358],[0.479,0.509],[0.723,0.581],[0.84,0.575],[0.899,0.479],[0.798,0.367],[0.632,0.34]],[[0.491,0.776],[0.597,0.715],[0.609,0.671],[0.518,0.675]],[[0.31,0.67],[0.267,0.675],[0.267,0.604],[0.342,0.369],[0.501,-0.018]]],
  'ゅ': [[[0.243,0.501],[0.262,0.461],[0.231,0.307],[0.23,0.123],[0.246,0.106],[0.267,0.228],[0.316,0.326],[0.466,0.456],[0.625,0.503],[0.742,0.436],[0.746,0.273],[0.643,0.18],[0.514,0.197],[0.433,0.296]],[[0.503,0.604],[0.536,0.601],[0.574,0.576],[0.54,0.146],[0.426,-0.02]]],
  'ゆ': [[[0.178,0.646],[0.204,0.581],[0.166,0.388],[0.164,0.158],[0.185,0.138],[0.21,0.289],[0.271,0.412],[0.459,0.574],[0.658,0.633],[0.805,0.549],[0.81,0.347],[0.68,0.229],[0.519,0.251],[0.417,0.374]],[[0.408,-0.016],[0.552,0.187],[0.594,0.725],[0.546,0.768],[0.493,0.756]]],
  'ょ': [[[0.543,0.421],[0.699,0.455]],[[0.478,0.61],[0.516,0.572],[0.491,0.055],[0.366,0.025],[0.289,0.066],[0.283,0.14],[0.378,0.177],[0.706,-0.011]]],
  'よ': [[[0.555,0.529],[0.769,0.562]],[[0.473,0.768],[0.52,0.719],[0.489,0.071],[0.333,0.035],[0.236,0.086],[0.229,0.178],[0.348,0.224],[0.767,-0.013]]],
  'ら': [[[0.369,0.769],[0.496,0.645],[0.387,0.61]],[[0.319,0.543],[0.301,0.512],[0.229,0.21],[0.258,0.179],[0.517,0.277],[0.681,0.293],[0.74,0.247],[0.754,0.144],[0.646,0.05],[0.481,-0.016]]],
  'り': [[[0.336,0.788],[0.359,0.739],[0.318,0.407],[0.342,0.36],[0.431,0.584]],[[0.569,0.685],[0.641,0.648],[0.637,0.28],[0.543,0.062],[0.476,-0.011]]],
  'る': [[[0.293,0.663],[0.325,0.655],[0.581,0.721],[0.613,0.692],[0.208,0.207],[0.225,0.186],[0.457,0.321],[0.681,0.341],[0.777,0.241],[0.724,0.08],[0.608,0.016],[0.41,0.016],[0.378,0.064],[0.429,0.113],[0.576,0.049]]],
  'れ': [[[0.283,0.766],[0.32,0.736],[0.306,-0.014]],[[0.095,0.449],[0.151,0.453],[0.344,0.566],[0.379,0.543],[0.111,0.13],[0.129,0.105],[0.406,0.402],[0.637,0.591],[0.687,0.57],[0.684,0.101],[0.765,0.08],[0.924,0.208]]],
  'ろ': [[[0.284,0.676],[0.317,0.667],[0.584,0.735],[0.617,0.706],[0.196,0.201],[0.213,0.179],[0.455,0.32],[0.688,0.341],[0.788,0.237],[0.732,0.069],[0.612,0.002],[0.428,0]]],
  'ん': [[[0.49,0.77],[0.53,0.708],[0.143,0.045],[0.148,0.006],[0.236,0.167],[0.383,0.313],[0.494,0.356],[0.552,0.28],[0.518,0.035],[0.597,-0.008],[0.774,0.104],[0.854,0.326]]],
  'わ': [[[0.289,0.77],[0.323,0.729],[0.306,-0.013]],[[0.103,0.448],[0.164,0.449],[0.394,0.551],[0.415,0.533],[0.134,0.182],[0.156,0.154],[0.452,0.357],[0.665,0.436],[0.809,0.411],[0.863,0.245],[0.767,0.113],[0.641,0.043]]],
  'を': [[[0.176,0.594],[0.291,0.563],[0.633,0.618]],[[0.405,0.765],[0.45,0.702],[0.21,0.335],[0.222,0.323],[0.322,0.387],[0.439,0.367],[0.457,0.143]],[[0.652,0.449],[0.701,0.408],[0.307,0.182],[0.252,0.096],[0.32,0.008],[0.674,-0.002]]]
};

const KATAKANA_STROKES = {
  'イ': [[[0.6,0.15],[0.35,0.55]], [[0.4,0.35],[0.7,0.85]]],
  'オ': [[[0.2,0.3],[0.75,0.25]], [[0.5,0.1],[0.45,0.85]], [[0.6,0.5],[0.3,0.85]]],
  'キ': [[[0.2,0.3],[0.75,0.25]], [[0.2,0.55],[0.75,0.5]], [[0.55,0.1],[0.3,0.85]]],
  'ク': [[[0.65,0.15],[0.3,0.5]], [[0.35,0.35],[0.7,0.55],[0.55,0.85]]],
  'ス': [[[0.65,0.15],[0.25,0.4]], [[0.3,0.3],[0.7,0.5],[0.4,0.85]]],
  'ハ': [[[0.35,0.15],[0.2,0.85]], [[0.55,0.15],[0.75,0.85]]],
  'マ': [[[0.2,0.25],[0.75,0.2]], [[0.6,0.2],[0.35,0.55],[0.6,0.85]]],
  'メ': [[[0.7,0.15],[0.25,0.85]], [[0.25,0.35],[0.75,0.65]]],
  'リ': [[[0.35,0.15],[0.3,0.75]], [[0.65,0.2],[0.55,0.85]]],
  'ロ': [[[0.2,0.2],[0.2,0.85]], [[0.2,0.2],[0.8,0.2],[0.8,0.85]], [[0.2,0.85],[0.8,0.85]]],
  'ン': [[[0.3,0.2],[0.6,0.35]], [[0.35,0.45],[0.65,0.6],[0.75,0.85]]]
};

const DAKUTEN_MARK = [[[0.72,0.05],[0.82,0.15]], [[0.85,0.0],[0.95,0.1]]];

const HANDAKUTEN_MARK = [[[0.8,0.05],[0.9,0.02],[0.95,0.08],[0.88,0.15],[0.78,0.1]]];

const LONG_VOWEL_STROKE = [[[0.15,0.5],[0.85,0.5]]];

const DAKUTEN_PAIRS = { 'か':'が','き':'ぎ','く':'ぐ','け':'げ','こ':'ご','さ':'ざ','し':'じ','す':'ず','せ':'ぜ','そ':'ぞ','た':'だ','ち':'ぢ','つ':'づ','て':'で','と':'ど','は':'ば','ひ':'び','ふ':'ぶ','へ':'べ','ほ':'ぼ' };

const HANDAKUTEN_PAIRS = { 'は':'ぱ','ひ':'ぴ','ふ':'ぷ','へ':'ぺ','ほ':'ぽ' };

const SMALL_KANA_MAP = { 'っ':'つ','ゃ':'や','ゅ':'ゆ','ょ':'よ','ぁ':'あ','ぃ':'い','ぅ':'う','ぇ':'え','ぉ':'お' };

const WORKSHEET_GROUPS = [
  { label: 'あ행', chars: ['あ','い','う','え','お'] },
  { label: 'か행', chars: ['か','き','く','け','こ'] },
  { label: 'さ행', chars: ['さ','し','す','せ','そ'] },
  { label: 'た행', chars: ['た','ち','つ','て','と'] },
  { label: 'な행', chars: ['な','に','ぬ','ね','の'] },
  { label: 'は행', chars: ['は','ひ','ふ','へ','ほ'] },
  { label: 'ま행', chars: ['ま','み','む','め','も'] },
  { label: 'や행', chars: ['や','ゆ','よ'] },
  { label: 'ら행', chars: ['ら','り','る','れ','ろ'] },
  { label: 'わ・を・ん', chars: ['わ','を','ん'] },
  { label: '탁음(゛)', chars: ['が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ','だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ'] },
  { label: '반탁음(゜)', chars: ['ぱ','ぴ','ぷ','ぺ','ぽ'] }
];

const WORKSHEET_PRACTICE_STYLES = [
  { opacity: 0.85, dashed: false, lineWidth: 5 },
  { opacity: 0.6,  dashed: false, lineWidth: 4.5 },
  { opacity: 0.4,  dashed: true,  lineWidth: 4 },
  { opacity: 0.22, dashed: true,  lineWidth: 4 },
  { opacity: 0.1,  dashed: true,  lineWidth: 4 }
];

const DT_TESTS = [
  [ // 테스트 1 — 濁音(が・ざ・だ・ば行)
    { emoji:'🐘', kr:'코끼리', word:'ぞう',   chars:['ぞ','う'],           blankIndex:0 },
    { emoji:'🔑', kr:'열쇠',   word:'かぎ',   chars:['か','ぎ'],           blankIndex:1 },
    { emoji:'🧺', kr:'바구니', word:'ざる',   chars:['ざ','る'],           blankIndex:0 },
    { emoji:'🎒', kr:'가방',   word:'かばん', chars:['か','ば','ん'],      blankIndex:1 }
  ],
  [ // 테스트 2 — 濁音
    { emoji:'🚃', kr:'전철',   word:'でんしゃ', chars:['で','ん','し','ゃ'],       blankIndex:0 },
    { emoji:'🥚', kr:'계란',   word:'たまご',   chars:['た','ま','ご'],            blankIndex:2 },
    { emoji:'🐋', kr:'고래',   word:'くじら',   chars:['く','じ','ら'],            blankIndex:1 },
    { emoji:'🪑', kr:'가구',   word:'かぐ',     chars:['か','ぐ'],                 blankIndex:1 }
  ],
  [ // 테스트 3 — 半濁音(ぱ行)
    { emoji:'✏️', kr:'연필',     word:'えんぴつ', chars:['え','ん','ぴ','つ'], blankIndex:2 },
    { emoji:'🌼', kr:'민들레',   word:'たんぽぽ', chars:['た','ん','ぽ','ぽ'], blankIndex:2 },
    { emoji:'🚶', kr:'산책',     word:'さんぽ',   chars:['さ','ん','ぽ'],      blankIndex:2 },
    { emoji:'✨', kr:'반짝반짝', word:'ぴかぴか', chars:['ぴ','か','ぴ','か'], blankIndex:0 }
  ],
  [ // 테스트 4 — 拗音(ゃ・ゅ・ょ)
    { emoji:'🥒', kr:'오이',     word:'きゅうり',     chars:['き','ゅ','う','り'],           blankIndex:1 },
    { emoji:'🥛', kr:'우유',     word:'ぎゅうにゅう', chars:['ぎ','ゅ','う','に','ゅ','う'], blankIndex:0 },
    { emoji:'🐟', kr:'금붕어',   word:'きんぎょ',     chars:['き','ん','ぎ','ょ'],           blankIndex:2 },
    { emoji:'🧸', kr:'장난감',   word:'おもちゃ',     chars:['お','も','ち','ゃ'],           blankIndex:2 }
  ],
  [ // 테스트 5 — 促音(っ)
    { emoji:'🎫', kr:'표',     word:'きっぷ',   chars:['き','っ','ぷ'],      blankIndex:1 },
    { emoji:'🏫', kr:'학교',   word:'がっこう', chars:['が','っ','こ','う'], blankIndex:1 },
    { emoji:'📯', kr:'트럼펫', word:'らっぱ',   chars:['ら','っ','ぱ'],      blankIndex:1 },
    { emoji:'🍃', kr:'나뭇잎', word:'はっぱ',   chars:['は','っ','ぱ'],      blankIndex:1 }
  ],
  [ // 테스트 6 — 종합
    { emoji:'🏥', kr:'병원',   word:'びょういん', chars:['び','ょ','う','い','ん'], blankIndex:0 },
    { emoji:'📷', kr:'사진',   word:'しゃしん',   chars:['し','ゃ','し','ん'],      blankIndex:0 },
    { emoji:'🏦', kr:'은행',   word:'ぎんこう',   chars:['ぎ','ん','こ','う'],      blankIndex:0 },
    { emoji:'🍱', kr:'도시락', word:'べんとう',   chars:['べ','ん','と','う'],      blankIndex:0 }
  ]
];

const HS_TABLE_ROWS = [
  { label: 'a',  chars: ['あ', 'い', 'う', 'え', 'お'] },
  { label: 'ka', chars: ['か', 'き', 'く', 'け', 'こ'] },
  { label: 'sa', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
  { label: 'ta', chars: ['た', 'ち', 'つ', 'て', 'と'] },
  { label: 'na', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { label: 'ha', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { label: 'ma', chars: ['ま', 'み', 'む', 'め', 'も'] },
  { label: 'ya', chars: ['や', null, 'ゆ', null, 'よ'] },
  { label: 'ra', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { label: 'wa', chars: ['わ', null, 'を', null, null] },
  { label: 'n',  chars: [null, null, 'ん', null, null] }
];

/* 🧩 청킹(Chunking) — 오십음도를 あ행/か행 같은 의미 있는 행 단위 그룹으로 미리 계산해둡니다.
   HS_TABLE_ROWS는 그리드 렌더링용이라 5칸 정렬을 위한 null이 섞여있으므로, 여기서는 null을
   제거해 HIRAGANA_LIST와 같은 순서의 "실제 글자만" 행 그룹으로 만들고, 각 행이 HIRAGANA_LIST
   상에서 몇 번째 글자부터 몇 번째 글자까지인지(startIndex~endIndex, endIndex는 다음 행 시작
   전까지의 누적 글자 수)도 함께 계산해둡니다. 활성 학습 세트가 행 경계에 맞춰 늘어나도록
   하는 데 씁니다 */
const HIRAGANA_ROW_GROUPS = (function () {
  const groups = [];
  let cursor = 0;
  HS_TABLE_ROWS.forEach(row => {
    const chars = row.chars.filter(c => c !== null);
    if (chars.length === 0) return;
    const startIndex = cursor;
    cursor += chars.length;
    const endIndex = cursor; // 다음 행 시작 전까지 누적 글자 수(배열 slice에 바로 쓸 수 있는 형태)
    const name = row.label === 'n' ? chars[0] : chars[0] + '행';
    groups.push({ label: row.label, name, chars, startIndex, endIndex });
  });
  return groups;
})();

const HS_COL_HEADS = ['a', 'i', 'u', 'e', 'o'];

/* 🔀 분산 학습 · 간섭 방지(Interference Avoidance) — learning-theory-roadmap.md Part 4 §1.
   자형(글자 모양)이 비슷해 아이들이 실제로 자주 혼동하는 히라가나 묶음. 청킹
   (HIRAGANA_ROW_GROUPS, 오십음도 행 단위)과 달리 이 묶음은 **행과 무관하게** 순수히
   "생김새가 닮아서 헷갈리는" 기준으로만 묶은 것 — 예를 들어 め/ぬ는 각각 め행/な행으로
   서로 다른 행이지만 자형이 비슷해 여기서는 같은 묶음.
   같은 묶음 안 글자가 한 문제의 선택지로 동시에 나오거나 바로 이어진 문제로 연달아
   나오지 않도록 출제 로직(logic.js의 spaceOutConfusionGroups/isSameConfusionGroup)에서
   참고함. 언어학적으로 확정된 표준 목록은 아니고, 아동 히라가나 학습에서 흔히 지적되는
   혼동 사례를 정리한 시작점 — 실제 오답 데이터가 쌓이면 추후 조정 권장. */
const HIRAGANA_CONFUSION_GROUPS = [
  ['め', 'ぬ'],
  ['わ', 'れ', 'ね'],
  ['さ', 'き'],
  ['る', 'ろ'],
  ['く', 'へ'],
  ['り', 'い'],
  ['は', 'ほ'],
  ['ま', 'も'],
  ['す', 'む'],
  ['し', 'つ']
];

/* 🔀 분산 학습 · 간섭 방지 — learning-theory-roadmap.md §17(어휘 축 확장).
   HIRAGANA_CONFUSION_GROUPS와 같은 목적이지만 단어(jp) 기준. 발음 패턴이 닮았거나
   (같은 음절 반복형 아기말, 각운) 의미가 대비/짝을 이뤄 헷갈리기 쉬운 단어끼리 묶었음.
   자형이 아니라 "소리·의미"가 닮은 것이 기준이라 히라가나 묶음과는 선정 근거가 다름.
   언어학적으로 확정된 표준 목록이 아니라 실제 아동 단어학습에서 흔히 헷갈리는 사례를
   손으로 큐레이션한 시작점 — logic.js의 spaceOutVocabConfusionGroups/
   isSameVocabConfusionGroup에서 참고함. */
const VOCAB_CONFUSION_GROUPS = [
  ['まま', 'ぱぱ', 'ばあば', 'じいじ'],       // 반복형 아기말 호칭(mama/papa/baba/jiji)
  ['おにいちゃん', 'おねえちゃん'],            // 한 모라 차이(nii/nee)로 헷갈리는 남매 호칭
  ['おとうと', 'いもうと'],                    // 한 글자 차이(오토우토/이모우토)의 남동생/여동생
  ['おとこのこ', 'おんなのこ'],                // 대비를 이루는 남자아이/여자아이
  ['しろ', 'くろ'],                            // 각운(-ろ)이 같아 헷갈리는 하양/검정
  ['きゅう', 'じゅう'],                        // 각운(-ゅう)이 같은 9/10
  ['どうぞ', 'ちょうだい'],                    // 주다/받다 반대 의미라 헷갈리기 쉬운 인사말
  ['わんわん', 'にゃんにゃん'],                // 같은 형식(같은 음절 반복)의 강아지/고양이 의성어
  ['まんま', 'ねんね'],                        // 각운(-んま/-んね)이 비슷한 아기말(밥/잠)
  ['はい', 'いや']                             // 대비를 이루는 긍정/부정 응답
];

const SONGS = [
  {
    title: "いない いない ばあ",
    sub: "가장 쉬운 까꿍 놀이 노래",
    lines: [
      {jp:"いない いない", gesture:"두 손으로 눈을 가려요"},
      {jp:"ばあ！", gesture:"손을 활짝 펴며 얼굴을 보여줘요"},
      {jp:"いない いない", gesture:"다시 눈을 가려요"},
      {jp:"ばあ！", gesture:"다시 짠! 하고 보여줘요"}
    ]
  },
  {
    title: "げんこつやまの たぬきさん",
    sub: "일본의 대표적인 손유희 동요",
    lines: [
      {jp:"げんこつやまの たぬきさん", gesture:"양손 주먹을 위아래로 마주쳐요"},
      {jp:"おっぱい のんで", gesture:"아기에게 우유 먹이는 시늉을 해요"},
      {jp:"ねんねして", gesture:"두 손을 볼에 대고 자는 척해요"},
      {jp:"だっこして", gesture:"두 팔로 안아주는 몸짓을 해요"},
      {jp:"おんぶして", gesture:"업어주는 몸짓을 해요"},
      {jp:"また あした", gesture:"손을 흔들며 인사해요"}
    ]
  },
  {
    title: "むすんで ひらいて",
    sub: "손을 쥐었다 폈다 하는 동요",
    lines: [
      {jp:"むすんで", gesture:"두 손을 꽉 쥐어요"},
      {jp:"ひらいて", gesture:"손을 활짝 펴요"},
      {jp:"てを うって", gesture:"손뼉을 짝짝 쳐요"},
      {jp:"むすんで", gesture:"다시 손을 쥐어요"},
      {jp:"また ひらいて", gesture:"다시 손을 펴요"},
      {jp:"てを うって", gesture:"다시 손뼉을 쳐요"},
      {jp:"その てを うえに", gesture:"두 손을 번쩍 위로 들어요"}
    ]
  }
];

const KARAOKE_SONGS = [
  {
    title: "いない いない ばあ",
    sub: "가장 먼저 배우는 까꿍 놀이 노래",
    cover: "🙈",
    lines: [
      {jp:"いない いない", emoji:"🙈"},
      {jp:"ばあ！", emoji:"😆"},
      {jp:"また いない いない", emoji:"🙈"},
      {jp:"ばあ！", emoji:"😆"}
    ]
  },
  {
    title: "げんこつやまの たぬきさん",
    sub: "일본 대표 손유희 동요",
    cover: "🦝",
    lines: [
      {jp:"げんこつやまの たぬきさん", emoji:"🦝"},
      {jp:"おっぱい のんで", emoji:"🍼"},
      {jp:"ねんねして", emoji:"😴"},
      {jp:"だっこして", emoji:"🤗"},
      {jp:"おんぶして", emoji:"🧸"},
      {jp:"また あした", emoji:"👋"}
    ]
  },
  {
    title: "むすんで ひらいて",
    sub: "손을 쥐었다 폈다 하는 동요",
    cover: "✊",
    lines: [
      {jp:"むすんで", emoji:"✊"},
      {jp:"ひらいて", emoji:"🖐️"},
      {jp:"てを うって", emoji:"👏"},
      {jp:"むすんで", emoji:"✊"},
      {jp:"また ひらいて", emoji:"🖐️"},
      {jp:"その てを うえに", emoji:"🙌"}
    ]
  },
  {
    title: "うさぎ うさぎ",
    sub: "달을 보며 부르는 전래 동요",
    cover: "🐰",
    lines: [
      {jp:"うさぎ うさぎ", emoji:"🐰"},
      {jp:"なに みて はねる", emoji:"👀"},
      {jp:"じゅうごや おつきさま", emoji:"🌕"},
      {jp:"みて はねる", emoji:"🐇"}
    ]
  },
  {
    title: "かごめ かごめ",
    sub: "원을 그리며 노는 전래 놀이 노래",
    cover: "🧺",
    lines: [
      {jp:"かごめ かごめ", emoji:"🧺"},
      {jp:"かごの なかの とりは", emoji:"🐦"},
      {jp:"いつ いつ でやる", emoji:"🚪"},
      {jp:"よあけの ばんに", emoji:"🌙"}
    ]
  },
  {
    title: "とおりゃんせ",
    sub: "아주 오래된 전래 통행 놀이 노래",
    cover: "⛩️",
    lines: [
      {jp:"とおりゃんせ とおりゃんせ", emoji:"🚶"},
      {jp:"ここは どこの ほそみちじゃ", emoji:"🛤️"},
      {jp:"てんじんさまの ほそみちじゃ", emoji:"⛩️"},
      {jp:"ちょっと とおして くだしゃんせ", emoji:"🙏"}
    ]
  },
  {
    title: "ずいずい ずっころばし",
    sub: "손잡고 리듬을 타는 전래 동요",
    cover: "🏺",
    lines: [
      {jp:"ずいずい ずっころばし", emoji:"🌾"},
      {jp:"ごまみそ ずい", emoji:"🥣"},
      {jp:"ちゃつぼに おわれて", emoji:"🏺"},
      {jp:"とっぴんしゃん", emoji:"🎶"}
    ]
  },
  {
    title: "あぶくたった",
    sub: "술래를 정하며 부르는 전래 동요",
    cover: "🍲",
    lines: [
      {jp:"あぶくたった", emoji:"🍲"},
      {jp:"にえたった", emoji:"♨️"},
      {jp:"にえたか どうだか", emoji:"🤔"},
      {jp:"たべて みよう", emoji:"🥄"}
    ]
  },
  {
    title: "はな いちもんめ",
    sub: "편을 나눠 노는 전래 동요",
    cover: "🌸",
    lines: [
      {jp:"はな いちもんめ", emoji:"🌸"},
      {jp:"かって うれしい", emoji:"😊"},
      {jp:"まけて くやしい", emoji:"😢"},
      {jp:"はな いちもんめ", emoji:"🌸"}
    ]
  },
  {
    title: "あがりめ さがりめ",
    sub: "눈가를 만지며 노는 손유희 동요",
    cover: "🐱",
    lines: [
      {jp:"あがりめ", emoji:"☝️"},
      {jp:"さがりめ", emoji:"👇"},
      {jp:"ぐるっと まわって", emoji:"🔄"},
      {jp:"ねこの め", emoji:"🐱"}
    ]
  },
  {
    title: "ちょち ちょち あわわ",
    sub: "아기와 손뼉 치며 노는 손유희 동요",
    cover: "👏",
    lines: [
      {jp:"ちょち ちょち", emoji:"👏"},
      {jp:"あわわ", emoji:"🙊"},
      {jp:"かいぐり かいぐり", emoji:"🔄"},
      {jp:"とっとの め", emoji:"👆"}
    ]
  },
  {
    title: "いっぽんばし こちょこちょ",
    sub: "손바닥을 간지럽히는 아기 손유희 동요",
    cover: "🤭",
    lines: [
      {jp:"いっぽんばし", emoji:"☝️"},
      {jp:"こちょこちょ", emoji:"🤭"},
      {jp:"たたいて", emoji:"👋"},
      {jp:"つねって", emoji:"🤏"},
      {jp:"かいだん のぼって", emoji:"🪜"},
      {jp:"こちょこちょ", emoji:"😆"}
    ]
  },
  {
    title: "おふねが ぎっちらこ",
    sub: "무릎에 앉혀 흔들어주는 배 놀이 동요",
    cover: "⛵",
    lines: [
      {jp:"おふねが", emoji:"⛵"},
      {jp:"ぎっちらこ", emoji:"🌊"},
      {jp:"ゆれて ゆれて", emoji:"🔄"},
      {jp:"ぎっちらこ", emoji:"⛵"}
    ]
  },
  {
    title: "かいぐり かいぐり とっとの め",
    sub: "손을 빙글빙글 돌리는 손유희 동요",
    cover: "🔄",
    lines: [
      {jp:"かいぐり かいぐり", emoji:"🔄"},
      {jp:"とっとの め", emoji:"👁️"},
      {jp:"もう いっかい", emoji:"🔁"},
      {jp:"とっとの め", emoji:"👁️"}
    ]
  },
  {
    title: "にらめっこ しましょ",
    sub: "웃음 참기 표정 놀이 동요",
    cover: "😝",
    lines: [
      {jp:"だるまさん だるまさん", emoji:"⛄"},
      {jp:"にらめっこ しましょ", emoji:"👀"},
      {jp:"わらうと まけよ", emoji:"😆"},
      {jp:"あっぷっぷ", emoji:"😝"}
    ]
  },
  {
    title: "おせんべ やけたかな",
    sub: "손을 뒤집으며 노는 전래 동요",
    cover: "🍘",
    lines: [
      {jp:"おせんべ おせんべ", emoji:"🍘"},
      {jp:"やけたかな", emoji:"🔥"},
      {jp:"まだ まだ", emoji:"⏳"},
      {jp:"やけました", emoji:"✅"}
    ]
  },
  {
    title: "なべ なべ そこぬけ",
    sub: "손잡고 몸을 뒤집는 전래 놀이 동요",
    cover: "🍳",
    lines: [
      {jp:"なべ なべ", emoji:"🍳"},
      {jp:"そこぬけ", emoji:"🕳️"},
      {jp:"そこが ぬけたら", emoji:"🔄"},
      {jp:"かえりましょ", emoji:"↩️"}
    ]
  },
  {
    title: "とんとんとんとん ひげじいさん",
    sub: "손가락으로 얼굴을 만드는 손유희 동요",
    cover: "🧔",
    lines: [
      {jp:"とんとんとんとん", emoji:"👊"},
      {jp:"ひげじいさん", emoji:"🧔"},
      {jp:"とんとんとんとん", emoji:"👊"},
      {jp:"こぶじいさん", emoji:"👴"},
      {jp:"となりの おじさん", emoji:"🙂"}
    ]
  },
  {
    title: "せっせっせーの よいよいよい",
    sub: "놀이를 시작할 때 손을 맞잡고 부르는 동요",
    cover: "🤝",
    lines: [
      {jp:"せっせっせーの", emoji:"🤝"},
      {jp:"よいよいよい", emoji:"🎵"}
    ]
  },
  {
    title: "もう いいかい まあだだよ",
    sub: "숨바꼭질을 하며 주고받는 전래 동요",
    cover: "🙈",
    lines: [
      {jp:"もう いいかい", emoji:"🙈"},
      {jp:"まあだだよ", emoji:"⏳"},
      {jp:"もう いいかい", emoji:"🙈"},
      {jp:"もう いいよ", emoji:"✅"}
    ]
  },
  {
    /* 21. あめふり — 1925년(다이쇼 14년) 발표, 작사 北原白秋(1942년 별세)·작곡 中山晋平(1952년 별세),
       위키백과에 2002년(사후 50년) 저작권 소멸이 명시된 저작권 만료곡. 실제 코드 진행(D-D-G-D / D-D-A(C#베이스)-D / G-D / A-D,
       ChordWiki 확인)을 다장조로 옮겨 I-IV-I / I-V-I / IV-I / V-I 화성을 그대로 따르는 반주로 작곡했습니다.
       ⚠️ 화성 진행은 실제 곡을 근거로 했지만, 음 하나하나까지 원곡 그대로임을 보증하는 것은 아닙니다. */
    title: "あめふり",
    sub: "실제 악보로 채보한 진짜 멜로디 · 비 오는 날 엄마를 기다리는 노래",
    cover: "☔",
    sung: true, /* 🎤 이 곡은 TTS로 읽지 않고, 모음을 음높이·길이 그대로 붙잡아 부르는 노래 합성 엔진을 사용합니다 */
    realVoiceSrc: true, /* 👩 실제 일본 엄마가 부른 원곡 mp3를 참고용으로 들을 수 있습니다 */
    lines: [
      {jp:"あめあめ ふれふれ かあさんが", emoji:"☔"},
      {jp:"じゃのめで おむかえ うれしいな", emoji:"🌂"},
      {jp:"ピッチピッチ チャップチャップ", emoji:"💧"},
      {jp:"ランランラン", emoji:"🎵"}
    ]
  }
];

const KARAOKE_SCALE = [
  261.63, 293.66, 329.63, 392.00, 440.00,   // 0 도4 1 레4 2 미4 3 솔4 4 라4
  523.25, 587.33, 659.25, 783.99, 880.00,   // 5 도5 6 레5 7 미5 8 솔5 9 라5
  349.23, 493.88, 698.46, 987.77            // 10 파4 11 시4 12 파5 13 시5 (あめふり처럼 5음이 아닌 온음계(도레미파솔라시) 화성을 쓰는 곡을 위해 추가.
                                             //    기존 0~9번 인덱스가 가리키는 음은 그대로라 다른 19곡의 반주에는 영향 없음)
];

const KARAOKE_MELODIES = [
  // 1. いない いない ばあ — 까꿍! 하고 놀라며 올라가는 느낌
  [ [[0,2],[1,2],[2,2],[1,2],[2,2],[3,3]], [[5,2],[8,4]],
    [[3,2],[0,2],[1,2],[2,2],[1,2],[2,2],[3,2],[4,2],[5,3]], [[5,2],[8,4]] ],
  // 2. げんこつやまの たぬきさん
  [ [[3,2],[3,2],[3,2],[0,2],[1,2],[2,2],[4,2],[2,2],[1,2],[0,2],[1,2],[0,3]],
    [[2,2],[2,2],[4,2],[3,2],[4,2],[3,2],[2,3]],
    [[4,2],[3,2],[2,2],[1,2],[0,4]],
    [[2,2],[4,2],[3,2],[4,2],[2,3]],
    [[3,2],[4,2],[3,2],[2,2],[1,3]],
    [[2,2],[1,2],[0,2],[1,2],[0,4]] ],
  // 3. むすんで ひらいて
  [ [[0,2],[0,2],[3,2],[3,3]], [[4,2],[4,2],[3,2],[2,3]],
    [[2,2],[2,2],[1,2],[1,2],[0,3]], [[0,2],[0,2],[3,2],[3,3]],
    [[3,2],[3,2],[4,2],[4,2],[3,2],[2,3]],
    [[2,2],[1,2],[0,2],[1,2],[2,2],[3,2],[0,4]] ],
  // 4. うさぎ うさぎ
  [ [[2,2],[1,2],[0,2],[2,2],[1,2],[0,3]], [[0,2],[1,2],[2,2],[3,2],[2,2],[1,2],[0,3]],
    [[2,2],[3,2],[4,2],[3,2],[2,2],[1,2],[2,2],[1,2],[0,4]], [[1,2],[2,2],[3,2],[1,2],[0,4]] ],
  // 5. かごめ かごめ
  [ [[1,2],[1,2],[1,2],[1,2],[1,2],[0,3]], [[1,2],[1,2],[2,2],[1,2],[1,2],[0,2],[1,2],[1,2],[0,3]],
    [[1,2],[1,2],[1,2],[1,2],[2,2],[1,2],[0,3]], [[2,2],[1,2],[1,2],[0,2],[1,2],[1,2],[0,4]] ],
  // 6. とおりゃんせ
  [ [[0,2],[1,2],[2,2],[1,2],[0,2],[0,2],[1,2],[2,2],[1,2],[0,2],[1,3]],
    [[2,2],[2,2],[1,2],[1,2],[0,2],[1,2],[2,2],[3,2],[2,2],[1,2],[0,3]],
    [[3,2],[3,2],[4,2],[3,2],[2,2],[1,2],[2,2],[3,2],[2,2],[1,2],[0,2],[1,3]],
    [[1,2],[2,2],[3,2],[2,2],[1,2],[2,2],[1,2],[0,2],[1,2],[0,2],[1,2],[0,4]] ],
  // 7. ずいずい ずっころばし
  [ [[0,2],[0,2],[2,2],[2,2],[0,2],[3,2],[2,2],[1,2],[0,2],[1,3]],
    [[2,2],[2,2],[1,2],[1,2],[0,2],[1,3]],
    [[3,2],[3,2],[2,2],[3,2],[4,2],[3,2],[2,2],[1,3]],
    [[1,2],[2,2],[3,2],[2,2],[1,2],[0,4]] ],
  // 8. あぶくたった
  [ [[0,2],[2,2],[1,2],[2,2],[3,2],[4,3]], [[3,2],[2,2],[1,2],[2,2],[0,3]],
    [[2,2],[3,2],[2,2],[1,2],[2,2],[1,2],[0,2],[1,3]], [[2,2],[1,2],[0,2],[1,2],[2,2],[0,4]] ],
  // 9. はな いちもんめ
  [ [[2,2],[1,2],[0,2],[1,2],[2,2],[3,2],[4,3]], [[4,2],[3,2],[4,2],[5,2],[4,2],[3,2],[2,3]],
    [[2,2],[1,2],[0,2],[4,2],[3,2],[1,2],[0,4]], [[2,2],[1,2],[0,2],[1,2],[2,2],[3,2],[4,3]] ],
  // 10. あがりめ さがりめ — 눈이 올라가고 내려가는 모양 그대로
  [ [[0,2],[1,2],[2,2],[4,3]], [[4,2],[2,2],[1,2],[0,3]],
    [[0,2],[1,2],[2,2],[3,2],[2,2],[1,2],[0,2],[1,3]], [[2,2],[1,2],[0,2],[2,4]] ],
  // 11. ちょち ちょち あわわ
  [ [[3,2],[3,2],[2,2],[3,2],[3,3]], [[2,2],[1,2],[0,3]],
    [[0,2],[1,2],[2,2],[3,2],[0,2],[1,2],[2,2],[3,3]], [[2,2],[1,2],[2,2],[1,2],[0,4]] ],
  // 12. いっぽんばし こちょこちょ — 간지럼 태우듯 빠른 음
  [ [[0,2],[1,2],[2,2],[3,2],[2,2],[1,3]], [[2,1],[3,1],[2,1],[3,1],[4,3]],
    [[2,2],[2,2],[3,2],[4,3]], [[4,2],[3,2],[2,2],[1,3]],
    [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[4,2],[3,3]], [[2,1],[3,1],[2,1],[3,1],[4,4]] ],
  // 13. おふねが ぎっちらこ — 배가 흔들리듯 오르내리는 음
  [ [[0,2],[1,2],[2,2],[3,3]], [[3,2],[2,2],[3,2],[2,2],[1,3]],
    [[2,2],[1,2],[0,2],[2,2],[1,2],[0,3]], [[3,2],[2,2],[3,2],[2,2],[1,4]] ],
  // 14. かいぐり かいぐり とっとの め
  [ [[0,2],[1,2],[2,2],[3,2],[0,2],[1,2],[2,2],[3,3]], [[4,2],[3,2],[2,2],[1,2],[0,4]],
    [[2,2],[3,2],[4,2],[3,2],[2,2],[1,3]], [[4,2],[3,2],[2,2],[1,2],[0,4]] ],
  // 15. にらめっこ しましょ — 웃음 참기, 마지막에 익살스럽게 튀는 음
  [ [[0,2],[0,2],[1,2],[2,2],[0,2],[0,2],[1,2],[2,2],[3,2],[4,3]],
    [[4,2],[3,2],[2,2],[1,2],[0,2],[1,2],[2,2],[3,2],[4,3]],
    [[2,2],[1,2],[0,2],[1,2],[2,2],[1,2],[0,3]], [[5,1],[3,1],[5,1],[8,3]] ],
  // 16. おせんべ やけたかな
  [ [[0,2],[1,2],[2,2],[3,2],[0,2],[1,2],[2,2],[3,3]], [[3,2],[2,2],[1,2],[2,2],[0,4]],
    [[2,2],[1,2],[2,2],[1,3]], [[1,2],[2,2],[3,2],[4,2],[5,4]] ],
  // 17. なべ なべ そこぬけ
  [ [[0,2],[1,2],[0,2],[1,3]], [[1,2],[2,2],[1,2],[0,3]],
    [[2,2],[1,2],[0,2],[1,2],[2,2],[1,2],[0,3]], [[3,2],[2,2],[1,2],[2,2],[1,2],[0,4]] ],
  // 18. とんとんとんとん ひげじいさん — 문 두드리는 리듬은 같은 음을 짧게 반복
  [ [[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,3]], [[2,2],[3,2],[4,2],[3,2],[2,2],[1,3]],
    [[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,3]], [[2,2],[3,2],[4,2],[3,2],[2,2],[1,3]],
    [[1,2],[2,2],[3,2],[2,2],[1,2],[0,2],[1,2],[0,4]] ],
  // 19. せっせっせーの よいよいよい
  [ [[0,2],[1,2],[2,2],[3,2],[4,2],[5,3]], [[4,1],[3,1],[2,1],[3,1],[2,1],[0,4]] ],
  // 20. もう いいかい まあだだよ — 숨어서 기다리는 느낌의 붕 뜬 음(2번째 줄)
  [ [[0,2],[1,2],[2,2],[1,2],[0,2],[1,3]], [[2,2],[2,2],[3,2],[4,4]],
    [[0,2],[1,2],[2,2],[1,2],[0,2],[1,3]], [[2,2],[1,2],[0,2],[1,2],[0,4]] ],
  // 21. あめふり — pianojuku.info에서 제공하는 실제 피아노 악보(MusicXML/MIDI, 다장조 표기)를
  //     그대로 채보했습니다. 즉흥 작곡이 아니라 악보에 적힌 음(다장조: 도C4=0, 레D4=1, 미E4=2,
  //     솔G4=3, 라A4=4, 높은도C5=5)과 실제 음표 길이(16분음표=1, 점8분음표=3, 점4분음표=6, 4분음표=4
  //     — 악보의 division 값을 그대로 비율로 사용) 그대로를 4개 가사 소절에 맞춰 옮겼습니다.
  //     "あめあめ ふれふれ かあさんが"의 도-도-도-레-미-레-솔-미-(높은)도-라-솔-미-솔 라인과,
  //     후렴 "ピッチピッチ チャップチャップ ランランラン"의 도-라-도-라-솔-미-솔-미 / 솔-도-도(길게)
  //     진행이 실제 곡 그대로라, 다른 손유희 동요들과 달리 또렷한 '진짜 노래' 느낌이 납니다.
  [ [[0,3],[0,1],[0,3],[1,1],[2,3],[1,1],[3,3],[2,1],[5,3],[4,1],[3,3],[2,1],[3,6]],
    [[0,3],[0,1],[0,3],[1,1],[2,3],[3,1],[4,3],[4,1],[2,3],[2,1],[2,3],[1,1],[0,6]],
    [[5,3],[4,1],[5,3],[4,1],[3,3],[2,1],[3,3],[2,1]],
    [[3,4],[5,4],[5,6]] ]
];

const KARAOKE_KANA_VOWEL = {'あ':'a','い':'i','う':'u','え':'e','お':'o','か':'a','き':'i','く':'u','け':'e','こ':'o','さ':'a','し':'i','す':'u','せ':'e','そ':'o','た':'a','ち':'i','つ':'u','て':'e','と':'o','な':'a','に':'i','ぬ':'u','ね':'e','の':'o','は':'a','ひ':'i','ふ':'u','へ':'e','ほ':'o','ま':'a','み':'i','む':'u','め':'e','も':'o','ら':'a','り':'i','る':'u','れ':'e','ろ':'o','が':'a','ぎ':'i','ぐ':'u','げ':'e','ご':'o','ざ':'a','じ':'i','ず':'u','ぜ':'e','ぞ':'o','だ':'a','ぢ':'i','づ':'u','で':'e','ど':'o','ば':'a','び':'i','ぶ':'u','べ':'e','ぼ':'o','ぱ':'a','ぴ':'i','ぷ':'u','ぺ':'e','ぽ':'o','や':'a','ゆ':'u','よ':'o','わ':'a','を':'o','ん':'N','ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o','ゃ':'a','ゅ':'u','ょ':'o','っ':null,'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o','カ':'a','キ':'i','ク':'u','ケ':'e','コ':'o','サ':'a','シ':'i','ス':'u','セ':'e','ソ':'o','タ':'a','チ':'i','ツ':'u','テ':'e','ト':'o','ナ':'a','ニ':'i','ヌ':'u','ネ':'e','ノ':'o','ハ':'a','ヒ':'i','フ':'u','ヘ':'e','ホ':'o','マ':'a','ミ':'i','ム':'u','メ':'e','モ':'o','ラ':'a','リ':'i','ル':'u','レ':'e','ロ':'o','ガ':'a','ギ':'i','グ':'u','ゲ':'e','ゴ':'o','ザ':'a','ジ':'i','ズ':'u','ゼ':'e','ゾ':'o','ダ':'a','ヂ':'i','ヅ':'u','デ':'e','ド':'o','バ':'a','ビ':'i','ブ':'u','ベ':'e','ボ':'o','パ':'a','ピ':'i','プ':'u','ペ':'e','ポ':'o','ヤ':'a','ユ':'u','ヨ':'o','ワ':'a','ヲ':'o','ン':'N','ァ':'a','ィ':'i','ゥ':'u','ェ':'e','ォ':'o','ャ':'a','ュ':'u','ョ':'o','ッ':null,'ー':'ー'};

const KARAOKE_VOWEL_FORMANTS = {
  a: [[800,1.0,80],[1200,0.55,90],[2500,0.25,120]],
  i: [[300,0.7,60],[2400,0.85,110],[3200,0.35,130]],
  u: [[350,0.8,70],[1100,0.4,90],[2500,0.2,120]],
  e: [[500,0.85,70],[1800,0.55,100],[2600,0.25,120]],
  o: [[500,0.9,80],[900,0.5,90],[2600,0.2,120]],
  N: [[300,0.6,60],[1100,0.3,90],[2200,0.15,110]]
};

const KARAOKE_SEMITONES = [0,2,4,7,9,12,14,16,19,21,5,11,17,23];

const KANJI_CARDS = [
  {kanji:'天', reading:'てん', emoji:'🌤️', words:['天気','天の川','天ごく']},
  {kanji:'夕', reading:'ゆう', emoji:'🌇', words:['夕日','夕がた','夕ぐれ']},
  {kanji:'山', reading:'やま', emoji:'⛰️', words:['山みち','山いも','ふじ山']},
  {kanji:'気', reading:'き', emoji:'💭', words:['空気','気もち','げん気']},
  {kanji:'人', reading:'ひと', emoji:'🧑', words:['人ごみ','めい人','人げん']},
  {kanji:'女', reading:'おんな', emoji:'👧', words:['女子','女の人','女と男']},
  {kanji:'王', reading:'おう', emoji:'👑', words:['王さま','王かん','こく王']},
  {kanji:'男', reading:'おとこ', emoji:'👦', words:['男の子','男の人','男子']},
  {kanji:'子', reading:'こ', emoji:'🐣', words:['子ども','子犬','女子']},
  {kanji:'目', reading:'め', emoji:'👁️', words:['目と口','目つき','目てき']},
  {kanji:'口', reading:'くち', emoji:'👄', words:['口ぶえ','口べに','人口']},
  {kanji:'耳', reading:'みみ', emoji:'👂', words:['耳たぶ','耳うち','目と耳']},
  {kanji:'先', reading:'せん', emoji:'🧑‍🏫', words:['先生','先とう','足の先']},
  {kanji:'村', reading:'むら', emoji:'🏞️', words:['村の人','町と村','山村']},
  {kanji:'字', reading:'じ', emoji:'✏️', words:['かん字','すう字','てん字']},
  {kanji:'町', reading:'まち', emoji:'🏙️', words:['町なみ','町の中','町村']},
  {kanji:'玉', reading:'たま', emoji:'🔮', words:['玉虫','百円玉','玉手ばこ']},
  {kanji:'出', reading:'で・しゅつ', emoji:'🚪', words:['出す','出る','出ぱつ']},
  {kanji:'糸', reading:'いと', emoji:'🧵', words:['白い糸','赤い糸','きぬ糸']},
  {kanji:'入', reading:'にゅう・はい', emoji:'🚪', words:['入る','入学','入り口']},
  {kanji:'田', reading:'た', emoji:'🌾', words:['田んぼ','水田','田うえ']},
  {kanji:'年', reading:'ねん', emoji:'📅', words:['年上','一年生','年より']},
  {kanji:'竹', reading:'たけ', emoji:'🎍', words:['竹うま','竹やぶ','竹わ']},
  {kanji:'生', reading:'せい', emoji:'🐥', words:['生む','生きる','生もの']},
  {kanji:'月', reading:'つき', emoji:'🌙', words:['月見','二月','まん月']},
  {kanji:'水', reading:'みず', emoji:'💧', words:['水玉','水草','水どう']},
  {kanji:'火', reading:'ひ', emoji:'🔥', words:['火じ','火山','火のこ']},
  {kanji:'木', reading:'き', emoji:'🌳', words:['木目','にわ木','木かげ']},
  {kanji:'金', reading:'きん', emoji:'🪙', words:['お金','金いろ','ちょ金']},
  {kanji:'日', reading:'ひ', emoji:'☀️', words:['三日','一日','日じ']},
  {kanji:'土', reading:'つち', emoji:'🟤', words:['赤土','土足','土き']},
  {kanji:'早', reading:'はや', emoji:'🌅', words:['早い','早足','早める']},
  {kanji:'赤', reading:'あか', emoji:'🔴', words:['赤い車','赤ちゃん','赤はん']},
  {kanji:'白', reading:'しろ', emoji:'⚪', words:['空白','白い花','白ぐみ']},
  {kanji:'青', reading:'あお', emoji:'🔵', words:['青空','青年','青い']},
  {kanji:'円', reading:'えん', emoji:'⭕', words:['円けい','円ばん','円い']},
  {kanji:'九', reading:'きゅう', emoji:'9️⃣', words:['九月','九こ','九つ']},
  {kanji:'百', reading:'ひゃく', emoji:'💯', words:['百年','百円','百日']},
  {kanji:'十', reading:'じゅう', emoji:'🔟', words:['十年','十月','十日']},
  {kanji:'千', reading:'せん', emoji:'🎏', words:['千年','千円','千人']}
];

const ADJECTIVE_SETS = [
  {
    id: 'futoi-hosoi', title: 'ふとい・ほそい', sub: '굵다 · 가늘다',
    emoji: '🌳', shapeType: 'thickness',
    adjA: {jp:'ふとい', kr:'굵다'}, adjB: {jp:'ほそい', kr:'가늘다'},
    intro: {jp:'き', kr:'나무'},
    items: [
      {jp:'さつまいも', kr:'고구마'},
      {jp:'べると', kr:'벨트'},
      {jp:'でんち', kr:'건전지'},
      {jp:'しっぽ', kr:'꼬리'},
      {jp:'くき', kr:'줄기'},
      {jp:'えだ', kr:'가지'}
    ]
  },
  {
    id: 'nagai-mijikai', title: 'ながい・みじかい', sub: '길다 · 짧다',
    emoji: '✏️', shapeType: 'length',
    adjA: {jp:'ながい', kr:'길다'}, adjB: {jp:'みじかい', kr:'짧다'},
    intro: {jp:'えんぴつ', kr:'연필'},
    items: [
      {jp:'ひも', kr:'끈'},
      {jp:'くつした', kr:'양말'},
      {jp:'へび', kr:'뱀'},
      {jp:'りぼん', kr:'리본'},
      {jp:'しっぽ', kr:'꼬리'},
      {jp:'はな', kr:'코'},
      {jp:'かみのけ', kr:'머리카락'}
    ]
  },
  {
    id: 'takai-hikui', title: 'たかい・ひくい', sub: '높다 · 낮다',
    emoji: '⛰️', shapeType: 'height',
    adjA: {jp:'たかい', kr:'높다'}, adjB: {jp:'ひくい', kr:'낮다'},
    intro: {jp:'やま', kr:'산'},
    items: [
      {jp:'びる', kr:'빌딩'},
      {jp:'いえ', kr:'집'},
      {jp:'はしご', kr:'사다리'},
      {jp:'き', kr:'나무'},
      {jp:'せ', kr:'키'},
      {jp:'いす', kr:'의자'},
      {jp:'てえぶる', kr:'테이블'}
    ]
  },
  {
    id: 'ooi-sukunai', title: 'おおい・すくない', sub: '많다 · 적다',
    emoji: '🥤', shapeType: 'quantity',
    adjA: {jp:'おおい', kr:'많다'}, adjB: {jp:'すくない', kr:'적다'},
    intro: {jp:'じゅうす', kr:'주스'},
    items: [
      {jp:'えんぴつ', kr:'연필'},
      {jp:'ごはん', kr:'밥'},
      {jp:'くるま', kr:'자동차'},
      {jp:'あめ', kr:'사탕'}
    ],
    classify: {
      prompt: '다음 낱말은 「おおい(많다)」와 「すくない(적다)」 중 어느 무리일까요?',
      words: [
        {jp:'たくさん', kr:'많이', answer:'A'},
        {jp:'いっぱい', kr:'가득', answer:'A'},
        {jp:'ちょっと', kr:'조금', answer:'B'},
        {jp:'すこし', kr:'약간', answer:'B'}
      ]
    }
  },
  {
    id: 'ookii-chiisai', title: 'おおきい・ちいさい', sub: '크다 · 작다',
    emoji: '🍎', shapeType: 'size',
    adjA: {jp:'おおきい', kr:'크다'}, adjB: {jp:'ちいさい', kr:'작다'},
    intro: {jp:'りんご', kr:'사과'},
    items: [
      {jp:'たまご', kr:'계란'},
      {jp:'ぼうし', kr:'모자'},
      {jp:'おにぎり', kr:'주먹밥'},
      {jp:'いえ', kr:'집'}
    ],
    classify: {
      prompt: '다음 동물(과 물건)은 「おおきい(크다)」와 「ちいさい(작다)」 중 어느 무리일까요?',
      words: [
        {jp:'ぞう', kr:'코끼리', answer:'A'},
        {jp:'くじら', kr:'고래', answer:'A'},
        {jp:'あり', kr:'개미', answer:'B'},
        {jp:'ごま', kr:'참깨', answer:'B'}
      ]
    }
  }
];

/* 🎧 청지각 변별력(Phonological Discrimination) 진단용 미니멀 페어.
   learning-theory-roadmap.md Part 2 §1-1. 한국어 화자가 특히 헷갈려하는(또는 일본어 학습
   초반에 자주 혼동하는) 모라 쌍 10개를 골라둠 — 청음/탁음 대비(か/が, た/だ, は/ば),
   자음 조음점이 가까운 쌍(し/ひ, ら/な, り/に), 요음-직음 대비(つ/ちゅ, す/しゅ, ざ/じゃ),
   그리고 한국어에 없는 마찰음 대비(つ/す)까지 섞어 난이도를 다양화했음.
   각 쌍은 { a, b } 두 모라만 담고, 실제 "같다/다르다" 배정(둘 다 a로 재생할지, a·b를 섞어
   재생할지)은 로직 쪽(logic.js의 generatePhonoQuestion)에서 매 문제 무작위로 정함. */
const PHONO_MINIMAL_PAIRS = [
  { a: 'つ', b: 'す' },
  { a: 'し', b: 'ひ' },
  { a: 'ざ', b: 'じゃ' },
  { a: 'ら', b: 'な' },
  { a: 'は', b: 'ば' },
  { a: 'か', b: 'が' },
  { a: 'た', b: 'だ' },
  { a: 'つ', b: 'ちゅ' },
  { a: 'す', b: 'しゅ' },
  { a: 'り', b: 'に' }
];

/* 🔗 연상학습 속도(Paired-Associate Learning Rate) 진단용 기호-소리 쌍.
   learning-theory-roadmap.md Part 2 §1-3. 히라가나/기존 어휘 지식이 결과에 영향을 주지 않도록,
   실제 문자가 아닌 추상 도형(◆▲●■★)과 실제 뜻이 없는 무의미 카타카나 단어를 짝지어둠.
   symbol은 화면 표시용, name은 TTS로 읽고 정답 선택지 텍스트로도 그대로 씀. */
const PAL_SYMBOL_SOUND_PAIRS = [
  { symbol: '◆', name: 'タポ' },
  { symbol: '▲', name: 'ケニ' },
  { symbol: '●', name: 'ヌソ' },
  { symbol: '■', name: 'ミヘ' },
  { symbol: '★', name: 'ロズ' }
];

/* 🎭 미니 롤플레이(상황극) — learning-theory-roadmap.md Part 2 §4-1.
   "정답 맞히기"가 아니라 "미션 달성"이 목적인 목표지향 분기 대화 프로토타입.
   각 시나리오는 node id를 key로 하는 그래프(nodes)로 구성됨.
   - npc: {name, emoji, voice:{rate,pitch}} — NPC마다 목소리를 다르게 줘서 화자 다양성(④)을 흉내냄
   - linePool: 이 노드에 도착할 때마다 무작위로 하나 골라 재생하는 NPC 대사 후보 —
     같은 노드를 다시 만나도 매번 표현이 살짝 달라지게 해 "정답 문장 그대로 암기"를 완화함
     (부호화 다양성 원리 재적용)
   - choices: [{label(화면에 보이는 한국어 선택지), jp(그 선택지를 고르면 "말한 것으로 치는"
     일본어 문장), next(다음 node id), success(true면 이 선택으로 미션 완료)}]
   - retryPool: 미션에 도움이 안 되는 선택을 했을 때, "❌ 오답입니다" 대신 NPC가 자연스럽게
     되묻는 대사 후보(⑧ 의미 협상 시뮬레이션 근사) — 이 경우 게임이 끝나지 않고 같은 노드에서
     다시 선택할 기회를 줌(⑤ 낮은 정의적 여과 — 틀려도 안전하다는 경험)
   1차 프로토타입 범위: 시나리오 2개, 선택형 응답만 지원(음성 응답 확장은 다음 세션 후보 —
   인식 정확도 이슈로 우선 텍스트 선택으로 미션 판정을 검증한 뒤 확장하는 게 안전함). */
const ROLEPLAY_SCENARIOS = [
  {
    id: 'restaurant', title: '식당에서 주문하기', emoji: '🍜',
    intro: '식당에 들어왔어요. 점원이 인사를 건네요.',
    npc: { name: '점원', emoji: '🧑‍🍳', voice: { rate: 0.82, pitch: 0.85 } },
    startNode: 'greet',
    nodes: {
      greet: {
        linePool: [
          { jp: 'いらっしゃいませ！なにを　たべますか？', kr: '어서오세요! 뭘 드시겠어요?' },
          { jp: 'こんにちは！ごちゅうもんは？', kr: '안녕하세요! 주문하시겠어요?' }
        ],
        choices: [
          { label: '🍙 "오니기리 주세요"', jp: 'おにぎり　ください', next: 'confirmOnigiri' },
          { label: '👋 "안녕히 가세요"', jp: 'さようなら', next: 'confused' }
        ]
      },
      confused: {
        retryPool: [
          { jp: 'すみません、もういちど　いって　ください？', kr: '죄송해요, 다시 한 번 말해줄래요?' },
          { jp: 'え？　なんですか？', kr: '네? 뭐라고 하셨죠?' }
        ],
        choices: [
          { label: '🍙 "오니기리 주세요"', jp: 'おにぎり　ください', next: 'confirmOnigiri' },
          { label: '💧 "물 주세요"', jp: 'おみず　ください', next: 'confirmWater' }
        ]
      },
      confirmOnigiri: {
        linePool: [ { jp: 'おにぎりですね！　かしこまりました！', kr: '오니기리요! 알겠습니다!' } ],
        choices: [ { label: '🙏 "감사합니다"', jp: 'ありがとうございます', next: 'success', success: true } ]
      },
      confirmWater: {
        linePool: [ { jp: 'おみずですね！　どうぞ！', kr: '물이요! 여기 있어요!' } ],
        choices: [ { label: '🙏 "감사합니다"', jp: 'ありがとうございます', next: 'success', success: true } ]
      },
      success: {
        linePool: [ { jp: 'どうぞ　めしあがれ！', kr: '맛있게 드세요!' } ],
        choices: []
      }
    }
  },
  {
    id: 'convenience', title: '편의점 계산대', emoji: '🏪',
    intro: '과자를 들고 계산대 앞에 섰어요.',
    npc: { name: '점원', emoji: '🧑‍💼', voice: { rate: 0.88, pitch: 1.08 } },
    startNode: 'greet',
    nodes: {
      greet: {
        linePool: [
          { jp: 'これで　よろしいですか？', kr: '이걸로 괜찮으신가요?' },
          { jp: 'ほかに　なにか　いりますか？', kr: '다른 거 더 필요하세요?' }
        ],
        choices: [
          { label: '👍 "네, 이것만요"', jp: 'はい、これだけです', next: 'pay' },
          { label: '🎒 "학교 가요"', jp: 'がっこうに　いきます', next: 'confused' }
        ]
      },
      confused: {
        retryPool: [
          { jp: 'すみません、もういちど　おねがいします', kr: '죄송해요, 다시 한 번 부탁드려요' }
        ],
        choices: [ { label: '👍 "네, 이것만요"', jp: 'はい、これだけです', next: 'pay' } ]
      },
      pay: {
        linePool: [ { jp: '100えんです', kr: '100엔입니다' } ],
        choices: [ { label: '💴 "여기 있어요"', jp: 'はい、どうぞ', next: 'success', success: true } ]
      },
      success: {
        linePool: [ { jp: 'ありがとうございました！', kr: '감사합니다!' } ],
        choices: []
      }
    }
  },
  {
    id: 'directions', title: '길 묻기', emoji: '🗺️',
    intro: '역으로 가는 길을 잃어버렸어요. 지나가는 사람에게 물어봐요.',
    npc: { name: '행인', emoji: '🚶', voice: { rate: 0.86, pitch: 0.95 } },
    startNode: 'ask',
    nodes: {
      ask: {
        linePool: [
          { jp: 'こんにちは、どうしましたか？', kr: '안녕하세요, 무슨 일이세요?' },
          { jp: 'なにか　さがしていますか？', kr: '뭔가 찾고 계세요?' }
        ],
        choices: [
          { label: '🚉 "역은 어디예요?"', jp: 'えきは　どこですか？', next: 'pointDirection' },
          { label: '🍨 "저는 아이스크림을 좋아해요"', jp: 'アイスが　すきです', next: 'confused' }
        ]
      },
      confused: {
        retryPool: [
          { jp: 'すみません、なにが　ききたいですか？', kr: '죄송해요, 뭘 물어보고 싶으신 거예요?' },
          { jp: 'もういちど　いって　ください', kr: '다시 한 번 말해줄래요?' }
        ],
        choices: [
          { label: '🚉 "역은 어디예요?"', jp: 'えきは　どこですか？', next: 'pointDirection' }
        ]
      },
      pointDirection: {
        linePool: [
          { jp: 'まっすぐ　いって　ください', kr: '똑바로 가세요' },
          { jp: 'あそこを　みぎに　まがってください', kr: '저기서 오른쪽으로 도세요' }
        ],
        choices: [
          { label: '🙏 "감사합니다"', jp: 'ありがとうございます', next: 'success', success: true }
        ]
      },
      success: {
        linePool: [ { jp: 'きを　つけて！', kr: '조심해서 가세요!' } ],
        choices: []
      }
    }
  }
];

const MENU_CATEGORIES = [
  {
    id: 'quiz-choice', title: '객관식 퀴즈', emoji: '❓',
    desc: '문제를 보고 4개 선택지 중 정답을 골라요',
    games: [
      {mode:'quiz', title:'단어 퀴즈 풀기', emoji:'❓'},
      {mode:'audioEmoji', title:'소리 듣고 이모지 맞히기', emoji:'🎧'},
      {mode:'riddle', title:'나는 무엇일까요?', emoji:'🤔'},
      {mode:'qa', title:'질문에 답하기', emoji:'❓'},
      {mode:'shop', title:'가게 게임 (가격 맞히기)', emoji:'🏪'},
      {mode:'lifeqa', title:'생활 문답 (시간·온도·날씨)', emoji:'🌈'},
      {mode:'hiraganaSpeed', title:'히라가나 카드찾기', emoji:'⚡'},
      {mode:'adjective', title:'형용사 배우기', emoji:'🌱'}
    ]
  },
  {
    id: 'sound-spelling', title: '소리·철자 맞추기', emoji: '🔤',
    desc: '들은 소리를 철자나 카드로 재구성해요',
    games: [
      {mode:'spelling', title:'철자 순서 맞추기', emoji:'🔤'},
      {mode:'onomatopoeia', title:'의성어 카드 게임', emoji:'🔊'}
    ]
  },
  {
    id: 'handwriting', title: '손글씨 쓰기 연습', emoji: '✍️',
    desc: '손으로 직접 그리듯 써보며 글자와 단어를 익혀요',
    games: [
      {mode:'writing', title:'쓰기 게임', emoji:'✍️'},
      {mode:'hiraganaWrite', title:'히라가나 쓰기', emoji:'🖊️'},
      {mode:'trace', title:'따라쓰기 트레이싱', emoji:'🖊️'},
      {mode:'worksheet', title:'히라가나 워크시트', emoji:'📝'},
      {mode:'dakuonTest', title:'탁음·요음 쓰기 테스트', emoji:'✏️'}
    ]
  },
  {
    id: 'speaking', title: '말하기 (음성 인식)', emoji: '🎤',
    desc: '직접 소리 내어 말하면 마이크가 인식해줘요',
    games: [
      {mode:'speech', title:'소리로 쓰기', emoji:'🎙️'},
      {mode:'hiraganaRead', title:'히라가나 읽기', emoji:'🎤'},
      {mode:'shadowing', title:'섀도잉 (듣고 곧바로 따라 말하기)', emoji:'🦜'}
    ]
  },
  {
    id: 'card-matching', title: '카드 매칭·기억력', emoji: '🃏',
    desc: '카드를 뒤집거나 이어서 짝을 맞춰요',
    games: [
      {mode:'matching', title:'짝 맞추기 카드 게임', emoji:'🃏'},
      {mode:'linematch', title:'선긋기 게임', emoji:'📝'},
      {mode:'wordMemory', title:'단어 메모리 게임', emoji:'🧠'},
      {mode:'eawase', title:'그림 반쪽 맞추기', emoji:'🧩'},
      {mode:'silhouette', title:'실루엣 맞추기', emoji:'🌑'},
      {mode:'kanjiCards', title:'한자 플래시카드', emoji:'🈴'}
    ]
  },
  {
    id: 'sentence-building', title: '문장·단어 조합', emoji: '🧩',
    desc: '단어를 순서대로 배열하거나 조합해서 문장·단어를 만들어요',
    games: [
      {mode:'sentence', title:'2단어 문장 맞히기', emoji:'🗣️'},
      {mode:'compound', title:'합성어 맞추기', emoji:'🧩'}
    ]
  },
  {
    id: 'word-search', title: '탐색 퍼즐', emoji: '🔍',
    desc: '격자 속에 숨은 단어를 찾아요',
    games: [
      {mode:'wordsearch', title:'낱말 찾기 퍼즐', emoji:'🔍'}
    ]
  },
  {
    id: 'listening', title: '듣기 전용 학습', emoji: '🔁',
    desc: '정답을 맞히기보다 반복해서 듣고 자연스럽게 익혀요',
    games: [
      {mode:'pronounce', title:'발음 따라하기', emoji:'🎤'},
      {mode:'exposure', title:'반복 노출 학습', emoji:'🔁'},
      {mode:'scene', title:'하루 일과 씬', emoji:'🌅'}
    ]
  },
  {
    id: 'reading-content', title: '이야기·노래 감상', emoji: '📖',
    desc: '동화책과 노래를 보고 들으며 자연스럽게 언어를 접해요',
    games: [
      {mode:'storybook', title:'엄마 목소리 동화책', emoji:'📖'},
      {mode:'emojiStorybook', title:'이모지 동화책', emoji:'🍎'},
      {mode:'ebook', title:'전자책 읽기', emoji:'📚'},
      {mode:'karaoke', title:'동요 가라오케', emoji:'🎤'},
      {mode:'songs', title:'손동작 노래', emoji:'🎶'}
    ]
  },
  {
    id: 'roleplay', title: '미니 상황극', emoji: '🎭',
    desc: '식당·편의점 같은 상황에서 대화로 목표를 이뤄봐요',
    games: [
      {mode:'roleplay', title:'미니 상황극 (목표 달성 대화)', emoji:'🎭'}
    ]
  }
];

/* 🪜 게임 유형 → 학습 단계 매핑 — learning-theory-roadmap.md Part 2 §2.
   이미 구현된 히라가나 3중 검증(재인·회상·발화, computeLtmStatus)을 히라가나 밖 게임
   30여 개 전체로 일반화하기 위한 첫 단계. "어떤 게임이 A~E 중 어느 학습 단계에
   해당하는가"만 정의한 정적 매핑이며, "이 항목이 지금 몇 단계인지"를 실제 성과로
   판정하는 로직(§3 오케스트레이터)은 아직 이 파일에 없음 — 그 판정 로직이 참조할
   입력 데이터로 먼저 정리해둔 것. */
const GAME_STAGE_INFO = {
  A: { label: '최초 노출', desc: '낮은 부담으로 형태·소리·의미를 처음 만나는 단계' },
  B: { label: '재인 연습', desc: '"보면 안다" 수준을 형성하는 단계' },
  C: { label: '회상 연습', desc: '"스스로 떠올려 쓴다" 수준을 형성하는 단계' },
  D: { label: '발화·전이', desc: '실제 사용 맥락에서 생성·응용하는 단계' },
  E: {
    label: '유지·재맥락화',
    desc: '이미 아는 것을 새 맥락에서 다시 만나 장기 정착시키는 단계. ' +
          '특정 게임 모드에 고정되지 않고 복습 세트(기존 startReviewSession)나 ' +
          'A단계 콘텐츠(이야기·노래) 재감상으로 이뤄지므로 GAME_STAGE_MAP에는 없음.'
  }
};

const GAME_STAGE_MAP = {
  // A. 최초 노출 — 이야기·노래 감상 + 듣기 전용 학습
  storybook: 'A', emojiStorybook: 'A', ebook: 'A', karaoke: 'A', songs: 'A',
  pronounce: 'A', exposure: 'A', scene: 'A',

  // B. 재인 연습 — 객관식 퀴즈 + 카드 매칭·기억력
  quiz: 'B', audioEmoji: 'B', riddle: 'B', qa: 'B', shop: 'B', lifeqa: 'B',
  hiraganaSpeed: 'B', adjective: 'B',
  matching: 'B', linematch: 'B', wordMemory: 'B', eawase: 'B', silhouette: 'B', kanjiCards: 'B',

  // C. 회상 연습 — 소리·철자 맞추기 + 손글씨 쓰기 연습
  spelling: 'C', onomatopoeia: 'C',
  writing: 'C', hiraganaWrite: 'C', trace: 'C', worksheet: 'C', dakuonTest: 'C',

  // D. 발화·전이 — 말하기(음성 인식) + 문장·단어 조합 + 탐색 퍼즐
  speech: 'D', hiraganaRead: 'D', shadowing: 'D', sentence: 'D', compound: 'D', wordsearch: 'D',
  // 🎭 미니 롤플레이 — learning-theory-roadmap.md Part 2 §4-1. D단계(발화·전이)의 상위
  // 확장판(목표지향 시뮬레이션)이라 같은 D로 분류함
  roleplay: 'D'
};

/* 🧭 §3 오케스트레이터 Phase 1(규칙 기반) — learning-theory-roadmap.md Part 2 §3.
   "진단 프로필(§1)로 정한 학습자 성향 → 오늘 세션에 A~E 단계를 얼마나 섞어줄까"의
   목표 비율표. roadmap 원안의 "신중한 학습자/보통/빠른 습득자" 3분류 예시 배합을 그대로 데이터화함.
   실제 학습자 성향 분류(classifyLearnerTendency)와 목표 대비 실제 분포 비교는 logic.js에서 수행. */
const LEARNER_STAGE_RATIO = {
  cautious: { A: 0.35, B: 0.25, C: 0.20, D: 0.10, E: 0.10 },
  normal:   { A: 0.20, B: 0.25, C: 0.25, D: 0.15, E: 0.15 },
  fast:     { A: 0.10, B: 0.20, C: 0.25, D: 0.25, E: 0.20 }
};

/* 히라가나 축에서 각 단계(A~D)를 대표하는 게임 모드 — §3 Phase 1은 우선 히라가나
   카드찾기/쓰기/읽기(재인·회상·발화) 3채널 통계가 이미 갖춰진 히라가나 학습에만 적용함.
   A단계는 히라가나 전용 "듣기만 하는" 모드가 따로 없어, 저부담 반복 노출 게임인
   exposure(반복 노출 학습)로 근사함 — 특정 글자를 정확히 겨냥하진 못하는 근사치임을
   감안할 것. E단계는 특정 모드가 아니라 기존 복습 세트(startReviewSession)로 대체. */
const STAGE_TO_HIRAGANA_MODE = {
  A: 'exposure',
  B: 'hiraganaSpeed',
  C: 'hiraganaWrite',
  D: 'hiraganaRead',
  E: null
};

/* 어휘(단어) 축에서 각 단계(A~D)를 대표하는 게임 모드 — learning-theory-roadmap.md
   Part 2 §3 "다음 세션 후보"(어휘 축을 오늘의 추천 배너에 연결)의 실제 구현.
   히라가나와 달리 단어 전용 재인/회상/발화 3채널 게임이 따로 있는 게 아니라, 이미
   GAME_STAGE_MAP에서 B/C/D로 분류해둔 "여러 단어를 다루는 일반 게임" 중 대표 하나씩을
   골랐음(quiz/spelling/sentence는 특정 히라가나 글자가 아니라 단어 자체를 다루는 게임).
   A단계는 히라가나와 동일하게 exposure(반복 노출 학습)를 그대로 재사용 — 이 게임 자체가
   히라가나 전용이 아니라 단어 노출용이라 축 구분 없이 공유해도 자연스러움. E단계는
   히라가나 축과 마찬가지로 특정 모드가 아니라 기존 복습 흐름으로 대체(아직 단어 전용
   복습 세트가 없어 null로 둠 — pickNextGameForSession()이 이 경우 히라가나 복습 세트로
   안내함). */
const STAGE_TO_WORD_MODE = {
  A: 'exposure',
  B: 'quiz',
  C: 'spelling',
  D: 'sentence',
  E: null
};

/* 🔀 어휘 축 인출 단서 다변화(모달리티 로테이션) — learning-theory-roadmap.md Part 4 §2에서
   "실질적으로 여러 모드 중에서 골라야 하는 상황은 어휘 축 §3 오케스트레이터가 구현될 때
   처음 발생하니 그때 GAME_MODALITY_MAP을 후보 게임 선정 가중치로 연결하라"고 남겨뒀던
   과제의 실제 구현. 히라가나 축(STAGE_TO_HIRAGANA_MODE)은 단계당 게임이 1개뿐이라 로테이션할
   여지가 없지만, 어휘 축은 같은 단계(B/C/D)에 GAME_STAGE_MAP상 후보 게임이 여러 개 있어
   실제로 고를 수 있음. 여기서는 그중 "제시 모달리티"(present)가 서로 다른 대표 게임만
   소수 선별했음(canonical 게임인 STAGE_TO_WORD_MODE 값을 항상 첫 번째로 포함해, 후보가
   전부 직전 모달리티와 같을 때의 기본값이 되도록 함). kanjiCards처럼 다른 콘텐츠 축(한자)이거나
   worksheet/trace/dakuonTest처럼 히라가나 전용 자산에 의존하는 게임은 후보에서 제외함. */
const WORD_AXIS_STAGE_CANDIDATES = {
  B: ['quiz', 'riddle', 'shop'],           // 소리로 고르기 / 글자로 고르기 / 그림으로 고르기
  C: ['spelling', 'writing'],              // 소리 듣고 쓰기 / 글자 보고 쓰기
  D: ['sentence', 'shadowing', 'wordsearch'] // 글자 보고 고르기 / 소리 듣고 말하기 / 그림 보고 고르기
};

/* 🔀 인출 단서 다변화(모달리티 로테이션) — learning-theory-roadmap.md Part 4 §2.
   기존 GAME_STAGE_MAP(A~D 단계 매핑)과 같은 35개 게임 모드를, 이번엔 다른 축인
   "제시 모달리티"(present: 정보를 어떤 감각으로 주는지)와 "응답 모달리티"(response:
   아이가 어떤 방식으로 반응하는지) 두 필드로 재분류한 것. 같은 GAME_STAGE_MAP 객체에
   필드를 얹지 않고 별도 맵으로 분리한 이유: 기존 GAME_STAGE_MAP은 여러 곳에서
   `GAME_STAGE_MAP[mode] === 'B'`처럼 문자열 값 자체를 직접 비교하는 코드가 많아,
   값을 객체로 바꾸면 그 호출부를 전부 찾아 고쳐야 해서 회귀 리스크가 큼. 별도 맵으로
   두면 기존 코드는 전혀 건드리지 않고 이 축만 새로 조회할 수 있음.
   - present: 'audio'(듣고) / 'text'(글자를 보고) / 'image'(그림·상황을 보고)
   - response: 'passive'(그냥 감상) / 'select'(고르기) / 'write'(쓰기) / 'speak'(말하기)
   1차 구현 범위: 데이터 정의 + "오늘의 추천" 배너에 모달리티 안내 문구 노출까지만.
   실제 추천 로직이 "직전과 다른 모달리티를 우선 선택"하도록 만드는 것은, 현재
   STAGE_TO_HIRAGANA_MODE가 단계마다 게임을 1개로 고정해둔 구조라(대안이 없어 로테이션할
   여지 자체가 없음) 이번 세션에서는 보류함 — §3 오케스트레이터가 어휘 축으로 확장되어
   한 단계에 여러 게임이 후보로 오르게 될 때 함께 다루는 것을 권장. */
const GAME_MODALITY_MAP = {
  // A. 최초 노출 — 정답을 요구하지 않는 수동적 다중 노출
  storybook: { present: 'image', response: 'passive' },
  emojiStorybook: { present: 'image', response: 'passive' },
  ebook: { present: 'text', response: 'passive' },
  karaoke: { present: 'audio', response: 'passive' },
  songs: { present: 'audio', response: 'passive' },
  pronounce: { present: 'audio', response: 'passive' },
  exposure: { present: 'audio', response: 'passive' },
  scene: { present: 'image', response: 'passive' },

  // B. 재인 연습 — 선택 응답
  quiz: { present: 'audio', response: 'select' },
  audioEmoji: { present: 'audio', response: 'select' },
  riddle: { present: 'text', response: 'select' },
  qa: { present: 'text', response: 'select' },
  shop: { present: 'image', response: 'select' },
  lifeqa: { present: 'text', response: 'select' },
  hiraganaSpeed: { present: 'audio', response: 'select' },
  adjective: { present: 'text', response: 'select' },
  matching: { present: 'image', response: 'select' },
  linematch: { present: 'image', response: 'select' },
  wordMemory: { present: 'image', response: 'select' },
  eawase: { present: 'image', response: 'select' },
  silhouette: { present: 'image', response: 'select' },
  kanjiCards: { present: 'text', response: 'select' },

  // C. 회상 연습 — 직접 쓰는 응답
  spelling: { present: 'audio', response: 'write' },
  onomatopoeia: { present: 'audio', response: 'write' },
  writing: { present: 'text', response: 'write' },
  hiraganaWrite: { present: 'audio', response: 'write' },
  trace: { present: 'image', response: 'write' },
  worksheet: { present: 'text', response: 'write' },
  dakuonTest: { present: 'audio', response: 'write' },

  // D. 발화·전이 — 말하기 또는 조합·탐색형 선택 응답
  speech: { present: 'text', response: 'speak' },
  hiraganaRead: { present: 'text', response: 'speak' },
  shadowing: { present: 'audio', response: 'speak' },
  sentence: { present: 'text', response: 'select' },
  compound: { present: 'text', response: 'select' },
  wordsearch: { present: 'image', response: 'select' },
  // 🎭 미니 롤플레이 — NPC 대사는 소리로 듣고(present:audio), 응답은 선택형 대화지(response:select)
  roleplay: { present: 'audio', response: 'select' }
};

/* 모달리티 값 → 아이 친화적 표시 문구. "오늘의 추천" 배너 등에서 조합해 사용
   (예: 소리로 + 고르기 → "🔊 소리로 듣고 고르기"). */
const GAME_MODALITY_LABELS = {
  present: { audio: '🔊 소리로', text: '🔤 글자로', image: '🖼️ 그림으로' },
  response: { passive: '감상하기', select: '고르기', write: '쓰기', speak: '말하기' }
};


