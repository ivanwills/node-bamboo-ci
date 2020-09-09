class Build {
  constructor({ bamboo, plan, link, ...rest }) {
    this.bamboo = bamboo;
    this.plan = plan;
    this.link = plan.link;

    Object.keys(rest).forEach((key) => {
      if (key.match(/(?:Date|Time)$/) && !key.match(/^pretty|Relative/)) {
        this[key] = new Date(rest[key]);
        console.log(this[key] instanceof Date);
      } else {
        this[key] = rest[key];
      }
    });
  }
}

module.exports = Build;
