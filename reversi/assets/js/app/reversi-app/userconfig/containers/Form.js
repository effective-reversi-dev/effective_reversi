import { connect } from 'react-redux';
import { userConfigActions } from '../modules';
import Form from '../components/Form';

const { requestChange, initializeRequestStatus } = userConfigActions;

const mapStateToProps = state => ({
    requestStatus: state.userConfig.userConfig.requestStatus,
});

const mapDispatchToProps = dispatch => ({
    initializeState: () => {
        dispatch(initializeRequestStatus());
    },
    onSendUserInfoChange: currentConfigs => {
        dispatch(requestChange(currentConfigs));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form);
