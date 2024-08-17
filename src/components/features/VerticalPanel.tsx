import LogoSVG from '/public/images/torii-gate-japan.svg';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, MouseEvent, useRef, useState } from 'react';
import { mangaSources } from '~/atoms/mangaSourcesAtom';
import { mangaSrc } from '~/atoms/mangaSrcAtom';
import { MANGA_PATH_DETAILS_NAME, MANGA_PATH_NAME } from '~/constants';
import useReading from '~/context/ReadingContext';
import useSettingsMode from '~/context/SettingsContext';
import useMultipleSources from '~/context/SourcesContext';
import { NavigateDirection, SourcesId } from '~/types';
import { useSetAtom } from 'jotai';
import {
  ArrowLeftIcon,
  ArrowLongLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

import TextLogo from '../icons/TextLogo';
import DetailsChapterList from '../shared/DetailsChapterList';
import ListBox from '../shared/ListBox';
import Image from 'next/image';

interface IProps {
  handleClose: () => void;
}

function SettingsSide({ handleClose }: IProps) {
  const reader = useReading();
  const settings = useSettingsMode();
  const setSrc = useSetAtom(mangaSrc);
  const multipleSources = useMultipleSources();
  const [isHovering, setIsHovering] = useState(false);
  const availableSource = useAtomValue(mangaSources);
  const sideSettingsRef = useRef<HTMLDivElement>(null);

  const handleCloseSideSettings = () => {
    handleClose();
  };

  const handleSourceSettings = (value: string) => {
    setSrc(value as SourcesId);
  };

  const handleShowSettingsMode = () => {
    settings?.toggleSettings();
  };

  const handleNavigateChapter = (e: MouseEvent<HTMLButtonElement>) => {
    // reader?.navigateChapter(e.currentTarget.dataset.id as NavigateDirection);
  };

  return (
    <aside
      ref={sideSettingsRef}
      className="flex min-h-screen min-w-[250px] max-w-[250px] flex-col gap-8 overflow-hidden bg-highlight/60 px-4 text-white transition-all"
    >
      {/* logo & control */}
      <div className="absolute-center my-2 h-[70px] w-full border-b-2 border-white/5">
        <Link
          href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${multipleSources?.chaptersDetail?.slug}`}
        >
          <a>
            <button className="rounded-full p-4 transition-all hover:bg-white/25">
              <ArrowLongLeftIcon className="h-8 w-8" />
            </button>
          </a>
        </Link>

        <figure className="relative h-fit flex-1">
          <Link href="/">
            <Image
              src="/images/logo-bottom.png"
              alt="logo top"
              width={250}
              height={100}
              objectFit="contain"
            />
          </Link>
        </figure>
        <button
          onClick={handleCloseSideSettings}
          className="rounded-full p-4 transition-all hover:bg-white/25"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
      </div>
      {/* manga title  */}
      <h1 className="w-ful line-clamp-2 font-secondary font-bold capitalize">
        {multipleSources?.chaptersDetail?.name || ''}
      </h1>

      <h2>{`Chapter: ${reader?.currentChapter?.chapter_name || ''}`}</h2>

      <ListBox
        handleSelect={handleSourceSettings}
        style="rounded-xl p-4 gap-2 transition-all"
        title="Nguồn: "
        defaultOption="OTruyen"
        options={availableSource.map((src) => src.sourceName)}
        backgroundColor="bg-highlight"
        activeBackgroundColor="bg-primary"
      />

      <div className="flex justify-between gap-2">
        <button
          onClick={handleNavigateChapter}
          data-id="prev"
          className="absolute-center w-[40%] rounded-lg bg-highlight px-8 py-4 transition-all hover:bg-highlight/40"
        >
          <ArrowLeftIcon className="h-8 w-8" />
        </button>
        <button
          onClick={handleNavigateChapter}
          data-id="next"
          className="absolute-center w-[40%] rounded-lg bg-highlight px-8 py-4 transition-all hover:bg-highlight/40"
        >
          <ArrowRightIcon className="h-8 w-8" />
        </button>
      </div>

      <div className="flex h-fit w-full flex-col overflow-x-hidden rounded-xl bg-highlight">
        <DetailsChapterList
          highlightCurrentChapter
          maxWTitleMobile={90}
          containerStyle="flex h-fit w-full flex-col overflow-x-hidden rounded-xl bg-highlight"
          mobileHeight={300}
          selectSource={false}
          chapterInfo={multipleSources?.chaptersDetail}
          mobileUI={true}
          chapterList={
            multipleSources?.chaptersDetail?.chapters?.[0]?.server_data || []
          }
        />
      </div>

      <button
        onClick={handleShowSettingsMode}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`absolute-center gap-4 transition-all hover:text-primary`}
      >
        <CogIcon
          className={`${
            isHovering && 'animate__rotateIn'
          } animate__animated animate__faster h-8 w-8 transition-all`}
        />
        Cài đặt
      </button>
    </aside>
  );
}

export default memo(SettingsSide);
