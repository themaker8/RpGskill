// components/Navbar.js

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-gray-900 text-white dark:bg-gray-800 p-2 z-10">
      <div className="max-w-3xl mx-auto flex justify-around">
        <Link href="/" className="text-lg font-semibold hover:text-gray-400">
          Home
        </Link>
        <Link href="/profile" className="text-lg font-semibold hover:text-gray-400">
          Profile
        </Link>
        <Link href="/add_skill" className="text-lg font-semibold hover:text-gray-400">
          Add Skill
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
