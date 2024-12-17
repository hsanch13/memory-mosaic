import React from "react";

const CreateBoard = () => {
  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">Mathew's Yearly Recap</h1>
        <p className="text-gray-400 text-center px-4">
          A place to showcase the most memorable moments of the year.
        </p>
        <div className="bg-gray-700 rounded-lg w-[300px] h-[200px] md:w-[400px] md:h-[250px] flex items-center justify-center">
          <div className="bg-gray-400 w-1/2 h-1/2"></div>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="relative h-[500vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-700 w-[120px] h-[120px] md:w-[150px] md:h-[150px]"></div>
            <div className="bg-gray-800 w-[120px] h-[120px] md:w-[150px] md:h-[150px]"></div>
            <div className="bg-gray-900 w-[120px] h-[120px] md:w-[150px] md:h-[150px]"></div>
          </div>
        </div>
      </section>

      {/* Some Text Section */}
      <section className="h-screen flex items-center justify-center text-center">
        <div className="flex flex-row space-x-6">
          <div className="w-[150px] h-[150px] bg-gray-700"></div>
          <div className="text-2xl font-bold">Some</div>
          <div className="w-[150px] h-[150px] bg-gray-800"></div>
          <div className="text-2xl font-bold">Text</div>
          <div className="w-[150px] h-[150px] bg-gray-900"></div>
        </div>
      </section>

      {/* Large Display Image */}
      <section className="h-screen flex items-center justify-center">
        <div className="w-[90%] h-[300px] md:h-[500px] bg-gray-600 flex items-center justify-center">
          <div className="text-white font-bold text-2xl">Final Caption Here</div>
        </div>
      </section>

      {/* Final Grid Section */}
      <section className="h-screen flex flex-col justify-center items-center">
        <div className="grid grid-cols-3 gap-4">
          <div className="w-[100px] h-[100px] bg-gray-700"></div>
          <div className="w-[100px] h-[100px] bg-gray-300"></div>
          <div className="w-[100px] h-[100px] bg-gray-900"></div>
          <div className="w-[100px] h-[100px] bg-gray-700"></div>
          <div className="w-[100px] h-[100px] bg-gray-800"></div>
          <div className="w-[100px] h-[100px] bg-gray-900"></div>
        </div>
      </section>
    </div>
  );
};

export default CreateBoard;
