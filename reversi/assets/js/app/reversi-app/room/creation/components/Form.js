import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { REQUEST_STATUS } from '../../modules';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentConfigs: {
        roomName: '',
        maxSpectator: '',
        password: '',
        isSpectator: false
      },
      fieldValidationResult: {
        hasError: false,
        errorMsg: ''
      }
    };
    this.props.initializeState();
    this.onClickButton = this.onClickButton.bind(this);
    this.presentError = this.presentError.bind(this);
    this.checkRequestStatus = this.checkRequestStatus.bind(this);
    this.checkValidationErrorExistence = this.checkValidationErrorExistence.bind(
      this
    );
  }

  componentDidUpdate() {
    this.checkRequestStatus();
  }

  onClickButton() {
    if (this.checkValidationErrorExistence()) {
      return;
    }
    this.props.onSendCreateRoom(this.state.currentConfigs);
    this.setState({
      fieldValidationResult: {
        hasError: false,
        errorMsg: ''
      },
      currentConfigs: {
        roomName: '',
        maxSpectator: '',
        password: '',
        isSpectator: false
      }
    });
  }

  checkValidationErrorExistence() {
    const { isSpectator, maxSpectator, roomName } = this.state.currentConfigs;
    if (roomName === '') {
      this.setState({
        fieldValidationResult: {
          hasError: true,
          errorMsg: '部屋名が入力されていません。'
        }
      });
      return true;
    }
    if (maxSpectator === '') {
      this.setState({
        fieldValidationResult: {
          hasError: true,
          errorMsg: '観戦者定員が入力されていません。'
        }
      });
      return true;
    }
    if (
      maxSpectator !== '' &&
      (Number(maxSpectator) < 0 || !Number.isInteger(Number(maxSpectator)))
    ) {
      this.setState({
        fieldValidationResult: {
          hasError: true,
          errorMsg: '観戦者定員に負の数・小数は指定できません。'
        }
      });
      return true;
    }
    if (maxSpectator === '0' && isSpectator) {
      this.setState({
        fieldValidationResult: {
          hasError: true,
          errorMsg: '観戦者定員が0人のため、観戦者モードで入室できません。'
        }
      });
      return true;
    }
    return false;
  }

  presentError() {
    if (this.props.requestStatus.status === REQUEST_STATUS.FAIL) {
      return (
        <div className="alert alert-danger">
          {this.props.requestStatus.errMsg}
        </div>
      );
    }
    if (this.state.fieldValidationResult.hasError) {
      return (
        <div className="alert alert-danger">
          {this.state.fieldValidationResult.errorMsg}
        </div>
      );
    }
    return <div />;
  }

  checkRequestStatus() {
    if (this.props.requestStatus.status === REQUEST_STATUS.SUCCESS) {
      this.props.history.push('/game');
    }
  }

  render() {
    const changeConfigs = changedConfig => {
      this.setState(Object.assign(this.state.currentConfigs, changedConfig));
    };
    const { currentConfigs } = this.state;
    return (
      <React.Fragment>
        <p>対戦部屋を作成します。必要項目を入力してください。</p>
        <p>部屋を作成すると、作成した部屋に自動的に入室します。</p>
        <p>パスワードを空欄にすると、パスワード無しで部屋を作成します。</p>
        {this.presentError()}
        <div className="form-group">
          <TextField
            value={currentConfigs.roomName}
            className="item"
            label="部屋名"
            onChange={e => {
              changeConfigs({ roomName: e.target.value });
            }}
            placeholder="部屋名"
            margin="normal"
          />
        </div>
        <div className="form-group">
          <TextField
            value={currentConfigs.maxSpectator}
            className="item"
            label="観戦者定員"
            type="number"
            onChange={e => {
              changeConfigs({ maxSpectator: e.target.value });
            }}
            placeholder="観戦者定員"
            margin="normal"
          />
        </div>
        <div className="form-group">
          <TextField
            value={currentConfigs.password}
            className="item"
            label="パスワード"
            onChange={e => {
              changeConfigs({ password: e.target.value });
            }}
            placeholder="パスワード"
            margin="normal"
          />
        </div>
        <div className="form-group">
          観戦者モードで入室する。
          <Checkbox
            checked={currentConfigs.isSpectator}
            className="item"
            label="観戦者モードで入室する。"
            onChange={e => {
              changeConfigs({ isSpectator: e.target.checked });
            }}
            margin="normal"
          />
        </div>
        <div>
          <Button
            variant="outlined"
            color="primary"
            className="button"
            onClick={this.onClickButton}
          >
            部屋を作成
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

Form.propTypes = {
  requestStatus: PropTypes.shape({
    errMsg: PropTypes.string,
    status: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  onSendCreateRoom: PropTypes.func.isRequired,
  initializeState: PropTypes.func.isRequired
};
export default Form;
