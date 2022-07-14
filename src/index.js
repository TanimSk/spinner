import SpinnerCorner from './components/spinnerCorner';
import SpinnerMiddle from './components/spinnerMiddle';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <div className=''>
    <SpinnerMiddle />
  </div>
);


