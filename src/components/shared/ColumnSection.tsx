import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { BsDot } from 'react-icons/bs';
import { MANGA_PATH_DETAILS_NAME, MANGA_PATH_NAME } from '~/constants';
import { Comic } from '~/types';

interface IProps {
  title?: string;
  link: string;
  comics?: Comic[];
}

const ColumnSection = ({ title, comics, link }: IProps) => {
  return (
    <div className="w-full rounded-xl bg-deep-black pb-4 lg:my-4">
      {title && (
        <h2 className="my-6 whitespace-nowrap text-center font-secondary text-3xl text-white lg:text-[160%]">
          {title}
        </h2>
      )}
      <ul className="w-full space-y-4 overflow-hidden text-white">
        {comics?.map((comic) => {
          return (
            <li
              key={comic?._id}
              className="flex w-full px-4 py-2 odd:bg-highlight/40"
            >
              <Link
                href={{
                  pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                    comic?.slug,
                  )}`,
                }}
              >
                <a>
                  <figure className="relative h-[80px] min-h-[80px] w-[60px] min-w-[60px] overflow-hidden rounded-xl">
                    <Image
                      className="aspect-h-4 aspect-w-3 absolute object-cover object-center"
                      layout="fill"
                      alt="img-preview"
                      src={`https://img.otruyenapi.com/uploads/comics/${comic?.thumb_url}`}
                    />
                  </figure>
                </a>
              </Link>

              <div className="flex w-full flex-col justify-center space-y-2 pl-4 ">
                <Link
                  href={{
                    pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                      comic?.slug,
                    )}`,
                  }}
                >
                  <a>
                    <h3 className="line-clamp-1 font-secondary text-2xl font-semibold transition-all hover:cursor-pointer hover:text-primary md:text-3xl">
                      {comic?.name}
                    </h3>
                  </a>
                </Link>

                <h4 className="text-lg">
                  Chap{' '}
                  {
                    comic?.chaptersLatest[comic?.chaptersLatest?.length - 1]
                      ?.chapter_name
                  }
                </h4>
                <ul className="flex flex-wrap items-center text-base lg:text-xl">
                  {comic?.category?.map((genre, idx) => {
                    if (!genre) return;

                    return (
                      <li className="inline-block" key={genre?.id}>
                        <span>{genre?.name}</span>
                        {idx !== comic?.category?.length - 1 && (
                          <span>
                            <BsDot className="inline-block" />
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}

        <li className="flex w-full items-center justify-center rounded-xl px-4 py-4 transition-all hover:cursor-pointer hover:bg-highlight">
          <button className="lg:text-3xl">
            <Link href={link}>
              <a>Xem thêm</a>
            </Link>
          </button>
          <ChevronRightIcon className="h-8 w-8" />
        </li>
      </ul>
    </div>
  );
};

export default ColumnSection;
