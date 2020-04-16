const cassandra = require('cassandra-driver');
const config = require('../src/config');

const client = new cassandra.Client({
  cloud: { secureConnectBundle: config.BUNDLE },
  credentials: { username: config.USER, password: config.PASS }
});

client.connect(function(err, result){
  console.log('astra connected');
});

supertest = supertest('http://localhost:8000');

describe('Endpoints', () => {

  // afterEach('truncate table', () => {

  //   let truncateQuery = 'TRUNCATE keyspace.table';

  //   client.execute(truncateQuery);

  // });

  it('Create a record, retrieve the record', () => {

    let testRecord = {
      id: 13909,
      all: '[\'1\', \'0\', \'admin\', \'rahul.singh@anant.us\', \'1\', \'tutorial\', \'chef\', ' +
        '\'tutorial\', \'chef\', \'0\', \'13909\', \'Chef Tutorial\', ' +
        '\'https://www.tutorialspoint.com/chef/index.htm\', \'<div class="cover"><img ' +
        'class="img-responsive" ' +
        'src="https://www.tutorialspoint.com/chef/images/chef.jpg" alt="Chef ' +
        'Tutorial" /></div><hr /><p><a ' +
        'href="https://www.tutorialspoint.com/index.htm"><i class="icon ' +
        'icon-arrow-circle-o-left big-font"> Previous Page</i></a></p><p><a ' +
        'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
        'class="icon icon-arrow-circle-o-right big-font">\\xa0</i></a></p><hr ' +
        '/><p>Chef is a configuration management technology developed by Opscode ' +
        'to manage infrastructure on physical or virtual machines. It is an open ' +
        'source developed using Ruby, which helps in managing complex ' +
        'infrastructure on the fly. This tutorial provides a basic understanding ' +
        'of the infrastructure and fundamental concepts of managing an ' +
        'infrastructure using Chef.</p><p>This tutorial has been prepared for ' +
        'those who want to understand the features and functionality of Chef and ' +
        'how Chef can help in reducing the complexity of managing an ' +
        'infrastructure.</p><p>After completing this tutorial one would have ' +
        'moderate level understanding of Chef and its key building blocks. It will ' +
        'also give a fair idea on how to configure Chef in a preconfigured ' +
        'infrastructure and how to use it.</p><p>We assume anyone who wants to ' +
        'learn Chef should have an understanding of system administration, ' +
        'infrastructure and network protocol communication. To automate the ' +
        'infrastructure provisioning, one should have a command over basic Ruby ' +
        'script writing and the underlying system where one wants to use ' +
        'Chef.</p><hr /><p><a href="https://www.tutorialspoint.com/index.htm"><i ' +
        'class="icon icon-arrow-circle-o-left big-font"> Previous ' +
        'Page</i></a></p><p><a ' +
        'href="https://www.tutorialspoint.com/cgi-bin/printpage.cgi" ' +
        'target="_blank"> Print</a></p><p><a ' +
        'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
        'class="icon icon-arrow-circle-o-right big-font">\\xa0</i></a></p><hr />\', ' +
        '\'Previous Page Next Page  Chef is a configuration management technology ' +
        'developed by Opscode to manage infrastructure on physical or virtual ' +
        'machines. It is an open source developed using Ruby, which helps in ' +
        'managing complex infrastructure on the fly. This tutorial provides a ' +
        'basic understanding of the infrastructure and fundamental concepts of ' +
        'managing an infrastructure using Chef. This tutorial has been prepared ' +
        'for those who want to understand the features and functionality of Chef ' +
        'and how Chef can help in reducing the complexity of managing an ' +
        'infrastructure. After completing this tutorial one would have moderate ' +
        'level understanding of Chef and its key building blocks. It will also ' +
        'give a fair idea on how to configure Chef in a preconfigured ' +
        'infrastructure and how to use it. We assume anyone who wants to learn ' +
        'Chef should have an understanding of system administration, ' +
        'infrastructure and network protocol communication. To automate the ' +
        'infrastructure provisioning, one should have a command over basic Ruby ' +
        'script writing and the underlying system where one wants to use Chef. ' +
        'Previous Page Print Next Page \', \'Wed Jun 19 12:43:13 UTC 2019\', \'Wed Jun ' +
        '19 12:43:16 UTC 2019\', \'text/html\', \'0\', \'www.tutorialspoint.com\', \'200\', ' +
        '\'/api/entries/13909\', \'1641690374424494080\']',
      content: '<div class="cover"><img class="img-responsive" ' +
        'src="https://www.tutorialspoint.com/chef/images/chef.jpg" alt="Chef ' +
        'Tutorial" /></div><hr /><p><a ' +
        'href="https://www.tutorialspoint.com/index.htm"><i class="icon ' +
        'icon-arrow-circle-o-left big-font"> Previous Page</i></a></p><p><a ' +
        'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
        'class="icon icon-arrow-circle-o-right big-font"> </i></a></p><hr ' +
        '/><p>Chef is a configuration management technology developed by Opscode ' +
        'to manage infrastructure on physical or virtual machines. It is an open ' +
        'source developed using Ruby, which helps in managing complex ' +
        'infrastructure on the fly. This tutorial provides a basic understanding ' +
        'of the infrastructure and fundamental concepts of managing an ' +
        'infrastructure using Chef.</p><p>This tutorial has been prepared for ' +
        'those who want to understand the features and functionality of Chef and ' +
        'how Chef can help in reducing the complexity of managing an ' +
        'infrastructure.</p><p>After completing this tutorial one would have ' +
        'moderate level understanding of Chef and its key building blocks. It will ' +
        'also give a fair idea on how to configure Chef in a preconfigured ' +
        'infrastructure and how to use it.</p><p>We assume anyone who wants to ' +
        'learn Chef should have an understanding of system administration, ' +
        'infrastructure and network protocol communication. To automate the ' +
        'infrastructure provisioning, one should have a command over basic Ruby ' +
        'script writing and the underlying system where one wants to use ' +
        'Chef.</p><hr /><p><a href="https://www.tutorialspoint.com/index.htm"><i ' +
        'class="icon icon-arrow-circle-o-left big-font"> Previous ' +
        'Page</i></a></p><p><a ' +
        'href="https://www.tutorialspoint.com/cgi-bin/printpage.cgi" ' +
        'target="_blank"> Print</a></p><p><a ' +
        'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
        'class="icon icon-arrow-circle-o-right big-font"> </i></a></p><hr />',
      content_text: 'Previous Page Next Page  Chef is a configuration management technology ' +
        'developed by Opscode to manage infrastructure on physical or virtual ' +
        'machines. It is an open source developed using Ruby, which helps in ' +
        'managing complex infrastructure on the fly. This tutorial provides a ' +
        'basic understanding of the infrastructure and fundamental concepts of ' +
        'managing an infrastructure using Chef. This tutorial has been prepared ' +
        'for those who want to understand the features and functionality of Chef ' +
        'and how Chef can help in reducing the complexity of managing an ' +
        'infrastructure. After completing this tutorial one would have moderate ' +
        'level understanding of Chef and its key building blocks. It will also ' +
        'give a fair idea on how to configure Chef in a preconfigured ' +
        'infrastructure and how to use it. We assume anyone who wants to learn ' +
        'Chef should have an understanding of system administration, ' +
        'infrastructure and network protocol communication. To automate the ' +
        'infrastructure provisioning, one should have a command over basic Ruby ' +
        'script writing and the underlying system where one wants to use Chef. ' +
        'Previous Page Print Next Page ',
      created_at: '2019-06-19T12:43:13.000Z',
      domain_name: 'www.tutorialspoint.com',
      http_status: '200',
      is_archived: 1,
      is_public: 'False',
      is_starred: 0,
      language: 'en',
      links: '[\'/api/entries/13909\']',
      mimetype: 'text/html',
      preview_picture: 'https://dummyimage.com/170/000/ffffff&text=Chef%20Tutorial',
      reading_time: 0,
      slugs: '[\'tutorial\', \'chef\']',
      tags: '[\'tutorial\', \'chef\']',
      title: 'Chef Tutorial',
      updated_at: '2019-06-19T12:43:16.000Z',
      url: 'https://www.tutorialspoint.com/chef/index.htm',
      user_email: 'rahul.singh@anant.us',
      user_id: '1',
      user_name: 'admin'
    };

    // let query = 'INSERT INTO killrvideo.leaves(id, all, content, content_text, created_at, domain_name, http_status, is_archived, is_public, is_starred, language, links, mimetype, preview_picture, reading_time, slugs, tags, title, updated_at, url, user_email, user_id, user_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);'; 
    // let keys = Object.keys(testRecord)
    // client.execute(query, keys);

    // making sure it links up to API correctly
    let query = 'select * from killrvideo.leaves'; 
    client.execute(query);


    return supertest
      .get('/api/leaves')
      .expect(200)
      .expect(res => {
        expect(JSON.parse(res.text)[0].id).to.eql(testRecord.id);
        expect(JSON.parse(res.text)[0].domain_name).to.eql(testRecord.domain_name);
        expect(JSON.parse(res.text)[0].title).to.eql(testRecord.title);
      });
      
  });

  // it('Create a set of rows in one partition, retrieve them and number of rows should be same', () => {
    
  //   let testRecord1 = {
  //     id: 13909,
  //     all: '[\'1\', \'0\', \'admin\', \'rahul.singh@anant.us\', \'1\', \'tutorial\', \'chef\', ' +
  //       '\'tutorial\', \'chef\', \'0\', \'13909\', \'Chef Tutorial\', ' +
  //       '\'https://www.tutorialspoint.com/chef/index.htm\', \'<div class="cover"><img ' +
  //       'class="img-responsive" ' +
  //       'src="https://www.tutorialspoint.com/chef/images/chef.jpg" alt="Chef ' +
  //       'Tutorial" /></div><hr /><p><a ' +
  //       'href="https://www.tutorialspoint.com/index.htm"><i class="icon ' +
  //       'icon-arrow-circle-o-left big-font"> Previous Page</i></a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
  //       'class="icon icon-arrow-circle-o-right big-font">\\xa0</i></a></p><hr ' +
  //       '/><p>Chef is a configuration management technology developed by Opscode ' +
  //       'to manage infrastructure on physical or virtual machines. It is an open ' +
  //       'source developed using Ruby, which helps in managing complex ' +
  //       'infrastructure on the fly. This tutorial provides a basic understanding ' +
  //       'of the infrastructure and fundamental concepts of managing an ' +
  //       'infrastructure using Chef.</p><p>This tutorial has been prepared for ' +
  //       'those who want to understand the features and functionality of Chef and ' +
  //       'how Chef can help in reducing the complexity of managing an ' +
  //       'infrastructure.</p><p>After completing this tutorial one would have ' +
  //       'moderate level understanding of Chef and its key building blocks. It will ' +
  //       'also give a fair idea on how to configure Chef in a preconfigured ' +
  //       'infrastructure and how to use it.</p><p>We assume anyone who wants to ' +
  //       'learn Chef should have an understanding of system administration, ' +
  //       'infrastructure and network protocol communication. To automate the ' +
  //       'infrastructure provisioning, one should have a command over basic Ruby ' +
  //       'script writing and the underlying system where one wants to use ' +
  //       'Chef.</p><hr /><p><a href="https://www.tutorialspoint.com/index.htm"><i ' +
  //       'class="icon icon-arrow-circle-o-left big-font"> Previous ' +
  //       'Page</i></a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/cgi-bin/printpage.cgi" ' +
  //       'target="_blank"> Print</a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
  //       'class="icon icon-arrow-circle-o-right big-font">\\xa0</i></a></p><hr />\', ' +
  //       '\'Previous Page Next Page  Chef is a configuration management technology ' +
  //       'developed by Opscode to manage infrastructure on physical or virtual ' +
  //       'machines. It is an open source developed using Ruby, which helps in ' +
  //       'managing complex infrastructure on the fly. This tutorial provides a ' +
  //       'basic understanding of the infrastructure and fundamental concepts of ' +
  //       'managing an infrastructure using Chef. This tutorial has been prepared ' +
  //       'for those who want to understand the features and functionality of Chef ' +
  //       'and how Chef can help in reducing the complexity of managing an ' +
  //       'infrastructure. After completing this tutorial one would have moderate ' +
  //       'level understanding of Chef and its key building blocks. It will also ' +
  //       'give a fair idea on how to configure Chef in a preconfigured ' +
  //       'infrastructure and how to use it. We assume anyone who wants to learn ' +
  //       'Chef should have an understanding of system administration, ' +
  //       'infrastructure and network protocol communication. To automate the ' +
  //       'infrastructure provisioning, one should have a command over basic Ruby ' +
  //       'script writing and the underlying system where one wants to use Chef. ' +
  //       'Previous Page Print Next Page \', \'Wed Jun 19 12:43:13 UTC 2019\', \'Wed Jun ' +
  //       '19 12:43:16 UTC 2019\', \'text/html\', \'0\', \'www.tutorialspoint.com\', \'200\', ' +
  //       '\'/api/entries/13909\', \'1641690374424494080\']',
  //     content: '<div class="cover"><img class="img-responsive" ' +
  //       'src="https://www.tutorialspoint.com/chef/images/chef.jpg" alt="Chef ' +
  //       'Tutorial" /></div><hr /><p><a ' +
  //       'href="https://www.tutorialspoint.com/index.htm"><i class="icon ' +
  //       'icon-arrow-circle-o-left big-font"> Previous Page</i></a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
  //       'class="icon icon-arrow-circle-o-right big-font"> </i></a></p><hr ' +
  //       '/><p>Chef is a configuration management technology developed by Opscode ' +
  //       'to manage infrastructure on physical or virtual machines. It is an open ' +
  //       'source developed using Ruby, which helps in managing complex ' +
  //       'infrastructure on the fly. This tutorial provides a basic understanding ' +
  //       'of the infrastructure and fundamental concepts of managing an ' +
  //       'infrastructure using Chef.</p><p>This tutorial has been prepared for ' +
  //       'those who want to understand the features and functionality of Chef and ' +
  //       'how Chef can help in reducing the complexity of managing an ' +
  //       'infrastructure.</p><p>After completing this tutorial one would have ' +
  //       'moderate level understanding of Chef and its key building blocks. It will ' +
  //       'also give a fair idea on how to configure Chef in a preconfigured ' +
  //       'infrastructure and how to use it.</p><p>We assume anyone who wants to ' +
  //       'learn Chef should have an understanding of system administration, ' +
  //       'infrastructure and network protocol communication. To automate the ' +
  //       'infrastructure provisioning, one should have a command over basic Ruby ' +
  //       'script writing and the underlying system where one wants to use ' +
  //       'Chef.</p><hr /><p><a href="https://www.tutorialspoint.com/index.htm"><i ' +
  //       'class="icon icon-arrow-circle-o-left big-font"> Previous ' +
  //       'Page</i></a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/cgi-bin/printpage.cgi" ' +
  //       'target="_blank"> Print</a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
  //       'class="icon icon-arrow-circle-o-right big-font"> </i></a></p><hr />',
  //     content_text: 'Previous Page Next Page  Chef is a configuration management technology ' +
  //       'developed by Opscode to manage infrastructure on physical or virtual ' +
  //       'machines. It is an open source developed using Ruby, which helps in ' +
  //       'managing complex infrastructure on the fly. This tutorial provides a ' +
  //       'basic understanding of the infrastructure and fundamental concepts of ' +
  //       'managing an infrastructure using Chef. This tutorial has been prepared ' +
  //       'for those who want to understand the features and functionality of Chef ' +
  //       'and how Chef can help in reducing the complexity of managing an ' +
  //       'infrastructure. After completing this tutorial one would have moderate ' +
  //       'level understanding of Chef and its key building blocks. It will also ' +
  //       'give a fair idea on how to configure Chef in a preconfigured ' +
  //       'infrastructure and how to use it. We assume anyone who wants to learn ' +
  //       'Chef should have an understanding of system administration, ' +
  //       'infrastructure and network protocol communication. To automate the ' +
  //       'infrastructure provisioning, one should have a command over basic Ruby ' +
  //       'script writing and the underlying system where one wants to use Chef. ' +
  //       'Previous Page Print Next Page ',
  //     created_at: '2019-06-19T12:43:13.000Z',
  //     domain_name: 'www.tutorialspoint.com',
  //     http_status: '200',
  //     is_archived: 1,
  //     is_public: 'False',
  //     is_starred: 0,
  //     language: 'en',
  //     links: '[\'/api/entries/13909\']',
  //     mimetype: 'text/html',
  //     preview_picture: 'https://dummyimage.com/170/000/ffffff&text=Chef%20Tutorial',
  //     reading_time: 0,
  //     slugs: '[\'tutorial\', \'chef\']',
  //     tags: '[\'tutorial\', \'chef\']',
  //     title: 'Chef Tutorial',
  //     updated_at: '2019-06-19T12:43:16.000Z',
  //     url: 'https://www.tutorialspoint.com/chef/index.htm',
  //     user_email: 'rahul.singh@anant.us',
  //     user_id: '1',
  //     user_name: 'admin'
  //   };

  // let testRecord2 = {
  //   id: 13952,
  //   all: '[\'1\', \'0\', \'admin\', \'rahul.singh@anant.us\', \'1\', \'cassandra\', ' +
  //       '\'kubernetes\', \'cassandra\', \'kubernetes\', \'0\', \'13952\', ' +
  //       '\'sky-uk/cassandra-operator\', ' +
  //       '\'https://github.com/sky-uk/cassandra-operator\', \'<article ' +
  //       'class="markdown-body entry-content p-5" itemprop="text">\\n<p>The Cassandra ' +
  //       'Operator is a Kubernetes operator that manages Cassandra clusters inside ' +
  //       'Kubernetes.</p>\\n<p>The project is <code>alpha</code> status and can be ' +
  //       'used in development environments.\\nIt is not yet recommended for use in ' +
  //       'production environments.</p>\\n<h2><a id="user-content-main-features" ' +
  //       'class="anchor" aria-hidden="true" href="#main-features"></a>Main ' +
  //       'features</h2>\\n<ul><li>rack awareness</li>\\n<li>scaling out (more racks, ' +
  //       'more pods per rack)</li>\\n<li>scheduled backups with retention ' +
  //       'policy</li>\\n<li>works with official Cassandra Docker ' +
  //       'images</li>\\n<li>deployable per namespace with RBAC permissions limited to ' +
  //       'it</li>\\n<li>deployable cluster-wide</li>\\n<li>customisable Cassandra ' +
  //       'config (<code>cassandra.yaml</code>, <code>jvm.options</code>, extra ' +
  //       'libs)</li>\\n<li>customisable liveness / readiness ' +
  //       'probes</li>\\n<li>automated rolling update of Cassandra cluster definition ' +
  //       'changes</li>\\n<li>cluster and node level metrics</li>\\n<li>a comprehensive ' +
  //       'e2e test suite</li>\\n</ul><h2><a id="user-content-how-to-use-it" ' +
  //       'class="anchor" aria-hidden="true" href="#how-to-use-it"></a>How to use ' +
  //       'it?</h2>\\n<p>Instructions on how to deploy the Cassandra Operator and ' +
  //       'provision Cassandra clusters can be found on the <a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/wiki">WIKI</a></p>\\n<h2><a ' +
  //       'id="user-content-project-structure" class="anchor" aria-hidden="true" ' +
  //       'href="#project-structure"></a>Project structure</h2>\\n<p>This project is ' +
  //       'composed of several sub-modules that are either part of the Cassandra ' +
  //       'Operator or used by it:</p>\\n<ul><li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/cassandra-bootstrapper/README.md">cassandra-bootstrapper</a>: ' +
  //       'a component responsible for configuring the Cassandra node before it can ' +
  //       'be started</li>\\n<li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/cassandra-operator/README.md">cassandra-operator</a>: ' +
  //       'the Kubernetes operator that manages the Cassandra clusters lifecycle ' +
  //       'inside Kubernetes</li>\\n<li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/cassandra-snapshot/README.md">cassandra-snapshot</a>: ' +
  //       'a component responsible for taking and deleting snapshots given a schedule ' +
  //       'and retention policy</li>\\n<li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/fake-cassandra-docker/README.md">fake-cassandra-docker</a>: ' +
  //       'a fake Cassandra image used by the cassandra-operator and ' +
  //       'cassandra-snapshot to speed it up end-to-end testing</li>\\n<li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/test-kubernetes-cluster/README.md">test-kubernetes-cluster</a>: ' +
  //       'a <a ' +
  //       'href="https://github.com/kubernetes-sigs/kubeadm-dind-cluster">Kubernetes ' +
  //       'Docker-in-Docker</a> cluster used by the cassandra-operator and ' +
  //       'cassandra-snapshot to facilitate end-to-end testing</li>\\n</ul><h2><a ' +
  //       'id="user-content-design" class="anchor" aria-hidden="true" ' +
  //       'href="#design"></a>Design</h2>\\n<p>The Cassandra Operator and the ' +
  //       'components it uses are described here: <a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/design/cassandra-operator-design.md">Cassandra ' +
  //       'Operator Design</a></p>\\n<h2><a id="user-content-supported-versions" ' +
  //       'class="anchor" aria-hidden="true" href="#supported-versions"></a>Supported ' +
  //       'versions</h2>\\n<p>We test the Cassandra Operator against the following ' +
  //       'Kubernetes / Cassandra versions.</p>\\n<p>Other Kubernetes versions are ' +
  //       'likely to work, but we do not actively test against ' +
  //       'them.</p>\\n<table><thead><tr><th>Cassandra ' +
  //       'Operator</th>\\n<th>Kubernetes</th>\\n<th>Cassandra</th>\\n</tr></thead><tbody><tr><td>0.70.1-alpha</td>\\n<td>1.10</td>\\n<td>3.11</td>\\n</tr></tbody></table><h2><a ' +
  //       'id="user-content-questions-or-problems" class="anchor" aria-hidden="true" ' +
  //       'href="#questions-or-problems"></a>Questions or ' +
  //       'Problems?</h2>\\n<ul><li>\\n<p>If you have a general question about this ' +
  //       'project, please create an issue for it. The issue title should be ' +
  //       'the\\nquestion itself, with any follow-up information in a comment. Add the ' +
  //       '"question" tag to the issue.</p>\\n</li>\\n<li>\\n<p>If you think you have ' +
  //       'found a bug in this project, please create an issue for it. Use the issue ' +
  //       'title to summarise\\nthe problems, and supply full steps to reproduce in a ' +
  //       'comment. Add the "bug" tag to the issue.</p>\\n</li>\\n</ul><h2><a ' +
  //       'id="user-content-contributions" class="anchor" aria-hidden="true" ' +
  //       'href="#contributions"></a>Contributions</h2>\\n<p>See <a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/CONTRIBUTING.md">CONTRIBUTING.md</a></p>\\n</article>\', ' +
  //       '\' The Cassandra Operator is a Kubernetes operator that manages Cassandra ' +
  //       'clusters inside Kubernetes.  The project is alpha status and can be used ' +
  //       'in development environments.\\nIt is not yet recommended for use in ' +
  //       'production environments.  Main features  rack awareness  scaling out (more ' +
  //       'racks, more pods per rack)  scheduled backups with retention policy  works ' +
  //       'with official Cassandra Docker images  deployable per namespace with RBAC ' +
  //       'permissions limited to it  deployable cluster-wide  customisable Cassandra ' +
  //       'config ( cassandra.yaml , jvm.options , extra libs)  customisable liveness ' +
  //       '/ readiness probes  automated rolling update of Cassandra cluster ' +
  //       'definition changes  cluster and node level metrics  a comprehensive e2e ' +
  //       'test suite  How to use it?  Instructions on how to deploy the Cassandra ' +
  //       'Operator and provision Cassandra clusters can be found on the WIKI  ' +
  //       'Project structure  This project is composed of several sub-modules that ' +
  //       'are either part of the Cassandra Operator or used by it:  ' +
  //       'cassandra-bootstrapper : a component responsible for configuring the ' +
  //       'Cassandra node before it can be started  cassandra-operator : the ' +
  //       'Kubernetes operator that manages the Cassandra clusters lifecycle inside ' +
  //       'Kubernetes  cassandra-snapshot : a component responsible for taking and ' +
  //       'deleting snapshots given a schedule and retention policy  ' +
  //       'fake-cassandra-docker : a fake Cassandra image used by the ' +
  //       'cassandra-operator and cassandra-snapshot to speed it up end-to-end ' +
  //       'testing  test-kubernetes-cluster : a Kubernetes Docker-in-Docker cluster ' +
  //       'used by the cassandra-operator and cassandra-snapshot to facilitate ' +
  //       'end-to-end testing  Design  The Cassandra Operator and the components it ' +
  //       'uses are described here: Cassandra Operator Design  Supported versions  We ' +
  //       'test the Cassandra Operator against the following Kubernetes / Cassandra ' +
  //       'versions.  Other Kubernetes versions are likely to work, but we do not ' +
  //       'actively test against them.  Cassandra Operator  Kubernetes  Cassandra  ' +
  //       '0.70.1-alpha  1.10  3.11  Questions or Problems?   If you have a general ' +
  //       'question about this project, please create an issue for it. The issue ' +
  //       'title should be the\\nquestion itself, with any follow-up information in a ' +
  //       'comment. Add the "question" tag to the issue.    If you think you have ' +
  //       'found a bug in this project, please create an issue for it. Use the issue ' +
  //       'title to summarise\\nthe problems, and supply full steps to reproduce in a ' +
  //       'comment. Add the "bug" tag to the issue.   Contributions  See ' +
  //       'CONTRIBUTING.md \', \'Mon Jul 22 15:01:34 UTC 2019\', \'Mon Jul 22 15:01:40 ' +
  //       'UTC 2019\', \'text/html\', \'en\', \'1\', \'github.com\', ' +
  //       '\'https://avatars0.githubusercontent.com/u/1391938?s=400&v=4\', \'200\', ' +
  //       '\'/api/entries/13952\', \'1641690329935511552\']',
  //   content: '<article class="markdown-body entry-content p-5" itemprop="text">\n<p>The ' +
  //       'Cassandra Operator is a Kubernetes operator that manages Cassandra ' +
  //       'clusters inside Kubernetes.</p>\n<p>The project is <code>alpha</code> ' +
  //       'status and can be used in development environments.\nIt is not yet ' +
  //       'recommended for use in production environments.</p>\n<h2><a ' +
  //       'id="user-content-main-features" class="anchor" aria-hidden="true" ' +
  //       'href="#main-features"></a>Main features</h2>\n<ul><li>rack awareness</li>\n' +
  //       '<li>scaling out (more racks, more pods per rack)</li>\n<li>scheduled ' +
  //       'backups with retention policy</li>\n<li>works with official Cassandra ' +
  //       'Docker images</li>\n<li>deployable per namespace with RBAC permissions ' +
  //       'limited to it</li>\n<li>deployable cluster-wide</li>\n<li>customisable ' +
  //       'Cassandra config (<code>cassandra.yaml</code>, <code>jvm.options</code>, ' +
  //       'extra libs)</li>\n<li>customisable liveness / readiness probes</li>\n' +
  //       '<li>automated rolling update of Cassandra cluster definition changes</li>\n' +
  //       '<li>cluster and node level metrics</li>\n<li>a comprehensive e2e test ' +
  //       'suite</li>\n</ul><h2><a id="user-content-how-to-use-it" class="anchor" ' +
  //       'aria-hidden="true" href="#how-to-use-it"></a>How to use it?</h2>\n' +
  //       '<p>Instructions on how to deploy the Cassandra Operator and provision ' +
  //       'Cassandra clusters can be found on the <a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/wiki">WIKI</a></p>\n' +
  //       '<h2><a id="user-content-project-structure" class="anchor" ' +
  //       'aria-hidden="true" href="#project-structure"></a>Project structure</h2>\n' +
  //       '<p>This project is composed of several sub-modules that are either part of ' +
  //       'the Cassandra Operator or used by it:</p>\n<ul><li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/cassandra-bootstrapper/README.md">cassandra-bootstrapper</a>: ' +
  //       'a component responsible for configuring the Cassandra node before it can ' +
  //       'be started</li>\n<li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/cassandra-operator/README.md">cassandra-operator</a>: ' +
  //       'the Kubernetes operator that manages the Cassandra clusters lifecycle ' +
  //       'inside Kubernetes</li>\n<li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/cassandra-snapshot/README.md">cassandra-snapshot</a>: ' +
  //       'a component responsible for taking and deleting snapshots given a schedule ' +
  //       'and retention policy</li>\n<li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/fake-cassandra-docker/README.md">fake-cassandra-docker</a>: ' +
  //       'a fake Cassandra image used by the cassandra-operator and ' +
  //       'cassandra-snapshot to speed it up end-to-end testing</li>\n<li><a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/test-kubernetes-cluster/README.md">test-kubernetes-cluster</a>: ' +
  //       'a <a ' +
  //       'href="https://github.com/kubernetes-sigs/kubeadm-dind-cluster">Kubernetes ' +
  //       'Docker-in-Docker</a> cluster used by the cassandra-operator and ' +
  //       'cassandra-snapshot to facilitate end-to-end testing</li>\n</ul><h2><a ' +
  //       'id="user-content-design" class="anchor" aria-hidden="true" ' +
  //       'href="#design"></a>Design</h2>\n<p>The Cassandra Operator and the ' +
  //       'components it uses are described here: <a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/design/cassandra-operator-design.md">Cassandra ' +
  //       'Operator Design</a></p>\n<h2><a id="user-content-supported-versions" ' +
  //       'class="anchor" aria-hidden="true" href="#supported-versions"></a>Supported ' +
  //       'versions</h2>\n<p>We test the Cassandra Operator against the following ' +
  //       'Kubernetes / Cassandra versions.</p>\n<p>Other Kubernetes versions are ' +
  //       'likely to work, but we do not actively test against them.</p>\n' +
  //       '<table><thead><tr><th>Cassandra Operator</th>\n<th>Kubernetes</th>\n' +
  //       '<th>Cassandra</th>\n</tr></thead><tbody><tr><td>0.70.1-alpha</td>\n' +
  //       '<td>1.10</td>\n<td>3.11</td>\n</tr></tbody></table><h2><a ' +
  //       'id="user-content-questions-or-problems" class="anchor" aria-hidden="true" ' +
  //       'href="#questions-or-problems"></a>Questions or Problems?</h2>\n<ul><li>\n' +
  //       '<p>If you have a general question about this project, please create an ' +
  //       'issue for it. The issue title should be the\nquestion itself, with any ' +
  //       'follow-up information in a comment. Add the "question" tag to the ' +
  //       'issue.</p>\n</li>\n<li>\n<p>If you think you have found a bug in this ' +
  //       'project, please create an issue for it. Use the issue title to summarise\n' +
  //       'the problems, and supply full steps to reproduce in a comment. Add the ' +
  //       '"bug" tag to the issue.</p>\n</li>\n</ul><h2><a ' +
  //       'id="user-content-contributions" class="anchor" aria-hidden="true" ' +
  //       'href="#contributions"></a>Contributions</h2>\n<p>See <a ' +
  //       'href="https://github.com/sky-uk/cassandra-operator/blob/master/CONTRIBUTING.md">CONTRIBUTING.md</a></p>\n' +
  //       '</article>',
  //   content_text: ' The Cassandra Operator is a Kubernetes operator that manages Cassandra ' +
  //       'clusters inside Kubernetes.  The project is alpha status and can be used ' +
  //       'in development environments.\nIt is not yet recommended for use in ' +
  //       'production environments.  Main features  rack awareness  scaling out ' +
  //       '(more racks, more pods per rack)  scheduled backups with retention policy ' +
  //       ' works with official Cassandra Docker images  deployable per namespace ' +
  //       'with RBAC permissions limited to it  deployable cluster-wide  ' +
  //       'customisable Cassandra config ( cassandra.yaml , jvm.options , extra ' +
  //       'libs)  customisable liveness / readiness probes  automated rolling update ' +
  //       'of Cassandra cluster definition changes  cluster and node level metrics  ' +
  //       'a comprehensive e2e test suite  How to use it?  Instructions on how to ' +
  //       'deploy the Cassandra Operator and provision Cassandra clusters can be ' +
  //       'found on the WIKI  Project structure  This project is composed of several ' +
  //       'sub-modules that are either part of the Cassandra Operator or used by it: ' +
  //       ' cassandra-bootstrapper : a component responsible for configuring the ' +
  //       'Cassandra node before it can be started  cassandra-operator : the ' +
  //       'Kubernetes operator that manages the Cassandra clusters lifecycle inside ' +
  //       'Kubernetes  cassandra-snapshot : a component responsible for taking and ' +
  //       'deleting snapshots given a schedule and retention policy  ' +
  //       'fake-cassandra-docker : a fake Cassandra image used by the ' +
  //       'cassandra-operator and cassandra-snapshot to speed it up end-to-end ' +
  //       'testing  test-kubernetes-cluster : a Kubernetes Docker-in-Docker cluster ' +
  //       'used by the cassandra-operator and cassandra-snapshot to facilitate ' +
  //       'end-to-end testing  Design  The Cassandra Operator and the components it ' +
  //       'uses are described here: Cassandra Operator Design  Supported versions  ' +
  //       'We test the Cassandra Operator against the following Kubernetes / ' +
  //       'Cassandra versions.  Other Kubernetes versions are likely to work, but we ' +
  //       'do not actively test against them.  Cassandra Operator  Kubernetes  ' +
  //       'Cassandra  0.70.1-alpha  1.10  3.11  Questions or Problems?   If you have ' +
  //       'a general question about this project, please create an issue for it. The ' +
  //       'issue title should be the\nquestion itself, with any follow-up information ' +
  //       'in a comment. Add the "question" tag to the issue.    If you think you ' +
  //       'have found a bug in this project, please create an issue for it. Use the ' +
  //       'issue title to summarise\nthe problems, and supply full steps to reproduce ' +
  //       'in a comment. Add the "bug" tag to the issue.   Contributions  See ' +
  //       'CONTRIBUTING.md ',
  //   created_at: '2019-07-22T15:01:34.000Z',
  //   domain_name: 'github.com',
  //   http_status: '200',
  //   is_archived: 1,
  //   is_public: 'False',
  //   is_starred: 0,
  //   language: 'en',
  //   links: '[\'/api/entries/13952\']',
  //   mimetype: 'text/html',
  //   preview_picture: 'https://avatars0.githubusercontent.com/u/1391938?s=400&v=4',
  //   reading_time: 1,
  //   slugs: '[\'cassandra\', \'kubernetes\']',
  //   tags: '[\'cassandra\', \'kubernetes\']',
  //   title: 'sky-uk/cassandra-operator',
  //   updated_at: '2019-07-22T15:01:40.000Z',
  //   url: 'https://github.com/sky-uk/cassandra-operator',
  //   user_email: 'rahul.singh@anant.us',
  //   user_id: '1',
  //   user_name: 'admin'
  // };

  // let testRecord3 = {
  //   id: 13535,
  //   all: '[\'0\', \'0\', \'admin\', \'rahul.singh@anant.us\', \'1\', \'0\', \'13535\', \'ESLint ' +
  //       '+ Prettier + VS Code — The Perfect Setup\', ' +
  //       '\'http://www.youtube.com/oembed?format=xml&url=https://www.youtube.com/watch?v=lHAeK8t94as\', ' +
  //       '\'<iframe id="video" width="480" height="270" ' +
  //       'src="https://www.youtube.com/embed/lHAeK8t94as?feature=oembed" ' +
  //       'frameborder="0" allowfullscreen="allowfullscreen">[embedded ' +
  //       'content]</iframe>\', \'[embedded content]\', \'Thu Mar 14 11:23:13 UTC ' +
  //       '2019\', \'Thu Mar 14 11:23:13 UTC 2019\', \'text/xml\', \'0\', ' +
  //       '\'www.youtube.com\', ' +
  //       '\'https://i.ytimg.com/vi/lHAeK8t94as/maxresdefault.jpg\', \'200\', ' +
  //       '\'/api/entries/13535\', \'1641690766884470784\']',
  //   content: '<iframe id="video" width="480" height="270" ' +
  //       'src="https://www.youtube.com/embed/lHAeK8t94as?feature=oembed" ' +
  //       'frameborder="0" allowfullscreen="allowfullscreen">[embedded ' +
  //       'content]</iframe>',
  //   content_text: '[embedded content]',
  //   created_at: '2019-03-14T11:23:13.000Z',
  //   domain_name: 'www.youtube.com',
  //   http_status: '200',
  //   is_archived: 0,
  //   is_public: 'False',
  //   is_starred: 0,
  //   language: 'en',
  //   links: '[\'/api/entries/13535\']',
  //   mimetype: 'text/xml',
  //   preview_picture: 'https://i.ytimg.com/vi/lHAeK8t94as/maxresdefault.jpg',
  //   reading_time: 0,
  //   slugs: '[]',
  //   tags: '[]',
  //   title: 'ESLint + Prettier + VS Code — The Perfect Setup',
  //   updated_at: '2019-03-14T11:23:13.000Z',
  //   url: 'http://www.youtube.com/oembed?format=xml&url=https://www.youtube.com/watch?v=lHAeK8t94as',
  //   user_email: 'rahul.singh@anant.us',
  //   user_id: '1',
  //   user_name: 'admin'
  // }; 

  // let firstInsert = 'INSERT INTO killrvideo.leaves(id, all, content, content_text, created_at, domain_name, http_status, is_archived, is_public, is_starred, language, links, mimetype, preview_picture, reading_time, slugs, tags, title, updated_at, url, user_email, user_id, user_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);'; 
  // let tr1Keys = Object.keys(testRecord1);
  // client.execute(firstInsert, tr1Keys);

  // let secondInsert = 'INSERT INTO killrvideo.leaves(id, all, content, content_text, created_at, domain_name, http_status, is_archived, is_public, is_starred, language, links, mimetype, preview_picture, reading_time, slugs, tags, title, updated_at, url, user_email, user_id, user_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);'; 
  // let tr2Keys = Object.keys(testRecord2);
  // client.execute(firstInsert, tr2Keys);

  // let thirdInsert = 'INSERT INTO killrvideo.leaves(id, all, content, content_text, created_at, domain_name, http_status, is_archived, is_public, is_starred, language, links, mimetype, preview_picture, reading_time, slugs, tags, title, updated_at, url, user_email, user_id, user_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);'; 
  // let tr3Keys = Object.keys(testRecord3);
  // client.execute(thirdInsert, tr3Keys);

  //   return supertest
  //     .get('/api/leaves')
  //     .expect(res => {
  //       expect(JSON.parse(res.text)[0].id).to.eql(testRecord1.id);
  //       expect(JSON.parse(res.text)[1].id).to.eql(testRecord2.id);
  //       expect(JSON.parse(res.text)[2].id).to.eql(testRecord3.id);
  //       expect(JSON.parse(res.text).length).to.eql(3);
  //     });
  // });

  // it('Delete a record and make sure its gone', () => {
    
  //   let testRecord = {
  //     id: 13909,
  //     all: '[\'1\', \'0\', \'admin\', \'rahul.singh@anant.us\', \'1\', \'tutorial\', \'chef\', ' +
  //       '\'tutorial\', \'chef\', \'0\', \'13909\', \'Chef Tutorial\', ' +
  //       '\'https://www.tutorialspoint.com/chef/index.htm\', \'<div class="cover"><img ' +
  //       'class="img-responsive" ' +
  //       'src="https://www.tutorialspoint.com/chef/images/chef.jpg" alt="Chef ' +
  //       'Tutorial" /></div><hr /><p><a ' +
  //       'href="https://www.tutorialspoint.com/index.htm"><i class="icon ' +
  //       'icon-arrow-circle-o-left big-font"> Previous Page</i></a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
  //       'class="icon icon-arrow-circle-o-right big-font">\\xa0</i></a></p><hr ' +
  //       '/><p>Chef is a configuration management technology developed by Opscode ' +
  //       'to manage infrastructure on physical or virtual machines. It is an open ' +
  //       'source developed using Ruby, which helps in managing complex ' +
  //       'infrastructure on the fly. This tutorial provides a basic understanding ' +
  //       'of the infrastructure and fundamental concepts of managing an ' +
  //       'infrastructure using Chef.</p><p>This tutorial has been prepared for ' +
  //       'those who want to understand the features and functionality of Chef and ' +
  //       'how Chef can help in reducing the complexity of managing an ' +
  //       'infrastructure.</p><p>After completing this tutorial one would have ' +
  //       'moderate level understanding of Chef and its key building blocks. It will ' +
  //       'also give a fair idea on how to configure Chef in a preconfigured ' +
  //       'infrastructure and how to use it.</p><p>We assume anyone who wants to ' +
  //       'learn Chef should have an understanding of system administration, ' +
  //       'infrastructure and network protocol communication. To automate the ' +
  //       'infrastructure provisioning, one should have a command over basic Ruby ' +
  //       'script writing and the underlying system where one wants to use ' +
  //       'Chef.</p><hr /><p><a href="https://www.tutorialspoint.com/index.htm"><i ' +
  //       'class="icon icon-arrow-circle-o-left big-font"> Previous ' +
  //       'Page</i></a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/cgi-bin/printpage.cgi" ' +
  //       'target="_blank"> Print</a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
  //       'class="icon icon-arrow-circle-o-right big-font">\\xa0</i></a></p><hr />\', ' +
  //       '\'Previous Page Next Page  Chef is a configuration management technology ' +
  //       'developed by Opscode to manage infrastructure on physical or virtual ' +
  //       'machines. It is an open source developed using Ruby, which helps in ' +
  //       'managing complex infrastructure on the fly. This tutorial provides a ' +
  //       'basic understanding of the infrastructure and fundamental concepts of ' +
  //       'managing an infrastructure using Chef. This tutorial has been prepared ' +
  //       'for those who want to understand the features and functionality of Chef ' +
  //       'and how Chef can help in reducing the complexity of managing an ' +
  //       'infrastructure. After completing this tutorial one would have moderate ' +
  //       'level understanding of Chef and its key building blocks. It will also ' +
  //       'give a fair idea on how to configure Chef in a preconfigured ' +
  //       'infrastructure and how to use it. We assume anyone who wants to learn ' +
  //       'Chef should have an understanding of system administration, ' +
  //       'infrastructure and network protocol communication. To automate the ' +
  //       'infrastructure provisioning, one should have a command over basic Ruby ' +
  //       'script writing and the underlying system where one wants to use Chef. ' +
  //       'Previous Page Print Next Page \', \'Wed Jun 19 12:43:13 UTC 2019\', \'Wed Jun ' +
  //       '19 12:43:16 UTC 2019\', \'text/html\', \'0\', \'www.tutorialspoint.com\', \'200\', ' +
  //       '\'/api/entries/13909\', \'1641690374424494080\']',
  //     content: '<div class="cover"><img class="img-responsive" ' +
  //       'src="https://www.tutorialspoint.com/chef/images/chef.jpg" alt="Chef ' +
  //       'Tutorial" /></div><hr /><p><a ' +
  //       'href="https://www.tutorialspoint.com/index.htm"><i class="icon ' +
  //       'icon-arrow-circle-o-left big-font"> Previous Page</i></a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
  //       'class="icon icon-arrow-circle-o-right big-font"> </i></a></p><hr ' +
  //       '/><p>Chef is a configuration management technology developed by Opscode ' +
  //       'to manage infrastructure on physical or virtual machines. It is an open ' +
  //       'source developed using Ruby, which helps in managing complex ' +
  //       'infrastructure on the fly. This tutorial provides a basic understanding ' +
  //       'of the infrastructure and fundamental concepts of managing an ' +
  //       'infrastructure using Chef.</p><p>This tutorial has been prepared for ' +
  //       'those who want to understand the features and functionality of Chef and ' +
  //       'how Chef can help in reducing the complexity of managing an ' +
  //       'infrastructure.</p><p>After completing this tutorial one would have ' +
  //       'moderate level understanding of Chef and its key building blocks. It will ' +
  //       'also give a fair idea on how to configure Chef in a preconfigured ' +
  //       'infrastructure and how to use it.</p><p>We assume anyone who wants to ' +
  //       'learn Chef should have an understanding of system administration, ' +
  //       'infrastructure and network protocol communication. To automate the ' +
  //       'infrastructure provisioning, one should have a command over basic Ruby ' +
  //       'script writing and the underlying system where one wants to use ' +
  //       'Chef.</p><hr /><p><a href="https://www.tutorialspoint.com/index.htm"><i ' +
  //       'class="icon icon-arrow-circle-o-left big-font"> Previous ' +
  //       'Page</i></a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/cgi-bin/printpage.cgi" ' +
  //       'target="_blank"> Print</a></p><p><a ' +
  //       'href="https://www.tutorialspoint.com/chef/chef_overview.htm">Next Page <i ' +
  //       'class="icon icon-arrow-circle-o-right big-font"> </i></a></p><hr />',
  //     content_text: 'Previous Page Next Page  Chef is a configuration management technology ' +
  //       'developed by Opscode to manage infrastructure on physical or virtual ' +
  //       'machines. It is an open source developed using Ruby, which helps in ' +
  //       'managing complex infrastructure on the fly. This tutorial provides a ' +
  //       'basic understanding of the infrastructure and fundamental concepts of ' +
  //       'managing an infrastructure using Chef. This tutorial has been prepared ' +
  //       'for those who want to understand the features and functionality of Chef ' +
  //       'and how Chef can help in reducing the complexity of managing an ' +
  //       'infrastructure. After completing this tutorial one would have moderate ' +
  //       'level understanding of Chef and its key building blocks. It will also ' +
  //       'give a fair idea on how to configure Chef in a preconfigured ' +
  //       'infrastructure and how to use it. We assume anyone who wants to learn ' +
  //       'Chef should have an understanding of system administration, ' +
  //       'infrastructure and network protocol communication. To automate the ' +
  //       'infrastructure provisioning, one should have a command over basic Ruby ' +
  //       'script writing and the underlying system where one wants to use Chef. ' +
  //       'Previous Page Print Next Page ',
  //     created_at: '2019-06-19T12:43:13.000Z',
  //     domain_name: 'www.tutorialspoint.com',
  //     http_status: '200',
  //     is_archived: 1,
  //     is_public: 'False',
  //     is_starred: 0,
  //     language: 'en',
  //     links: '[\'/api/entries/13909\']',
  //     mimetype: 'text/html',
  //     preview_picture: 'https://dummyimage.com/170/000/ffffff&text=Chef%20Tutorial',
  //     reading_time: 0,
  //     slugs: '[\'tutorial\', \'chef\']',
  //     tags: '[\'tutorial\', \'chef\']',
  //     title: 'Chef Tutorial',
  //     updated_at: '2019-06-19T12:43:16.000Z',
  //     url: 'https://www.tutorialspoint.com/chef/index.htm',
  //     user_email: 'rahul.singh@anant.us',
  //     user_id: '1',
  //     user_name: 'admin'
  //   };

  //   let insertQuery = 'INSERT INTO killrvideo.leaves(id, all, content, content_text, created_at, domain_name, http_status, is_archived, is_public, is_starred, language, links, mimetype, preview_picture, reading_time, slugs, tags, title, updated_at, url, user_email, user_id, user_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);'; 
  //   let keys = Object.keys(testRecord)
  //   client.execute(query, keys);

  //   let deleteQuery = 'DELETE FROM keyspace.table WHERE id=?;';
  //   let deleteParams = [testRecord.id];

  //   client.execute(deleteQuery, deleteParams);

  //   return supertest
  //     .get(`/api/leaves/${id}`)
  //     .expect(204);
  // });
  
});