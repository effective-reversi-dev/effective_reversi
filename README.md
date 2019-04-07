# Effective Reversi
Effective Reversiはリバーシアプリの名称、およびその開発を目的としたプロジェクト名です。

環境の構築方法や開発規約、使用しているライブラリについてはScrapboxをご参照ください。

ソースコードは<b>effective_reversi/reversi</b>ディレクトリにあります。

なお、下記でセットアップや変更反映等々を説明しますが、すべて<b>effective_reversi/reversi</b>ディレクトリで行うことを前提にしています。

### セットアップ
環境構築を一通り終えたら、データベースマイグレーションを以下の手順で行ってください。

- マイグレーションファイルを作成：`pipenv run python manage.py makemigrations`
- マイグレーションする：`pipenv run python manage.py migrate`

### 変更反映
他の開発者によるライブラリやデータベース構成の変更は以下の手順でローカルに反映できます。

- サーバサイドのライブラリ変更の反映：`pipenv install --dev`
- クライアントサイドのライブラリ変更の反映：`npm install` `npm install --only=dev`
- データベース構成の変更の反映：`db.sqlite3`を削除して`pipenv run python manage.py migrate`

### テスト
テストをローカルで行うときは、以下の手順で行うことができます。

リモートに反映する時、特にプルリクエストを投げるときには必ずテストが通ることを確認してください。

- サーバサイド(django)のテスト：`pipenv run python manage.py test`
- クライアントサイドのテスト：`npm run test`
- クライアントサイドのテスト（ウォッチモード）：`npm run test:watch`

### フォーマット
JSファイルのフォーマットは、以下のようにして行うことができます。

リモートへの反映、特にプルリクエストを投げるのは必ず整形してからにしてください。

- 全てのファイルに対してのフォーマット： `npm run format`

各ファイルに対してのフォーマットを行いたいときは、以下の手順で行ってください。（VSCodeでの開発を前提とする）

- VSCodeのマーケットプレイスで、プラグイン`Prettier Code - formatter`をインストール
- 対象のファイルで`Control + Alt + f`

(`pipenv run python ...`のコマンドは`pipenv shell` + `python ...`でも可)
