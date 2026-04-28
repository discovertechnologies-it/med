import { Link } from 'react-router-dom';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-screen-md px-4 py-20 text-center">
      <p className="text-label uppercase text-text-secondary">404</p>
      <h1 className="mt-3 text-h1 md:text-h1-lg">We could not find that page.</h1>
      <p className="mt-3 text-body-lg text-text-secondary">
        The link may be broken or the page may have been moved.
      </p>
      <div className="mt-6 inline-block">
        <Link to="/" className="contents">
          <Button>Back to home</Button>
        </Link>
      </div>
    </main>
  );
}
