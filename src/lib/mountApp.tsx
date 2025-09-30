import { render } from 'solid-js/web';
import App from '../App';
import { type Config } from './config';

export const mountApp = (root: HTMLElement, config: Config) => {
    render(() => <App config={config} />, root);
};
