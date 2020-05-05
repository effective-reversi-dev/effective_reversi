import React from 'react';
import PropTypes from 'prop-types';

const GameInfo = props => {
  const items = props.information.map(info => {
    let paragraph;
    const { messages } = info;
    messages.forEach(message => {
      paragraph = (
        <React.Fragment>
          {paragraph} <p>{message}</p>
        </React.Fragment>
      );
    });
    const balloon = (
      <div>
        <div className="balloon-body">
          <div className="balloon-content">{paragraph}</div>
        </div>
      </div>
    );
    return (
      <div className="balloon" key={info.id}>
        {balloon}
      </div>
    );
  });
  return (
    <div className="game-info">
      <div className="tracks">{items}</div>
    </div>
  );
};

GameInfo.propTypes = {
  information: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default GameInfo;
