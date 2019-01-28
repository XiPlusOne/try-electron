import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DiscPlayer from '../components/DiscPlayer';
import * as DiscPlayerActions from '../actions/discPlayer';

const mapStateToProps = ({ discPlayer }) => discPlayer;

const mapDispatchToProps = dispatch =>
  bindActionCreators(DiscPlayerActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscPlayer);
