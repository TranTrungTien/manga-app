import { Toaster } from 'react-hot-toast';
import LazyLoad from 'react-lazy-load';
import useSWR from 'swr';
import RandomComics from '~/components/features/RandomComics';
import ColumnSection from '~/components/shared/ColumnSection';
import Head from '~/components/shared/Head';
import Section from '~/components/shared/Section';
import { MANGA_BROWSE_PAGE, MangaTypesPreview } from '~/constants';
import { axiosClientV2 } from '~/services/axiosClient';
import { Comic } from '~/types';

import type { NextPage } from 'next';
import SeasonalComics from '~/components/shared/SeasonalComics';
import SectionSwiper from '~/components/shared/SectionSwiper';
import ClientOnly from '~/components/shared/ClientOnly';
import Banner from '~/components/shared/Banner';
import shuffle from '~/utils/randomArray';

const onErrorRetry = (
  error: any,
  _: any,
  __: any,
  revalidate: (param: any) => void,
  { retryCount }: { retryCount: number },
) => {
  // Never retry on 404.
  if (error.status === 404) return;

  // Only retry up to 1 time.
  if (retryCount >= 1) return;

  // Retry after 2 seconds.
  setTimeout(() => revalidate({ retryCount }), 2000);
};
interface IProps {
  topAllManga: Comic[];
  topMonthManga: Comic[];
  topWeekManga: Comic[];
  topDayManga: Comic[];
  seasonalComics: Comic[];
}

const Home: NextPage<IProps> = () => {
  // const [showRecommendedComics, setShowRecommendedComics] = useLocalStorage(
  //   'showVoting',
  //   false,
  // );
  const { data: comicsNewUpdated } = useSWR(
    'newUpdated',
    async () => {
      const { data } = await axiosClientV2.get(`/v1/api/home`);
      const { items: comics } = data;
      if (comics?.length) {
        return comics;
      }
      return [];
    },
    {
      onErrorRetry: onErrorRetry,
    },
  );
  const { data: comicsNewRelease } = useSWR(
    'newRelease',
    async () => {
      const { data } = await axiosClientV2.get(`/v1/api/danh-sach/sap-ra-mat`);
      const { items: comics } = data;
      if (comics?.length) {
        return comics;
      }
      return [];
    },
    {
      onErrorRetry: onErrorRetry,
    },
  );

  const { data: newComic } = useSWR(
    'newComic',
    async () => {
      const { data } = await axiosClientV2.get(`/v1/api/danh-sach/truyen-moi`);
      const { items: comics } = data;
      if (comics?.length) {
        return comics;
      }
      return [];
    },
    {
      onErrorRetry: onErrorRetry,
    },
  );

  const { data: releasingComic } = useSWR(
    'releasingComic',
    async () => {
      const { data } = await axiosClientV2.get(
        `/v1/api/danh-sach/dang-phat-hanh`,
      );

      const { items: comics } = data;
      if (comics?.length) {
        return comics;
      }
      return [];
    },
    {
      onErrorRetry: onErrorRetry,
    },
  );

  const { data: completedComic } = useSWR(
    'completedComic',
    async () => {
      const { data } = await axiosClientV2.get(`/v1/api/danh-sach/hoan-thanh`);
      const { items: comics } = data;
      if (comics?.length) {
        return comics;
      }
      return [];
    },
    {
      onErrorRetry: onErrorRetry,
    },
  );

  // const { data: recommendedComics } = useSWR<
  //   { _id: Comic; votes: string[]; size: number }[]
  // >(`/comics/recommended?limit=30`, async (slug) => {
  //   const { data } = await axiosClientV2.get(slug);

  //   return data?.comics || [];
  // });

  // const handleToggleShowRecommendedComics = (state: boolean) => {
  //   setShowRecommendedComics(state);
  // };

  return (
    <>
      <Head />

      <Toaster position="top-center" />

      <div className="flex h-fit min-h-screen flex-col">
        <ClientOnly>
          <Banner
            comics={shuffle<Comic>(
              [
                ...(comicsNewUpdated || []),
                ...(newComic || []),
                ...(releasingComic || []),
                ...(completedComic || []),
              ].slice(0, 5),
            )}
          />
        </ClientOnly>

        <Section
          link={`/${MANGA_BROWSE_PAGE}?view=newComic`}
          title="Mới cập nhật"
          style="w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden"
          linkHints
        >
          <SectionSwiper comics={comicsNewUpdated} />
        </Section>

        {/* <Lazy offset={1000}>
          <Section
            title={showRecommendedComics ? 'Cộng Đồng Bình Chọn' : ''}
            arrowTrendingUp
            style="h-fit w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden text-white"
          >
            <If condition={!showRecommendedComics}>
              <Then>
                {() => (
                  <div className="absolute-center h-28 w-full ">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      transition={{
                        type: 'spring',
                        stiffness: 55,
                      }}
                      className="absolute-center h-4/5 w-[65%] rounded-lg border-2 border-white/40 px-4 md:w-96"
                    >
                      <h4 className="whitespace-nowrap">Hiển thị bình chọn</h4>
                      <ToggleButton
                        handleToggle={handleToggleShowRecommendedComics}
                      />
                    </motion.div>
                  </div>
                )}
              </Then>
              <Else>
                <RecommendedComics
                  comics={recommendedComics}
                  handleShowSection={handleToggleShowRecommendedComics}
                />
              </Else>
            </If>
          </Section>
        </Lazy> */}

        <LazyLoad>
          <Section
            title="Manga"
            style="w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden"
          >
            <SeasonalComics />
          </Section>
        </LazyLoad>

        <LazyLoad>
          <Section style="w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden">
            <RandomComics
              id={comicsNewUpdated?.[comicsNewUpdated?.length - 1]?.['slug']}
            />
          </Section>
        </LazyLoad>

        {/* <LazyLoad>
          <Section
            title="Bình luận gần đây"
            style="w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden"
          >
            <RecentlyComments />
          </Section>
        </LazyLoad> */}

        <LazyLoad>
          <Section style="w-[90%] mx-auto min-w-[333px] w-max-[1300px] mt-6 overflow-x-hidden">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <ColumnSection
                comics={newComic?.slice(0, 5)}
                title="Truyện mới"
                link={MangaTypesPreview[0]?.href}
              />
              <ColumnSection
                comics={releasingComic?.slice(0, 5)}
                title="Truyện đang phát hành"
                link={MangaTypesPreview[1]?.href}
              />
              <ColumnSection
                comics={comicsNewRelease?.slice(0, 5)}
                title="Truyện sắp ra mắt"
                link={MangaTypesPreview[2]?.href}
              />
              <ColumnSection
                comics={completedComic?.slice(0, 5)}
                title="Truyện đã hoàn thành"
                link={MangaTypesPreview[3]?.href}
              />
            </div>
          </Section>
        </LazyLoad>

        <LazyLoad>
          <Section
            link={`/${MANGA_BROWSE_PAGE}?view=new`}
            title="Truyện mới"
            style="w-[90%] mx-auto w-max-[1300px] mt-6  overflow-x-hidden"
            linkHints
          >
            <SectionSwiper comics={comicsNewRelease} />
          </Section>
        </LazyLoad>
      </div>
    </>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const { db } = await connectToDatabase();

//   const [resultAll, resultMonth, resultWeek, resultDay, resultSeason] =
//       await Promise.all([
//           db.collection('real_time_comics').findOne({ type: 'all' }),
//           db.collection('real_time_comics').findOne({ type: 'month' }),
//           db.collection('real_time_comics').findOne({ type: 'week' }),
//           db.collection('real_time_comics').findOne({ type: 'day' }),
//           db.collection('real_time_comics').findOne({ type: 'season' }),
//       ]);

//   const { comics: topAllManga } = resultAll;
//   const { comics: topMonthManga } = resultMonth;
//   const { comics: topWeekManga } = resultWeek;
//   const { comics: topDayManga } = resultDay;
//   const { comics: seasonalComics } = resultSeason;

//   return {
//     props: {
//       topAllManga: JSON.parse(JSON.stringify(topAllManga)),
//       topMonthManga: JSON.parse(JSON.stringify(topMonthManga)),
//       topWeekManga: JSON.parse(JSON.stringify(topWeekManga)),
//       topDayManga: JSON.parse(JSON.stringify(topDayManga)),
//       seasonalComics: JSON.parse(JSON.stringify(seasonalComics)),
//     },
//     revalidate: REVALIDATE_TIME,
//   };
// };

export default Home;
