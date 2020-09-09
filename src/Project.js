const Plan = require('./Plan');

class Project {
  constructor({ bamboo, key, name, link, plans, description, ...rest }) {
    if (Object.keys(rest).length > 1) {
      console.error('Too many keys found in rest', rest);
      throw 'Too many keys found in rest';
    }
    if (!bamboo) {
      throw "Where's my bamboo?";
    }

    this.bamboo = bamboo;
    this.key = key;
    this.name = name;
    this.link = new URL(link && link.href ? link.href : link);
    this.description = description;
    this.plans = [];
    if (plans && plans.plan) {
      plans.plan.forEach((plan) => {
        this.plans.push(new Plan({ project: this, bamboo: bamboo, ...plan }));
      });
    }
  }

  toJSON() {
    return {
      key: this.key,
      name: this.name,
      link: link.toString(),
      description: this.description,
      plans: this.plans,
    };
  }
  //has _plans =>
  //	traits		=> [ 'Hash' ],
  //	isa			=> 'HashRef[Net::Bamboo::Plan]',
  //	is			=> 'ro',
  //	handles		=>
  //	{
  //		plans		=> 'values',
  //		num_plans	=> 'count',
  //		plan_keys	=> 'keys',
  //		add_plan	=> 'set',
  //		plan		=> 'get',
  //	};
}

module.exports = Project;
