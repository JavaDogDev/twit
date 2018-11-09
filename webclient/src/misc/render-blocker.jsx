import * as React from 'react';

/** Blocks rendering of wrapped components until block prop gets updated */
export default class RenderBlocker extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !nextProps.block;
  }

  render() {
    return this.props.children;
  }
}
