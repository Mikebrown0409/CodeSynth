import ThemeToggle from './ThemeToggle';

export default function NavBar() {
  return (
    <header className="w-full h-12 px-4 flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm">
      <h1 className="text-lg font-semibold">CodeSynth</h1>
      <ThemeToggle />
    </header>
  );
} 