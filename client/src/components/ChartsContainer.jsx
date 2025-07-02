import BarChart from './BarChart';
import AreaChart from './AreaChart';
import Wrapper from '../assets/wrappers/ChartsContainer';
import { useState } from 'react';

function ChartsContainer({ data }) {
  const [barChart, setBarChar] = useState(true);

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button onClick={() => setBarChar(!barChart)}>
        {barChart ? 'Area Chart' : 'Bar Chart'}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
}

export default ChartsContainer;
