import './About.css';

const AboutComponent = () => {
    return (
        <section className="card about">
            <img src="icons/dog.webp" />
            <h2>About This App</h2>
            <p>
                This little app was written in under a week to help me
                learn a little Old English, but it can easily be altered
                with just a text editor to quiz the user on any subject.
            </p>
            <p>
                Nothing is stored outside of your device.
            </p>
            <footer>
                &mdash; <a title='E-mail' href='mailto:leegee@gmail.com'>Lee Goddard</a>, Gödöllő, 2025
            </footer>
        </section>
    );
};

export default AboutComponent;
