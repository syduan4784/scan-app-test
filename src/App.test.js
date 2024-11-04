import { render, screen } from '@testing-library/react';
import App from './App';

test('renders QR Code Scanner App title', () => {
  render(<App />);
  const titleElement = screen.getByText(/QR Code Scanner App/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders Scan Text from Camera button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Scan Text from Camera/i);
  expect(buttonElement).toBeInTheDocument();
});
