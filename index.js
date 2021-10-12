const express = require('express');
const path = require('path');
const flagsmith = require('flagsmith-nodejs');
const nodecache = require('node-cache');

const app = express();
const port = process.env.PORT || '3000';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

flagsmith.init({
  environmentID: process.env.FLAGSMITH_ENVIRONMENT_ID || 'LKfXyih5yqZxL3huZ5LraP',
  cache: new nodecache({stdTTL : 10, checkperiod: 10}),
});

app.get('/', async (req, res) => {
  let showFooterIcons = false;
  try {
    showFooterIcons = await flagsmith.hasFeature('show_footer_icons');
  } catch (e) {
    console.log(`Error connecting to flagsmith - ${e.getMessage} `, e);
  }

  console.log(`show footer icons: ${showFooterIcons}`);
  res.render(
    'index', 
    { 
      title: 'Coming Soon!', 
      mainText: 'Eventually Podcast', 
      subText: `Drop your email address below and we will let you know when we launch the Eventually podcast. 
      <br>Brought to you by amazing people`,
      showFooterIcons,
    }
  );
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
