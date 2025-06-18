export default function Sidebar({ children }) {
  return (
    <aside className="h-full w-64 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
      {children}
    </aside>
  );
} 