import Link from "next/link";

export const Header = () => {
  return (
    <div className="flex justify-center items-center fixed top-3 w-full  z-10">
      <nav className="flex gap-1 p-0.5 border border-white/15 rounded-full bg-white/10 backdrop-blur">
        <Link
          className="px-4 py-1.5 rounded-full text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white "
          href="#"
        >
          Home
        </Link>
        <Link
          className="px-4 py-1.5 rounded-full text-white/70 text-sm font-semibold"
          href="#"
        >
          Project
        </Link>
        <Link
          className="px-4 py-1.5 rounded-full  text-sm font-semibold bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900 "
          href="#"
        >
          About
        </Link>
        <Link
          href="#"
          className="px-4 py-1.5 rounded-full text-white/70 text-sm font-semibold "
        >
          Contact
        </Link>
      </nav>
    </div>
  );
};
