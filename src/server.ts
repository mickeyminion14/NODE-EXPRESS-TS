import {Application} from './app/app';
try {
  // Initialize Application
  Application.init();
} catch (err: any) {
  // Handle application errors with friendly messages
  console.error(err.message);
}
