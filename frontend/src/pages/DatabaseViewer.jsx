import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Table as TableIcon, LayoutGrid, Loader2, AlertCircle } from 'lucide-react';

export default function DatabaseViewer() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Use the standard backend API URL, default to localhost:8080 if not specified
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoadingTables(true);
    setError(null);
    try {
      // Get auth token if available (to pass Spring Security if enabled)
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/api/db/tables`, { headers });
      setTables(response.data);
      if (response.data.length > 0) {
        handleTableSelect(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch tables:', err);
      setError('Failed to connect to the database. Make sure the backend is running and you have permission.');
    } finally {
      setLoadingTables(false);
    }
  };

  const handleTableSelect = async (tableName) => {
    setSelectedTable(tableName);
    setLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/api/db/tables/${tableName}`, { headers });
      setTableData(response.data);
    } catch (err) {
      console.error(`Failed to fetch data for ${tableName}:`, err);
      setError(`Failed to fetch data for table ${tableName}.`);
      setTableData([]);
    } finally {
      setLoadingData(false);
    }
  };

  // Get columns from the first row of data
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="flex h-screen bg-gym-darker text-white font-sans">
      {/* Sidebar - Table List */}
      <div className="w-72 bg-gym-card border-r border-gym-border flex flex-col">
        <div className="p-6 border-b border-gym-border flex items-center gap-3">
          <Database className="text-gym-accent w-6 h-6" />
          <h1 className="text-xl font-bold font-display uppercase tracking-wider">DB Explorer</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-widest pl-2">Tables</h2>
          
          {loadingTables ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gym-accent" />
            </div>
          ) : tables.length === 0 ? (
            <div className="text-sm text-gray-500 pl-2">No tables found.</div>
          ) : (
            <ul className="space-y-1">
              {tables.map(table => (
                <li key={table}>
                  <button
                    onClick={() => handleTableSelect(table)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors
                      ${selectedTable === table 
                        ? 'bg-gym-accent/10 text-gym-accent border border-gym-accent/30' 
                        : 'text-gray-300 hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    <TableIcon className="w-4 h-4" />
                    {table}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content - Data Grid */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gym-darker">
        {/* Header */}
        <div className="p-6 border-b border-gym-border flex justify-between items-center bg-gym-darker/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-gray-400 w-5 h-5" />
            <h2 className="text-lg font-semibold">
              {selectedTable ? `Table: ${selectedTable}` : 'Select a table'}
            </h2>
          </div>
          {tableData.length > 0 && (
             <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gym-card px-3 py-1 rounded-full border border-gym-border">
               {tableData.length} rows (limit 100)
             </span>
          )}
        </div>

        {/* Data View */}
        <div className="flex-1 overflow-auto p-6 relative">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {loadingData ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gym-darker/50 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-gym-accent" />
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Loading data...</p>
              </div>
            </div>
          ) : selectedTable && !error ? (
            tableData.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <TableIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>This table is empty.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-gym-border overflow-hidden bg-gym-card shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gym-dark text-gray-400 font-bold tracking-wider">
                      <tr>
                        {columns.map(col => (
                          <th key={col} className="px-6 py-4 border-b border-gym-border whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gym-border">
                      {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                          {columns.map(col => (
                            <td key={`${rowIndex}-${col}`} className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {/* Safely render objects or booleans as strings */}
                              {row[col] !== null && typeof row[col] === 'object' 
                                ? JSON.stringify(row[col]) 
                                : String(row[col] ?? 'NULL')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            !error && (
              <div className="flex h-full items-center justify-center text-gray-500">
                Select a table from the sidebar to view its data.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
