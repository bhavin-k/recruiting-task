"use client";
import React, { useState } from "react";
import { data } from "../../Static/TableData";
import Sidebar from "@/components/Slidbar";
import { DataTable } from "@/components/Datatable";

interface Filter {
  show: boolean;
  fieldValue: string;
  optionValue: string;
}

const Home: React.FC = () => {
  const [tableData, setTableData] = useState(data);
  const [filters, setFilters] = useState<Filter[]>([]);
  const handleFilterChange = (show: any, fieldValue: any, optionValue: any) => {
    // Create new filter object
    const newFilter: Filter = { show, fieldValue, optionValue };

    // Determine if this is a single select filter (Active or Public)
    const isSingleSelect = fieldValue === "active" || fieldValue === "public";

    // Check if filter exists for fieldValue and optionValue
    const filterExists = filters.some((filter) =>
      isSingleSelect
        ? filter.fieldValue === fieldValue
        : filter.show !== show &&
          filter.fieldValue === fieldValue &&
          filter.optionValue === optionValue
    );

    // Update filters state
    let updatedFilters: Filter[] = [];
    if (show) {
      updatedFilters = [
        ...filters.filter(
          (filter) =>
            filter.fieldValue !== fieldValue ||
            filter.show ||
            filter.optionValue !== optionValue
        ),
        newFilter,
      ];
    } else {
      updatedFilters = filters.filter(
        (filter) =>
          filter.show ||
          filter.fieldValue !== fieldValue ||
          filter.optionValue !== optionValue
      );
    }

    // Apply filters to data
    const filteredValue = applyFilters(data, updatedFilters);
    setTableData(filteredValue);
  };

  const applyFilters = (data: any[], filters: Filter[]) => {
    // Create an array of filters where show is true
    const activeFilters = filters.filter((filter) => filter.show);

    return data.filter((item) => {
      // Check if item matches all active filters
      return activeFilters.every((filter) => {
        const { show, fieldValue, optionValue } = filter;

        if (!show) {
          return true; // If show is false, bypass filter
        }

        if (fieldValue in item) {
          if (Array.isArray(item[fieldValue])) {
            return item[fieldValue].includes(optionValue);
          } else {
            return item[fieldValue] === optionValue;
          }
        }

        return true; // If fieldValue does not exist in item, bypass filter
      });
    });
  };
  return (
    <>
      <div className="grid grid-cols-12 gap-2 m-5 bg-white p-12">
        <div id="sidebar" className="col-span-2">
          <Sidebar onFilterChange={handleFilterChange} />
        </div>

        <div className="col-span-10">
          <DataTable tableData={tableData} />
        </div>
      </div>
    </>
  );
};

export default Home;
