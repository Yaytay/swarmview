import { renderToPipeableStream, renderToString } from 'react-dom/server';
 
import App from './App';
 
export const render = () => {
  return renderToPipeableStream(<App />, {
    onError: (e) => {
      console.error("wheee")
    }
  })
};