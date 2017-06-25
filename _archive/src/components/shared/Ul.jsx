import React from 'react';
import Radium from 'radium';
import { PropTypes } from '../util';


/**
 * An unstyled <ul>.
 */
class Ul extends React.Component {
  static propTypes = {
    padding: PropTypes.numberOrString,
    children: PropTypes.node,
  };
  static defaultProps = {
    padding: 0,
  };

  styles() {
    return {
      base: {
        margin: 0,
        padding: this.props.padding,
        listStyleType: 'none',
      },
    };
  }

  render() {
    const styles = this.styles();
    return (
      <ul style={ styles.base }>{ this.props.children }</ul>
    );
  }
}

export default Radium(Ul);
