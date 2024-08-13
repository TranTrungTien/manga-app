import { useSetAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import NProgress from 'nprogress';
import { memo } from 'react';
import { searchModalState } from '~/atoms/searchModelAtom';
import {
  MANGA_PATH_DETAILS_NAME,
  MANGA_PATH_NAME,
  TailwindColors,
} from '~/constants';
import { Comic } from '~/types';
import { randomColors } from '~/utils/randomColors';

interface IProps {
  comics: Comic[];
}

function SearchResult({ comics }: Readonly<IProps>) {
  const setShowModal = useSetAtom(searchModalState);

  return (
    <div className="min-h-fit w-full">
      <ul className="h-fit w-full space-y-5">
        {comics?.map((comic) => {
          return (
            <li
              key={comic._id}
              className="h-fit overflow-x-hidden bg-secondary py-4"
              onClick={() => {
                setShowModal(false);
                // NProgress.start();
              }}
            >
              <Link
                href={{
                  pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                    comic.slug,
                  )}`,
                }}
              >
                <a className="flex h-full space-x-2">
                  {/* thumbnail  */}
                  <figure className="aspect-w-3 relative ml-4 mt-4 h-[120px] w-[90px] min-w-[85px] overflow-hidden rounded-xl">
                    <Image
                      priority
                      className="absolute inset-0 object-cover object-center"
                      layout="fill"
                      alt={'img-preview'}
                      src={`https://img.otruyenapi.com/uploads/comics/${comic?.thumb_url}`}
                    />
                  </figure>

                  {/* data info  */}
                  <div className="flex h-full flex-1 flex-col space-y-4 text-white transition-all hover:text-primary ">
                    <h2 className="mx-4 mt-4 line-clamp-1 w-full overflow-hidden font-secondary text-2xl md:text-4xl">
                      {comic?.name}
                    </h2>
                    <h4 className="mx-4 line-clamp-1 text-base md:text-2xl">
                      Chap{' '}
                      {
                        comic?.chaptersLatest[comic.chaptersLatest?.length - 1]
                          .chapter_name
                      }
                    </h4>
                    {/* genres  */}
                    <ul className={`flex h-[50%] flex-wrap  `}>
                      {comic?.category.map((genre, idx) => {
                        if (!genre) return;

                        return (
                          <li
                            style={{
                              color: randomColors(TailwindColors, idx),
                            }}
                            key={genre?.id}
                            className={`absolute-center m-2 h-[40%] w-[75px] rounded-xl bg-background text-[60%]  md:w-fit md:text-xl`}
                          >
                            <span className="p-4">{genre?.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default memo(SearchResult);
