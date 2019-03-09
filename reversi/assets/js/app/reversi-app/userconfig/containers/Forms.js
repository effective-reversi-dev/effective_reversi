import { connect } from 'react-redux';
import { userConfigActions } from '../modules';
import Forms from '../components/Forms';

const { requestChange } = userConfigActions;

const mapStateToProps = state => ({
    requestStatus: state.userConfig.userConfig.requestStatus,
});

const mapDispatchToProps = dispatch => ({
    onSendUserInfoChange: currentConfigs => {
        dispatch(requestChange(currentConfigs));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Forms);
