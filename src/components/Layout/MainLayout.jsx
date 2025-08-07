export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">
          Experience Print Come to Life
        </h1>
        {children}
      </div>
    </div>
  );
}