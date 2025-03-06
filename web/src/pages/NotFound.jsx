const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center mt-30">
      <div className="text-center p-10 max-w-sm w-full">
        <h1 className="text-6xl font-bold text-[#FF6C37]">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 mt-2">
          It looks like the page you&apos;re looking for doesn&apos;t exist or
          has been moved.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-2 bg-[#FF6C37] text-white rounded-lg transition duration-300"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
