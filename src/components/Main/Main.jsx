import R from "ramda";
import React from "react";
import Radium from "radium";
import Immutable from "immutable";
import Color from "color";
import { css, PropTypes } from "js-util/react";
import { Card, FlexEdge } from "../shared";
import Header from "./Header";
import Footer from "./Footer";
import Component from "./Component";
import ComponentHost from "./ComponentHost";
import OutputLog from "../OutputLog";


/**
 * The Main (center) pane that hosts the component.
 */
 @Radium
export default class Main extends React.Component {
  backgroundColor() {
    let color = this.props.current.get("backdrop") || "#fff";
    if (R.is(Number, color)) {
      if (color < 0) { color = 0; }
      if (color > 1) { color = 1; }
      color = css.white.darken(color);
    }
    return color;
  }

  styles(isDark) {
    const { current } = this.props;
    const header = current.get("header");
    const scroll = current.get("scroll");
    const overflowX = (scroll === true || scroll === "x" || scroll === "x:y") ? "auto" : null
    const overflowY = (scroll === true || scroll === "y" || scroll === "x:y") ? "auto" : null

    const HR_COLOR = isDark
        ? "rgba(255, 255, 255, 0.4)"
        : "rgba(0, 0, 0, 0.1)"

    return css({
      base: {
        Absolute: 0,
        overflow: "hidden",
        backgroundColor: this.backgroundColor()
      },
      footerHr: {
        borderTop: `solid 8px ${ HR_COLOR }`,
        borderBottom: "none",
        margin: "0 20px",
      }
    });
  }


  scroll() {
    const { current } = this.props;
    const scroll = current.get("scroll");
    const overflowX = (scroll === true || scroll === "x" || scroll === "x:y") ? "auto" : "hidden";
    const overflowY = (scroll === true || scroll === "y" || scroll === "x:y") ? "auto" : "hidden";
    return { scroll, overflowX, overflowY };
  }


  render() {
    const { current } = this.props;
    const { overflowX, overflowY } = this.scroll();
    const isDark = Color(this.backgroundColor()).dark();
    const styles = this.styles(isDark);

    let elHeader, elFooter, elFooterHr;
    const hr = current.get("hr")

    // Header.
    const header = current.get("header");
    if (header) {
      elHeader = <Header
                    markdown={ header }
                    edge="top"
                    hr={ hr }
                    isDark={ isDark }/>
    }

    // Footer.
    const footer = current.get("footer");
    if (footer) {
      elFooterHr = <hr style={ styles.footerHr } />
      elFooter = <Footer
                    markdown={ footer }
                    isDark={ isDark }
                    flexEdge={{ maxHeight: "50%", overflowY: "auto" }}/>

    }

    // Main content.
    let el = <ComponentHost current={ current }/>;

    // Swap out the main host with the log if required.
    const log = current.get("log");
    el = current.get("showLog") && log
            ? el = <OutputLog items={ log.toJS() }/>
            : el;

    return (
      <Card>
        <div style={ styles.base }>
          <FlexEdge orientation="vertical">
            { elHeader }
            <div flexEdge={{ flex: 1, overflowX, overflowY }}>{ el }</div>
            { elFooterHr }
            { elFooter }
          </FlexEdge>
        </div>
      </Card>
    );
  }
}


// API -------------------------------------------------------------------------
Main.propTypes = {
  current: PropTypes.instanceOf(Immutable.Map).isRequired
};
Main.defaultProps = {};
