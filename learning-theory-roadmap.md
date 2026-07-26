# 학습이론 로드맵 — 미반영 6개 이론 개발 계획

> 이 문서는 「こえ」 히라가나 학습 앱(index.html / logic.js / data.js / sw.js)을 이어받아 작업할
> 다른 Claude 세션을 위한 인수인계 문서예요. 코드를 처음 보는 상태에서도 바로 작업을 시작할 수 있도록
> 현재 구조, 각 이론의 구현 계획, 건드려야 할 파일/함수를 구체적으로 적어뒀어요.

---

## 0. 먼저 알아야 할 것 — 프로젝트 구조

### 파일 4개 세트
- `index.html` — 마크업 + `<style>` 전체(CSS 변수 기반 디자인 시스템) + iframe/스크립트 로드
- `logic.js` — 전체 게임 로직 (9,300줄+). 함수/상태가 거의 다 여기 있음
- `data.js` — 정적 데이터(단어 목록, 히라가나 획순 좌표, 메뉴 구조 등)
- `sw.js` — 서비스워커. **파일을 하나라도 바꾸면 `CACHE_NAME` 버전을 반드시 올려야** 사용자 브라우저가 새 버전을 받아감 (예: `koe-app-v10` → `v11`)

작업 후에는 **4개 파일을 항상 같이 교체**해서 배포 안내할 것.

### 디자인 시스템 (index.html 상단 `:root`)
```css
--washi:#F7F1E3;      /* 배경 (한지색) */
--washi-deep:#EFE6D0; /* 살짝 진한 배경 */
--sumi:#211D19;       /* 기본 텍스트(먹색) */
--indigo:#2B3A55;     /* 제목류 */
--hanko:#B7410E;      /* 강조/포인트(인주색) */
--gold:#B8892F;
--sage:#6E7F5C;
--line: rgba(33,29,25,0.12);
```
폰트: 제목 `'Shippori Mincho', serif` (weight 700~800), 본문 `'Noto Sans KR'`.
새 UI를 만들 때는 반드시 이 변수들을 재사용하고, 기존 `.menu-card`, `.theory-card`, `.ltm-*` 클래스 패턴을 참고할 것.

### 핵심 데이터/상태 레퍼런스
| 이름 | 위치 | 설명 |
|---|---|---|
| `HIRAGANA_LIST` | data.js | 46개 히라가나 `{ch, romaji}` 배열, あ행부터 순서대로 (청음만, 탁음/요음은 별도 테스트 모드) |
| `HS_TABLE_ROWS` | data.js | 오십음도 그리드 렌더링용 행 단위 그룹 (あ행/か행/…) |
| `HIRAGANA_STROKES` | data.js | 글자별 획순 좌표 (쓰기 트레이싱에 사용) |
| `hsStats` / `hwStats` / `hrStats` | logic.js ~5186/5469/7220 | `createHiraganaStatsEngine()`로 만든 3개의 독립 통계 엔진 (카드찾기/쓰기/읽기). `localStorage` 키: `kotobaHsCharStats` / `kotobaHwCharStats` / `kotobaHrCharStats` |
| `getStat(ch)` | 각 엔진 내부 | 글자별 `{correct, wrong, srsStage(0~7), lastReviewAt, timeouts}` 반환 |
| `srsUpdateStat(stat, isCorrect)` | logic.js ~553 | 맞으면 stage+1, 틀리면 stage-2 |
| `srsForgetProbability(stat, now)` | logic.js ~569 | `R = e^(-경과일수/안정도)`, 반환값은 "망각 확률"(1-R) |
| `computeLtmStatus(ch)` | logic.js ~622 | 3채널(카드찾기 가중치1·쓰기 가중치2·읽기 가중치1) 가중평균으로 정착/학습중/복습필요/미학습 등급 산출 |
| `activeSetState` / `ACTIVE_SET_*` 상수 | logic.js ~846-976 | 활성 학습 세트 컨트롤러 (5자→46자 자동 확장, strictness 자동 조정). `localStorage` 키: `kotobaActiveSetState` |
| `reviewSessionActive` 등 | logic.js ~738-844 | 복습 세트(카드찾기·쓰기·읽기 랜덤 순서 진행) |
| `TOP_MENU_EXTRA_ITEMS` | logic.js ~9145 | 초기 메뉴의 "게임 카테고리가 아닌" 카드들(설정/단어카드/영상/장기기억현황/학습이론) 정의부. 새 메뉴 항목 추가 시 여기 + `hideAllMenuPanels()` 배열 + index.html에 패널 `<div class="menu-level" id="menu...Level">` 추가가 세트 |
| `#menuTheoryLevel` (index.html) | index.html 5715줄 부근 | "학습이론" 패널. 새 이론 카드도 `.theory-card` 구조로 여기 계속 추가하면 됨. 현재 11개 카드(1~6번 원래 이론 + 7.청킹 + 8.이중부호화 + 9.메타인지 + 10.처리 수준 + 11.수면 공고화) |
| `HIRAGANA_ROW_GROUPS` | data.js, `HS_TABLE_ROWS` 바로 다음 | 청킹용 파생 데이터. `HIRAGANA_LIST`와 같은 순서로 `{label, name, chars, startIndex, endIndex}` — `endIndex`는 그 행까지 누적 글자 수(슬라이스에 바로 사용 가능) |
| `roundSizeUpToRowBoundary(size)` / `getCurrentRowGroupInfo(size)` | logic.js, `getActiveCharList()` 바로 위 | 청킹 헬퍼. 활성 세트 크기를 행 경계까지 올림하고, 지금 몇 번째 행까지 포함됐는지 반환 |
| `HIRAGANA_MNEMONICS` | data.js, `HIRAGANA_LIST` 바로 다음 | 이중부호화용 46자 전체 `{image(이모지), story(한 줄 이야기)}` 매핑 |
| `renderMnemonicHint` / `toggleMnemonicHint` | logic.js, `showHiraganaWriteQuestion()` 바로 위 | 이중부호화 힌트 렌더/토글. `hwMnemonicVisible` 전역 변수로 표시 상태 관리 |
| `selfJudgments` (stat 필드) / `recordSelfJudgment` | logic.js, `createHiraganaStatsEngine()` 내부 | 메타인지 예측 기록. `getStat(ch).selfJudgments`는 `{predicted:'confident'|'unsure', wasCorrect, ts}` 배열(최근 `SELF_JUDGMENT_LOG_MAX`=30개) |
| `selectHwJudgment` / `computeSelfJudgmentSummary` | logic.js, `showHiraganaWriteQuestion()` 바로 위 / `showLtmDetail()` 바로 위 | 메타인지 마이크로 UI(쓰기 게임에서만) 선택 처리, 그리고 상세보기용 과신/정확도 집계 |
| `HIRAGANA_SAMPLE_WORDS` | data.js, `HIRAGANA_STROKES` 바로 앞 | 처리 수준 이론용 46자 전체 매핑. `{words:[{jp,kr}, ...]}` 또는 단어가 없는 글자(る/を/ん)는 `{words:[], note:'이유 설명'}` |
| `renderHiraganaSampleWordsHtml(ch)` | logic.js, `showLtmDetail()` 바로 위 | `HIRAGANA_SAMPLE_WORDS`를 읽어 상세보기용 단어 칩 HTML(또는 note 문구) 반환. 데이터 없으면 빈 문자열 |
| `calendarDayNumber(ts)` / `daysSinceLastReviewCalendar` | logic.js, `SRS_MS_PER_DAY` 바로 다음 | 수면 의존 공고화용 헬퍼. ms 차이가 아니라 로컬 타임존 자정 경계 기준 날짜 정수/경과일수 계산 |
| `SRS_SAME_DAY_FULL_CREDIT_LIMIT` (=3) | logic.js, 위와 동일 위치 | 하루 안에 이 횟수까지는 정답 시 매번 SRS 단계 상승, 그 이상은 절반 속도로 낮춤 |
| `sameDayCorrectCount` / `lastReviewCalendarDay` (stat 필드) | logic.js, `getStat()` 기본값 | 오늘 날짜의 정답 누적 횟수와 마지막 복습 날짜(자정 경계). 날짜가 바뀌면 자동 리셋 |
| `computeSleepConsolidationNote(ch)` | logic.js, `showLtmDetail()` 바로 위 | 3개 채널 중 오늘 한도를 넘긴 게 있으면 상세보기용 안내 문구 HTML 반환, 없으면 빈 문자열 |
| `HIRAGANA_FONT_VARIANTS` / `pickCharFontVariant(ch)` | logic.js, `showHiraganaSpeedQuestion()` 바로 위 | 부호화 다양성용 폰트 3종(`Shippori Mincho`/`Yuji Syuku`/`Zen Kurenaido`) 배열과, 호출할 때마다 그중 하나를 무작위로 반환하는 헬퍼 |
| `speakTTS(text, opts)`의 `opts.jitter` | logic.js ~1898 | true면 재생 속도/음높이를 매번 ±5% 무작위로 흔듦(부호화 다양성용 음성 변주) |
| `loadLearnerProfile()` / `saveLearnerProfilePatch(patch)` | logic.js, `generateQuiz()` 바로 다음 | Part 2 §1 진단 프로필 저장소. `localStorage` 키: `kotobaLearnerProfile`. 항상 기존 값과 병합 저장(덮어쓰지 않음) |
| `PLACEMENT_AGE_LEVELS` / `startPlacementQuiz()` 등 | logic.js, `saveLearnerProfilePatch()` 바로 다음 | §1-4 사전지식 배치 퀴즈. 기존 연령대 필터 8단계를 이진탐색처럼 오가며 `priorKnowledgeLevel`(0~100) 산출 → `#placementMode` (index.html) |
| `PHONO_MINIMAL_PAIRS` | data.js, `MENU_CATEGORIES` 바로 앞 | §1-1 청지각 변별력 진단용 모라 쌍 10개(`{a, b}`) — 청탁음/조음점/요음-직음/마찰음 대비 혼합 |
| `PHONO_QUESTION_COUNT` / `startPhonoTest()` 등 | logic.js, `applyPlacementResult()` 바로 다음 | §1-1 청지각 변별력 진단(8문항, "같아요/달라요" 2지선다). `pickPhonoSounds()`가 매 문제 같음/다름을 50%로 배정, 결과는 `phonoDiscrimination`(0~1)으로 저장 → `#phonoTestMode` (index.html) |
| `WMS_SHAPES` / `startWmsSpanTest()` 등 | logic.js, `showPhonoResult()` 바로 다음 | §1-2 작업기억 스팬 진단(도형 역순 기억, 3→9). ⚠️ **주의**: 기존 "단어 메모리" 게임이 이미 `wm` 접두사(`wmScore`/`wmSequence` 등, logic.js 상단)를 쓰고 있어 반드시 `wms` 접두사로 구분해야 함 — 새 진단/기능 추가 시 `wm` 단독 접두사는 피할 것. 결과는 `workingMemorySpan`(정수)으로 저장 → `#wmsSpanMode` (index.html) |
| `PAL_SYMBOL_SOUND_PAIRS` | data.js, `PHONO_MINIMAL_PAIRS` 바로 다음 | §1-3 연상학습 속도 진단용 도형-이름 5쌍(`{symbol, name}`, 히라가나와 무관한 추상 도형·무의미 카타카나) |
| `startPalTest()` / `computePalLearningRate()` 등 | logic.js, `showWmsResult()` 바로 다음 | §1-3 연상학습 속도 진단(노출→테스트 5라운드, "정확도 0.8 첫 도달 라운드"로 fast/medium/slow 판정). 결과는 `assocLearningRate`(`'fast'\|'medium'\|'slow'`)로 저장 → `#palTestMode` (index.html) |
| `GAME_STAGE_INFO` / `GAME_STAGE_MAP` | data.js, `MENU_CATEGORIES` 바로 다음 | §2 게임→단계 매핑. 전자는 A~E 5단계 설명(`{label, desc}`), 후자는 실제 게임 모드 34개 전부를 `'A'\|'B'\|'C'\|'D'` 중 하나로 매핑한 정적 데이터(E단계는 특정 모드에 안 묶여 매핑 대상 아님) |
| `getGameStage(mode)` / `getModesForStage(stage)` | logic.js, `TOP_MENU_EXTRA_ITEMS` 바로 다음 | `GAME_STAGE_MAP` 조회 헬퍼 |
| `LEARNER_STAGE_RATIO` / `STAGE_TO_HIRAGANA_MODE` | data.js, `GAME_STAGE_MAP` 바로 다음 | §3 목표 비율표(성향 3분류×A~E)와 단계→히라가나 게임모드 매핑(E는 null) |
| `computeCharGameStage(ch)` / `computeActiveSetStageDistribution()` | logic.js, `getModesForStage()` 바로 다음 | 글자별 A~E 단계 판정과 활성 세트 전체 분포 집계 |
| `classifyLearnerTendency(profile)` | logic.js, 위와 동일 위치 | 진단 4개 필드로 'cautious'/'normal'/'fast' 3분류 판정 |
| `pickNextGameForSession()` | logic.js, 위와 동일 위치 | §3 Phase 1 핵심 함수 — 목표 비율 대비 가장 부족한 단계의 게임을 추천 |
| `renderTodayRecommendation()` / `startRecommendedGame()` | logic.js, 위와 동일 위치 | 추천 결과 UI 렌더 및 "지금 시작하기" 클릭 처리. `#todayRecommendBanner`(index.html) |

### 이미 구현된 이론 (참고용, 재구현 불필요)
1. 에빙하우스 망각곡선 (`srsForgetProbability`)
2. 간격 반복 SRS (`srsUpdateStat`, `SRS_STAGE_DAYS`)
3. 인출 연습 — 재인(카드찾기)·회상(쓰기, 2배 가중치)·발화(읽기) 3중 검증 (`computeLtmStatus`)
4. 바람직한 어려움 — 망각확률 가중 뽑기 (`srsWeightedPick`)
5. 교차 복습 — 복습 세트 (`startReviewSession` 등)
6. 인지부하 관리 — 활성 학습 세트 자동 확장 (`evaluateActiveSetExpansion`)
7. **청킹 — 행 단위 커리큘럼** (`HIRAGANA_ROW_GROUPS`, `roundSizeUpToRowBoundary`) ✅ 구현됨
8. **이중부호화 — 연상 힌트** (`HIRAGANA_MNEMONICS`, `renderMnemonicHint`/`toggleMnemonicHint`) ✅ 구현됨
9. **메타인지 — 자기판단 예측** (`selfJudgments`, `recordSelfJudgment`, `computeSelfJudgmentSummary`) ✅ 구현됨
10. **처리 수준 — 단어 연결** (`HIRAGANA_SAMPLE_WORDS`, `renderHiraganaSampleWordsHtml`) ✅ 구현됨
11. **수면 의존 기억 공고화 — 같은 날 중복 상승 제한** (`calendarDayNumber`, `srsUpdateStat`의 `sameDayCorrectCount` 체크) ✅ 구현됨
12. **부호화 다양성 — 폰트/음성 변주** (`pickCharFontVariant`, `speakTTS`의 `jitter` 옵션) ✅ 구현됨
13. **§3 오케스트레이터 Phase 1 — 오늘의 추천(히라가나 축 한정)** (`computeCharGameStage`, `classifyLearnerTendency`, `pickNextGameForSession`) ✅ 구현됨

---

## 1. 이중부호화 / 정교화 부호화 (Dual Coding, Paivio) ✅ 구현 완료

> **구현 내역 (재구현 세션)**: 이전 세션 기록과 동일한 설계로, 이번 세션에서 다시 구현함.
> - `data.js`: `HIRAGANA_LIST` 바로 다음에 `HIRAGANA_MNEMONICS` 신규 객체 추가 — 46자 전체에
>   `{image(이모지), story(한 줄 이야기, 해요체)}` 매핑. 이미지 에셋 없이 배포 가능하도록 이모지 기반으로
>   시작했고, 추후 SVG 일러스트로 교체할 수 있게 `image`/`story` 필드를 분리해둠.
> - `logic.js`: `renderMnemonicHint(ch)`(힌트 박스 내용 채우기), `toggleMnemonicHint()`(토글),
>   `applyMnemonicHintVisibility()`(표시 상태 반영) 세 함수를 `showHiraganaWriteQuestion()` 바로 앞에 추가.
>   `showHiraganaWriteQuestion()` 안에서 SRS stage를 이미 계산하는 지점 바로 뒤에 힌트를 렌더링하고,
>   **stage 0~1(처음 배우는 글자)은 기본으로 펼쳐두고, stage 2 이상은 접어둔 채 시작**하도록 연결함
>   (버튼으로 언제든 직접 펼치고 접을 수 있음 — 카드 앞면 노출 아님).
> - `index.html`: 쓰기 게임(`hwQuestionScreen`) "🔊 다시 듣기" 버튼 옆에 "💡 연상 힌트" 토글 버튼과
>   `#hwMnemonicHint` 힌트 박스를 추가하고, `.mnemonic-hint` 관련 CSS(디자인 시스템 CSS 변수 재사용)를 추가.
>   "학습이론" 패널에 이중부호화 설명 카드(8번) 신규 추가.

**개념**: 글자를 텍스트 형태로만 저장하지 않고, 시각적 연상 이미지나 짧은 이야기와 함께 저장하면 기억 인출 경로가 하나 더 생겨 더 오래 기억됨.

**현재 갭**: 히라가나 학습 전 과정(카드찾기/쓰기/읽기/트레이싱)이 글자↔발음↔획순만 다루고, 의미적·시각적 연상은 전혀 없음.

**구현 계획**:
- `data.js`에 `HIRAGANA_MNEMONICS` 신규 객체 추가: `{ 'あ': { image: '🦆(오리가 입 벌린 모양)', story: '오리가 "아~" 하고 입을 크게 벌렸어요' }, ... }` (46자 전체, 필요시 탁음/요음도)
  - 연상 문구는 기존 앱 톤(해요체, 아이 친화적)에 맞춰 짧게 작성
  - 시각 자료는 이모지 기반으로 시작(이미지 에셋 추가 없이 배포 가능). 추후 SVG 일러스트로 교체 가능하도록 구조를 `image`(이모지/아이콘)와 `story`(텍스트)로 분리
- `logic.js`: 히라가나 쓰기 게임(`hiraganaWrite` 모드) 문제 화면에 "💡 연상 힌트 보기" 토글 버튼 추가
  - 처음 배우는 글자(활성 세트에 새로 편입된 글자, 즉 SRS stage 0~1)에는 기본으로 노출
  - 이미 익숙한 글자(stage 4+)는 기본 숨김 — 이중부호화는 초기 부호화 단계에서 효과가 크고, 숙달 후에는 굳이 강조할 필요 없음
- UI: 기존 게임 화면 카드 근처에 작은 힌트 박스 (`.mnemonic-hint` 클래스 신규) — 토글 방식으로 아이가 원할 때만 열람
- **연동 지점**: `hiraganaWrite` 렌더 함수(logic.js에서 `renderHiraganaWriteQuestion` 계열 검색), `HIRAGANA_LIST` 순회 부분

**우선순위**: 중 (콘텐츠 작성량이 많음 — 46자×연상문구)
**난이도**: 낮음 (로직보다는 데이터 작성이 대부분)
**주의사항**: 연상 문구가 너무 많으면 오히려 인지 부하를 늘릴 수 있으므로, 카드 앞면이 아니라 "필요할 때만 펼치는" 보조 힌트로 설계할 것.

---

## 2. 처리 수준 이론 (Levels of Processing, Craik & Lockhart) ✅ 구현 완료 (핵심 연동)

> **구현 내역**: `data.js`에는 이미 `HIRAGANA_SAMPLE_WORDS`(46자 전체, `{words:[{jp,kr}, ...]}` 또는
> `る`/`を`/`ん`처럼 단어가 없는 글자는 `{words:[], note:'이유 설명'}`) 데이터가 존재했으나
> `logic.js`/`index.html` 어디에도 연결돼 있지 않아 화면에 전혀 노출되지 않는 상태였음. 이번 세션에서
> 실제 UI 연동을 완료함.
> - `logic.js`: `showLtmDetail()` 바로 위에 `renderHiraganaSampleWordsHtml(ch)` 신규 추가 —
>   `HIRAGANA_SAMPLE_WORDS[ch].words`가 있으면 `.ltm-detail-word-chip`(일본어+뜻) 목록 HTML을,
>   단어가 없고 `note`만 있으면 안내 문구를, 데이터 자체가 없으면 빈 문자열을 반환.
>   `showLtmDetail(ch, status)`의 상세보기 HTML(채널별 정답/오답 행 + 메타인지 요약) 바로 뒤에
>   `sampleWordsHtml`을 이어붙여 "🔤 이 글자로 시작하는 단어" 섹션으로 노출.
> - `index.html`: `.ltm-detail-words`/`.ltm-detail-words-title`/`.ltm-detail-word-list`/
>   `.ltm-detail-word-chip`/`.ltm-detail-words-note` CSS를 기존 디자인 변수
>   (`--washi-deep`, `--sage`, `--indigo`, `--line`) 재사용해 신규 추가.
>   "학습이론" 패널에 처리 수준 이론 설명 카드(10번) 신규 추가, 상단 안내 문구의 이론 개수도
>   "6가지" → "10가지"로 함께 바로잡음(이전 세션들에서 누적 추가되며 안 맞아 있던 부분).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v12` → `koe-app-v13`으로 올림.
> - **미구현으로 남긴 것**: 로드맵에 있던 "신규 미니 모드(`deepEncodingCheck`, 3판에 1번 삽입되는
>   단어 객관식 문제)"와 히라가나 읽기(발화) 결과 화면 연동은 이번 세션에서 구현하지 않음 —
>   기존 게임 플로우(`launchGame`/`switchMode`)를 건드려야 해서 회귀 리스크가 있고, 갭이 가장
>   크면서 리스크가 가장 낮은 "장기기억 상세보기 연동"만 먼저 완료하는 쪽을 택함. 필요하면 다음
>   세션에서 별도로 진행.

**개념**: 의미 있게(깊게) 처리한 정보가 형태만 보고(얕게) 처리한 정보보다 오래 기억됨.

**현재 갭(해소됨)**: 히라가나 자체 학습(카드찾기/쓰기/읽기)은 기호-발음 매칭에 그쳐 '얕은 처리'에 머물러 있었음. `HIRAGANA_SAMPLE_WORDS` 데이터는 이미 준비돼 있었지만 UI에 연결되지 않아 실제로는 갭이 해소되지 않고 있었음 — 이번 세션에서 장기기억 상세보기 연동으로 해소.

**우선순위**: 중 (완료)
**난이도**: 낮음 (데이터는 이미 완성돼 있어 UI 연동만 필요했음)
**주의사항(남은 작업 참고용)**: 향후 미니 모드(`deepEncodingCheck`)를 추가할 경우 기존 게임 플로우(`launchGame`, `switchMode`)를 건드리게 되므로 회귀 테스트 필요.

---

## 3. 부호화 다양성 / 맥락 의존 기억 (Encoding Variability) ✅ 구현 완료

> **구현 내역**:
> - `index.html`: Google Fonts에 `Yuji Syuku`, `Zen Kurenaido` 2종을 `Shippori Mincho`와 함께 추가 로드.
> - `logic.js`: `showHiraganaSpeedQuestion()` 바로 위에 `HIRAGANA_FONT_VARIANTS`(폰트 3종 배열)와
>   `pickCharFontVariant(ch)`(그중 하나를 무작위로 반환) 신규 추가.
>   - 카드찾기 게임의 카드 렌더(`showHiraganaSpeedQuestion()` 안 `cards.forEach`)에서 각 카드 글자에
>     매번 무작위 폰트를 인라인 스타일로 적용(재인 채널).
>   - 읽기(발화) 게임의 목표 글자(`showHiraganaReadQuestion()`의 `#hrTargetChar`)에도 매번 무작위
>     폰트를 적용(제시 채널). 계획에 있던 쓰기 게임은 "제시용 글자"가 텍스트가 아니라
>     `drawHwGuideChar()`로 그리는 획순 트레이싱 캔버스뿐이라 대상에서 자연히 제외됨(계획서의
>     "트레이싱 가이드는 제외" 원칙과 일치).
> - `logic.js`: `speakTTS(text, opts)`에 `opts.jitter` 옵션 추가 — true면 속도/음높이를 매번 ±5%
>   무작위로 흔듦. 카드찾기 문제 재생/다시 듣기(`showHiraganaSpeedQuestion`, `hsReplaySound`)와
>   쓰기 게임 문제 재생/다시 듣기(`showHiraganaWriteQuestion`, `hwReplaySound`) 총 4곳에
>   `{jitter: true}`로 연결. 읽기 게임은 음성 인식(듣는 쪽이 아니라 아이가 말하는 쪽)이라 해당 없음.
> - "학습이론" 패널에 부호화 다양성 설명 카드(12번) 신규 추가, 상단 안내 문구 "11가지" → "12가지"로 갱신.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v14` → `koe-app-v15`로 올림.
> - **미구현으로 남긴 것**: 계획에 있던 "카드찾기/쓰기 문제의 시각적 제시 방식(레이아웃) 자체를
>   변주"하는 부분은 손대지 않음 — 폰트/음성 변주만으로도 개념 검증에 충분하다고 판단했고,
>   레이아웃 변주는 회귀 리스크(카드 클릭 판정 등) 대비 효과가 낮아 보류함. 필요하면 다음 세션에서
>   별도 검토.

**개념**: 같은 정보를 매번 동일한 형태/맥락으로만 접하면 그 특정 맥락에 종속된 얕은 기억이 형성됨. 폰트, 목소리, 제시 방식 등을 변주하면 맥락에서 독립된 더 견고한 기억이 만들어짐.

**현재 갭**: 글자 표시 폰트가 고정, 카드찾기/쓰기 문제의 시각적 제시 방식이 매번 동일.

**구현 계획**:
- `index.html` CSS: 히라가나 표시용 폰트 후보 2~3종 추가 (`'Shippori Mincho'` 외에 손글씨 느낌 웹폰트 1종 — Google Fonts에서 한자/가나 지원되는 서체 검토 필요, 예: `Yuji Syuku`, `Zen Kurenaido` 등)
- `logic.js`: 문제 렌더링 시 글자마다 폰트를 랜덤하게(또는 등장 횟수 기반으로 순환) 선택하는 헬퍼 `pickCharFontVariant(ch)` 추가
  - 카드찾기(재인)와 쓰기(회상) 문제의 "제시용 글자"(정답을 직접 쓰게 하는 트레이싱 가이드는 제외 — 획순 학습은 표준 자형 유지해야 함)에 적용
- 발음 재생: 기존 TTS/음성 호출부(음성 합성 API 호출 위치 확인) 목소리 옵션(속도/음높이)을 매번 살짝 변주
- **연동 지점**: 카드찾기 문제 카드 렌더 함수, 쓰기 게임의 "제시 글자" 렌더 부분(단, 손글씨 트레이싱 가이드 캔버스는 자형 정확도가 중요하므로 변주 대상에서 제외)

**우선순위**: 낮음 (완료)
**난이도**: 중 (완료 — 폰트는 Google Fonts CDN 로딩 방식 그대로 재사용, 인라인 스타일로 간단히 적용)
**주의사항**: 히라가나 쓰기 트레이싱 가이드(`HIRAGANA_STROKES` 기반 캔버스)는 절대 폰트 변주 대상에 포함하지 않음 — 획순 정확도가 표준 자형에 의존하므로 구현 시에도 원칙대로 제외함.

---

## 4. 메타인지 / 학습판단 보정 (Metacognition, Judgment of Learning) ✅ 구현 완료

> **구현 내역**:
> - `logic.js`: `createHiraganaStatsEngine()`의 `getStat(ch)` 기본값에 `selfJudgments: []` 필드 추가
>   (구버전 저장 데이터에는 없을 수 있어 방어 코드로 채워줌). `recordSelfJudgment(ch, predicted, wasCorrect)`
>   함수를 엔진에 추가해 반환 객체(`recordCorrect` 옆)에 노출. 글자당 최근 `SELF_JUDGMENT_LOG_MAX`(30)개까지만 보관.
> - 흐름 방해를 최소화하기 위해 **쓰기 게임(회상 검증)에서만** 물어봄: `showHiraganaWriteQuestion()`에서
>   문제가 바뀔 때마다 `hwPredictedJudgment`를 `null`로 리셋. `selectHwJudgment(predicted)` /
>   `updateHwJudgmentButtons()`로 "😎 확실해요 / 🤔 헷갈려요" 두 버튼 중 하나를 선택(또는 선택 안 함, 다시
>   누르면 선택 취소)할 수 있게 함.
> - `hwHandleSuccess()` / `hwTimeExpired()`에서 채점 직후 `hwPredictedJudgment`가 있으면
>   `hwRecordSelfJudgment(ch, predicted, wasCorrect)`(전역 래퍼, `hwRecordMistake`/`hwRecordCorrect` 옆에 위치)를
>   호출해 예측과 실제 결과를 짝지어 저장.
> - `computeSelfJudgmentSummary(ch)`(showLtmDetail 바로 위)가 글자별 `selfJudgments`를 집계해
>   "확실하다고 한 N번 중 M번 틀렸어요 — 과신 주의!" / "헷갈린다고 한 N번 중 실제로 맞힌 비율 X%"를 계산하고,
>   `showLtmDetail()` 상세보기에 "🧠 자기 예측 vs 실제" 행으로 추가(기록이 없으면 아예 표시 안 함).
> - `index.html`: 쓰기 게임 프롬프트 박스 바로 아래에 `.judgment-row`(두 개의 `.judgment-btn`) 추가,
>   `.ltm-detail-judgment` 스타일 추가. "학습이론" 패널에 메타인지 설명 카드(9번) 신규 추가.

**개념**: 답하기 전 스스로 "확실히 안다/헷갈린다"를 예측하게 하고 실제 정답 여부와 비교해주면, 과신을 교정하고 자기주도적 복습 우선순위 판단 능력이 향상됨.

**현재 갭**: 복습 우선순위를 전적으로 시스템(`computeLtmStatus`, 가중 뽑기)이 정함. 아이가 스스로 "이건 헷갈려요"를 표시할 방법이 없고, 자기 예측과 실제 성과를 비교해주는 피드백도 없음.

**구현 계획**:
- 카드찾기/쓰기 문제 화면에 답하기 **전** "😎 확실해요 / 🤔 헷갈려요" 2지선다 마이크로 UI 추가 (선택 안 해도 진행 가능하도록 선택적으로)
- `logic.js`: 글자별 stat 객체에 `selfJudgments: [{predicted: 'confident'|'unsure', wasCorrect: bool, ts}]` 배열 필드 추가 (`getStat()` 기본값에 반영, 기존 저장 데이터엔 없을 수 있으니 방어 코드 필요)
- 장기기억 현황 상세보기(`showLtmDetail`)에 "예측 정확도" 지표 추가: 예) "헷갈린다고 했던 글자 중 실제로 틀린 비율 72%" / "확실하다고 했는데 틀린 글자 3개 — 과신 주의!"
- 과신(확실하다고 했는데 틀림)이 잦은 글자는 활성 세트 확장 판단(`evaluateActiveSetExpansion`)이나 복습 후보 선정(`getReviewCandidateChars`)에서 가중치를 살짝 올리는 것도 고려 가능(선택 사항)
- **연동 지점**: 카드찾기/쓰기 문제 렌더 + 정답 처리 함수(`hsRecordCorrect/Mistake`, `hwRecordCorrect/Mistake` 호출 지점 전후), `showLtmDetail`

**우선순위**: 높음 (교육적 효과가 크고, 기존 통계 구조에 필드 하나만 추가하면 되어 구현 비용 대비 효과가 좋음)
**난이도**: 중
**주의사항**: 마이크로 UI가 문제 풀이 흐름을 방해하지 않도록 "선택 안 함"을 기본 허용하고, 너무 자주 물어보면 피로해지므로 예를 들어 쓰기 게임(회상 검증)에서만 물어보는 것도 고려.

---

## 5. 수면 의존 기억 공고화 (Sleep-Dependent Consolidation) ✅ 구현 완료

> **구현 내역**: 로드맵 원안대로 "달력상 자정을 몇 번 넘겼는지" 기준으로, `srsUpdateStat` 핵심 로직은
> 그대로 둔 채(맞으면 +1, 틀리면 -2) 최소 침습적으로 "같은 날 중복 상승 제한"만 추가함.
> - `logic.js`: `SRS_MS_PER_DAY` 바로 다음에 `calendarDayNumber(ts)`(로컬 타임존 기준 자정 경계로
>   날짜 정수 반환), `daysSinceLastReviewCalendar(lastReviewAt, now)`(달력상 경과 일수), 상수
>   `SRS_SAME_DAY_FULL_CREDIT_LIMIT = 3` 신규 추가.
> - `srsUpdateStat(stat, isCorrect)`: 호출마다 오늘 날짜(`calendarDayNumber`)를 확인해서 날짜가
>   바뀌면 `stat.sameDayCorrectCount`를 0으로 리셋. 정답이면 `sameDayCorrectCount`를 올리고,
>   오늘 이미 3번(`SRS_SAME_DAY_FULL_CREDIT_LIMIT`)까지는 평소처럼 매번 `srsStage +1`, 그 이상은
>   짝수 번째만 올려서(4번째 스킵→5번째 상승→6번째 스킵…) 대략 절반 속도로 낮춤. 오답 시
>   `srsStage -2` 로직은 전혀 건드리지 않음.
> - `createHiraganaStatsEngine()`의 `getStat(ch)` 기본값/마이그레이션에 `sameDayCorrectCount: 0`,
>   `lastReviewCalendarDay: null` 필드 추가(구버전 저장 데이터 방어 코드 포함) — 3개 통계 엔진
>   (카드찾기/쓰기/읽기) 전체가 공유하는 `getStat`이라 자동으로 3곳 다 적용됨.
> - `showLtmDetail()` 바로 위에 `computeSleepConsolidationNote(ch)` 신규 추가 — 카드찾기/쓰기/읽기
>   중 하나라도 오늘 한도를 넘겼으면 "🌙 오늘 이미 여러 번 복습했어요 — 지금부터는 하루 자고
>   다시 만나야 더 오래 기억에 남아요" 안내를 상세보기 맨 아래에 추가(해당 없으면 섹션 생략).
> - `index.html`: `.ltm-detail-sleep` CSS 신규 추가. "학습이론" 패널에 수면 의존 공고화 설명
>   카드(11번) 신규 추가, 상단 안내 문구 "10가지" → "11가지"로 갱신.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v13` → `koe-app-v14`로 올림.
> - 로직은 독립 Node 스크립트로 시뮬레이션해 검증함: 하루 안 1~3번째 정답은 매번 단계 상승,
>   4번째부터는 절반 속도(짝수 번째만 상승), 다음 날 자정이 지나면 카운트가 자동으로 리셋되고
>   다시 정상 속도로 돌아오는 것을 확인함.

**개념**: 같은 경과 시간이라도 그 사이에 수면을 한 번이라도 거친 복습이, 안 자고 반복한 것보다 장기 정착 효과가 큼.

**현재 갭(해소됨)**: SRS 간격 계산(`srsForgetProbability`, `SRS_STAGE_DAYS`)이 순수 경과 시간(ms)만 사용해 "밤을 최소 한 번 넘겼는지"를 전혀 고려하지 않던 문제 — `srsUpdateStat`에 같은 날 중복 상승 제한을 추가해 해소함.

**우선순위**: 낮음~중 (완료)
**난이도**: 중~높음 (완료 — 날짜 경계 계산은 로컬 타임존 기준 `Date.UTC(y,m,d)`로 처리)
**주의사항**: `srsUpdateStat`은 3개 통계 엔진이 공유하는 핵심 함수라 카드찾기/쓰기/읽기 전체에 영향을 줌 — 이번 구현은 기존 `stage+1`/`stage-2`는 그대로 유지한 채 "같은 날 중복 상승 제한"만 추가하는 최소 침습적 방식으로 완료함.

---

## 6. 청킹 (Chunking) — 행(오십음도) 단위 커리큘럼 ✅ 구현 완료

> **구현 내역 (재구현 세션)**: 이전 세션에서 한 차례 구현했다는 기록이 있었으나, 업로드된 파일에는
> 반영되어 있지 않아 이번 세션에서 동일한 설계로 다시 구현함.
> - `data.js`: `HS_TABLE_ROWS`(그리드용, null 포함) 바로 다음에 `HIRAGANA_ROW_GROUPS`를 새로 추가.
>   null을 제거한 뒤 `HIRAGANA_LIST`와 같은 순서로 각 행의 `{label, name(예: 'あ행'), chars, startIndex, endIndex}`를
>   누적 계산해둠. (あ~ん 11개 행, 합계 46자로 검증 완료)
> - `logic.js`: `getActiveCharList()` 바로 앞에 `roundSizeUpToRowBoundary(size)`(다음 행 경계까지 올림)와
>   `getCurrentRowGroupInfo(size)`(지금 몇 번째 행까지 포함됐는지 반환) 두 헬퍼를 추가. `activeSetState.size`
>   자체는 계속 "글자 개수"로 증감하지만, `getActiveCharList()`는 이 값을 행 경계까지 올림한 크기로 슬라이스하도록 수정.
> - `evaluateActiveSetExpansion()`의 확장 로그 메시지도 (올림 전이 아니라) 올림된 크기 기준으로 표시하고,
>   완료된 행 이름을 함께 적어줌 (예: "활성 글자 5자 → 10자로 확장 (か행 완료)"). 올림 후 크기가 그대로면
>   "다음 행까지 조금 더 가까워졌어요" 메시지로 대체.
> - `renderActiveSetPanel()`에 `#ltmActiveSetRange` 표시(예: "か행까지 학습 중이에요")를 추가하고, 카운트/바
>   너비도 올림된 크기 기준으로 계산하도록 수정.
> - `index.html`: `#ltmActiveSetRange` 엘리먼트와 `.ltm-activeset-range` CSS 추가. "학습이론" 패널에
>   청킹 설명 카드(7번) 신규 추가.
> - 기존에 저장된 `kotobaActiveSetState`(size가 행 경계와 안 맞을 수 있음)는 강제 초기화 없이, 다음 조회 시
>   자동으로 다음 행 경계까지 올림 처리되어 자연스럽게 흡수됨(설계대로 동작).

**개념**: 오십음도를 あ행/か행/… 같은 의미 있는 그룹으로 묶어 순차적으로 학습하면 작업기억 부담이 줄고 학습이 더 체계적으로 느껴짐.

**현재 갭**: 활성 학습 세트 컨트롤러(`getActiveCharList`)가 `HIRAGANA_LIST.slice(0, size)`로 **글자 개수**만 늘림. 예를 들어 활성 크기가 7이면 あ행(5자) + か행의 앞 2자(か,き)만 포함되는 식으로 행 경계와 무관하게 잘림.

**구현 계획**:
- `data.js`의 `HS_TABLE_ROWS`(이미 행 단위로 그룹화된 데이터)를 재사용해 `HIRAGANA_ROW_GROUPS`로 별도 export하거나 그대로 참조
- `logic.js`의 `getActiveCharList()`를 수정: 현재는 "글자 수" 기준 슬라이스이지만, **행 단위로 올림(ceil)** 처리하도록 변경
  - 예: `activeSetState.size`가 7이면 → あ행(5) + か행 전체(5) = 10자까지 활성화 (딱 맞는 행 경계까지 확장), 또는 반대로 "요청된 size를 포함하는 가장 작은 완전한 행 묶음"으로 반올림
  - `evaluateActiveSetExpansion()`의 `increment` 계산도 "글자 수"가 아니라 "다음 행 전체"를 늘리는 방식으로 조정 (증가폭이 이미 2~5자라 대략 한 행 크기(5자)와 비슷하므로 큰 변경 없이 반올림 로직만 추가하면 됨)
- UI: 장기기억 현황판의 "🎯 지금 배우는 글자" 카드(`renderActiveSetPanel`)에 행 이름(あ행/か행 등)을 함께 표시 — 예: "あ행 → か행 학습 중"
- **연동 지점**: `getActiveCharList()` (logic.js ~890), `evaluateActiveSetExpansion()`의 `increment` 계산부, `renderActiveSetPanel()` (logic.js ~979)

**우선순위**: 높음 (기존 구조 변경이 가장 적고, `HS_TABLE_ROWS` 데이터가 이미 존재해 재사용만 하면 됨)
**난이도**: 낮음~중
**주의사항**: 기존에 이미 활성 세트를 진행 중인 사용자(localStorage에 `kotobaActiveSetState` 저장됨)의 `size` 값이 행 경계와 안 맞을 수 있으므로, 마이그레이션 시 "현재 size를 포함하는 행까지 올림" 처리로 자연스럽게 흡수되게 할 것 (강제 초기화 불필요).

---

## 권장 구현 순서

1. ~~**6. 청킹**~~ ✅ 구현 완료 — 리스크 가장 낮고 기존 데이터 재사용 가능, 활성 세트 UX를 바로 개선
2. ~~**4. 메타인지/학습판단**~~ ✅ 구현 완료 — 교육 효과 대비 구현 비용이 좋음, 통계 구조에 필드 추가만 필요
3. ~~**1. 이중부호화**~~ ✅ 구현 완료 — 데이터 작성 위주라 로직 리스크 낮음 (46자 연상 문구 작성 필요)
4. ~~**2. 처리 수준 이론**~~ ✅ 구현 완료 — 데이터는 이미 있었고 UI 연동만 진행 (미니 퀴즈 모드는 보류)
5. ~~**5. 수면 의존 공고화**~~ ✅ 구현 완료 — `srsUpdateStat` 핵심 로직(stage+1/-2)은 유지한 채 같은 날 중복 상승 제한만 최소 침습적으로 추가
6. ~~**3. 부호화 다양성**~~ ✅ 구현 완료 — 카드찾기/읽기 폰트 무작위 변주 + 카드찾기/쓰기 발음 속도·음높이 지터

**→ 로드맵에 있던 6개 이론 모두 구현 완료.** 추후 세션은 각 섹션의 "미구현으로 남긴 것" 항목(예: 처리 수준 이론의 `deepEncodingCheck` 미니 모드, 부호화 다양성의 레이아웃 변주)을 참고해 확장하거나, 새로운 이론을 추가하는 방향으로 진행할 것.

---

# Part 2. 진단 기반 개인별 커리큘럼 오케스트레이션 (신규 과제 — 설계 단계)

> 6개 학습이론은 모두 "한 글자/한 단어를 얼마나 오래 기억하게 만들 것인가"에 대한 답이었다.
> 이 파트는 그 다음 질문 — **"이 학습자에게 지금 어떤 게임을, 얼마나, 어떤 순서로 줄 것인가"** —
> 에 대한 설계다. 아직 코드는 하나도 없고, 순수 기획 문서다. 실제 구현에 들어가는 세션은
> 이 문서를 갱신하며 작업할 것(기존 문서 규칙과 동일).

## 0. 먼저 짚어야 할 것 — 이 앱이 이미 가진 게임 자산

`data.js`의 `MENU_CATEGORIES`에 이미 9개 카테고리, 30개 게임 모드가 있다. 정리하면:

| 카테고리 | 인지적 성격 | 게임 모드 |
|---|---|---|
| 이야기·노래 감상 | 수동적 다중 노출(부호화 준비) | storybook, emojiStorybook, ebook, karaoke, songs |
| 듣기 전용 학습 | 저부담 반복 노출 | pronounce, exposure, scene |
| 객관식 퀴즈 | 재인(recognition) 인출 연습 | quiz, audioEmoji, riddle, qa, shop, lifeqa, hiraganaSpeed, adjective |
| 카드 매칭·기억력 | 재인 + 시각 작업기억 | matching, linematch, wordMemory, eawase, silhouette, kanjiCards |
| 소리·철자 맞추기 | 재인→회상 중간 단계 | spelling, onomatopoeia |
| 손글씨 쓰기 연습 | 회상(recall) 인출 연습, 깊은 처리 | writing, hiraganaWrite, trace, worksheet, dakuonTest |
| 문장·단어 조합 | 생성/전이(구성) | sentence, compound |
| 탐색 퍼즐 | 전이·응용 탐색 | wordsearch |
| 말하기(음성 인식) | 발화(production) 인출 연습, 가장 엄격한 검증 | speech, hiraganaRead |

**핵심 갭**: 지금은 이 30개 게임을 어떤 순서·비율로 배합할지가 전적으로 "사용자가 메뉴에서 직접 고르는 것"에 맡겨져 있다. 히라가나 학습(hs/hw/hr)만 SRS·활성세트·복습세트로 자동화돼 있고, 나머지 게임들은 개인화된 배합 로직이 전혀 없다. 그리고 애초에 "이 학습자가 어떤 유형인지"를 앱이 전혀 모른다 — 모든 사용자가 동일한 기본값으로 시작한다.

---

## 1. 진단 모듈 (Diagnostic Placement) — "이 학습자는 어떤 사람인가"

**개념**: 본격적인 학습을 시작하기 전에, 짧은 미니게임 몇 개로 학습자의 기초 인지 프로파일을 측정해서 이후 커리큘럼 배합의 입력값으로 쓴다.

**측정할 것 4가지 + 참고용 1가지**:

1. **청지각 변별력 (Phonological Discrimination)** ✅ 구현 완료 — 비슷한 소리(예: つ/す, ざ/じゃ 같은 미니멀 페어)를 듣고 같은지 다른지 구별하는 초단문 테스트.

> **구현 내역**: 계획대로 `audioEmoji`류 포맷을 그대로 가져다 쓰지는 않고, `placement`(사전지식
> 배치 퀴즈)와 같은 "인트로 → 문제 → 결과" 3단계 구조·클래스를 재사용하되 4지선다 대신
> "같아요/달라요" 2지선다로 바꾼 신규 화면으로 구현함.
> - `data.js`: `MENU_CATEGORIES` 바로 앞에 `PHONO_MINIMAL_PAIRS` 신규 배열 추가 — 청음/탁음 대비
>   (か/が, た/だ, は/ば), 조음점이 가까운 쌍(し/ひ, ら/な, り/に), 요음-직음 대비
>   (つ/ちゅ, す/しゅ, ざ/じゃ), 마찰음 대비(つ/す)까지 섞은 모라 쌍 10개(`{a, b}`).
> - `logic.js`: `applyPlacementResult()` 바로 다음에 청지각 진단 로직 신규 추가.
>   `PHONO_QUESTION_COUNT`(=8), `PHONO_REPLAY_GAP_MS`(=900, 두 소리 사이 간격) 상수와
>   `initPhonoTest()`/`startPhonoTest()`/`pickPhonoSounds(pair, isSame)`/
>   `generatePhonoQuestion()`/`playPhonoPair()`/`selectPhonoAnswer(guessedSame, btn)`/
>   `showPhonoResult()` 함수 신규 추가. 매 문제 `PHONO_MINIMAL_PAIRS`에서 쌍을 하나 뽑고
>   50% 확률로 "같은 소리 두 번" 또는 "a·b를 순서 섞어" 재생(`speakTTS` 재사용, 두 소리
>   사이 900ms 간격). 재생할 소리는 `phonoCurrentSounds` 전역 변수에만 담아 `data.js`의
>   원본 쌍 객체는 건드리지 않도록 함(공유 데이터 오염 방지). 8문제 종료 후 정확도
>   (0.0~1.0)를 `saveLearnerProfilePatch({ phonoDiscrimination })`로 저장.
> - `index.html`: `placementMode` 바로 다음에 `#phonoTestMode`(`#phonoIntroScreen`/
>   `#phonoQuestionScreen`/`#phonoResultScreen`) 신규 추가 — `placementMode`와 동일한
>   `.quiz-container`/`.hs-start-desc`/`.quiz-audio-btn`/`.quiz-options`/`.quiz-btn`/
>   `.hs-result-title` 클래스를 그대로 재사용해 새 CSS 없이 배포. 다만 선택지는 정적
>   2버튼("같아요"/"달라요")이라 문제마다 다시 그리지 않고, `generatePhonoQuestion()`이
>   버튼의 `correct`/`wrong` 클래스만 매번 초기화함.
> - `logic.js`: `switchMode()`에 `phonoTest` 분기 추가(placement 분기와 동일 패턴),
>   `TOP_MENU_EXTRA_ITEMS`에 "👂 소리 구별 진단" 카드 추가(`launchGame('phonoTest')`).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v16` → `koe-app-v17`로 올림.
> - **미구현으로 남긴 것**: placement와 마찬가지로 전용 "학습이론" 패널 카드는 추가하지
>   않음(§1-4와 동일한 판단 — 장기기억 이론이 아니라 Part 2 진단용). 결과 화면에 "어떤
>   쌍을 특히 헷갈렸는지"까지는 아직 세분화해 보여주지 않음 — 지금은 전체 정확도만 집계.
>   필요하면 다음 세션에서 쌍별 오답 집계를 추가할 수 있음.
2. **작업기억 스팬 (Working Memory Span)** ✅ 구현 완료 — 도형을 순서대로 보여준 뒤 역순으로 기억해내는 스팬 테스트(3개→4개→5개…로 늘려가며 실패 지점 측정).

> **구현 내역**: 계획대로 신규 미니게임 UI를 새로 만듦. 숫자 대신 색깔 도형 이모지 9종을
> 사용(히라가나/일본어 지식과 무관하게 순수 작업기억만 측정하기 위함).
> - `logic.js`: `showPhonoResult()` 바로 다음에 로직 신규 추가. 상수 `WMS_SHAPES`(도형 9개),
>   `WMS_START_SPAN`(=3), `WMS_MAX_SPAN`(=9), `WMS_SHOW_INTERVAL_MS`(=900), `WMS_GAP_MS`(=350)와
>   `initWmsSpanTest()`/`startWmsSpanTest()`/`runWmsRound()`/`playWmsSequence(index)`/
>   `showWmsAnswerScreen()`/`pickWmsShape(shape, btn)`/`checkWmsAnswer()`/`showWmsResult()`
>   함수 신규 추가. 3개 스팬부터 시작해 도형을 하나씩(공백 포함) 순서대로 보여준 뒤, 섞인
>   버튼 중에서 **거꾸로(마지막 본 것부터)** 순서로 고르게 함. 레벨당 1회 시행만 보는 간이
>   버전(정식 심리검사는 레벨당 2회 평균)이며, 맞히면 스팬 +1, 틀리면 즉시 종료해 "실패
>   직전 스팬"을 `workingMemorySpan`(정수)으로 저장. 최대 스팬(9)까지 전부 성공하면 9로
>   고정. **함수/변수명은 전부 `wms` 접두사(예: `wmsSequence`)를 사용** — 기존 "단어 메모리"
>   게임이 이미 `wm` 접두사(`wmScore`, `wmSequence` 등)를 쓰고 있어 충돌을 피하기 위함
>   (다음 세션도 `wm` 단독 접두사는 피할 것).
> - `index.html`: `phonoTestMode` 바로 다음에 `#wmsSpanMode`
>   (`#wmsIntroScreen`/`#wmsShowScreen`/`#wmsAnswerScreen`/`#wmsResultScreen`) 신규 추가.
>   선택지 개수가 3~9개로 가변적이라 기존 `.quiz-options`(2열 고정) 대신 `.wms-options-grid`
>   (3열) CSS를 새로 추가했고, 도형 버튼(`.wms-shape-btn`)과 선택 순서를 보여주는 칩 행
>   (`.wms-picked-row`/`.wms-picked-chip`)도 신규 추가 — 색상은 전부 디자인 시스템 변수 재사용.
> - `logic.js`: `switchMode()`에 `wmsSpan` 분기 추가, `TOP_MENU_EXTRA_ITEMS`에
>   "🧩 기억 스팬 진단" 카드 추가(`launchGame('wmsSpan')`).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v17` → `koe-app-v18`로 올림.
> - **미구현으로 남긴 것**: placement/phonoTest와 동일하게 전용 "학습이론" 패널 카드는
>   추가하지 않음. 레벨당 2회 시행 평균을 내는 정식 심리검사 방식은 시간이 오래 걸려
>   보류(현재는 레벨당 1회 시행). 결과에 따라 §3 오케스트레이터가 실제로 활성 세트 확장
>   속도를 조정하는 로직은 아직 연결되지 않음 — §3 Phase 1 구현 시 처리할 것.
3. **연상학습 속도 (Paired-Associate Learning Rate)** ✅ 구현 완료 — 완전히 새로운 기호-소리 쌍(히라가나가 아닌 무의미 도형 5~6개 사용, 기존 지식 편향 배제)을 5회 반복 노출-테스트하며 정확도가 몇 번 만에 오르는지 기울기를 측정. "빠른 습득자 / 보통 / 신중한 학습자" 3단계로 분류.

> **구현 내역**: 계획대로 히라가나가 아닌 추상 도형과 무의미 카타카나 이름을 짝지어
> "노출 → 테스트"를 5라운드 반복하는 신규 미니게임 UI로 구현함.
> - `data.js`: `PHONO_MINIMAL_PAIRS` 바로 다음에 `PAL_SYMBOL_SOUND_PAIRS` 신규 배열 추가 —
>   추상 도형 5개(◆▲●■★)와 실제 뜻이 없는 카타카나 이름(タポ/ケニ/ヌソ/ミヘ/ロズ)을
>   1:1로 짝지은 `{symbol, name}` 5쌍(기존 어휘력의 영향을 배제하기 위해 히라가나 학습
>   콘텐츠와 다른 문자·기호를 사용).
> - `logic.js`: `showWmsResult()` 바로 다음에 로직 신규 추가. 상수 `PAL_ROUNDS`(=5),
>   `PAL_EXPOSURE_SHOW_MS`(=1100), `PAL_EXPOSURE_GAP_MS`(=300), `PAL_ACCURACY_TARGET`(=0.8)와
>   `initPalTest()`/`startPalTest()`/`runPalRound()`/`playPalExposureSequence(index)`/
>   `startPalTestPhase()`/`showPalTestQuestion()`/`selectPalAnswer()`/`finishPalRound()`/
>   `computePalLearningRate(accuracies)`/`showPalResult()` 함수 신규 추가.
>   매 라운드 "전체 5쌍을 도형+TTS 이름으로 순서대로 노출 → 순서를 섞어 도형만 보여주고
>   5지선다로 이름 맞히기(오답 시 정답 하이라이트로 교정 피드백)"를 진행하고, 라운드별
>   정확도(정답수/5)를 기록. 5라운드 종료 후 정확도가 `PAL_ACCURACY_TARGET`(0.8, 즉 4/5)에
>   **처음 도달한 라운드**를 기준으로 1~2라운드째면 `fast`, 3~4라운드째면 `medium`, 끝까지
>   못 미치면 `slow`로 판정해 `saveLearnerProfilePatch({ assocLearningRate })`로 저장.
>   독립 Node 스크립트로 판정 경계값(1/2/3/4라운드 도달, 미도달 5개 케이스)을 시뮬레이션해 검증함.
> - `index.html`: `wmsSpanMode` 바로 다음에 `#palTestMode`(`#palIntroScreen`/`#palExposureScreen`/
>   `#palTestScreen`/`#palResultScreen`) 신규 추가 — `wmsSpanMode`/`quizMode`와 동일한
>   `.quiz-container`/`.hs-start-desc`/`.quiz-audio-btn`/`.quiz-score-board`/`.quiz-emoji`/
>   `.quiz-options`/`.quiz-btn`/`.hs-result-title`/`.hs-result-row` 클래스를 전부 재사용해
>   새 CSS 없이 배포(선택지 5개는 기존 2열 그리드에 2·2·1로 자연스럽게 배치됨).
> - `logic.js`: `switchMode()`에 `palTest` 분기 추가(`wmsSpan`과 동일 패턴),
>   `TOP_MENU_EXTRA_ITEMS`에 "🔗 새 짝 암기 속도 진단" 카드 추가(`launchGame('palTest')`).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v18` → `koe-app-v19`로 올림.
> - **미구현으로 남긴 것**: placement/phonoTest/wmsSpan과 동일하게 전용 "학습이론" 패널
>   카드는 추가하지 않음(장기기억 이론이 아니라 Part 2 진단용 판단 유지). 결과 판정 로직
>   (`assocLearningRate`)을 실제로 §3 오케스트레이터(노출 단계 비중 조정 등)에 연결하는
>   작업은 아직 하지 않음 — §3 Phase 1 구현 시 처리할 것. 이로써 §1 진단 모듈 4가지
>   (청지각 변별력/작업기억 스팬/연상학습 속도/사전지식 배치 퀴즈)가 모두 구현 완료됨.
4. **사전지식 배치 퀴즈 (Adaptive Placement Quiz)** ✅ 구현 완료 — 기존 `quiz` 모드를 적응형으로 재사용: 맞히면 다음 문제 난이도↑, 틀리면 ↓ (IRT 흉내낸 간이 로직). 최종 수렴 난이도가 곧 시작 레벨.

> **구현 내역**: 계획대로 신규 문제 데이터를 만들지 않고, 기존 연령대 필터 8단계
> (`ageLevelSelect`의 6/9/12/18/24/30/36/42개월, `changeAppLevel`)와 `DICTIONARY`의 `level`
> 필드를 그대로 재사용해 적응형 배치 퀴즈를 구현함.
> - `logic.js` (`generateQuiz()` 정의 바로 다음): `LEARNER_PROFILE_KEY`(`kotobaLearnerProfile`)로
>   `localStorage`에 저장/병합하는 `loadLearnerProfile()`/`saveLearnerProfilePatch(patch)` 신규
>   추가 — §1의 4개 진단 필드를 한 번에 다 채우지 않고 앞으로 세션마다 하나씩 patch로
>   채워나갈 수 있도록 **항상 병합 저장**(덮어쓰지 않음)하는 방식으로 설계함.
> - `logic.js`: `PLACEMENT_AGE_LEVELS`(=`[6,9,12,18,24,30,36,42]`, 기존 연령대 버튼과 동일),
>   `PLACEMENT_QUESTION_COUNT`(=6), `PLACEMENT_START_INDEX`(=3, 18개월) 상수와
>   `initPlacementQuiz()`/`startPlacementQuiz()`/`generatePlacementQuestion()`/
>   `selectPlacementAnswer()`/`showPlacementResult()`/`applyPlacementResult()` 함수 신규 추가.
>   맞히면 단계 인덱스를 `+step`, 틀리면 `-step` 이동시키고, 매 문제마다 `step`을
>   `Math.ceil(step/2)`로 반씩 줄여 이진탐색처럼 정답 근처로 수렴시킴(2→1→1…).
>   총 6문제 종료 후 최종 인덱스를 0~100 스케일(`priorKnowledgeLevel`)로 환산해
>   `saveLearnerProfilePatch()`로 저장.
> - 출제 단어는 후보 단계와 정확히 일치하는 `DICTIONARY` 항목 중에서 고르되(없으면 그 이하로
>   폴백), 오답 선택지 4개는 항상 채워야 하므로 연령대 필터와 무관하게 `DICTIONARY` 전체에서 뽑음.
> - UI는 기존 `quizMode`(발음 듣고 4지선다, `.quiz-container`/`.quiz-emoji`/`.quiz-options`/
>   `.quiz-btn`/`.hs-result-title` 등 기존 클래스 전부 재사용)와 거의 동일한 새 화면
>   `#placementMode`(`#placementIntroScreen`/`#placementQuestionScreen`/`#placementResultScreen`)를
>   `index.html`에 신규 추가 — 새 CSS 없이 배포. 결과 화면의 "✅ 이 레벨로 시작하기" 버튼은
>   `applyPlacementResult()`가 기존 `changeAppLevel()`을 호출해 진단 결과를 실제로 바로 적용함.
> - `TOP_MENU_EXTRA_ITEMS`(logic.js) 맨 앞에 "🎯 시작 진단" 항목 추가(`launchGame('placement')`),
>   `switchMode()`에 `placement` 분기 추가(최근 추가된 `kanjiCards`/`adjective`와 같은 패턴으로
>   레거시 `tab-btn` 인덱스는 사용하지 않음).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v15` → `koe-app-v16`으로 올림.
> - **미구현으로 남긴 것**: 진단 자체를 위한 전용 "학습이론" 패널 카드는 추가하지 않음 — 이 기능은
>   장기기억 이론이 아니라 Part 2 오케스트레이션 소개용이라, 필요하면 별도 "진단/오케스트레이션"
>   안내 패널을 신설할 때 함께 정리하는 것을 권장. 나머지 진단 3종(청지각 변별력/작업기억
>   스팬/연상학습 속도)과 참고용 선호 채널 자기보고는 이번 세션에서 다루지 않음.
5. *(참고용, 배정 근거로는 사용 안 함)* **선호 채널 자기보고** — "듣기/보기/쓰기/말하기 중 뭐가 제일 편해요?" 같은 간단한 설문. ⚠️ **주의**: "시각형/청각형/운동형 학습자" 같은 학습 스타일 매칭 이론은 실제 학습효과 개선을 뒷받침하는 실증 근거가 약하다는 것이 여러 메타분석(Pashler et al., 2008 등)에서 지적된 바 있다. 그래서 이 응답은 **동기부여용 참고 지표로만** 쓰고, 실제 게임 배합 결정은 반드시 1~4번의 **행동 성과 데이터**로 내린다 — "이 아이가 시각형이라고 답했으니 카드게임 위주로"가 아니라 "실제로 카드게임에서 성과가 좋으니 비중을 조금 더"가 원칙.

**데이터 구조 제안** (`logic.js` 신규, `localStorage` 키 `kotobaLearnerProfile`):
```js
{
  phonoDiscrimination: 0.0~1.0,      // 변별 정확도
  workingMemorySpan: 3~9,             // 실패 직전 스팬 길이
  assocLearningRate: 'fast'|'medium'|'slow',
  priorKnowledgeLevel: 0~100,          // 배치 퀴즈 수렴 점수
  channelSelfReport: {...},           // 참고용, 의사결정에는 미사용
  diagnosedAt: timestamp,
  lastRecalibratedAt: timestamp        // 실제 성과 데이터로 주기적 재보정(아래 3장 참고)
}
```

**우선순위**: 중 (커리큘럼 오케스트레이션 전체의 입력값이라 선행되어야 하지만, 진단 자체는 규모가 작음)
**난이도**: 중 (작업기억 스팬 테스트와 연상학습 속도 테스트는 신규 미니게임 UI 필요, 나머지 2개는 기존 포맷 재사용)
**주의사항**: 진단이 너무 길면 그 자체로 이탈 요인이 된다 — 전체 5분 이내, 각 항목 1분 내외로 설계할 것. 그리고 진단은 "1회성 확정"이 아니라 §3의 재보정 루프로 계속 갱신되는 **살아있는 프로필**로 설계할 것(첫 진단이 부정확해도 실제 사용 데이터가 이를 교정함).

---

## 2. 게임 유형 → 학습 단계 매핑 (오케스트레이션의 뼈대) ✅ 데이터 정의 완료 (판정 로직은 미구현)

> **구현 내역**: 계획에 있던 "표 자체를 데이터로 옮기는 작업"만 이번 세션에서 완료함 —
> 실제 성과 데이터로 "이 항목이 지금 몇 단계인지"를 판정하는 로직(§3의 일부)은 이번
> 세션 범위가 아니라서 손대지 않음. 우선순위 노트("이 매핑 자체가 오케스트레이터의
> 전제 조건")대로, 회귀 리스크 없는 정적 데이터 정의부터 먼저 완료하는 쪽을 택함.
> - `data.js`: `MENU_CATEGORIES` 바로 다음에 `GAME_STAGE_INFO`(A~E 5단계 각각의
>   `{label, desc}` 설명)와 `GAME_STAGE_MAP`(게임 모드 문자열 → `'A'|'B'|'C'|'D'` 1글자)
>   신규 추가. `MENU_CATEGORIES`에 실제로 존재하는 게임 모드 34개 전부를 아래 표 그대로
>   매핑함(독립 Node 스크립트로 `MENU_CATEGORIES`의 전체 모드 목록과 `GAME_STAGE_MAP`의
>   키 목록을 서로 대조해 34개 전부 빠짐없이 매핑됐고 오타·불일치가 없음을 검증함).
>   - A(최초 노출): `storybook`/`emojiStorybook`/`ebook`/`karaoke`/`songs`(이야기·노래 감상) +
>     `pronounce`/`exposure`/`scene`(듣기 전용 학습)
>   - B(재인 연습): `quiz`/`audioEmoji`/`riddle`/`qa`/`shop`/`lifeqa`/`hiraganaSpeed`/`adjective`
>     (객관식 퀴즈) + `matching`/`linematch`/`wordMemory`/`eawase`/`silhouette`/`kanjiCards`
>     (카드 매칭·기억력)
>   - C(회상 연습): `spelling`/`onomatopoeia`(소리·철자 맞추기) +
>     `writing`/`hiraganaWrite`/`trace`/`worksheet`/`dakuonTest`(손글씨 쓰기 연습)
>   - D(발화·전이): `speech`/`hiraganaRead`(말하기·음성 인식) + `sentence`/`compound`
>     (문장·단어 조합) + `wordsearch`(탐색 퍼즐)
>   - E(유지·재맥락화)는 `GAME_STAGE_MAP`에 없음 — 특정 게임 모드에 고정되지 않고 기존
>     복습 세트(`startReviewSession`)나 A단계 콘텐츠(이야기·노래) 재감상으로 이뤄지기
>     때문에, 이 표에서는 `GAME_STAGE_INFO.E.desc`에 설명만 남겨두고 매핑 대상에서 제외함.
> - `logic.js`: `TOP_MENU_EXTRA_ITEMS` 배열 바로 다음(`hideAllMenuPanels()` 바로 위)에
>   `getGameStage(mode)`(모드 → 단계 문자 조회, 매핑 없으면 `null`)와
>   `getModesForStage(stage)`(단계 → 해당 모드 배열 조회) 헬퍼 함수 신규 추가 — 아직 이
>   함수들을 실제로 호출하는 곳은 없음(§3 오케스트레이터가 만들어질 때 사용할 유틸리티로
>   미리 준비만 해둔 상태).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v19` → `koe-app-v20`으로 올림.
> - **미구현으로 남긴 것**: "항목별 단계 이동 규칙"(각 게임 카테고리별 정답/오답을 채널로
>   기록해 다음 단계 진입 기준을 판단하는 실제 로직)은 이번 세션에서 구현하지 않음 —
>   이건 §2 자체보다는 §3 오케스트레이터의 "판정 기준" 부분과 사실상 같은 작업이라,
>   §3 Phase 1을 시작할 때 `getGameStage`/`getModesForStage`와 함께 이어서 설계하는 것을 권장.

**개념**: 이미 구현된 "재인(카드찾기)·회상(쓰기)·발화(읽기) 3중 검증" 모델(로드맵 이론 3번)을 히라가나 밖의 30개 게임 전체로 확장한다. 모든 항목(단어/글자/문형)은 아래 5단계 파이프라인을 순서대로 통과한다.

| 단계 | 목적 | 관련 이론 | 해당 게임 카테고리 |
|---|---|---|---|
| A. 최초 노출 | 낮은 부담으로 형태·소리·의미를 처음 만남 | 이중부호화, 부호화 다양성 | 이야기·노래 감상, 듣기 전용 학습 |
| B. 재인 연습 | "보면 안다" 수준 형성 | 인출 연습(재인), 바람직한 어려움 | 객관식 퀴즈, 카드 매칭·기억력 |
| C. 회상 연습 | "스스로 떠올려 쓴다" 수준 형성 | 인출 연습(회상, 가중치 2배), 처리 수준 | 소리·철자 맞추기, 손글씨 쓰기 연습 |
| D. 발화·전이 | 실제 사용 맥락에서 생성·응용 | 인출 연습(발화), 전이 적합성 부호화 | 말하기(음성 인식), 문장·단어 조합, 탐색 퍼즐 |
| E. 유지·재맥락화 | 이미 아는 것을 새 맥락에서 다시 만나 장기 정착 | 교차 복습, 부호화 다양성, 수면 의존 공고화 | 복습 세트(기존 `startReviewSession`) + 이야기·노래 재감상 |

**항목별 단계 이동 규칙**: 각 항목은 A→B→C→D→E를 순서대로 밟되, 이미 구현된 히라가나 3채널 통계(`hsStats`/`hwStats`/`hrStats`, `computeLtmStatus`)와 같은 방식으로 카테고리별 정답/오답을 채널로 기록해 다음 단계 진입 기준을 판단한다. 즉 **완전히 새 시스템이 아니라 기존 SRS/통계 엔진을 게임 카테고리 축으로 한 번 더 일반화**하는 것.

**우선순위**: 높음 (이 매핑 자체가 오케스트레이터의 전제 조건) — 데이터 정의는 완료, 판정 로직은 §3와 함께 진행
**난이도**: 중 (표 자체는 데이터 정의고 완료됨 — 실제 "판정 기준"을 코드로 짜는 게 난이도의 대부분이며 이 부분이 아직 남음)

---

## 3. 오케스트레이터 로직 — "오늘 세션에 뭘 얼마나 줄까" ✅ Phase 1 구현 완료(히라가나 축 한정)

> **구현 내역**: 계획대로 Phase 1(규칙 기반)만 먼저 구현함. 단, §2에서 30여 개 게임 전체로
> 일반화하는 것은 회귀 리스크가 커서, **이미 3채널(재인·회상·발화) SRS 통계가 갖춰진 히라가나
> 학습 축에만 우선 적용**함 — 다른 게임 카테고리(단어 퀴즈, 문장 조합 등) 일반화는 미구현으로 남김.
> - `data.js`: `GAME_STAGE_MAP` 바로 다음에 `LEARNER_STAGE_RATIO`(신중한 학습자/보통/빠른 습득자
>   3분류별 A~E 목표 비율, roadmap 원안 표 그대로 데이터화)와 `STAGE_TO_HIRAGANA_MODE`(A~D 단계별
>   대표 히라가나 게임 모드 매핑, E는 null — 복습 세트로 대체) 신규 추가.
> - `logic.js`: `getModesForStage()` 바로 다음에 새 블록 추가.
>   - `computeCharGameStage(ch)` — §2에서 미뤄뒀던 "항목별 단계 이동 규칙"의 실제 구현.
>     hsStats/hwStats/hrStats 3채널이 아무것도 시도 안 됐으면 'A', `computeLtmStatus`가 이미
>     '정착'이면 'E', 발화(hr) 단계 이상 진행됐으면 'D', 회상(hw) 단계 이상이면 'C', 그 외
>     시도만 있으면 'B'로 판정.
>   - `computeActiveSetStageDistribution()` — `getActiveCharList()`의 글자들을 위 함수로 집계해
>     A~E 분포를 구함.
>   - `classifyLearnerTendency(profile)` — §1에서 쌓은 진단 4개 필드(`phonoDiscrimination`/
>     `workingMemorySpan`/`assocLearningRate`/`priorKnowledgeLevel`)를 실제로 입력받아
>     'cautious'/'normal'/'fast' 3분류로 판정(청지각 변별력이 낮거나 작업기억이 낮으면 신중한
>     학습자 쪽으로, 연상학습이 빠르거나 사전지식이 높으면 빠른 습득자 쪽으로).
>   - `pickNextGameForSession()` — 목표 비율(`LEARNER_STAGE_RATIO[tendency]`)과 실제 분포를
>     비교해 가장 부족한 단계를 찾고, `STAGE_TO_HIRAGANA_MODE`로 게임 모드를 추천(E단계가
>     가장 부족하면 특정 게임 대신 기존 `startReviewSession()`을 추천).
>   - `renderTodayRecommendation()` / `startRecommendedGame()` — 추천 결과를 UI에 반영하고
>     "지금 시작하기" 클릭 시 해당 게임(또는 복습 세트)로 바로 이동. `showTopMenu()`와 앱 초기화
>     시점(`initAppLevelUI`)에서 호출해 최신 통계를 반영하도록 연결.
> - `index.html`: 상위 메뉴(`#menuTopLevel`) 상단에 `#todayRecommendBanner`(`.today-recommend-card`)
>   신규 추가, 기존 디자인 변수(`--washi-deep`, `--indigo`, `--hanko`, `--line`) 재사용. "학습이론"
>   패널에 오케스트레이터 설명 카드(13번) 신규 추가, 상단 안내 문구 "12가지" → "13가지"로 갱신.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v20` → `koe-app-v21`로 올림.
> - **미구현으로 남긴 것**:
>   - 30여 개 비-히라가나 게임 카테고리(단어 퀴즈/문장 조합 등)로 §2 단계 판정을 일반화하는 것
>     — 각 게임마다 per-item 통계 엔진이 따로 없어 별도 설계가 필요한 큰 과제라 이번 세션 범위 밖으로 둠.
>   - `workingMemorySpan`에 따라 `evaluateActiveSetExpansion()`의 확장 속도 자체를 조절하는 것
>     (계획엔 있었으나, 기존 확장 로직의 strictness 체계와 이중으로 얽히면 회귀 리스크가 있어
>     보류 — 다음 세션에서 별도로 검토).
>   - Phase 2(성과 기반 재보정)/Phase 3(주간 커리큘럼) — 계획대로 Phase 1이 실제로 며칠 굴러가며
>     데이터가 쌓인 뒤 재검토.
>   - A단계 추천이 정확히 "그 글자"를 겨냥하지 못하고 `exposure`(반복 노출 학습, 단어 기반)로
>     근사되는 한계가 있음 — 히라가나 전용 듣기 콘텐츠가 생기면 교체 검토.

**개념**: 진단 프로필(§1)과 항목별 현재 단계(§2)를 입력받아, 매 세션마다 게임 배합 비율을 계산하는 규칙 기반 함수.

**구현 계획 (단계적 접근 — 한 번에 다 만들지 말 것)**:

- **Phase 1 (규칙 기반, 우선 구현)**: `pickNextGameForSession(activeSetState, learnerProfile, reviewCandidates)` 함수를 신규 작성. 입력은 이미 존재하는 `activeSetState`/`computeLtmStatus` 결과와 `kotobaLearnerProfile`. 출력은 "오늘 이 세션에 낼 게임 모드와 비율".
  - `workingMemorySpan`이 낮으면 → 활성 세트 확장 속도(`evaluateActiveSetExpansion`의 increment)를 자동으로 낮추고, 세션당 문제 수도 축소
  - `assocLearningRate`가 'slow'면 → A(노출) 단계 게임 비중을 늘리고, B→C 전환 기준(예: 재인 정답률 임계값)을 더 여유 있게 조정
  - `assocLearningRate`가 'fast'면 → A단계를 짧게 건너뛰고 B부터 시작, C→D 전환도 빠르게
  - `priorKnowledgeLevel`이 높으면 → 처음부터 더 큰 활성 세트로 시작(청킹 단위는 유지)하고 A단계는 최소화
  - 예시 배합 비율(신중한 학습자 vs 빠른 습득자):

    | 프로필 | A 노출 | B 재인 | C 회상 | D 발화·전이 | E 유지 |
    |---|---|---|---|---|---|
    | 신중한 학습자 | 35% | 25% | 20% | 10% | 10% |
    | 보통 | 20% | 25% | 25% | 15% | 15% |
    | 빠른 습득자 | 10% | 20% | 25% | 25% | 20% |

- **Phase 2 (성과 기반 재보정)**: 위 비율을 고정값이 아니라, 실제 세션 결과(카테고리별 정답률/시간초과율 — 이미 각 게임에 있는 기록 패턴 재사용)를 보고 매주 자동으로 미세 조정. `learnerProfile.lastRecalibratedAt`을 갱신하며 "선언한 프로필"보다 "실측 성과"를 항상 우선한다 — 예를 들어 자기보고로는 "듣기가 편하다"고 했어도, 실제 듣기 전용 게임 성과가 낮으면 그 채널 비중을 낮춘다.
- **Phase 3 (장기 과제, 보류 가능)**: 세션 배합을 넘어 "이번 주 전체 커리큘럼"(예: 이번 주는 새 문형 3개 도입 + 지난 주 항목 유지) 단위의 장기 스케줄링. 지금은 설계만 남겨두고 Phase 1~2가 안정된 뒤 착수.

**연동 지점 (예상)**: `activeSetState`/`ACTIVE_SET_*`, `evaluateActiveSetExpansion()`, `computeLtmStatus()`, `srsWeightedPick()`, `reviewSessionActive` 계열 — 전부 신규 함수를 만들기보다 **기존 함수에 `learnerProfile` 인자를 추가로 흘려보내는 방식**으로 확장하는 것을 우선 검토.

**우선순위**: 이 신규 과제 안에서는 §1(진단) 다음으로 높음 — 진단 데이터가 있어도 이걸 쓰는 로직이 없으면 무의미함
**난이도**: 높음 (규칙이 많아지고 예외 케이스가 계속 생김 — 반드시 Phase 1의 "단순 규칙"부터 시작해서 점진적으로 정교화할 것)
**주의사항**: "모국어처럼" 습득이라는 목표는 방향성이지 이 앱 하나로 완전히 달성 가능한 목표라고 단정하지 말 것 — 실제 원어민 수준 습득은 몰입 환경·실제 소통 경험이 필수적이고, 이 오케스트레이터는 "주어진 게임 자산 안에서 장기기억 효율을 최대화"하는 것이 현실적 목표임을 UI 문구에서도 과장하지 않을 것.

---

## 4. 몰입 환경(Immersion) 요소 중 앱이 다룰 수 있는 범위

**개념**: "모국어처럼" 습득에는 몰입 환경이 필수적이지만, 몰입을 이루는 요소들은 앱이 흉내낼 수 있는 것과 근본적으로 대체 불가능한 것이 섞여 있다. 아래는 SLA(제2언어습득) 연구에서 통용되는 몰입 요소 8가지를 앱 설계 관점에서 분류한 것.

| 몰입 요소 | 앱에서 가능한가 | 이유 / 레버 |
|---|---|---|
| ① 이해 가능한 입력(i+1, Krashen) | **가능** | 이미 활성세트·SRS 난이도 자동조정이 사실상 i+1 원리. 이야기·노래 콘텐츠도 난이도 매칭 필요 |
| ② 절대적 노출량·빈도 | **부분 가능** | 세션 시간 자체를 늘리는 건 리텐션 문제라 앱이 강제할 수 없지만, 듣기 전용 학습(§2의 A단계)을 배경 재생처럼 늘려 자연 노출량은 늘릴 수 있음 |
| ③ 실제 소통 목적의 상호작용 | **부분 가능** | 진짜 상호작용은 아니지만, 목표지향적 롤플레이/시나리오 대화로 근사 가능 (아래 4-1 참고) |
| ④ 다양한 화자·억양·상황 노출 | **가능** | 이미 구현된 부호화 다양성(폰트/음성 지터) 원리를 캐릭터별 TTS 보이스·속도로 확장하면 됨 |
| ⑤ 낮은 정의적 여과(불안↓) | **가능** | 앱은 원래 "틀려도 아무도 안 보는" 사적 공간이라는 것 자체가 강점 — 톤·피드백 문구 설계로 강화 가능 |
| ⑥ 사회적 소속감·정체성 참여 | **불가능에 가까움** | 진짜 공동체는 대체 불가. 다만 캐릭터·세계관이 있는 서사(스토리북 등)로 아주 약하게 흉내는 가능 |
| ⑦ 목표어 중심 일상 재구성 | **앱 밖의 문제** | 기기 언어 설정, 미디어 소비 등은 사용자의 실생활 선택 영역. 앱은 "오늘의 미션"류 넛지 정도만 가능 |
| ⑧ 즉각적·자연스러운(암묵적) 피드백 | **부분 가능** | 지금의 음성인식 정오답 피드백은 명시적 교정에 가까움. 롤플레이의 NPC 반응으로 조금 더 자연스러운 암묵적 교정에 근접시킬 수 있음 |

**결론**: 앱이 실질적으로 손댈 수 있는 건 ①②④⑤⑧ — 대부분 이미 로드맵에 있는 이론들(바람직한 어려움, 부호화 다양성, 인출 연습)의 연장선. ③⑥⑧은 **③번을 중심으로 "롤플레이" 같은 목표지향 시뮬레이션을 얹으면 근사치까지는 갈 수 있다** — 아래 4-1에서 구체화.

### 4-1. 미니 롤플레이(상황극) 게임 — ③⑤⑧을 동시에 노리는 신규 게임 카테고리 제안

**질문에 대한 답**: 그렇다, 부분적으로는 몰입에 조금 더 가까운 경험을 줄 수 있다 — 단, "정답 맞히기"가 아니라 **"목표 달성"이 게임의 목적**일 때만 그렇다. 기존 문장·단어 조합(sentence, compound) 카테고리가 "문장을 완성하는 것" 자체가 목적이라면, 롤플레이는 "이 문장을 써서 원하는 걸 얻어내는 것"이 목적이라는 점이 다르다 — 이 차이가 ③(실제 소통 목적)에 조금 더 가까워지는 지점.

**구체적 설계안**:
- **구조**: 짧은 상황(예: 식당에서 주문하기, 편의점 계산대, 길 묻기) + 선택형 또는 음성 응답 분기 대화. 정답/오답이 아니라 "미션 완료까지 몇 번 시도했는가"로 평가.
- **의미 협상 시뮬레이션(⑧ 보완)**: NPC가 이해 못 했을 때 "다시 말해줄래?" 같은 반응을 보이는 이벤트를 넣어, 실제 대화의 되묻기·고쳐 말하기 과정을 축소판으로 흉내. 정오답을 "❌ 틀렸습니다"로 명시하지 않고 극 중 캐릭터 반응으로 완곡하게 표현 — 실패가 "게임오버"가 아니라 "이야기가 계속되는 것"이 되도록.
- **화자 다양성(④ 강화)**: NPC마다 다른 TTS 보이스/속도/톤 배정 — 이미 있는 `speakTTS` 지터 원리를 캐릭터 단위로 확장.
- **낮은 정의적 여과(⑤ 강화)**: 실수해도 게임이 끝나지 않고 캐릭터가 자연스럽게 재시도를 유도하는 구조 자체가 "틀려도 안전하다"는 경험을 강화함.
- **기존 자산과의 관계**: §2 파이프라인의 **D단계(발화·전이)의 상위 확장판**. `sentence`/`compound` 게임, 그리고 발화 검증에는 `speech`/음성인식 인프라를 재사용(단, 인식 정확도 이슈를 고려해 텍스트 선택 응답과 음성 응답을 함께 지원하는 것을 권장).
- **한계(정직하게 짚어야 할 것)**: 결국 스크립트화된 분기라서, 실제 대화의 예측 불가능성·진짜 이해관계는 재현되지 않는다. 반복하면 "정답 패턴 암기"로 흘러갈 위험이 커서, 같은 시나리오라도 NPC 대사 풀을 여러 벌 만들어 매번 다른 표현으로 같은 의미를 전달하도록(부호화 다양성 원리 재적용) 설계해야 한다.

**연동 지점(예상)**: 새 `MENU_CATEGORIES` 항목(예: `roleplay`) + 신규 분기 대화 데이터 구조(`data.js`), 발화 검증은 기존 음성인식 코드(`HrRecognitionAPI` 계열) 재사용 검토, §2 파이프라인의 D단계 게임 목록에 편입.

**우선순위**: 중 (전체 오케스트레이터보다는 후순위지만, 몰입 요소 중 앱이 가장 흉내내기 좋은 지점이라 별도 실험으로 먼저 만들어볼 가치는 있음)
**난이도**: 중~높음 (분기 대화 데이터 설계량이 크고, 기존 게임들과 다른 대화형 UI가 새로 필요함)
**주의사항**: "롤플레이 = 진짜 몰입"이라고 과대포장하지 말 것 — 목표지향성·저부담 반복시도·화자 다양성 세 가지를 근사하는 것이지, ③⑥⑧을 완전히 대체하는 게 아니라는 걸 UI 문구·팀 내부 문서 모두에서 분명히 할 것. 그리고 스크립트 암기화를 막기 위한 대사 풀 다양화가 없으면 오히려 "패턴 학습"이라는 역효과가 날 수 있음.

---

## Part 2 다음 세션 시작 가이드
1. ~~§1 진단 모듈 중 4번(적응형 배치 퀴즈)~~ ✅ 구현 완료 — `kotobaLearnerProfile`에 `priorKnowledgeLevel`까지 채워짐
2. ~~§1 진단 모듈 중 1번(청지각 변별력)~~ ✅ 구현 완료 — `kotobaLearnerProfile`에 `phonoDiscrimination`까지 채워짐
3. ~~§1 진단 모듈 중 2번(작업기억 스팬)~~ ✅ 구현 완료 — `kotobaLearnerProfile`에 `workingMemorySpan`까지 채워짐
4. ~~§1 진단 모듈 중 3번(연상학습 속도)~~ ✅ 구현 완료 — `kotobaLearnerProfile`에 `assocLearningRate`까지 채워짐. **이로써 §1 진단 모듈 4가지가 모두 구현 완료됨.**
5. ~~§2의 게임→단계 매핑 표를 `data.js`에 `GAME_STAGE_MAP`으로 옮기는 작업~~ ✅ 완료(`GAME_STAGE_MAP`/`GAME_STAGE_INFO` + 조회 헬퍼 `getGameStage`/`getModesForStage`). **다음은 §3 오케스트레이터 Phase 1(규칙 기반)을 시작할 차례** — 그 첫 작업은 §2에서 미룬 "항목별 단계 이동 규칙"(카테고리별 정답/오답 채널 기록 → 다음 단계 진입 판정)을 `pickNextGameForSession()`과 함께 설계하는 것부터.
6. ~~§3은 반드시 Phase 1(규칙 기반)만 먼저~~ ✅ 구현 완료 — `pickNextGameForSession()`이 진단 4개 필드를 `classifyLearnerTendency()`로 연결하고, 히라가나 축 한정으로 "오늘의 추천" 배너까지 UI 연동됨. **Phase 2(성과 기반 재보정)/Phase 3(주간 커리큘럼)는 Phase 1이 실제로 며칠 굴러가며 데이터가 쌓인 뒤 재검토할 것.** 다음 세션 후보: (a) 비-히라가나 게임 카테고리로 §2 단계 판정 일반화, (b) Part 3/Part 4에 정리된 신규 아이디어(오답 나무, 소리 도감, 수면 전 프롬프트 등) 순차 구현.
7. §4-1 미니 롤플레이는 오케스트레이터와 독립적으로 먼저 프로토타입을 만들어봐도 무방 — 시나리오 1~2개로 작게 시작해서 대사 풀 다양화 패턴부터 검증할 것

---

---

# Part 3. 생성 효과 / 프로덕션 기반 미반영 아이디어 (신규 과제 — 설계 단계)

> 사용자가 외부에서 받은 기능 아이디어 목록(음성 시각화, 롤플레이, 소리 도감, 흘려듣기, 스트릭,
> 시각 연상 카드, 섀도잉, 감정 TTS, 만화 스니펫, 날씨 연동, 단어 요리, 오답 정원, ASMR, 풍선 터뜨리기,
> 주간 리포트 등 15개)을 장기기억(LTM) 효과 근거로 선별한 결과, 아래 5개가 **기존 로드맵(Part 1/2)에
> 아직 없고 + 인지과학적으로 LTM에 직접 기여하는** 항목으로 판단되어 신규 섹션으로 추가함.
> 나머지 10개(음성 파형 시각화, 흘려듣기 플레이어, 감정 TTS, 만화 스니펫, 날씨/시간 연동, ASMR 배경음,
> 풍선 터뜨리기, 시각 연상 카드, 주간 리포트, 롤플레이)는 몰입감·재미·기존 이론의 변주 정도로 판단해
> 이번 섹션에는 넣지 않음(롤플레이는 이미 Part 2 §4-1에 별도 기획돼 있음).
>
> 아직 코드는 하나도 없고, 순수 기획 문서다. 실제 구현 세션은 이 문서를 갱신하며 작업할 것(기존 규칙과 동일).

## 1. 프로덕션 효과 — 소리 도감 / 자기 음성 녹음 비교

**개념**: 정보를 눈으로 보거나 귀로 듣기만 할 때보다, 스스로 소리 내어 산출(production)한 정보가 더 오래 기억됨(production effect). 원어민 음성과 자신의 발음을 나란히 비교해 들으면 산출 과정 자체가 한 번 더 인출 연습이 됨.

**현재 갭**: 읽기(발화) 게임(`hrStats`)은 음성인식으로 정오답만 판정할 뿐, 사용자의 실제 음성을 저장하거나 원어민 TTS와 비교해 들려주는 기능이 없음. `HIRAGANA_MNEMONICS`(이중부호화)처럼 "내가 만든 소리"를 저장하는 채널이 아예 없음.

**구현 계획**:
- 단어 카드/장기기억 상세보기(`showLtmDetail`) 화면에 "🎙️ 내 목소리로 녹음하기" 버튼 추가 — 브라우저 `MediaRecorder` API로 짧은 음성(글자 1개 또는 샘플 단어 발음)을 녹음
- 녹음본은 `localStorage`(또는 `IndexedDB`, 용량이 크면)에 글자별로 저장 — 새 키(예: `kotobaVoiceBookmark`) 신설, 기존 `hrStats`류 오염 방지
- "🔊 원어민 발음" / "🎤 내 발음" 두 버튼을 나란히 배치해 번갈아 재생 비교
- 인출 강도를 높이려면 저장 시점에 이미 있는 `hrStats.getStat(ch)`에 `hasVoiceBookmark` 플래그만 살짝 얹어 장기기억 판정에 참고 정보로만 노출(가중치에는 영향 주지 않는 것을 권장 — 녹음 여부가 실력을 뜻하진 않으므로)
- **연동 지점**: `showLtmDetail()`, 읽기(발화) 게임 결과 화면(`showHiraganaReadQuestion` 계열), 신규 `localStorage` 키

**우선순위**: 높음 (LTM 채널 중 유일하게 비어 있던 "자기 산출 저장" 축을 채움)
**난이도**: 중 (MediaRecorder 브라우저 호환성, 마이크 권한 UX, 저장 용량 관리 필요)
**주의사항**: 아이 음성 녹음은 민감할 수 있으므로 기기 로컬 저장만 하고 서버 전송/공유 기능은 넣지 않을 것. 저장 용량 상한(예: 글자당 최신 1개만 유지)을 반드시 둘 것.

---

## 2. 섀도잉 미니게임 (Shadowing)

**개념**: 원어민 음성을 듣는 즉시 거의 동시에 따라 말하는 섀도잉은 단순 듣기보다 부호화 깊이가 크고, 리듬·억양까지 함께 체화시켜 발화(production) 인출 경로를 강화함.

**현재 갭**: 읽기(발화) 게임은 "글자를 보고 소리 내어 읽기"만 있고, "먼저 듣고 곧바로 따라 말하기" 흐름이 없음. 타이밍/억양 비교 피드백도 없음.

**구현 계획**:
- 신규 게임 모드(`shadowing`) 추가: TTS로 짧은 단어/문장 재생 → 재생 종료 직후 일정 시간(예: 재생 길이 ×1.2) 동안 마이크 활성화 → 음성인식 결과와 정답 텍스트 유사도만 우선 판정(정밀한 타이밍/피치 비교는 1차 구현 범위 밖으로 두고 추후 확장)
- 기존 음성인식 인프라(`HrRecognitionAPI` 계열, 읽기 게임에서 이미 사용 중) 재사용
- `speakTTS`의 `jitter` 옵션을 그대로 활용해 매번 살짝 다른 속도/피치로 재생 → 부호화 다양성과 자연스럽게 결합
- `GAME_STAGE_MAP`(data.js)에 `shadowing`을 D단계(발화·전이)로 등록해 §2 파이프라인에 편입
- **연동 지점**: 신규 게임 모드 등록(`MENU_CATEGORIES`, `launchGame`/`switchMode`), `speakTTS`, `HrRecognitionAPI` 계열, `GAME_STAGE_MAP`

**우선순위**: 중 (기존 발화 인프라 재사용 가능하나, 신규 게임 흐름 자체를 새로 짜야 해서 §1의 소리 도감보다는 공수가 큼)
**난이도**: 중~높음 (타이밍 판정 정확도, 음성인식 지연 이슈 고려 필요)
**주의사항**: 1차 구현은 "정답 여부"만 판정하고, 타이밍/억양 정밀 비교는 과욕부리지 말 것 — 회귀 리스크와 공수 대비 효과를 보며 단계적으로 확장.

---

## 3. 생성적 문장 조합 미니게임 (단어 재료 → 문장 요리)

**개념**: 이미 아는 단어를 스스로 조합해 새 문장을 만드는 과정은 처리 수준 이론에서 말하는 "의미적·생성적 부호화"에 해당해, 완성된 문장을 보기만 하는 것보다 기억에 오래 남음.

**현재 갭**: 기존 `sentence`/`compound` 카테고리가 이미 "문장·단어 조합(생성/전이)" 성격이지만, 재료를 순서대로 골라 담아 "완성"하는 게이미피케이션 연출(요리/조립 비유, 완성 애니메이션)은 없어 생성 과정의 동기부여가 약함.

**구현 계획**:
- 기존 `sentence`/`compound` 게임 로직(단어 선택 → 문장 완성 판정)은 그대로 재사용하고, **연출 레이어만 추가**: 단어 카드를 냄비/도마 이미지 위로 드래그하면 "재료 투입" 애니메이션 → 문장 완성 시 캐릭터가 먹는 리액션
- 기존 판정 로직을 건드리지 않는 것이 핵심 — 새 함수보다는 기존 완성 콜백 지점에 연출 트리거만 추가
- **연동 지점**: `sentence`/`compound` 게임의 완성 판정 콜백 지점(logic.js에서 해당 함수 검색 필요), CSS 애니메이션 신규 추가

**우선순위**: 낮음~중 (인지적 이득은 기존 게임과 동일 — 주로 동기부여/지속 참여 효과이지만, 생성 자체의 참여도를 높여 결과적으로 인출 연습 반복 횟수를 늘리는 간접 효과 기대)
**난이도**: 낮음 (판정 로직 변경 없이 연출만 추가)
**주의사항**: 연출에 시간을 쏟다가 판정 로직을 실수로 건드리지 않도록 주의 — 기존 `sentence`/`compound` 회귀 테스트 필수.

---

## 4. 오답 나무 키우기 — 복습 이행 유도 UI

**개념**: 이 항목 자체는 새로운 기억 메커니즘이 아니라, **이미 구현된 SRS/복습 세트(`srsForgetProbability`, `startReviewSession`)가 실제로 수행되게 만드는 행동 유도 장치**임. 망각곡선 기반 모델은 복습이 실제로 일어나야 의미가 있으므로, 복습 이행률을 높이는 UI는 간접적이지만 실질적인 LTM 개선 효과가 있음.

**현재 갭**: 틀린 단어/글자는 통계 엔진(`getStat`)에 기록되고 복습 후보 선정(가중 뽑기)에는 반영되지만, 아이 입장에서 "내가 틀린 것들이 지금 어떤 상태인지"를 시각적으로 확인하고 복습을 하고 싶게 만드는 화면이 없음.

**구현 계획**:
- 신규 패널(`#menuMistakeGardenLevel`) 추가: `hsStats`/`hwStats`/`hrStats`에서 `srsStage`가 낮거나 최근 오답인 글자를 "씨앗~새싹~꽃~나무" 4단계 정도로 매핑해 정원 그리드로 표시
- 복습 세트(`startReviewSession`)에서 해당 글자를 맞히면 "물주기" 애니메이션과 함께 단계 상승 — **기존 `srsUpdateStat`의 stage 값을 그대로 재사용**(새 별도 상태를 만들지 않고 기존 stage를 시각적으로 매핑만 다시 하는 방식을 권장, 데이터 이중관리 방지)
- **연동 지점**: `computeLtmStatus`/`getStat` (기존 stage 값 조회), `startReviewSession` 완료 콜백, `TOP_MENU_EXTRA_ITEMS`(신규 메뉴 카드 등록)

**우선순위**: 높음 (기존 통계 데이터를 그대로 재사용해 새 정원 UI만 얹으면 되고, 복습 이행 동기부여 효과가 커서 구현 비용 대비 효과가 좋음)
**난이도**: 낮음~중 (판정 로직 재사용, 시각화 UI만 신규)
**주의사항**: "틀린 것"을 부정적으로 느끼지 않도록 톤을 "키운다"는 긍정적 프레임으로 유지 — 오답 자체를 벌점처럼 보이게 하지 말 것.

---

## 5. 스트릭 / 출석 도장판 — 학습 습관 형성

**개념**: 이 항목도 새 기억 메커니즘이 아니라 **간격 반복(SRS)이 작동하려면 전제되는 "꾸준한 접속"을 유도하는 습관 형성 장치**임. 매일 짧게라도 접속해 복습이 실행되게 만드는 것이 결과적으로 망각곡선 관리의 성패를 좌우함.

**현재 갭**: 접속 기록이나 연속 학습일을 추적/표시하는 기능이 전혀 없음.

**구현 계획**:
- `localStorage`에 신규 키(예: `kotobaStreak`)로 `{lastVisitCalendarDay, currentStreak, longestStreak}` 저장 — 이미 있는 `calendarDayNumber()`(수면 의존 공고화에서 만든 자정 경계 계산 헬퍼)를 그대로 재사용해 "하루 지났는지" 판정
- 메인 화면 상단에 도장판 UI(최근 7일 칸, 오늘 학습 완료 시 한코(印) 스탬프 도장 애니메이션)
- 특정 조건(3일 연속, 7일 연속 등) 달성 시 배지/테마 해금은 1차 구현 범위에서는 보류하고, 스트릭 표시 자체만 우선 구현 권장(과설계 방지)
- **연동 지점**: `calendarDayNumber()` 재사용, 앱 진입 시점(초기화 함수) 훅, 신규 UI 컴포넌트

**우선순위**: 중 (LTM에 직접 기여하진 않지만 습관 형성 → 복습 이행 → LTM으로 이어지는 간접 경로가 뚜렷함)
**난이도**: 낮음 (기존 날짜 계산 헬퍼 재사용, 상태 구조 단순)
**주의사항**: 스트릭이 끊겼을 때 죄책감을 유발하는 문구는 피하고, "오늘부터 다시 시작해도 괜찮다"는 톤을 유지할 것 — 스트릭 압박이 오히려 학습 회피로 이어지지 않도록.

---

## Part 3 권장 구현 순서
1. **4. 오답 나무 키우기** — 기존 데이터 재사용, 복습 이행 효과 큼
2. **1. 소리 도감(프로덕션 효과)** — 비어 있던 LTM 채널을 채움
3. **5. 스트릭/도장판** — 구현 난이도 낮고 습관 형성 효과
4. **3. 생성적 문장 조합 연출** — 기존 게임 로직 재사용, 연출만 추가
5. **2. 섀도잉 미니게임** — 신규 게임 흐름이라 공수가 가장 크므로 후순위

---

---

# Part 4. 간섭 방지 · 인출 단서 다변화 · 수면 전 통합 · 자기참조 (신규 과제 — 설계 단계)

> 사용자가 외부에서 받은 인지과학 기법 10개(분산학습/간섭방지, 생성 효과, 인출단서 다변화,
> 수면 전 통합, 정교화·자기참조, 인터리빙, 테스팅 효과, SRS, 이중부호화, 상황맥락적 인출)를
> 기존 로드맵(Part 1~3)과 대조 검토한 결과, SRS·이중부호화·테스팅효과·인터리빙(교차복습)은 이미
> 구현/계획돼 있고, 상황맥락적 인출(ASMR 배경음 매칭)은 부호화-인출 맥락 불일치 우려로 보류.
> 생성 효과는 Part 3 §3(생성적 문장 조합)·§2(섀도잉)로 이미 다루고 있음. 나머지 **4개(간섭 방지,
> 인출 단서 다변화, 수면 전 통합 프롬프트, 정교화·자기참조 효과)**가 로드맵에 없는 새 항목으로
> 판단되어 이번 섹션에 추가함.
>
> 아직 코드는 하나도 없고, 순수 기획 문서다. 실제 구현 세션은 이 문서를 갱신하며 작업할 것(기존 규칙과 동일).

## 1. 분산 학습 · 간섭 방지 (유사 자형/유의어 분산 배치)

**개념**: 형태나 의미가 비슷한 항목(め/ぬ, わ/れ, さ/き 같은 유사 자형, 또는 뜻이 비슷한 유의어)을 같은 세션에 몰아 학습하면 뇌에서 서로 헷갈려 기억이 뒤섞이는 간섭(interference)이 일어남. 유사 항목을 시간·순서상 떨어뜨려 배치하면 변별력이 높아져 각각 더 견고하게 저장됨.

**현재 갭**: 청킹(`HIRAGANA_ROW_GROUPS`)은 오십음도 행 단위로만 묶어서, 오히려 **자형이 비슷한 글자가 다른 행에 흩어져 있어도 신경 쓰지 않음**. SRS 가중 뽑기(`srsWeightedPick`)나 활성 세트 확장도 "헷갈리기 쉬운 쌍인지"는 전혀 고려하지 않아, 예를 들어 め/ぬ가 같은 문제 세트나 인접한 순서로 연달아 나올 수 있음.

**구현 계획**:
- `data.js`에 `HIRAGANA_CONFUSION_PAIRS`(또는 유사군) 신규 데이터 추가: 자형이 비슷해 아이들이 실제로 자주 혼동하는 쌍/군을 정리 (예: `[['め','ぬ'], ['わ','れ'], ['さ','き'], ['る','ろ'], ['く','へ'] ...]`)
- `logic.js`의 문제 출제 로직(카드찾기 오답 선택지 구성, 활성 세트 순서 등)에서 같은 혼동군에 속한 글자가 **같은 문제의 선택지로 동시에 등장하거나, 연속된 문제로 바로 이어 나오지 않도록** 최소 간격(예: 최근 N문제 이내엔 배제) 규칙 추가
- 오답 선택지를 랜덤으로 뽑는 기존 로직에, "혼동군 내 글자는 오히려 의도적으로 오답 선택지에 포함시켜 변별 연습을 시키되, 그 직후 문제로는 다시 안 나오게" 하는 절충안도 고려 가능(완전 회피보다 "적당한 간격을 둔 노출"이 desirable difficulty 관점에서 더 나을 수 있음 — 1차 구현은 단순 간격 규칙으로 시작 권장)
- **연동 지점**: 카드찾기 오답 선택지 구성 함수(`showHiraganaSpeedQuestion` 계열), `getActiveCharList()`/활성 세트 순서, `srsWeightedPick()`

**우선순위**: 중 (효과는 확실하지만, "혼동군 데이터"를 신뢰성 있게 만드는 데 언어학적 판단이 필요하고 기존 랜덤 로직 여러 곳을 건드려야 함)
**난이도**: 중 (데이터 자체는 간단하지만, 출제 로직 곳곳에 조건을 끼워 넣어야 해서 회귀 리스크 있음)
**주의사항**: 혼동군을 완전히 분리시키기만 하면 오히려 변별 연습 기회 자체가 사라질 수 있음 — "동시 노출은 피하되 아예 안 만나게 하지는 않기"의 균형을 잡을 것.

---

## 2. 인출 단서 다변화 (모달리티 로테이션)

**개념**: 같은 정보를 매번 똑같은 감각 경로로만 인출하면 그 경로에 종속된 얕은 기억이 됨. 오디오만 듣고 맞히기, 이미지/상황만 보고 맞히기, 문맥 속 빈칸 채우기처럼 **인출 단서의 종류 자체**를 바꿔가며 노출하면 뇌가 여러 경로로 같은 기억에 접근하는 법을 익혀 인출 성공률이 높아짐.

**현재 갭**: 기존 "부호화 다양성"(Part 1 §3)은 폰트·음성 피치 등 **같은 모달리티 안에서의 표면적 변주**에 그침. 카드찾기는 항상 "소리 듣고 글자 고르기", 읽기는 항상 "글자 보고 소리 내기"처럼 **각 게임 모드가 고정된 인출 경로 하나만** 씀. "오늘은 오디오만", "오늘은 그림만"처럼 모달리티 자체를 로테이션하는 개념은 없음.

**구현 계획**:
- 기존 게임 모드들을 "제시 모달리티"(텍스트/오디오/이미지·상황)와 "응답 모달리티"(선택/쓰기/발화) 두 축으로 재분류 — 이미 `GAME_STAGE_MAP`(data.js)에 게임별 단계 매핑이 있으니, 같은 자리에 모달리티 태그(`presentMode`, `responseMode`)를 필드로 추가하는 방식 검토
- 복습 세트(`startReviewSession`)나 §3 오케스트레이터(`pickNextGameForSession`, 아직 미구현)가 같은 글자를 반복 복습시킬 때 **직전에 썼던 모달리티와 다른 모달리티의 게임을 우선 선택**하도록 가중치 부여
- 간단한 1차 구현안: 새 게임 모드를 만들지 않고, 기존 게임들 중 모달리티가 다른 것끼리 묶어 "이 글자, 오늘은 소리로만/그림으로만 만나보기" 같은 미니 로테이션 문구만 추가해도 개념 검증 가능
- **연동 지점**: `GAME_STAGE_MAP`(data.js, 필드 확장), `startReviewSession`, §3 오케스트레이터(`pickNextGameForSession`)와 자연스럽게 결합되는 지점이라 §3 설계 시 함께 고려 권장

**우선순위**: 중~높음 (§3 오케스트레이터가 어차피 "다음에 뭘 낼지" 결정하는 로직이라, 이 축을 처음부터 함께 설계하면 나중에 별도로 추가하는 것보다 공수가 훨씬 적음)
**난이도**: 중 (개념 자체는 단순하지만 게임 모드 전체를 모달리티 기준으로 재분류하는 초기 작업이 필요)
**주의사항**: §3 오케스트레이터 구현 전에 먼저 손대면 이중작업이 될 수 있으므로, §3 Phase 1 설계 시점에 이 모달리티 축을 같이 넣는 것을 권장(별도로 먼저 만들지 말 것).

---

## 3. 수면 전 통합 프롬프트 (Pre-Sleep Consolidation Prompt)

**개념**: 단기기억이 장기기억으로 전환되는 데 수면, 특히 잠들기 직전에 마지막으로 접한 정보가 유리하다는 연구가 있음. 밤 시간대에 오늘 배운 내용을 가볍게 다시 훑어보게 하는 넛지는 이 타이밍을 적극적으로 활용하는 것.

**현재 갭**: 기존 "수면 의존 기억 공고화"(Part 1 §5)는 **같은 날 중복 상승을 제한**하는 수동적 안전장치일 뿐, "밤 시간대에 먼저 다가가서 오늘 배운 걸 다시 보여주는" 능동적 기능은 전혀 없음. 오늘 학습한 항목만 모아 보여주는 화면도 없음.

**구현 계획**:
- 오늘 학습/복습한 글자·단어를 세션 동안 임시로 모아두는 로그(예: `todayLearnedLog`, 앱 실행 중 메모리 또는 `localStorage`에 당일자 키로 저장, 자정 지나면 자동 초기화 — 기존 `calendarDayNumber()` 재사용)
- 기기 로컬 시간이 저녁 시간대(예: 21시 이후)에 앱을 열면, 메인 화면 상단에 "오늘 만난 소중한 단어 3개, 자기 전에 가볍게 볼까요?" 카드 노출
- 클릭 시 오늘 학습한 항목 중 대표 3개(가장 최근 학습했거나, 오답률이 있었던 것 우선)를 화면 전환 없이 빠르게 훑어보는 "1분 요약" 미니 뷰 제공 — 정답을 맞히는 퀴즈가 아니라 **가볍게 재노출**하는 형태로, 부담을 최소화(잠들기 전 긴장을 유발하지 않도록)
- **연동 지점**: `calendarDayNumber()`(수면 공고화 헬퍼 재사용), 앱 진입 시점 초기화 함수, 신규 `todayLearnedLog` 상태, 메인 메뉴 화면

**우선순위**: 높음 (연구적으로 효과가 강력하게 입증된 타이밍인데 앱이 전혀 활용하지 못하고 있음 + 기존 날짜 계산 헬퍼를 그대로 재사용 가능해 구현 비용도 낮음)
**난이도**: 낮음~중 (시간대 판단, 당일 학습 로그 수집 정도만 필요 — 알림(push notification)까지 가려면 별도 권한/인프라 필요하므로 1차는 "앱을 열었을 때" 트리거로 한정 권장)
**주의사항**: 강제 팝업처럼 방해되지 않도록 "닫기" 쉬운 카드 형태로 두고, 절대 퀴즈처럼 긴장되는 톤(정답/오답 표시 등)을 넣지 말 것 — 목적은 이완된 상태의 가벼운 재노출.

---

## 4. 정교화된 시연 · 자기참조 효과 (Elaborative Rehearsal & Self-Reference)

**개념**: 새 정보를 자신의 경험이나 익숙한 사물에 빗대어 연결하면(정교화) 기억흔적이 깊어짐. 특히 "나 자신"과 관련지은 정보(self-reference effect)는 타인이 만들어준 연상보다 훨씬 강하게 기억됨.

**현재 갭**: 이중부호화(`HIRAGANA_MNEMONICS`)는 **앱이 미리 만들어둔** 연상 이미지·이야기를 보여줄 뿐, 아이가 스스로 "이 단어는 내 하루의 뭐랑 닮았어요"처럼 자기 경험과 연결 짓게 하는 기능은 전혀 없음.

**구현 계획**:
- 단어 카드/장기기억 상세보기(`showLtmDetail`)에 "이 단어, 나의 하루와 닮은 점이 있나요?" 같은 가벼운 질문 + 이모지 선택 또는 짧은 한 줄 메모 입력란 추가(선택적, 강제 아님)
- 아이가 남긴 자기참조 메모는 `localStorage`에 글자/단어별로 저장(신규 키, 예: `kotobaSelfReferenceNotes`) — 다음에 같은 단어를 만났을 때 "지난번에 네가 남긴 메모"를 함께 보여주면 자기참조 효과가 한 번 더 강화됨
- 입력 부담을 줄이기 위해 자유 텍스트보다는 이모지 3~5개 중 선택하는 방식으로 시작하는 것을 권장(아이 대상 UX, 타이핑 부담 최소화)
- **연동 지점**: `showLtmDetail()`, `HIRAGANA_MNEMONICS`(기존 이중부호화 힌트) 옆에 나란히 배치, 신규 `localStorage` 키

**우선순위**: 중 (효과는 강력하지만, 텍스트/이모지 입력 UI가 아이 연령대에 맞게 설계돼야 하고 저장 데이터 관리가 새로 필요)
**난이도**: 중 (입력 UI, 저장/불러오기 로직 신규 — 판정 로직은 없어 로직 자체는 단순)
**주의사항**: 아이가 남기는 메모는 사적인 내용일 수 있으므로 기기 로컬 저장만 하고 서버 전송/공유 기능은 넣지 않을 것(§1 소리 도감과 동일한 원칙 적용).

---

## Part 4 권장 구현 순서
1. **3. 수면 전 통합 프롬프트** — 기존 헬퍼 재사용, 효과 대비 구현 비용 가장 낮음
2. **2. 인출 단서 다변화** — §3 오케스트레이터 설계 시점에 함께 넣는 것이 효율적이므로 그 타이밍에 맞춰 진행
3. **1. 분산 학습·간섭 방지** — 혼동군 데이터 정리 + 출제 로직 여러 곳 수정 필요
4. **4. 정교화·자기참조 효과** — 입력 UI 신규 설계 필요해 후순위

---

## 공통 작업 규칙 (재확인)
- 파일 수정 시 항상 4개(`index.html`, `logic.js`, `data.js`, `sw.js`) 세트로 교체 안내
- `sw.js`의 `CACHE_NAME` 버전을 매번 올릴 것
- 새 UI는 `:root` CSS 변수(`--washi`, `--hanko`, `--indigo`, `--sage`, `--gold`, `--line`)와 기존 클래스 네이밍 패턴(`.theory-card`, `.ltm-*`, `.menu-card` 등)을 재사용해 톤을 통일할 것
- 주석은 기존 코드 스타일대로 한국어로, 함수 위에 `/* ... */` 블록으로 "왜" 이 로직이 필요한지 설명 포함
- 학습이론 패널(`#menuTheoryLevel`)에 새 이론을 구현할 때마다, 해당 이론 설명 카드도 함께 추가해 "이론 소개 ↔ 실제 구현"이 항상 동기화되도록 유지
- **이 문서(`learning-theory-roadmap.md`)는 작업할 때마다 매번 갱신할 것.** 코드 수정이 끝난 그 턴 안에 함께 반영하고, 다음 턴으로 미루지 않는다:
  - 6가지 이론 중 하나를 구현/재구현하면 → 해당 이론 섹션 제목에 "✅ 구현 완료" 표시 + 그 아래 "구현 내역" 인용 블록으로 실제 변경 파일·함수명·연동 지점을 구체적으로 적을 것
  - 로드맵에 없던 새 수정/기능이 추가되면 → 새 섹션으로 기록
  - 우선순위나 계획이 바뀌면 → 해당 부분(권장 구현 순서 등)을 직접 수정
  - 상단 "이미 구현된 이론" 목록과 "핵심 데이터/상태 레퍼런스" 표도 새로 추가된 함수/데이터가 있으면 함께 갱신
