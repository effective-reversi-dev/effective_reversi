import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Links from './components/Links';
import { userInfoActions } from './modules';

const { getUserInfo } = userInfoActions;

const mapStateToProps = state => ({
  userName: state.userInfo.userInfo.userName
});

const mapDispatchToProps = dispatch => ({
  getUserInfo: () => dispatch(getUserInfo())
});

const TopPage = props => {
  useEffect(() => {
    props.getUserInfo();
  }, []);
  const welcome =
    props.userName === null ? null : (
      <h4 className="text-center logo my-4">
        {`ようこそ、${props.userName}さん`}
      </h4>
    );
  return (
    <div className="container">
      <h1 className="text-center logo my-4">Effective Reversi</h1>
      {welcome}
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

TopPage.defaultProps = {
  userName: ''
};

TopPage.propTypes = {
  userName: PropTypes.string,
  getUserInfo: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopPage);
