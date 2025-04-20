import './HomeScreen.css';
import { JSX } from 'solid-js';

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
