# 🎯 高機能カンバンボード

最新のフロントエンド技術を使用したエンタープライズレベルのタスク管理アプリケーション

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ 主要機能

### 🎮 直感的な操作
- **ドラッグ&ドロップ**: スムーズなタスク移動・並び替え
- **レスポンシブデザイン**: デスクトップ・モバイル対応
- **削除確認**: 誤操作防止の安全設計

### 🏗️ 柔軟なワークフロー管理
- **動的カラム**: 自由なステータス追加・編集・削除
- **カラムカスタマイズ**: カラー設定、位置管理
- **プロジェクト適応**: チーム固有のワークフローに対応

### 🔍 高度な検索・フィルター
- **リアルタイム検索**: タイトル・説明文での即座検索
- **優先度フィルター**: 高・中・低での絞り込み
- **タグフィルター**: 動的ラベルでの分類・検索
- **アーカイブ表示**: 完了タスクの切り替え表示

### 📋 詳細なタスク管理
- **期限設定**: 日付指定とビジュアル表示
- **動的タグ**: カラフルなラベルで自由分類
- **チェックリスト**: サブタスクの進捗管理
- **進捗表示**: チェックリスト完了率の可視化
- **優先度管理**: 視覚的な優先度表示

### 💾 データ永続化
- **ローカルストレージ**: ブラウザ再起動後もデータ保持
- **状態管理**: Zustand + persist middleware
- **型安全**: TypeScript完全対応

## 🛠️ 技術スタック

### Frontend
- **React 18**: 最新のReact機能を活用
- **TypeScript**: 型安全性とDX向上
- **Vite**: 高速ビルド・開発サーバー

### UI/UX
- **TailwindCSS**: ユーティリティファーストCSS
- **@dnd-kit**: アクセシブルなドラッグ&ドロップ
- **React Icons**: 豊富なアイコンライブラリ

### 状態管理
- **Zustand**: 軽量・シンプルな状態管理
- **Persist Middleware**: データ永続化

### 品質保証
- **Vitest**: 高速テストランナー
- **Testing Library**: コンポーネントテスト
- **ESLint**: コード品質管理

## 🚀 クイックスタート

### 必要環境
- Node.js 18.0.0 以上
- npm または yarn

### インストール & 起動
```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/kanban-app.git
cd kanban-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス

### その他のコマンド
```bash
# プロダクションビルド
npm run build

# テスト実行
npm run test

# テスト（単発実行）
npm run test:run

# リンティング
npm run lint
```

## 📁 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── __tests__/      # コンポーネントテスト
│   ├── KanbanBoard.tsx # メインボード
│   ├── Column.tsx      # カラム
│   ├── TaskCard.tsx    # タスクカード
│   ├── TaskModal.tsx   # タスク編集モーダル
│   └── ...
├── stores/             # 状態管理
│   ├── __tests__/      # ストアテスト
│   └── kanbanStore.ts  # メインストア
├── types/              # TypeScript型定義
│   └── index.ts
└── test/               # テスト設定
    └── setup.ts
```

## 🧪 テスト

包括的なテストスイートを実装:

- **40+ テストケース**: コンポーネント・ストア・統合テスト
- **高いカバレッジ**: 主要機能の網羅的テスト
- **型安全テスト**: TypeScriptでの安全なテスト実装

```bash
# 全テスト実行
npm run test

# 特定テスト実行  
npm run test -- TaskCard

# カバレッジ付きテスト
npm run test:coverage
```

## 🎯 使用方法

### 基本操作
1. **タスク追加**: 各カラムの「+」ボタンをクリック
2. **タスク移動**: ドラッグ&ドロップで自由移動
3. **タスク編集**: タスクカードの鉛筆アイコンをクリック
4. **タスク削除**: ゴミ箱アイコンで安全削除

### 高度な機能
- **カラム管理**: カラムヘッダーの「⋯」メニューから編集・削除
- **検索**: ヘッダーの検索ボックスでリアルタイム検索
- **フィルタ**: 優先度・タグでの絞り込み表示
- **アーカイブ**: 完了タスクの表示切り替え

## 🔧 カスタマイズ

### 新機能追加
- `src/types/index.ts`: 型定義拡張
- `src/stores/kanbanStore.ts`: 状態管理ロジック
- `src/components/`: 新コンポーネント追加

### スタイリング
- `tailwind.config.js`: TailwindCSS設定
- カラーパレット・レスポンシブ設定の変更

## 🤝 コントリビューション

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

MIT License - 自由に使用・改変・配布可能

## 🙏 謝辞

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [@dnd-kit](https://dndkit.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

⭐ このプロジェクトが役に立った場合は、ぜひスターをお願いします！