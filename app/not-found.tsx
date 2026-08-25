import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">404</p>
        <h2>Page not found</h2>
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
