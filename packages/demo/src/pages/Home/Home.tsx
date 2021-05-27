import React from 'react';
import './Home.scss';
import Layout from '../../components/Layout/Layout';
import ReadMe from '../../components/ReadMe/ReadMe';
import Demos from '../../components/Demos/Demos';

function Home(): React.ReactElement {
  return (
    <Layout>
      <div id="intro">
        <ReadMe />
      </div>
      <hr />
      <div id="curvetypes">
        <Demos />
      </div>
    </Layout>
  );
}

export default Home;
