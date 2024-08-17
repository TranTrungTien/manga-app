import 'swiper/css';
import 'swiper/css/effect-fade';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { Autoplay, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMediaQuery } from 'usehooks-ts';
import { MANGA_PATH_DETAILS_NAME, MANGA_PATH_NAME } from '~/constants';
import useChapters from '~/hooks/useChapters';
import { Comic } from '~/types';

import SwiperCard from './SwiperCard';

const SwiperButton = dynamic(() => import('../buttons/SwiperButton'));

interface IProps {
  comics: Comic[];
}

const Banner = ({ comics }: IProps) => {
  const chapters = useChapters();
  const matchesTablet = useMediaQuery('(min-width: 768px)');

  const handleGoToFirstChapter = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const mangaSlug = e.currentTarget.dataset.id;

    if (mangaSlug) chapters.goToFirstChapter(mangaSlug);
  };

  return (
    <div className="relative h-[250px] min-h-[250px] w-full overflow-hidden md:h-[350px] md:min-h-[350px] lg:h-[450px] lg:min-h-[450px]">
      <Swiper
        autoHeight={true}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={true}
        modules={[EffectFade, Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
      >
        <div className="absolute-center absolute bottom-1 right-10 z-50 flex h-fit w-fit flex-col space-y-4 lg:bottom-10">
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

        {/* list render  */}
        {comics?.map((comic) => {
          return (
            <SwiperSlide key={comic?.slug}>
              <Link
                href={{
                  pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                    comic?.slug,
                  )}`,
                }}
              >
                <div className="cursor-pointer">
                  <figure
                    style={{
                      backgroundImage: `url(https://img.otruyenapi.com/uploads/comics/${comic?.thumb_url})`,
                    }}
                    className={`deslide-cover h-[250px] min-h-[250px] w-full bg-cover bg-center bg-no-repeat blur md:h-[350px] md:min-h-[350px] lg:h-[450px] lg:min-h-[450px]`}
                  ></figure>
                  <SwiperCard
                    imgSrc={comic?.thumb_url}
                    style="aspect-[3/4] 0 absolute-center absolute top-1/2 right-[5%] md:right-[10%] z-10 flex h-[80%] w-[150px]  -translate-y-1/2 items-center md:w-[200px] lg:w-[250px]"
                    childStyle="relative h-full w-[90%] overflow-hidden rounded-2xl magictime"
                  />
                  <div className="absolute left-5 top-12 z-40 flex h-[70%] w-[50%] flex-col space-x-4 space-y-4 font-secondary text-white md:left-[5%] md:w-[55%]  md:py-4 lg:space-y-6">
                    <h3 className="mx-4 mt-6 text-xl md:text-4xl">
                      Chap{' '}
                      {
                        comic?.chaptersLatest[comic?.chaptersLatest.length - 1]
                          .chapter_name
                      }
                    </h3>
                    <h1 className="line-clamp-1 text-3xl transition-all hover:text-primary md:min-h-[30px] md:text-6xl">
                      {comic?.name}
                    </h1>
                    <h5 className="line-clamp-3 text-sm md:text-2xl">
                      {comic?.origin_name?.[0]}
                    </h5>
                    <ul className="hidden space-x-4 text-lg md:flex">
                      {comic?.category?.map((genre) => {
                        return (
                          <li
                            key={genre.id}
                            className="line-clamp-1 flex w-fit max-w-[100px] items-center whitespace-nowrap rounded-xl border-[1px] border-white px-4 py-2"
                          >
                            {genre.name}
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex space-x-6 text-xl md:text-2xl lg:pt-6">
                      <button
                        data-id={comic?.slug}
                        onClick={handleGoToFirstChapter}
                        className="absolute-center rounded-xl bg-primary px-5 py-3 transition-all   hover:scale-110 md:w-[100px]"
                      >
                        Đọc ngay
                      </button>

                      <Link
                        href={{
                          pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                            comic?.slug,
                          )}`,
                        }}
                      >
                        <a>
                          <button className="absolute-center rounded-xl bg-white px-5 py-3 text-gray-800 transition-all  hover:scale-110 md:w-[100px]">
                            Chi tiết
                          </button>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Banner;
