import { useState } from 'react';

import className from './style.module.css';

import Layout from '../../components/Layout';

const Time = () => {
  const [state, setState] = useState(0);

  return (
    <Layout>
      <div className={className.time}>Time: {state}</div>
      <div className={className.time}>Time: {state}</div>
      <div className={className.time}>Time: {state}</div>
      <button
        className={className.button}
        onClick={() => {
          setState((prev) => prev + 1);
        }}
      >
        Plus Time
      </button>
    </Layout>
  );
};

export default Time;
