import { JSX } from 'solid-js';
import packageJson from '../../package.json';

import './Home.css';

interface HomeScreenProps {
    children: JSX.Element;
}

const HomeScreen = (props: HomeScreenProps) => {
    return (
        <article id="home">
            {props.children}

            <footer class="version">
                {/* <InstallPWA /> */}
                Version {packageJson.version}
            </footer>
        </article>
    );
};

export default HomeScreen;
