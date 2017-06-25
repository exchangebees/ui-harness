import R from 'ramda';
import bdd from 'js-bdd';
import { compact } from 'js-util';
import ThisContext from './ThisContext';

const ORIGINAL_DSL = {};

export default {
  supportedMethods: [
    'describe',
    'before',
    'it',
    'section',
  ],
  suites: bdd.allSuites,


  /**
   * Gets the set of [Suites] to show in the index.
   */
  rootSuites() {
    const getRoot = (suite) => {
      const parent = suite.parentSuite;
      return parent ? getRoot(parent) : suite;
    };
    let suites = bdd.suites();
    suites = suites.filter(suite => suite.parentSuite === undefined || suite.isOnly);
    suites = suites.map(suite => getRoot(suite));
    suites = compact(R.uniq(suites));
    return suites;
  },


  /**
   * Sets up the BDD domain specific language.
   * @param {object} namespace: The target object to register onto (ie. global||window).
   */
  register() {
    // Set the __UIHARNESS__ flag to true so that spec files which share
    // both server unit-tests and client visual-specs can determine what
    // environment they are running within.
    global.__UIHARNESS__ = true;

    // Put the BDD domain-specific language into the global global.
    this.supportedMethods.forEach(name => {
      ORIGINAL_DSL[name] = global[name];
      global[name] = bdd[name];
    });

    // Create the special context API that is used as [this]
    // within [describe/it] blocks.
    bdd.contextFactory = (type) => new ThisContext(type);
  },


  /**
   * Removes the DSL from the global namespace.
   * @param {object} namespace: The target object to register onto (ie. global||window).
   */
  unregister() {
    this.supportedMethods.forEach(name => {
      global[name] = ORIGINAL_DSL[name];
    });
  },


  /**
   * Resets the global namespace and the BDD data structure.
   */
  reset() {
    this.unregister();
    bdd.reset();
  },
};
