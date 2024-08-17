import { memo, useEffect } from 'react';
import useSettingsMode from '~/context/SettingsContext';
import { Page } from '~/types';

import VerticalImages from '../shared/VerticalImages';

interface IProps {
  images: Page[];
  matchesTouchScreen: boolean;
  currentPage: number;
  handleSaveCurrentPage: (page: number) => void;
}

function VerticalReading({
  images,
  matchesTouchScreen,
  currentPage,
  handleSaveCurrentPage,
}: Readonly<IProps>) {
  const settings = useSettingsMode();

  useEffect(() => {
    const refCurrentpage = document.querySelector(`#page-${currentPage}`);

    if (refCurrentpage) {
      refCurrentpage.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${matchesTouchScreen && 'pt-24'} mx-auto w-full ${
        settings?.imageMode === 'fitW' ? 'lg:w-full' : 'lg:w-[60%]'
      }`}
    >
      <VerticalImages
        handleSaveCurrentPage={handleSaveCurrentPage}
        images={images}
      />
    </div>
  );
}

export default memo(VerticalReading);
