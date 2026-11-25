# Travel Memo

旅行の予定、日程ごとのメモ、場所やルートへのリンクをまとめて管理する旅行プランナーです。

## 主な機能

- 旅行の作成、編集、削除
- 旅行期間に応じた「共通」ページと日別ページの作成
- Tiptapを使ったリッチテキストメモの編集
- ページごとの場所・ルート・Webサイトのリンク管理
- Googleアカウントでのログイン／ログアウト
- Supabaseへの旅行データ保存

## 技術スタック

| 分類                   | 技術                                                    |
| ---------------------- | ------------------------------------------------------- |
| UI                     | React 19、React DOM                                     |
| 言語                   | TypeScript                                              |
| 開発・ビルド           | Vite 8、`@vitejs/plugin-react`                          |
| ルーティング           | React Router 7                                          |
| リッチテキストエディタ | Tiptap 3（`@tiptap/react`、`@tiptap/starter-kit`）      |
| 認証・データベース     | Supabase（`@supabase/supabase-js`、Google OAuth）       |
| Lint                   | ESLint 10、typescript-eslint、React Hooks ESLint plugin |

旅行データはSupabaseの`trips`テーブルから読み込まれ、変更時に保存されます。現在の実装は旅行データをブラウザーの`localStorage`にも書き出しますが、`localStorage`から復元する処理はありません。

## セットアップ

### 必要な設定

1. Supabaseプロジェクトを用意し、AuthenticationでGoogleログインを有効にします。
2. Supabase SQL Editorで次のテーブルを作成します。

```sql
create table public.trips (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  data jsonb not null
);

alter table public.trips enable row level security;

create policy "Users can manage their own trips"
  on public.trips
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

3. プロジェクトのルートに`.env.local`を作成し、SupabaseのProject URLとpublishable keyを設定します。

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

Supabaseの認証設定で、開発時は`http://localhost:5173`を許可されたリダイレクトURLに追加してください。`.env.local`はGitにコミットしないでください。

### 起動

```bash
npm install
npm run dev
```

## コマンド

```bash
npm run dev      # 開発サーバー
npm run build    # 型チェックと本番ビルド
npm run preview  # 本番ビルドのプレビュー
npm run lint     # ESLint
```

## 画面と構成

- `/` : 旅行一覧と作成・編集
- `/trip/:id` : 旅行の詳細、日別メモ、リンク管理

主な実装は`src/components/`（画面部品）、`src/hooks/useTrips.ts`（旅行データの取得・更新）、`src/lib/`（Supabaseと認証）、`src/pages/`（ページ）にあります。
