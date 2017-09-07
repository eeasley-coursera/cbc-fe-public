// @flow

// I have no idea if this is what naptimejs actually looks like. I'm just hoping this API is vaguely intelligible at use sites.
export default class Naptime {
  resource: string;
  get(id: string): mixed {
  }
  post(body: mixed): void {
  }
  constructor(resource: string) {
    this.resource = resource;
  }
}
