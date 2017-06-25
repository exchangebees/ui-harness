import Immutable from 'immutable';
import R from 'ramda';
import Radium from 'radium';
import React from 'react';
import { delay } from 'js-util';

import api from '../../shared/api-internal';
import ContextWrapper from './ContextWrapper';
import CropMarks from '../shared/CropMarks';
import { css, PropTypes, numberToGreyscale } from '../util';

const { Style } = Radium;


/**
 * Loads and displays a component.
 */
class Component extends React.Component {
  static propTypes = {
    current: PropTypes.instanceOf(Immutable.Map).isRequired,
  };
  static defaultProps = {};


  size() {
    const { current } = this.props;
    const width = current.get('width');
    const height = current.get('height');
    return { width, height };
  }

  styles() {
    const { width, height } = this.size();
    const { current } = this.props;
    const background = current.get('background');
    let border = current.get('border');

    if (border !== undefined) {
      if (R.is(Number, border)) {
        border = `solid 1px ${ numberToGreyscale(border) }`;
      }
    }

    return css({
      base: {
        position: 'relative',
        width,
        height,
        backgroundColor: numberToGreyscale(background),
      },
    });
  }


  handleLoaded(componentInstance) {
    // Store component instance on load.
    if (!R.isNil(componentInstance)) {
      api.component(componentInstance);
    }
  }


  render() {
    const styles = this.styles();
    const { current } = this.props;
    const { width, height } = this.size();

    let styleElement;
    const styleRules = current.get('style');
    if (styleRules) {
      styleElement = React.createElement(Style, {
        scopeSelector: '.uih-Component',
        rules: styleRules,
      });
    }

    let element;
    const type = current.get('componentType');
    if (type) {
      // Props.
      const props = current.get('componentProps') || {};
      props.ref = (c) => delay(() => this.handleLoaded(c));

      // Children.
      const children = current.get('componentChildren');
      element = React.createElement(type, props, children);

      const childContextTypes = current.get('componentChildContextTypes');
      if (childContextTypes) ContextWrapper.childContextTypes = childContextTypes;
    }

    const cropMarksSize = current.get('cropMarks')
        ? current.get('cropMarks.size')
        : 0;


    return (
      <CropMarks
        size={ cropMarksSize }
        offset={ current.get('cropMarks.offset') }
        display={ width === '100%' ? 'block' : 'inline-block' }
        width={ width }
        height={ height }>
        <div className="uih-Component" style={ styles.base }>
          { styleElement }
          <ContextWrapper context={ current.get('componentContext') }>
            { element }
          </ContextWrapper>
        </div>
      </CropMarks>
    );
  }
}


export default Radium(Component);
