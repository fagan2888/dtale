import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { ModalBody } from "react-modal-bootstrap";
import Select, { createFilter } from "react-select";

const BASE_STATE = {
  col: null,
  operation: "property",
  property: null,
  conversion: null,
};

class CreateDatetime extends React.Component {
  constructor(props) {
    super(props);
    this.state = _.assignIn({}, BASE_STATE);
    this.updateState = this.updateState.bind(this);
    this.renderOperationOptions = this.renderOperationOptions.bind(this);
  }

  updateState(state) {
    const currState = _.assignIn(this.state, state);
    const cfg = _.pick(currState, ["operation", currState.operation]);
    cfg.col = _.get(currState, "col.value") || null;
    this.setState(currState, () => this.props.updateState({ cfg }));
  }

  renderOperationOptions() {
    const { operation } = this.state;
    let label = null,
      options = null;
    if (operation === "property") {
      label = "Properties";
      options = ["minute", "hour", "weekday", "month", "quarter", "year"];
    } else {
      label = "Conversions";
      options = ["time", "date", "month_start", "month_end", "quarter_start", "quarter_end", "year_start", "year_end"];
    }
    return (
      <div className="form-group row">
        <label className="col-md-4 col-form-label text-right">{label}</label>
        <div className="col-md-6">
          <div className="btn-group">
            {_.map(options, option => {
              const buttonProps = { className: "btn btn-primary" };
              if (option === this.state[operation]) {
                buttonProps.className += " active";
              } else {
                buttonProps.className += " inactive";
                buttonProps.onClick = () => this.updateState({ [operation]: option });
              }
              return (
                <button key={option} {...buttonProps}>
                  {_.join(_.map(_.split(option, "_"), _.capitalize), " ")}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
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
              {_.map(["property", "conversion"], operation => {
                const buttonProps = { className: "btn" };
                if (operation === this.state.operation) {
                  buttonProps.className += " btn-primary active";
                } else {
                  buttonProps.className += " btn-primary inactive";
                  buttonProps.onClick = () => this.updateState({ operation });
                }
                return (
                  <button key={operation} {...buttonProps}>
                    {_.capitalize(operation)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {this.renderOperationOptions()}
      </ModalBody>
    );
  }
}
CreateDatetime.displayName = "CreateDatetime";
CreateDatetime.propTypes = {
  updateState: PropTypes.func,
  columns: PropTypes.array,
};

export default CreateDatetime;
