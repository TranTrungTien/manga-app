import {
  ClipboardIcon,
  ClockIcon,
  InformationCircleIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import NProgress from 'nprogress';
import { memo, MouseEvent, useState } from 'react';
import { BiGlasses } from 'react-icons/bi';
import { useMediaQuery } from 'usehooks-ts';
import ImageWraper from '~/components/shared/ImageWrapper';
import {
  MANGA_PATH_DETAILS_NAME,
  MANGA_PATH_NAME,
  STATUS_MAPPING,
} from '~/constants';
import useChapters from '~/hooks/useChapters';
import { Comic } from '~/types';

interface IProps {
  comic?: Comic;
}

const SectionSwiperCard = ({ comic }: Readonly<IProps>) => {
  const chapters = useChapters();
  const matches = useMediaQuery('(min-width: 1259px)');
  const [showPreview, setShowPreview] = useState(false);

  const handleGoToFirstChapter = async (
    e: MouseEvent<HTMLButtonElement>,
    slug: string,
  ) => {
    e.preventDefault();
    if (slug) chapters.goToFirstChapter(slug);
  };

  const handleMouse = (value: boolean) => {
    setShowPreview(value);
  };

  return (
    <div
      className="aspect-h-4 aspect-w-3 rounded-xl"
      onMouseEnter={() => handleMouse(true)}
      onMouseLeave={() => handleMouse(false)}
    >
      {comic ? (
        <>
          <Link
            href={{
              pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                comic?.slug,
              )}`,
            }}
          >
            {/* onClick={NProgress.start}  */}
            <a>
              <ImageWraper>
                <Image
                  priority
                  className="fancy-fade-in absolute left-0 top-0 rounded-xl object-cover object-center"
                  alt="manga-thumbnail"
                  src={`https://img.otruyenapi.com/uploads/comics/${comic?.thumb_url}`}
                  layout="fill"
                />
              </ImageWraper>
            </a>
          </Link>
          <span className="absolute left-2 top-2 h-fit w-fit rounded-xl bg-white bg-opacity-40 px-4 py-2 text-base backdrop-blur-md md:text-xl lg:text-3xl">
            Chap {comic?.chaptersLatest[0].chapter_name}
          </span>
          {matches && showPreview && (
            <div className="animate__faster animate__animated animate__fadeIn flex h-full w-full flex-col space-y-2 overflow-hidden rounded-xl bg-highlight/85 text-white">
              <Link
                href={{
                  pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                    comic?.slug,
                  )}`,
                }}
              >
                {/* onClick={NProgress.start}  */}

                <a>
                  <h3 className="ml-4 mt-4 line-clamp-2 min-h-[40px] text-[100%] font-semibold hover:text-primary">
                    {comic?.name}
                  </h3>
                </a>
              </Link>
              <p className="ml-4 flex flex-nowrap items-center">
                <ClipboardIcon className="h-6 w-6" />
                <span className="ml-2 line-clamp-1 text-[90%]">
                  Chap {comic?.chaptersLatest[0].chapter_name}
                </span>
              </p>
              <p className="ml-4 flex items-center">
                <ClockIcon className="h-6 w-6" />
                <span className="ml-2 text-[90%]">
                  {dayjs(comic?.updatedAt).format('DD/MM/YYYY')}
                </span>
              </p>
              <p className="ml-4 flex items-center">
                <SignalIcon className="h-6 w-6" />
                <span className="ml-2 text-[90%]">
                  {STATUS_MAPPING[comic?.status]}
                </span>
              </p>

              <div className="flex h-fit w-full flex-col items-center space-y-4 py-6">
                <button
                  data-id={comic?.slug}
                  onClick={(e) => handleGoToFirstChapter(e, comic?.slug)}
                  className="flex w-fit items-center justify-center space-x-4 rounded-xl bg-primary px-4 py-2 transition-all hover:scale-[110%]"
                >
                  <BiGlasses /> <span>Đọc ngay</span>
                </button>
                <button className="flex w-fit items-center justify-center space-x-4 rounded-xl bg-white px-4 py-2 text-gray-700 transition-all hover:scale-[110%]">
                  <InformationCircleIcon className="h-6 w-6" />
                  <Link
                    href={{
                      pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                        comic?.slug,
                      )}`,
                    }}
                  >
                    {/* onClick={NProgress.start}  */}

                    <a>Thông tin</a>
                  </Link>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="loading-pulse h-full w-full rounded-xl bg-white/20"></div>
      )}
    </div>
  );
};

export default SectionSwiperCard;
