# Bamboo-CI

An Atlasian Bamboo CI interface library

# Usage

```javascript
const Bamboo = require('BambooCi');

const bamboo = new Bamboo({
  // only this is required, the rest are either not used or have sensible
  // defaults and only need to be modified if required
  hostname: "bamboo.example.com",
  username: "somename",
  password: "somepassword",
  protocol: 'https',
  port: '443',
});

const projects = await bamboo.projects();
const project = await bamboo.project('KEY');
const plan = await bamboo.plan('projectKey', 'buildKey');
```

# The Bamboo object

## Constructor

# ALSO SEE

* https://docs.atlassian.com/atlassian-bamboo/REST/6.3.0/
