import React from 'react';
import Radium from 'radium';
import Color from 'color';
import { css, PropTypes } from '../util';


/**
 * The text label for an empty collection.
 */
class EmptyLabel extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    weight: PropTypes.numberOrString,
    size: PropTypes.numberOrString,
    italic: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    children: PropTypes.node,
  };
  static defaultProps = {
    color: Color('white').darken(0.3).hexString(),
    weight: 300,
    size: 13,
    italic: false,
    align: 'center',
  };

  styles() {
    return css({
      base: {
        fontSize: this.props.size,
        fontStyle: this.props.italic && 'italic',
        color: this.props.color,
        fontWeight: this.props.weight,
        textAlign: this.props.align,
      },
    });
  }

  render() {
    const styles = this.styles();
    return (
      <div style={ styles.base }>{ this.props.children }</div>
    );
  }
}


export default Radium(EmptyLabel);
