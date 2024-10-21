const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((_, index) => index + 1);

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-2 text-white bg-gray-700 rounded disabled:opacity-50"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 mx-2 ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-white"
          } rounded`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-2 text-white bg-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
