const Build = require('./Build');
let count = 0;

class Plan {
  constructor({
    project,
    bamboo,
    key,
    name,
    link,
    description,
    num_stages,
    isEnabled,
    isBuilding,
    isActive,
    planKey,
    enabled,
    ...rest
  }) {
    count++;

    if (!bamboo) {
      console.log(count, project);
      throw "Where's my bamboo!";
    }

    this.bamboo = bamboo;
    this.project = project;
    this.key = key;
    this.name = name;
    if (link) {
      this.link = new URL(link && link.href ? link.href : link);
    }
    this.description = description;

    this.num_stages = num_stages;
    this.isEnabled = isEnabled;
    this.isBuilding = isBuilding;
    this.isActive = isActive;
    if (planKey) {
      this.planKey = planKey.key;
    }
    this.enabled = enabled;

    //console.log(rest);
  }

  async getBuilds(branch) {
    console.log('in', this.bamboo);
    const results = await this.bamboo.request(
      `result/${this.planKey}${branch ? `/branch/${branch}` : ''}`,
      { expand: 'results[0:5].result', 'max-results': 100 }
    );

    console.log(results.results.result);
    const builds = [];

    results.results.result.forEach((result) => {
      builds.push(
        new Build({
          bamboo: this.bamboo,
          plan: this,
          ...result,
        })
      );
    });

    return builds;
    /*
    foreach my $node ($ns.get_nodelist) {
      my $build = new Net::Bamboo::Build
        plan			=> this,
        key				=> $node.getAttribute('key'),
        number			=> $node.getAttribute('number'),
        state			=> $node.getAttribute('state'),
        reason			=> $node.findvalue('buildReason').value,
        date_started	=> $node.findvalue('buildStartedTime').value,
        date_completed	=> $node.findvalue('buildStartedTime').value,
        duration		=> $node.findvalue('buildDuration').value,
        num_tests_ok	=> $node.findvalue('successfulTestCount').value,
        num_tests_fail	=> $node.findvalue('failedTestCount').value;

      $builds.{$build.number} = $build;
    }

    return $builds;
    */
  }

  latest_build() {
    const num = this.build_numbers[this.build_numbers.length - 1];

    return this.build(num);
  }

  toJSON() {
    return {
      key: this.key,
      name: this.name,
      link: link.toString(),
      description: this.description,
      num_stages: this.num_stages,
      isEnabled: this.isEnabled,
      isBuilding: this.isBuilding,
      isActive: this.isActive,
    };
  }
}

module.exports = Plan;

/*
has _builds =>
	traits		=> [ 'Hash' ],
	isa			=> 'HashRef[Net::Bamboo::Build]',
	is			=> 'ro',
	lazy_build	=> 1,
	handles	=>
	{
		build_numbers	=> 'keys',
		builds			=> 'values',
		build			=> 'get'
	};

# get a result baseline

sub _build__builds
{
	my $self = shift;

	my $xp = $self->project->bamboo->request('result/' . $self->fqkey => { expand => 'results[0:5].result' });
	my $ns = $xp->find('/results/results/result');

	my $builds = {};

	foreach my $node ($ns->get_nodelist) {
		my $build = new Net::Bamboo::Build
			plan			=> $self,
			key				=> $node->getAttribute('key'),
			number			=> $node->getAttribute('number'),
			state			=> $node->getAttribute('state'),
			reason			=> $node->findvalue('buildReason')->value,
			date_started	=> $node->findvalue('buildStartedTime')->value,
			date_completed	=> $node->findvalue('buildStartedTime')->value,
			duration		=> $node->findvalue('buildDuration')->value,
			num_tests_ok	=> $node->findvalue('successfulTestCount')->value,
			num_tests_fail	=> $node->findvalue('failedTestCount')->value;

		$builds->{$build->number} = $build;
	}

	return $builds;
}

sub refresh
{
	my $self = shift;

	$self->clear__builds && $self->_builds;
}

1;
*/
