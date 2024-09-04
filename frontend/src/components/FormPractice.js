import React from 'react';

const Form = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Practice Form</h1>
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600">
            Update
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Back
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supplier Type */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplierType">
            Supplier Type
          </label>
          <select
            id="supplierType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Type</option>
            <option value="type1">rotational</option>
            <option value="type2">part time </option>
            <option value="type3">full time</option>
          </select>
        </div>

        {/* Supplier Category */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplierCategory">
            Supplier Category
          </label>
          <select
            id="supplierCategory"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Category</option>
            <option value="category1">day work</option>
            <option value="category2">rotational work</option>
            <option value="category3">night work</option>
          </select>
        </div>

        {/* Supplier Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplierName">
            Supplier Name
          </label>
          <input
            type="text"
            id="supplierName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Supplier Name"
          />
        </div>
      </form>
      





      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supplier Type */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplierType">
            city
          </label>
          <select
            id="supplierType"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select City</option>
            <option value="type1">kanpur</option>
            <option value="type2">agra</option>
            <option value="type3">lucknow</option>
          </select>
        </div>

        {/* Supplier Category */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplierCategory">
            State
          </label>
          <select
            id="supplierCategory"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select State</option>
            <option value="category1">uttarpradesh</option>
            <option value="category2">bihar</option>
            <option value="category3">punjab</option>
          </select>
        </div>

        {/* Supplier Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplierName">
            Country
          </label>
          <input
            type="text"
            id="supplierName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Supplier Name"
          />
        </div>
        <div className="col-span-1 md:col-span-3 mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addresstextarea">
    Address
  </label>
  <textarea
    id="addresstextarea"
    rows="4"
    className="shadow appearance-none border border-blue-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
    placeholder="Enter your address"
  ></textarea>
</div>




      </form>
    </div>
  );
}

export default Form;
