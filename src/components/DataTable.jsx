import React from "react";
import DataTable from "react-data-table-component";

export default function DataTableComponent({ data, columns, onDelete }) {

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const modifiedColumns = onDelete
    ? [
        ...columns,
        {
          name: "",
          cell: (row) => (
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={() => handleDelete(row.id)}
            >
              Excluir
            </button>
          ),
        },
      ]
    : columns;

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
      },
    },
    pagination: {
      style: {
        borderRadius: "0 0 0.5rem 0.5rem"
      }
    }
  };

  const noDataMessage = "Nenhuma informação disponível no momento.";

  return (
    <div className="relative overflow-hidden rounded-t-lg shadow-md">
      <DataTable 
        columns={modifiedColumns} 
        data={data} 
        pagination 
        paginationComponentOptions={{ rowsPerPageText: 'Linhas por página:' }}  
        noDataComponent={<div className="text-center p-8">{noDataMessage}</div>} 
        customStyles={customStyles} 
      />
    </div>
  );
}