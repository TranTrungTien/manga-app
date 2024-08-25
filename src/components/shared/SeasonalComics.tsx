// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import LazyLoad from 'react-lazy-load';
import { FreeMode, Mousewheel, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ClientOnly from '~/components/shared/ClientOnly';
import {
  MANGA_PATH_DETAILS_NAME,
  MANGA_PATH_NAME,
  STATUS_MAPPING,
} from '~/constants';
import { Comic } from '~/types';

type IProps = {
  mangas: Comic[];
};

const SeasonalComics = ({ mangas }: IProps) => {
  return (
    <div className="my-4 h-[250px] w-full bg-red-500/0 text-white md:h-[300px]">
      <ClientOnly>
        <Swiper
          breakpoints={{
            1: {
              slidesPerView: 1,
            },
            480: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
          }}
          spaceBetween={30}
          mousewheel
          freeMode={true}
          loop
          pagination={{
            clickable: true,
          }}
          modules={[Mousewheel, Pagination, FreeMode]}
          className="section-swiper full-size hover:cursor-grab"
        >
          {mangas?.length
            ? mangas?.map((manga) => {
                return (
                  <LazyLoad key={manga?._id}>
                    <SwiperSlide className="absolute-center pb-4 md:pb-0">
                      <Link
                        href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                          manga?.slug,
                        )}`}
                      >
                        <a className="full-size">
                          <div className="full-size grid grid-cols-5 overflow-hidden rounded-xl bg-deep-black">
                            <figure className="relative col-span-1 md:col-span-2 lg:col-span-1">
                              <Image
                                priority
                                layout="fill"
                                className="absolute inset-0 object-cover object-center"
                                src={`https://img.otruyenapi.com/uploads/comics/${manga?.thumb_url}`}
                                alt="comic-img"
                              />
                            </figure>
                            <div className="col-span-4 flex flex-col px-6 py-2 md:col-span-3 md:space-y-4 lg:col-span-4">
                              <h1 className="line-clamp-2 font-secondary text-3xl transition-all duration-200 hover:text-primary lg:text-4xl">
                                {manga?.name}
                              </h1>

                              <p className="lg:line-clamp-[9] line-clamp-6 text-xl font-light md:text-2xl">
                                Trạng thái: {STATUS_MAPPING[manga?.status]}
                              </p>
                              <p className="lg:line-clamp-[9] line-clamp-6 text-xl font-light md:text-2xl">
                                Chap: {manga?.chaptersLatest[0]?.chapter_name}
                              </p>
                              <p className="lg:line-clamp-[9] line-clamp-6 text-xl font-light md:text-2xl">
                                Cập nhật:
                                {dayjs(manga?.updatedAt).format('DD/MM/YYYY')}
                              </p>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </SwiperSlide>
                  </LazyLoad>
                );
              })
            : Array.from(Array(4).keys()).map((e) => {
                return (
                  <SwiperSlide key={e} className="absolute-center">
                    <a className="full-size">
                      <div className="full-size grid grid-cols-5 overflow-hidden rounded-xl bg-deep-black">
                        <figure className="relative col-span-1">
                          <div className="loading-pulse full-size bg-white/20"></div>
                        </figure>
                        <div className="col-span-4 flex flex-col px-6 py-2 md:space-y-4">
                          <div className="loading-pulse min-h-[30px] w-full rounded-xl bg-white/20"></div>

                          <div className="loading-pulse my-4 min-h-[200px] w-full rounded-xl bg-white/20"></div>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </ClientOnly>
    </div>
  );
};

export default SeasonalComics;
