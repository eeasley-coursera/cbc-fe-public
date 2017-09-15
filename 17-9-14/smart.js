// @flow

const slugRegex = /^[a-z-]+$/;

class SlugBad {
  slug: string;
  constructor(str: string) {
    this.slug = str;
    return this;
  }
  validateSlug(): boolean {
    return slugRegex.test(this.slug);
  }
}

console.log(new SlugBad('ABC'));
