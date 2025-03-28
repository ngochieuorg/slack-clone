import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import { Button } from './ui/button';

interface MultiSelectProps {
  options: {
    value: string;
    component: React.ReactNode;
    label?: string;
    disabled?: boolean;
  }[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  placeHolder: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedOptions,
  onChange,
  placeHolder,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [filterText, setFilterText] = React.useState<string>('');
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string) => {
    if (selectedOptions.includes(value)) {
      onChange(selectedOptions.filter((selected) => selected !== value));
    } else {
      onChange([...selectedOptions, value]);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          onClick={handleToggle}
        >
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((value, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-2 bg-sky-100 rounded-md h-min"
                >
                  {options.find((option) => option.value === value)?.component}
                  <Button
                    variant="ghost"
                    className="p-1 h-min"
                    onClick={() => {
                      onChange(
                        [...selectedOptions].filter((item) => item !== value)
                      );
                    }}
                  >
                    <XIcon size="16" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            placeHolder
          )}
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <input
              type="text"
              className="w-full px-2 py-1 border-b border-gray-300 focus:outline-none"
              placeholder="Filter options..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className={cn(
                  'cursor-pointer select-none relative flex items-center w-full pr-2',
                  selectedOptions.includes(option.value)
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-gray-900',
                  !option.disabled && 'hover:bg-sky-600 hover:text-white',
                  option.disabled && 'text-muted-foreground'
                )}
                onClick={() => {
                  if (!option.disabled) {
                    handleOptionClick(option.value);
                  }
                }}
              >
                <span
                  className={cn(
                    'inset-y-0 left-0 flex items-center pl-2 opacity-0 px-1',
                    selectedOptions.includes(option.value) && 'opacity-100'
                  )}
                >
                  <CheckIcon className="h-4 w-4 " />
                </span>
                <span
                  className={cn(
                    'block truncate flex-1',
                    selectedOptions.includes(option.value)
                      ? 'font-medium'
                      : 'font-normal'
                  )}
                >
                  {option.component}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
