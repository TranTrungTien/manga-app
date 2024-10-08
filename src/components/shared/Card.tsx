import classNames from 'classnames';
import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import NProgress from 'nprogress';
import { memo, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import {
  COMIC_GENRES,
  GENRES_NT,
  MANGA_BROWSE_PAGE,
  MANGA_PATH_DETAILS_NAME,
  MANGA_PATH_NAME,
  SOURCE_COLLECTIONS,
  STATUS_MAPPING,
  TailwindColors,
} from '~/constants';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Comic, Manga } from '~/types';
import { randomColors } from '~/utils/randomColors';

import { LayoutDetails } from './ListView';

interface CardProps {
  details: LayoutDetails;
  comic: Comic;
  isLoading: boolean;
}

const animationVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

function Card({ details, comic, isLoading }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  const controls = useAnimationControls();

  const commonStyles = `animate__faster animate__animated animate__zoomIn  rounded-2xl  overflow-hidden`;

  useEffect(() => {
    if (loaded) {
      controls.start('visible');
    }
  }, [loaded]);

  if (details === 'details') {
    return (
      <div
        className={classNames(
          commonStyles,
          'aspect-h-1 aspect-w-2 bg-deep-black',
        )}
      >
        <div className="flex h-full w-full  ">
          <figure className="relative h-full w-[35%] hover:cursor-pointer">
            {isLoading ? (
              <div className="loading-pulse h-full w-full rounded-xl bg-white/20"></div>
            ) : (
              <motion.div
                className="relative h-full w-full"
                initial={'hidden'}
                animate={controls}
                variants={animationVariants}
                transition={{ ease: 'easeOut', duration: 1 }}
                // onClick={() => {
                //   NProgress.start();
                // }}
              >
                <Link
                  href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic?.slug}`}
                >
                  <Image
                    priority
                    alt="manga-thumbnail"
                    layout="fill"
                    className="absolute inset-0 rounded-xl object-cover object-center"
                    src={`https://img.otruyenapi.com/uploads/comics/${comic?.thumb_url}`}
                    onLoad={() => setLoaded(true)}
                  />
                </Link>
              </motion.div>
            )}
          </figure>
          <div className="flex h-full flex-1 flex-col space-y-4  p-4 text-white">
            {isLoading ? (
              <div className="loading-pulse h-full space-y-4">
                <div className="min-h-[12%] w-full rounded-md bg-white/20"></div>
                <div className="min-h-[12%] w-full rounded-md bg-white/20"></div>
                <div className="min-h-[12%] w-full rounded-md bg-white/20"></div>
                <div className="min-h-[12%] w-full rounded-md bg-white/20"></div>
              </div>
            ) : (
              <>
                <Link
                  href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic?.slug}`}
                >
                  <a
                    // onClick={NProgress.start}
                    className="md:space-y-2 xl:space-y-4"
                  >
                    <h1 className="fond-bold line-clamp-2 h-fit min-h-[20px] w-full font-bold transition-all hover:text-primary ssm:text-3xl md:text-xl lg:text-3xl">
                      {comic?.name}
                    </h1>
                    <h2 className="line-clamp-3 h-fit w-full font-light ssm:text-xl md:line-clamp-2 md:text-sm lg:line-clamp-3 xl:text-xl">
                      {
                        comic?.chaptersLatest?.[
                          comic?.chaptersLatest?.length - 1
                        ]?.filename
                      }
                    </h2>
                    <h3 className="text-xs text-gray-300 lg:text-lg">
                      {STATUS_MAPPING[comic?.status] || comic?.status}
                    </h3>
                  </a>
                </Link>

                <div className="h-fit w-full flex-1 md:max-h-[15px] lg:h-fit">
                  <ul className="flex w-full flex-wrap items-center gap-2 overflow-hidden   text-lg md:text-sm xl:text-lg">
                    {comic?.category?.map((genre, index) => {
                      if (index > 3 || !genre) return null;

                      return (
                        <li
                          key={genre?.id || index}
                          className="h-fit w-fit overflow-hidden whitespace-nowrap rounded-lg border-[1px] border-gray-400 px-2 transition-all hover:scale-90 hover:cursor-pointer"
                          style={{
                            color: randomColors(TailwindColors, index),
                          }}
                          // onClick={NProgress.start}
                        >
                          <Link
                            href={`/${MANGA_BROWSE_PAGE}?genres=${genre?.slug}`}
                          >
                            <a>{genre?.name}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (details === 'column') {
    return (
      <div
        className={classNames(
          commonStyles,
          'mx-auto h-[100px] w-[95%] bg-deep-black',
        )}
      >
        <div className="flex h-full w-full">
          <figure className="relative h-full w-[10%] hover:cursor-pointer lg:w-[7%]">
            {isLoading ? (
              <Skeleton
                className="h-full w-full"
                baseColor="#202020"
                highlightColor="#2d2d2d"
              />
            ) : (
              <motion.div
                className="relative h-full w-full"
                initial={'hidden'}
                animate={controls}
                variants={animationVariants}
                transition={{ ease: 'easeOut', duration: 1 }}
                // onClick={NProgress.start}
              >
                <Link
                  href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic?.slug}`}
                >
                  <Image
                    priority
                    alt="manga-thumbnail"
                    layout="fill"
                    className="absolute inset-0 rounded-xl object-cover object-center"
                    src={`https://img.otruyenapi.com/uploads/comics/${comic?.thumb_url}`}
                    onLoad={() => setLoaded(true)}
                  />
                </Link>
              </motion.div>
            )}
          </figure>
          <div className="flex flex-1 p-4 text-white">
            <div className="h-full w-[75%]">
              {isLoading ? (
                <Skeleton
                  className="line-clamp-1 rounded-xl font-secondary text-3xl"
                  baseColor="#202020"
                  highlightColor="#2d2d2d"
                />
              ) : (
                <Link
                  href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic?.slug}`}
                >
                  <h1
                    // onClick={NProgress.start}
                    className="line-clamp-1 font-secondary text-3xl transition-all hover:cursor-pointer hover:text-primary"
                  >
                    {comic?.name}
                  </h1>
                </Link>
              )}

              <div className="h-full flex-1">
                {isLoading ? (
                  <Skeleton
                    className="my-4 flex flex-wrap gap-4 py-4"
                    baseColor="#202020"
                    highlightColor="#2d2d2d"
                  />
                ) : (
                  <ul className="flex flex-wrap gap-4 py-4">
                    {comic?.category?.map((genre, index) => {
                      if (!genre) return null;
                      return (
                        <li
                          key={genre.id || index}
                          className="h-fit w-fit rounded-lg border-[1px] border-gray-500 px-2 py-1 text-xl transition-all hover:scale-95"
                          style={{
                            color: randomColors(TailwindColors, index),
                          }}
                          // onClick={NProgress.start}
                        >
                          <Link
                            href={`/${MANGA_BROWSE_PAGE}?genres=${genre?.slug}`}
                          >
                            <a>{genre?.name}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex h-full w-[25%] items-start">
              {!isLoading && (
                <p className="flex space-x-4">
                  <div className="flex-1">
                    <BookOpenIcon className="h-8 w-8" />
                  </div>
                  <span>
                    {
                      comic?.chaptersLatest?.[comic?.chaptersLatest?.length - 1]
                        ?.filename
                    }
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'aspect-h-5 aspect-w-3',
        !isLoading && commonStyles,
      )}
    >
      <div className="flex h-full w-full flex-col p-2 text-white lg:p-4">
        <figure className="h-[92%] max-h-[250px] transition-all hover:scale-90 hover:cursor-pointer lg:max-h-[450px]">
          {isLoading ? (
            <div className="loading-pulse h-full w-full rounded-xl bg-white/20"></div>
          ) : (
            <motion.div
              className="relative h-full w-full"
              initial={'hidden'}
              animate={controls}
              variants={animationVariants}
              transition={{ ease: 'easeOut', duration: 1 }}
              // onClick={() => {
              //   NProgress.start();
              // }}
            >
              <Link
                href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic?.slug}`}
              >
                <Image
                  priority
                  alt="manga-thumbnail"
                  layout="fill"
                  className="absolute inset-0 rounded-xl object-cover object-center"
                  src={`https://img.otruyenapi.com/uploads/comics/${comic?.thumb_url}`}
                  onLoad={() => setLoaded(true)}
                />
              </Link>
            </motion.div>
          )}
        </figure>

        {isLoading ? (
          <div className="loading-pulse mt-4 h-[10%] w-full rounded-lg bg-white/20"></div>
        ) : (
          <h1 className="my-2 line-clamp-1 items-center px-4 font-secondary text-lg transition-all hover:text-primary md:text-2xl lg:text-3xl">
            <Link
              href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic?.slug}`}
            >
              <a>{comic?.name}</a>
            </Link>
          </h1>
        )}
      </div>
    </div>
  );
}
export default memo(Card);
