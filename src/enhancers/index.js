import { branch, renderComponent } from 'recompose';
import { FETCHING } from '../constants/state';

/**
 * If your props contains a key called items, which is an array,
 * this will consider it loading if the state is Fetching and
 * there are no items in the array
 * 
 * @param {Component} Component – The Loading Component you want to show
 * @returns {Function(props) => Function(Component)} 
 */
export const loadingEnhancer = (Component) => branch(
  props => props.state === FETCHING && (!props.items || props.items.length === 0),
  renderComponent(Component),
);

/**
 * If your props contains a key called items, which is an array,
 * this will consider it empty if there are no items in the array
 * 
 * @param {Component} Component – The Empty Component you want to show
 * @returns {Function(props) => Function(Component)} 
 */
export const emptyEnhancer = (Component) => branch(
  props => !(props.items && props.items.length > 0),
  renderComponent(Component),
);
