class Build {
  constructor({ bamboo, plan, link, ...rest }) {
    this.bamboo = bamboo;
    this.plan = plan;
    if (link) {
      this.link = new URL(link && link.href ? link.href : link);
    }

    Object.keys(rest).forEach((key) => {
      if (key.match(/(?:Date|Time)$/) && !key.match(/^pretty|Relative/)) {
        this[key] = new Date(rest[key]);
        if (this.bamboo.debug) {
          console.log('Build.new ', this[key] instanceof Date);
        }
      } else {
        this[key] = rest[key];
      }
    });
  }
}

module.exports = Build;
