// @flow

import React from 'react';

const _: any = undefined;

// In actual use, we'd have better implementations for these four but they're not the focus here now.
type Timestamp = string;
type ProperFraction = number;
type UserId = number;
type SVG = React$Element<*>;

type Props = {
  completionPercentageByDate: { [Timestamp]: ProperFraction },
};
type State = {
  chart: SVG,
  timespan: [Timestamp, Timestamp],
  userFilter: UserId => boolean,
};
class ProgressVisualization extends React.Component<Props, State> {
  render(): React$Element<*> {
    return this.state.chart;
  }
  updateFilter(newFilter: UserId => boolean): SVG {
    return _;
  }
}
