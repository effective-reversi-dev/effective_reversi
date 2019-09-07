import React from 'react';
import { Link } from 'react-router-dom';

const Links = () => {
  return (
    <ul>
      <li>
        <Link to="/">TopPage</Link>
      </li>
      <li>
        <Link to="/room_selection">Game</Link>
      </li>
      <li>
        <Link to="/config">Setting</Link>
      </li>
      {/* 下記リンクではログアウトするためにServer側にHttpリクエストを送出したい。故にアンカータグ */}
      <li>
        <a href="/users/logout">Logout</a>
      </li>
    </ul>
  );
};

export default Links;
