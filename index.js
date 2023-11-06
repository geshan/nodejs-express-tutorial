const express = require('express');
const path = require('path');
const NodeCache = require('node-cache');
const Flagsmith = require('flagsmith-nodejs');


const app = express();
const port = process.env.PORT || '3000';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
const myCache = new NodeCache( { stdTTL: 10, checkperiod: 10 } );

const flagsmith = new Flagsmith({ 
  environmentKey: process.env.FLAGSMITH_ENVIRONMENT_ID || 'NowEDzKzNJXZVTVanLVdMQ',
  cache: myCache,
  
})

app.get('/', async (req, res) => {
  let showFooterIcons = false;
  const flags = await flagsmith.getEnvironmentFlags();

  try {
    showFooterIcons = flags.isFeatureEnabled("show_footer_icons")
    console.log('DEBUG: showFooterIcons:', showFooterIcons)
  } catch (e) {
    console.log(`Error connecting to flagsmith - ${e.getMessage} `, e);
  }


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

