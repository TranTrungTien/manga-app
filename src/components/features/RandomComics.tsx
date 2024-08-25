// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { FaRandom } from 'react-icons/fa';
import { EffectFade, Mousewheel, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMediaQuery } from 'usehooks-ts';
import { MANGA_PATH_DETAILS_NAME, MANGA_PATH_NAME } from '~/constants';
import { Comic } from '~/types';
import { removeHTMLTags } from '~/utils/stringHandler';

const SwiperButton = dynamic(() => import('../buttons/SwiperButton'));

type IProps = {
  manga: Comic;
};

const RandomComics = ({ manga }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const matchesTablet = useMediaQuery('(min-width: 768px)');
  const slideContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-fit w-full flex-col text-white">
      <button className="absolute-center w-fit space-x-4 rounded-lg bg-highlight p-4 transition-all duration-200 hover:bg-white/20">
        <span>Random Truyện</span> <FaRandom className="inline-block h-8 w-8" />
      </button>

      <div
        ref={slideContainerRef}
        className="my-4 flex h-[230px] items-center overflow-hidden rounded-xl bg-gradient-to-r from-deep-black to-highlight md:h-[300px] lg:h-[350px]"
      >
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={30}
          mousewheel
          loop
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Mousewheel, Pagination, EffectFade]}
          className="relative h-full w-full hover:cursor-grab"
        >
          <div className="absolute left-4 top-4 flex h-fit w-fit space-x-4">
            {matchesTablet && (
              <>
                <SwiperButton
                  type="prev"
                  styleButton="transition-all absolute-center z-[300] md:h-16 md:w-16 w-14 h-14 rounded-2xl text-white bg-highlight hover:bg-primary"
                  styleIcon="h-10 w-10"
                />
                <SwiperButton
                  type="next"
                  styleButton="transition-all absolute-center z-[300] md:h-16 md:w-16 w-14 h-14 rounded-2xl text-white bg-highlight hover:bg-primary"
                  styleIcon="h-10 w-10"
                />
              </>
            )}
          </div>

          {manga && !isLoading && (
            <SwiperSlide
              key={manga?._id}
              className="flex h-full w-full items-center"
            >
              <div className="flex h-3/4 w-[60%] flex-col space-y-2 px-4 md:space-y-4 md:py-6">
                <h1 className="my-2 line-clamp-1 min-h-max font-secondary text-3xl md:text-4xl lg:text-5xl">
                  {manga?.name}
                </h1>
                <h2 className="line-clamp-3 text-xl md:line-clamp-4 md:text-2xl">
                  {removeHTMLTags(manga?.content)}
                </h2>

                <div className="flex w-full flex-1 items-center space-x-4 text-sm md:text-2xl">
                  <Link
                    href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                      manga?.slug,
                    )}`}
                  >
                    <a>
                      <button className="h-fit rounded-xl bg-white p-4 text-gray-800 transition-all duration-200 hover:scale-110">
                        Chi tiết
                      </button>
                    </a>
                  </Link>

                  <button
                    data-id={manga?.slug}
                    className="h-fit rounded-xl bg-primary p-4 transition-all duration-200 hover:scale-110"
                  >
                    Đọc ngay
                  </button>
                </div>
              </div>
              <div className="flex h-full w-3/4 items-center justify-end overflow-hidden md:w-[60%] md:justify-center lg:w-[40%]">
                <figure className="relative h-[200%] w-[80%] rotate-[15deg] border-4 border-white md:w-[70%] md:rotate-[18deg] lg:w-[60%] lg:rotate-[25deg]">
                  <Image
                    priority
                    className="absolute inset-0 h-max w-auto object-cover object-center"
                    src={`https://img.otruyenapi.com/uploads/comics/${manga?.thumb_url}`}
                    alt="comic-img"
                    layout="fill"
                  />
                </figure>
              </div>
            </SwiperSlide>
          )}

          {isLoading && (
            <SwiperSlide className="flex h-full w-full items-center">
              <div className="flex h-3/4 w-[60%] flex-col space-y-2 px-4 md:space-y-4 md:py-6">
                <h1 className="my-2 line-clamp-1 min-h-max font-secondary text-3xl md:text-4xl lg:text-5xl">
                  <div className="loading-pulse h-[20px] w-full rounded-xl bg-white/20 md:h-[30px]"></div>
                </h1>
                <h2 className="line-clamp-3 text-xl md:line-clamp-4 md:text-2xl">
                  <div className="loading-pulse h-[50px] w-full rounded-xl bg-white/20 md:h-[75px]"></div>
                </h2>

                <div className="flex w-full flex-1 items-center space-x-4 text-sm md:text-2xl">
                  <div className="loading-pulse h-[50px] w-[75px] rounded-xl bg-white/20"></div>

                  <div className="loading-pulse h-[50px] w-[75px] rounded-xl bg-white/20"></div>
                </div>
              </div>
              <div className="flex h-full w-3/4 items-center justify-end overflow-hidden md:w-[60%] md:justify-center lg:w-[40%]">
                <figure className="h-[200%] w-[80%] rotate-[15deg] border-4 border-white md:w-[70%] md:rotate-[18deg] lg:w-[60%] lg:rotate-[25deg]">
                  <div className="loading-pulse h-full w-full rounded-xl bg-white/20"></div>
                </figure>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default RandomComics;
