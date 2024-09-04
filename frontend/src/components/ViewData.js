import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const ViewData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');
  const [excelNotification, setExcelNotification] = useState('');
  const [pdfNotification, setPdfNotification] = useState('');
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          setError('User not logged in');
          return;
        }

        const response = await fetch('http://localhost:8000/api/files/data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'upload_users_id': userId,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
          setFilteredData(result);
          setTotalPages(Math.ceil(result.length / itemsPerPage));
        } else {
          const result = await response.json();
          setError(`Error fetching data: ${result.message || 'An error occurred'}`);
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      return (
        (item.name ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
        (item.email ? item.email.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
        (item.contact_no ? item.contact_no.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
        (item.gender ? item.gender.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
        (item.address ? item.address.toLowerCase().includes(searchQuery.toLowerCase()) : false)
      );
    });

    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchQuery, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const showNotification = (type, message) => {
    if (type === 'excel') {
      setExcelNotification(message);
    } else if (type === 'pdf') {
      setPdfNotification(message);
    } else {
      setNotification(message);
    }

    setTimeout(() => {
      if (type === 'excel') {
        setExcelNotification('');
      } else if (type === 'pdf') {
        setPdfNotification('');
      } else {
        setNotification('');
      }
    }, 5000);
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      showNotification('excel', 'Excel data is not available.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');
    XLSX.writeFile(workbook, 'UserData.xlsx');
    showNotification('excel', 'Excel file has been downloaded successfully.');
  };

  const handleExportPdf = () => {
    if (filteredData.length === 0) {
      showNotification('pdf', 'PDF data not available.');
      return;
    }
    const doc = new jsPDF();
    const tableColumn = ["ID", "Name", "Email", "Contact No", "Gender", "Address"];
    const tableRows = [];

    filteredData.forEach(item => {
      const itemData = [
        item.id,
        item.name,
        item.email,
        item.contact_no,
        item.gender,
        item.address
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('UserData.pdf');
    showNotification('pdf', 'PDF file has been downloaded successfully.');
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-md flex flex-col">
        {/* Top buttons and search bar */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Upload File
          </button>
          <input
            type="text"
            placeholder="Search data ....."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg shadow-sm"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
            >
              Download Excel File
            </button>
            <button
              onClick={handleExportPdf}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              Download PDF File
            </button>
          </div>
        </div>
        {/* Notifications */}
        {excelNotification && <p className="text-green-500 mb-2">{excelNotification}</p>}
        {pdfNotification && <p className="text-green-500 mb-2">{pdfNotification}</p>}
        {notification && <p className="text-red-500 mb-2">{notification}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Data Table */}
        <table className="w-full mt-4 border-collapse border border-gray-300 bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Contact No.</th>
              <th className="border border-gray-300 px-4 py-2">Gender</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{indexOfFirstItem + index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name || 'Not Available'}</td>
                <td className="border border-gray-300 px-4 py-2">{item.email || 'Not Available'}</td>
                <td className="border border-gray-300 px-4 py-2">{item.contact_no || 'Not Available'}</td>
                <td className="border border-gray-300 px-4 py-2">{item.gender || 'Not Available'}</td>
                <td className="border border-gray-300 px-4 py-2">{item.address || 'Not Available'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
          >
            Previous
          </button>
          <span className="text-gray-800">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewData;
