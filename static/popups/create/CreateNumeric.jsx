import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { ModalBody } from "react-modal-bootstrap";
import Select, { createFilter } from "react-select";

const BASE_STATE = {
  left: { type: "col", col: null, val: null },
  operation: null,
  right: { type: "col", col: null, val: null },
};

class CreateNumeric extends React.Component {
  constructor(props) {
    super(props);
    this.state = _.assign({}, BASE_STATE);
    this.updateState = this.updateState.bind(this);
    this.renderOperand = this.renderOperand.bind(this);
  }

  updateState(state) {
    const currState = _.assignIn(this.state, state);
    const { operation } = currState;
    const left = { type: currState.left.type },
      right = { type: currState.right.type };
    if (left.type === "col") {
      left.col = _.get(currState, "left.col.value") || null;
    } else {
      left.val = currState.left.val;
    }
    if (right.type === "col") {
      right.col = _.get(currState, "right.col.value") || null;
    } else {
      right.val = currState.right.val;
    }
    this.setState(currState, () => this.props.updateState({ cfg: { left, operation, right } }));
  }

  renderOperand(prop, otherProp) {
    const { col, type, val } = this.state[prop];
    let input = null;
    if (type === "col") {
      const columns = _.map(this.state.columns || [], ({ name }) => ({ name }));
      const otherOperand = this.state[otherProp];
      const otherCol = otherOperand.type === "col" ? otherOperand.col : null;
      const finalOptions = _.isNull(otherCol) ? columns : _.reject(columns, otherCol);
      input = (
        <div className="input-group mr-3">
          <Select
            className="Select is-clearable is-searchable Select--single"
            classNamePrefix="Select"
            options={_.sortBy(finalOptions, o => _.toLower(o.value))}
            getOptionLabel={_.property("value")}
            getOptionValue={_.property("value")}
            value={col}
            onChange={selected =>
              this.updateState({
                [prop]: _.assign({}, this.state[prop], { col: selected }),
              })
            }
            noOptionsText={() => "No columns found"}
            isClearable
            filterOption={createFilter({ ignoreAccents: false })} // required for performance reasons!
          />
        </div>
      );
    } else {
      const onChange = e => {
        let finalVal = null;
        if (e.target.value && parseFloat(e.target.value)) {
          finalVal = parseFloat(e.target.value);
        }
        this.updateState({
          [prop]: _.assign({}, this.state[prop], { val: finalVal }),
        });
      };
      input = (
        <div className="input-group mr-3">
          <input type="text" className="form-control text-center" value={val} onChange={onChange} />
        </div>
      );
    }
    return (
      <div className="form-group row">
        <div className="col-md-4 text-right">
          <div className="btn-group">
            {_.map(["col", "val"], t => {
              const buttonProps = { className: "btn" };
              if (t === type) {
                buttonProps.className += " btn-primary active";
              } else {
                buttonProps.className += " btn-primary inactive";
                buttonProps.onClick = () =>
                  this.updateState({
                    [prop]: _.assign({}, this.state[prop], { type: t }),
                  });
              }
              return (
                <button key={`${prop}-${t}`} {...buttonProps}>
                  {_.capitalize(t)}
                </button>
              );
            })}
          </div>
        </div>
        <div className="col-md-6">{input}</div>
      </div>
    );
  }

  render() {
    return (
      <ModalBody>
        <div className="form-group row">
          <label className="col-md-4 col-form-label text-right">Operation</label>
          <div className="col-md-6">
            <div className="btn-group">
              {_.map(["sum", "difference", "multiply", "divide"], operation => {
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
        {this.renderOperand("left", "right")}
        {this.renderOperand("right", "left")}
      </ModalBody>
    );
  }
}
CreateNumeric.displayName = "CreateNumeric";
CreateNumeric.propTypes = {
  updateState: PropTypes.func,
  columns: PropTypes.array,
};

export default CreateNumeric;
