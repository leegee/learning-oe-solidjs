import { onCleanup, onMount } from 'solid-js';
import './Homepage.css';
import { A } from "@solidjs/router";

export default function Homepage() {
    onMount(() => document.body.classList.add('home'));
    onCleanup(() => document.body.classList.remove('home'));

    return (
        <main>
            <h1>Home Page</h1>

            <A href="/course/1">Course</A>
        </main>
    )
}
