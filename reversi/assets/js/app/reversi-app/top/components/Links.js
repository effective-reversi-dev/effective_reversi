import React from 'react';
import { Link } from 'react-router-dom';

const Links = () => {
  return (
    <ul>
      <li>
        <Link to="/">トップページ</Link>
      </li>
      <li>
        <Link to="/room_creation">部屋を新規作成</Link>
      </li>
      <li>
        <Link to="/room_selection">既存の部屋へ入る</Link>
      </li>
      <li>
        <Link to="/config">設定</Link>
      </li>
      {/* 下記リンクではログアウトするためにServer側にHttpリクエストを送出したい。故にアンカータグ */}
      <li>
        <a href="/users/logout">ログアウト</a>
      </li>
    </ul>
  );
};

export default Links;
