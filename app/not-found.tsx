import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w">
      <header className="hd">
        <h1>Page not found</h1>
        <p className="lede">The page you are looking for does not exist.</p>
        <div className="cta">
          <Link className="btn btn-p" href="/">
            Back to home
          </Link>
        </div>
      </header>
    </div>
  );
}
