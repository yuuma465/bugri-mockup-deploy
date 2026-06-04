/* =====================================================================
 * app.js — 一覧/詳細の描画 ＋ ガチャ開封演出（モックアップ）
 * サーバ通信なし。data.js のダミーデータで描画。
 * =================================================================== */

/* ---------- ユーティリティ ---------- */
const fmt = (n) => n.toLocaleString('ja-JP');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function catLabel(id) { return (CATEGORIES.find((c) => c.id === id) || {}).label || id; }
function setHeaderPoints() { const el = $('#hdr-points'); if (el) el.textContent = fmt(USER_POINTS); }

/* パックのサムネHTML（画像が無い場合は白ベースのプレースホルダ） */
function thumbHtml(pack, big = false) {
  const sold = pack.remainingStock === 0;
  const soldBadge = sold ? '<div class="badge-soldout">SOLD OUT</div>' : '';
  const stockPill = !big
    ? `<span class="stock-pill">残 ${pack.remainingStock}/${pack.totalStock}</span>` : '';
  return `<div class="thumb">
    <div class="img-empty">NO IMAGE</div>
    ${stockPill}${soldBadge}
  </div>`;
}

/* ===================================================================
 * 一覧ページ
 * =============================================================== */
let curCat = 'all';
let curSort = new URLSearchParams(location.search).get('sort') || 'popular';
const SORT_OPTIONS = [
  { id: 'popular', label: 'おすすめ順' },
  { id: 'expensive', label: 'ポイントが高い順' },
  { id: 'cheap', label: 'ポイントが低い順' },
  { id: 'new', label: '公開が新しい順' },
  { id: 'old', label: '公開が古い順' },
  { id: 'stockHigh', label: '残り割合が多い順' },
  { id: 'stockLow', label: '残り割合が少ない順' },
];
if (!SORT_OPTIONS.some((option) => option.id === curSort)) curSort = 'popular';

function renderIndex() {
  setHeaderPoints();
  renderBanners();
  renderCats();
  renderGrid();
  renderWinFeed();
  wireSorts();
  syncBottomNav();
  window.addEventListener('hashchange', syncBottomNav);
}

function renderBanners() {
  const track = $('#hero-track');
  const dots = $('#hero-dots');
  const prev = $('#hero-prev');
  const next = $('#hero-next');
  track.innerHTML = BANNERS.map((b) => `
    <div class="banner t-${b.theme}">
      <div class="banner-title">${b.title}</div>
      <div class="banner-sub">${b.sub}</div>
    </div>`).join('');
  dots.innerHTML = BANNERS.map((_, i) =>
    `<button type="button" class="${i === 0 ? 'on' : ''}" aria-label="バナー${i + 1}へ移動"></button>`
  ).join('');
  const slides = $$('.banner', track);
  let activeIdx = 0;
  let scrollTimer = 0;
  const setActiveDot = (idx) => {
    activeIdx = (idx + slides.length) % slides.length;
    $$('button', dots).forEach((d, i) => d.classList.toggle('on', i === activeIdx));
  };
  const goToSlide = (idx) => {
    setActiveDot(idx);
    const slide = slides[activeIdx];
    const left = slide.offsetLeft - ((track.clientWidth - slide.clientWidth) / 2);
    track.scrollTo({ left, behavior: 'smooth' });
  };
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const center = track.scrollLeft + (track.clientWidth / 2);
      const nearest = slides.reduce((best, slide, i) => {
        const slideCenter = slide.offsetLeft + (slide.clientWidth / 2);
        const dist = Math.abs(center - slideCenter);
        return dist < best.dist ? { idx: i, dist } : best;
      }, { idx: activeIdx, dist: Infinity });
      setActiveDot(nearest.idx);
    }, 80);
  });
  if (prev && next) {
    prev.addEventListener('click', () => goToSlide(activeIdx - 1));
    next.addEventListener('click', () => goToSlide(activeIdx + 1));
  }
  $$('button', dots).forEach((button, i) => button.addEventListener('click', () => goToSlide(i)));
  if (slides.length > 1) {
    setInterval(() => {
      goToSlide(activeIdx + 1);
    }, 3000);
  }
}

function renderCats() {
  const el = $('#cats');
  el.innerHTML = CATEGORIES.map((c) =>
    `<button class="cat ${c.id === curCat ? 'on' : ''}" data-cat="${c.id}">${c.label}</button>`).join('');
  $$('.cat', el).forEach((b) => b.addEventListener('click', () => {
    curCat = b.dataset.cat; renderCats(); renderGrid();
  }));
}

function wireSorts() {
  const root = $('#sorts');
  const trigger = $('#sort-trigger');
  const label = $('#sort-label');
  const menu = $('#sort-menu');
  const setOpen = (open) => {
    root.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
  };
  const syncSortUi = () => {
    const current = SORT_OPTIONS.find((option) => option.id === curSort) || SORT_OPTIONS[0];
    label.textContent = current.label;
    $$('.sort-option', menu).forEach((button) => {
      const isActive = button.dataset.sort === curSort;
      button.classList.toggle('on', isActive);
      button.setAttribute('aria-checked', String(isActive));
    });
  };

  menu.innerHTML = SORT_OPTIONS.map((option) =>
    `<button class="sort-option" type="button" role="menuitemradio" data-sort="${option.id}" aria-checked="false">
      <span>${option.label}</span><span class="sort-check">✓</span>
    </button>`
  ).join('');
  trigger.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
  $$('.sort-option', menu).forEach((button) => {
    button.addEventListener('click', () => {
      curSort = button.dataset.sort;
      syncSortUi();
      setOpen(false);
      renderGrid();
      syncBottomNav();
    });
  });
  document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  syncSortUi();
}

function syncBottomNav() {
  const isRankingRoute = new URLSearchParams(location.search).get('sort') === 'popular';
  const key = isRankingRoute ? 'ranking' : (location.hash === '#news' ? 'news' : 'list');
  $$('.bottom-nav a[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === key));
}

function sortedPacks() {
  const order = new Map(ORIPA_PACKS.map((pack, index) => [pack.id, index]));
  let list = ORIPA_PACKS.filter((p) => curCat === 'all' || p.category === curCat);
  const by = {
    new: (a, b) => order.get(a.id) - order.get(b.id),
    old: (a, b) => order.get(b.id) - order.get(a.id),
    popular: (a, b) => (b.totalStock - b.remainingStock) - (a.totalStock - a.remainingStock),
    cheap: (a, b) => a.price - b.price,
    expensive: (a, b) => b.price - a.price,
    stockHigh: (a, b) => (b.remainingStock / b.totalStock) - (a.remainingStock / a.totalStock),
    stockLow: (a, b) => (a.remainingStock / a.totalStock) - (b.remainingStock / b.totalStock),
  }[curSort];
  return [...list].sort(by);
}

function renderGrid() {
  const grid = $('#grid');
  const packs = sortedPacks();
  $('#pack-count').textContent = `${packs.length}件`;
  grid.innerHTML = packs.map((p) => {
    const pct = Math.round((p.remainingStock / p.totalStock) * 100);
    const low = pct <= 25;
    const sold = p.remainingStock === 0;
    return `<div class="oripa ${sold ? 'soldout' : ''}">
      <a class="oripa-link" href="detail.html?id=${p.id}">
        ${thumbHtml(p)}
        <div class="oripa-body">
          <div class="oripa-name">${p.name}</div>
          <div class="oripa-price">${fmt(p.price)}<small>pt / 1回</small></div>
          <div class="gauge ${low ? 'low' : ''}"><i style="width:${pct}%"></i></div>
          <div class="stock-text"><span>残り ${p.remainingStock}口</span><span>${pct}%</span></div>
        </div>
      </a>
      <div class="draw-row-mini">
        <a class="mini-btn ${sold ? 'is-disabled' : ''}" href="detail.html?id=${p.id}">1回</a>
        <a class="mini-btn mini-btn-10 ${sold ? 'is-disabled' : ''}" href="detail.html?id=${p.id}">10連</a>
      </div>
    </div>`;
  }).join('');
}

function renderWinFeed() {
  $('#winfeed').innerHTML = WIN_FEED.map((w) => `
    <div class="win">
      <div class="win-ava">${w.avatar}</div>
      <div class="win-main">
        <div class="win-line1"><b>${w.user}</b> さんが <span class="rb ${RARITY[w.rarity].cls}">${w.rarity}</span> 当選！</div>
        <div class="win-line2">${w.card}（${w.pack}）</div>
      </div>
      <div class="win-time">${w.time}</div>
    </div>`).join('');
}

/* ===================================================================
 * 詳細ページ
 * =============================================================== */
let DETAIL_PACK = null;

function getParam(name) { return new URLSearchParams(location.search).get(name); }

function renderDetail() {
  setHeaderPoints();
  const pack = findPack(getParam('id')) || ORIPA_PACKS[0];
  DETAIL_PACK = pack;
  $('#crumb-name').textContent = pack.name;
  document.title = `${pack.name}｜BUGRI（バグリ）`;

  const odds = calcOdds(pack.cards);
  const pct = Math.round((pack.remainingStock / pack.totalStock) * 100);
  const low = pct <= 25;
  const sold = pack.remainingStock === 0;

  $('#detail').innerHTML = `
    <div class="detail-visual">${thumbHtml(pack, true)}</div>
    <div class="detail-info">
      <h1 class="detail-name">${pack.name}</h1>
      <p class="detail-desc">${pack.desc}</p>
      <div class="detail-price">${fmt(pack.price)}<small>pt / 1回</small></div>
      <div class="detail-stock">残り <b>${pack.remainingStock}</b> / ${pack.totalStock} 口
        <div class="gauge ${low ? 'low' : ''}"><i style="width:${pct}%"></i></div>
      </div>
      ${sold
        ? `<div class="draw-row">
            <button class="draw-btn" disabled>SOLD OUT</button>
            <button class="draw-btn-10" disabled>SOLD OUT</button>
          </div>`
        : `<div class="draw-row">
            <button class="draw-btn" id="draw-btn"><span class="sheen"></span>ガチャを引く（${fmt(pack.price)} pt）</button>
            <button class="draw-btn-10" id="draw-btn-10">10連を引く（${fmt(pack.price * 10)} pt）</button>
          </div>`}

      <h3 class="odds-title">排出確率</h3>
      <table class="odds"><thead><tr><th>レアリティ</th><th>確率</th></tr></thead><tbody>
        ${['SSR', 'SR', 'R', 'N'].filter((r) => odds[r]).map((r) =>
          `<tr><td><span class="rb ${RARITY[r].cls}">${r}</span></td><td>${odds[r]}%</td></tr>`).join('')}
      </tbody></table>
    </div>`;

  // 排出カード一覧
  $('#cards-grid').innerHTML = [...pack.cards]
    .sort((a, b) => b.value - a.value)
    .map((c) => {
      const cls = RARITY[c.rarity].cls;
      return `<div class="mini-card">
        <div class="mini-face"><span class="rb ${cls}">${c.rarity}</span></div>
        <div class="mini-body">
          <div class="mini-name">${c.name}</div>
          <div class="mini-val">${fmt(c.value)} pt</div>
        </div>
      </div>`;
    }).join('');

  if (!sold) {
    $('#draw-btn').addEventListener('click', startGacha);
    $('#draw-btn-10').addEventListener('click', startGacha10);
  }
  wireGachaControls();
}

/* ===================================================================
 * ガチャ開封演出
 * =============================================================== */
let gachaToken = 0;          // 進行中シーケンスの識別（スキップ/閉じる用）
let canvas, ctx, rafId, particles = [], spawning = false;

function wireGachaControls() {
  $('#g-skip').addEventListener('click', skipGacha);
  $('#g-again').addEventListener('click', () => {
    const mode = gachaMode;
    resetStage();
    if (mode === 'multi') startGacha10(); else startGacha();
  });
  $('#g-again10').addEventListener('click', () => { resetStage(); startGacha10(); });
  $('#g-close10').addEventListener('click', closeGacha);
  $('#g-close2').addEventListener('click', closeGacha);
  canvas = $('#gacha-canvas');
  ctx = canvas.getContext('2d');
}

function fitCanvas() {
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function resetStage() {
  $('#charge').classList.remove('on');
  $('#gcard-wrap').classList.remove('on', 'lift');
  $('#gcard').classList.remove('flip');
  $('#gresult').classList.remove('on');
  $('#aura').className = 'aura';
  $('#beams').className = 'beams';
  $('#beams').innerHTML = '';
  $('#flash').className = 'flash';
  // 10連結果コンテナもリセット
  const r10 = $('#r10-result');
  if (r10) { r10.classList.remove('on'); const grid = $('.r10-grid', r10); if (grid) grid.innerHTML = ''; }
  particles = [];
}

let CURRENT_CARD = null;
let CURRENT_CARDS = null;
let gachaMode = 'single';     // 'single' | 'multi'

function startGacha() {
  gachaMode = 'single';
  const token = ++gachaToken;
  const ov = $('#gacha-ov');
  ov.classList.add('show');
  fitCanvas();
  resetStage();
  $('#gcard-wrap').style.display = '';
  startLoop();

  CURRENT_CARD = drawCard(DETAIL_PACK.cards);

  // (A) チャージ：オーブ＋収束スパーク
  $('#charge').classList.add('on');
  spawning = 'converge';

  // (B) 収束フラッシュ → (C/D) リビール
  setTimeout(() => {
    if (token !== gachaToken) return;
    spawning = false;
    $('#flash').className = 'flash fire';
    $('#charge').classList.remove('on');
    setTimeout(() => { if (token === gachaToken) reveal(token); }, 260);
  }, 1700);
}

function reveal(token) {
  const card = CURRENT_CARD;
  const cls = RARITY[card.rarity].cls;

  // オーラ・光柱
  $('#aura').className = `aura on ${cls}`;
  if (card.rarity === 'SSR' || card.rarity === 'SR') {
    const beams = $('#beams');
    beams.className = 'beams on';
    beams.innerHTML = Array.from({ length: 12 }, (_, i) =>
      `<span class="beam" style="transform:rotate(${i * 30}deg); background:linear-gradient(${cls === 'ssr' ? 'var(--gold)' : 'var(--purple)'}, transparent)"></span>`).join('');
  }

  // カード裏 → 表フリップ
  $('#gfront').className = `gface gfront ${cls}`;
  $('#gfront').innerHTML = `
    <span class="rb ${cls}">${card.rarity}</span>
    <span class="gfront-name">${card.name}</span>
    <span class="gfront-val">${fmt(card.value)} pt</span>`;
  const wrap = $('#gcard-wrap');
  wrap.classList.add('on');
  setTimeout(() => {
    if (token !== gachaToken) return;
    $('#gcard').classList.add('flip');
    burst(card.rarity);            // 確定演出の紙吹雪
    showResult(card);
  }, 480);
}

function showResult(card) {
  // カード面に レア度・名前・価値 を集約済み。ここは持ち上げて操作パネルを出すだけ。
  $('#gcard-wrap').classList.add('lift');
  $('#gresult').classList.add('on');
}

/* ===================================================================
 * 10連ガチャ
 * =============================================================== */

// モックの重み付きランダム抽選。本番の抽選ロジックではない（外注実装）
function drawMany(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(drawCard(DETAIL_PACK.cards));
  return out;
}

// 最高 value のカードのインデックスを返す
function bestIndex(cards) {
  let bi = 0;
  for (let i = 1; i < cards.length; i++) if (cards[i].value > cards[bi].value) bi = i;
  return bi;
}

function startGacha10() {
  gachaMode = 'multi';
  const token = ++gachaToken;
  const ov = $('#gacha-ov');
  ov.classList.add('show');
  fitCanvas();
  resetStage();
  // 10連は結果グリッドを使う。単発カードは隠す
  $('#gcard-wrap').style.display = 'none';
  $('#gresult').classList.remove('on');
  startLoop();

  CURRENT_CARDS = drawMany(10);

  // (A) チャージ：単発より強め（収束スパークを多めに）
  $('#charge').classList.add('on');
  $('#charge').classList.add('boost');
  spawning = 'converge';

  // (B) 収束フラッシュ → (C) 一気開封
  setTimeout(() => {
    if (token !== gachaToken) return;
    spawning = false;
    $('#flash').className = 'flash fire';
    $('#charge').classList.remove('on', 'boost');
    setTimeout(() => { if (token === gachaToken) reveal10(token); }, 300);
  }, 1900);
}

function reveal10(token) {
  const cards = CURRENT_CARDS;
  const bi = bestIndex(cards);
  const best = cards[bi];
  const cls = RARITY[best.rarity].cls;

  // 最高レアのオーラ・光柱
  $('#aura').className = `aura on ${cls}`;
  if (best.rarity === 'SSR' || best.rarity === 'SR') {
    const beams = $('#beams');
    beams.className = 'beams on';
    beams.innerHTML = Array.from({ length: 14 }, (_, i) =>
      `<span class="beam" style="transform:rotate(${i * 25.7}deg); background:linear-gradient(${cls === 'ssr' ? 'var(--gold)' : 'var(--purple)'}, transparent)"></span>`).join('');
  }

  renderR10Grid(cards, bi);
  $('#r10-result').classList.add('on');

  // 最高レア演出：BEST のレア度で強めの紙吹雪（SSRなら最大量）
  burst(best.rarity);
  if (best.rarity === 'SSR') setTimeout(() => burst('SSR'), 180);
}

function renderR10Grid(cards, bi) {
  const total = cards.reduce((s, c) => s + c.value, 0);
  const grid = $('#r10-result .r10-grid');
  grid.innerHTML = cards.map((c, i) => {
    const cls = RARITY[c.rarity].cls;
    const isBest = i === bi;
    return `<div class="r10-cell ${cls} ${isBest ? 'r10-best' : ''}">
      ${isBest ? '<span class="r10-best-badge">BEST</span>' : ''}
      <div class="r10-face"></div>
      <div class="r10-info">
        <span class="rb ${cls}">${c.rarity}</span>
        <div class="r10-name">${c.name}</div>
        <div class="r10-val">${fmt(c.value)} pt</div>
      </div>
    </div>`;
  }).join('');
  $('#r10-total-val').textContent = `${fmt(total)} pt`;
}

/* スキップ：最終状態まで一気に飛ばす */
function skipGacha() {
  if (gachaMode === 'multi') return skipGacha10();
  if (!CURRENT_CARD) return;
  const token = ++gachaToken;     // 進行中タイマーを無効化
  spawning = false;
  resetStage();
  $('#gcard-wrap').style.display = '';
  const card = CURRENT_CARD;
  const cls = RARITY[card.rarity].cls;
  $('#aura').className = `aura on ${cls}`;
  $('#gfront').className = `gface gfront ${cls}`;
  $('#gfront').innerHTML = `
    <span class="rb ${cls}">${card.rarity}</span>
    <span class="gfront-name">${card.name}</span>
    <span class="gfront-val">${fmt(card.value)} pt</span>`;
  $('#gcard-wrap').classList.add('on');
  $('#gcard').classList.add('flip');
  showResult(card);
}

/* 10連スキップ：結果グリッドへ一気に飛ばす */
function skipGacha10() {
  if (!CURRENT_CARDS) return;
  const token = ++gachaToken;
  spawning = false;
  resetStage();
  $('#gcard-wrap').style.display = 'none';
  const cards = CURRENT_CARDS;
  const bi = bestIndex(cards);
  const cls = RARITY[cards[bi].rarity].cls;
  $('#aura').className = `aura on ${cls}`;
  renderR10Grid(cards, bi);
  $('#r10-result').classList.add('on');
}

function closeGacha() {
  gachaToken++;
  spawning = false;
  stopLoop();
  $('#gacha-ov').classList.remove('show');
  resetStage();
  $('#gcard-wrap').style.display = '';
  CURRENT_CARD = null;
  CURRENT_CARDS = null;
}

/* ---------- canvas パーティクル ---------- */
function startLoop() { if (!rafId) loop(); }
function stopLoop() { cancelAnimationFrame(rafId); rafId = null; }

const RARITY_COLORS = {
  SSR: ['#ffcc33', '#ff7ad1', '#b06bff', '#22e3ff'],
  SR:  ['#b06bff', '#d6a8ff', '#ffffff'],
  R:   ['#3aa0ff', '#9ed0ff', '#ffffff'],
  N:   ['#8b90b5', '#cfd3e8'],
};

function burst(rarity) {
  const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2;
  const colors = RARITY_COLORS[rarity];
  const n = rarity === 'SSR' ? 160 : rarity === 'SR' ? 100 : rarity === 'R' ? 60 : 30;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 3 + Math.random() * (rarity === 'SSR' ? 11 : 7);
    particles.push({
      x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2,
      g: 0.12, life: 1, decay: 0.008 + Math.random() * 0.01,
      size: 3 + Math.random() * 4, color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, kind: 'confetti',
    });
  }
}

function spawnConverge() {
  const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2;
  const R = Math.max(canvas.clientWidth, canvas.clientHeight) * 0.55;
  const a = Math.random() * Math.PI * 2;
  const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
  particles.push({
    x, y, tx: cx, ty: cy, life: 1, decay: 0.02,
    size: 1.5 + Math.random() * 2.5, color: Math.random() < 0.5 ? '#22e3ff' : '#b06bff',
    kind: 'spark',
  });
}

function loop() {
  rafId = requestAnimationFrame(loop);
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  if (spawning === 'converge') for (let i = 0; i < 4; i++) spawnConverge();

  particles = particles.filter((p) => p.life > 0);
  for (const p of particles) {
    if (p.kind === 'spark') {
      // 中心へ加速しながら収束
      p.x += (p.tx - p.x) * 0.06; p.y += (p.ty - p.y) * 0.06;
      p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 12; ctx.shadowColor = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
    } else {
      // confetti
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8; ctx.shadowColor = p.color;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
}

window.addEventListener('resize', () => { if (canvas && $('#gacha-ov').classList.contains('show')) fitCanvas(); });
