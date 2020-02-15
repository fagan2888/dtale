import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { ModalFooter } from "react-modal-bootstrap";
import { connect } from "react-redux";

import { BouncerWrapper } from "../../BouncerWrapper";
import { RemovableError } from "../../RemovableError";
import { buildURLString } from "../../actions/url-utils";
import { fetchJson, fetchJsonPromise, logException } from "../../fetcher";
import { dtypesUrl } from "../Describe";
import CreateBins from "./CreateBins";
import CreateDatetime from "./CreateDatetime";
import CreateNumeric from "./CreateNumeric";

const BASE_STATE = { type: null, name: "", cfg: null, loadingColumns: true };

class ReactCreateColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = _.assign({}, BASE_STATE);
    this.save = this.save.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  componentDidMount() {
    fetchJson(dtypesUrl(this.props.dataId), dtypesData => {
      const newState = { error: null, loadingColumns: false };
      if (dtypesData.error) {
        this.setState({ error: <RemovableError {...dtypesData} /> });
        return;
      }
      newState.columns = dtypesData.dtypes;
      this.setState(newState);
    });
  }

  save() {
    const { name, type, cfg } = this.state;
    const createParams = { name, type, cfg: JSON.stringify(cfg) };
    fetchJsonPromise(buildURLString(`/dtale/create-column/${this.props.dataId}?`, createParams))
      .then(() => {
        if (_.startsWith(window.location.pathname, "/dtale/popup/build")) {
          window.opener.location.reload();
        } else {
          this.props.chartData.propagateState({ triggerResize: true }, this.props.onClose);
        }
      })
      .catch((e, callstack) => {
        logException(e, callstack);
      });
  }

  renderBody() {
    const updateState = state => this.setState(state);
    let body = null;
    switch (this.state.type) {
      case "numeric":
        body = <CreateNumeric columns={this.state.columns} updateState={updateState} />;
        break;
      case "datetime":
        body = <CreateDatetime columns={this.state.columns} updateState={updateState} />;
        break;
      case "bins":
        body = <CreateBins columns={this.state.columns} updateState={updateState} />;
        break;
      // case "string":
      // default:
      //   body = <CreateString columns={this.state.columns} updateState={updateState} />;
      //   break;
    }
    return (
      <div key="body" className="modal-body">
        <div className="form-group row">
          <label className="col-md-4 col-form-label text-right">Column Type</label>
          <div className="col-md-6">
            <div className="btn-group">
              {_.map(["numeric", "bins", "datetime"], (type, i) => {
                const buttonProps = { className: "btn" };
                if (type === this.state.type) {
                  buttonProps.className += " btn-primary active";
                } else {
                  buttonProps.className += " btn-primary inactive";
                  buttonProps.onClick = () => this.setState({ type });
                }
                return (
                  <button key={i} {...buttonProps}>
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-4 col-form-label text-right">Name</label>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control text-center"
              value={this.state.name}
              onChange={e => this.updateState({ name: e.target.value })}
            />
          </div>
        </div>
        {body}
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return (
        <div key="body" className="modal-body">
          {this.state.error}
        </div>
      );
    }
    return [
      <BouncerWrapper key={0} showBouncer={this.state.loadingColumns}>
        {this.renderBody()}
      </BouncerWrapper>,
      <ModalFooter key={1}>
        <button className="btn btn-primary" onClick={this.save}>
          <span>Create</span>
        </button>
      </ModalFooter>,
    ];
  }
}
ReactCreateColumn.displayName = "CreateColumn";
ReactCreateColumn.propTypes = {
  dataId: PropTypes.string.isRequired,
  chartData: PropTypes.shape({
    propagateState: PropTypes.func,
  }),
  onClose: PropTypes.func,
};

const ReduxCreateColumn = connect(({ dataId }) => ({ dataId }))(ReactCreateColumn);
export { ReactCreateColumn, ReduxCreateColumn as CreateColumn };
