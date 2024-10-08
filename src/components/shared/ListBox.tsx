import { MouseEvent, memo, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useOnClickOutside } from 'usehooks-ts';

interface ListBoxProps {
  highlightSelect?: string;
  style?: string;
  title?: string;
  backgroundColor?: string;
  activeBackgroundColor?: string;
  defaultOption?: string;
  options: Array<string>;
  handleSelect: (value: string) => void;
}

function ListBox({
  options,
  title,
  style,
  backgroundColor,
  activeBackgroundColor,
  highlightSelect,
  defaultOption,
  handleSelect,
}: ListBoxProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [option, setOption] = useState('');

  useOnClickOutside(ref, () => {
    if (showOptions) {
      setShowOptions(false);
    }
  });

  const handleOpenOptions = () => {
    setShowOptions((prevState) => !prevState);
  };

  const handleSelectOption = (e: MouseEvent<HTMLLIElement>) => {
    setOption(e.currentTarget.innerText);
    handleSelect(e.currentTarget.innerText);
  };

  return (
    <button
      ref={ref}
      onClick={handleOpenOptions}
      className={`absolute-center relative w-full ${style} ${
        showOptions ? activeBackgroundColor : backgroundColor
      }`}
    >
      {title} <span className={highlightSelect}>{option || defaultOption}</span>
      {showOptions ? (
        <ChevronUpIcon className="animate__rotateIn animate__animated animate__faster h-8 w-8" />
      ) : (
        <ChevronDownIcon className="animate__rotateIn animate__animated animate__faster h-8 w-8" />
      )}
      {showOptions && (
        <ul className="animate__fadeIn animate__animated animate__faster absolute left-0 top-full z-[500] w-full space-y-4 rounded-xl bg-black/80 py-4">
          {options.length > 0 &&
            options.map((option, index) => {
              return (
                <li
                  onClick={handleSelectOption}
                  key={index}
                  className={`line-clamp-1  rounded-lg transition-all hover:bg-highlight`}
                >
                  {option}
                </li>
              );
            })}
        </ul>
      )}
    </button>
  );
}

export default memo(ListBox);
