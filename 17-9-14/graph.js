// @flow

const _: any = undefined;


interface ChartDescription {}
class ChartBackendBad {
  renderInto(elementId: string, graphDescription: ChartDescription): void {
    return _;
  }
  static makeSvgBackend(): ?ChartBackendBad {
    return _;
  }
  static makeCanvasBackend(): ?ChartBackendBad {
    return _;
  }
}
