import { Link } from 'react-router-dom';
import React from 'react';
import Form from './containers/Form';

const RoomCreation = () => {
  return (
    <div className="container">
      <h1 className="text-center logo my-4">Effective Reversi</h1>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-10 col-sm-12">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">部屋作成</h3>
              <Form />
            </div>
          </div>
          <div className="text-center py-2">
            <small>
              <Link to="/" className="text-muted">
                Topへ戻る
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCreation;
