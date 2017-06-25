import React from 'react';
import Radium from 'radium';
import Immutable from 'immutable';
import Color from 'color';
import { css, PropTypes } from '../util';
import { Ellipsis, FormattedText } from '../shared';
import api from '../../shared/api-internal';


/**
 * A single spec within the index list.
 */
class SpecListItem extends React.Component {
  static propTypes = {
    spec: PropTypes.object.isRequired,
    current: PropTypes.instanceOf(Immutable.Map).isRequired,
  };
  static defaultProps = {};

  invokeCount() {
    const { spec, current } = this.props;
    const specInvokeCount = current ? current.get('specInvokeCount') : {};
    return specInvokeCount
              ? specInvokeCount[spec.id] || 0
              : 0;
  }

  styles() {
    return css({
      base: {
        position: 'relative',
        cursor: 'pointer',
        background: this.state.isOver ? 'rgba(0, 0, 0, 0.03)' : 'none',
      },
      name: {
        color: Color('white').darken(0.5).hexString(),
        fontSize: 14,
        lineHeight: '28px',
        paddingLeft: 28,
      },
      bullet: {
        Absolute: '11 null null 13',
        width: 6,
        height: 6,
        background: this.invokeCount() === 0 ? 'rgba(0, 0, 0, 0.22)' : '#4A90E2', // BLUE
        borderRadius: 3,
      },
    });
  }

  invoke() {
    api.invokeSpec(this.props.spec);
  }

  handleMouseEnter = () => { this.setState({ isOver: true }); };
  handleMouseLeave = () => { this.setState({ isOver: false }); };
  handleClick = () => { this.invoke(); };

  render() {
    const styles = this.styles();
    const { spec } = this.props;
    return (
      <li
        style={ styles.base }
        onMouseEnter={ this.handleMouseEnter }
        onMouseLeave={ this.handleMouseLeave }
        onClick={ this.handleClick }>

        <div style={ styles.bullet } />
        <div style={ styles.name }>
          <Ellipsis>
            <FormattedText>{ spec.name }</FormattedText>
          </Ellipsis>
        </div>
      </li>
    );
  }
}

export default Radium(SpecListItem);
