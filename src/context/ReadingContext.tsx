import { createContext, ReactNode, useContext } from 'react';
import { IChapterData, NavigateDirection, Page } from '~/types';

interface ReadingContextIProps {
  loading: boolean;
  images: Page[];
  currentChapter?: IChapterData;
  navigateChapter: (type: NavigateDirection) => void;
}

interface ReadingContextProps {
  children: ReactNode;
  value: ReadingContextIProps;
}

const ReadingContext = createContext<ReadingContextIProps | null>(null);

export const ReadingContextProvider = ({
  children,
  value,
}: ReadingContextProps) => {
  return (
    <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>
  );
};

export default function useReading() {
  return useContext(ReadingContext);
}
