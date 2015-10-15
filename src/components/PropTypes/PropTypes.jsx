import R from "ramda";
import React from "react";
import Radium from "radium";
import { css, PropTypes } from "js-util/react";
import { ValueList } from "react-object";
import { EmptyLabel } from "../shared";




/**
 * Renders a visual representation of the PropTypes API.
 */
@Radium
export default class PropTypesComponent extends React.Component {
  styles() {
    return css({
      base: {
        position: "relative",
        paddingTop: 18,
        paddingLeft: 3,
        paddingRight: 3,
        paddingBottom: 10,
      }
    });
  }

  render() {
    const styles = this.styles();
    const { props, propTypes } = this.props;

    const toValueItem = (key) => ({ label: key, value: props[key] });
    const items = R.pipe(
      R.keys,
      R.map(toValueItem),
      R.reject(R.isNil)
    )(propTypes);

    const el = items.length > 0
      ? <ValueList items={ items } collapsedTotal={0} />
      : <EmptyLabel>No PropTypes on component.</EmptyLabel>

    return (
      <div style={ styles.base }>
        { el }
      </div>
    );
  }
}

// API -------------------------------------------------------------------------
PropTypesComponent.propTypes = {
  props: PropTypes.object.isRequired,
  propTypes: PropTypes.object.isRequired,
};
PropTypesComponent.defaultProps = {};
