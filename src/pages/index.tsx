import { Toaster } from 'react-hot-toast';
import LazyLoad from 'react-lazy-load';
import RandomComics from '~/components/features/RandomComics';
import ColumnSection from '~/components/shared/ColumnSection';
import Head from '~/components/shared/Head';
import Section from '~/components/shared/Section';
import { MANGA_BROWSE_PAGE, MangaTypesPreview } from '~/constants';
import { baseURL } from '~/services/axiosClient';
import { IComicDetail, IManga, RootPage } from '~/types';

import type { NextPage } from 'next';
import Banner from '~/components/shared/Banner';
import ClientOnly from '~/components/shared/ClientOnly';
import SeasonalComics from '~/components/shared/SeasonalComics';
import SectionSwiper from '~/components/shared/SectionSwiper';
import shuffle from '~/utils/randomArray';
interface IProps {
  mangaUpdatedPage: RootPage;
  newReleasePage: RootPage;
  newMangaPage: RootPage;
  releasingMangaPage: RootPage;
  completedMangaPage: RootPage;
  mangaPage: RootPage;
  randomManga: IComicDetail;
}

const Home: NextPage<IProps> = (props) => {
  const {
    completedMangaPage,
    mangaUpdatedPage,
    newMangaPage,
    newReleasePage,
    releasingMangaPage,
    mangaPage,
    randomManga,
  } = props;

  const comicsNewUpdated = mangaUpdatedPage?.data?.items || [];
  const comicsNewRelease = newReleasePage?.data?.items || [];
  const newComic = newMangaPage?.data?.items || [];
  const releasingComic = releasingMangaPage?.data?.items || [];
  const completedComic = completedMangaPage?.data?.items || [];
  const mangas = mangaPage?.data?.items || [];

  // const [showRecommendedComics, setShowRecommendedComics] = useLocalStorage(
  //   'showVoting',
  //   false,
  // );

  // const { data: recommendedComics } = useSWR<
  //   { _id: Comic; votes: string[]; size: number }[]
  // >(`/comics/recommended?limit=30`, async (slug) => {
  //   const { data } = await axiosClientV2.get(slug);

  //   return data?.comics || [];
  // });

  // const handleToggleShowRecommendedComics = (state: boolean) => {
  //   setShowRecommendedComics(state);
  // };

  const bannerManga = shuffle<IManga>(
    ([] as IManga[])
      .concat(
        comicsNewUpdated,
        comicsNewRelease,
        newComic,
        releasingComic,
        completedComic,
      )
      .slice(0, 5),
  );

  return (
    <>
      <Head />
      <Toaster position="top-center" />
      <div className="flex h-fit min-h-screen flex-col">
        <ClientOnly>
          <Banner comics={bannerManga} />
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
            <SeasonalComics mangas={mangas} />
          </Section>
        </LazyLoad>

        <LazyLoad>
          <Section style="w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden">
            <RandomComics manga={randomManga?.data?.item} />
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

const URLs = {
  home: `${baseURL}/v1/api/home`,
  newRelease: `${baseURL}/v1/api/danh-sach/sap-ra-mat`,
  newManga: `${baseURL}/v1/api/danh-sach/truyen-moi`,
  releasingManga: `${baseURL}/v1/api/danh-sach/dang-phat-hanh`,
  completedManga: `${baseURL}/v1/api/danh-sach/hoan-thanh`,
  manga: `${baseURL}/v1/api/the-loai/manga?page=1`,
};

const fetchAPI = async (
  url: string,
  options?: RequestInit,
): Promise<RootPage | null> => {
  try {
    const data = await (await fetch(url, options)).json();
    return data;
  } catch (error) {
    console.error('error', error);
    return null;
  }
};

const reduceData = async (url: string) => {
  const data = await fetchAPI(url);
  if (!data) return null;

  data.data.items = data?.data?.items?.slice(0, 10) || [];

  return data;
};

export const getServerSideProps = async ({ res }: any) => {
  const mangaUpdatedPage = await reduceData(URLs.home);
  const newReleasePage = await reduceData(URLs.newRelease);
  const newMangaPage = await reduceData(URLs.newManga);
  const releasingMangaPage = await reduceData(URLs.releasingManga);
  const completedMangaPage = await reduceData(URLs.completedManga);
  const mangaPage = await reduceData(URLs.manga);

  const randomMangaObject =
    mangaUpdatedPage?.data.items[
      Math.floor(Math.random() * mangaUpdatedPage?.data.items.length)
    ];

  const randomManga = await fetchAPI(
    `${baseURL}/v1/api/truyen-tranh/${randomMangaObject?.slug}`,
  );

  res.setHeader(
    'cache-control',
    'private, max-age=900, stale-while-revalidate=3600',
  );

  return {
    props: {
      mangaUpdatedPage,
      newReleasePage,
      newMangaPage,
      releasingMangaPage,
      completedMangaPage,
      mangaPage,
      randomManga,
    },
  };
};

export default Home;
