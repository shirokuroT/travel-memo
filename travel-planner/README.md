# Travel Memo

旅行の計画を登録・編集・削除し、日程ごとのメモを管理できるReactアプリです。

## プロジェクト概要

このアプリは、旅行ごとにタイトル・日程・メモページを持つ旅行管理ツールとして構成されています。

- 旅行の新規作成
- 既存旅行の編集
- 旅行の削除
- 日程ごとのページ生成
- 各ページでのリッチテキストメモ作成
- ブラウザの localStorage への保存

## 技術構成

### フロントエンド

- React 19
- TypeScript
- Vite

### ルーティング

- react-router-dom
  - `/` : 旅行一覧画面
  - `/trip/:id` : 旅行詳細画面

### エディタ

- Tiptap
  - @tiptap/react
  - @tiptap/starter-kit
- 日程ごとのメモ入力には Tiptap のエディタを利用しています。

### 状態管理・永続化

- カスタムフック `useTrips` で旅行データを管理
- `localStorage` に JSON 形式で保存し、ページ再読み込み後もデータを保持

### 開発ツール

- ESLint
- TypeScript
- Vite Dev Server / Build

## 主要ディレクトリ

```text
travel-planner/
├── public/
├── src/
│   ├── components/
│   │   ├── TiptapEditor.tsx
│   │   ├── TripDetail.tsx
│   │   ├── TripForm.tsx
│   │   └── TripList.tsx
│   ├── hooks/
│   │   └── useTrips.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── TripPage.tsx
│   ├── types/
│   │   └── Trip.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── assets/
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

## 開発手順

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## 補足

- 画面の遷移は `react-router-dom` を使用しています。
- 旅行のメモは HTML 形式で保持され、 Tiptap が表示・編集を担当しています。
- 現在の実装では、保存先はブラウザの `localStorage` であり、バックエンドは実装されていません。
