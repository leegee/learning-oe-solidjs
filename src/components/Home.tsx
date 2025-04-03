import { JSX } from 'solid-js';
import './Home.css';

interface HomeScreenProps {
    children: JSX.Element;
}

const HomeScreen = (props: HomeScreenProps) => {
    return (
        <article id="home">
            {props.children}
        </article>
    );
};

export default HomeScreen;
