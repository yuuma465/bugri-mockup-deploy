/* =====================================================================
 * data.js — ダミーデータ（モックアップ用 / サーバ通信なし）
 * すべてハードコード。本番ではバックエンドAPIに差し替え想定。
 * =================================================================== */

/* カテゴリ（DOPA 風タブ） */
const CATEGORIES = [
  { id: 'all',       label: 'すべて' },
  { id: 'pokemon',   label: 'ポケモン' },
  { id: 'onepiece',  label: 'ワンピース' },
  { id: 'yugioh',    label: '遊戯王' },
  { id: 'dragonball',label: 'ドラゴンボール' },
  { id: 'weiss',     label: 'ヴァイス' },
  { id: 'mtg',       label: 'MTG' },
];

/* レア度メタ（CSS のクラス名と対応） */
const RARITY = {
  SSR: { label: 'SSR', cls: 'ssr' },
  SR:  { label: 'SR',  cls: 'sr'  },
  R:   { label: 'R',   cls: 'r'   },
  N:   { label: 'N',   cls: 'n'   },
};

/* オリパパック（thumb は画像なしのため CSS テーマキーで見た目を生成） */
const ORIPA_PACKS = [
  {
    id: 'p01',
    name: 'ポケモン SSR確定 PREMIUM BOX',
    category: 'pokemon',
    price: 3000,
    tag: 'NEW',
    theme: 'fire',
    totalStock: 100,
    remainingStock: 37,
    desc: '1口につきSSR以上が必ず1枚。リザードンEXの高額枠を狙える看板オリパ。',
    cards: [
      { name: 'リザードンEX', rarity: 'SSR', value: 50000, weight: 1 },
      { name: 'ミュウツー VSTAR', rarity: 'SSR', value: 42000, weight: 1 },
      { name: 'ピカチュウVMAX', rarity: 'SR', value: 12000, weight: 5 },
      { name: 'ミュウツーSR', rarity: 'SR', value: 10000, weight: 5 },
      { name: 'ルカリオR', rarity: 'R', value: 3000, weight: 20 },
      { name: 'イーブイN', rarity: 'N', value: 500, weight: 68 },
    ],
  },
  {
    id: 'p02',
    name: 'ワンピース 激アツ 1000pt',
    category: 'onepiece',
    price: 1000,
    tag: 'HOT',
    theme: 'ocean',
    totalStock: 500,
    remainingStock: 412,
    desc: '人気キャラのパラレル多数。ニカルフィの一撃を1000ptから。',
    cards: [
      { name: 'ルフィ ニカ', rarity: 'SSR', value: 30000, weight: 2 },
      { name: 'シャンクス（赤）', rarity: 'SR', value: 8000, weight: 8 },
      { name: 'ゾロ パラレル', rarity: 'R', value: 2500, weight: 30 },
      { name: 'ナミ パラレル', rarity: 'R', value: 2000, weight: 25 },
      { name: 'チョッパーN', rarity: 'N', value: 300, weight: 35 },
    ],
  },
  {
    id: 'p03',
    name: '遊戯王 旧アジア レリーフ祭',
    category: 'yugioh',
    price: 5000,
    tag: 'LIMITED',
    theme: 'gold',
    totalStock: 60,
    remainingStock: 8,
    desc: 'ブルーアイズのレリーフが当たる高額オリパ。SSR枠は鑑定済み美品。',
    cards: [
      { name: '青眼の白龍 レリーフ', rarity: 'SSR', value: 120000, weight: 1 },
      { name: 'ブラック・マジシャン アルティメット', rarity: 'SSR', value: 90000, weight: 1 },
      { name: '真紅眼の黒竜', rarity: 'SR', value: 15000, weight: 6 },
      { name: '混沌の黒魔術師', rarity: 'R', value: 4000, weight: 22 },
      { name: '万力魔神 N', rarity: 'N', value: 800, weight: 70 },
    ],
  },
  {
    id: 'p04',
    name: 'ドラゴンボール スーパー 神龍オリパ',
    category: 'dragonball',
    price: 2000,
    tag: null,
    theme: 'energy',
    totalStock: 200,
    remainingStock: 153,
    desc: 'SCR・SECレアの孫悟空を狙う。気を溜めて一気に開封。',
    cards: [
      { name: '孫悟空 SCR', rarity: 'SSR', value: 38000, weight: 2 },
      { name: 'ベジータ SEC', rarity: 'SSR', value: 28000, weight: 2 },
      { name: 'フリーザ SR', rarity: 'SR', value: 9000, weight: 8 },
      { name: 'トランクス R', rarity: 'R', value: 2200, weight: 28 },
      { name: 'クリリン N', rarity: 'N', value: 250, weight: 60 },
    ],
  },
  {
    id: 'p05',
    name: 'ポケモン お試し 300pt',
    category: 'pokemon',
    price: 300,
    tag: 'NEW',
    theme: 'grass',
    totalStock: 1000,
    remainingStock: 880,
    desc: 'ワンコインで毎日引ける入門オリパ。N外れでもポイント還元あり。',
    cards: [
      { name: 'ミュウ ex', rarity: 'SSR', value: 18000, weight: 1 },
      { name: 'リーフィアVSTAR', rarity: 'SR', value: 5000, weight: 7 },
      { name: 'ナエトルR', rarity: 'R', value: 900, weight: 30 },
      { name: 'キャタピーN', rarity: 'N', value: 100, weight: 62 },
    ],
  },
  {
    id: 'p06',
    name: 'ヴァイスシュヴァルツ サイン入りSP',
    category: 'weiss',
    price: 1500,
    tag: 'HOT',
    theme: 'neon',
    totalStock: 150,
    remainingStock: 41,
    desc: '声優直筆サインのSP枠を封入。推しを引き当てろ。',
    cards: [
      { name: 'サイン入り SP', rarity: 'SSR', value: 25000, weight: 2 },
      { name: 'ホロSR', rarity: 'SR', value: 6000, weight: 10 },
      { name: 'パラR', rarity: 'R', value: 1800, weight: 30 },
      { name: 'ノーマルN', rarity: 'N', value: 200, weight: 58 },
    ],
  },
  {
    id: 'p07',
    name: 'MTG 統率者 高額FOIL',
    category: 'mtg',
    price: 4000,
    tag: 'LIMITED',
    theme: 'arcane',
    totalStock: 80,
    remainingStock: 24,
    desc: 'Reserved List 級の英語版FOILが当たる本格オリパ。',
    cards: [
      { name: 'Black Lotus（再録）', rarity: 'SSR', value: 80000, weight: 1 },
      { name: 'Mana Crypt FOIL', rarity: 'SR', value: 14000, weight: 6 },
      { name: 'Sol Ring 拡張', rarity: 'R', value: 3500, weight: 24 },
      { name: 'Forest N', rarity: 'N', value: 150, weight: 69 },
    ],
  },
  {
    id: 'p08',
    name: 'ワンピース 第二弾 SOLD OUT記念',
    category: 'onepiece',
    price: 800,
    tag: null,
    theme: 'ocean',
    totalStock: 300,
    remainingStock: 0,
    desc: '完売御礼。再販告知をお待ちください。',
    cards: [
      { name: 'エース パラレル', rarity: 'SSR', value: 22000, weight: 2 },
      { name: 'サボ SR', rarity: 'SR', value: 5500, weight: 9 },
      { name: 'ウソップ R', rarity: 'R', value: 1500, weight: 30 },
      { name: 'ブルックN', rarity: 'N', value: 200, weight: 59 },
    ],
  },
  {
    id: 'p09',
    name: 'ポケモン 福袋オリパ 10000pt',
    category: 'pokemon',
    price: 10000,
    tag: 'LIMITED',
    theme: 'gold',
    totalStock: 30,
    remainingStock: 5,
    desc: '最低保証SR3枚。SSRはPSA10鑑定品。ハイローラー向けの最上位枠。',
    cards: [
      { name: 'リザードンUR（PSA10）', rarity: 'SSR', value: 220000, weight: 1 },
      { name: 'レックウザVMAX SA', rarity: 'SSR', value: 95000, weight: 2 },
      { name: 'カイリューV SA', rarity: 'SR', value: 16000, weight: 12 },
      { name: 'ヒトカゲ R', rarity: 'R', value: 4000, weight: 30 },
      { name: 'ポッチャマ N', rarity: 'N', value: 600, weight: 55 },
    ],
  },
];

/* 当選報告フィード（DOPA のリアルタイム当選風） */
const WIN_FEED = [
  { user: 'カイ', avatar: 'K', rarity: 'SSR', card: 'リザードンEX', pack: 'ポケモン SSR確定', time: 'たった今' },
  { user: 'ソラ',  avatar: 'S', rarity: 'SSR', card: '青眼の白龍 レリーフ', pack: '遊戯王 レリーフ祭', time: '1分前' },
  { user: 'レン',  avatar: 'R', rarity: 'SR',  card: 'ピカチュウVMAX', pack: 'ポケモン PREMIUM', time: '3分前' },
  { user: 'ミオ',  avatar: 'M', rarity: 'SSR', card: 'ルフィ ニカ', pack: 'ワンピース 激アツ', time: '6分前' },
  { user: 'ハル',  avatar: 'H', rarity: 'SR',  card: '孫悟空 SCR', pack: 'ドラゴンボール 神龍', time: '8分前' },
  { user: 'ユウ',  avatar: 'Y', rarity: 'SSR', card: 'Black Lotus', pack: 'MTG 高額FOIL', time: '12分前' },
  { user: 'ナギ',  avatar: 'N', rarity: 'R',   card: 'ゾロ パラレル', pack: 'ワンピース 激アツ', time: '15分前' },
  { user: 'アヤ',  avatar: 'A', rarity: 'SSR', card: 'リザードンUR', pack: 'ポケモン 福袋', time: '21分前' },
];

/* トップのヒーローバナー（カルーセル風） */
const BANNERS = [
  { theme: 'fire',   tag: 'PICK UP', title: 'リザードンEX 大量封入', sub: 'SSR確定 PREMIUM BOX 第3弾 開幕' },
  { theme: 'arcane', tag: 'NEW',     title: 'MTG 高額FOILオリパ', sub: 'Reserved List 級が当たる' },
  { theme: 'gold',   tag: 'LIMITED', title: '遊戯王 レリーフ祭', sub: '青眼の白龍 鑑定済み美品' },
];

/* ユーザーの保有ポイント（ヘッダー表示用ダミー） */
const USER_POINTS = 12800;

/* 排出確率を weight から算出 */
function calcOdds(cards) {
  const total = cards.reduce((s, c) => s + c.weight, 0);
  const byRarity = {};
  cards.forEach((c) => { byRarity[c.rarity] = (byRarity[c.rarity] || 0) + c.weight; });
  const odds = {};
  ['SSR', 'SR', 'R', 'N'].forEach((r) => {
    if (byRarity[r]) odds[r] = +((byRarity[r] / total) * 100).toFixed(1);
  });
  return odds;
}

/* weight に基づく重み付き抽選（モックの見た目用。本番は外注の抽選エンジン） */
function drawCard(cards) {
  const total = cards.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of cards) { r -= c.weight; if (r <= 0) return c; }
  return cards[cards.length - 1];
}

function findPack(id) { return ORIPA_PACKS.find((p) => p.id === id); }

/* === [C] 追加画面ダミーデータ（mypage / point） === */

/* ログインユーザーのプロフィール */
const USER_PROFILE = {
  name: 'カイ',
  rank: 'GOLD',
  rankCurrentPt: 64000,
  rankNextPt: 100000,
  nextRank: 'PLATINUM',
  gachaCount: 342,
  assetPt: 486500,
  cardCount: 287,
};

/* 保有コレクション（16枚 / レア度をばらけさせる SSR3・SR4・R4・N5） */
const COLLECTION = [
  { name: 'リザードンEX',                 rarity: 'SSR', value: 50000,  pack: 'ポケモン SSR確定 PREMIUM BOX' },
  { name: '青眼の白龍 レリーフ',           rarity: 'SSR', value: 120000, pack: '遊戯王 旧アジア レリーフ祭' },
  { name: 'Black Lotus（再録）',           rarity: 'SSR', value: 80000,  pack: 'MTG 統率者 高額FOIL' },
  { name: 'ピカチュウVMAX',                rarity: 'SR',  value: 12000,  pack: 'ポケモン SSR確定 PREMIUM BOX' },
  { name: 'シャンクス（赤）',              rarity: 'SR',  value: 8000,   pack: 'ワンピース 激アツ 1000pt' },
  { name: '真紅眼の黒竜',                  rarity: 'SR',  value: 15000,  pack: '遊戯王 旧アジア レリーフ祭' },
  { name: 'フリーザ SR',                   rarity: 'SR',  value: 9000,   pack: 'ドラゴンボール スーパー 神龍オリパ' },
  { name: 'ルカリオR',                     rarity: 'R',   value: 3000,   pack: 'ポケモン SSR確定 PREMIUM BOX' },
  { name: 'ゾロ パラレル',                 rarity: 'R',   value: 2500,   pack: 'ワンピース 激アツ 1000pt' },
  { name: '混沌の黒魔術師',                rarity: 'R',   value: 4000,   pack: '遊戯王 旧アジア レリーフ祭' },
  { name: 'Sol Ring 拡張',                 rarity: 'R',   value: 3500,   pack: 'MTG 統率者 高額FOIL' },
  { name: 'イーブイN',                     rarity: 'N',   value: 500,    pack: 'ポケモン SSR確定 PREMIUM BOX' },
  { name: 'チョッパーN',                   rarity: 'N',   value: 300,    pack: 'ワンピース 激アツ 1000pt' },
  { name: '万力魔神 N',                    rarity: 'N',   value: 800,    pack: '遊戯王 旧アジア レリーフ祭' },
  { name: 'クリリン N',                    rarity: 'N',   value: 250,    pack: 'ドラゴンボール スーパー 神龍オリパ' },
  { name: 'Forest N',                      rarity: 'N',   value: 150,    pack: 'MTG 統率者 高額FOIL' },
];

/* 開封履歴（10件 / 新しい順） */
const HISTORY = [
  { datetime: '2026-05-31 21:14', pack: 'ポケモン SSR確定 PREMIUM BOX', card: 'リザードンEX',       rarity: 'SSR', spent: 3000 },
  { datetime: '2026-05-31 20:48', pack: 'ワンピース 激アツ 1000pt',     card: 'ゾロ パラレル',       rarity: 'R',   spent: 1000 },
  { datetime: '2026-05-30 23:02', pack: '遊戯王 旧アジア レリーフ祭',   card: '真紅眼の黒竜',         rarity: 'SR',  spent: 5000 },
  { datetime: '2026-05-30 19:30', pack: 'ポケモン お試し 300pt',        card: 'キャタピーN',         rarity: 'N',   spent: 300 },
  { datetime: '2026-05-29 22:11', pack: 'MTG 統率者 高額FOIL',          card: 'Black Lotus（再録）', rarity: 'SSR', spent: 4000 },
  { datetime: '2026-05-29 18:05', pack: 'ドラゴンボール スーパー 神龍オリパ', card: 'フリーザ SR',    rarity: 'SR',  spent: 2000 },
  { datetime: '2026-05-28 21:40', pack: 'ヴァイスシュヴァルツ サイン入りSP', card: 'パラR',          rarity: 'R',   spent: 1500 },
  { datetime: '2026-05-28 12:22', pack: 'ポケモン 福袋オリパ 10000pt',  card: 'ポッチャマ N',       rarity: 'N',   spent: 10000 },
  { datetime: '2026-05-27 23:55', pack: '遊戯王 旧アジア レリーフ祭',   card: '青眼の白龍 レリーフ', rarity: 'SSR', spent: 5000 },
  { datetime: '2026-05-27 20:18', pack: 'ワンピース 激アツ 1000pt',     card: 'ナミ パラレル',       rarity: 'R',   spent: 1000 },
];

/* ランク序列 */
const RANKS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
