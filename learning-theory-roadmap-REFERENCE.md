> ⚠️ **이 파일은 REFERENCE(참고용) 문서입니다 — 더 이상 갱신하지 않습니다.**
> 앞으로 작업할 때(학습이론 추가/수정이든, 레이어화 작업이든) 아래 두 문서를 이렇게 나눠서 씁니다.
> - **이 파일(`learning-theory-roadmap-REFERENCE.md`)**: 지금까지 구현된 19개 학습이론의 설계 배경·구현
>   내역·주의사항을 찾아볼 때만 참고. 새 이론 이력을 여기 추가하지 말 것.
> - **`layering-roadmap.md`**: 3레이어(범용 학습 엔진 / 언어 학습 도메인 / 특정 언어) 아키텍처 전환 작업의
>   진행 상황을 기록하는 **현재 활성 로드맵**. 작업할 때마다 매번 갱신하는 문서는 이제 이쪽임.
>
> 학습이론 자체(예: 20번째 이론 추가)를 다시 다루게 되면, 그 작업 이력은 `layering-roadmap.md` 쪽에
> "레이어 전환과 무관한 이론 추가" 섹션으로 기록하거나, 필요 시 이 문서 이름을 유지한 채 새 REFERENCE
> 문서를 다시 분리할 수 있음.

---

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
| `STAGE_TO_WORD_MODE` | data.js, `STAGE_TO_HIRAGANA_MODE` 바로 다음 | §3 단계→단어 게임모드 매핑(A=exposure/B=quiz/C=spelling/D=sentence, E는 null) — 전부 기존 게임 재사용 |
| `WORD_AXIS_STAGE_CANDIDATES` | data.js, `STAGE_TO_WORD_MODE` 바로 다음 | 어휘 축 인출 단서 다변화용 B/C/D 단계별 후보 게임 목록(제시 모달리티가 서로 다른 2~3개, canonical 게임이 항상 첫 번째) |
| `LAST_VOCAB_MODALITY_KEY` / `saveLastVocabModality(mode)` / `loadLastVocabModality()` | logic.js, `WORD_STATS_KEY` 바로 다음 / `saveWordStats()` 바로 다음 | 어휘 축에서 방금 쓴 게임의 모달리티를 `localStorage`(`kotobaLastVocabModality`)에 저장/조회. `recordWordResult()`가 B/C/D 채널 기록 시마다 호출 |
| `pickWordAxisMode(stage)` | logic.js, `classifyLearnerTendency()` 바로 다음 | `WORD_AXIS_STAGE_CANDIDATES`에서 직전 모달리티와 다른 후보를 우선 선택(present 우선, 없으면 response) |
| `computeCharGameStage(ch)` / `computeActiveSetStageDistribution()` | logic.js, `getModesForStage()` 바로 다음 | 글자별 A~E 단계 판정과 활성 세트 전체 분포 집계 |
| `computeCombinedStageDistribution()` | logic.js, `classifyLearnerTendency()` 바로 위 | 히라가나 축(`computeActiveSetStageDistribution`)과 어휘 축(`computeVocabStageDistribution`) 분포를 합산 + 개별 축 결과도 함께 반환 |
| `classifyLearnerTendency(profile)` | logic.js, 위와 동일 위치 | 진단 4개 필드로 'cautious'/'normal'/'fast' 3분류 판정 |
| `pickNextGameForSession()` | logic.js, 위와 동일 위치 | §3 Phase 1 핵심 함수 — 히라가나+어휘 합산 분포에서 가장 부족한 단계를 찾고, 그 단계에서 더 뒤처진 축(`axis`)의 게임을 추천(어휘 축이면 `pickWordAxisMode()`로 모달리티 로테이션까지 반영) |
| `renderTodayRecommendation()` / `startRecommendedGame()` | logic.js, 위와 동일 위치 | 추천 결과 UI 렌더 및 "지금 시작하기" 클릭 처리. `#todayRecommendBanner`(index.html) |
| `wordStats` / `currentGameMode` | logic.js, `recordWordResult()` 근처 | §2 단계 판정 일반화(비-히라가나). `wordStats[jp] = {correct, wrong, channels:{B,C,D}, srsStage, lastReviewAt, sameDayCorrectCount, lastReviewCalendarDay}`, `localStorage` 키: `kotobaWordGameStats`(`loadWordStats()`/`saveWordStats()`). `currentGameMode`는 `switchMode()`가 매번 갱신하는 "지금 실행 중인 게임 모드". SRS 필드는 Part 4 §5에서 추가됨 — `srsUpdateStat()`(히라가나와 공용)이 갱신 |
| `wordSrsWeightedPick(words, count)` | logic.js, `saveWordStats()` 바로 다음 | Part 4 §5 어휘 축 SRS/망각곡선. 히라가나용 `srsWeightedPick`을 단어(jp 키) 기준으로 일반화 — `srsForgetProbability`로 각 단어의 망각확률을 구해 가중 뽑기. `createWordChoiceQuizGame()`의 `generateQuiz()`(퀴즈게임·오디오→이모지 공용)에서 사용 중 |
| `pairSrsWeightedPick(items, getJpPair)` | logic.js, `wordSrsWeightedPick()` 바로 다음 | 10번 섹션. `wordSrsWeightedPick`의 "단어 쌍"용 버전 — 후보를 구성하는 두 단어(`getJpPair(item)`이 반환하는 `[jp1, jp2]`)의 평균 망각확률을 가중치로 씀. 1개 전용(카운트 인자 없음). `sentenceGame`/`compoundGame`의 `buildItem()`에서 사용 |
| `computeWordGameStage(jp)` / `computeVocabStageDistribution()` | logic.js, `renderLtmDashboard()` 바로 다음 | `computeCharGameStage`/`computeActiveSetStageDistribution`의 단어 축 버전. 후자는 `Object.keys(wordStats)`만 집계 대상(아직 "활성 세트" 개념 없음) |
| `renderVocabStageOverview()` | logic.js, `renderLtmDashboard()` 바로 다음 | 어휘 A~E 분포를 "장기기억 현황" 패널 하단(`#ltmVocabStageBox`, index.html)에 렌더링 |
| `todayLearnedLog` / `logTodayLearned()` | logic.js, `computeSleepConsolidationNote()` 바로 다음 | Part 4 §3 수면 전 통합 프롬프트용 오늘의 학습 로그. `localStorage` 키: `kotobaTodayLearnedLog`(최근 30개, 날짜 바뀌면 자동 리셋). 히라가나 3채널 엔진의 `recordMistake`/`recordCorrect`와 `recordWordResult` 양쪽에서 호출됨 |
| `renderPreSleepPrompt()` / `openPreSleepView()` | logic.js, `todayLearnedLog` 바로 다음 | 저녁 시간대(21시~새벽4시)에 메인 메뉴 상단 카드(`#preSleepBanner`)를 띄우고, 클릭 시 정오답 표시 없는 "1분 요약" 오버레이(`#preSleepViewOverlay`)를 보여줌. 닫으면 `kotobaPreSleepDismissedDay`에 오늘 날짜 저장 |
| `GAME_MODALITY_MAP` / `GAME_MODALITY_LABELS` | data.js, `STAGE_TO_HIRAGANA_MODE` 바로 다음 | 인출 단서 다변화용. 게임 모드 34개(전부 `GAME_STAGE_MAP`과 동일 키) 각각을 `{present, response}` 모달리티로 재분류. `GAME_STAGE_MAP`과 별도 맵으로 분리(기존 값 비교 호출부 보호) |
| `getGameModality(mode)` / `formatGameModalityLabel(modality)` | logic.js, `getModesForStage()` 바로 다음 | `GAME_MODALITY_MAP` 조회 + "🔊 소리로 고르기" 형태의 표시 문구 조합. `pickNextGameForSession()`의 `modalityText` 필드와 "오늘의 추천" 배너(`.today-recommend-modality`)에서 사용 |
| `HIRAGANA_CONFUSION_GROUPS` | data.js, `HS_COL_HEADS` 바로 다음 | 자형이 비슷해 흔히 헷갈리는 히라가나 10묶음(청킹 행과 무관, 순수 자형 유사성 기준) |
| `isSameConfusionGroup(chA, chB)` / `spaceOutConfusionGroups(list)` | logic.js, `srsWeightedPick()` 바로 위 | 두 글자가 같은 혼동군인지 판별 / 이미 뽑힌 문제 순서를 "누가 뽑혔는지는 유지, 순서만" 재배치해 혼동군 연속 등장을 줄임. `createHiraganaStatsEngine()`의 `weightedPick`/`pickFromSubset`(hs/hw/hr 3개 엔진 공용) 반환 직전에 적용 |
| `recommendWsGridSizeFromSpan(span)` / `applyRecommendedWsGridSizeIfNeeded()` / `isWsSizeManuallySet()` / `markWsSizeManuallySet()` | logic.js, `wsGridSize` 선언 바로 다음(`initWordSearchGame()` 위) | §16 낱말찾기 격자 자동 추천. `workingMemorySpan`을 4~8로 clamp해 추천값 산출, 수동 선택 이력(`kotobaWsSizeManual`)이 없을 때만 `initWordSearchGame()`에서 적용. `setWordSearchGridSize()`(버튼 클릭)가 수동 선택 플래그를 기록 |
| `VOCAB_CONFUSION_GROUPS` | data.js, `HIRAGANA_CONFUSION_GROUPS` 바로 다음 | §17 어휘 축 혼동 단어 인터리빙용 10묶음(jp 배열). 가족 호칭·남매 호칭·대비어·각운 단어·의성어 등 실제 DICTIONARY jp 값으로 큐레이션 |
| `isSameConfusionGroupGeneric(keyA, keyB, groups)` / `spaceOutConfusionGroupsGeneric(list, groups, getKey)` | logic.js, `srsForgetProbability()` 바로 다음 | 히라가나(ch)/어휘(jp) 공용 혼동군 판별·순서 재배치 제너릭 헬퍼. `isSameConfusionGroup`/`spaceOutConfusionGroups`(히라가나, ch 기준)와 `isSameVocabConfusionGroup`/`spaceOutVocabConfusionGroups`(어휘, jp 기준)가 각각 이 헬퍼의 얇은 래퍼 |
| `excludeVocabConfusionGroup(pool, prevJp)` | logic.js, `spaceOutVocabConfusionGroups()` 바로 다음 | 직전 단어(prevJp)와 같은 혼동군을 pool에서 제외(다 제외되면 원래 pool 반환). 퀴즈/쓰기/발음/노출/수수께끼 게임이 "직전 단어" 변수 앞에서 이걸로 다음 후보를 거른 뒤 뽑음 |
| `avoidSimultaneousVocabConfusion(picked, pool)` | logic.js, `pickWordSearchWords()` 바로 다음 | 낱말찾기 전용 — 4단어가 한 화면에 동시 노출되므로, 이미 뽑힌 조합 안에서 같은 혼동군끼리 겹치면 겹치지 않는 다른 후보로 교체 |
| `estimateShadowPitchHz(buf, sampleRate)` / `startShadowPitchSampling()` / `stopShadowPitchSampling()` / `computeShadowRhythmNote(recognitionDurationMs, ttsElapsedMs)` / `computeShadowIntonationNote(samples)` | logic.js, `startShadowingGame()` 바로 앞 | §14 섀도잉 리듬·억양 정밀 비교. `SpeechRecognition`과 별개 마이크 스트림으로 150ms 간격 피치 샘플링, 자기상관 기반 근사 Hz 추정. 판정(`isCorrect`)에는 영향 없이 `shadowHandleResult()` 피드백 문구 끝에만 덧붙임 |
| `wordReviewSessionActive` / `wordReviewSessionWords` 등 | logic.js, `getWrongRate()` 바로 위 | §6 어휘 전용 복습 세트 상태. `getActiveWords()`가 이 플래그를 보고 단어 풀을 `wordReviewSessionWords`로 제한함(제한 결과 0개면 평소 범위로 복귀) |
| `findDictionaryWord(jp)` / `showWordDetail(jp)` / `closeWordDetail()` | logic.js, `toggleSelfReferenceEmoji()` 바로 다음 | §7 단어 상세보기. `renderSelfReferenceHtml(jp)`를 그대로 재사용해 자기참조 위젯을 담고, 채널별(B/C/D) 정답·오답과 `computeWordGameStage()` 기반 A~E 단계도 함께 보여줌. `#wordDetailBox`(index.html, `#gallery` 바로 아래) · 갤러리 카드의 `.gcard-detail-btn`(🔍)에서 호출 |
| `ROLEPLAY_SCENARIOS` | data.js, `MENU_CATEGORIES` 바로 앞 | Part 2 §4-1 미니 롤플레이 시나리오 3개(식당/편의점/길 묻기). 각 시나리오는 `nodes`(node id→{linePool, retryPool?, choices}) 그래프. `choices[].success:true`면 미션 완료 노드로 이동 |
| `initRoleplayGame()` / `chooseRoleplayOption(idx)` 등 | logic.js, `restartAdjectiveSet()` 바로 다음 | 미니 롤플레이 로직 전체(시나리오 목록→대화 진행→결과). `roleplayScenario`/`roleplayNodeId`/`roleplayAttempts` 전역 상태. `#roleplayMode`(index.html) · `GAME_STAGE_MAP.roleplay='D'` |
| `roleplayCompletions` / `recordRoleplayCompletion()` | logic.js, `roleplayAttempts` 선언 바로 다음 | 시나리오별 완료 횟수·최고 기록(최소 되묻기 횟수) 저장. `localStorage` 키: `kotobaRoleplayCompletions`. 시나리오 목록 카드의 배지로만 노출되고, 아직 §3 오케스트레이터와는 연동 안 됨 |
| `RoleplayRecognitionAPI` / `startRoleplaySpeechAttempt()` / `handleRoleplaySpeechResult()` | logic.js, `roleplayScenario` 선언 바로 다음 / `renderRoleplayNode()` 바로 다음 | 미니 롤플레이 발화 응답 지원. `normalizeRoleplayJp(text)`로 공백/문장부호 제거 후 인식된 문장과 `choices[].jp`를 포함 관계로 비교해 매칭. 지원 안 하는 브라우저는 `#roleplayMicBtn` 자체가 숨겨짐 |
| `SPELLING_TOTAL_QUESTIONS`(=10) / `spellingIndex` / `spellingMaxCombo` / `spellingCorrectCount` | logic.js, `spellingAdvanceTimer` 바로 다음 | §8 철자 맞추기 10문제 라운드 상태. `spellingIndex`가 `SPELLING_TOTAL_QUESTIONS`에 도달하면 `generateSpellingQuestion()` 맨 앞 가드가 `showSpellingResult()`로 분기 |
| `startSpellingRound()` / `showSpellingResult()` | logic.js, 위와 동일 위치 | §8 라운드 시작(상태 초기화 후 첫 문제)/종료(결과 화면 표시 + `scheduleNextVocabReviewRound()` 호출). `switchMode()`의 `spelling` 분기가 `startSpellingRound()`을 호출 — 새 진입점을 추가할 땐 항상 이 함수를 거칠 것 |
| `getVocabReviewCandidateWords()` | logic.js, 위와 동일 위치 | SRS 망각확률 0.5 이상인 단어를 복습 후보로 반환(없으면 B/C단계 단어로 대체) — `getReviewCandidateChars()`의 어휘 축 버전 |
| `startVocabReviewSession()` / `playNextVocabReviewRound()` / `cancelVocabReviewSession()` | logic.js, 위와 동일 위치 | §6 세션 진행 제어. 퀴즈→문장맞히기(`VOCAB_REVIEW_GAME_TYPES`) 랜덤 순서로 2라운드 진행, `#vocabReviewSessionBanner`(index.html)에 진행 상황 표시 |
| `SELF_REFERENCE_EMOJI_OPTIONS` / `SELF_REFERENCE_NOTES_KEY` | logic.js, `showLtmDetail()` 바로 위 | 정교화·자기참조 효과용. 이모지 5개 후보 배열과 `localStorage` 키(`kotobaSelfReferenceNotes`, `{ch: emoji}` 형태) |
| `loadSelfReferenceNotes()` / `saveSelfReferenceNotes(notes)` | logic.js, 위와 동일 위치 | 자기참조 메모 로드/저장(글자별 선택 이모지 1개). 매 호출마다 `localStorage`를 직접 읽고 쓰는 무상태 헬퍼(전역 캐시 없음) |
| `renderSelfReferenceHtml(ch)` / `toggleSelfReferenceEmoji(ch, emoji)` | logic.js, 위와 동일 위치 | 장기기억 상세보기용 이모지 선택 위젯 렌더 / 클릭 시 선택·취소 토글 처리(같은 이모지 다시 누르면 취소). `showLtmDetail()`이 렌더 시 호출, 클릭 시 `#ltmSelfRefBox-{ch}`만 `outerHTML` 교체 |
| `MISTAKE_GARDEN_STAGES` / `MISTAKE_GARDEN_LAST_TIERS_KEY` | logic.js, `renderVocabStageOverview()` 바로 다음 | 오답 정원용. 씨앗(0)·새싹(1~2)·꽃(3~4)·나무(5~7) 4구간 정의와 `localStorage` 키(`kotobaMistakeGardenLastTiers`, `{ch: tierIndex}` 형태, 성장 애니메이션 비교용) |
| `streakState` / `STREAK_KEY` | logic.js, `logTodayLearned()` 바로 다음 | 스트릭(출석 도장판)용 상태 `{lastVisitCalendarDay, currentStreak, longestStreak}`. `localStorage` 키: `kotobaStreak` |
| `recordStreakActivity()` | logic.js, 위와 동일 위치 | 오늘 학습 활동(정답/오답 기록)이 하나라도 생길 때마다 `logTodayLearned()` 내부에서 호출됨. 오늘 이미 반영했으면 무시, 어제까지 연속이면 +1, 하루 이상 끊겼으면 1부터 재시작 |
| `getDisplayStreak()` / `renderStreakBoard(animateFreshStamp)` | logic.js, 위와 동일 위치 | 화면에 보여줄 "유효한" 스트릭 계산(끊긴 지 이틀 이상이면 0으로 표시, 저장값 자체는 건드리지 않음)과 최근 7일 도장판 렌더. `showTopMenu()`/앱 최초 로드 시 호출됨. `#streakBoard`(index.html) |
| `playIngredientTossAnimation(buttonEl, potEl, emoji)` / `playDishCompleteReaction(potEl)` / `resetCookPotVisual(potEl)` | logic.js, `createSequencePickQuizGame()` 바로 위 | 생성적 문장 조합 연출용. sentence/compound 두 게임이 공유하는 `pickPart()`/`generateQuiz()`에서 호출됨. 판정 로직과 무관한 순수 연출(재료가 냄비로 날아감 / 완성 시 냠냠 리액션 / 새 문제 시작 시 초기화). `#sentencePot`/`#compoundPot`(index.html) |
| `shadowQuestions` / `shadowIndex` / `shadowCorrectScore` / `shadowWrongScore` / `currentShadowWord` | logic.js, `stopHrListening()` 바로 다음 | 섀도잉 미니게임 전역 상태. `ShadowRecognitionAPI`(`hr`와 별도 인스턴스)로 음성 인식. `SHADOW_MIN_TIME_MS`(1200)~`SHADOW_MAX_TIME_MS`(4500), `SHADOW_WINDOW_RATIO`(1.2)로 인식 제한 시간 계산 |
| `speakTTS(text, {jitter, onEnd})` | logic.js | 기존 `jitter` 옵션에 더해 `onEnd` 콜백 신규 추가(섀도잉의 `showShadowingQuestion()`이 재생 종료 시점을 알아야 마이크를 자동으로 켤 수 있어서 추가함). 기존 호출부는 `onEnd`를 넘기지 않으므로 동작 변화 없음 |
| `renderMistakeGardenPanel()` | logic.js, 위와 동일 위치 | "오답 정원" 패널 렌더. `hwStats`(쓰기/회상 채널)의 `srsStage`만으로 판정하며, 직전 방문보다 자란 글자는 `mg-grew` 클래스로 강조 |
| `VOICE_BOOKMARK_DB_NAME`/`VOICE_BOOKMARK_STORE` | logic.js, `showLtmDetail()` 바로 위 | §Part3-1 소리 도감(프로덕션 효과)용 IndexedDB(`kotobaVoiceBookmarkDB`, 스토어 `recordings`, keyPath `ch`). 글자당 최신 녹음 1개만 `put()`으로 덮어써 보관 |
| `saveVoiceBookmark(ch, blob)` / `loadVoiceBookmark(ch)` / `deleteVoiceBookmark(ch)` | logic.js, 위와 동일 위치 | 녹음 Blob 저장/조회/삭제(모두 Promise 반환) |
| `renderVoiceBookmarkHtml(ch)` / `refreshVoiceBookmarkUI(ch)` / `renderVoiceBookmarkBodyHtml(ch, record)` | logic.js, 위와 동일 위치 | 상세보기 위젯 렌더. IndexedDB 조회가 비동기라 `showLtmDetail()`이 `box.innerHTML` 반영 직후 `refreshVoiceBookmarkUI()`를 별도 호출해 내용을 채움 |
| `startVoiceBookmarkRecording(ch)` / `stopVoiceBookmarkRecording()` | logic.js, 위와 동일 위치 | `MediaRecorder`로 녹음 시작(4초 자동 정지 또는 버튼으로 직접 정지)/정지. 마이크 권한 거부 시 안내 문구만 표시, 앱 진행에는 영향 없음 |
| `playVoiceBookmark(ch)` / `deleteVoiceBookmarkAndRefresh(ch)` | logic.js, 위와 동일 위치 | 저장된 녹음 재생(`URL.createObjectURL`) / 삭제 후 위젯 갱신 |

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
13. **§3 오케스트레이터 Phase 1 — 오늘의 추천(히라가나 축 + 어휘 축 연동)** (`computeCharGameStage`, `computeCombinedStageDistribution`, `classifyLearnerTendency`, `pickNextGameForSession`) ✅ 구현됨
14. **정교화·자기참조 효과 — "나의 하루와 닮은 점" 이모지 선택** (`renderSelfReferenceHtml`, `toggleSelfReferenceEmoji`) ✅ 구현됨
15. **오답 나무 키우기 — 복습 이행 유도 정원 UI** (`MISTAKE_GARDEN_STAGES`, `renderMistakeGardenPanel`) ✅ 구현됨
16. **프로덕션 효과 — 소리 도감(내 목소리 녹음 비교)** (`saveVoiceBookmark`/`loadVoiceBookmark`, `startVoiceBookmarkRecording`) ✅ 구현됨
17. **습관 형성 — 스트릭/출석 도장판** (`recordStreakActivity`, `renderStreakBoard`, `kotobaStreak`) ✅ 구현됨
18. **생성 효과 — 생성적 문장 조합 연출(요리 비유)** (`playIngredientTossAnimation`, `playDishCompleteReaction`) ✅ 구현됨
19. **섀도잉 — 듣는 즉시 곧바로 따라 말하기** (`initShadowingGame`, `startShadowAttempt`, `shadowHandleResult`) ✅ 구현됨

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

## 3. 오케스트레이터 로직 — "오늘 세션에 뭘 얼마나 줄까" ✅ Phase 1 구현 완료(히라가나 축 + 어휘 축 연동)

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
> - **🆕 후속 세션에서 완료**: 위 "미구현으로 남긴 것" 중 첫 항목(비-히라가나 게임으로 §2 단계
>   판정 일반화)은 §2(a)에서 `computeWordGameStage`/`computeVocabStageDistribution`로 먼저
>   구현됐고, 이번 세션에서 그 결과를 실제로 `pickNextGameForSession()`에 연결함
>   (`computeCombinedStageDistribution()` + `STAGE_TO_WORD_MODE` + `axis` 필드, Part 2
>   "다음 세션 시작 가이드" §6(c) 참고).
> - **미구현으로 남긴 것**:
>   - `workingMemorySpan`에 따라 `evaluateActiveSetExpansion()`의 확장 속도 자체를 조절하는 것
>     (계획엔 있었으나, 기존 확장 로직의 strictness 체계와 이중으로 얽히면 회귀 리스크가 있어
>     보류 — 다음 세션에서 별도로 검토).
>   - Phase 2(성과 기반 재보정)/Phase 3(주간 커리큘럼) — 계획대로 Phase 1이 실제로 며칠 굴러가며
>     데이터가 쌓인 뒤 재검토.
>   - A단계 추천이 정확히 "그 글자"를 겨냥하지 못하고 `exposure`(반복 노출 학습, 단어 기반)로
>     근사되는 한계가 있음 — 히라가나 전용 듣기 콘텐츠가 생기면 교체 검토.
>   - 어휘 축의 SRS stage/망각곡선 도입, 어휘 전용 복습 세트(E단계) — 위 "다음 세션 시작 가이드"
>     §6(c)의 "미구현으로 남긴 것" 참고.

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

### 4-1. 미니 롤플레이(상황극) 게임 — ③⑤⑧을 동시에 노리는 신규 게임 카테고리 제안 ✅ 프로토타입 구현 완료

> **구현 내역(이번 세션)**: 아래 설계안 그대로 시나리오 2개(식당에서 주문하기/편의점 계산대)로
> 프로토타입을 만듦. "다음 세션 시작 가이드" 7번에서 권장한 대로 "시나리오 1~2개로 작게 시작"함.
> - `data.js`: `MENU_CATEGORIES` 바로 앞에 `ROLEPLAY_SCENARIOS` 신규 추가 — 시나리오별 `nodes`
>   (node id→{linePool(NPC 대사 후보, 매번 무작위 선택), retryPool?(오답 시 되묻는 대사 후보),
>   choices(선택지 배열, 각 `{label, jp, next, success?}`)}) 그래프. `MENU_CATEGORIES`에 새 카테고리
>   `roleplay`(🎭 미니 상황극) 추가. `GAME_STAGE_MAP.roleplay='D'`(발화·전이의 상위 확장판),
>   `GAME_MODALITY_MAP.roleplay={present:'audio', response:'select'}` 추가.
> - `logic.js`: `speakTTS()`가 `opts.rate`/`opts.pitch`를 받으면 babyTalkMode 기본값 대신 그 값을
>   쓰도록 확장(NPC마다 다른 목소리 배정 — 화자 다양성 ④). `initRoleplayGame()`(시나리오 목록부터
>   시작) / `renderRoleplayScenarioList()` / `startRoleplayScenario(id)` / `renderRoleplayNode()`
>   (도착할 때마다 linePool·retryPool 중 무작위 대사 재생 + 선택지 버튼 렌더) /
>   `chooseRoleplayOption(idx)`(다음 노드로 이동, retryPool 노드로 빠지면 `roleplayAttempts`만
>   증가하고 게임은 끝나지 않음) / `replayRoleplayLine()` / `showRoleplayResult()` /
>   `retryRoleplayScenario()` / `backToRoleplayList()` 신규 추가. `switchMode()`에 `roleplay`
>   분기 추가(`initRoleplayGame()` 호출).
> - `index.html`: `#roleplayMode`(시나리오 선택/대화 진행/결과 3화면) 신규 추가, `.roleplay-*`
>   CSS 클래스 신규(디자인 시스템 변수 재사용). 학습이론 패널에 20번 카드(🎭) 신규 추가.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v38` → `koe-app-v39`로 올림.
> - **의도적으로 범위를 좁힌 것(설계안의 한계 섹션 그대로 반영)**: 선택형 응답만 지원(음성 응답은
>   다음 확장 후보 — 인식 정확도 이슈로 우선 텍스트 선택으로 미션 판정 신뢰도를 검증하는 게
>   안전하다고 판단). 진행 상태(`roleplayAttempts` 등)는 세션 한정 — SRS/장기기억 통계나 §3
>   오케스트레이터와 아직 연동하지 않음(GAME_STAGE_MAP에 D로만 등록해 "발화·전이 후보"로는
>   잡히되, 개별 노드 판정까지 그 시스템에 엮진 않음). 시나리오도 2개뿐이라, 반복 플레이 시
>   "정답 패턴 암기"로 흐를 위험은 여전히 남아있음(linePool로 대사는 다양화했지만 분기 구조
>   자체는 고정).
> **다음 세션 후보**: ~~(1) 시나리오 추가(길 묻기 등)~~ ✅ 완료 · ~~(2) 발화(음성 인식) 응답
> 지원 추가~~ ✅ 완료(이번 세션 — 아래 참고) · (3) 완료 기록의 "오늘의 추천" 오케스트레이터
> 연동은 여전히 보류(설계 결정 필요) · (4) NPC 대사 풀을 더 다양화해 반복 플레이 시 암기
> 위험을 더 낮추기.

> **구현 내역(이번 세션 — 발화 응답 지원)**:
> - `logic.js`: `RoleplayRecognitionAPI`(`window.SpeechRecognition || window.webkitSpeechRecognition`,
>   히라가나 읽기 게임의 `HrRecognitionAPI`와 같은 Web Speech API를 별도 이름으로 재사용) +
>   `normalizeRoleplayJp(text)`(공백·문장부호 제거 비교용 정규화) + `startRoleplaySpeechAttempt()`
>   (마이크 인식 시작) + `handleRoleplaySpeechResult(spoken)`(인식된 문장을 정규화해 지금 노드의
>   `choices[].jp`와 포함 관계로 비교, 매칭되면 `chooseRoleplayOption()`으로 그대로 넘김 — 매칭
>   안 되면 "다시 말하거나 버튼으로 골라도 돼요" 안내만 띄우고 게임은 그대로 유지) +
>   `stopRoleplayListening()`(노드 전환·화면 이탈·게임 종료 시 항상 호출해 이전 recognition
>   인스턴스가 다음 결과 처리에 끼어들지 않게 함 — `chooseRoleplayOption()`/`backToRoleplayList()`/
>   `renderRoleplayNode()`/`exitGameFullscreen()`에서 호출) 신규 추가.
> - `index.html`: 대화 화면에 `#roleplayMicBtn`(🎤 말해서 답하기) + `#roleplayMicStatus`(인식
>   상태·안내 문구) 신규 추가. 브라우저가 음성 인식을 지원하지 않으면 `renderRoleplayNode()`가
>   버튼 자체를 숨김. `.roleplay-mic-btn`/`.roleplay-mic-status` CSS 신규.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v40` → `koe-app-v41`으로 올림.
> - **설계 결정(왜 "버튼 탭"을 없애지 않았는가)**: 원래 설계안의 "인식 정확도 이슈를 고려해
>   텍스트 선택 응답과 음성 응답을 함께 지원하는 것을 권장" 그대로, 마이크 버튼은 기존 선택지
>   버튼 옆에 추가만 하고 대체하지 않음 — 인식이 안 되거나 지원하지 않는 환경에서도 항상
>   진행할 수 있어야 하기 때문.
> - **아직 남은 한계**: 매칭 로직이 "정규화 후 포함 관계"라는 단순 규칙이라, 선택지 문장이
>   서로 앞부분이 겹치는 경우(예: 이번 시나리오엔 없지만 향후 추가 시) 오매칭 가능성이 있음 —
>   시나리오를 늘릴 때는 같은 노드 안의 choices.jp가 서로 뚜렷이 구분되게(겹치지 않게) 설계할 것.

> **구현 내역(이번 세션 — 시나리오 추가 + 완료 기록)**:
> - `data.js`: `ROLEPLAY_SCENARIOS`에 세 번째 시나리오 `directions`(🗺️ 길 묻기 — 역 가는 길을
>   행인에게 묻는 대화) 추가. 기존 2개와 동일한 구조(linePool/retryPool/choices)라 로직 변경은
>   필요 없었음.
> - `logic.js`: `ROLEPLAY_COMPLETIONS_KEY`(`localStorage` 키: `kotobaRoleplayCompletions`) +
>   `loadRoleplayCompletions()`/`saveRoleplayCompletions()`/`recordRoleplayCompletion(scenarioId, attempts)`
>   신규 추가 — 시나리오별 `{timesCompleted, bestAttempts(가장 적었던 되묻기 횟수)}` 저장.
>   `initRoleplayGame()`이 시작할 때 `loadRoleplayCompletions()`를 호출하고, `showRoleplayResult()`가
>   미션 완료 시점에 `recordRoleplayCompletion()`을 호출해 기록을 갱신함.
> - `logic.js`/`index.html`: `renderRoleplayScenarioList()`가 완료 기록이 있는 시나리오 카드에
>   "✅ N번 완료 · 최고 기록 M번 되묻기" 배지(`.roleplay-scenario-badge`)를 추가로 보여줌.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v39` → `koe-app-v40`으로 올림.
> - **아직 하지 않은 것**: 이 완료 기록은 "장기기억 현황"이나 §3 오케스트레이터(`pickNextGameForSession`)
>   와는 연동하지 않음 — 시나리오 목록 화면 안에서만 참고용으로 보여주는 수준. 오케스트레이터
>   연동은 롤플레이를 위한 세 번째 "축"을 새로 만들거나 기존 어휘 축에 편입하는 설계 결정이
>   필요해서 범위를 넘어간다고 판단해 보류함 — 다음 세션에서 "롤플레이를 오케스트레이터의
>   D단계 후보 중 하나로 넣을지" 먼저 결정하고 진행할 것.


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
6. ~~§3은 반드시 Phase 1(규칙 기반)만 먼저~~ ✅ 구현 완료 — `pickNextGameForSession()`이 진단 4개 필드를 `classifyLearnerTendency()`로 연결하고, 히라가나 축 한정으로 "오늘의 추천" 배너까지 UI 연동됨. **Phase 2(성과 기반 재보정)/Phase 3(주간 커리큘럼)는 Phase 1이 실제로 며칠 굴러가며 데이터가 쌓인 뒤 재검토할 것.**
   - ~~(a) 비-히라가나 게임 카테고리로 §2 단계 판정 일반화~~ ✅ 구현 완료(재구현 세션):
     - `logic.js`: `wordStats`(모든 게임 공통 단어별 정답/오답 통계)를 기존 세션 한정 인메모리 객체에서 `localStorage`(`kotobaWordGameStats`, `loadWordStats()`/`saveWordStats()`) 영속 저장으로 전환. 히라가나의 hsStats/hwStats/hrStats 3채널 구조를 일반화하기 위해, 각 단어별로 `channels:{B,C,D}` 하위 통계를 신설.
     - 신규 전역 `currentGameMode`: `switchMode(mode)` 진입 시마다 갱신되어, 지금 실행 중인 게임 모드를 기억함.
     - `recordWordResult(word, isCorrect)`: 기존 `correct`/`wrong` 누적은 그대로 두고, `currentGameMode`를 `getGameStage()`(GAME_STAGE_MAP 조회)로 B/C/D 중 하나로 판별해 해당 채널에도 함께 누적하도록 확장. A단계(듣기 전용)나 매핑에 없는 모드는 채널 기록 대상 아님.
     - `computeWordGameStage(jp)`(신규, `computeCharGameStage`의 단어 축 버전): 기록이 없으면 'A', D·C 채널 모두 시도했고 둘 다 정확도 70% 이상이면 'E', D 채널 시도 이력 있으면 'D', C 채널 시도 이력 있으면 'C', 그 외 'B'.
     - `computeVocabStageDistribution()`(신규, `computeActiveSetStageDistribution`의 단어 축 버전): `Object.keys(wordStats)`(실제로 한 번이라도 등장한 단어)만 집계 대상으로 A~E 분포 산출. 히라가나처럼 "활성 세트" 개념이 아직 단어 쪽엔 없어 대신 이 방식으로 근사함 — 그래서 여기선 'A'가 항상 0으로 나오는 게 정상.
     - `renderVocabStageOverview()`(신규): `renderLtmDashboard()`에서 함께 호출되어 "장기기억 현황" 패널 하단에 어휘 A~E 분포 칩을 렌더링.
     - `index.html`: `#menuLtmLevel` 패널 맨 아래에 `.ltm-vocab-stage-box`(헤더+분포 칩 행+설명) 신규 추가, 디자인 시스템 CSS 변수 재사용.
     - **아직 미반영(다음 세션 후보)**: §3 오케스트레이터(`pickNextGameForSession`)는 여전히 히라가나 축 전용이라, 이번에 만든 어휘 축 A~E 분포는 아직 "오늘의 추천" 배너 로직에는 연결되지 않음(현황 표시까지만). 어휘 축에도 SRS stage/망각곡선을 도입해 `srsForgetProbability` 수준으로 정교화하는 것도 남은 과제.
   - (b) Part 3/Part 4에 정리된 신규 아이디어(오답 나무, 소리 도감, 수면 전 프롬프트 등) 순차 구현 — 완료(Part 3/4 전체 참고).
   - (c) **어휘 축을 "오늘의 추천" 배너에 연결하는 작업** ✅ 구현 완료(이번 세션):
     - `data.js`: `STAGE_TO_HIRAGANA_MODE` 바로 다음에 `STAGE_TO_WORD_MODE` 신규 추가(A~D 단계별
       대표 단어 게임 매핑: A=exposure, B=quiz, C=spelling, D=sentence, E=null — 전부 이미
       `GAME_STAGE_MAP`에 정의돼 있던 "특정 히라가나 글자가 아니라 단어 자체를 다루는" 기존 게임을
       그대로 재사용, 신규 게임 모드는 만들지 않음).
     - `logic.js`: `classifyLearnerTendency()` 바로 위에 `computeCombinedStageDistribution()` 신규
       추가 — `computeActiveSetStageDistribution()`(히라가나 축)과 `computeVocabStageDistribution()`
       (어휘 축) 분포를 합산하고, 개별 축 결과도 함께 반환.
     - `pickNextGameForSession()`을 합산 분포 기준으로 "오늘 가장 부족한 단계"를 정하도록 수정한 뒤,
       그 단계에서 두 축(히라가나/어휘) 중 목표 비율 대비 더 크게 뒤처진 쪽을 골라 해당 축의 대표
       게임을 추천하도록 확장(`axis: 'hiragana'|'vocab'|null` 필드 추가). 한쪽 축에 데이터가
       전혀 없으면(활성 세트 없음/만난 단어 없음) 그 축은 후보에서 자동 제외됨. E단계는 기존과
       동일하게 히라가나 복습 세트(`startReviewSession`)로 안내(아직 단어 전용 복습 세트가 없음).
     - `index.html`: "학습이론" 패널 13번(오케스트레이터) 카드 설명 문구를 "히라가나 학습에만
       우선 적용"에서 "히라가나 학습과 단어 학습을 함께 보고 추천"으로 갱신.
     - `sw.js`: `CACHE_NAME`을 `koe-app-v31` → `koe-app-v32`로 올림.
     - **미구현으로 남긴 것(의도적 범위 제한)**: 어휘 축에 SRS stage/망각곡선을 도입해
       `srsForgetProbability` 수준으로 정교화하는 것은 이번에도 하지 않음 — 지금은
       `computeWordGameStage()`의 단순 채널 시도 여부/정확도 판정에 의존하므로, "얼마나
       부족한가"의 정밀도가 히라가나 축보다 낮은 근사치라는 한계가 여전히 있음. 그리고
       어휘 전용 복습 세트(E단계)도 아직 없어 E단계 추천은 여전히 히라가나 복습 세트로만
       안내됨 — 둘 다 다음 세션 후보로 남겨둠.
   - (d) **어휘 축 인출 단서 다변화(모달리티 가중치)를 실제 추천 로직에 연결** ✅ 구현 완료(이번 세션):
     - `data.js`: `STAGE_TO_WORD_MODE` 바로 다음에 `WORD_AXIS_STAGE_CANDIDATES` 신규 추가 —
       B/C/D 단계별로 제시 모달리티(present)가 서로 다른 대표 후보 2~3개를 선별(canonical 게임을
       항상 첫 번째로 포함). kanjiCards(한자 축)나 worksheet/trace/dakuonTest(히라가나 전용 자산
       의존) 같은 게임은 후보에서 제외.
     - `logic.js`: `LAST_VOCAB_MODALITY_KEY`(`localStorage` 키: `kotobaLastVocabModality`) +
       `saveLastVocabModality(mode)`/`loadLastVocabModality()` 신규 추가. `recordWordResult()`가
       B/C/D 채널을 기록할 때마다 방금 쓴 게임 모드의 모달리티를 저장하도록 확장.
     - `pickWordAxisMode(stage)` 신규 추가 — `WORD_AXIS_STAGE_CANDIDATES`에서 직전 모달리티와
       present가 다른 후보를 최우선으로, 없으면 response가 다른 후보를 찾아 반환. `pickNextGameForSession()`의
       어휘 축 분기가 `STAGE_TO_WORD_MODE[stage]` 대신 이 함수를 호출하도록 변경.
     - `index.html`: 오케스트레이터 카드(13번) 적용 문구에 한 줄 추가.
     - `sw.js`: `CACHE_NAME`을 `koe-app-v32` → `koe-app-v33`으로 올림.
     - **미구현으로 남긴 것**: 히라가나 축은 원안대로 그대로 둠(단계당 게임 1개뿐이라 로테이션
       대상이 아님). 복습 세트(E단계) 모달리티 로테이션도 그대로 둠(이미 3가지를 랜덤 순서로
       섞어 최적이라는 기존 결론 유지).
7. ~~§4-1 미니 롤플레이는 오케스트레이터와 독립적으로 먼저 프로토타입을 만들어봐도 무방~~ ✅ 프로토타입 구현 완료(이번 세션, 시나리오 2개 — 자세한 내역은 §4-1 참고). **다음 세션 후보**: 시나리오 추가, 음성 응답 지원, 완료 기록의 오케스트레이터 연동, 대사 풀 추가 다양화.

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

## 1. 프로덕션 효과 — 소리 도감 / 자기 음성 녹음 비교 ✅ 구현 완료

> **구현 내역**: 이전 세션에서 `index.html`에 CSS(`.ltm-detail-voice` 등)와 "학습이론" 패널
> 설명 카드(16번, "소리 도감 — 내가 낸 소리는 더 오래 남아요")까지만 먼저 작성되고
> `logic.js` 쪽 실제 로직 연결이 누락된 채로 세션이 끊겨 있었음. 이번 세션에서 그 누락된
> `logic.js` 구현을 완료함.
> - `logic.js`: `showLtmDetail()` 바로 위에 IndexedDB 기반 저장소(`VOICE_BOOKMARK_DB_NAME` =
>   `kotobaVoiceBookmarkDB`, 스토어 `recordings`, keyPath `ch`)와 `saveVoiceBookmark`/
>   `loadVoiceBookmark`/`deleteVoiceBookmark`(모두 Promise 반환) 신규 추가. `localStorage`
>   대신 IndexedDB를 택한 이유는 오디오 Blob을 다루기 위함(로드맵 원안의 "용량이 크면
>   IndexedDB" 조건 반영). `put()`이 같은 `ch` 키를 덮어써 글자당 최신 녹음 1개만 유지.
> - `renderVoiceBookmarkHtml(ch)`(자리표시자 렌더) / `refreshVoiceBookmarkUI(ch)`(IndexedDB
>   조회 후 실제 내용 채움) / `renderVoiceBookmarkBodyHtml(ch, record)`(녹음 유무별 버튼 HTML)
>   3개 함수로 분리 — IndexedDB 조회가 비동기라 `showLtmDetail()`이 `box.innerHTML`을 먼저
>   반영한 직후 `refreshVoiceBookmarkUI(ch)`를 별도 호출하는 2단계 렌더 방식을 사용함
>   (기존 `renderSelfReferenceHtml`처럼 완전 동기로는 불가능했기 때문).
> - `startVoiceBookmarkRecording(ch)`: `getUserMedia({audio:true})` → `MediaRecorder` 녹음
>   시작, 아이가 멈추는 걸 잊어도 4초 뒤 자동 정지(`stopVoiceBookmarkRecording()`), 버튼을
>   다시 눌러 직접 멈출 수도 있음. 마이크 권한 거부/미지원 브라우저는 안내 문구만 보여주고
>   앱 다른 기능에는 영향 없음(`voice-unsupported` 문구).
> - `playVoiceBookmark(ch)`: 저장된 Blob을 `URL.createObjectURL`로 재생, "🔊 원어민 발음"
>   버튼은 기존 `speakTTS(ch)`를 그대로 재사용(신규 로직 없음).
> - `showLtmDetail(ch, status)` 상세보기 HTML 맨 끝(자기참조 위젯 다음)에 위젯을 이어붙이고,
>   렌더 직후 `refreshVoiceBookmarkUI(ch)` 호출. `closeLtmDetail()`에는 상세보기를 닫을 때
>   녹음 중이었다면 `stopVoiceBookmarkRecording()`으로 마이크 스트림을 정리하는 코드 추가.
> - `index.html`: CSS는 이전 세션에서 대부분 준비돼 있었고, 이번 세션엔 문서에서 참조하지만
>   빠져 있던 `.voice-note`(녹음 시점 안내 문구) 클래스만 추가로 보완함.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v27` → `koe-app-v28`로 올림.
> - **미구현으로 남긴 것**: 로드맵 원안의 "`hrStats.getStat(ch)`에 `hasVoiceBookmark` 플래그를
>   얹어 장기기억 판정 참고 정보로 노출"은 하지 않음 — 통계 엔진 내부 객체 구조를 건드리면
>   저장/불러오기(`localStorage` 직렬화) 전반에 회귀 리스크가 생기는 데 비해, 위젯 자체가
>   이미 녹음 유무·날짜를 직접 보여주고 있어 별도 플래그 없이도 정보 전달 목적은 달성된다고
>   판단함. 필요해지면(예: 장기기억 등급 표시줄에 🎙️ 아이콘 추가 등) 다음 세션에서 별도로
>   검토 권장.

**개념**: 정보를 눈으로 보거나 귀로 듣기만 할 때보다, 스스로 소리 내어 산출(production)한 정보가 더 오래 기억됨(production effect). 원어민 음성과 자신의 발음을 나란히 비교해 들으면 산출 과정 자체가 한 번 더 인출 연습이 됨.

**현재 갭**: 읽기(발화) 게임(`hrStats`)은 음성인식으로 정오답만 판정할 뿐, 사용자의 실제 음성을 저장하거나 원어민 TTS와 비교해 들려주는 기능이 없음. `HIRAGANA_MNEMONICS`(이중부호화)처럼 "내가 만든 소리"를 저장하는 채널이 아예 없음.

**구현 계획**:
- 단어 카드/장기기억 상세보기(`showLtmDetail`) 화면에 "🎙️ 내 목소리로 녹음하기" 버튼 추가 — 브라우저 `MediaRecorder` API로 짧은 음성(글자 1개 또는 샘플 단어 발음)을 녹음
- 녹음본은 `localStorage`(또는 `IndexedDB`, 용량이 크면)에 글자별로 저장 — 새 키(예: `kotobaVoiceBookmark`) 신설, 기존 `hrStats`류 오염 방지
- "🔊 원어민 발음" / "🎤 내 발음" 두 버튼을 나란히 배치해 번갈아 재생 비교
- 인출 강도를 높이려면 저장 시점에 이미 있는 `hrStats.getStat(ch)`에 `hasVoiceBookmark` 플래그만 살짝 얹어 장기기억 판정에 참고 정보로만 노출(가중치에는 영향 주지 않는 것을 권장 — 녹음 여부가 실력을 뜻하진 않으므로)
- **연동 지점**: `showLtmDetail()`, 읽기(발화) 게임 결과 화면(`showHiraganaReadQuestion` 계열), 신규 `localStorage` 키

**우선순위**: 높음 (완료 — LTM 채널 중 유일하게 비어 있던 "자기 산출 저장" 축을 채움)
**난이도**: 중 (완료 — IndexedDB 기반 저장, 마이크 권한 실패 시 안내 문구로 우회)
**주의사항**: 아이 음성 녹음은 민감할 수 있으므로 기기 로컬 저장만 하고 서버 전송/공유 기능은 넣지 않을 것. 저장 용량 상한(예: 글자당 최신 1개만 유지)을 반드시 둘 것. → 구현도 이 원칙대로 IndexedDB 로컬 저장만 하고, `put()` 덮어쓰기로 글자당 1개만 유지함.

---

## 2. 섀도잉 미니게임 (Shadowing) ✅ 구현 완료

> **구현 내역**: 로드맵 원안대로 신규 `shadowing` 게임 모드를 추가하되, 기존 `HrRecognitionAPI`
> 인스턴스 자체를 공유하진 않고(히라가나 읽기와 생명주기가 얽히면 회귀 리스크가 커서) 같은
> 패턴(`window.SpeechRecognition || window.webkitSpeechRecognition`)의 별도 인스턴스
> `ShadowRecognitionAPI`로 구현함.
> - `logic.js`: `stopHrListening()` 바로 다음에 섀도잉 전역 상태(`shadowQuestions`,
>   `shadowIndex`, `shadowCorrectScore`, `shadowWrongScore` 등, `hr` 계열 변수 선언부
>   바로 아래 위치)와 `initShadowingGame()`/`startShadowingGame()`/`showShadowingQuestion()`/
>   `startShadowAttempt()`/`shadowHandleResult()`/`shadowShowResult()`/`stopShadowListening()`
>   신규 추가. `switchMode()`에 `shadowing` 분기 추가(최근 추가된 모드들처럼 tab-btn 인덱스는
>   쓰지 않음 — kanjiCards/adjective 등과 동일 패턴).
> - **"재생 길이 × 1.2" 구현 방법**: `speakTTS()`에 `opts.onEnd` 콜백을 새로 추가(기존
>   호출부는 옵션을 안 넘기므로 전혀 영향 없음). 재생 시작 직전 시각을 기록해뒀다가, `onEnd`가
>   불릴 때(=재생이 실제로 끝난 시각) 경과 시간을 계산해 그 값 × 1.2를 인식 제한 시간으로 사용
>   (`SHADOW_MIN_TIME_MS` 1200ms ~ `SHADOW_MAX_TIME_MS` 4500ms로 하한/상한을 둠). 이렇게 하면
>   브라우저 TTS 엔진이나 단어 길이가 달라져도 실제 재생 시간에 맞춰 자연스럽게 조정됨.
> - **판정**: `pronounce` 모드와 동일하게 `normalizePronounceText()` + `norm.includes(target.jp)`로
>   포함 여부만 확인(로드맵 지시대로 타이밍/억양 정밀 비교는 하지 않음).
> - **1회 시도로 제한**: `hr`(히라가나 읽기)은 2번 기회를 주지만, 섀도잉은 "그 순간 곧바로
>   따라 하는 것" 자체가 핵심이라 재도전을 주지 않음(1차 구현 범위를 넘어서는 확장으로 남겨둠).
> - 단어 소스는 `getActiveWords()`에서 무작위 10개 추출(활성 단어 목록 전체 재사용, 히라가나
>   읽기처럼 글자별 통계 그리드는 이번 범위에서 만들지 않음 — 과설계 방지).
> - `data.js`: `MENU_CATEGORIES`의 "말하기(음성 인식)" 카테고리에 `shadowing` 게임 항목 추가,
>   `GAME_STAGE_MAP`에 `shadowing: 'D'`, `GAME_MODALITY_MAP`에
>   `shadowing: { present: 'audio', response: 'speak' }` 등록해 §2/§4 파이프라인에 편입.
> - `index.html`: 히라가나 읽기 게임 마크업 뒤에 `#shadowingMode` 신규 추가(시작/문제/결과
>   3화면 구조는 기존 `hr`/`hs`/`hw` 드릴 화면 패턴과 `showDrillScreen()`을 그대로 재사용).
>   `.shadow-recognized-text` CSS를 추가해 `.hr-recognized-char`(원래 히라가나 한 글자용)를
>   단어 길이에 맞게 줄바꿈 가능하도록 오버라이드. "학습이론" 패널에 19번째 카드(섀도잉,
>   Shadowing Practice) 추가, 안내 문구 "18가지" → "19가지"로 갱신.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v30` → `koe-app-v31`로 올림.
> - **미구현으로 남긴 것(의도적 범위 축소)**: 타이밍/피치/억양 정밀 비교, 글자별 통계 그리드,
>   재도전(다시 듣기) 기능은 로드맵 원안과 위 주의사항대로 1차 구현 범위 밖으로 남겨둠.

**개념**: 원어민 음성을 듣는 즉시 거의 동시에 따라 말하는 섀도잉은 단순 듣기보다 부호화 깊이가 크고, 리듬·억양까지 함께 체화시켜 발화(production) 인출 경로를 강화함.

**현재 갭**: 읽기(발화) 게임은 "글자를 보고 소리 내어 읽기"만 있고, "먼저 듣고 곧바로 따라 말하기" 흐름이 없음. 타이밍/억양 비교 피드백도 없음.

**구현 계획**:
- 신규 게임 모드(`shadowing`) 추가: TTS로 짧은 단어/문장 재생 → 재생 종료 직후 일정 시간(예: 재생 길이 ×1.2) 동안 마이크 활성화 → 음성인식 결과와 정답 텍스트 유사도만 우선 판정(정밀한 타이밍/피치 비교는 1차 구현 범위 밖으로 두고 추후 확장)
- 기존 음성인식 인프라(`HrRecognitionAPI` 계열, 읽기 게임에서 이미 사용 중) 재사용
- `speakTTS`의 `jitter` 옵션을 그대로 활용해 매번 살짝 다른 속도/피치로 재생 → 부호화 다양성과 자연스럽게 결합
- `GAME_STAGE_MAP`(data.js)에 `shadowing`을 D단계(발화·전이)로 등록해 §2 파이프라인에 편입
- **연동 지점**: 신규 게임 모드 등록(`MENU_CATEGORIES`, `launchGame`/`switchMode`), `speakTTS`, `HrRecognitionAPI` 계열, `GAME_STAGE_MAP`

**우선순위**: 중 (완료 — 기존 발화 인프라 재사용 가능하나, 신규 게임 흐름 자체를 새로 짜야 해서 §1의 소리 도감보다는 공수가 컸음)
**난이도**: 중~높음 (완료 — "재생 길이 × 1.2"는 `speakTTS`에 `onEnd` 콜백을 추가해 실측 시간으로 계산하는 방식으로 해결)
**주의사항**: 1차 구현은 "정답 여부"만 판정하고, 타이밍/억양 정밀 비교는 과욕부리지 말 것 — 회귀 리스크와 공수 대비 효과를 보며 단계적으로 확장. 구현도 이 원칙대로 포함 여부 판정과 1회 시도로만 한정함.

---

## 3. 생성적 문장 조합 미니게임 (단어 재료 → 문장 요리) ✅ 구현 완료

> **구현 내역**: 로드맵 원안의 "드래그" 방식 대신, 기존 클릭 선택(`pickPart`) 흐름은 그대로 두고
> 클릭 순간의 화면 좌표를 기준으로 "재료가 날아 들어간다"는 연출을 얹는 방식으로 구현함(터치
> 환경에서 드래그보다 클릭이 이미 잘 작동하고 있어 입력 방식 자체는 바꾸지 않는 게 안전하다고 판단).
> - `logic.js`: `createSequencePickQuizGame()` 바로 위에 `playIngredientTossAnimation(buttonEl, potEl, emoji)`,
>   `playDishCompleteReaction(potEl)`, `resetCookPotVisual(potEl)` 3개 신규 함수 추가. sentence/compound
>   두 게임이 공유하는 `pickPart()`(정답 선택 시)와 `generateQuiz()`(새 문제 시작 시)에서 호출됨 —
>   **판정 로직(정답 비교, 점수, 콤보, 타이머, SRS 기록)은 한 줄도 건드리지 않음**, 함수 호출 추가만 함.
> - **연동 지점**: `pickPart()`에서 정답 카드를 고를 때마다(1번째·2번째 모두) `playIngredientTossAnimation()`
>   호출 → 카드의 이모지가 냄비 위치까지 날아가는 임시 요소 생성 후 자동 제거. 두 재료가 모두 맞으면
>   기존 `cfg.celebrate()`(풀스크린 축하) 바로 다음 줄에 `playDishCompleteReaction()`을 추가로 호출해
>   냄비가 크게 튀며 "😋" 리액션이 떠오름. `generateQuiz()` 시작 시 `resetCookPotVisual()`로 냄비를
>   빈 상태로 되돌림.
> - `index.html`: sentence/compound 두 게임 화면의 기존 `.sentence-progress`(정답 순서 표시줄)를
>   `.sentence-progress-row`로 감싸고 옆에 `.cook-pot-wrap > .cook-pot`(냄비 이모지, id는
>   `sentencePot`/`compoundPot`) 신규 추가. `.ingredient-toss`/`.cook-pot-bump`/`.cook-pot-complete`/
>   `.cook-bite-reaction` CSS와 `ingredientTossFly`/`cookPotBump`/`cookPotComplete`/`cookBitePop`
>   키프레임 애니메이션 신규 추가. "학습이론" 패널에 18번째 카드(생성적 문장 조합 연출, Generation
>   Effect) 신규 추가, 상단 안내 문구 "17가지" → "18가지"로 갱신.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v29` → `koe-app-v30`으로 올림.
> - **미구현으로 남긴 것(의도적 범위 축소)**: 로드맵 원안의 "드래그" 인터랙션 자체는 만들지 않음
>   (클릭 좌표 기반 연출로 대체, 위 설명 참고). 타이밍/억양 정밀 비교 같은 확장도 이번 범위 밖.

**개념**: 이미 아는 단어를 스스로 조합해 새 문장을 만드는 과정은 처리 수준 이론에서 말하는 "의미적·생성적 부호화"에 해당해, 완성된 문장을 보기만 하는 것보다 기억에 오래 남음.

**현재 갭**: 기존 `sentence`/`compound` 카테고리가 이미 "문장·단어 조합(생성/전이)" 성격이지만, 재료를 순서대로 골라 담아 "완성"하는 게이미피케이션 연출(요리/조립 비유, 완성 애니메이션)은 없어 생성 과정의 동기부여가 약함.

**구현 계획**:
- 기존 `sentence`/`compound` 게임 로직(단어 선택 → 문장 완성 판정)은 그대로 재사용하고, **연출 레이어만 추가**: 단어 카드를 냄비/도마 이미지 위로 드래그하면 "재료 투입" 애니메이션 → 문장 완성 시 캐릭터가 먹는 리액션
- 기존 판정 로직을 건드리지 않는 것이 핵심 — 새 함수보다는 기존 완성 콜백 지점에 연출 트리거만 추가
- **연동 지점**: `sentence`/`compound` 게임의 완성 판정 콜백 지점(logic.js에서 해당 함수 검색 필요), CSS 애니메이션 신규 추가

**우선순위**: 낮음~중 (완료 — 인지적 이득은 기존 게임과 동일, 주로 동기부여/지속 참여 효과)
**난이도**: 낮음 (완료 — 판정 로직 변경 없이 연출 함수 호출만 추가)
**주의사항**: 연출에 시간을 쏟다가 판정 로직을 실수로 건드리지 않도록 주의 — 기존 `sentence`/`compound` 회귀 테스트 필수. 구현도 이 원칙대로 기존 `pickPart`/`generateQuiz`의 기존 코드는 삭제·수정 없이 호출 추가만 함.

---

## 4. 오답 나무 키우기 — 복습 이행 유도 UI ✅ 구현 완료

> **구현 내역**: 로드맵 원안대로 새 판정 로직 없이 기존 `srsStage`를 그대로 재사용함.
> - `logic.js`: `renderVocabStageOverview()` 바로 다음에 `MISTAKE_GARDEN_STAGES`(씨앗 0단계·새싹
>   1~2단계·꽃 3~4단계·나무 5~7단계 4구간), `MISTAKE_GARDEN_LAST_TIERS_KEY`(`localStorage` 키:
>   `kotobaMistakeGardenLastTiers`), `loadMistakeGardenLastTiers()`/`saveMistakeGardenLastTiers()`,
>   `renderMistakeGardenPanel()` 신규 추가. **판정 기준은 `hwStats`(쓰기/회상 채널)의 `srsStage`만
>   사용** — `computeLtmStatus()`와 동일하게 회상이 재인보다 엄격한 증거라는 원칙을 그대로 따름.
> - `renderMistakeGardenPanel()`은 `HS_TABLE_ROWS`/`HS_COL_HEADS`를 재사용해 기존 장기기억
>   현황판과 동일한 46자 그리드 레이아웃으로 그리되, 칸 안쪽은 4단계 식물 이모지+글자로 표시.
>   패널을 열 때마다 직전 방문 시점의 단계(`kotobaMistakeGardenLastTiers`)와 비교해서 **이번에
>   더 자란 글자만** `mg-grew` 클래스로 짧게 튀어오르는 애니메이션을 줌(별도 "물주기" 트리거
>   콜백을 복습 세트 완료 지점에 걸지 않고, 패널을 열 때 비교하는 더 단순하고 회귀 리스크가
>   낮은 방식을 택함). 렌더 직후 이번 방문의 단계를 다음 비교 기준으로 저장.
> - "🔁 물 주러 가기" 버튼은 신규 로직을 만들지 않고 **기존 `startReviewSession()`을 그대로 호출**.
> - `index.html`: `#menuLtmLevel`과 `#menuTheoryLevel` 사이에 `#menuMistakeGardenLevel` 패널
>   신규 추가(요약 칩 4개 + 그리드 + 복습 세트 시작 버튼, `.video-desc`/`.ltm-summary-row`/
>   `.ltm-review-launch`/`.hs-stat-grid` 등 기존 클래스 재사용). `.mg-stat-cell`/`.mg-cell-emoji`/
>   `.mg-cell-ch`/`.mg-tier-0~3`/`.mg-grew`(+`@keyframes mgGrewPulse`) CSS 신규 추가. 게임
>   전체화면 시 숨기는 `body.game-fullscreen` 선택자 목록에도 새 패널 추가.
> - `logic.js`: `hideAllMenuPanels()` 배열과 `TOP_MENU_EXTRA_ITEMS`에 "🌳 오답 정원" 카드
>   (`openMenuPanel('menuMistakeGardenLevel')` + `renderMistakeGardenPanel()`) 신규 등록.
>   "학습이론" 패널에 오답 정원 설명 카드(15번) 신규 추가, 상단 안내 문구 "14가지" → "15가지"로 갱신.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v26` → `koe-app-v27`로 올림.
> - **미구현으로 남긴 것**: 로드맵 원안의 "복습 세트에서 맞히는 즉시 물주기 애니메이션"은
>   `startReviewSession`/`playNextReviewRound` 내부에 훅을 거는 대신, 패널을 열 때 직전 방문과
>   비교하는 방식으로 단순화함 — 기존 복습 게임 3종(카드찾기/쓰기/읽기)의 정답 처리 콜백을
>   전부 건드리지 않아 회귀 리스크가 훨씬 낮음. 실시간 애니메이션이 꼭 필요하면 다음 세션에서
>   `hwRecordCorrect`류 호출 지점에 별도 훅을 추가하는 방향으로 확장 가능.

**개념**: 이 항목 자체는 새로운 기억 메커니즘이 아니라, **이미 구현된 SRS/복습 세트(`srsForgetProbability`, `startReviewSession`)가 실제로 수행되게 만드는 행동 유도 장치**임. 망각곡선 기반 모델은 복습이 실제로 일어나야 의미가 있으므로, 복습 이행률을 높이는 UI는 간접적이지만 실질적인 LTM 개선 효과가 있음.

**현재 갭**: 틀린 단어/글자는 통계 엔진(`getStat`)에 기록되고 복습 후보 선정(가중 뽑기)에는 반영되지만, 아이 입장에서 "내가 틀린 것들이 지금 어떤 상태인지"를 시각적으로 확인하고 복습을 하고 싶게 만드는 화면이 없음.

**구현 계획**:
- 신규 패널(`#menuMistakeGardenLevel`) 추가: `hsStats`/`hwStats`/`hrStats`에서 `srsStage`가 낮거나 최근 오답인 글자를 "씨앗~새싹~꽃~나무" 4단계 정도로 매핑해 정원 그리드로 표시
- 복습 세트(`startReviewSession`)에서 해당 글자를 맞히면 "물주기" 애니메이션과 함께 단계 상승 — **기존 `srsUpdateStat`의 stage 값을 그대로 재사용**(새 별도 상태를 만들지 않고 기존 stage를 시각적으로 매핑만 다시 하는 방식을 권장, 데이터 이중관리 방지)
- **연동 지점**: `computeLtmStatus`/`getStat` (기존 stage 값 조회), `startReviewSession` 완료 콜백, `TOP_MENU_EXTRA_ITEMS`(신규 메뉴 카드 등록)

**우선순위**: 높음 (완료 — 기존 통계 데이터를 그대로 재사용해 새 정원 UI만 얹으면 되고, 복습 이행 동기부여 효과가 커서 구현 비용 대비 효과가 좋음)
**난이도**: 낮음~중 (완료 — 판정 로직은 `hwStats.srsStage` 그대로 재사용, 시각화 UI와 성장 비교 로직만 신규)
**주의사항**: "틀린 것"을 부정적으로 느끼지 않도록 톤을 "키운다"는 긍정적 프레임으로 유지 — 오답 자체를 벌점처럼 보이게 하지 말 것. 구현도 이 원칙에 맞춰 색상·문구를 전부 긍정적 성장 표현으로 통일함.

---

## 5. 스트릭 / 출석 도장판 — 학습 습관 형성 ✅ 구현 완료

> **구현 내역**: 로드맵 원안 그대로 배지/테마 해금은 1차 범위에서 제외하고, 스트릭 표시 자체만 구현함.
> - `logic.js`: `logTodayLearned()` 바로 다음에 `STREAK_KEY`(`localStorage` 키: `kotobaStreak`),
>   `streakState`(`{lastVisitCalendarDay, currentStreak, longestStreak}`), `loadStreakState()`/
>   `saveStreakState()`, `recordStreakActivity()`, `getDisplayStreak()`, `renderStreakBoard(animateFreshStamp)`
>   신규 추가. `calendarDayNumber()`를 그대로 재사용해 "하루 지났는지"를 판정함.
> - **연동 지점**: `logTodayLearned()` 맨 끝에 `recordStreakActivity()` 호출을 추가해, 히라가나 3채널
>   엔진(`recordMistake`/`recordCorrect`)과 `recordWordResult` 양쪽에서 학습 활동이 있을 때마다
>   자동으로 스트릭이 갱신되게 함(별도 훅 불필요, 기존 로그 파이프라인에 얹음).
>   `showTopMenu()`와 앱 최초 로드(`initAppLevelUI`) 양쪽에서 `renderStreakBoard()`를 호출해 메인
>   화면 진입 시마다 최신 상태를 그림.
> - **끊김 처리**: 실제 저장된 `currentStreak`/`longestStreak`는 다음 활동 때까지 그대로 두고,
>   화면에는 `getDisplayStreak()`가 "마지막 활동일이 오늘/어제가 아니면 0으로 보여주기"만 함 —
>   죄책감을 유발하는 강제 리셋 문구나 애니메이션 없이 조용히 처리하고, 문구도 "오늘부터 다시
>   시작해도 괜찮아요"로 통일.
> - **도장 애니메이션**: 매 렌더마다 애니메이션이 반복 재생되지 않도록, `recordStreakActivity()`가
>   `renderStreakBoard(true)`로 호출할 때만 "오늘" 칸에 `streak-day-fresh` 클래스를 붙여 팝
>   애니메이션(`streakStampPop`)을 1회만 재생함. 단순히 메뉴를 오갈 때(`showTopMenu()`)는
>   애니메이션 없이 정적으로만 표시.
> - `index.html`: `#menuTopLevel` 상단(`.menu-desc` 바로 아래, `#preSleepBanner` 위)에
>   `<div id="streakBoard" class="streak-board">` 신규 마크업 추가. `.streak-board`/`.streak-board-head`/
>   `.streak-board-title`/`.streak-board-best`/`.streak-days`/`.streak-day`/`.streak-day-stamp`/
>   `.streak-day-stamped`/`.streak-day-today`/`.streak-day-fresh` CSS를 기존 디자인 변수(`--washi-deep`,
>   `--line`, `--indigo`, `--gold`, `--hanko`) 재사용해 신규 추가. "학습이론" 패널에 17번째 카드
>   (출석 도장판) 신규 추가, 상단 안내 문구 "16가지" → "17가지"로 갱신.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v28` → `koe-app-v29`로 올림.
> - **미구현으로 남긴 것(의도적 범위 축소)**: 로드맵 원안대로 "3일 연속/7일 연속 달성 시 배지·테마
>   해금"은 넣지 않음 — 과설계 방지 원칙에 따라 스트릭 표시 자체만 1차 구현. 알림(push notification)도
>   별도 권한/인프라가 필요해 범위에서 제외(원안대로 "앱을 열었을 때" 트리거로 한정).

**개념**: 이 항목도 새 기억 메커니즘이 아니라 **간격 반복(SRS)이 작동하려면 전제되는 "꾸준한 접속"을 유도하는 습관 형성 장치**임. 매일 짧게라도 접속해 복습이 실행되게 만드는 것이 결과적으로 망각곡선 관리의 성패를 좌우함.

**현재 갭**: 접속 기록이나 연속 학습일을 추적/표시하는 기능이 전혀 없음.

**구현 계획**:
- `localStorage`에 신규 키(예: `kotobaStreak`)로 `{lastVisitCalendarDay, currentStreak, longestStreak}` 저장 — 이미 있는 `calendarDayNumber()`(수면 의존 공고화에서 만든 자정 경계 계산 헬퍼)를 그대로 재사용해 "하루 지났는지" 판정
- 메인 화면 상단에 도장판 UI(최근 7일 칸, 오늘 학습 완료 시 한코(印) 스탬프 도장 애니메이션)
- 특정 조건(3일 연속, 7일 연속 등) 달성 시 배지/테마 해금은 1차 구현 범위에서는 보류하고, 스트릭 표시 자체만 우선 구현 권장(과설계 방지)
- **연동 지점**: `calendarDayNumber()` 재사용, 앱 진입 시점(초기화 함수) 훅, 신규 UI 컴포넌트

**우선순위**: 중 (완료 — LTM에 직접 기여하진 않지만 습관 형성 → 복습 이행 → LTM으로 이어지는 간접 경로가 뚜렷함)
**난이도**: 낮음 (완료 — 기존 날짜 계산 헬퍼 재사용, 상태 구조 단순)
**주의사항**: 스트릭이 끊겼을 때 죄책감을 유발하는 문구는 피하고, "오늘부터 다시 시작해도 괜찮다"는 톤을 유지할 것 — 스트릭 압박이 오히려 학습 회피로 이어지지 않도록. 구현도 이 원칙대로 강제 리셋 문구 없이 조용히 처리함.

---

## Part 3 권장 구현 순서
1. ~~4. 오답 나무 키우기~~ ✅ 구현 완료 — 기존 데이터 재사용, 복습 이행 효과 큼
2. ~~1. 소리 도감(프로덕션 효과)~~ ✅ 구현 완료 — IndexedDB 기반 녹음 저장/비교
3. ~~5. 스트릭/도장판~~ ✅ 구현 완료 — `calendarDayNumber()` 재사용, 기존 로그 파이프라인(`logTodayLearned()`)에 얹어 별도 훅 없이 구현
4. ~~3. 생성적 문장 조합 연출~~ ✅ 구현 완료 — 기존 `sentence`/`compound` 판정 로직(`pickPart`)은 그대로 두고 요리 비유 연출만 추가
5. ~~2. 섀도잉 미니게임~~ ✅ 구현 완료 — 신규 `shadowing` 게임 모드, `speakTTS`의 `onEnd` 콜백으로 "재생 길이 × 1.2" 인식 창 구현

**→ Part 3의 5개 항목 전부 구현 완료.**
**다음 세션 추천**: Part 1~4가 모두 구현 완료되고, **Part 2 §3 어휘 축을 오늘의 추천 배너에 연결하는 작업**과 **어휘 축 인출 단서 다변화(모달리티 가중치)**까지 완료됨(Part 2 "다음 세션 시작 가이드" §6(c)/(d) 참고). 남은 후보는 (1) 어휘 축 SRS stage/망각곡선 도입, (2) 어휘 전용 복습 세트(E단계) 신설, (3) "자기참조 효과"의 단어 축 확장. 그 외엔 이미 구현된 19가지 이론의 세부 확장(예: 섀도잉의 타이밍/억양 정밀 비교, 스트릭의 배지·테마 해금)을 단계적으로 넓혀가는 것을 권장.

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

## 1. 분산 학습 · 간섭 방지 (유사 자형/유의어 분산 배치) ✅ 구현 완료

> **구현 내역**: 계획서에서 권장한 "1차 구현은 단순 간격 규칙으로 시작" 범위로 구현함
> (혼동군을 의도적으로 오답 선택지에 포함시키는 절충안은 이번 세션에서 다루지 않음).
> - `data.js`: `HS_COL_HEADS` 바로 다음에 `HIRAGANA_CONFUSION_GROUPS` 신규 배열 추가 —
>   자형이 비슷해 흔히 헷갈리는 히라가나 10묶음(`め/ぬ`, `わ/れ/ね`, `さ/き`, `る/ろ`,
>   `く/へ`, `り/い`, `は/ほ`, `ま/も`, `す/む`, `し/つ`). 청킹(`HIRAGANA_ROW_GROUPS`,
>   오십음도 행 단위)과는 무관하게 순수 자형 유사성 기준으로만 묶었고, 실증 데이터가
>   아니라 아동 히라가나 학습에서 흔히 지적되는 혼동 사례를 정리한 시작점임을 주석에 명시.
> - `logic.js`: `srsWeightedPick()` 바로 위에 두 헬퍼 신규 추가.
>   `isSameConfusionGroup(chA, chB)`(두 글자가 같은 혼동군인지), `spaceOutConfusionGroups(list)`
>   (이미 뽑힌 문제 순서를 받아 **누가 뽑혔는지는 그대로 두고 순서만** 재배치 — 최근 2문제
>   이내에 같은 혼동군 글자가 다시 나오면 뒤쪽에서 충돌 없는 후보를 찾아 자리를 바꾸는
>   그리디 스왑. 바꿀 후보가 없으면(예: 활성 세트가 혼동군 글자 위주일 때) 그 자리는
>   충돌을 감수하고 그대로 둠 — 완전 회피를 보장하진 않음).
>   독립 Node 스크립트로 혼동군 비중이 높은 인접 세트(2000회 무작위 시행)에서 적용 전
>   평균 충돌 1.581건 → 적용 후 0.409건(약 74% 감소)을 확인함.
> - `createHiraganaStatsEngine()`(hs/hw/hr 3개 엔진 공용)의 `weightedPick()`(SRS/오답전용/
>   기본 가중치 3개 분기 전부)와 `pickFromSubset()`(복습 세트용) 반환 직전에
>   `spaceOutConfusionGroups()`를 적용 — 카드찾기·쓰기·읽기 세 게임과 복습 세트 모두에
>   자동으로 적용됨(엔진 공용 함수 한 곳만 고쳐 세 게임에 동시 반영).
> - `showHiraganaSpeedQuestion()`의 오답 카드 후보 풀 구성부(`activePool`/`pool` 산출 직후)에
>   `nonConfusingPool`(정답과 혼동군인 글자 제외) 필터를 추가 — 제외한 뒤에도
>   `hsCardCount - 1`개를 채울 만큼 후보가 남으면 그 풀을 쓰고, 부족하면(활성 세트가 작을 때)
>   원래 풀로 안전하게 폴백해 게임이 막히지 않도록 함.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v24` → `koe-app-v25`로 올림.
> - **미구현으로 남긴 것**: (1) 계획에 있던 "혼동군을 오히려 오답 선택지에 의도적으로
>   포함시키되 직후 문제로는 안 나오게" 하는 절충안(선택 사항으로 명시돼 있던 부분)은
>   1차 구현에서는 다루지 않음 — 지금은 단순 회피만 함. (2) 쓰기(hw)·읽기(hr) 게임은
>   객관식 선택지가 없는 구조라(직접 쓰기/발화) "동시 등장 방지"는 카드찾기(hs)에만
>   적용했고, 두 게임은 `weightedPick`/`pickFromSubset`을 통한 "연속 등장 간격 방지"만
>   적용됨. (3) 유의어(단어 축) 간섭 방지는 범위에 넣지 않음 — 이번 세션은 로드맵 원문의
>   "자형" 축(히라가나)만 다룸.

**개념**: 형태나 의미가 비슷한 항목(め/ぬ, わ/れ 같은 유사 자형, 또는 뜻이 비슷한 유의어)을 같은 세션에 몰아 학습하면 뇌에서 서로 헷갈려 기억이 뒤섞이는 간섭(interference)이 일어남. 유사 항목을 시간·순서상 떨어뜨려 배치하면 변별력이 높아져 각각 더 견고하게 저장됨.

**현재 갭(해소됨)**: 청킹(`HIRAGANA_ROW_GROUPS`)은 오십음도 행 단위로만 묶어서, 자형이 비슷한 글자가 다른 행에 흩어져 있어도 신경 쓰지 않았음. SRS 가중 뽑기(`srsWeightedPick`)나 활성 세트 확장도 "헷갈리기 쉬운 쌍인지"는 전혀 고려하지 않아, め/ぬ가 같은 문제 세트나 인접한 순서로 연달아 나올 수 있었음 — 이번 세션에서 `spaceOutConfusionGroups`(순서 재배치)와 카드찾기 오답 선택지 필터로 해소.

**우선순위**: 중 (완료)
**난이도**: 중 (완료 — 데이터는 간단했고, 순서 재배치는 "누가 뽑히는지"를 바꾸지 않는 최소 침습적 방식으로 처리해 회귀 리스크를 낮춤)
**주의사항**: 혼동군을 완전히 분리시키기만 하면 오히려 변별 연습 기회 자체가 사라질 수 있음 — 이번 구현은 "동시 등장은 피하되" 수준에 그쳤고, "의도적 노출" 절충안은 다음 세션 후보로 남겨둠.

---

## 2. 인출 단서 다변화 (모달리티 로테이션) ✅ 구현 완료 (데이터 + 안내 배너 + 어휘 축 실제 가중치 적용)

> **구현 내역**: 계획에 있던 "간단한 1차 구현안"(새 게임 모드 없이 기존 게임을 모달리티별로
> 재분류하고 안내 문구로 개념 검증) 범위로 구현함.
> - `data.js`: `STAGE_TO_HIRAGANA_MODE` 바로 다음에 `GAME_MODALITY_MAP` 신규 추가 —
>   `GAME_STAGE_MAP`과 동일한 34개 게임 모드 전부를 `{present: 'audio'|'text'|'image',
>   response: 'passive'|'select'|'write'|'speak'}`로 재분류(제시 모달리티 × 응답 모달리티).
>   **기존 `GAME_STAGE_MAP` 객체에 필드를 얹지 않고 별도 맵으로 분리** — `GAME_STAGE_MAP[mode]
>   === 'B'`처럼 값 자체를 직접 비교하는 기존 호출부가 많아 값을 객체로 바꾸면 회귀 리스크가
>   커서, 완전히 독립된 맵으로 추가하는 쪽을 택함(계획서의 "필드 확장 검토" 대신 "별도 맵"으로
>   결정). 독립 Node 스크립트로 두 맵의 키 34개가 정확히 일치함을 검증함.
>   `GAME_MODALITY_LABELS`(present/response 값 → "🔊 소리로"/"고르기" 같은 아이 친화적 문구)도
>   함께 추가.
> - `logic.js`: `getModesForStage()` 바로 다음에 `getGameModality(mode)`(맵 조회, 없으면 null)와
>   `formatGameModalityLabel(modality)`(present+response 라벨을 "🔊 소리로 고르기" 한 줄로 조합)
>   신규 추가.
> - `pickNextGameForSession()`이 반환하는 추천 객체에 `modalityText` 필드를 추가 — B/C/D 단계는
>   `STAGE_TO_HIRAGANA_MODE`가 가리키는 모드의 모달리티 라벨을, E단계(복습 세트)는 카드찾기·
>   쓰기·읽기 3가지가 이미 랜덤 순서로 섞여 나오므로 고정 라벨 대신 "🔁 여러 방식으로 번갈아
>   만나기" 고정 문구를 씀.
> - `renderTodayRecommendation()`: "오늘의 추천" 배너에 `.today-recommend-modality` 배지를 추가해
>   `modalityText`를 노출(예: "🔊 소리로 고르기"). `index.html`에 해당 CSS 신규 추가(디자인 시스템
>   변수 `--sage` 재사용).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v23` → `koe-app-v24`로 올림.
> - **미구현으로 남긴 것(의도적 범위 제한)**: 계획에 있던 "복습 세트나 §3 오케스트레이터가
>   직전 모달리티와 다른 쪽을 우선 선택하도록 가중치 부여"는 하지 않음 — 현재
>   `STAGE_TO_HIRAGANA_MODE`가 단계마다 게임을 딱 1개로 고정해둔 구조라(히라가나 축은 애초에
>   단계당 대안이 없음) 로테이션할 여지 자체가 없고, 복습 세트(`buildReviewGameQueue`)는
>   카드찾기/쓰기/읽기 3개를 정확히 한 번씩 랜덤 순서로 쓰는 구조라 애초에 반복이 불가능해
>   이미 최적임(추가 로직 불필요). 실질적으로 "여러 모드 중에서" 골라야 하는 상황은 어휘 축
>   §3 오케스트레이터가 구현될 때(현재 미착수, Part 2 §3 참고) 처음 발생하므로, 그 시점에
>   `GAME_MODALITY_MAP`을 후보 게임 선정 가중치로 연결하는 것을 권장.

> - **🆕 후속 세션에서 완료**: "미구현으로 남긴 것"에서 예고했던 대로, 어휘 축 §3 오케스트레이터
>   (Part 2 §3, `pickNextGameForSession`)가 실제로 연결된 뒤 이 축의 가중치 로직도 함께 구현함.
>   - `data.js`: `STAGE_TO_WORD_MODE` 바로 다음에 `WORD_AXIS_STAGE_CANDIDATES`(B/C/D 단계별
>     제시 모달리티가 서로 다른 대표 후보 2~3개, canonical 게임을 항상 첫 번째로 포함) 신규 추가.
>   - `logic.js`: `LAST_VOCAB_MODALITY_KEY`(`localStorage` 키: `kotobaLastVocabModality`) +
>     `saveLastVocabModality(mode)`/`loadLastVocabModality()` 신규 추가. `recordWordResult()`가
>     B/C/D 채널을 기록할 때마다 방금 쓴 모드의 모달리티를 함께 저장함.
>   - `pickWordAxisMode(stage)` 신규 추가 — `WORD_AXIS_STAGE_CANDIDATES`에서 직전 모달리티와
>     `present`가 다른 후보를 최우선으로, 그마저 없으면 `response`가 다른 후보를 찾아 반환(둘 다
>     없으면 canonical 기본값). `pickNextGameForSession()`의 어휘 축 분기가 이제
>     `STAGE_TO_WORD_MODE[stage]` 대신 이 함수를 호출함.
>   - `index.html`: 오케스트레이터 설명 카드(13번) 적용 문구에 "단어 학습 추천 시 직전과 다른
>     방식을 우선 고른다" 한 줄 추가.
>   - `sw.js`: `CACHE_NAME`을 `koe-app-v32` → `koe-app-v33`으로 올림.
>   - **여전히 미구현으로 남긴 것**: 히라가나 축은 여전히 단계당 게임이 1개뿐이라(`STAGE_TO_HIRAGANA_MODE`)
>     로테이션 대상이 아님(원안대로 — 히라가나는 대안 자체가 없음). 복습 세트(`startReviewSession`)의
>     모달리티 로테이션도 여전히 손대지 않음(이미 3가지를 랜덤 순서로 섞어 최적이라고 판단한 원래
>     결론 유지).

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

## 3. 수면 전 통합 프롬프트 (Pre-Sleep Consolidation Prompt) ✅ 구현 완료

> **구현 내역 (재구현 세션)**: 로드맵 원안과 동일한 설계로 구현함.
> - `logic.js`: 신규 `todayLearnedLog` 상태(`localStorage` 키: `kotobaTodayLearnedLog`, `loadTodayLearnedLog()`/`saveTodayLearnedLog()`) — 오늘(달력 날짜 기준, `calendarDayNumber()` 재사용) 학습/복습한 히라가나 글자·단어를 최근 30개까지 기록. `logTodayLearned(type, key, isCorrect, extra)`를 히라가나 3채널 엔진의 `recordMistake`/`recordCorrect`(글자 축)와 `recordWordResult`(단어 축, §6(a)에서 만든 어휘 통계와 같은 지점) 양쪽에 연결해, 앱 안의 사실상 모든 학습 활동이 자동으로 이 로그에 남도록 함.
> - `isPreSleepHour(now)`: 로컬 시각 21시 이후 또는 새벽 4시 이전이면 "저녁 시간대"로 판단(원안의 "21시 이후"에 자정을 넘긴 늦은 밤까지 포함하도록 소폭 확장).
> - `getPreSleepHighlights(limit)`: 오늘 로그 중 오답이 있었던 항목을 우선하고 그 다음 최근 순으로 최대 3개를 뽑음. `enrichTodayLearnedItem()`이 글자는 `HIRAGANA_LIST`에서, 단어는 `DICTIONARY`(또는 기록 당시 함께 저장해둔 kr/emoji)에서 표시 정보를 채움.
> - `renderPreSleepPrompt()`: 메인 메뉴(`showTopMenu()`, 앱 최초 로드) 진입 시마다 호출되어, 저녁 시간대 + 오늘 로그 있음 + 아직 안 닫음 조건을 모두 만족할 때만 상단에 카드(`#preSleepBanner`)를 보여줌. `dismissPreSleepPrompt()`로 닫으면 `kotobaPreSleepDismissedDay`에 오늘 날짜를 저장해 같은 날 다시 뜨지 않음.
> - `openPreSleepView()`/`closePreSleepView()`: 클릭 시 화면 전환 없이 오버레이(`#preSleepViewOverlay`)로 "1분 요약" 미니 뷰를 띄움. 정답/오답 표시나 채점 없이 글자/이모지+뜻만 카드로 보여주는 순수 재노출 형태(로드맵 주의사항 준수).
> - `index.html`: `#menuTopLevel` 상단에 `.pre-sleep-card`(닫기 버튼 포함) + 전체 화면 오버레이 `.pre-sleep-view-overlay` 신규 마크업·CSS 추가, 디자인 시스템 변수(`--indigo`, `--hanko`, `--washi` 등) 재사용.

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

## 4. 정교화된 시연 · 자기참조 효과 (Elaborative Rehearsal & Self-Reference) ✅ 구현 완료

> **구현 내역**: 로드맵 원안의 "이모지 선택 방식으로 시작" 권장안을 그대로 따름 — 자유 텍스트 입력은
> 두지 않고 5개 이모지 중 선택만 가능하게 함.
> - `logic.js`: `showLtmDetail()` 바로 위에 `SELF_REFERENCE_EMOJI_OPTIONS`(🏠/🍚/👨‍👩‍👧/🐶/😴 5종),
>   `loadSelfReferenceNotes()`/`saveSelfReferenceNotes(notes)`(`localStorage` 키:
>   `kotobaSelfReferenceNotes`, `{ch: emoji}` 형태, 글자당 이모지 1개만 저장), `renderSelfReferenceHtml(ch)`,
>   `toggleSelfReferenceEmoji(ch, emoji)` 신규 추가. 이미 고른 이모지를 다시 누르면 선택이 취소됨(강제 아님).
>   `showLtmDetail(ch, status)`의 상세보기 HTML 맨 끝(수면 공고화 안내 다음)에 위젯을 이어붙임.
> - 다음에 같은 글자 상세보기를 열면 "지난번에 네가 고른 건 🏠예요 — 오늘도 그런가요?" 문구로
>   지난 선택을 함께 보여줘 자기참조 효과를 한 번 더 떠올리게 함.
> - `index.html`: `.ltm-detail-self-ref`/`.self-ref-btn-row`/`.self-ref-btn`/`.self-ref-btn-active`/
>   `.self-ref-note` CSS를 기존 디자인 변수(`--line`, `--sage`, `--hanko`, `--washi-deep`) 재사용해 신규 추가.
>   "학습이론" 패널에 자기참조 효과 설명 카드(14번) 신규 추가, 상단 안내 문구 "13가지" → "14가지"로 갱신.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v25` → `koe-app-v26`으로 올림.
> - **미구현으로 남긴 것(의도적 범위 축소)**: 로드맵 원안의 "단어 카드"쪽 연동(`HIRAGANA_SAMPLE_WORDS`
>   단어 칩에도 동일 위젯 부착)은 이번 세션에서 하지 않음 — 현재 단어 축에는 `showLtmDetail`에 준하는
>   전용 상세보기 화면 자체가 없어(장기기억 현황판이 히라가나 글자 축에만 존재), 위젯을 붙일 마땅한
>   연동 지점이 없었음. 히라가나 글자 상세보기(`showLtmDetail`)에는 원안대로 전부 연동 완료. 단어 축
>   전용 상세보기가 생기면(Part 2 §3 어휘 오케스트레이터 등과 함께 논의 권장) 그때 같은 위젯을
>   재사용해 확장하는 것을 권장.
> - 자유 텍스트 메모 입력(원안의 "선택적 확장안")은 하지 않음 — 이모지 선택만으로도 개념 검증에
>   충분하다고 판단했고, 아이 대상 UX 원칙(타이핑 부담 최소화)에도 더 부합해 1차 구현 범위를 이모지로
>   한정함.

**개념**: 새 정보를 자신의 경험이나 익숙한 사물에 빗대어 연결하면(정교화) 기억흔적이 깊어짐. 특히 "나 자신"과 관련지은 정보(self-reference effect)는 타인이 만들어준 연상보다 훨씬 강하게 기억됨.

**현재 갭**: 이중부호화(`HIRAGANA_MNEMONICS`)는 **앱이 미리 만들어둔** 연상 이미지·이야기를 보여줄 뿐, 아이가 스스로 "이 단어는 내 하루의 뭐랑 닮았어요"처럼 자기 경험과 연결 짓게 하는 기능은 전혀 없음.

**구현 계획**:
- 단어 카드/장기기억 상세보기(`showLtmDetail`)에 "이 단어, 나의 하루와 닮은 점이 있나요?" 같은 가벼운 질문 + 이모지 선택 또는 짧은 한 줄 메모 입력란 추가(선택적, 강제 아님)
- 아이가 남긴 자기참조 메모는 `localStorage`에 글자/단어별로 저장(신규 키, 예: `kotobaSelfReferenceNotes`) — 다음에 같은 단어를 만났을 때 "지난번에 네가 남긴 메모"를 함께 보여주면 자기참조 효과가 한 번 더 강화됨
- 입력 부담을 줄이기 위해 자유 텍스트보다는 이모지 3~5개 중 선택하는 방식으로 시작하는 것을 권장(아이 대상 UX, 타이핑 부담 최소화)
- **연동 지점**: `showLtmDetail()`, `HIRAGANA_MNEMONICS`(기존 이중부호화 힌트) 옆에 나란히 배치, 신규 `localStorage` 키

**우선순위**: 중 (완료 — 효과는 강력하지만, 텍스트/이모지 입력 UI가 아이 연령대에 맞게 설계돼야 하고 저장 데이터 관리가 새로 필요)
**난이도**: 중 (완료 — 이모지 선택 방식으로 범위를 좁혀 입력 UI/저장·불러오기 로직만 신규 구현, 판정 로직 없어 로직 자체는 단순)
**주의사항**: 아이가 남기는 메모는 사적인 내용일 수 있으므로 기기 로컬 저장만 하고 서버 전송/공유 기능은 넣지 않을 것(§1 소리 도감과 동일한 원칙 적용) — 구현도 이 원칙대로 `localStorage`에만 저장함.

---

## 5. 어휘 축 SRS/망각곡선 정교화 ✅ 구현 완료

> **구현 내역**: "다음 세션 추천"에서 예고했던 남은 후보 중 첫 번째. 히라가나 축에 이미 있는
> `srsUpdateStat`/`srsForgetProbability`/`SRS_STAGE_DAYS`를 **새 로직 없이 그대로 재사용**해
> 어휘 축에도 같은 간격 반복/망각곡선을 도입함.
> - `logic.js`: `recordWordResult(word, isCorrect)` 끝부분(채널별 B/C/D 기록 다음, `saveWordStats()`
>   전)에 `srsUpdateStat(wordStats[word.jp], isCorrect)` 호출 한 줄만 추가. 히라가나처럼 게임별로
>   별도 SRS 엔진(hs/hw/hr)을 두지 않고, **단어 하나당 srsStage/lastReviewAt 하나만** 두어
>   "어느 게임에서 맞히든 같은 단어면 같은 SRS 시계를 공유"하는 구조로 단순화함(채널 통계는
>   기존처럼 B/C/D별로 계속 따로 쌓임 — SRS 단계만 통합). `srsUpdateStat`이 `stat.srsStage`가
>   숫자가 아니면 0으로 채워주는 방어 코드를 이미 갖고 있어서, 기존 저장 데이터(`srsStage` 없음)도
>   별도 마이그레이션 코드 없이 자연히 처리됨.
> - `logic.js`: `saveWordStats()` 바로 다음에 `wordSrsWeightedPick(words, count)` 신규 추가 —
>   히라가나용 `srsWeightedPick`(ch 키 기준)을 단어(jp 키) 기준으로 그대로 일반화한 버전.
>   `srsForgetProbability`는 stat 객체 형태만 보므로 수정 없이 그대로 재사용. 한 번도 안 만난
>   단어는 `lastReviewAt`이 없어 망각확률이 자동으로 최댓값(1)이 되어 최우선으로 뽑힘(히라가나와
>   동일 동작).
> - `createWordChoiceQuizGame()`(퀴즈게임·오디오→이모지 두 게임이 공유하는 팩토리)의
>   `generateQuiz()`에서 순수 랜덤 선택(`Math.random() * activeWords.length`)을
>   `wordSrsWeightedPick(activeWords, 1)[0]`로 교체 — 잊어버릴 것 같은 단어일수록 더 자주
>   출제되게 함. 오답 선택지 풀 구성(`pool`)이나 채점 로직은 전혀 건드리지 않아 회귀 리스크가 낮음.
> - `index.html`: "학습이론" 패널의 기존 "간격 반복 (SRS)" 카드와 "잊어버릴 것 같은 글자가 더
>   자주 나와요" 카드의 "📍 적용" 문구에 어휘 축 확장 내용을 한 줄씩 덧붙임(새 카드를 추가하진
>   않음 — 같은 이론의 적용 범위 확장이라 이론 개수는 그대로 19가지 유지).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v33` → `koe-app-v34`로 올림.
> - **미구현으로 남긴 것(의도적 범위 축소)**: (1) `createWordChoiceQuizGame` 팩토리를 쓰지 않는
>   다른 단어 게임들(철자 맞추기·수수께끼·복합어·따라쓰기·짝맞추기 카드·받아쓰기 등)의 문제
>   선택 로직은 이번 세션에서 건드리지 않음 — 게임마다 문제 선택 코드가 제각각이라(공용 팩토리가
>   아님) 한 번에 다 바꾸면 회귀 리스크가 커서, 가장 많이 쓰이는 공용 팩토리 하나만 먼저
>   적용함. (2) 장기기억 현황판처럼 단어별 SRS 단계·망각확률을 눈으로 보여주는 상세보기 UI는
>   추가하지 않음 — 데이터 계층(SRS 갱신 + 가중 출제)까지만 이번 범위. (3) 하루 중복 상승 제한
>   (`SRS_SAME_DAY_FULL_CREDIT_LIMIT`, 수면 의존 공고화)은 `srsUpdateStat`을 그대로 재사용하는
>   과정에서 자동으로 함께 적용됨(별도 작업 아님, 부수 효과).

**개념**: 에빙하우스 망각곡선과 간격 반복(SRS)은 히라가나 글자에만 적용돼 있었음. 단어(어휘)도 시간이 지나면 똑같이 잊혀지므로, 같은 원리를 어휘 축에도 적용하면 "얼마나 오래 안 봤는지"를 기준으로 복습 우선순위를 정할 수 있음.

**현재 갭(해소됨)**: `wordStats`는 정답/오답 누적치와 B/C/D 채널별 정확도만 기록했고, "언제 마지막으로 봤는지"·"지금 얼마나 잊혀졌을지"는 전혀 추적하지 않았음 — 그래서 단어 퀴즈는 항상 순수 랜덤 출제였음. 이번 세션에서 SRS 단계·마지막 복습 시각 추적과 망각확률 가중 출제로 해소.

**우선순위**: 높음 (완료 — 기존 히라가나 SRS 인프라를 100% 재사용 가능해 구현 비용 대비 효과가 좋음)
**난이도**: 낮음 (완료 — 새 알고리즘 없이 기존 함수 재사용, 데이터 구조도 필드 하나 추가에 가까움)
**주의사항**: 단어 축은 히라가나처럼 "활성 세트" 개념이 아직 없어(§2 참고), 이번 SRS 가중 출제는 그때그때의 `getActiveWords()` 결과 안에서만 우선순위를 매김 — 단어 자체를 언제 처음 노출할지 결정하는 로직은 이번 범위 밖.

---

## Part 4 권장 구현 순서
1. ~~3. 수면 전 통합 프롬프트~~ ✅ 구현 완료 — 기존 헬퍼 재사용, 효과 대비 구현 비용 가장 낮음
2. ~~2. 인출 단서 다변화~~ ✅ 구현 완료(데이터+안내 배너+어휘 축 실제 가중치까지) — Part 2 §3 어휘 축 오케스트레이터가 만들어진 뒤 `pickWordAxisMode()`로 실제 후보 선정 가중치까지 연결 완료(위 "🆕 후속 세션에서 완료" 참고)
3. ~~1. 분산 학습·간섭 방지~~ ✅ 구현 완료 — 혼동군 데이터 + 순서 재배치(`spaceOutConfusionGroups`) + 카드찾기 동시 등장 방지
4. ~~4. 정교화·자기참조 효과~~ ✅ 구현 완료 — 이모지 선택 위젯으로 범위를 좁혀 히라가나 글자 상세보기(`showLtmDetail`)에 연동. 단어 축 확장은 미구현으로 남김(위 "미구현으로 남긴 것" 참고)
5. ~~5. 어휘 축 SRS/망각곡선 정교화~~ ✅ 구현 완료 — 히라가나 SRS 함수(`srsUpdateStat`/`srsForgetProbability`) 재사용, 단어 퀴즈 출제를 망각확률 가중 방식으로 교체

**→ Part 4의 5개 항목 전부 구현 완료.**

---

## 6. 어휘 전용 복습 세트(E단계) 신설 ✅ 구현 완료

> **구현 내역**: Part 4 완료 후 "다음 세션 추천"의 첫 번째 후보였던 항목. 히라가나의
> `startReviewSession()`(카드찾기·쓰기·읽기를 랜덤 순서로 이어서 풀기)과 같은 아이디어를
> 어휘 축에 그대로 적용함 — 새 게임을 만들지 않고, 이미 있는 단어 게임(퀴즈·문장 맞히기)의
> 공용 출제 함수인 `getActiveWords()` 딱 한 곳만 "복습 세트 진행 중이면 후보 단어로 풀 제한"
> 하도록 손봐서, 그 함수를 참조하는 모든 단어 게임이 자동으로 좁혀진 범위를 쓰게 만듦.
> - `logic.js`: `getActiveWords()`(최상단)에 `wordReviewSessionActive` 체크 추가 — 세션 중이면
>   `wordReviewSessionWords`와 교집합으로 제한하고, 결과가 0개면 안전하게 평소 범위로 복귀.
> - `logic.js`: `getWrongRate()` 바로 위에 신규 블록 추가 —
>   `wordReviewSessionActive`/`wordReviewSessionWords`/`wordReviewSessionGameQueue`/
>   `wordReviewSessionRoundIndex`(세션 상태), `VOCAB_REVIEW_GAME_TYPES = ['quiz', 'sentence']`
>   (라운드 구성), `getVocabReviewCandidateWords()`(SRS 망각확률 0.5 이상인 단어 우선, 없으면
>   B/C단계 단어로 대체 — `getReviewCandidateChars()`와 동일한 원칙), `startVocabReviewSession()`
>   / `playNextVocabReviewRound()` / `scheduleNextVocabReviewRound()` / `finishVocabReviewSession()`
>   / `cancelVocabReviewSession()` / `updateVocabReviewSessionBanner()` — 전부 히라가나 복습 세트의
>   대응 함수를 그대로 본떠 어휘용으로 새로 작성함(기존 함수는 건드리지 않음).
> - `logic.js`: `createWordChoiceQuizGame`(퀴즈게임·오디오→이모지 공용)과
>   `createSequencePickQuizGame`(문장맞히기·합성어 공용)의 `showResult()` 끝에
>   `scheduleNextVocabReviewRound();` 한 줄씩 추가 — 세션이 진행 중이 아닐 땐 즉시 반환되므로
>   평소 게임 플레이엔 영향 없음.
> - `logic.js`: `backToCategoryFromGame()`에 `wordReviewSessionActive` 체크·취소 추가.
> - `logic.js`: `pickNextGameForSession()`의 E단계 분기를 수정 — 더 이상 무조건 히라가나 복습
>   세트로 보내지 않고, 히라가나 축과 어휘 축 중 목표 비율 대비 더 뒤처진 쪽으로 안내함(단,
>   어휘 축을 고르려면 `getVocabReviewCandidateWords().length > 0`이어야 함 — 후보가 없으면
>   히라가나 복습 세트로 대체). 반환값에 `useVocabReviewSession` 필드 추가.
> - `logic.js`: `startRecommendedGame()`이 `useVocabReviewSession`이면 `startVocabReviewSession()`을
>   호출하도록 분기 추가.
> - `logic.js`: `renderVocabStageOverview()`에 `#ltmVocabReviewDesc` 텍스트 갱신 로직 추가(복습
>   후보 단어 수 안내).
> - `index.html`: `#vocabReviewSessionBanner`(기존 `reviewSessionBanner`와 동일 클래스) 신규 추가.
>   "장기기억 현황" 패널의 어휘 학습 단계 박스(`#ltmVocabStageBox`) 하단에 "📚 어휘 복습 세트
>   시작하기" 버튼 + 안내 문구(`#ltmVocabReviewDesc`) 추가(기존 `.ltm-review-launch`/
>   `.quiz-audio-btn` 클래스 재사용, 새 CSS 없음).
> - `index.html`: "간격 반복 (SRS)", "복습 세트 — 필요할 때 자동으로 모아서", "오늘의 추천" 세
>   이론 카드의 "📍 적용" 문구에 어휘 복습 세트 관련 내용을 한 줄씩 덧붙임(새 카드는 추가하지
>   않음 — 기존 이론의 적용 범위 확장이라 이론 개수는 그대로 유지).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v34` → `koe-app-v35`로 올림.
> - **미구현으로 남긴 것(의도적 범위 축소)**: (1) 철자 맞추기(spelling, C채널)는 라운드
>   구성(`VOCAB_REVIEW_GAME_TYPES`)에서 제외함 — 퀴즈·문장 맞히기와 달리 "N문제 풀면 결과 화면"
>   같은 명확한 종료 시점이 없는 무한 반복형 게임이라, 세트 안에서 자동으로 다음 라운드로
>   넘어가는 구조에 맞지 않음. spelling에 결과 화면(예: 10문제 단위)이 추가되면 세 번째
>   라운드로 합류시키는 것을 권장. (2) 히라가나 복습 세트처럼 "복습이 급한 단어" 개수를 색상
>   등급(정착/학습중/복습필요)으로 시각화하는 전용 그리드는 만들지 않음 — 기존
>   `#ltmVocabStageRow`(A~E 분포 칩)로 대체.

**개념**: 어휘 축에 SRS 단계·망각확률(Part 4 §5)이 쌓이면서, "복습이 급한 단어만 모아서 몰아
풀기"가 가능한 전제조건이 갖춰짐. 히라가나 복습 세트와 같은 인출 연습(retrieval practice) +
분산 학습 원리를 어휘에도 적용한 것.

**우선순위**: 높음 (완료 — SRS 인프라가 이미 있어 후보 선정 로직은 재사용, `getActiveWords()`
단일 지점 수정으로 모든 단어 게임에 자동 전파돼 구현 비용 대비 효과가 좋음)
**난이도**: 중 (완료 — 새 게임/판정 로직 없이 기존 게임 재사용이라 낮은 편이지만, 세션
상태 관리·자동 진행·추천 로직 통합까지 손볼 지점이 여러 곳이라 히라가나 복습 세트보다는
연동 지점이 많음)
**주의사항**: `getActiveWords()`를 세션 인식형으로 바꾼 것이 이 구현의 핵심이자 유일한
회귀 리스크 지점 — 세션이 비활성 상태(`wordReviewSessionActive === false`)일 땐 완전히
기존 동작과 동일하게 동작함을 확인할 것. 향후 이 함수에 새 필터를 추가할 땐 이 체크가
항상 필터 체인의 마지막에 오도록 유지할 것(레벨/JLPT/카테고리 필터 → 복습 세트 제한 순).

**다음 세션 추천(갱신됨)**: 아래 15번(스트릭 배지·테마 해금) 구현 완료. 이제 남은 제안은
14번(섀도잉 타이밍/억양 정밀 비교, 난이도 높음 — 탐색 단계 필요)·16번(낱말찾기 격자 크기
WMS 연동, 난이도 낮음)·17번(어휘 축 혼동 단어 인터리빙, 난이도 중) 3개이고, 이 중 우선순위·
난이도를 고려해 16번(가장 간단)부터 진행하는 것을 권장.

---

## 17. 어휘 축에도 혼동 단어 인터리빙 적용 ✅ 구현 완료

> **구현 내역**: 제안 단계 아이디어를 기반으로 하되, "매 라운드 하나씩 뽑는" 대부분의 단어
> 게임 구조에 맞춰 배치 재배치(spaceOut) 대신 "직전 단어와 같은 혼동군이면 이번 후보에서
> 미리 제외" 방식(excludeVocabConfusionGroup)을 주력으로 쓰고, 진짜 배치/동시노출 구조인
> 섀도잉·낱말찾기에는 각각 순서 재배치·동시 배치 교체 방식을 따로 적용함.
> - `data.js`: `HIRAGANA_CONFUSION_GROUPS` 바로 다음에 `VOCAB_CONFUSION_GROUPS` 신규 추가 —
>   반복형 아기말 호칭(まま/ぱぱ/ばあば/じいじ), 한 모라 차이 남매 호칭(おにいちゃん/
>   おねえちゃん), 남동생/여동생(おとうと/いもうと), 대비어(おとこのこ/おんなのこ,
>   はい/いや), 각운이 같은 색(しろ/くろ)·숫자(きゅう/じゅう), 반대 의미 인사말(どうぞ/
>   ちょうだい), 같은 형식의 의성어(わんわん/にゃんにゃん, まんま/ねんね) 등 10묶음을
>   DICTIONARY에 실재하는 jp 값으로 큐레이션.
> - `logic.js`: 기존 히라가나 전용 `isSameConfusionGroup`/`spaceOutConfusionGroups`를
>   `isSameConfusionGroupGeneric(keyA, keyB, groups)`/`spaceOutConfusionGroupsGeneric(list,
>   groups, getKey)` 범용 헬퍼로 일반화(기존 두 함수는 이 헬퍼를 호출하는 얇은 래퍼로 남아
>   시그니처·동작 그대로 유지 — 호출부 수정 불필요). 이를 이용해 어휘 축 버전
>   `isSameVocabConfusionGroup(jpA, jpB)`/`spaceOutVocabConfusionGroups(list)`(item.jp 기준)
>   신규 추가.
> - `logic.js`: `excludeVocabConfusionGroup(pool, prevJp)` 신규 추가 — 직전 단어(prevJp)와
>   같은 혼동군인 항목을 pool에서 제외(다 제외되면 원래 pool 그대로 반환, 히라가나 축
>   `nonConfusingPool`과 동일한 "완전히 못 피하면 그냥 둔다" 원칙). 이를 아래 5개 게임의
>   "직전 단어" 상태 변수(각 게임에 이미 있던 `currentQuestion`/`currentWritingWord`/
>   `currentPronounceWord`/`currentExposureWord`/`previousRiddleJp`) 앞에서 잡아 적용:
>   퀴즈+오디오→이모지 공용 팩토리(`generateQuiz()`), 단어 쓰기 게임, 발음(D채널) 게임,
>   반복 노출(A단계) 게임, 수수께끼 게임.
> - `logic.js`: 섀도잉(`startShadowingGame()`)은 10문제를 한 번에 미리 뽑는 배치 구조라
>   `shadowQuestions` 완성 직후 `spaceOutVocabConfusionGroups()`로 순서만 재배치.
>   낱말찾기(`pickWordSearchWords()`)는 4단어가 한 화면에 동시에 보이는 구조라 순서 재배치가
>   무의미해서, 새로 추가한 `avoidSimultaneousVocabConfusion(picked, pool)`(같은 혼동군끼리
>   겹치는 자리를 겹치지 않는 다른 후보로 바꿔치기)를 대신 적용.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v47` → `koe-app-v48`로 올림.
> - **미구현으로 남긴 것**: 문장 맞히기(sentence)/합성어 맞추기(compound)는 `pairSrsWeightedPick`
>   기반이라 "두 단어짜리 항목"을 다루고, 공용 팩토리(`createSequencePickQuizGame`)의
>   `buildItem(activeWords)` 콜백 안에 "직전 항목" 상태를 깔끔하게 잡을 지점이 없어 이번
>   범위에서 제외함 — 필요해지면 팩토리에 `lastItemJpPair`류 상태를 추가하고
>   `buildItem` 호출 전에 `excludeVocabConfusionGroup`(pair의 첫 단어 기준 등)을 적용하는
>   방식으로 확장 가능.

**개념**: 히라가나 축에는 이미 `HIRAGANA_CONFUSION_GROUPS`(자형이 비슷해 헷갈리는 10묶음)와
`isSameConfusionGroup()`/`spaceOutConfusionGroups()`로 "혼동군이 연속으로 등장하지 않게"
간격을 벌리는 로직이 있음(간섭 이론/구별 부호화). 어휘 축에는 이 장치가 아직 없어서, 발음이나
의미가 비슷한 단어(예: 계절 인사말, 색깔 계열, 가족 호칭류)가 같은 퀴즈 라운드에 연속으로
나올 수 있음 — 오히려 서로 헷갈리게 만들어 장기기억 정착을 방해할 가능성.

**우선순위**: 중 (완료 — 여러 단어 게임에 걸쳐 적용해야 해서 연동 지점은 많았지만, 핵심
로직은 히라가나 축에서 검증된 패턴을 일반화·재사용한 것이라 리스크는 낮았음)
**난이도**: 중 (완료 — 그룹 데이터 큐레이션과 게임마다 다른 "문제 큐가 만들어지는 지점"을
찾아 일일이 연결하는 데 시간이 들었음. 배치형/동시노출형/순차선택형 세 가지 구조가 섞여
있어 단일 헬퍼 하나로는 부족했고 결국 3가지 변형(재배치·직전 제외·동시 배치 교체)이 됨)
**주의사항**: `spaceOutConfusionGroups`/`isSameConfusionGroup`는 이제 `*Generic` 헬퍼의
얇은 래퍼이므로, 앞으로 세 번째 축(예: 한자 카드 등)에 혼동군 로직을 추가하고 싶으면
새 `isSame*ConfusionGroup`/`spaceOut*ConfusionGroups` 래퍼 한 쌍만 추가하면 됨(제너릭
헬퍼 자체는 다시 수정할 필요 없음). "직전 단어 제외" 방식을 쓰는 게임들은 세션 시작 직후
(currentXxx가 아직 `null`인 시점)에는 자연히 제외가 적용되지 않음 — 의도된 동작(비교할
"직전"이 없으므로).

---

## 16. 낱말찾기 격자 크기를 작업기억 스팬 진단 결과에 맞춰 자동 추천 ✅ 구현 완료

> **구현 내역**: 제안 단계 아이디어를 거의 그대로 구현함(초기값 매핑만 "구간별"이 아니라
> "스팬 값을 4~8 범위로 clamp"하는 단순한 연속 매핑으로 정리).
> - `logic.js`: `WS_SIZE_MANUAL_KEY`(`kotobaWsSizeManual`, `kotobaLearnerProfile`과 별도 키) +
>   `isWsSizeManuallySet()`/`markWsSizeManuallySet()` 신규 추가 — 사용자가 `.ws-size-btn`을
>   한 번이라도 직접 누르면 `'1'`을 저장해 이후 추천을 덮어쓰지 않음.
>   `recommendWsGridSizeFromSpan(span)` 신규 추가 — `workingMemorySpan`이 숫자가 아니면(진단
>   전) `null` 반환, 숫자면 `Math.round` 후 `WS_MIN_SIZE`(4)~`WS_MAX_SIZE`(8)로 clamp.
>   `applyRecommendedWsGridSizeIfNeeded()` 신규 추가 — 수동 선택 이력이 없을 때만
>   `loadLearnerProfile().workingMemorySpan`을 읽어 추천값이 있으면 `wsGridSize`에 반영.
> - `logic.js`: `initWordSearchGame()` 맨 앞(`updateWordSearchSizeButtons()` 호출 전)에
>   `applyRecommendedWsGridSizeIfNeeded()` 호출 추가. `setWordSearchGridSize()`(버튼 클릭
>   핸들러) 맨 앞에 `markWsSizeManuallySet()` 호출 추가.
> - `index.html`/`data.js`: 변경 없음(버튼 UI·데이터 구조 그대로 재사용).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v46` → `koe-app-v47`로 올림.

**개념**: `startWmsSpanTest()`(§1-2 작업기억 스팬 진단)가 이미 `workingMemorySpan`(3~9)을
`loadLearnerProfile()`에 저장해두고 있는데, 지금까지는 `classifyLearnerTendency()`(학습자 성향
분류)에만 쓰이고 낱말찾기의 격자 크기(`wsGridSize`, 4~8)에는 전혀 연결돼 있지 않았음. 작업기억
용량에 맞는 난이도(바람직한 어려움)를 낱말찾기에도 적용해, 너무 쉬워 지루하거나 너무 어려워
좌절하는 상황을 줄임.

**우선순위**: 낮음 (완료 — 이미 있는 진단 데이터를 재활용하는 것이라 비용은 적었고, 체감 효과는
"초기 난이도 하나"에 국한됨)
**난이도**: 낮음 (완료 — 기존 `wsGridSize` 변수의 초기값 결정 로직 한 곳만 수정, 새 UI 없음)
**주의사항**: 진단을 아직 하지 않은 사용자(`workingMemorySpan`이 `null`/숫자가 아님)에게는
`recommendWsGridSizeFromSpan()`이 `null`을 반환해 기존 기본값(8)이 그대로 유지됨 — 진단
여부와 무관하게 항상 정상 동작함. 이후 §17(어휘 혼동 단어 인터리빙)이나 §14(섀도잉 피치
비교)를 진행할 때도 이 패턴(수동 선택 플래그로 자동 추천을 덮어쓰지 않게 보호)을 참고할 만함.

---

## 15. 스트릭 배지·테마 해금 ✅ 구현 완료

> **구현 내역**: 제안 단계 아이디어를 거의 그대로 구현함.
> - `data.js`: `STREAK_BADGES` 신규 추가 — `{days, emoji, label, theme}` 4개
>   (3일 🌱새싹/theme null, 7일 🌸벚꽃/theme 'sakura', 14일 🌊파도/theme 'ocean',
>   30일 🌙보름달/theme 'night'). 한 번 얻은 배지는 스트릭이 끊겨도 유지되도록
>   "누적 도달" 방식으로 설계.
> - `logic.js`: `STREAK_BADGE_KEY`(localStorage, 스트릭 일수 저장소와 별도) +
>   `loadStreakBadgeState()`/`saveStreakBadgeState()` — `{earnedDays:[], activeTheme:null}` 저장.
>   `checkStreakBadges(currentStreak)` 신규 — `recordStreakActivity()`가 `currentStreak`를
>   갱신한 직후 호출돼, 아직 `earnedDays`에 없는 배지 중 방금 조건을 넘긴 것들을 찾아 기록하고
>   `showNewBadgePopup()`(화면 상단에 잠깐 떠오르는 축하 알림, 실패해도 조용히 무시)으로 알림.
>   `applyActiveStreakTheme()`(테마 클래스를 body에 반영, 페이지 로드 시 `initAppLevelUI()`에서
>   호출) / `selectStreakTheme(themeName)`(배지 갤러리 클릭 시 호출 — 미해금 테마는 방어적으로
>   재확인 후 무시, `null`이면 기본 배색으로 복귀) 신규 추가.
> - `logic.js`: `renderStreakBoard()`에 배지 갤러리 UI 추가 — "기본" 버튼 + `STREAK_BADGES` 4개를
>   해금 여부(잠금 이모지 🔒/실제 배지 이모지)와 현재 활성 테마 표시(`.streak-badge-active`)까지
>   함께 렌더링.
> - `index.html`: `.streak-badges`/`.streak-badge`(-locked/-earned/-active)/`.streak-badge-popup`
>   CSS 신규 추가. `body.theme-sakura`/`.theme-ocean`/`.theme-night` 3개 테마 — 기존 `:root`
>   변수 중 강조색 계열(`--hanko`/`--gold`/`--sage`/`--washi-deep`)만 오버라이드하고, `night`
>   테마만 추가로 `--sumi`/`--washi`/`--line`까지 바꿔 실제 다크 테마처럼 보이게 함(레이아웃·폰트·
>   구조는 전혀 건드리지 않음).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v45` → `koe-app-v46`으로 올림.
> - **미구현으로 남긴 것**: 배지를 얻었을 때의 축하 연출은 텍스트 팝업 수준으로 단순화함(원안의
>   "기존 `celebrateCorrect`류 풀스크린 연출 재사용"까지는 하지 않음 — 배지 획득은 게임 도중이
>   아니라 메인 화면 진입 시 조용히 일어나는 경우가 많아, 화면을 전부 가리는 연출보다는 짧은
>   알림이 더 자연스럽다고 판단).

**개념**: 이미 구현된 스트릭(연속 학습 일수, `streakState.currentStreak`/`longestStreak`)에
목표 설정 이론(goal-setting)과 보상을 통한 습관 형성을 얹는 확장. 로드맵 6번 섹션에서
"3일/7일 연속 달성 시 배지·테마 해금은 의도적으로 범위 축소했다"고 남겨뒀던 원안 항목.
분산 학습(spacing effect)의 장기 효과는 결국 "며칠에 걸쳐 꾸준히 학습을 이어가는가"에
달려 있어서, 스트릭 지속 자체를 응원하는 장치는 간접적으로 장기기억 효율에 기여함.

**우선순위**: 중 (완료 — 동기부여 측면의 효과는 크지만, 장기기억 이론을 직접 구현하는 항목은
아니라서 핵심 이론들 대비로는 부가 기능에 가까움)
**난이도**: 중 (완료 — 배지 판정 자체는 간단했고, 테마 시스템도 CSS 변수 오버라이드 범위를
강조색 위주로 좁혀 예상보다 적은 코드로 끝남)
**주의사항**: 배지 판정(`earnedDays`)은 스트릭이 끊겼다가 다시 시작해도 절대 줄어들지 않음
(별도 저장소에 "누적 도달"만 기록하므로 `streakState.currentStreak`이 리셋되는 것과는 완전히
독립적). 새 배지를 추가하고 싶으면 `STREAK_BADGES`에 항목만 추가하면 되고, 코드 쪽 수정은
필요 없음.

---

## 14. 섀도잉 발화 타이밍·억양(피치) 정밀 비교 ✅ 구현 완료

> **구현 내역**: 제안 아이디어대로 "정답 판정에는 영향 없는 덤 정보"로 범위를 좁혀 구현함.
> - `logic.js`: `shadowAttemptStartedAt`/`shadowPitchSamples`/`shadowPitchAnalyser`/
>   `shadowPitchAudioCtx`/`shadowPitchStream`/`shadowPitchIntervalTimer` 전역 상태와
>   `SHADOW_RHYTHM_RATIO_MIN`(0.7)/`SHADOW_RHYTHM_RATIO_MAX`(1.5)/`SHADOW_INTONATION_RANGE_HZ`
>   (40)/`SHADOW_PITCH_SAMPLE_INTERVAL_MS`(150) 상수를 기존 섀도잉 상태 선언부 바로 다음에 추가.
> - `estimateShadowPitchHz(buf, sampleRate)` 신규 추가 — 자기상관(autocorrelation) 기반의
>   대략적인 기본 주파수 추정(정밀한 음악적 피치 추출이 아니라 "오르내리는지" 트렌드 판단용
>   근사치). 70~500Hz(아이 목소리 대역) 밖이거나 무음(rms<0.01)이면 `null`.
> - `startShadowPitchSampling()`/`stopShadowPitchSampling()` 신규 추가 — `SpeechRecognition`이
>   쓰는 마이크와는 완전히 별개로 `getUserMedia`+`AudioContext`+`AnalyserNode`를 열어
>   150ms 간격으로 피치를 샘플링. `AudioContext`/`getUserMedia` 미지원이거나 권한 거부 시
>   catch로 조용히 건너뜀(판정 로직은 항상 정상 동작).
> - `computeShadowRhythmNote(recognitionDurationMs, ttsElapsedMs)` 신규 추가 — 사용자가
>   말한 시간과 TTS 재생 시간의 비율이 0.7~1.5배 안이면 `' · 🏃 리듬이 비슷해요'`, 아니면
>   빈 문자열(긍정 피드백만, 안 비슷하다고 지적하지 않음).
> - `computeShadowIntonationNote(samples)` 신규 추가 — 피치 샘플 최댓값-최솟값이 40Hz 이상
>   차이나면 `' · 🎵 억양이 살아있어요'`. **주의**: 브라우저 `SpeechSynthesis`는 재생 중인
>   오디오를 코드로 가져올 방법이 없어 "TTS 목표 피치 곡선과 비교"는 기술적으로 불가능했음 —
>   그래서 제안 단계의 "방향이 비슷한지 비교"가 아니라 "사용자 발화 자체에 억양 오르내림이
>   있는지"만 보는 것으로 범위를 좁혔음(문서화된 축소).
> - `startShadowAttempt(windowMs, ttsElapsedMs)`(시그니처에 `ttsElapsedMs` 추가) —
>   시도 시작 시 `shadowAttemptStartedAt` 기록 + `startShadowPitchSampling()` 호출.
>   `onresult`(정상 인식)에서만 `computeShadowRhythmNote`+`computeShadowIntonationNote`로
>   `extraNote`를 만들어 `shadowHandleResult(spoken, extraNote)`로 전달 — `onerror`/시간초과
>   시에는 신뢰할 수 있는 측정이 아니므로 `extraNote` 없이 기존과 동일하게 처리.
> - `shadowHandleResult(spokenText, extraNote = '')`(시그니처에 `extraNote` 추가, 기본값 있어
>   기존 단일 인자 호출부도 안전) — 정답/오답 판정(`isCorrect`)에는 전혀 영향 없이, 두 경우
>   모두 피드백 문구 끝에 `extraNote`만 덧붙임.
> - `stopShadowListening()`에 `stopShadowPitchSampling()` 호출 추가 — 게임 이탈/문제 전환 시
>   피치 샘플링용 마이크도 함께 정리.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v48` → `koe-app-v49`로 올림.

**개념**: 로드맵 여러 곳에서 "섀도잉은 1차 구현이 정답 여부만 판정하는 것으로 범위를 좁혀뒀다"고
반복해서 남겨뒀던 확장 항목. 지금은 `shadowHandleResult()`가 인식된 텍스트에 정답 단어가
포함되는지만 보는데, 프로덕션 효과(production effect)는 "정확히 발음하려는 노력" 자체가
기억 강화에 기여한다는 이론이라, 타이밍(리듬)과 억양(피치)까지 비교해 피드백을 주면 발화의
정밀도를 더 끌어올릴 수 있음.

**우선순위**: 중 (완료 — 프로덕션 효과를 정교화하는 방향성은 있었지만, 음성 분석은
브라우저·기기별 편차가 커서 실기기 테스트로 신호 유의미성을 계속 확인해볼 필요는 남아있음)
**난이도**: 높음 (완료 — 피치 추출 자체가 새로운 기술 영역이라 자기상관 기반 프로토타입을
직접 작성함. 특히 "TTS 목표 피치와 비교"가 브라우저 API 한계로 불가능하다는 걸 확인하고
"사용자 발화 자체의 억양 변화 감지"로 범위를 축소한 것이 이번 구현의 핵심 판단이었음)
**주의사항**: 음성 인식/분석 관련 브라우저 API는 기기·브라우저별 지원 편차가 크므로(기존
`ShadowRecognitionAPI` 존재 여부 체크와 동일하게) `AudioContext`/`getUserMedia` 미지원·권한
거부 시 조용히 건너뛰도록 방어적으로 짜뒀음. 별도 `getUserMedia` 스트림을 하나 더 여는 구조라
실기기에서 권한 프롬프트가 중복으로 뜨는지, 모바일 브라우저에서 마이크 스트림 두 개를 동시에
여는 게 문제없는지는 실사용 테스트가 필요함(자동화 테스트로는 확인 불가능한 부분).

---

## 13. 낱말찾기(wordsearch)에도 SRS 가중 출제 적용 ✅ 구현 완료

> **구현 내역**: 9번 섹션에서 "한 번에 4단어를 동시 배치해야 해서 단순 가중 뽑기를 그대로 쓰면
> 특정 단어들이 자꾸 함께 뽑히는 편향이 생길 수 있다"며 보류했던 항목. 다시 검토해보니
> `wordSrsWeightedPick(words, count)`은 이미 "중복 없이 count개를 splice로 뽑는" 구조라
> 여러 개를 한 번에 뽑아도 특정 조합이 고정되지 않고(가중치는 매 호출 시점 최신 `wordStats`로
> 다시 계산됨), 오히려 순수 랜덤보다 "잊어가는 단어들"이 자연스럽게 더 자주 섞여 들어가는
> 효과만 생겨 우려했던 편향 문제가 없었음 — 우려 자체를 재검토해 반영함.
> - `logic.js`: `pickWordSearchWords()`에서 `sort(() => Math.random()-0.5)` 셔플 후 앞에서부터
>   중복 제거하며 4개를 담던 기존 구조를, "먼저 jp 중복만 제거해 후보 풀을 만든 뒤
>   `wordSrsWeightedPick(uniquePool, 4)`로 뽑기"로 교체. jp 중복 제거 로직 자체는 그대로
>   유지(뽑기 전 단계로 위치만 이동).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v44` → `koe-app-v45`로 올림.
> - **미구현으로 남긴 것**: 낱말찾기는 원래 "찾으면 정답만 기록"(`wsCheckSelection`의
>   `recordWordResult(matchedWord, true)`)하고 못 찾은 단어에 대한 오답 기록이나 퍼즐 종료
>   시점 자체가 없는 구조라(다음 퍼즐은 격자 크기 변경 시에만 새로 생성됨), 이번에도 그 구조는
>   건드리지 않음 — "출제 대상 선정"만 가중치를 적용하고 오답 판정 로직은 로드맵 범위 밖으로 둠.

**개념**: 9~12번과 동일한 원리(바람직한 어려움·에빙하우스 망각곡선)를 낱말찾기까지 확장 —
잊어가는 단어가 낱말찾기 퍼즐에도 더 자주 등장함. 이로써 SRS 가중 출제가 어휘 축의 사실상
모든 게임(퀴즈·쓰기·발음·노출·문장·합성어·섀도잉·수수께끼·낱말찾기)에 고르게 적용됨.

**우선순위**: 낮음 (9번 섹션에서 "보류"로 분류됐던 마지막 항목)
**난이도**: 낮음 (우려했던 편향 문제가 실제로는 없어, 중복 제거 순서만 조정하고 기존
`wordSrsWeightedPick()`을 그대로 재사용 — 새 함수·상태·UI 변경 없음)
**주의사항**: 없음 — `wordSrsWeightedPick`이 `count` 개수만큼 배열째 반환하므로 `pickWordSearchWords()`가
그대로 리턴값을 써도 기존 4단어 배열 형태와 동일함.

---

## 12. 수수께끼(riddle)에도 SRS 가중 출제 적용 ✅ 구현 완료

> **구현 내역**: 9번 섹션에서 "`RIDDLES`는 단어와 다른 구조라 대상 밖"이라 남겨뒀던 항목을
> 다시 확인해보니, `RIDDLES` 항목도 다른 단어 데이터처럼 `jp` 필드를 그대로 갖고 있고
> `selectRiddleAnswer()`/`revealRiddleAnswerByTimeout()`가 이미 `recordWordResult(currentRiddle, ...)`
> 로 `wordStats`를 채워두고 있어(출제 순서에는 미반영 상태였을 뿐), 별도 가중 함수 없이
> `wordSrsWeightedPick()`을 그대로 적용할 수 있었음.
> - `logic.js`: `generateRiddleQuestion()`의 `pool[Math.floor(Math.random()*pool.length)]`를
>   `wordSrsWeightedPick(pool, 1)[0]`로 교체(직전 문제와 같은 수수께끼를 거르는 `pool` 필터링은
>   그대로 유지).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v43` → `koe-app-v44`로 올림.
> - **미구현으로 남긴 것**: `buildRiddleChoices()`의 오답 선택지 3개는 여전히 순수 랜덤(정답 외
>   다른 수수께끼 중 무작위)으로 남겨둠 — 오답 선택지는 "얼마나 자주 나오는 문제인가"보다
>   "정답과 헷갈릴 만한 후보인가"가 중요해 SRS 가중치를 적용할 대상이 아니라고 판단함.

**개념**: 9~11번과 동일한 원리(바람직한 어려움·에빙하우스 망각곡선)를 수수께끼 축까지 확장 —
잊어가는 단어의 수수께끼가 더 자주 출제됨.

**우선순위**: 낮음 (9번 섹션에서 "대상 밖"으로 분류됐던 항목을 재검토해 포함시킴)
**난이도**: 낮음 (기존 `wordSrsWeightedPick()`을 다른 단어 게임들과 동일한 패턴으로 재사용 —
새 함수·상태·UI 변경 없음)
**주의사항**: 없음 — `RIDDLES` 항목이 이미 `jp` 필드를 가진 일반 단어 형태라 인자 없이 바로
호환됨. 향후 비슷하게 "단어와 다른 구조"라고 넘겨뒀던 데이터를 다시 살펴볼 때, `jp` 필드
유무부터 확인하면 이번처럼 바로 재사용 가능한 경우가 더 있을 수 있음.

---

## 11. 섀도잉에도 SRS 가중 출제 적용 ✅ 구현 완료

> **구현 내역**: 10번 섹션에서 예고했던 "`shadowQuestions` 채우는 부분에 같은 방식 적용" 확장.
> 섀도잉은 이미 `shadowHandleResult()`가 정오답을 `recordWordResult()`로 `wordStats`에 기록하고
> 있었는데(통계만 쌓일 뿐 출제 순서에는 반영 안 됨), 문제 세트 구성 자체는 여전히 순수 랜덤이었음.
> - `logic.js`: `startShadowingGame()`의 `shadowQuestions` 채우는 반복문에서
>   `activeWords[Math.floor(Math.random()*activeWords.length)]` 대신
>   `wordSrsWeightedPick(activeWords, 1)[0]`을 사용하도록 교체. 매번 활성 단어 전체를 다시
>   넘겨(이전 호출에서 뽑힌 걸 제외하지 않음) 중복 등장을 그대로 허용 — 활성 세트가 10개
>   미만이어도 기존처럼 항상 10문제가 채워짐.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v42` → `koe-app-v43`으로 올림.
> - **미구현으로 남긴 것**: 없음(이번 확장은 "출제 대상 선정" 한 곳만 바꾸면 되는 가장 단순한
>   케이스였음 — 정오답 판정·타이머·SRS 기록 로직은 전혀 손대지 않음).

**개념**: 9~10번과 동일한 원리(바람직한 어려움·에빙하우스 망각곡선)를 섀도잉(D채널, 발화)까지
확장 — 잊어가는 단어가 섀도잉에서도 더 자주 등장함.

**우선순위**: 낮음 (9번 섹션에서 언급됐던 마지막 후보)
**난이도**: 낮음 (기존 `wordSrsWeightedPick()`을 단어 게임들과 동일한 패턴(`[0]` 꺼내 쓰기)으로
그대로 재사용 — 새 함수·상태·UI 변경 없음)
**주의사항**: `wordSrsWeightedPick(words, count)`은 넘겨받은 배열 내에서 중복 없이 `count`개를
뽑는 구조라, 매 반복마다 활성 단어 "전체"를 다시 넘겨야 반복 간에는 중복이 유지됨(누적된 풀을
계속 넘기면 활성 세트가 10개 미만일 때 문제 수가 부족해짐 — 이번에 그 함정을 피해 매번 새로
`activeWords`를 통째로 전달).

---

## 10. 문장 맞히기/합성어 맞추기에도 SRS 가중 출제 확장 ✅ 구현 완료

> **구현 내역**: 9번 섹션에서 "새로운 가중 함수를 설계해야 해서 범위 밖으로 뺌"이라고 남겨뒀던
> 항목. `wordSrsWeightedPick()`은 단어 하나를 뽑는 구조라 재사용할 수 없어, "후보를 구성하는
> 두 단어의 평균 망각확률"을 가중치로 쓰는 별도 함수를 새로 만듦.
> - `logic.js`: `wordSrsWeightedPick()` 바로 다음에 `pairSrsWeightedPick(items, getJpPair)`
>   신규 추가 — `getJpPair(item)`으로 후보에서 단어 두 개의 jp를 뽑아 각각의
>   `srsForgetProbability`를 구하고 평균을 낸 뒤, `wordSrsWeightedPick`과 동일한 가중치 공식
>   (`0.05 + avgForget*0.95`)으로 가중 뽑기(1개 전용, 카운트 인자 없음).
> - `logic.js`: `sentenceGame.buildItem()`의 `pool[Math.floor(Math.random()*pool.length)]`를
>   `pairSrsWeightedPick(pool, s => s.words)`로 교체(`SENTENCES`의 `words` 배열이 이미
>   `[jp1, jp2]` 형태라 그대로 전달).
> - `logic.js`: `compoundGame.buildItem()`의 동일한 랜덤 선택을
>   `pairSrsWeightedPick(pool, c => [c.p1.jp, c.p2.jp])`로 교체.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v41` → `koe-app-v42`로 올림.
> - **미구현으로 남긴 것**: 합성어의 `p1`/`p2`(예: "あさ", "ごはん")는 `compoundGame.onCorrect`가
>   합성어 전체(`compound.jp`)만 `wordStats`에 기록하고 부분 단어는 따로 기록하지 않으므로,
>   그 부분 단어가 다른 단어 게임(퀴즈 등)에서 `DICTIONARY` 단어로 별도로 등장하지 않는 한
>   `wordStats`에 기록이 없어 항상 "미노출(망각확률 1)" 취급됨 — 완전히 무의미하진 않지만
>   (실제로 등장하는 부분 단어가 있다면 그 값이 반영됨), 합성어 자체의 SRS 이력을 직접 가중치에
>   반영하려면 별도 설계가 필요함. 이번 세션에서는 로드맵 원안대로 "구성 단어 기준"으로만 범위를
>   한정함.

**개념**: 9번과 동일한 원리(바람직한 어려움·에빙하우스 망각곡선)를 문장/합성어 축까지 확장 —
잊어가는 단어가 포함된 문장·합성어가 더 자주 출제됨.

**우선순위**: 낮음 (9번에서 범위 밖으로 남겨뒀던 후보 중 첫 번째)
**난이도**: 낮음 (기존 `wordSrsWeightedPick`의 가중치 공식을 그대로 재사용하고, "쌍"을 다루도록
인자만 일반화함 — 새 상태·UI 변경 없음)
**주의사항**: `pairSrsWeightedPick`은 `count` 인자 없이 항상 1개만 반환함(문장/합성어 게임이
매번 정확히 하나의 후보만 필요로 하기 때문) — 여러 개가 필요한 곳에서는 `wordSrsWeightedPick`
처럼 배열 반환+splice 구조로 확장해야 함.

---

## 9. SRS 가중 출제를 다른 단어 게임까지 확장 ✅ 구현 완료 (범위 한정)

> **구현 내역**: `createWordChoiceQuizGame` 팩토리(퀴즈·오디오→이모지)만 쓰던
> `wordSrsWeightedPick()`을, 같은 팩토리를 쓰지 않으면서 "활성 단어 목록에서 단어 하나를
> 순수 랜덤으로 고르는" 구조가 동일한 게임 3곳에 그대로 적용함. 새 로직 없이 기존 랜덤
> 선택 한 줄을 `wordSrsWeightedPick(activeWords, 1)[0]`로 바꾸는 것만으로 충분했음.
> - `logic.js`: `generateWritingQuestion()`(단어 쓰기, C채널) — `Math.floor(Math.random()*...)`
>   대신 `wordSrsWeightedPick(getActiveWords(), 1)[0]`로 교체.
> - `logic.js`: `generatePronounceQuestion()`(발음 인식, D채널) — 동일 방식으로 교체.
> - `logic.js`: `generateExposureQuestion()`(반복 노출, A단계) — 동일 방식으로 교체. A단계
>   게임이라도 아직 안 만난 단어는 `srsForgetProbability`가 망각확률 1(최댓값)을 반환해 자연히
>   최우선으로 뽑히므로 "새 단어부터" 원칙은 그대로 유지되고, 이미 배웠지만 오래돼 잊어가는
>   단어도 함께 다시 노출되는 부가 효과가 생김.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v37` → `koe-app-v38`로 올림.
> - **미구현으로 남긴 것(의도적 범위 축소)**: (1) 문장 맞히기/합성어 맞추기(`createSequencePickQuizGame`
>   팩토리)는 `DICTIONARY` 단어가 아니라 `SENTENCES`/`COMPOUNDS`(단어 쌍) 목록에서 고르는 구조라,
>   가중치를 적용하려면 "그 쌍을 구성하는 두 단어의 평균 망각확률"처럼 새로운 가중 함수를 설계해야
>   함 — 이번 세션의 "한 줄 교체"로는 안전하게 끝나지 않아 범위 밖으로 뺌. (2) 낱말찾기(wordsearch)는
>   한 번에 4단어를 동시에 배치해야 해서 단순 가중 뽑기를 그대로 쓰면 특정 단어들이 자꾸 함께
>   뽑히는 편향이 생길 수 있어 보류. (3) 수수께끼(riddle)는 `RIDDLES`(문제 데이터, 단어와 다른
>   구조)에서 고르므로 대상 밖. (4) 섀도잉(shadowing)은 이미 "1차 구현은 정답 여부만 판정" 원칙으로
>   범위를 좁혀뒀던 게임이라 이번에도 손대지 않음(향후 원하면 `shadowQuestions` 채우는 부분에
>   같은 방식 적용 가능).

**개념**: 바람직한 어려움(desirable difficulty)·에빙하우스 망각곡선 원리를 어휘 축의 더 많은
채널(A 노출·C 회상·D 발화)에 고르게 적용 — 잊어버릴 것 같은 단어가 어느 게임을 하든 더 자주
마주치게 됨.

**우선순위**: 낮음 (완료 — 로드맵에 마지막으로 남아있던 후보)
**난이도**: 낮음 (완료 — `wordSrsWeightedPick()`이 이미 범용으로 설계돼 있어 순수 랜덤 선택
한 줄을 교체하는 것만으로 끝났음. 새 상태·UI 변경 없음)
**주의사항**: `wordSrsWeightedPick(words, count)`은 `count`개를 중복 없이 뽑아 배열로 반환하므로,
단어 하나만 필요한 자리에서는 항상 `[0]`을 붙여 꺼내 써야 함(이번에 적용한 세 곳 모두 동일 패턴).

---

## 8. 철자 맞추기(spelling) 결과 화면 도입 + 어휘 복습 세트 세 번째 라운드 합류 ✅ 구현 완료

> **구현 내역**: 6번 섹션에서 "명확한 종료 시점이 없어" 제외했던 철자 맞추기 게임에
> quiz/sentence와 동일한 "N문제 풀면 결과 화면" 구조를 추가하고, 그 결과로 어휘 복습 세트
> (`VOCAB_REVIEW_GAME_TYPES`)의 세 번째 라운드로 합류시킴.
> - `logic.js`: `spellingIndex`/`SPELLING_TOTAL_QUESTIONS`(=10)/`spellingMaxCombo`/
>   `spellingCorrectCount` 신규 상태 추가. `startSpellingRound()`(라운드 시작 시 점수·콤보·
>   진행도 초기화 후 첫 문제 출제) 신규 추가 — 기존에 `switchMode()`가 직접 부르던
>   `generateSpellingQuestion()`을 이 함수가 대체함. `generateSpellingQuestion()` 맨 앞에
>   `spellingIndex >= SPELLING_TOTAL_QUESTIONS`면 `showSpellingResult()`를 부르고 return하는
>   가드를 추가하고, 진행도(`#spellingProgress`)도 매 문제 갱신. `selectSpellingLetter()`의
>   단어 완성 분기에서 `spellingIndex`/`spellingCorrectCount`/`spellingMaxCombo` 갱신 추가.
>   `showSpellingResult()`(결과 화면 표시 + `scheduleNextVocabReviewRound()` 호출) 신규 추가 —
>   quiz의 `showResult()`와 동일한 패턴.
> - `logic.js`: `switchMode()`의 `spelling` 분기가 `generateSpellingQuestion()` 대신
>   `startSpellingRound()`을 호출하도록 변경(탭 진입/복습 세트 라운드 시작 시 항상 새 10문제
>   라운드로 초기화됨). `refreshActiveModeAfterFilterChange()`의 spelling 분기도 quiz/sentence와
>   동일하게 "문제 화면이 보일 때만 다음 문제 출제"로 변경(결과 화면 노출 중엔 필터 변경으로
>   덮어쓰지 않음).
> - `logic.js`: `VOCAB_REVIEW_GAME_TYPES`에 `'spelling'` 추가(`['quiz','sentence','spelling']`) —
>   `VOCAB_REVIEW_SESSION_ROUNDS`가 배열 길이를 그대로 쓰므로 자동으로 3라운드가 됨. 별도 라운드
>   진행 로직 수정은 필요 없었음(`playNextVocabReviewRound()`가 `launchGame('spelling')` →
>   `switchMode('spelling')` → `startSpellingRound()`로 그대로 이어짐).
> - `index.html`: `spellingMode`에 진행도(`문제: N/10`) 표시 추가, 기존 문제 풀이 마크업을
>   `#spellingQuestionScreen`으로 감싸고 그 아래 `#spellingResultScreen`(기존 `.hs-result-*`
>   클래스 재사용, 새 CSS 없음)을 신규 추가. 어휘 복습 세트 안내 문구(`ltmVocabReviewDesc`
>   기본 텍스트, 복습 세트 이론 카드 설명)에 "철자 맞추기"를 추가로 언급.
> - `sw.js`: `CACHE_NAME`을 `koe-app-v36` → `koe-app-v37`로 올림.

**개념**: 인출 연습(retrieval practice)과 분산 학습을 어휘 축 전 채널(B 재인=퀴즈, D 발화=
문장 맞히기, C 회상=철자 맞추기)에 고르게 적용 — 복습 세트가 이제 세 채널을 모두 순환하며
돌아가게 됨.

**우선순위**: 중 (완료 — 6번 섹션에서 "미구현으로 남긴 것"으로 명시적으로 남겨뒀던 항목)
**난이도**: 낮음 (완료 — quiz/sentence의 결과 화면 패턴을 그대로 옮겨온 것이라 새로운 판정
로직은 없었고, 기존 무한 반복 루프에 "10개마다 멈춤" 조건만 끼워 넣으면 됐음)
**주의사항**: `startSpellingRound()`을 거치지 않고 `generateSpellingQuestion()`을 직접 호출하는
곳이 남아있으면 라운드 상태(`spellingIndex` 등)가 초기화되지 않은 채로 시작될 수 있음 — 새로운
진입점을 추가할 땐 항상 `startSpellingRound()`을 통해서 시작하도록 유지할 것.

---

## 7. "자기참조 효과"의 단어 축 확장 ✅ 구현 완료

> **구현 내역**: 히라가나 상세보기(`showLtmDetail()`)에서 쓰던 자기참조 위젯
> (`renderSelfReferenceHtml`/`toggleSelfReferenceEmoji`)이 애초에 key 하나만 받는 범용
> 함수였다는 점을 활용 — ch(히라가나 한 글자)든 jp(단어 전체 문자열)든 `localStorage`의
> 같은 `kotobaSelfReferenceNotes` 객체에 서로 다른 key로 저장될 뿐이라 두 축이 저장소를
> 공유해도 충돌하지 않음. 그래서 이 확장은 위젯 자체는 전혀 손대지 않고, 그 위젯을 담을
> "단어 상세보기" 화면만 새로 만들어 단어 카드(갤러리)에서 열 수 있게 연결함.
> - `logic.js`: `toggleSelfReferenceEmoji()` 바로 다음에 `findDictionaryWord(jp)`(DICTIONARY에서
>   jp로 단어 조회), `showWordDetail(jp)`(채널별 B 재인/C 회상/D 발화 정답·오답, `computeWordGameStage()`
>   기반 A~E 단계, 자기참조 위젯을 `#wordDetailBox`에 렌더), `closeWordDetail()` 신규 추가.
>   `showLtmDetail()`과 동일한 `.ltm-detail-*` 마크업/CSS를 그대로 재사용해 새 CSS를 최소화함.
> - `logic.js`: `buildGallery()`의 각 `.gcard`에 `.gcard-detail-btn`(🔍) 버튼 추가, 클릭 시
>   `stopPropagation()`으로 기존 카드 클릭(뒤집기+발음)과 분리해 `showWordDetail(w.jp)` 호출.
>   필터 변경 등으로 갤러리가 다시 그려질 때 열려있던 상세보기를 `closeWordDetail()`로 닫음.
> - `index.html`: `.gcard`에 `position:relative` 추가, `.gcard-detail-btn` CSS 신규 추가
>   (`.gcard * { pointer-events:none }` 규칙을 이 버튼만 `pointer-events:auto`로 되돌려 카드
>   전체 클릭과 독립적으로 동작하게 함). `#gallery` 바로 아래 `.ltm-detail-box` 마크업을 재사용한
>   `#wordDetailBox` 신규 추가. 단어 카드 안내 문구에 🔍 버튼 설명 추가. 자기참조 효과 이론
>   카드(14번)의 "📍 적용" 문구에 단어 축 확장 내용 한 줄 추가(새 카드는 만들지 않음 — 기존
>   이론의 적용 범위 확장이라 이론 개수는 그대로 유지).
> - `sw.js`: `CACHE_NAME`을 `koe-app-v35` → `koe-app-v36`으로 올림.

**개념**: Part 4 §4에서 히라가나 글자에만 적용했던 자기참조 효과(self-reference effect)를
단어에도 동일하게 적용 — "이 단어, 나의 하루와 닮은 점이 있나요?" 질문에 이모지로 답하며
단어를 자기 경험과 연결지으면 더 오래 기억에 남음.

**우선순위**: 중 (완료 — Part 4 §4 "미구현으로 남긴 것"에 남아있던 항목)
**난이도**: 낮음 (완료 — 자기참조 위젯 자체는 이미 범용으로 설계돼 있어 재사용만 하면 됐고,
새로 만든 건 그 위젯을 담을 상세보기 화면과 갤러리 카드의 정보 버튼뿐)
**주의사항**: `.gcard * { pointer-events:none }` 규칙 때문에 카드 안에 새 인터랙티브 요소를
추가할 때는 항상 그 요소에 `pointer-events:auto`를 명시하고 `stopPropagation()`으로 카드
자체 클릭 핸들러와 분리해야 함 — 이번 `.gcard-detail-btn`이 그 패턴의 예시.

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
