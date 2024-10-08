import { memo, MouseEvent, useEffect, useRef, useState } from 'react';

interface TabSelectProps {
  selections: string[];
  selectAction: (value: string) => void;
}

function TabSelect({ selections, selectAction }: TabSelectProps) {
  const [currentTab, setTabIndex] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(20);
  const effectActive = useRef<HTMLLIElement>(null);

  const handleSelectValue = (e: MouseEvent<HTMLButtonElement>) => {
    const titleValue = e.currentTarget.textContent;
    selectAction(String(titleValue));
  };

  useEffect(() => {
    const currentTabElem = document.querySelector(`#tab-select-${currentTab}`);
    if (effectActive.current)
      effectActive.current.style.cssText = `transform: translateX(${offsetLeft}px); width: ${currentTabElem?.clientWidth}px;`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetLeft]);

  return (
    <div className="my-8 w-full">
      <ul className="relative flex w-full flex-nowrap gap-x-0 overflow-y-hidden rounded-md bg-highlight px-4 py-2 font-secondary text-3xl capitalize scrollbar-hide md:w-fit lg:gap-x-8">
        {selections.map((selection, index) => {
          return (
            <li
              id={`tab-select-${index}`}
              className={`${
                currentTab === index
                  ? ' text-white'
                  : 'bg-transparent text-white/25'
              } z-10 flex-1 whitespace-nowrap rounded-md p-4 text-[14px] transition-all lg:text-2xl`}
              key={index}
            >
              <button
                onClick={(e) => {
                  handleSelectValue(e);
                  setOffsetLeft(e.currentTarget.offsetLeft);
                  setTabIndex(index);
                }}
              >
                {selection}
              </button>
            </li>
          );
        })}

        <li
          ref={effectActive}
          className="selector-menu absolute -left-4 z-0 h-[80%] rounded-md bg-black/40 duration-150 ease-out"
        ></li>
      </ul>
    </div>
  );
}

export default memo(TabSelect);
