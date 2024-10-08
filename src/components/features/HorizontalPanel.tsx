import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { chapterModal } from '~/atoms/chapterModalAtom';
import { settingsModal } from '~/atoms/settingsModalAtom';
import { MANGA_PATH_DETAILS_NAME, MANGA_PATH_NAME } from '~/constants';
import useReading from '~/context/ReadingContext';
import useMultipleSources from '~/context/SourcesContext';
import { NavigateDirection } from '~/types';
import {
  ArrowLeftIcon,
  ArrowLongLeftIcon,
  ArrowRightIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

export default function HorizontalSettings() {
  const read = useReading();
  const multipleSources = useMultipleSources();
  const setShowModal = useSetAtom(chapterModal);
  const setSettingsModal = useSetAtom(settingsModal);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleOpenSettingsModal = () => {
    setSettingsModal(true);
  };

  const handleNavigateChapter = (e: MouseEvent<HTMLButtonElement>) => {
    read?.navigateChapter(e.currentTarget.dataset.id as NavigateDirection);
  };

  return (
    <div className="slideUpReturn magictime fixed left-0 top-0 z-[999] h-[60px] w-full bg-[#141313]">
      <div className="flex h-full w-full items-center justify-between text-lg md:text-2xl">
        <div className="flex h-full w-fit items-center justify-evenly gap-4 px-4 md:space-x-4">
          <Link
            href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${multipleSources?.chaptersDetail?.slug}`}
          >
            <a>
              <ArrowLongLeftIcon className="h-8 w-8" />
            </a>
          </Link>

          <h1 className="fond-bold line-clamp-1 h-fit w-[25%] capitalize md:w-[30%] ">
            {multipleSources?.chaptersDetail?.name || ''}
          </h1>

          <button
            onClick={handleOpenModal}
            className="line-clamp-1 h-[60%] w-fit max-w-[80px] whitespace-nowrap rounded-xl bg-highlight p-2 text-base md:text-lg"
          >
            Chapter: {read?.currentChapter?.chapter_name || ''}
          </button>

          <div className="absolute-center h-full w-fit gap-4 md:mx-6">
            <button
              onClick={handleNavigateChapter}
              data-id="prev"
              className="rounded-lg bg-highlight p-4 md:p-4"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>

            <button
              onClick={handleNavigateChapter}
              data-id="next"
              className="rounded-lg bg-highlight p-4 md:p-4 "
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full w-fit items-center pr-2 md:gap-10 md:px-4">
          <button
            onClick={handleOpenSettingsModal}
            className="rounded-lg bg-highlight p-2"
          >
            <CogIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
