# 레이어화 로드맵 — 「こえ」를 3레이어 확장 가능 학습 플랫폼으로

> 이 문서는 「こえ」 히라가나 학습 앱(index.html / logic.js / data.js / sw.js)을 **범용 학습 엔진
> (Layer 1) / 언어 학습 도메인(Layer 2) / 특정 언어 데이터(Layer 3)** 3레이어 구조로 점진적으로
> 전환하는 작업을 이어받을 다른 Claude 세션을 위한 인수인계 문서예요. 코드를 처음 보는 상태에서도
> 바로 작업을 시작할 수 있도록 목표 구조, 단계별 계획, 건드려야 할 파일/함수를 구체적으로 적어뒀어요.
>
> 기존 학습이론(19개) 구현 배경과 세부 내역은 이 문서가 아니라 `learning-theory-roadmap-REFERENCE.md`
> 를 참고하세요 — 그 문서는 더 이상 갱신하지 않는 참고용 아카이브고, **작업마다 갱신해야 하는 문서는
> 지금부터 이 파일**입니다.

---

## 0. 먼저 알아야 할 것 — 프로젝트 구조

### 파일 4개 세트 (레이어화 이후에도 배포 방식은 동일)
- `index.html` — 마크업 + `<style>` 전체(CSS 변수 기반 디자인 시스템) + iframe/스크립트 로드
- `logic.js` — 전체 게임 로직 (12,600줄+, 레이어화 전). 함수/상태가 거의 다 여기 있음
- `data.js` — 정적 데이터(단어 목록, 히라가나 획순 좌표, 메뉴 구조 등)
- `sw.js` — 서비스워커. **파일을 하나라도 바꾸면 `CACHE_NAME` 버전을 반드시 올려야** 사용자 브라우저가
  새 버전을 받아감

작업 후에는 **수정한 파일들을 항상 같이 교체**해서 배포 안내할 것. 레이어화가 진행되면 파일 세트 자체가
늘어날 수 있음(예: `engine.js`/`language-core.js`/`targets/hiragana.js`) — 늘어나는 시점에 이 표를 갱신할 것.

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
이 톤은 「こえ」(일본어 팩)의 정체성이지 범용 UI의 정체성이 아님. Layer 1/2에서 만드는 UI 요소는
이 변수들을 **참조**하되, 다른 학습 대상 팩을 붙일 때 테마 전체를 교체할 수 있어야 한다는 점을 항상
염두에 둘 것 (구체 방법은 아직 미정 — §4 참고).

---

## 1. 목표 구조

```
Layer 3 — 특정 대상 (예: 일본어 히라가나 팩)
  └─ 문자/단어 데이터, 자형 혼동군, 연상 이미지·이야기, 한국어 UI 문구
Layer 2 — 학습 영역 (예: 언어 학습)
  └─ 4채널 모델(노출·인식·회상·발화), 섀도잉/발음 피드백, 혼동어 인터리빙, 어휘 축 오케스트레이터
Layer 1 — 범용 학습 (모든 학습 대상 공통)
  └─ SRS·망각곡선, 통계 엔진, 메타인지 추적, 습관 형성(스트릭)
```

**판별 기준**: "이 로직/데이터가 히라가나가 아닌 다른 문자 체계(예: 알파벳)나, 언어가 아닌 다른 학습
대상(예: 수학 구구단)에도 그대로 쓰일 수 있는가?" — 그렇다면 아래쪽 레이어, 특정 표기 체계나 콘텐츠에
묶여 있다면 위쪽 레이어.

### 현재 코드 → 목표 레이어 매핑 (진단 결과, 2026-07-27 세션 기준)

| 레이어 | 이미 해당되는 것 (그대로 옮기면 됨) | 아직 섞여 있는 것 (분리 필요) |
|---|---|---|
| Layer 1 | `srsUpdateStat`/`srsForgetProbability`, `createHiraganaStatsEngine()` 팩토리 패턴, `isSameConfusionGroupGeneric`/`spaceOutConfusionGroupsGeneric`, `streakState`, `selfJudgments`/`recordSelfJudgment`, `storageKey`/`migrateLegacyStorageKey`(§3-2 신규 헬퍼), `createGenericQuizEngine(cfg)`(§3-5 — `createMatchRevealQuizGame`/`createWordChoiceQuizGame`/`createUnlimitedChoiceQuizGame` 3개가 이 위의 어댑터로 전환됨) | `localStorage` 키가 아직 일부 `kotoba` 접두사로 하드코딩(`kotobaStreak` 등) — 다른 대상 추가 시 네임스페이스 충돌. 19개 키 중 16개 전환 완료, 3개 남음(`WORD_STATS_KEY`/`STREAK_KEY`/`STREAK_BADGE_KEY` — §3-2 참고, 영향범위·체감도가 높아 마지막으로 남겨둠). `createSequencePickQuizGame`(sentence/compound)은 다단계 선택 상호작용이라 `createGenericQuizEngine`으로 수렴시키지 않고 독립 factory로 남기기로 판단(§3-5 참고, 다음 세션에서 최종 확정) |
| Layer 2 | `computeLtmStatus`(4채널 가중평균 설계), 섀도잉 피치 비교(`estimateShadowPitchHz` 등), `speakTTS`의 `jitter`, `pickNextGameForSession`/`classifyLearnerTendency` 오케스트레이터 | 함수 내부에 `ch`(글자)/`jp`(단어) 같은 일본어 전용 변수명이 그대로 쓰여 재사용 시 이름 변경 필요. 위 4개 quiz factory의 `cfg.questionText`/`speakTTS` 등 음성·문항 콜백 부분(엔진과 분리 필요, §3-5) |
| Layer 3 | `HIRAGANA_LIST`, `DICTIONARY`, `HIRAGANA_STROKES`, `HIRAGANA_MNEMONICS`, `HIRAGANA_CONFUSION_GROUPS`, `HIRAGANA_SAMPLE_WORDS` | 데이터 필드명(`ch`, `jp`, `kr`, `romaji`)과 46자 고정 전제가 로직 곳곳에 하드코딩돼 있어, 데이터만 교체해서는 안 되고 로직 쪽 어댑터가 필요함 |

물리적으로는 세 레이어가 여전히 `logic.js` 한 파일에 섞여 있음 — 파일 분리는 §3-3에서 다룸 (우선순위 낮음, 가장 마지막 단계).

---

## 2. 진행 방식 원칙

- **빅뱅 리팩터링 금지.** 12,600줄을 한 번에 재구성하면 회귀 위험이 너무 큼. 아래 §3의 단계는 각각
  **독립적으로 배포 가능**하고, 기존 기능이 하나도 깨지지 않는 선에서만 진행할 것.
  물리적 파일 분리(§3-3)는 §3-1(데이터 계약)과 §3-2(네임스페이스 이관)가 끝난 뒤에만 시도한다.
- **새 기능을 추가할 때마다 그 코드가 Layer 1/2/3 중 어디 것인지 먼저 정하고**, 지금 물리적으로는
  `logic.js`/`data.js`에 계속 쓰더라도 위치를 이 문서의 매핑 표에 기록해 나갈 것. 파일이 실제로
  분리되기 전에도 "개념적으로는 이미 레이어링된 상태"를 유지하는 게 목표.
- 검증 기준은 "이론상 분리됨"이 아니라 **"두 번째 학습 대상(팩)을 실제로 하나 붙여봤을 때 얼마나
  적은 수정으로 되는가"** — §3-4(파일럿)가 이 판단 시점.

### 2-1. 다중 세션 분할 원칙 (세션 중간에 작업이 끊기지 않도록)

이 로드맵의 각 단계(§3-1~3-5)는 **한 세션 안에서 절대 다 끝내려 하지 말 것**을 기본 전제로 설계됨.
12,600줄짜리 파일을 다루는 작업 특성상, 한 세션에서 여러 단계를 몰아서 처리하려다 중간에 세션이 끊기면
"부분적으로만 적용된 상태"가 배포되거나 다음 세션이 어디까지 됐는지 몰라 재작업하는 위험이 큼. 따라서:

- **세션 시작 시**: 이 문서를 읽고, 각 §3-N 제목의 상태 표시(미착수 / 🚧 진행 중 / ✅ 구현 완료)를 먼저
  확인해 "지금 이어받아야 할 지점"을 정확히 찾을 것. 🚧 진행 중 표시가 있는 섹션이 있다면 새 단계를
  시작하지 말고 그 섹션의 "구현 내역"에 적힌 이어서 할 일부터 처리.
- **작업 단위 쪼개기**: 각 §3-N 단계는 그 자체로도 여러 세션에 걸쳐 나눠 진행 가능하도록 계획할 것.
  한 세션에서 처리할 작업량의 기준은 "지금 배포해도 기존 기능이 하나도 안 깨지는 상태로 멈출 수 있는
  지점"까지만 — 예: §3-5(게임엔진)는 4개 factory 중 1개씩만 전환하고 세션을 마칠 것(문서에 이미 명시).
  하나의 단계 안에서도 안전하게 멈출 수 있는 하위 지점이 여러 개면, 그중 하나를 골라 거기서 멈추고
  다음 세션으로 넘길 것 — 억지로 단계 전체를 한 세션에 끝내려 하지 않는다.
- **세션을 마칠 때(작업이 안 끝난 채 세션이 종료될 것 같을 때)**: 반드시 아래를 이 문서에 반영한 뒤
  마칠 것 — 다음으로 미루지 않는다:
  1. 해당 §3-N 제목에 "🚧 진행 중" 표시
  2. 그 아래 "구현 내역" 인용 블록에 **지금까지 바꾼 파일/함수명 + 아직 안 바꾼 부분 + 다음에 이어서
     할 구체적인 다음 작업(어느 함수부터 시작하면 되는지)**을 적어, 다음 세션이 코드를 처음부터 다시
     읽지 않고도 바로 이어받을 수 있게 할 것
  3. 중간에 끊긴 상태라도 그 시점까지 수정한 파일 세트는 항상 정상 동작하는 상태여야 함(§2의
     "기존 기능이 하나도 깨지지 않는 선에서만 진행" 원칙과 동일) — 끊긴 지점이 배포 가능한 상태가
     아니라면, 롤백해서라도 정상 동작하는 지점까지 되돌린 뒤 그 지점을 "다음 시작점"으로 기록할 것
- **단계 하나가 완전히 끝났을 때만** "✅ 구현 완료"로 표시하고 다음 단계로 넘어갈 것 — 부분 완료 상태를
  ✅로 표시하지 않는다.

---

## 3. 단계별 계획

### 3-1. 데이터 계약(스키마) 정의 — ✅ 구현 완료 (일단락, 2026-07-28 세션 — 아래 "다음 세션에서 이어서 할 일" 8번 참고)

**개념**: Layer 3(특정 대상)가 Layer 2(도메인)에 넘겨야 하는 최소한의 공통 아이템 형태를 먼저
인터페이스로 못박는다. 예: `{key, displayForm, audioText, meta}` 같은 범용 학습 아이템 형태를 정의하고,
`HIRAGANA_LIST`/`DICTIONARY`를 이 형태로 변환하는 **어댑터 한 겹**을 추가(기존 데이터 구조 자체는 안 건드림).

**구현 내역 (2026-07-28 세션)**:
- `data.js` 끝에 `toGenericLearningItem(entry)` 어댑터 추가 — `HIRAGANA_LIST`/`DICTIONARY` 원본은
  전혀 안 건드리고, `entry.ch`가 있으면 히라가나로, `entry.jp`가 있으면 단어로 판별해 `{key,
  displayForm, audioText, meta}` 형태로 변환. `key`는 기존 `charStats`/`wordStats` 저장소가 이미
  `ch`/`jp` 원문 문자열을 키로 쓰고 있어서 **호환을 위해 그대로 원문을 씀** — 다음 세션에서도 이 부분은
  절대 다른 형식으로 바꾸지 말 것(바꾸면 기존 사용자 학습 기록과 어긋남).
- `logic.js`에 `selfCheckGenericLearningItemAdapter()` 추가, `initAppLevelUI()` 첫 줄에서 호출 —
  화면·저장소에는 전혀 영향 없이 콘솔에만 결과를 남기는 읽기 전용 점검. 아직 실제 통계/게임 로직
  호출부는 하나도 안 바뀜(§3-1 구현 계획의 2번째 항목 "위험도 낮은 곳 1군데 시범 전환"은 **아직
  안 함** — 이번 세션은 1번째 항목까지만).
- **Node로 실제 데이터 기준 정적 검증 완료** (브라우저 실행 환경이 없어 이 정도가 이번 세션에서 할 수
  있는 최대한의 검증): 히라가나 46개는 전부 `key`가 원본 `ch`와 일치하고 중복 없음(OK). 어휘는
  991개 항목 모두 변환은 되지만 **`key`(=`jp`) 중복이 2건 발견됨** — `くも`(구름/거미),
  `はし`(다리/젓가락)가 서로 다른 단어인데 `jp` 값이 같음. 이건 어댑터가 만든 문제가 아니라
  **기존 `DICTIONARY`/`wordStats[w.jp]` 구조에 원래 있던 성질**(같은 표기의 동음이의어가 이미 학습
  통계를 공유하고 있었음)을 어댑터가 그대로 드러낸 것.

**다음 세션에서 이어서 할 일**:
1. **(사용자 결정: 보류)** `jp` 중복(동음이의어, `くも`/`はし`) 처리는 2026-07-28 세션에서 사용자에게
   물어본 결과 **"일단 보류 — 다른 작업부터 진행"**으로 확정. 다음 세션은 이 건을 임의로 다시 꺼내
   진행하지 말 것 — 사용자가 먼저 이 주제를 꺼낼 때만 다시 논의. 그때까지 `toGenericLearningItem`의
   `key=jp` 방식은 그대로 유지.
2. ✅ (2026-07-28 이어지는 세션에서 완료) 구현 계획 2번째 항목 — 위험도 낮은 호출부 1군데 시범 전환.
   `computeActiveSetStageDistribution()`(logic.js)을 골라 `getActiveCharList().map(item => item.ch)`
   직접 접근을 `getActiveCharList().map(toGenericLearningItem)` + `item.key`로 완전히 교체(어댑터
   경로만 남기고 기존 `entry.ch` 직접 접근은 제거). 이 함수는 `computeCombinedStageDistribution()` →
   `pickNextGameForSession()`("오늘의 추천" 배너)에서만 쓰여 회귀 범위가 좁고, `item.key`가
   `entry.ch`와 항상 같은 값이라 동작은 이전과 100% 동일 — `node -c` 문법 검사만 통과 확인(브라우저
   실행 테스트는 못 함, 배포 후 "오늘의 추천" 배너가 평소처럼 뜨는지 한 번 확인 권장).
   **추가 전환 (같은 날 이어지는 세션)**: `getVocabReviewCandidateWords()`(logic.js)도 같은 방식으로
   전환 — `wordStats[w.jp]`/`computeWordGameStage(w.jp)`의 `w.jp` 직접 접근을
   `toGenericLearningItem(w).key`로 교체. **단, 이 함수는 앞의 것과 달리 통계 집계 결과가 아니라
   DICTIONARY 원소 배열(`words`) 자체를 그대로 반환해서 다른 화면이 `w.kr`/`w.emoji` 등을 그대로 쓰고
   있음** — 그래서 반환값 형태는 전혀 안 건드리고, 통계 조회에 쓰는 키 접근 부분만 어댑터 경로로
   바꿈(반환 형태까지 어댑터 형태로 바꾸면 다른 여러 화면이 한꺼번에 깨질 위험이 있어 범위를 의도적으로
   좁힘). `node -c` 통과 확인, 브라우저 테스트는 못 함 — 배포 후 "어휘 복습 세트 시작하기"가 평소처럼
   후보 단어를 잘 뽑는지 확인 권장.
   **세 번째 전환 (또 이어지는 세션)**: `getReviewCandidateChars()`(logic.js, 히라가나 복습 세트용)도
   같은 패턴으로 전환 — `HIRAGANA_LIST.map(item => item.ch)`를
   `HIRAGANA_LIST.map(toGenericLearningItem).map(item => item.key)`로 교체. 반환값(문자열 배열)
   형태는 그대로라 하위 호출부(`buildReviewGameQueue`, `startReviewSession` 등)엔 영향 없음.
   **`renderStatGrid`에 대한 정정**: 지난 세션에 "다음 후보"로 적어뒀던 `renderStatGrid`를 실제로
   열어보니, 이건 `entry.ch`(HIRAGANA_LIST 원소)를 읽는 게 아니라 `HS_TABLE_ROWS`라는 **5열 오십음도
   그리드 레이아웃용 상수**(`row.chars`, `null`이 섞인 고정 배열)에서 순수 문자열 `ch`를 그대로 꺼내
   쓰는 구조였음 — 즉 여기엔 어댑터로 감쌀 만한 "entry"가 애초에 없고, `charStats[ch]`로 문자열
   키 조회하는 부분은 이미 어댑터의 `key` 규칙과 사실상 같은 방식이라 **이 함수는 §3-1의 전환
   대상이 아님**. 여기서 남는 진짜 이슈는 다른 성격(오십음도 5열 그리드라는 레이아웃 자체가
   히라가나 전용이라는 것)이라 §3-1이 아니라 §3-2/§3-3(레이아웃·표시 방식의 대상 종속성) 쪽에서 다룰
   문제 — 필요하면 그때 새 항목으로 옮겨 적을 것.
   **다음 후보지**: 이번 세션까지 3곳 전환(`computeActiveSetStageDistribution`,
   `getVocabReviewCandidateWords`, `getReviewCandidateChars`). 남은 `entry.ch`/`w.jp` 직접 접근부는
   logic.js 1024번 줄 부근 패턴으로 grep(`item.ch`/`item.jp`/`h.ch`/`w.jp` 등)해서 다음 세션에서
   1개씩 이어서 전환할 것(§2-1 원칙). 이제 남은 곳들은 대부분 `DICTIONARY.find(w => w.jp === ...)`류
   검색 호출이라, 앞의 3곳과 달리 "생성 후 필터링"이 아니라 "역방향 조회"라 전환 패턴이 다를 수 있음 —
   다음 세션에서 패턴을 먼저 다시 살펴볼 것.

   **네 번째 전환 (또 이어지는 세션, 역방향 조회 패턴 첫 적용)**: 위에서 예고한 "역방향 조회"류를
   위해 `data.js`에 `findGenericLearningItemByKey(key, kind)` 함수를 새로 추가함(`toGenericLearningItem`의
   반대 방향 — key만 갖고 원본 entry를 찾아 일반화된 형태로 돌려줌. `kind`는 `'char'|'word'` 힌트,
   생략하면 히라가나 쪽을 먼저 찾음). 이 함수로 `enrichTodayLearnedItem()`("자기 전 하이라이트" 카드에
   쓰이는 로그 보강 함수)을 전환 — `HIRAGANA_LIST.find(h => h.ch === item.key)`/
   `DICTIONARY.find(d => d.jp === item.key)` 직접 호출과 이후 `found.romaji`/`dictEntry.kr`/
   `dictEntry.emoji` 직접 접근을 전부 `found.meta.romaji`/`found.meta.kr`/`found.meta.emoji`로
   교체. `item.type`을 `kind` 힌트로 넘겨서 히라가나/어휘 중 정확히 그쪽만 찾게 해 오판정 위험을 없앰.
   Node vm으로 실제 데이터 기준 조회 결과(히라가나 히트/어휘 히트/미스/힌트 생략 케이스)까지 검증
   완료 — 전부 기존과 동일한 필드 값을 정확히 돌려줌을 확인함. 브라우저 UI 테스트는 못 함 — 배포 후
   "자기 전 하이라이트" 프롬프트가 평소처럼 뜨는지 확인 권장.
   **다음 후보지**: `findGenericLearningItemByKey`는 이제 재사용 가능한 공용 함수로 준비됐으므로,
   다음 세션은 나머지 역방향 조회 지점들(예: `hsPlayStatCellPreview` 부근, 5410~5411번 줄의 문장 게임
   단어 조회, 6585번 줄의 `DICTIONARY.filter(w => w.jp.startsWith(ch))` 등)을 하나씩 이 함수로 옮기는
   작업으로 이어갈 것 — 단, 6585번 줄처럼 "정확히 일치"가 아니라 "접두어로 시작하는 여러 개"를 찾는
   경우는 `findGenericLearningItemByKey`(단일 정확 일치 전용)로는 못 바꾸므로 그런 곳은 건너뛰고
   정확 일치 조회 지점부터 먼저 정리할 것.

   **다섯 번째 전환 (또 이어지는 세션)**: `getWordPos(word)`(logic.js) — `DICTIONARY.find(d => d.jp
   === word.jp)` 직접 호출을 `findGenericLearningItemByKey(word.jp, 'word')`로 교체하고
   `found.pos` 대신 `found.meta.pos`로 접근. 이 함수는 반환값이 `pos` 문자열 하나뿐이라(엔티티
   전체를 돌려주지 않음) 블라스트 레이디어스가 가장 좁은 축에 속함 — DICTIONARY 991개 전체를 놓고
   기존 로직과 새 로직의 결과를 Node에서 1:1 대조해 완전히 일치함을 확인함(단순 문법 검사보다 한 단계
   더 나간 실제 데이터 회귀 검증).
   **이번 세션에 살펴보고 "적합하지 않다"고 판단해 건너뛴 후보들** (다음 세션이 같은 곳을 다시 검토하지
   않도록 기록): `sentenceGame`의 `buildItem()`(logic.js, 5410~5411번 줄 부근) — `DICTIONARY.find()`로
   찾은 `word1`/`word2`를 **원본 엔트리 형태 그대로** `part1`/`part2`로 반환하고, 같은 함수 안의
   `speak()`/`hint()`도 `word1.jp` 등 원본 필드를 그대로 참조함. `getVocabReviewCandidateWords`처럼
   "반환 형태를 유지한 채 내부 키 조회만 바꾸는" 패턴을 적용하려 해도, 여기서는 조회 직후 바로 원본
   필드를 여러 군데서 쓰고 있어 어댑터로 바꿔도 실익이 없고 오히려 이중 조회(원본용 1번 + 어댑터용
   1번)만 늘어남 — 이 지점은 §3-1 범위에서 제외. `findDictionaryWord(jp)`(logic.js, 1847번 줄) —
   여러 호출부가 반환값을 원본 DICTIONARY 엔트리로 기대하는 범용 접근 함수라, 이미 그 자체로 "DICTIONARY
   접근을 한 곳으로 모은 choke point" 역할을 하고 있음 — 이 함수 자체를 바꾸는 실익이 낮아 제외.
   `hsPlayStatCellPreview`(logic.js) — 애초에 HIRAGANA_LIST/DICTIONARY를 전혀 조회하지 않고 이미
   문자열로 받은 `ch`를 소리내 읽어주기만 하는 함수라 애초에 전환 대상이 아니었음(지난 세션에
   "다음 후보"로 잘못 적어뒀던 것 — 정정).
3. ✅ (2026-07-28 이어지는 세션에서 완료) `index.html`/`sw.js`가 업로드돼 `sw.js`의 `CACHE_NAME`을
   `koe-app-v49` → `koe-app-v50`으로 올림. `index.html`은 `data.js`→`logic.js` 스크립트 로드 순서가
   이미 어댑터 함수 정의 순서와 맞아서 별도 수정 불필요했음. 같은 날 `logic.js`/`data.js`를 네 번 더
   수정한 뒤(위 2번 항목의 추가 전환들) `koe-app-v54`까지 순서대로 올림 — logic.js/data.js를 고칠
   때마다 매번 올려야 하므로, 이후로도 파일 수정이 있으면 버전이 계속 올라갈 것

4. ✅ (2026-07-28 또 이어지는 세션에서 판별 완료, 코드는 변경 안 함) 레벨/오답 후보 풀 선정부
   (`generatePlacementQuestion()`, logic.js 3350~3374번 줄 `levelPool`/`distractorPool`)와 낱말찾기
   그리드 풀(`pickWordSearchWords()`, logic.js 4282~4290번 줄 `pool`)을 열어봄. 둘 다 앞서 정리한
   원칙("반환값이 원본 엔트리 배열 그대로면 §3-1 대상에서 제외")에 그대로 걸림 — `levelPool`/
   `distractorPool`/`pool`/`uniquePool` 모두 필터링만 하고 DICTIONARY 원본 엔트리를 그대로 배열에
   담아 반환하며, 이후 `correctWord.jp`/`word.jp`/`w.jp`처럼 여러 필드를 직접 참조하는 코드가
   바로 뒤에 이어짐(`sentenceGame.buildItem()`과 동일한 패턴). 어댑터로 감싸도 이중 조회만 늘고
   실익이 없어 **§3-1 범위에서 제외** — 다음 세션이 같은 곳을 다시 검토하지 않도록 기록.
5. ✅ (2026-07-28 또 이어지는 세션에서 완료) 위 판별 과정에서 grep으로 `DICTIONARY.find`/
   `DICTIONARY.filter`/`HIRAGANA_LIST.filter` 호출부를 전수 재확인한 결과, 남아있던 것은 전부 (a) 이미
   위에서 §3-1 범위 제외로 결론난 "원본 엔트리 배열 그대로 반환" 패턴이거나 (b) 이미 지난 세션에
   제외 판정한 `findDictionaryWord`/`sentenceGame.buildItem` 계열이었음. 대신 **"풀은 그대로 두고
   가중치 계산에만 쓰이는 stat 조회 키"** 패턴 2곳을 새로 찾아 전환함(반환 형태 불변, key 조회만
   교체 — 지금까지와 같은 저위험 전환):
   - `weightedPick()`(logic.js, `createHiraganaStatsEngine()` 내부) — `charStats[item.ch]` 2곳
     (오답만 30% 필터, 기본 가중치 계산)을 `charStats[toGenericLearningItem(item).key]`로 교체.
   - `wordSrsWeightedPick(words, count)`(logic.js) — `wordStats[item.jp]`를
     `wordStats[toGenericLearningItem(item).key]`로 교체. 이 함수는 문장/합성어·섀도잉·수수께끼·
     낱말찾기(`pickWordSearchWords()` 내부에서 호출) 등 **여러 게임이 공유**하므로 전환 효과가
     한 곳 수정으로 넓게 퍼짐.
   두 함수 모두 `key`가 항상 `ch`/`jp` 원본과 같은 값이라 동작은 이전과 100% 동일. `node -c` 문법
   검사만 통과 확인(브라우저 실행 테스트는 못 함) — 배포 후 히라가나 플래시카드의 "오답만"/기본
   가중치 출제와, 어휘 축을 쓰는 게임들(문장맞히기/섀도잉/수수께끼/낱말찾기)의 SRS 가중 출제가
   평소처럼 동작하는지 확인 권장. `sw.js`를 `koe-app-v54` → `koe-app-v55`로 올림.

**다음 세션에서 아직 안 살펴본 후보 영역**: `charStats`/`wordStats` 직접 키 접근이 남아있는지
grep으로 전수 재확인은 이번 세션에 안 함(이번엔 위 2곳만 찾아서 전환) — 다음 세션은
`grep -n "charStats\[" logic.js` / `grep -n "wordStats\[" logic.js`로 남은 호출부를 훑어 같은
패턴(원본 엔트리에서 `.ch`/`.jp`만 꺼내 키로 쓰는 곳)이 더 있는지 확인 후 이어서 전환할 것. 그 외에
§3-1의 "형태 유지 + 키 조회만 전환" 가능한 지점을 다 찾았다고 판단되면, §3-2(localStorage 네임스페이스
이관)로 넘어가는 것도 검토할 것.

6. ✅ (2026-07-28 또 이어지는 세션에서 완료) 위에서 예고한 `charStats[`/`wordStats[` 전수 재확인을
   실제로 함(`grep -n`). 결과:
   - `charStats[ch]`류 3곳(`getStat(ch)` 내부 6977~6985번 줄, `renderStatGrid` 내부 7150번 줄)은
     전부 `ch`가 이미 **문자열 파라미터**(엔트리 객체가 아님)라 전환 대상이 아님 — `renderStatGrid`는
     지난 세션에 이미 §3-1 제외로 정정된 곳과 동일한 함수.
   - `wordStats[jp]`/`wordStats[jp1]`/`wordStats[jp2]`류(`findDictionaryWord`/`showWordDetail`/
     `pairSrsWeightedPick`/`computeWordGameStage` 등)도 전부 `jp`가 이미 문자열 파라미터라 전환 대상
     아님(`pairSrsWeightedPick`은 `getJpPair(item)` 콜백이 이미 문자열 쌍을 뽑아 넘겨주는 구조라,
     콜백 자체를 바꾸지 않는 한 어댑터를 끼울 지점이 없음 — 범위 밖으로 둠).
   - 전환한 곳 2곳:
     - `recordWordResult(word, isCorrect)`(logic.js) — **모든 게임 모드가 정오답을 기록할 때 공통으로
       거치는 함수**. 기존에는 `word.jp`를 7번 반복해서 직접 읽었는데, 함수 시작부에서
       `const genericItem = word ? toGenericLearningItem(word) : null;`로 한 번만 변환한 뒤
       `genericItem.key`를 재사용하도록 교체(`wordStats[word.jp]` → `wordStats[wordKey]` 전부 교체).
       원래 가드 `if (!word || !word.jp) return;`도 `if (!wordKey) return;`로 바꿨는데, 빈 문자열
       `jp`면 `wordKey`도 빈 문자열(falsy)이라 기존과 동일하게 return되는 것을 확인.
     - `srsWeightedPick(list, statsObj, count)`(logic.js) — `wordSrsWeightedPick`의 히라가나 축
       대칭 함수(카드찾기/쓰기 등 히라가나 게임 공용, 실제 호출부는 `weightedPick()` 안 1곳뿐이지만
       `statsObj`로 받은 저장소가 항상 `ch` 키 기준이라는 전제가 코드 곳곳에 깔려 있어 전환 가치가
       있다고 판단). `statsObj[item.ch]`를 `statsObj[toGenericLearningItem(item).key]`로 교체.
   - Node vm으로 DICTIONARY 991개 전체에 대해 `toGenericLearningItem(w).key === w.jp`가 항상
     성립함을 재검증 완료(전수 일치, 불일치 0건) — 위 두 전환의 동작이 이전과 100% 동일함을 뒷받침.
     `node -c` 문법 검사도 통과. 브라우저 실행 테스트는 못 함 — 배포 후 아무 어휘 게임에서나 정답/
     오답을 몇 번 눌러보고 통계가 평소처럼 누적되는지, 히라가나 SRS 복습(레벨 5) 출제가 평소처럼
     동작하는지 확인 권장. `sw.js`를 `koe-app-v55` → `koe-app-v56`으로 올림.

**다음 세션에서 아직 안 살펴본 후보 영역 (갱신)**: 이번 세션 마무리 직전 추가로 grep(`\.jp\]`/`\.ch\]`
패턴)해보니, **아직 안 건드린 후보 3곳**을 더 찾음(학습 통계가 아니라 표시/렌더링용 정적 테이블
조회라 우선순위는 낮지만 같은 패턴이라 기록해둠) — `CUSTOM_WORD_ICONS[word.jp]`
(`renderWordVisual()`, logic.js 58번 줄), `ANIMAL_CRY_MAP[word.jp]`(logic.js 2405번 줄 부근,
동물 울음소리 매핑), `STROKE_ORDER_DATA[box.ch]`(logic.js 5967번 줄 부근, 획순 애니메이션 데이터).
셋 다 시간 관계상 이번 세션엔 안 열어봤음 — 다음 세션은 이 세 곳을 먼저 열어서 §3-1의 "형태 유지 +
키 조회만 전환" 원칙이 그대로 적용되는지 확인 후 전환할 것. 이 세 곳까지 끝나면 `\.jp\]`/`\.ch\]`
패턴으로 한 번 더 grep해서 정말 남은 게 없는지 최종 확인한 뒤 §3-2(localStorage 네임스페이스 이관)로
넘어가는 것을 검토할 것.

7. ✅ (2026-07-28 또 이어지는 세션에서 완료) 위에서 예고한 3곳을 실제로 열어봄:
   - `CUSTOM_WORD_ICONS[word.jp]`(`renderWordVisual()`) — 유일한 호출부(`riddle` 렌더링, logic.js
     4743번 줄)에서 `word`가 `wordSrsWeightedPick(pool, 1)[0]`으로 뽑힌 **진짜 DICTIONARY 엔트리**임을
     확인. `toGenericLearningItem(word).key`로 전환(원래 코드엔 `word`가 falsy일 때의 방어 코드가
     없어 접근 시 예외가 날 수 있었는데, 전환하면서 `word ? toGenericLearningItem(word) : null` 가드를
     자연스럽게 추가함 — 기존에 정상 동작하던 경로의 결과값은 100% 동일, `word`가 falsy인 예외적
     경로만 "에러" 대신 "이모지로 폴백"으로 더 안전해짐).
   - `ANIMAL_CRY_MAP[word.jp]`(`playAnimalCry()`) — 함수를 열어보니 **맨 첫 줄이
     `return; // 🔇 동물 울음소리 효과음은 모든 게임에서 비활성화되었습니다 (사용자 요청)`인 죽은
     코드**였음. 이 줄 아래 `word.jp` 접근을 포함한 모든 로직이 실행되지 않으므로 **전환 대상에서
     제외** — 죽은 코드를 어댑터로 감싸는 건 의미가 없고, 되살릴지 여부는 §3-1(레이어화) 범위 밖의
     별개 결정이라 손대지 않음.
   - `STROKE_ORDER_DATA[box.ch]`(`drawStrokesForBox()`) — 호출부(`drawStrokeOrderOverlay()` 등)를
     보니 `box`는 HIRAGANA_LIST 엔트리가 아니라 **캔버스에 글자를 그릴 위치·크기(`x`/`y`/`width`/
     `size`/`ch`/`showGuide`)를 담은 임시 드로잉 서술자**였음. `box.ch`가 우연히 문자열이라
     `toGenericLearningItem(box)`를 걸어도 문법적으로는 동작하겠지만, `box`는 학습 아이템이 아니라
     렌더링 좌표 객체라 어댑터를 씌우는 게 개념적으로 맞지 않음(§3-1은 "학습 대상 데이터 엔트리" 조회를
     일반화하는 게 목적이지, 우연히 `ch` 필드를 가진 모든 객체를 감싸는 게 목적이 아님) — **전환
     대상에서 제외**.
   - `node -c` 문법 검사 통과. 브라우저 실행 테스트는 못 함 — 배포 후 수수께끼(riddle) 게임에서
     커스텀 아이콘이 등록된 단어(예: こすもす)가 나올 때 평소처럼 커스텀 SVG 아이콘이 뜨는지 확인
     권장. `sw.js`를 `koe-app-v56` → `koe-app-v57`로 올림.

8. ✅ (2026-07-28 또 이어지는 세션에서 완료) 위에서 예고한 `\.ch\s*===`/`\.jp\s*===` 비교 패턴을
   grep으로 전수 확인(총 23곳). 내용을 보니 전부 **"이 버튼/후보가 정답 항목과 같은 문자·단어인가"를
   판정하는 답 채점 비교**이거나 `dataset.ch`/`dataset.jp`(DOM에 심어둔 문자열 속성) 대 원본 엔트리
   필드의 비교였음 — `toGenericLearningItem(a).key === toGenericLearningItem(b).key`로 바꿔도
   `key`가 항상 원본 `ch`/`jp`와 같은 값이라 결과는 100% 동일하고, 오히려 비교 한 번마다 변환 함수를
   두 번씩(양쪽 다) 호출하는 오버헤드만 늘어남 — 이미 §3-1에서 "반환 형태를 유지한 채 내부 키 조회만
   바꾸는" 실익이 없다고 판단해 제외한 `sentenceGame.buildItem()`류와 같은 성격. **이 23곳은 §3-1
   전환 대상에서 제외**하기로 결정.
   - **§3-1 최종 판단**: 위 결정으로 이번 세션까지 예정돼 있던 두 grep 패턴(`\.jp\]`/`\.ch\]`,
     `\.jp\s*===`/`\.ch\s*===`) 모두 전수 확인이 끝났고, 남은 후보가 더 없음. §3-1(데이터 계약 정의)은
     **여기서 "일단락"으로 처리** — 완전히 새로운 호출부가 코드에 추가되지 않는 한 이 섹션으로
     돌아올 필요는 없음(다만 §2의 "새 기능 추가 시 먼저 레이어 기록" 원칙에 따라, 새로 추가되는
     학습 아이템 조회 코드는 계속 `toGenericLearningItem`/`findGenericLearningItemByKey` 경로를 쓸 것).
   - 다음 단계로 **§3-2(localStorage 네임스페이스 이관)에 착수**함 — 아래 §3-2 섹션 참고.

**연동 지점**: `HIRAGANA_LIST`/`DICTIONARY`/`toGenericLearningItem`(data.js),
`selfCheckGenericLearningItemAdapter`(logic.js), `createHiraganaStatsEngine()`의 `getStat()` 호출부
(아직 미전환)

**우선순위**: 높음 (다른 모든 단계의 전제 조건)
**난이도**: 중 (로직 변경 없이 인터페이스만 추가하는 거라 낮아야 정상이지만, 어댑터를 빠짐없이 통과시키는
호출부를 찾는 데 시간이 걸릴 수 있음)
**주의사항**: 어댑터를 도입한 뒤에도 기존 `ch`/`jp` 직접 접근 코드가 남아있으면 두 경로가 공존하며
불일치가 생길 수 있음 — 한 함수를 전환하면 그 함수 내부에서는 어댑터 경로만 쓰도록 완전히 바꿀 것.

---

### 3-2. `localStorage` 네임스페이스 이관 — ✅ 구현 완료 (19개 키 전환 완료, 2026-07-28 세션)

**개념**: 현재 `kotobaHsCharStats`, `kotobaActiveSetState`, `kotobaStreak` 등 전부 `kotoba` 단일
접두사를 씀. 두 번째 학습 대상을 추가하면 저장 키가 충돌함. `koe:{targetId}:{key}` 형태로 이관.

**구현 내역 (2026-07-28 세션)**:
- `logic.js`에 `storageKey(name, targetId = CURRENT_TARGET_ID)` 헬퍼와
  `migrateLegacyStorageKey(oldKey, newKey)` 헬퍼를 추가(`WORD_STATS_KEY` 정의 바로 위,
  파일 상단 전역 상태 선언부). `CURRENT_TARGET_ID = 'hiragana'`로 고정. `migrateLegacyStorageKey`는
  "신 키에 이미 값이 있으면 아무것도 안 함"을 최우선 조건으로 둬서 몇 번을 호출해도 안전하게
  설계함(플래그 변수 대신 이 조건 자체가 idempotent 가드 역할을 함 — 로드맵 원안의
  `kotobaMigratedToV2` 플래그 방식보다 호출부를 단순하게 유지할 수 있어 이 방식을 택함).
  Node로 세 가지 케이스(구키→신키 복사 / 재호출 시 신키 값 보존 / 구키·신키 둘 다 없는 신규
  사용자)를 mock localStorage로 검증 완료 — 전부 의도대로 동작함을 확인.
- **파일럿 전환 1건**: `MISTAKE_GARDEN_LAST_TIERS_KEY`(오답 나무 키우기 — 단일 get/set 쌍만 쓰고
  다른 기능과 얽히지 않는 가장 단순한 키라 파일럿으로 선택)를 `storageKey('mistakeGardenLastTiers')`
  (`koe:hiragana:mistakeGardenLastTiers`)로 전환하고, 구 키는
  `MISTAKE_GARDEN_LAST_TIERS_LEGACY_KEY = 'kotobaMistakeGardenLastTiers'`로 이름 보존(삭제 금지).
  `initAppLevelUI()` 첫 줄 근처(`selfCheckGenericLearningItemAdapter()` 다음)에
  `migrateLegacyStorageKey(MISTAKE_GARDEN_LAST_TIERS_LEGACY_KEY, MISTAKE_GARDEN_LAST_TIERS_KEY)` 호출을
  추가해 앱 로드 시 1회 마이그레이션이 일어나게 함. `node -c` 문법 검사 통과. 브라우저 실행 테스트는
  못 함 — 배포 후 오답 나무 키우기 화면(기존에 씨앗/새싹/꽃/나무 단계가 저장돼 있던 사용자 기준)이
  이전 상태를 그대로 이어서 보여주는지 확인 권장. `sw.js`를 `koe-app-v57` → `koe-app-v58`로 올림.
- **추가 전환 5건 (2026-07-28 이어지는 세션)**: 파일럿과 완전히 동일한 패턴(신 키를 `storageKey(...)`로,
  구 키를 `..._LEGACY_KEY`로 보존, `initAppLevelUI()`에 마이그레이션 호출 추가)으로 아래 5개를 전환:
  - `WS_SIZE_MANUAL_KEY` → `koe:hiragana:wsSizeManual` (낱말찾기 격자 크기 수동 설정 여부 플래그)
  - `LAST_VOCAB_MODALITY_KEY` → `koe:hiragana:lastVocabModality` (직전 어휘 게임 모달리티 기록)
  - `SELF_REFERENCE_NOTES_KEY` → `koe:hiragana:selfReferenceNotes` (자기참조 "나의 하루" 노트)
  - `HS_CARD_COUNT_KEY` → `koe:hiragana:hsCardCount` (카드찾기 카드 개수 설정)
  - `ROLEPLAY_COMPLETIONS_KEY` → `koe:hiragana:roleplayCompletions` (역할극 시나리오 완료 기록)
  5개 모두 단일 get/set 쌍만 쓰고 다른 기능과 얽히지 않는 "단순 축"이라 함께 전환해도 회귀 범위가
  좁다고 판단해 한 세션에 묶어 처리(파일럿 때보다 범위를 넓힌 것 — 각각이 서로 독립적인 키라
  하나가 잘못돼도 다른 키에 영향이 없는 구조라는 점을 근거로 함). Node mock localStorage로 5개
  키 전부 "구키→신키 이관"과 "재호출 시 신키 값 보존" 두 케이스를 검증 완료, `node -c` 문법 검사도
  통과. 브라우저 실행 테스트는 못 함 — 배포 후 다음 5가지를 확인 권장: 낱말찾기 격자 크기를 수동으로
  바꾼 뒤 다시 방문해도 유지되는지, 어휘 게임 모달리티 로테이션이 평소처럼 동작하는지, "나의 하루"
  자기참조 노트가 이전 기록을 그대로 보여주는지, 카드찾기 카드 개수 설정이 유지되는지, 역할극
  완료 기록(뱃지 등)이 이전과 동일하게 표시되는지. `sw.js`를 `koe-app-v58` → `koe-app-v59`로 올림.
- **추가 전환 6건 (2026-07-28 또 이어지는 세션) — `createHiraganaStatsEngine(cfg)` 계열**:
  `HS_STATS_KEY`/`HS_WEIGHT_KEY`/`HW_STATS_KEY`/`HW_WEIGHT_KEY`/`HR_STATS_KEY`/`HR_WEIGHT_KEY`를
  전부 `storageKey(...)`로 전환(각각 `koe:hiragana:hsCharStats`/`hsWeightLevel`/`hwCharStats`/
  `hwWeightLevel`/`hrCharStats`/`hrWeightLevel`). 이 6개는 `createHiraganaStatsEngine(cfg)` factory에
  `cfg.statsKey`/`cfg.weightKey`로 주입되는 구조라 **factory 내부(`load()`/`save()`/
  `loadWeightLevel()`/`setWeightLevel()`)는 전혀 손대지 않고, 상수 정의 3곳(hs/hw/hr 호출부는
  이미 상수 이름으로 참조 중이라 호출부 자체도 무수정)**만 바꿔서 끝남 — 로드맵에 미리 적어둔
  예상대로 가장 효율적인 전환이었음. 구 키 6개(`HS_STATS_LEGACY_KEY` 등)를 보존하고
  `initAppLevelUI()`에 마이그레이션 호출 6개를 추가. Node mock localStorage로 6개 키 전부
  "이관"/"재호출 시 신값 보존" 검증 완료, `node -c` 문법 검사 통과, 중복 선언 없음(각 상수 1회
  선언) 확인. 브라우저 실행 테스트는 못 함 — 배포 후 히라가나 카드찾기/쓰기/읽기 3개 게임 각각의
  46자 그리드 통계(정답/오답 횟수, 오답률 색상)와 가중치 강도 설정이 이전과 동일하게 유지되는지
  확인 권장(특히 SRS 5단계를 쓰고 있었다면 그 설정도 유지되는지). `sw.js`를 `koe-app-v59` →
  `koe-app-v60`로 올림.
- **추가 전환 4건 (2026-07-28 또 이어지는 세션)**: 이번에도 파일럿과 동일한 패턴으로 4개를 전환:
  - `ACTIVE_SET_STATE_KEY` → `koe:hiragana:activeSetState` (활성 학습 세트 크기·엄격도 상태)
  - `TODAY_LEARNED_LOG_KEY` → `koe:hiragana:todayLearnedLog` (오늘 만난 항목 로그, "자기 전 하이라이트"에 쓰임)
  - `PRE_SLEEP_DISMISSED_KEY` → `koe:hiragana:preSleepDismissedDay` (자기 전 넛지를 오늘 닫았는지 기록)
  - `LEARNER_PROFILE_KEY` → `koe:hiragana:learnerProfile` (진단 기반 개인별 커리큘럼 프로필 —
    작업기억 스팬 등, 여러 진단 미니게임이 공유하는 병합형 저장소)
  구 키 4개를 보존하고 `initAppLevelUI()`에 마이그레이션 호출 4개를 추가. Node mock localStorage로
  4개 키 전부 "이관"/"재호출 시 신값 보존" 검증 완료, `node -c` 문법 검사 통과, 중복 선언 없음 확인.
  브라우저 실행 테스트는 못 함 — 배포 후 확인 권장 4가지: 활성 세트 크기가 이전 상태 그대로
  이어지는지, "자기 전 하이라이트" 카드가 오늘 만난 항목을 정상적으로 보여주는지, 자기 전 넛지를
  오늘 닫았으면 다시 뜨지 않는지, 사전지식 배치 퀴즈 등으로 채워둔 학습자 프로필 값이 유지되는지.
  `sw.js`를 `koe-app-v60` → `koe-app-v61`로 올림.

- **추가 전환 1건 (2026-07-28 또 이어지는 세션) — `WORD_STATS_KEY`**: 예고된 3개 중 첫 번째를
  파일럿과 동일한 패턴으로 전환. `WORD_STATS_KEY`(`'kotobaWordGameStats'`)를
  `WORD_STATS_LEGACY_KEY`로 이름 보존하고, 신 키를 `storageKey('wordGameStats')`
  (`koe:hiragana:wordGameStats`)로 정의. `loadWordStats()`/`saveWordStats()`(logic.js, get/set
  각 1곳)는 이미 `WORD_STATS_KEY` 상수로 참조 중이라 무수정. `initAppLevelUI()`의 기존
  마이그레이션 호출 목록 맨 끝(`LEARNER_PROFILE_KEY` 다음)에
  `migrateLegacyStorageKey(WORD_STATS_LEGACY_KEY, WORD_STATS_KEY)` 호출 1줄 추가 — `loadWordStats()`
  자체보다 먼저 실행되므로 최초 로드 시점부터 신 키를 읽음. Node mock localStorage로 "구키→신키
  복사"/"재호출 시 신키 값 보존"/"구키·신키 둘 다 없음" 세 케이스 전부 검증 완료, `node -c` 문법
  검사도 통과. 어휘 축을 쓰는 거의 모든 게임(퀴즈/문장맞히기/섀도잉/수수께끼/낱말찾기/복습 세트 등)이
  공유하는 핵심 통계라 배포 후 확인 범위가 넓음 — 여러 어휘 게임을 돌아가며 정답/오답 통계가
  기존 기록 그대로 이어져 누적되는지 꼭 확인 권장. `sw.js`를 `koe-app-v61` → `koe-app-v62`로 올림.

- **추가 전환 2건 (2026-07-28 또 이어지는 세션) — `STREAK_KEY`/`STREAK_BADGE_KEY`, §3-2 마지막 키**:
  예고된 마지막 2개를 같은 세션에 함께 전환(스트릭 일수·배지가 서로 밀접하게 얽혀 화면에 같이
  렌더링되는 데이터라 분리하는 실익이 적다고 판단, §2-1의 "독립적인 단순 축은 함께 처리 가능"
  기준에 부합). `STREAK_KEY`(`'kotobaStreak'`)를 `STREAK_LEGACY_KEY`로, `STREAK_BADGE_KEY`
  (`'kotobaStreakBadges'`)를 `STREAK_BADGE_LEGACY_KEY`로 이름 보존하고, 신 키를 각각
  `storageKey('streak')`(`koe:hiragana:streak`)/`storageKey('streakBadges')`
  (`koe:hiragana:streakBadges`)로 정의. `loadStreakState()`/`saveStreakState()`/
  `loadStreakBadgeState()`/`saveStreakBadgeState()`(logic.js, get/set 각 1곳씩)는 이미 상수명으로
  참조 중이라 무수정. `initAppLevelUI()`의 마이그레이션 호출 목록 맨 끝(`WORD_STATS_KEY` 다음)에
  `migrateLegacyStorageKey` 호출 2줄 추가. Node mock localStorage로 두 키 모두 "구키→신키 복사"/
  "재호출 시 신키 값 보존"/"구키·신키 둘 다 없음" 세 케이스 검증 완료, `node -c` 문법 검사 통과,
  중복 선언 없음 확인. 스트릭 일수·배지는 사용자가 가장 민감하게 체감하는 데이터이므로 배포 후
  반드시 확인 권장: 기존에 연속 학습 중이던 사용자가 방문 시 스트릭 일수가 끊기지 않고 그대로
  이어지는지, 이미 해금한 배지 목록과 적용 중인 테마가 그대로 유지되는지. `sw.js`를
  `koe-app-v62` → `koe-app-v63`으로 올림.

**§3-2 완료**: 이로써 19개 키(파일럿 1개 + 5개 + 6개 + 4개 + `WORD_STATS_KEY` + `STREAK_KEY`/
`STREAK_BADGE_KEY`) 전환이 전부 끝남. §3-3(물리적 파일 분리) 착수 조건(§3-1·§3-2 완료)이 채워졌으나,
§3-3 자체는 우선순위가 낮게 책정돼 있어 다음 세션에서 바로 착수할지는 사용자와 우선순위를 다시
확인한 뒤 결정할 것 — §3-4(두 번째 학습 대상 파일럿)나 §3-5(게임엔진)도 후보임(§1 매핑 표 참고).

**연동 지점**: 위 목록의 각 `_KEY` 상수 정의부(logic.js, 대부분 500~2200번 줄대와 11871번 줄 부근에
흩어져 있음)와 그 상수를 쓰는 `localStorage.getItem`/`setItem` 호출부. `storageKey`/
`migrateLegacyStorageKey` 헬퍼 자체는 이미 추가됐으므로 이후 전환은 상수 선언 2줄 + 초기화 시점
마이그레이션 호출 1줄 추가하는 기계적 작업.

**우선순위**: 중
**난이도**: 중 (건드리는 지점 수는 많지만 각각은 기계적인 치환 + 마이그레이션 가드 한 줄 추가라 위험도는 낮음)
**주의사항**: 마이그레이션은 "구 키 → 신 키" 한 방향으로만, 그리고 신 키에 이미 값이 있으면 절대
덮어쓰지 않아야 함(파일럿의 `migrateLegacyStorageKey` 가드 조건이 이미 이걸 보장하므로, 이후 키들도
반드시 이 헬퍼를 그대로 재사용하고 별도의 새 마이그레이션 로직을 만들지 말 것) — 그래야 이후 신
키에 쓴 데이터가 구 키 값으로 덮어써지는 사고를 막을 수 있음. 스트릭·통계처럼 사용자가 민감하게
체감하는 키는 특히 배포 후 확인을 거를 것.

---

### 3-3. 물리적 파일 분리 — 미착수 (§3-1, §3-2 완료 후 착수)

**개념**: 코드가 실제로 `engine.js`(Layer 1) / `language-core.js`(Layer 2) / `targets/hiragana.js`
(Layer 3, 현재 data.js 대체) 세 파일로 나뉘는 단계. 지금은 계획만 남겨두고 실제로 진행하지 않음 —
§3-1/§3-2도 안 끝난 상태에서 파일을 쪼개면 어떤 함수를 어디로 옮겨야 할지 기준이 없어 오히려 더 엉킴.

**우선순위**: 낮음 (전제 조건 미충족)
**난이도**: 미평가
**주의사항**: 파일이 늘어나면 §0의 "파일 N개 세트" 표와 `sw.js`의 `ASSETS_TO_CACHE` 배열을 함께 갱신해야
함. 착수 시점에 이 섹션을 구체적인 파일별 이동 목록으로 다시 쓸 것.

---

### 3-6. 게임 화면 부수 UI 단순화·표준화 — 미착수 (§3-5와 함께 설계, §3-5 이후 착수)

**개념**: 문제와 답변 선택지 외에 화면에 같이 뜨는 부수 정보(Score/Combo/MaxCombo/Progress/스트릭
배지 팝업 등)가 게임마다 있는지 없는지, 어떤 형태인지 제각각임 — grep 결과 `el('Score')`/`el('Combo')`/
`el('Progress')` 류 참조만 logic.js 안에 34곳(2026-07-28 세션 기준)에 흩어져 있고, 게임별로 어떤
걸 보여줄지가 통일된 기준 없이 각 factory 코드 안에 하드코딩돼 있음. 이건 §3-5(게임엔진 라이브러리화)의
"관리 효율" 문제이면서 동시에 **학습 효과 문제**이기도 함 — 문제 풀이 중 콤보 숫자, 최고 콤보 갱신
연출, 스트릭 배지 팝업 같은 요소가 지금 풀고 있는 문항 자체(글자/단어 인식·회상)에 대한 집중을
방해할 가능성이 있음. "이 정보가 지금 학습자가 하는 인지적 작업(예: 회상)에 직접 도움이 되는 피드백인가,
아니면 게임성을 위해 곁다리로 붙은 장식인가"를 축으로 정리가 필요.

**진행 순서 원칙**: 이 단계는 §3-5(게임엔진)의 cfg 스키마를 설계하는 시점에 **처음부터 같이 고려해서
설계**할 것 — 게임엔진을 먼저 다 만들고 나중에 UI를 걷어내는 순서로 하면, 표시 여부를 나중에 다시
cfg에 끼워 넣느라 §3-5를 두 번 건드리게 됨. 다만 실제 "무엇을 걷어낼지 판단하고 적용하는 작업"은
§3-5의 factory 통합이 최소 1개 끝난 뒤(공통 상태/생명주기가 어디 있는지 파악된 뒤)에 시작하는 게
안전함 — 그 전에는 어떤 요소가 "공통 부수 UI"인지 "게임 고유 요소"인지 구분할 기준 자체가 없음.

**구현 계획**:
1. **감사(audit)**: 게임 화면별로 지금 표시되는 부수 요소를 전수 나열(Score/Combo/MaxCombo/Progress/
   Timer/스트릭 배지 팝업/`posBadgeHTML`·`categoryBadgeHTML` 같은 문항 자체에 붙는 장식 뱃지 등).
   나열한 뒤 각 항목을 3분류: **(a) 학습 피드백으로 필수**(정답/오답 여부, 남은 문항 수처럼 학습자가
   지금 뭘 하고 있는지 아는 데 필요한 것) / **(b) 동기부여용이지만 주의 분산 위험 있음**(콤보 숫자
   실시간 갱신, 최고 기록 연출, 배지 팝업 등 — 문항과 무관하게 시선을 끄는 것) / **(c) 게임 유형별
   순수 장식**(사용 안 해도 게임 성립에 지장 없는 것)
2. 분류 결과를 이 문서(§1 매핑 표 또는 이 섹션)에 표로 기록 — **코드를 먼저 바꾸지 말고 분류표부터
   확정**한 뒤 사용자 확인을 받고 다음 단계로 넘어갈 것(이 판단은 "무엇이 산만한가"라는 주관이 섞이는
   지점이라 임의로 밀어붙이지 않는다)
3. §3-5에서 만드는 공용 게임엔진 cfg에 표시 레벨 옵션을 추가(예: `cfg.uiLevel: 'minimal' | 'standard'`
   또는 개별 플래그 `cfg.showCombo`/`cfg.showStreakPopupDuringPlay` 등 — 구체 스키마는 §3-5 착수
   시점에 함께 확정) — (b)로 분류된 항목은 기본값을 "문항 풀이 중에는 숨기고, 결과 화면에서만 요약
   해서 보여준다" 같은 형태로 조정하는 걸 기본 방향으로 검토(문항 풀이 중 실시간 갱신 자체가 산만함의
   원인일 가능성이 높으므로)
4. 게임 하나를 골라 시범 적용 후, 학습 흐름이 실제로 자연스러워졌는지 확인하고 나머지로 확대

**연동 지점**: §3-5와 동일(4개 quiz factory) + `posBadgeHTML`/`categoryBadgeHTML`(logic.js 상단),
`showNewBadgePopup`/`checkStreakBadges`(스트릭 배지 팝업 — 게임 화면과는 별개 흐름이지만 겹치는 타이밍에
뜰 수 있어 함께 검토)

**우선순위**: 중 (§3-5와 병행 설계, 실제 적용은 §3-5 이후)
**난이도**: 중 (코드 변경 자체는 cfg 플래그 추가 수준으로 낮지만, 1단계의 "무엇이 필수고 무엇이 산만함인지"
분류 작업이 코드 작업이 아니라 판단 작업이라 시간이 걸림)
**주의사항**: 이 단계는 "UI를 줄인다"가 목적이 아니라 "학습 피드백에 실제로 기여하는 것과 아닌 것을
구분한다"가 목적임 — 무조건 미니멀하게 만드는 방향으로 임의 판단하지 말고, 1단계 감사 결과를 반드시
사용자와 확인한 뒤 반영할 것.

---

### 3-7. 가이드형 세션 흐름 — 설명→학습→평가→피드백→내일 계획 — 미착수

**개념**: 지금은 사용자가 상위 메뉴 화면에서 "오늘의 추천" 배너(`renderTodayRecommendation`)를 보고
`startRecommendedGame()`을 눌러 게임 하나를 시작하는 방식 — 한 게임이 끝나면 다시 메뉴로 돌아와
다음에 뭘 할지 사용자가 골라야 함. 목표는 이걸 **"무엇을 배울지 설명 → 학습(게임 실행) → 평가 →
피드백 → 내일 학습 계획 안내"가 하나의 끊기지 않는 흐름으로 자동 연결**되도록 만드는 것 — 사용자가
중간에 "다음엔 뭘 하지"를 고민하지 않고 앱이 이끄는 대로 따라가기만 하면 되는 경험. 완전히 새로
만드는 게 아니라, 이미 있는 조각들을 잇는 작업에 가까움:

| 흐름 단계 | 이미 있는 조각 | 부족한 부분 |
|---|---|---|
| ① 무엇을 배울지 설명 | `pickNextGameForSession()`의 `reason` 필드(예: "지금 배우는 히라가나 글자 중 '인식' 단계 비중이 낮아요") | 한 문장짜리 이유만 있고, "오늘 세션 전체가 어떤 순서로 진행될지"에 대한 사전 안내는 없음 |
| ② 학습 | 각 게임의 `init()`/`start()` (§3-5/3-6에서 표준화 예정인 그 factory들) | 게임 종료 후 자동으로 다음 단계(평가)로 넘어가는 연결부가 없음 — 지금은 종료 시 메뉴로 복귀 |
| ③ 평가 | `computeLtmStatus(ch)`가 이미 채널별(카드찾기/쓰기/읽기) retention·stage를 계산해줌 | 이 값을 "이번 세션에서 얼마나 늘었는지" 세션 단위 비교로 보여주는 로직은 없음(현재는 누적 상태 조회만) |
| ④ 피드백 | `computeLtmStatus`의 채널별 약점 정보(예: 쓰기 채널만 유독 약함) | 이걸 사람이 읽을 문장으로 바꿔주는 피드백 문구 생성부가 없음 |
| ⑤ 내일 계획 | `pickNextGameForSession()`을 지금 시점에 다시 호출하면 사실상 "다음 추천"은 구할 수 있음 | "내일" 시점을 미리보기로 보여주는 화면/문구가 없음(지금은 그날그날 접속해야 추천이 뜸) |

**레이어 판단**: "설명→학습→평가→피드백→다음 계획"이라는 **흐름의 뼈대(상태 머신) 자체는 히라가나나
언어 학습에 국한되지 않고 어떤 학습 대상에도 쓰일 수 있으므로 Layer 1** 후보(예: 수학 구구단 앱이어도
같은 5단계 흐름을 쓸 수 있음). 각 단계에서 "무엇을 보여줄지"(4채널 LTM 상태, 히라가나/어휘 축 등)는
Layer 2, 실제 문구("히라가나 글자 중 인식 단계가 부족해요")는 Layer 3. 즉 이 작업은 Layer 1에 새로
생기는 **세션 상태 머신 하나**와, 그 상태 머신이 각 단계마다 호출하는 Layer 2 콜백들(설명 문구 생성기,
평가 계산기, 피드백 생성기, 다음 계획 생성기)로 나눠 설계해야 함 — §3-1(데이터 계약)·§3-5(게임엔진)와
같은 인터페이스 분리 원칙을 그대로 적용.

**구현 계획**:
1. 먼저 **세션 상태 머신의 단계 이름과 전이 규칙만** 정의(코드 없이 문서/표로) — `explain → learn →
   evaluate → feedback → nextPlan` 5단계 고정으로 할지, 게임 유형에 따라 일부 단계를 생략 가능하게
   할지부터 확정
2. ②(학습) 단계 종료 시 메뉴로 돌아가는 대신 상태 머신의 다음 단계(③ 평가)로 자동 전환하는 연결부
   추가 — 가장 위험도가 낮은 게임 1개(예: `initHiraganaReadGame`류)에만 먼저 적용해 시범 운영
3. ③④는 `computeLtmStatus` 결과를 세션 시작 시점 스냅샷과 종료 시점 스냅샷으로 비교하는 방식으로
   "이번 세션에서 는 부분"을 뽑아내는 함수 추가(신규, Layer 2)
4. ⑤는 세션 종료 화면에서 `pickNextGameForSession()`을 미리 한 번 더 호출해 "내일 이어서 하면 좋을 것"
   문구로 보여주는 것으로 시작(실제 날짜가 바뀌어야 진짜 "내일 추천"이 나오므로, 지금은 "지금 다시
   계산했을 때의 다음 추천"을 내일 미리보기로 근사하는 수준까지만 — 진짜 스케줄링은 범위 밖)
5. 1개 게임에 전체 흐름이 안정적으로 붙은 뒤, 나머지 게임 유형으로 확대(§2-1 다중 세션 분할 원칙에
   따라 게임 유형 하나씩 세션을 나눠 진행)

**연동 지점**: `pickNextGameForSession`/`renderTodayRecommendation`/`startRecommendedGame`,
`computeLtmStatus`, §3-5에서 표준화될 게임엔진의 종료 콜백(예: `onGameEnd`) — 아직 이 콜백은 존재하지
않으므로 §3-5 cfg 스키마 설계 시 "게임 종료 시 상위 흐름에 결과를 넘겨줄 훅"을 함께 고려해둘 것

**우선순위**: 중 (§3-1·§3-5가 어느 정도 진행된 뒤 착수하는 게 안전 — 게임엔진의 종료 훅이 있어야
③으로 자연스럽게 넘어갈 수 있음. 순서를 강제하진 않지만 §3-5보다 먼저 손대면 훅을 두 번 만들게 될 위험)
**난이도**: 고 (여러 화면·여러 게임 유형을 가로지르는 흐름 제어라 회귀 범위가 넓음 — 반드시 게임
1개로 좁혀서 검증 후 확대)
**주의사항**:
- **기존의 "메뉴에서 자유롭게 골라 하기" 방식을 없애지 말 것** — 가이드 흐름은 새로운 진입 경로(예:
  "오늘의 추천" 배너를 누르면 가이드 흐름 시작)로 추가하고, 기존 자유 탐색 메뉴는 그대로 유지. 사용자가
  가이드를 원치 않을 수도 있으므로 처음부터 "이건 유일한 경로다"로 만들지 않는다.
- 피드백 문구는 §2의 톤 원칙(따뜻하고 부담 주지 않는 말투)을 반드시 따를 것 — 특히 "부족한 부분"을
  알려주는 ④ 단계는 평가·비교가 압박으로 느껴지지 않도록 문구 검수를 별도로 거칠 것
- ⑤(내일 계획)는 실제 알림/푸시 없이 화면 안내로만 시작 — 알림 기능은 이 문서 범위 밖(별도 논의 필요)

---

### 3-4. 두 번째 학습 대상 파일럿 — 미착수 (레이어 분리 검증용)

**개념**: §3-1~3-3이 실제로 유효한지 검증하는 가장 확실한 방법은 두 번째 팩(예: 알파벳, 또는 다른
문자 체계)을 실제로 하나 붙여보는 것. "이론상 분리됨"과 "실제로 새 팩을 짧은 작업으로 붙일 수 있음"은
다름.

**우선순위**: 낮음 (검증 단계 — §3-1~3-3 이후)
**난이도**: 미평가
**주의사항**: 이 단계는 실제 신규 콘텐츠 제작(문자 목록, 연상 문구 등)이 따라붙으므로 로직 작업보다
콘텐츠 작업량이 커질 수 있음 — 착수 전 범위를 작게 잡을 것(전체 문자 체계가 아니라 일부만).

---

### 3-5. 게임 로직 표준 라이브러리화(게임엔진) — 🚧 진행 중 (0단계 완료, 공용 베이스 추출 3/4factory 완료)

**개념**: `logic.js`에는 이미 `createWordChoiceQuizGame(cfg)` / `createUnlimitedChoiceQuizGame(cfg)` /
`createSequencePickQuizGame(cfg)` / `createMatchRevealQuizGame(cfg)` 등 **cfg 객체를 받아 게임 인스턴스를
만들어내는 factory 패턴**이 이미 여러 개 존재함(2026-07-28 세션에서 grep으로 확인). 각 factory는
`idPrefix`로 DOM 요소를 찾고, `score`/`combo`/`maxCombo`/`correctCount`/`isAnswering`/`advanceTimer` 같은
거의 동일한 상태 변수 세트와 `init()`/`start()`/`generate 또는 generateQuiz()`/`replay()` 같은 거의 동일한
생명주기 메서드를 각자 따로 구현하고 있음 — 즉 **"게임엔진"의 원형은 이미 코드 안에 자연발생적으로
존재하지만, 4개 factory가 서로 복사-붙여넣기로 발산돼 있어 하나로 수렴돼 있지 않은 상태**.

**레이어 판단**: 점수/콤보/타이머/생명주기 상태 관리 자체는 히라가나·일본어와 무관하게 재사용 가능하므로
**Layer 1(범용 학습 엔진)** 후보. 단, `cfg.questionText(item)`이 `item.jp`를 참조하거나 `speakTTS`/
`speakWithHighlight` 같은 음성 관련 콜백을 기본값으로 깔고 있는 부분은 **Layer 2(언어 학습 도메인)**에
남아야 함 — 게임엔진 자체는 "무엇을 채점하는지" 몰라야 하고, cfg를 통해 채점 대상(글자/단어/문장/한자 등)을
주입받는 형태여야 다른 학습 대상(수학 구구단 등)에도 그대로 쓸 수 있음.

**구현 계획** (§3-1 데이터 계약이 먼저 끝난 뒤 착수 — cfg가 참조하는 아이템 형태가 안정돼야 게임엔진
인터페이스도 안정됨):
1. 4개 factory의 공통 부분(점수/콤보/타이머 상태, 생명주기 메서드 이름, DOM 접근 컨벤션)을 먼저
   표로 정리해 "완전히 같은 부분" / "이름만 다른데 로직은 같은 부분" / "게임 유형별로 진짜 다른 부분"으로
   3분류 — 이 표를 만들 때 각 요소가 §3-6(부수 UI 단순화)의 "필수/동기부여용/장식" 분류와도 겹치므로,
   cfg 스키마에 표시 여부 플래그를 넣을 자리를 함께 고려해둘 것
2. 가장 위험도가 낮은 factory 1개(예: `createMatchRevealQuizGame`)를 골라 공통 상태/생명주기를
   `createGenericQuizEngine(cfg)` 같은 공용 베이스로 뽑아내고, 기존 factory는 그 위에 게임 유형별
   로직만 얹는 얇은 래퍼로 전환 — 이 시점까지는 함수 시그니처와 외부 호출부(`initEawaseGame()` 등)를
   절대 바꾸지 않아 회귀를 방지
3. 1개가 안정되면 나머지 3개를 같은 방식으로 순차 전환 (한 세션에 1개씩 — §2의 다중 세션 분할 원칙 참고)
4. 4개가 모두 공용 베이스 위로 옮겨진 뒤에야 "새 게임 유형을 cfg만 바꿔서 추가할 수 있는가"를
   실제로 검증 (신규 게임 유형 1개를 시범 제작해보는 것으로 검증 — §3-4 파일럿과 통합해 진행 가능)

**1단계 감사 결과 (2026-07-28 세션, 코드 변경 없음 — 4개 factory 전체를 읽고 분류만 함)**:

실제 인스턴스화 지점까지 확인함(총 9개 게임 화면이 4개 factory를 나눠 씀):
`createWordChoiceQuizGame` → `quizGame`/`audioEmojiGame`(2개), `createUnlimitedChoiceQuizGame` →
`qaGame`/`lifeqaGame`/`shopGame`(3개), `createSequencePickQuizGame` → `sentenceGame`/`compoundGame`
(2개), `createMatchRevealQuizGame` → `ewGame`/`silGame`(2개).

*(a) 완전히 같은 부분(이름·로직 모두 동일, 4개 다)*:
- `const P = cfg.idPrefix; const el = (suffix) => document.getElementById(P + suffix);` — DOM 접근 컨벤션, 4개 모두 글자 하나 안 틀리고 동일
- `score`/`combo` 상태 변수와 `el('Score')`/`el('Combo')`에 `.textContent`로 반영하는 갱신 패턴
- 정답 시 `playCorrectSound()`, 오답 시 `playWrongSound()` 호출
- 오답 버튼에 `classList.add('wrong')` 후 `setTimeout(...800)`으로 `remove('wrong')`(WordChoice/Unlimited/MatchReveal 3곳 완전 동일 — SequencePick만 오답 시 처리가 달라 아래 (c)로 분류)
- `advanceTimer`(정답 후 다음 문제로 넘어가는 지연 타이머) 변수 자체와 `clearTimeout(advanceTimer)` 가드 패턴

*(b) 이름만 다른데 로직은 같은 부분*:
- 현재 문제/단어 참조 변수 — `currentQuestion`(WordChoice) / `currentItem`(Unlimited, SequencePick) / `currentWord`(MatchReveal): 전부 "지금 채점 대상 1개를 들고 있는 참조"로 동일 역할
- 답변 처리 중 재클릭 방지 플래그 — `isAnswering`(WordChoice, Unlimited, SequencePick) / `answered`(MatchReveal): 이름만 다르고 판정 로직(정답 처리 진입 시 true로 잠금)은 동일
- 문제 순번 — `index`(WordChoice, SequencePick) / `questionIndex`(MatchReveal): Unlimited는 이 개념 자체가 없음(아래 (c) 참고)이라 완전한 3-way 매칭은 아니지만, 있는 3개끼리는 이름만 다른 동일 로직
- 초기화/리셋 함수 — `init()`이 하는 일(점수·콤보·화면 전환을 초기 상태로) 자체는 WordChoice/SequencePick/MatchReveal 3개가 동일하지만, MatchReveal만 그 로직을 `resetState()`라는 별도 함수로 한 번 더 뽑아 `init()`과 `start()` 둘에서 재사용함(WordChoice/SequencePick은 `init()`/`start()` 각각에 리셋 코드를 그대로 중복 작성) — "로직은 같은데 캡슐화 방식이 다른" 경우

*(c) 게임 유형별로 진짜 다른 부분*:
- **화면 전환 구조 자체가 2가지로 갈림**: WordChoice/SequencePick/MatchReveal 3개는 `StartScreen → QuestionScreen(또는 PlayScreen) → ResultScreen` 3단계 화면 전환 + `init()`/`start()`/`showResult()`를 갖는 "라운드제" 구조인 반면, Unlimited 계열(`qaGame`/`lifeqaGame`/`shopGame`)은 애초에 이 3단계 화면 전환이 없고 `init()`/`start()`/`showResult()`/`maxCombo`/`correctCount`/`index`가 전부 없는 "단일 화면 무한 반복" 구조 — cfg 플래그 하나로 흡수하기보다는 애초에 다른 두 가지 상위 패턴(라운드제 vs 무한반복)으로 갈라야 할 가능성이 있음(2번 항목에서 가장 위험도 낮은 factory로 예정된 `createMatchRevealQuizGame`을 먼저 공용 베이스로 뽑을 때, Unlimited는 이 베이스를 그대로 못 쓸 수 있다는 점을 미리 감안할 것)
- **정답 채점 판정 방식**: WordChoice/Unlimited/MatchReveal은 "버튼 1개 클릭 = 즉시 정답/오답 판정"인데, SequencePick만 "2개를 순서대로 골라야 정답"(`picked` 배열에 누적, 순서 어긋나면 전체 초기화)이라 판정 로직 자체가 구조적으로 다름 — 오답 처리도 다른 3개는 클릭한 버튼만 `wrong` 표시하고 끝이지만 SequencePick은 지금까지 고른 것(`picked`, 배지)까지 전부 리셋함
- **5초 타이머**: WordChoice(`cfg.timed`일 때만)와 SequencePick(항상)만 `timer`+`TimerFill` 애니메이션+`timeExpired()`가 있고, Unlimited/MatchReveal은 이 개념 자체가 없음(사용자가 원하는 만큼 생각해도 됨)
- **점수 계산식**: WordChoice/Unlimited 고정 `+10`, SequencePick 고정 `+20`(2단계라 배점이 다름), MatchReveal만 `10 + (combo-1)*5`로 콤보에 비례해 점수가 늘어나는 유일한 콤보 보너스 방식
- **선택지 구성 로직**: WordChoice는 활성 단어 풀에서 무작위 3개 오답 + 정답, SequencePick은 "정답 2개(part1/part2) + 방해 7개, 이모지 중복 제거"라는 훨씬 복잡한 조합 로직, Unlimited/MatchReveal은 각각 `cfg.buildChoiceList`/`cfg.buildOptions` 콜백에 선택지 생성을 완전히 위임(팩토리 자체엔 조합 로직이 없음) — "선택지를 어떻게 만드는가"는 4개가 전부 다른 전략
- **cfg 콜백 이름·개수**: `cfg.renderQuestion`/`cfg.celebrate`/`cfg.revealAnswerText`(WordChoice), `cfg.pickItem`/`cfg.buildChoiceList`/`cfg.celebrateEmoji`/`cfg.wrongHintText`(Unlimited), `cfg.buildItem`/`cfg.getDistractors`/`cfg.onCorrect`/`cfg.onWrongPick`/`cfg.onTimeExpired`(SequencePick), `cfg.renderQuestion`/`cfg.buildOptions`/`cfg.onCorrectReveal`(MatchReveal) — 이름 체계가 factory마다 제각각이라 §3-6(cfg 표시 플래그)과 함께 정리할 때 네이밍 컨벤션 통일이 필요

**§3-6과의 접점 관찰**: 로드맵이 예상한 대로 Score/Combo 텍스트 갱신은 4개 다 정답/오답 즉시 실행되고
있어 §3-6에서 "실시간 갱신을 결과 화면 요약으로 미루는" 방향을 검토할 때 4개 모두 같은 지점(정답/오답
분기 안의 `.textContent =` 갱신 줄)을 건드리게 될 것으로 보임 — 예상과 일치.

**다음 세션에서 이어서 할 일**: 위 (c) 분류, 특히 "라운드제 vs 무한반복"이라는 상위 구조 차이를
사용자에게 먼저 확인받을 것(이 판단이 틀리면 2번 항목의 "가장 위험도 낮은 factory부터 공용 베이스로
뽑기" 순서 자체가 바뀔 수 있음). 확인 후 2번 항목(`createMatchRevealQuizGame`을 `createGenericQuizEngine(cfg)`
공용 베이스로 뽑아내는 첫 전환)에 착수.

**사용자 결정 (2026-07-28 이어지는 세션)**: 위 감사 결과를 보고 "무한반복계열을 라운드제로 통일시켜줘"로
확정. 세부 방식은 두 가지를 먼저 확인받음 — ①라운드당 문제 수는 **10문제**(WordChoice/SequencePick과
동일 기준), ②qa/lifeqa/shop **3개는 1개씩 나눠서 안전하게 진행**. 이 결정에 따라 §3-5의 원래 순서
(2번 항목 "가장 위험도 낮은 factory 통합부터")보다 **"무한반복→라운드제 통일"을 먼저** 진행하기로
방향이 바뀜 — 이유: 통일이 끝나야 4개 factory가 전부 "라운드제"라는 같은 상위 구조를 공유하게 되고,
그래야 2번 항목의 공용 베이스(`createGenericQuizEngine`)를 설계할 때 "라운드제 vs 무한반복" 분기를
따로 안 만들어도 됨(설계가 단순해짐). 즉 무한반복→라운드제 통일은 게임엔진 공용화의 **전제 작업**으로
재배치됨 — 아래 진행 상황이 §3-5의 실질적인 "0단계"가 됨.

**구현 방식 (전환 1/3 — `qaGame`, 2026-07-28 이어지는 세션에서 완료)**: 3개(qa/lifeqa/shop)가
`createUnlimitedChoiceQuizGame(cfg)` 하나를 공유하므로, "1개씩 나눠서"라는 사용자 결정을 지키면서도
팩토리 코드를 세션마다 다시 건드리지 않도록 **피처 디텍션 방식**을 택함:
- 팩토리 내부에 `isRoundMode = () => !!el('StartScreen')` 헬퍼를 추가 — 해당 게임의 HTML에
  `{idPrefix}StartScreen` 요소가 있으면 라운드제로, 없으면(마크업 전환 전) 예전처럼 무한반복으로
  자동 동작. `init()`/`start()`/`showResult()`(신규 추가)와 `generate()`/`selectChoice()`의 라운드
  카운팅(`index`/`maxCombo`/`correctCount`)이 전부 이 판별 함수로 분기됨.
- 이 방식 덕분에 **팩토리 자체는 이번 세션에 딱 한 번만 고치면 끝** — 다음 세션에서 lifeqa/shop의
  HTML(`StartScreen`/`QuestionScreen`/`ResultScreen`/`Progress`/`Result*`)만 추가하면 팩토리 코드를
  다시 안 건드려도 자동으로 라운드제로 전환됨. `generate` 함수는 계속 반환 객체에 남아있어(`clearPrevious`/
  `cancelAdvance`도 유지) 기존 `generateQaQuestion()`/`lifeqaGame.generate()`(주제 변경 시)/
  `qaGame.cancelAdvance()` 같은 기존 호출부는 전혀 안 바꿔도 그대로 동작(회귀 없음).
- `logic.js`: `createUnlimitedChoiceQuizGame(cfg)` 팩토리 수정(위 내용), `initQaGame()`/`startQaGame()`
  wrapper 함수 신규 추가, `switchMode()`의 `qa` 분기에서 `generateQaQuestion()` 직접 호출을
  `initQaGame()`(시작 화면 먼저 표시)로 교체.
- `index.html`: `qaMode` 마크업을 `quizMode`(라운드제 예시)와 동일한 패턴으로 재구성 —
  `quiz-score-board`에 `문제: N/10` 진행도 표시 추가, 기존 이모지/질문박스/선택지/피드백을
  `qaQuestionScreen`으로 감싸고 `display:none` 초기값 부여, `qaStartScreen`(안내문 + "게임 시작하기"
  버튼)과 `qaResultScreen`(`hs-result-title`/`hs-result-row`/`hs-result-score` 등 **기존 quiz 결과
  화면과 동일한 CSS 클래스 재사용** + "다시 하기" 버튼) 신규 추가.
- **의도적으로 안 건드린 것**: 5초 카운트다운 타이머(`timer`/`TimerFill`/`timeExpired`)는 이번
  범위에서 제외 — 감사 표에서 이미 "화면 전환 구조"와 "타이머 유무"를 별개 축으로 분류해뒀고,
  사용자 요청은 "라운드제로 통일"이지 "제한시간 게임으로 바꿔달라"가 아니었으므로 문제풀이 자체는
  기존처럼 시간 제한 없이 유지함. `recordWordResult()` 미호출(정오답 통계 미기록)도 이 팩토리의
  기존 특성이라 이번 범위 밖(§3-1과 무관한 별개 이슈 — 필요 시 사용자가 먼저 꺼내면 논의).
  `VOCAB_REVIEW_GAME_TYPES = ['quiz','sentence','spelling']`에 qa/lifeqa/shop이 원래 없어서
  `showResult()`에 `scheduleNextVocabReviewRound()` 호출도 추가하지 않음(대상 아님).
- `node -c` 문법 검사 통과. 브라우저 실행 테스트는 못 함 — 배포 후 확인 권장: '질문에 답하기'
  탭 진입 시 시작 화면이 먼저 뜨는지, "게임 시작하기"를 누르면 문제가 정상 출제되는지, 10문제를
  풀면(또는 일부러 몇 번 오답을 내며) 결과 화면(맞힌 개수/최고 콤보/점수)이 정상 표시되는지,
  "다시 하기"가 라운드를 재시작하는지. `lifeqa`/`shop` 탭은 아직 HTML을 안 건드려서 이전과
  100% 동일하게 무한반복으로 동작해야 정상(회귀 있으면 안 됨). `sw.js`를 `koe-app-v63` →
  `koe-app-v64`로 올림.

**구현 방식 (전환 2/3 — `lifeqaGame`, 2026-07-28 이어지는 세션에서 완료)**: qaGame과 동일하게
피처 디텍션(`isRoundMode`)이 이미 팩토리에 있어 `lifeqaMode` HTML만 추가하면 자동으로 라운드제로
전환됨(팩토리 코드는 이번에도 안 건드림).
- **주제 선택 버튼(`lifeqaTopicSelect`) 위치 결정**: 사용자에게 확인한 결과 뚜렷한 선호 없이
  "선택하지 않고 랜덤으로"(둘 중 아무거나 괜찮다는 의미로 해석)라는 답을 받아, Claude 판단으로
  **화면 전환 바깥(시작 화면·문제 화면 모두에서 계속 보이는 위치)**을 선택함 — 기존에도 주제를
  언제든 바꿀 수 있던 동작을 그대로 유지하는 쪽이 회귀 위험이 적다고 판단.
- `index.html`: `lifeqaMode`를 `qaMode`와 동일한 패턴으로 재구성 — `quiz-score-board`에
  `문제: N/10` 진행도 표시 추가, `lifeqaTopicSelect`는 그대로 최상단에 유지, 기존 질문 영역
  (`lifeqa-row`)/선택지/피드백을 `lifeqaQuestionScreen`(신규 래퍼, `display:none` 초기값)으로
  감쌈, `lifeqaStartScreen`(안내문 + "게임 시작하기")과 `lifeqaResultScreen`(qa/quiz와 동일한
  결과 화면 CSS 클래스 재사용 + "다시 하기") 신규 추가.
- `logic.js`: `initLifeqaGame()`/`startLifeqaGame()` wrapper 신규 추가, `switchMode()`의 `lifeqa`
  분기에서 `generateLifeqaQuestion()` 직접 호출을 `initLifeqaGame()`으로 교체. `changeLifeqaTopic()`
  (주제 변경 시 `lifeqaGame.clearPrevious()`+`generate()` 호출)은 라운드 진행 중 언제 호출돼도
  안전해 그대로 유지(회귀 없음) — 시작 화면에서 주제를 먼저 바꿔도 `QuestionScreen`이 아직
  `display:none`이라 화면에는 영향 없음.
- **의도적으로 안 건드린 것**: qaGame 전환 때와 동일한 이유로 타이머 미도입, `recordWordResult()`
  미호출 유지, `VOCAB_REVIEW_GAME_TYPES` 미포함 유지.
- `node -c` 문법 검사 통과. 브라우저 실행 테스트는 못 함 — 배포 후 확인 권장: '생활 문답' 탭 진입 시
  시작 화면이 먼저 뜨는지, 주제 버튼이 시작 화면/문제 화면 모두에서 정상 동작하는지, 10문제 완료 시
  결과 화면이 정상 표시되는지, "다시 하기"가 라운드를 재시작하는지. `shop` 탭은 아직 HTML을 안
  건드려서 이전과 100% 동일하게 무한반복으로 동작해야 정상(회귀 있으면 안 됨). `sw.js`를
  `koe-app-v64` → `koe-app-v65`로 올림.

**구현 방식 (전환 3/3 — `shopGame`, 2026-07-28 이어지는 세션에서 완료)**: qa/lifeqa와 동일하게
피처 디텍션(`isRoundMode`)만으로 자동 전환됨(팩토리 코드는 이번에도 안 건드림).
- `index.html`: `shopMode`를 qa/lifeqa와 동일한 패턴으로 재구성 — `quiz-score-board`에
  `문제: N/10` 진행도 표시 추가, `shopItemsDisplay`(가격표)는 `lifeqaTopicSelect`와 같은 이유로
  화면 전환 바깥에 유지(직전 세션에서 결정한 원칙을 그대로 적용), `qa-question-box`/선택지/피드백을
  `shopQuestionScreen`(신규 래퍼, `display:none` 초기값)으로 감쌈, `shopStartScreen`/`shopResultScreen`
  신규 추가(qa/lifeqa와 동일한 CSS 클래스 재사용).
- `logic.js`: `initShopGame()`/`startShopGame()` wrapper 신규 추가, `switchMode()`의 `shop` 분기에서
  `generateShopQuestion()` 직접 호출을 `initShopGame()`(시작 화면 먼저 표시)으로 교체(qa/lifeqa와
  동일 패턴).
- **의도적으로 안 건드린 것**: qa/lifeqa 전환 때와 동일한 이유로 타이머 미도입,
  `recordWordResult()` 미호출 유지, `VOCAB_REVIEW_GAME_TYPES` 미포함 유지.
- `node -c` 문법 검사 통과. 브라우저 실행 테스트는 못 함 — 배포 후 확인 권장: '가게 게임' 탭 진입 시
  시작 화면이 먼저 뜨는지, 가격표가 시작/문제 화면 모두에서 정상 표시되는지, 10문제 완료 시
  결과 화면이 정상 표시되는지, "다시 하기"가 라운드를 재시작하는지. `sw.js`를 `koe-app-v65` →
  `koe-app-v66`으로 올림.

**"0단계"(무한반복→라운드제 통일) 완료 — qa/lifeqa/shop 3개 모두 라운드제로 통일됨.**

**다음 세션에서 이어서 할 일**: §3-5 원래 계획의 2번 항목(**공용 게임엔진 베이스 추출**)에 착수 —
가장 위험도가 낮은 factory로 예정돼 있던 `createMatchRevealQuizGame`을 골라 공통 상태/생명주기를
`createGenericQuizEngine(cfg)` 같은 공용 베이스로 뽑아내고, 기존 factory는 그 위에 게임 유형별
로직만 얹는 얇은 래퍼로 전환. 이 시점까지는 함수 시그니처와 외부 호출부(`initEawaseGame()` 등)를
절대 바꾸지 않아 회귀를 방지할 것. 1단계 감사 결과(위 (a)/(b)/(c) 분류)를 먼저 참고해서 시작할 것 —
특히 (c)의 "화면 전환 구조"는 이제 4개 factory 모두 라운드제로 통일됐으니 더 이상 분기할 필요가
없어졌다는 점을 설계에 반영할 것.

**구현 방식 (2번 항목 — `createMatchRevealQuizGame` 공용화, 2026-07-28 이어지는 세션에서 완료)**:
- `createMatchRevealQuizGame(cfg)`의 함수 본체(상태 변수·`resetState`/`init`/`start`/`pickWord`/
  `showQuestion`/`replay`/`selectOption`/`showResult`) 전체를 그대로 새 함수 `createGenericQuizEngine(cfg)`로
  옮기고, `createMatchRevealQuizGame(cfg)`는 `return createGenericQuizEngine(cfg);` 한 줄짜리
  얇은 래퍼로 전환. 로직·변수명·동작 전부 100% 동일(순수 함수 분리, 리네이밍만) — 회귀 위험 없음.
- **함수 시그니처·외부 호출부는 전혀 안 건드림**: `ewGame`/`silGame` 선언부(`createMatchRevealQuizGame({...})`
  호출)와 `initEawaseGame()`/`startEawaseGame()`/`initSilhouetteGame()`/`startSilhouetteGame()`/
  `silReplaySound()` 등은 한 글자도 안 바뀜.
- **아직 일반화 안 하고 남겨둔 것(주석으로 명시)**: 정답 시 점수 계산식 `10 + (combo-1)*5`는
  1단계 감사에서 "MatchReveal만의 콤보 보너스 방식"으로 분류된 부분이라 `createGenericQuizEngine`
  안에 그대로 하드코딩돼 있음 — 지금은 MatchReveal(ewGame/silGame) 2개만 이 베이스를 쓰므로 문제
  없지만, 다음 factory(WordChoice 등, 고정 +10/+20 점수식)를 같은 베이스 위로 옮길 차례가 오면
  이 계산식을 `cfg.scoreForCombo(combo)` 같은 콜백으로 빼내는 일반화가 그때 반드시 필요함(§3-6
  cfg 스키마 정리와 함께 다룰 것).
- `node -c` 문법 검사 통과. 순수 리팩터링(동작 변경 없음)이라 회귀 위험은 낮지만, 배포 후
  '그림 반쪽 맞추기'(ewGame)와 '실루엣 맞추기'(silGame) 두 게임 모두 정상 동작하는지(문제 출제,
  정답/오답 판정, 콤보 보너스 점수, 10문제 후 결과 화면) 확인 권장. `sw.js`를 `koe-app-v66` →
  `koe-app-v67`로 올림.

**다음 세션에서 이어서 할 일**: 위에서 남겨둔 "점수 계산식 cfg화" 없이 그대로 두고, §3-5 계획
3번 항목대로 나머지 3개 factory 중 다음 1개(예: `createWordChoiceQuizGame` → `quizGame`/
`audioEmojiGame`)를 `createGenericQuizEngine(cfg)` 위로 옮기는 작업 착수. 이번에 옮길 때는
`createMatchRevealQuizGame` 때와 달리 실제로 로직 차이(점수식 +10 고정, 5초 타이머 유무 등,
1단계 감사 (c) 참고)가 있어 **단순 이름 변경이 아니라 `createGenericQuizEngine`의 cfg 스키마를
확장하는 작업**이 될 것 — 예: `cfg.scoreForCombo`(없으면 기존 MatchReveal 식 유지), `cfg.timed`
지원 여부 등을 먼저 설계하고 나서 착수할 것. 이 확장 작업은 난이도가 높아지므로 한 세션 안에
무리하게 3개를 다 옮기려 하지 말 것(§2-1 다중 세션 분할 원칙).

**구현 방식 (2번 항목 — `createWordChoiceQuizGame` 어댑터 전환, 2026-07-28 이어지는 세션에서
완료)**: 예상대로 단순 리네이밍이 아니라 `createGenericQuizEngine`의 cfg 스키마를 여러 개
확장하는 작업이었음. **핵심 전략**: `quizGame`/`audioEmojiGame` 선언부(cfg 객체)와 외부 호출부
(`initQuizGame()`/`generateAudioEmojiQuiz()`/`speakCurrentWord()` 등)는 **단 한 글자도 안 바꾸고**,
`createWordChoiceQuizGame(cfg)` 함수 **내부에서만** 기존 cfg를 generic 엔진용 cfg로 변환하는
어댑터 계층을 둠 — 변환 후 코드로 실제 동일성 검증(원본 파일과 diff)까지 완료해서 quizGame/
audioEmojiGame 선언 블록과 6개 wrapper 함수가 원본과 byte 단위로 100% 동일함을 확인함.
- `createGenericQuizEngine`에 아래 선택적 cfg 훅을 추가(모두 기본값이 MatchReveal의 기존
  동작을 그대로 보존하도록 설계 — ewGame/silGame의 cfg는 이 훅들을 하나도 안 씀):
  `playScreenSuffix`(기본 `'PlayScreen'`, WordChoice는 `'QuestionScreen'`), `btnClass`(기본
  `'quiz-btn'`), `roundMode`(기본 true, WordChoice는 `!!cfg.timed`), `countdownSeconds`(기본
  없음, WordChoice는 `cfg.timed ? 5 : undefined`), `pickItem(prevWord)`(기본: `cfg.words`에서
  직전 단어만 제외한 랜덤, WordChoice는 SRS 가중치+혼동군 제외 로직), `buildOptions`가 돌려주는
  선택지에 `render(btn)`/`datasetExtra` 추가 지원(기존 `{label,isCorrect}`도 계속 지원),
  `celebrate(btn,word)`(기본: `celebrateCorrect(selectedButton, word)`), `onReveal(allButtons)`
  (기본 없음), `audioBtnSuffix`(기본 없음, 지정하면 매 문제 활성화·정답/시간초과 시 비활성화),
  `correctAdvanceDelay`(기본 0), `scoreForCombo(combo)`(기본: MatchReveal 콤보 보너스 식,
  WordChoice는 고정 `() => 10`), `onShowResult()`(기본 없음, WordChoice는
  `scheduleNextVocabReviewRound`), `autoSpeakOnQuestion`(기본 false, WordChoice는 true),
  `lockPointerEvents`(기본 true, WordChoice는 false — 원래 정답 후에도 선택지 컨테이너를
  안 잠갔으므로).
- 5초 카운트다운 타이머(`#{P}TimerFill` 애니메이션)와 시간 초과 처리(`timeExpired()`)를
  generic 엔진 안에 새로 구현 — 기존 WordChoice의 타이머 로직을 그대로 옮기되 `btnClass`/
  `audioBtnSuffix`/`onReveal` 훅으로 일반화함.
- generic 엔진의 반환 API에 `generate`(=내부 `showQuestion`, Unlimited 계열과 이름 통일)를
  추가하고, `createWordChoiceQuizGame`은 이걸 `generateQuiz`로, `replay`를 `speakCurrent`로
  다시 감싸서 반환.
- **의도적으로 안 건드린 것**: `createSequencePickQuizGame`/`createUnlimitedChoiceQuizGame`은
  아직 이 베이스로 안 옮김(다음 세션들 몫).
- `node -c` 문법 검사 통과, quizGame/audioEmojiGame 선언부와 6개 wrapper 함수 원본 대비 diff로
  100% 동일 확인. 다만 generic 엔진 내부 로직은 대대적으로 재작성됐고 브라우저 실행 테스트는
  못 했으므로, 배포 후 특히 꼼꼼히 확인 권장: '단어 퀴즈'(quizGame — 5초 타이머 바가 정상
  줄어드는지, 시간 초과 시 오답 처리되는지, 10문제 후 결과화면, 정답 시 모든 선택지에 뜻이
  같이 보이는지)와 '듣고 이모지 고르기'(audioEmojiGame — 타이머/시작화면 없이 계속 이어지는지,
  정답 시 선택한 이모지 버튼에서 축하 연출이 나오는지, 오답이어도 시간 제약 없이 다시 고를 수
  있는지) 둘 다. `sw.js`를 `koe-app-v67` → `koe-app-v68`로 올림.

**다음 세션에서 이어서 할 일**: 나머지 2개 factory(`createSequencePickQuizGame`,
`createUnlimitedChoiceQuizGame`)를 순서대로 `createGenericQuizEngine` 위로 옮기는 작업.
이번 WordChoice 전환에서 검증된 원칙을 그대로 따를 것: (1) 기존 cfg 객체·외부 호출부는 절대
안 건드리고 어댑터 함수 내부에서만 변환, (2) 필요한 cfg 훅이 이미 있으면 재사용하고 정말
없는 경우에만 새 훅 추가, (3) 변환 후 반드시 원본과 선언부/wrapper 함수 diff로 100% 동일
검증. `createUnlimitedChoiceQuizGame`은 이미 `isRoundMode()` 피처 디텍션이 있어(0단계에서
qa/lifeqa/shop이 이걸 사용) `roundMode` 개념과 가장 가까우므로 비교적 수월할 가능성이 있고,
`createSequencePickQuizGame`은 점수식이 +20 고정(1단계 감사 참고)이라 `scoreForCombo`만
다시 지정하면 되는지 먼저 코드를 열어 확인할 것. 2개 남았으니 한 세션에 하나씩, 무리하지
말 것(§2-1 다중 세션 분할 원칙).

**구현 방식 (2번 항목 — `createUnlimitedChoiceQuizGame` 어댑터 전환, 2026-07-28 이어지는
세션에서 완료)**: 예상보다 차이점이 많아 `createGenericQuizEngine`에 훅을 5개 더 추가해야
했음(아래). `qaGame`/`lifeqaGame`/`shopGame` 선언부와 `initQaGame()`/`changeLifeqaTopic()`/
`generateShopQuestion()` 등 외부 호출부는 WordChoice 때와 동일한 전략으로 **단 한 글자도
안 바꿨고**, 원본과 diff로 100% 동일함을 확인함.
- **`isRoundMode()` 피처 디텱션은 이제 제거**: qa/lifeqa/shop 3개 모두 이미 지난 세션들에서
  StartScreen이 있는 마크업으로 전환 완료됐으므로, 이 시점엔 `isRoundMode()`가 항상 true를
  반환하는 상태였음 — 그래서 어댑터는 그냥 `roundMode`를 지정 안 함(generic 엔진 기본값 true)
  으로 단순화. 피처 디텍션 자체는 "0단계 진행 중 안전망" 역할이 끝났으므로 자연스럽게 걷어냄.
- `createGenericQuizEngine`에 추가한 5개 훅: `optionsContainerSuffix`(Unlimited는 `'Choices'`,
  기존 `'Options'` 대신), `speak(word)`(기존 `autoSpeakOnQuestion` 불리언을 대체하는 콜백으로
  일반화 — WordChoice 어댑터도 이 훅으로 같이 옮김, 동작 변화 없음), `feedbackText(choice,
  isCorrect)`(`#{P}Feedback` 요소가 있으면 문구 채움, 매 문제 시작 시 자동으로 비움),
  `onCorrectSpeak(choice)`(정답 처리 후 추가 음성, Unlimited는 고른 정답 문장을 다시 읽어줌),
  `revealedClass`(정답 시 선택지 컨테이너에 클래스 추가, 문제 시작마다 제거),
  `skipStats`(true면 `addLogChip`/`recordWordResult` 자체를 안 부름 — Unlimited 계열은 원래
  어휘 통계를 안 건드리는 게임이라 필요했음). `celebrate`/`onReveal` 훅도 3번째 인자(`choice`)
  를 받도록 확장(기존 2개 factory는 이 인자를 안 쓰므로 영향 없음).
- **previousKey 처리**: `cfg.pickItem(prevKey)`가 `{item,key}` 쌍을 돌려주는 예전 방식은
  generic 엔진에 억지로 맞추지 않고, 어댑터 자신의 클로저 변수(`previousKey`)로 그대로
  유지 — generic 엔진의 `pickItem(prevWord)` 훅은 그 값을 무시하고 어댑터가 알아서
  `cfg.pickItem(previousKey)`를 호출하도록 함. `clearPrevious()`도 이 클로저 변수만
  초기화하면 되므로 generic 엔진 쪽엔 아무 지원도 필요 없었음.
- `node -c` 통과, `qaGame`/`lifeqaGame`/`shopGame` 선언부·`getLifeqaPool`/`pickShopRoundItems`/
  `renderShopItemsDisplay`/`changeLifeqaTopic`·6개 wrapper 함수 모두 원본과 diff로 100% 동일
  확인. `sw.js`를 `koe-app-v68` → `koe-app-v69`로 올림. 이번에도 브라우저 테스트는 못 했고,
  특히 훅을 5개나 새로 추가한 만큼 배포 후 '질문에 답하기'(qa)/'생활 문답'(lifeqa)/'가게
  게임'(shop) 셋 다 정답/오답 피드백 문구, 정답 시 이모지 축하 연출 두 가지(선택 버튼+전체화면),
  10문제 후 결과 화면, lifeqa 주제 버튼 전환이 예전처럼 동작하는지 꼼꼼히 확인 권장.

**남은 factory 1개(`createSequencePickQuizGame`)에 대한 판단**: 코드를 열어보니 애초 예상과
달리 이건 단순 cfg 차이가 아니라 **상호작용 패턴 자체가 다름** — MatchReveal/WordChoice/
Unlimited는 전부 "선택지 1개를 클릭하면 그 자리에서 정답/오답이 확정"되는 단일 클릭 모델인
반면, SequencePick(`sentenceGame`/`compoundGame`)은 "9개 선택지 중 2개를 순서대로 골라야
정답이 확정"되는 다단계 선택 모델(`picked` 배열, `order-badge` 표시, 첫 번째만 맞았을 때는
계속 진행 등)이고, 요리 냄비 연출(`playIngredientTossAnimation`/`resetCookPotVisual`/
`playDishCompleteReaction`) 같은 이 게임 전용 로직도 얽혀 있음. 이걸 지금의 단일 클릭
기반 `createGenericQuizEngine`에 강제로 수렴시키려면 다단계 선택 상태 관리용 훅을 여러 개
새로 발명해야 하는데, 정작 이 factory를 쓰는 게 2개(sentence/compound)뿐이라 얻는 이득 대비
회귀 위험이 크다고 판단함. **그래서 이 factory는 공용 베이스로 옮기지 않고 독립 factory로
남겨두는 쪽으로 방향을 바꿈** — §3-5의 "4개 factory를 전부 1개 베이스로 수렴"이라는 원래
목표를 "단일 클릭형 3개는 수렴, 다단계 선택형 1개는 별도 유지"로 조정. 다음 세션에서 이
판단에 동의한다면 §3-5를 "공용 베이스 추출 3/3(대상 factory 기준) 완료"로 마무리 짓고,
동의하지 않는다면(정말 SequencePick도 수렴시키고 싶다면) 다단계 선택 상태를 감싸는 훅 설계를
새로 논의할 것.

**연동 지점**: `createWordChoiceQuizGame`, `createUnlimitedChoiceQuizGame`, `createSequencePickQuizGame`,
`createMatchRevealQuizGame` (logic.js), 그리고 이들을 호출/래핑하는 `quizGame`/`audioEmojiGame`/
`ewGame`/`qaGame`/`lifeqaGame`/`shopGame` 등 개별 게임 인스턴스 선언부

**우선순위**: 중 (§3-1 완료 후 착수 가능 — §3-2/§3-3보다는 뒤, §3-4보다는 앞이어도 무방)
**난이도**: 중~고 (기계적 치환이 아니라 "같은 로직인지 아닌지"를 함수별로 판단해야 하므로 §3-2보다 까다로움)
**주의사항**: 4개를 한 세션에 동시에 손대지 말 것. 1개를 완전히 전환하고 정상 동작을 확인한 뒤 다음
세션에서 다음 1개로 넘어갈 것 — 4개 factory가 쓰이는 화면이 서로 다르므로 한 번에 여러 개를 건드리면
회귀 지점을 좁히기 어려워짐.

---

## 공통 작업 규칙 (재확인, 기존 학습이론 로드맵과 동일하게 유지)
- 파일 수정 시 항상 수정된 파일 세트 전체를 교체 안내 (현재는 `index.html`/`logic.js`/`data.js`/`sw.js` 4개)
- `sw.js`의 `CACHE_NAME` 버전을 매번 올릴 것
- 새 UI는 `:root` CSS 변수(`--washi`, `--hanko`, `--indigo`, `--sage`, `--gold`, `--line`)와 기존
  클래스 네이밍 패턴을 재사용해 톤을 통일할 것
- 주석은 기존 코드 스타일대로 한국어로, 함수 위에 `/* ... */` 블록으로 "왜" 이 로직이 필요한지 설명 포함
- **이 문서(`layering-roadmap.md`)는 작업할 때마다 매번 갱신할 것.** 코드 수정이 끝난 그 턴 안에 함께
  반영하고, 다음 턴으로 미루지 않는다:
  - §3의 단계 중 하나를 진행/완료하면 → 해당 섹션 제목에 "✅ 구현 완료" 또는 "🚧 진행 중" 표시 +
    그 아래 "구현 내역" 인용 블록으로 실제 변경 파일·함수명·연동 지점을 구체적으로 적을 것
  - 계획에 없던 새 레이어링 이슈를 발견하면 → 새 섹션으로 기록
  - 우선순위나 계획이 바뀌면 → 해당 부분을 직접 수정
  - §1의 "현재 코드 → 목표 레이어 매핑" 표는 코드가 실제로 이동할 때마다 "아직 섞여 있는 것" 칸에서
    빼서 "이미 해당되는 것" 칸으로 옮길 것
- **새로 추가하는 기능/로직은 반드시 이 문서의 §1 매핑 표에 레이어를 먼저 기록**한 뒤 작업 시작 —
  물리적으로 아직 파일이 안 나뉘어 있어도 개념적 레이어링을 먼저 유지하는 것이 이 로드맵의 핵심 규칙
- 학습이론 자체(현재 19개 목록)에 대한 새 작업은 이 문서가 아니라 필요 시 별도 문서로 관리 —
  이 문서는 레이어화 작업 전용
