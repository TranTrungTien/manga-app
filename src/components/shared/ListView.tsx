import { memo, MouseEvent, useState } from 'react';

import classNames from 'classnames';
import { Comic } from '~/types';
import ListIcon from '../icons/ListIcon';
import LListIcon from '../icons/LListIcon';
import SListIcon from '../icons/SListIcon';
import Card from './Card';

export type LayoutDetails = 'multiple' | 'details' | 'column';

interface Layout {
  style: string;
  details: LayoutDetails;
}

interface IProps {
  numberSkeleton?: number;
  comicList?: Comic[];
  isLoading: boolean;
}

function ListView({ comicList, isLoading, numberSkeleton = 36 }: IProps) {
  const [layout, setLayout] = useState<Layout>({
    style: 'md:grid-cols-5 grid-cols-2',
    details: 'multiple',
  });

  const handleChangeLayout = (e: MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.dataset.id) {
      case 'column':
        setLayout({
          style: 'grid-cols-1',
          details: 'column',
        });
        break;
      case 'details':
        setLayout({
          style: 'md:grid-cols-3 grid-cols-1',
          details: 'details',
        });
        break;
      case 'multiple':
        setLayout({
          style: 'md:grid-cols-5 grid-cols-2',
          details: 'multiple',
        });
        break;
    }
  };

  return (
    <div className="min-h-[500px] w-full">
      <div className="flex h-[50px] w-full items-center justify-end">
        <div className="flex space-x-6  px-4 py-2 text-gray-400 lg:space-x-4">
          <button
            className={`${
              layout.details === 'multiple' ? 'text-gray-200' : ''
            } transition-all hover:text-gray-200`}
            data-id="multiple"
            onClick={handleChangeLayout}
          >
            <SListIcon style="w-8 h-8" />
          </button>
          <button
            className={`${
              layout.details === 'details' ? 'text-gray-200' : ''
            } transition-all hover:text-gray-200`}
            data-id="details"
            onClick={handleChangeLayout}
          >
            <LListIcon style="w-8 h-8" />
          </button>
          <button
            data-id="column"
            className={`${
              layout.details === 'column' ? 'text-gray-200' : ''
            } hidden transition-all hover:text-gray-200 md:block`}
            onClick={handleChangeLayout}
          >
            <ListIcon style="w-8 h-8" />
          </button>
        </div>
      </div>
      {/* list render  */}
      <div
        key={layout.style}
        className={classNames('grid gap-6 lg:gap-10', layout.style)}
      >
        {comicList?.map((comic, index) => {
          return (
            <Card
              isLoading={isLoading}
              comic={{
                ...comic,
                // genres: isObject(comic.genres[0])
                //   ? comic.genres.map(
                //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //       // @ts-ignore
                //       (genre) => genre.label,
                //     )
                //   : comic.genres,
              }}
              key={comic.slug || index}
              details={layout.details}
            />
          );
        })}
        {isLoading
          ? Array.from(Array(numberSkeleton).keys()).map((e) => {
              return (
                <Card
                  isLoading
                  comic={{} as Comic}
                  key={e}
                  details={layout.details}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

export default memo(ListView);
