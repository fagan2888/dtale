import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { ModalBody } from "react-modal-bootstrap";
import Select, { createFilter } from "react-select";

const BASE_STATE = { col: null, operation: "cut", bins: null, labels: null };

class CreatBins extends React.Component {
  constructor(props) {
    super(props);
    this.state = _.assignIn({}, BASE_STATE);
    this.updateState = this.updateState.bind(this);
  }

  updateState(state) {
    const currState = _.assignIn(this.state, state);
    const cfg = _.pick(currState, ["operation", "bins", "labels"]);
    cfg.col = _.get(currState, "col.value") || null;
    this.setState(currState, () => this.props.updateState({ cfg }));
  }

  render() {
    const columnOptions = _.map(this.state.columns || [], ({ name }) => ({
      name,
    }));
    return (
      <ModalBody>
        <div className="form-group row">
          <label className="col-md-4 col-form-label text-right">Column</label>
          <div className="col-md-6">
            <div className="input-group mr-3">
              <Select
                className="Select is-clearable is-searchable Select--single"
                classNamePrefix="Select"
                options={_.sortBy(columnOptions, o => _.toLower(o.value))}
                getOptionLabel={_.property("value")}
                getOptionValue={_.property("value")}
                value={this.state.col}
                onChange={selected => this.updateState({ col: selected })}
                noOptionsText={() => "No columns found"}
                isClearable
                filterOption={createFilter({ ignoreAccents: false })} // required for performance reasons!
              />
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-4 col-form-label text-right">Operation</label>
          <div className="col-md-6">
            <div className="btn-group">
              {_.map(
                [
                  ["cut", "Cut (Evenly Spaced)"],
                  ["qcut", "Qcut (Evenly Sized)"],
                ],
                ([operation, label]) => {
                  const buttonProps = { className: "btn btn-primary" };
                  if (operation === this.state.operation) {
                    buttonProps.className += " active";
                  } else {
                    buttonProps.className += " inactive";
                    buttonProps.onClick = () => this.updateState({ operation });
                  }
                  return (
                    <button key={operation} {...buttonProps}>
                      {label}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-4 col-form-label text-right">Bins</label>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control text-center"
              value={this.state.bins}
              onChange={e => this.updateState({ bins: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-4 col-form-label text-right">Labels</label>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              value={this.state.labels}
              onChange={e => this.updateState({ labels: e.target.value })}
            />
          </div>
        </div>
      </ModalBody>
    );
  }
}
CreatBins.displayName = "CreatBins";
CreatBins.propTypes = {
  updateState: PropTypes.func,
  columns: PropTypes.array,
};

export default CreatBins;
