import React from 'react';
import Radium from 'radium';
import Immutable from 'immutable';
import Color from 'color';
import { css, PropTypes } from '../util';
import { FormattedText, Ellipsis, Twisty } from '../shared';
import api from '../../shared/api-internal';
import SpecList from '../SpecList';


const isOpenStorage = (section, isOpen) =>
  api.localStorage(section.id, isOpen, { default: true });


/**
 * A section of Specs.
 */
class Section extends React.Component {
  static propTypes = {
    current: PropTypes.instanceOf(Immutable.Map).isRequired,
    section: PropTypes.object.isRequired,
    hasOnly: PropTypes.bool,
  };
  static defaultProps = {
    hasOnly: false,
  };


  constructor(props) {
    super(props);
    this.state = { isOpen: isOpenStorage(props.section) };
  }

  styles() {
    return css({
      base: {},
      titleBar: {
        background: 'rgba(0, 0, 0, 0.05)',
        borderTop: 'solid 1px rgba(0, 0, 0, 0.04)',
        color: Color('white').darken(0.5).hexString(),
        fontSize: 14,
        padding: '6px 10px',
        marginBottom: 3,
        cursor: 'pointer',
      },
      empty: {
        textAlign: 'center',
        fontSize: 13,
        fontStyle: 'italic',
        color: Color('white').darken(0.5).hexString(),
        paddingTop: 10,
        paddingBottom: 20,
      },
    });
  }

  handleClick = () => {
    const isOpen = !this.state.isOpen;
    this.setState({ isOpen });
    isOpenStorage(this.props.section, isOpen);
  };

  render() {
    const styles = this.styles();
    const { section, hasOnly, current } = this.props;
    const { isOpen } = this.state;
    let specs = section.specs();
    if (hasOnly) { specs = specs.filter(spec => spec.isOnly); }

    return (
      <div style={ styles.base }>
        <div style={ styles.titleBar } onClick={ this.handleClick }>
          <Ellipsis>
            <Twisty margin="0 5px 0 0" isOpen={ this.state.isOpen } />
            <FormattedText>{ section.name }</FormattedText>
          </Ellipsis>
        </div>
        {
          isOpen && specs.length > 0
            ? <SpecList specs={ specs } current={ current } />
            : null
        }
        {
          isOpen && specs.length === 0
            ? <div style={ styles.empty }>Empty</div>
            : null
        }
      </div>
    );
  }
}

export default Radium(Section);
