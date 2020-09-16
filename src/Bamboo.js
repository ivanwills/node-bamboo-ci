const axios = require('axios');
const Project = require('./Project');
const Plan = require('./Plan');

class Bamboo {
  constructor({
    hostname,
    username,
    password,
    protocol,
    port,
    realm = 'protected-area',
    debug = false,
  }) {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
    this.protocol = protocol;
    this.port = port;
    this.realm = realm;
    this.debug = debug;

    this._uri = this.buildUri();
  }

  buildUri() {
    const uri = new URL('http://localhost');

    uri.protocol = this.protocol || 'https';
    uri.host = this.hostname;
    uri.pathname = '/rest/api/latest/';
    uri.searchParams.os_authType = 'basic';

    return uri;
  }
  axiosConfig() {
    const config = {};
    if (this.username || this.password) {
      config.auth = {};
      if (this.username) {
        config.auth.username = this.username;
      }
      if (this.password) {
        config.auth.password = this.password;
      }
    }

    return config;
  }

  async request(path, params = {}) {
    const uri = new URL(this._uri);
    uri.pathname += path;

    Object.keys(params).forEach((key) => {
      uri.searchParams.append(key, params[key]);
    });
    if (this.debug) {
      console.info(path, uri.toString());
    }

    try {
      const response = await axios.get(uri.toString(), this.axiosConfig());
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  async projects() {
    const response = await this.request('project', {
      expand: 'projects.project.plans.plan',
      'max-results': 200,
    });

    const projects = [];
    const pushProjects = (project) => {
      projects.push(new Project({ bamboo: this, ...project }));
    };
    response.projects.project.forEach(pushProjects);

    while (response.projects.size > response.projects['max-result']) {
      // keep getting more projects
      if (this.debug) {
        console.log('more to find');
      }
    }

    return projects;
  }

  async project(key) {
    const response = await this.request(`project/${key}`, {
      expand: 'plans.plan',
      'max-results': 200,
    });

    return new Project({ bamboo: this, ...response });
  }

  async plan(projectKey, planKey) {
    const projectJson = await this.request(`project/${projectKey}`);

    const project = new Project({ bamboo: this, ...projectJson });
    const planJson = await this.request(`plan/${projectKey}-${planKey}`, {
      expand: 'plans.plan',
      'max-results': 200,
    });

    if (this.debug) {
      console.log(planJson);
    }
    return new Plan({
      bamboo: this,
      project: project,
      ...planJson,
    });
    /*
    const project = await this.project(projectKey);

    for (const i in project.plans) {
      const plan = project.plans[i];
      if (`${projectKey}-${planKey}` === plan.key) {
        return plan;
      } else {
        console.log(plan.key);
      }
    }
    */
  }
}

module.exports = Bamboo;
