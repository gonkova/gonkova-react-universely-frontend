export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center text-sm py-4 text-gray-600 dark:text-gray-300 	position: static">
      &copy; {new Date().getFullYear()} Universely. All rights reserved.
    </footer>
  );
}
