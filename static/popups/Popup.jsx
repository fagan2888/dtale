import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalClose, ModalHeader, ModalTitle } from "react-modal-bootstrap";
import { connect } from "react-redux";

import ConditionalRender from "../ConditionalRender";
import { closeChart } from "../actions/charts";
import About from "./About";
import { Correlations } from "./Correlations";
import { Describe } from "./Describe";
import { Histogram } from "./Histogram";
import Instances from "./Instances";
import { Charts } from "./charts/Charts";
import { CreateColumn } from "./create/CreateColumn";

class ReactPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: "" };
  }

  shouldComponentUpdate(newProps) {
    if (!_.isEqual(this.props, newProps)) {
      return true;
    }

    // Otherwise, use the default react behaviour.
    return false;
  }

  render() {
    let modalTitle = null;
    let body = null;
    const { chartData } = this.props;
    const { type, title, visible, size, backdrop } = chartData;
    const onClose = () => this.props.onClose({ size: size || "modal-lg" });
    switch (type) {
      case "histogram":
        modalTitle = (
          <ModalTitle>
            <i className="ico-equalizer" />
            {" Histogram for "}
            <strong>{chartData.selectedCol}</strong>
            <div id="describe" />
          </ModalTitle>
        );
        body = <Histogram />;
        break;
      case "correlations":
        modalTitle = (
          <ModalTitle>
            <i className="ico-bubble-chart" />
            <strong>{title}</strong>
          </ModalTitle>
        );
        body = <Correlations propagateState={this.props.propagateState} />;
        break;
      case "describe":
        modalTitle = (
          <ModalTitle>
            <i className="ico-view-column" />
            <strong>{"Describe"}</strong>
          </ModalTitle>
        );
        body = <Describe onClose={onClose} />;
        break;
      case "build":
        modalTitle = (
          <ModalTitle>
            <i className="ico-build" />
            <strong>{"Build Column"}</strong>
          </ModalTitle>
        );
        body = <CreateColumn onClose={onClose} />;
        break;
      case "about":
        modalTitle = (
          <ModalTitle>
            <i className="fa fa-info-circle la-lg" />
            <strong>{"About"}</strong>
          </ModalTitle>
        );
        body = <About />;
        break;
      case "instances":
        modalTitle = (
          <ModalTitle>
            <i className="ico-apps" />
            <strong>{"Active D-Tale Instances"}</strong>
          </ModalTitle>
        );
        body = <Instances {...this.props} />;
        break;
      case "charts":
        modalTitle = (
          <ModalTitle>
            <i className="ico-show-chart" />
            <strong>Chart Builder</strong>
          </ModalTitle>
        );
        body = <Charts />;
        break;
      default:
        break;
    }
    return (
      <Modal
        {...{
          isOpen: visible,
          onRequestHide: onClose,
          size: size || "modal-lg",
          backdrop: backdrop || false,
        }}>
        <ModalHeader>
          {modalTitle}
          <ModalClose onClick={onClose} />
        </ModalHeader>
        <ConditionalRender display={_.get(this.props, "chartData.visible")}>{body}</ConditionalRender>
      </Modal>
    );
  }
}
ReactPopup.displayName = "Popup";
ReactPopup.propTypes = {
  onClose: PropTypes.func,
  dataId: PropTypes.string.isRequired,
  chartData: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    type: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    backdrop: PropTypes.bool,
    selectedCol: PropTypes.string,
  }),
  propagateState: PropTypes.func,
};

const ReduxPopup = connect(
  state => _.pick(state, ["dataId", "iframe", "chartData"]),
  dispatch => ({ onClose: chartData => dispatch(closeChart(chartData || {})) })
)(ReactPopup);

export { ReactPopup, ReduxPopup as Popup };
