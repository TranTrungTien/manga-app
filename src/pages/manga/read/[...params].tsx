import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAtomValue, useSetAtom } from 'jotai';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import useSWR from 'swr';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';
import { chapterDetail } from '~/atoms/chapterDetailAtom';
import Reader from '~/components/features/Reader';
import MainLayout from '~/components/layouts/MainLayout';
import ClientOnly from '~/components/shared/ClientOnly';
import Head from '~/components/shared/Head';
import Section from '~/components/shared/Section';
import Teleport from '~/components/shared/Teleport';
import { ReadingContextProvider } from '~/context/ReadingContext';
import { SettingsContextProvider } from '~/context/SettingsContext';
import { SourcesContextProvider } from '~/context/SourcesContext';
import { axiosClientV2 } from '~/services/axiosClient';
import {
  ChapterDetails,
  Comic,
  IChapterData,
  IServerData,
  Page,
  PageInfo,
  ReadModeSettings,
} from '~/types';
const IMAGE_SOURCE = 'https://sv1.otruyencdn.com';

const SettingsModal = dynamic(
  () =>
    import('~/components/features/SettingsModal', {
      ssr: false,
    } as ImportCallOptions),
);
const VerticalPanel = dynamic(
  () =>
    import('~/components/features/VerticalPanel', {
      ssr: false,
    } as ImportCallOptions),
);

interface IProps {
  pagesDetail: PageInfo;
  chaptersDetail: ChapterDetails;
}

const ReadPage: NextPage<IProps> = () => {
  const router = useRouter();
  const { params } = router.query;

  const matchesTouchScreen = useMediaQuery('(max-width: 1024px)');
  const [rmSettings] = useLocalStorage<ReadModeSettings | null>(
    'settings',
    null,
  );
  const [showSideSettings, setShowSideSettings] = useState(true);
  const [currentChapter, setCurrentChapter] = useState<IChapterData>();
  const [loadingComic, setLoadingComic] = useState(true);

  const chapterDetailValue = useAtomValue(chapterDetail) as unknown as Comic;
  const setChapterDetail = useSetAtom(chapterDetail);

  //cache for next chapter
  const { data: comicDetail } = useSWR<Comic>(params, async () => {
    if (!params?.length) return;

    if (chapterDetailValue?.slug === params[0]) return chapterDetailValue;
    // let index = currentChapters?.chapters.findIndex(
    //   (e) => e.chapterNumber === currentChapter?.chapterNumber,
    // );

    // if (index === undefined) return;

    // if (!currentChapters?.chapters[--index]) {
    //   return;
    // }
    setLoadingComic(true);
    const { data } = await axiosClientV2.get(
      `/v1/api/truyen-tranh/${params[0]}`,
    );
    const { item } = data;
    setChapterDetail(item);
    return item;
  });

  // const handleChangeChapter = useCallback(
  //   async (type: NavigateDirection) => {
  //     if (!params?.length) return;

  //     let index = currentChapters?.chapters.findIndex(
  //       (e) => e.chapterNumber === currentChapter?.chapterNumber,
  //     );

  //     if (index === undefined) return;

  //     try {
  //       switch (type) {
  //         case 'next':
  //           if (!currentChapters?.chapters[--index]) {
  //             toast('Chapter mới nhất rồi bạn ơi! Quay lại sau nhé!', {
  //               icon: '😅',
  //               duration: 3000,
  //               style: { zIndex: 899 },
  //             });

  //             return;
  //           }

  //           NProgress.start();

  //           // await axiosClientV2.post('/chapters', {
  //           //     chapterSlug:
  //           //         currentChapters?.chapters[index].chapterSlug,
  //           //     source: params[0],
  //           //     comicName: chaptersDetail.comicName,
  //           //     comicSlug: chaptersDetail.comicSlug,
  //           // });

  //           router.replace(
  //             `/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${params[0]}/${currentChapters?.chapters[index].chapterNumber}/${currentChapters?.chapters[index].chapterSlug}`,
  //           );

  //           break;

  //         case 'prev':
  //           if (!currentChapters?.chapters[++index]) {
  //             toast('Chap đầu tiên rồi bạn ơi! Tiến tới để đọc thêm nhé!', {
  //               icon: '😅',
  //               duration: 3000,
  //               style: { zIndex: 899 },
  //             });
  //             return;
  //           }

  //           NProgress.start();

  //           // await axiosClientV2.post('/chapters', {
  //           //     chapterSlug:
  //           //         currentChapters?.chapters[index].chapterSlug,
  //           //     source: params[0],
  //           //     comicName: chaptersDetail.comicName,
  //           //     comicSlug: chaptersDetail.comicSlug,
  //           // });

  //           router.replace(
  //             `/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${params[0]}/${currentChapters?.chapters[index].chapterNumber}/${currentChapters?.chapters[index].chapterSlug}`,
  //           );

  //           break;
  //       }
  //     } catch (err) {
  //       toast.error('Lỗi rồi, Hãy chuyển nguồn khác nhé User-kun!', {
  //         duration: 3000,
  //         style: { zIndex: 899 },
  //       });
  //     }
  //   },
  //   [params, router],
  // );

  // const currentChapter = useMemo(() => {
  //   return {};
  //   // if (!params?.length || !chaptersDetail) return;

  //   // const source = params[0];

  //   // const chaptersBySource = chaptersDetail.chapters_list.find(
  //   //   (e) => e.sourceName === source,
  //   // );

  //   // if (chaptersBySource) {
  //   //   const chapNumberParam = params[1];

  //   //   return chaptersBySource.chapters.find(
  //   //     (e) => e.chapterNumber === chapNumberParam,
  //   //   );
  //   // }
  // }, [params, router]);

  // const currentChapters = useMemo(() => {
  //   return {};
  //   // if (!params?.length || !chaptersDetail) return;

  //   // const source = params[0];

  //   // if (source) {
  //   //   return chaptersDetail.chapters_list.find((e) => e.sourceName === source);
  //   // }
  // }, [params]);

  const chaptersSources: IServerData[] = useMemo(() => {
    return comicDetail?.chapters?.[0]?.server_data || [];
  }, [comicDetail]);

  useEffect(() => {
    const fetchChapterData = async () => {
      const [_, chapter] = (params as string[]) || [];
      const matched = chaptersSources?.find(
        (src) => src?.chapter_name === chapter,
      );
      if (!matched) return;

      const { data } = await axiosClientV2.get(matched?.chapter_api_data);
      setCurrentChapter(data?.item);
      setLoadingComic(false);
    };
    fetchChapterData();
  }, [chaptersSources, params]);

  useEffect(() => {
    if (!matchesTouchScreen && rmSettings !== null) handleShowSideSettings();
  }, []);

  useEffect(() => {
    if (matchesTouchScreen) {
      handleCloseSideSettings();
    }
    return () => {
      handleCloseSideSettings();
    };
  }, [matchesTouchScreen]);

  const handleCloseSideSettings = () => {
    const body = document.querySelector('body');
    if (body) {
      body.classList.remove('pl-[250px]');
    }
    setShowSideSettings(false);
  };

  const handleShowSideSettings = () => {
    if (matchesTouchScreen) return;

    const body = document.querySelector('body');
    if (body) {
      body.classList.add('pl-[250px]');
    }
    setShowSideSettings(true);
  };

  const imageSources: Page[] = useMemo(() => {
    const path = currentChapter?.chapter_path;
    return (
      currentChapter?.chapter_image?.map((item) => ({
        id: item?.image_page.toString(),
        src: `${IMAGE_SOURCE}/${path}/${item?.image_file}`,
      })) || []
    );
  }, [currentChapter]);

  if (!rmSettings) {
    return (
      <ClientOnly>
        <SettingsContextProvider>
          <div className="flex h-fit min-h-screen flex-col bg-deep-black">
            <SettingsModal triggerShowSideSettings={handleShowSideSettings} />
          </div>
        </SettingsContextProvider>
      </ClientOnly>
    );
  }

  return (
    <>
      <Head
        title={`${comicDetail?.name || 'Comic'} | Manga World`}
        // image={pagesDetail.pages[0].src || pagesDetail.pages[0].fallbackSrc}
      />

      <SourcesContextProvider value={{ chaptersDetail: comicDetail }}>
        <ClientOnly>
          <Toaster position="bottom-center" />

          <div className="flex h-fit min-h-screen flex-col bg-black">
            <ReadingContextProvider
              value={{
                loading: loadingComic,
                images: imageSources,
                currentChapter: currentChapter,
                navigateChapter: () => {
                  return;
                }, //handleChangeChapter,
              }}
            >
              <SettingsContextProvider>
                <Section style="flex h-fit relative">
                  {!matchesTouchScreen && showSideSettings && (
                    <Teleport selector="body">
                      <div
                        className={`fixed left-0 top-0 z-[999] h-full w-fit bg-black ${
                          showSideSettings
                            ? 'slideLeftReturn magictime'
                            : 'slideLeft magictime'
                        } `}
                      >
                        <VerticalPanel handleClose={handleCloseSideSettings} />
                      </div>
                    </Teleport>
                  )}

                  <div className="relative flex h-fit flex-1 text-white">
                    {!matchesTouchScreen && !showSideSettings && (
                      <button
                        onClick={handleShowSideSettings}
                        className={`${'fixed left-4 top-4 z-[889] rounded-full bg-highlight p-4 transition-all hover:bg-highlight/70'}`}
                      >
                        <ChevronRightIcon className="h-8 w-8" />
                      </button>
                    )}

                    <div
                      // onDoubleClick={() =>
                      //   handleChangeChapter(
                      //     rmSettings?.nextDirection === 'left'
                      //       ? 'next'
                      //       : 'prev',
                      //   )
                      // }
                      className="absolute left-0 top-0 z-[699] h-full w-[75px]"
                    ></div>

                    <div
                      // onDoubleClick={() =>
                      //   handleChangeChapter(
                      //     rmSettings?.nextDirection === 'right'
                      //       ? 'next'
                      //       : 'prev',
                      //   )
                      // }
                      className="absolute right-0 top-0 z-[699] h-full w-[75px]"
                    ></div>

                    <Reader
                      sideSettingState={showSideSettings}
                      closeDesktopPanel={handleCloseSideSettings}
                    />
                  </div>
                </Section>
              </SettingsContextProvider>
            </ReadingContextProvider>
          </div>
        </ClientOnly>
      </SourcesContextProvider>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// export const getServerSideProps: GetServerSideProps = async ({
//   query,
//   res,
// }) => {
//   res.setHeader(
//     'Cache-Control',
//     `public, s-maxage=${REVALIDATE_TIME}, stale-while-revalidate=${
//       REVALIDATE_TIME * 100
//     }`,
//   );

//   const { params } = query;

//   try {
//     if (Array.isArray(params)) {
//       const chapterSlug = `/${params.slice(2).join('/')}`;

//       let pages: PageInfo | null;

//       const rawPages = await redis.get(chapterSlug);

//       pages = JSON.parse(String(rawPages))?._doc;

//       if (!pages) {
//         // -- cache miss --
//         pages = await Page.findOne({ chapterSlug }).populate('chapter');
//       }

//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       let chapter = pages?.chapter;

//       //create new pages
//       if (!pages) {
//         const source = params[0];

//         const fallbackPages = await (
//           await axiosClientV2.post('/chapters', {
//             source,
//             chapterSlug,
//           })
//         ).data;

//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         //@ts-ignore
//         if (!fallbackPages?.pages && !fallbackPages?.chapter)
//           return { notFound: true };

//         return {
//           props: {
//             pagesDetail: JSON.parse(
//               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//               //@ts-ignore
//               JSON.stringify(fallbackPages?.pages),
//             ),
//             chaptersDetail: JSON.parse(
//               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//               //@ts-ignore
//               JSON.stringify(fallbackPages?.chapter),
//             ),
//           },
//         };
//       }

//       //fallback
//       if (!chapter) {
//         // -- cache miss --
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         //@ts-ignore
//         chapter = await Chapter.findOne({
//           comicName: pages?.comicName,
//         });
//       }

//       // -- cache hit --
//       // renew expired cache time:
//       // setTimeout(async () => {
//       //     try {
//       //         await pagesCachingHandler(String(pages?.comicSlug));
//       //     } catch (error) {
//       //         console.error('error!!');
//       //     }
//       // }, 100);

//       return {
//         props: {
//           pagesDetail: JSON.parse(JSON.stringify(pages)),
//           chaptersDetail: JSON.parse(JSON.stringify(chapter)),
//         },
//       };
//     }
//   } catch (error) {
//     return { notFound: true };
//   }
// };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
ReadPage.getLayout = (page: ReactNode) => {
  return <MainLayout>{page}</MainLayout>;
};

export default ReadPage;
