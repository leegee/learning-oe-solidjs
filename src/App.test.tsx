// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { describe, it, expect, } from 'vitest';
// import App from './App';
// import { lessons } from './lessons';

// // Test the App component
// describe('App Component', () => {
//   lessons.forEach(lesson => {
//     describe(`Lesson: ${lesson.title}`, () => {
//       lesson.cards.forEach((card, cardIndex) => {
//         it(`should render card ${cardIndex + 1} with correct options`, async () => {
//           render(<App />);

//           // Check if the "question" sentence is rendered
//           expect(screen.getByText(new RegExp(card.question, 'i'))).toBeInTheDocument();

//           // Check if each "answers" option is rendered
//           card.answers.forEach(option => {
//             expect(screen.getByText(new RegExp(option, 'i'))).toBeInTheDocument();
//           });
//         });

//         it(`should disable buttons after selecting an option for card ${cardIndex + 1}`, async () => {
//           render(<App />);

//           // fireEvent.click(screen.getByText(card.answers[0]));
//           // expect(screen.getByText(card.answers[0])).toBeDisabled();
//         });

//         it(`should show a modal when an option is selected for card ${cardIndex + 1}`, async () => {
//           render(<App />);

//           // fireEvent.click(screen.getByText(card.answers[0]));

//           // await waitFor(() => {
//           //   expect(screen.getByText(/Correct! Well done./i)).toBeInTheDocument();
//           // });
//         });

//         it(`should move to the next card when the "Next" button is clicked for card ${cardIndex + 1}`, async () => {
//           render(<App />);

//           // fireEvent.click(screen.getByText(card.answers[0]));
//           // await waitFor(() => {
//           //   expect(screen.getByText(/Next/i)).toBeInTheDocument();
//           // });

//           // Click the "Next" button in the modal
//           fireEvent.click(screen.getByText(/Next/i));

//           const nextCard = lesson.cards[cardIndex + 1] || lesson.cards[0];
//           // expect(screen.getByText(new RegExp(nextCard.question, 'i'))).toBeInTheDocument();
//         });
//       });
//     });
//   });
// });
