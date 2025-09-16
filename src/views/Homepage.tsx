import { A } from "@solidjs/router";
import { I18nProvider } from "../contexts/I18nProvider";

export default function Homepage() {
    return (
        <I18nProvider>
            <main>
                <h1>Home Page</h1>

                <A href="/course/1">Course</A>
            </main>
        </I18nProvider>
    )
}
