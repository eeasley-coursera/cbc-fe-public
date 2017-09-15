// @flow

import React from 'react';

// Just for convenience. In the real world, we'd use something better.
type Cml = string;
const _: any = undefined;

class PaidCourseContentBodyBad extends React.Component<{userId: string, itemId: string}, {itemContent: Cml}> {
  loadContent(userId: string, itemId: string): Cml {
    return _;
  }
}

class Upsell extends React.Component<{itemId: string}, void> {}

class PaidCourseContentPageBad extends React.Component<{userId: string, itemId: string}, {hasPaid: boolean}> {
  static fetchPaymentStatus(userId: string, itemId: string): boolean {
    return _;
  }
  setPaymentStatus(userId: string, itemId: string): void {
    this.setState({ hasPaid: PaidCourseContentPageBad.fetchPaymentStatus(userId, itemId) });
  }
  render() {
    const body =
          this.state.hasPaid ?
            <PaidCourseContentBodyBad userId={this.props.userId} itemId={this.props.itemId} /> :
            <Upsell itemId={this.props.itemId} />;
    return <div> {/* ... */} body {/* ... */} </div>;
  }
}
