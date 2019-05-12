import React from 'react';
import Links from './components/Links';

const TopPage = () => {
  return (
    <div className="container">
      <h1 className="text-center logo my-4">Effective Reversi</h1>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">メインメニュー</h3>
              <Links />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPage;
