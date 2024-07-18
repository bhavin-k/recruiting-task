import React from "react";
import { Button } from "./ui/Button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/Accordion";
import { Checkbox } from "./ui/Checkbox";

const filterData = [
  {
    label: "Public",
    value: "public",
    options: [
      { label: "true", value: true },
      { label: "false", value: false },
    ],
  },
  {
    label: "Active",
    value: "active",
    options: [
      { label: "true", value: true },
      { label: "false", value: false },
    ],
  },
  {
    label: "School Level",
    value: "regions",
    options: [
      { label: "ES", value: "ES" },
      { label: "MS", value: "MS" },
      { label: "HS", value: "HS" },
    ],
  },
  {
    label: "Subject Area",
    value: "tags",
    options: [
      { label: "Math", value: "math" },
      { label: "Science", value: "science" },
      { label: "Literature", value: "literature" },
      { label: "History", value: "history" },
    ],
  },
];

interface FilterOption {
  label: string;
  value: string | boolean;
}

interface Filter {
  label: string;
  value: string;
  options: FilterOption[];
}

interface SidebarProps {
  onFilterChange: (
    show: boolean,
    fieldValue: string,
    optionValue: string | boolean
  ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  const [checkedItems, setCheckedItems] = React.useState<any>({});

  const handleCheckboxChange = (
    checked: boolean,
    option: FilterOption,
    field: Filter
  ) => {
    const { value: fieldValue } = field;
    const { value: optionValue } = option;
    const show = checked;

    // Update checkedItems state based on whether it's single or multi-select
    if (fieldValue === "public" || fieldValue === "active") {
      // Single select behavior (radio-button like behavior)
      setCheckedItems((prevCheckedItems: any) => ({
        ...prevCheckedItems,
        [`field_${fieldValue}`]: show ? optionValue : undefined,
      }));
    } else {
      // Multi select behavior
      setCheckedItems((prevCheckedItems: any) => ({
        ...prevCheckedItems,
        [`option_${fieldValue}_${optionValue}`]: show,
      }));
    }

    // Pass the filter change event to parent component
    onFilterChange(show, fieldValue, optionValue);
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2 text-lg font-bold">Filter</div>
        <div className="flex col-span-4 text-lg font-bold justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setCheckedItems({})}
            className="text-black"
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="accordionForFilter mt-4">
        <Accordion type="single" collapsible className="w-full">
          {filterData.map((field, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b-0"
            >
              <AccordionTrigger>{field.label}</AccordionTrigger>
              <AccordionContent>
                {field.options && (
                  <div className="grid grid-cols-1 gap-2 border border-gray-400 rounded-lg">
                    {field.options.map((option, optIndex) => (
                      <div className="shadow-md pb-2" key={optIndex}>
                        <div className="p-4 flex items-center space-x-2 border-black">
                          <Checkbox
                            id={`option_${optIndex}`}
                            checked={
                              field.value === "public" ||
                              field.value === "active"
                                ? checkedItems[`field_${field.value}`] ===
                                  option.value
                                : (checkedItems[
                                    `option_${field.value}_${option.value}`
                                  ] as boolean)
                            }
                            onCheckedChange={(e: any) => {
                              handleCheckboxChange(e, option, field);
                            }}
                          />
                          <label
                            htmlFor={`option_${optIndex}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default Sidebar;
