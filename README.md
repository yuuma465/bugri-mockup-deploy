# BUGRI（バグリ）— ビジュアルモックアップ

オリパ（オンラインくじ）サイト **BUGRI（バグリ）** のデザインモックアップ。
キャッチコピー: **「バグってるほど、アツい。」** ／ ブランド: ORIPA REVOLUTION。
ダミーデータで動く静的フロント（HTML + CSS + 最小JS）。**サーバ通信なし**。

## 公開URL（Vercel）
- 本番: **https://bugri-mockup.vercel.app**
- Vercel プロジェクト: `yuuma465s-projects/bugri-mockup`（静的配信・ビルドなし）
- 再デプロイ: `npx vercel deploy --prod --yes --cwd <このmockupの絶対パス>`

> ⚠️ これはビジュアル確認用のモックです。バックエンド・DB・決済・抽選ロジックは外注実装。
> 既存の `app.py` 等の Flask 実装とは独立しており、影響しません。

## 開き方
ブラウザでファイルを直接開くだけ（ビルド不要）。

```
mockup/index.html        ← トップ（オリパ一覧）から開始
```

```bash
open mockup/index.html
# またはローカルサーバ
cd mockup && python3 -m http.server 8000   # → http://localhost:8000
```

## 画面一覧
| ファイル | 画面 | 内容 |
|---|---|---|
| `index.html`    | オリパ一覧 | バナー／カテゴリタブ／ソート／オリパグリッド（各カードに **1回 / 10連** ボタン）／当選報告 |
| `detail.html`   | オリパ詳細＋ガチャ演出 | 価格／在庫／確率表／排出カード一覧／**「ガチャを引く」＋「10連を引く」** ／開封演出（単発・10連） |
| `mypage.html`   | マイページ | ランクバッジ＋次ランク進捗／統計カード3つ／タブ（コレクション・履歴） |
| `point.html`    | ポイント購入 | 保有pt／購入プラン5種（ボーナス還元）／購入ボタン（見た目のみ） |
| `login.html`    | ログイン | ダークネオンのフォーム |
| `register.html` | 新規登録 | 新規登録ボーナス（500pt）強調フォーム |

### ガチャ演出
- **単発**: チャージ（エネルギーオーブ）→ 収束フラッシュ → カードフリップ → レア度別オーラ＋光柱＋紙吹雪 → 結果。
- **10連**: チャージ強め → 10枚一気開封 → 結果を **5×2グリッド** でまとめ表示、最高レアを **BEST** バッジ＋金枠で強調、合計資産表示。
- どちらも右上「スキップ」で結果まで一気にジャンプ可能。

## ブランド／デザイン
**BUGRI = ZONe（ダークネオンSF）× DOPA（オリパ導線）× レア度トークン**

- ロゴ／favicon: `assets/img/bugri-logo.png`（明るいBUGRIキーアート）と `assets/img/bugri-wordmark.png`（ヘッダー用ワードマーク）
- 背景: `assets/img/bugri-bg.png`（白ベースのサイバーHUD背景）＋ ダークティント
- ネオン: シアン `#22e3ff` / ブルー `#3aa0ff` / パープル `#b06bff` ／ 価格・強調: ゴールド `#ffcc33`
- レア度: **SSR=虹色ホロ** / SR=パープル / R=ブルー / N=グレー（高レアほど演出が派手）
- ランク: BRONZE / SILVER / GOLD / PLATINUM / DIAMOND（色・発光を変えたバッジ）
- 共通UI: 上部ヘッダーナビ（PC）＋ 下部ナビ（モバイル）で全6ページを統一

## ファイル構成
```
mockup/
├─ index.html / detail.html / mypage.html / point.html / login.html / register.html
├─ assets/
│  ├─ img/bugri-bg.png          全体背景
│  ├─ img/bugri-logo.png        ブランドキーアート（favicon）
│  ├─ img/bugri-wordmark.png    ヘッダーロゴ
│  ├─ css/style.css             デザインシステム＋全画面スタイル（単一ファイル）
│  │   ├─ [A] ブランド統合・共通土台（ロゴ/ナビ/ランク/タブ/フォーム）
│  │   ├─ [B] 10連・カードボタン
│  │   ├─ [C] mypage / point
│  │   └─ [D] 認証ページ
│  └─ js/
│     ├─ data.js               ダミーデータ（パック・カード・当選報告・プロフィール・コレクション・履歴）
│     └─ app.js                一覧/詳細の描画＋ガチャ演出（単発・10連）
└─ README.md
```
※ mypage / point / login / register のページ固有JSは各HTML内のインライン `<script>`。

## 差し替えポイント（本番連携時）
- `data.js` の `ORIPA_PACKS` / `WIN_FEED` / `USER_POINTS` / `USER_PROFILE` / `COLLECTION` / `HISTORY` → バックエンドAPIのレスポンスに置換
- `drawCard()` / `drawMany()`（モックの重み付き抽選）→ 外注の抽選エンジンの結果を受け取る形に置換
- カードのサムネ・カード画像: 現在は画像が無いため **白ベース（NO IMAGE）** プレースホルダ。本番は実画像URLを差し込み
- 認証・決済・購入ボタン: 見た目のみ。実処理は外注実装に接続
