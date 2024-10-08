import { useSetAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { followModal } from '~/atoms/followModaAtom';
import {
  MANGA_AUTHOR_PATH,
  MANGA_BROWSE_PAGE,
  MANGA_PATH_NAME,
  MANGA_PATH_READ_NAME,
  SOURCE_COLLECTIONS,
  STATUS_MAPPING,
} from '~/constants';
import useNotification from '~/hooks/useNotification';
import { ChapterDetails, Comic } from '~/types';
import { isExactMatch } from '~/utils/stringHandler';
import torriGate from '/public/images/torri-gate.jpg';

import {
  BellIcon,
  BookmarkIcon,
  BookOpenIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid, BoltIcon } from '@heroicons/react/24/solid';

interface IProps {
  comic?: Comic;
  chapters?: ChapterDetails;
  isLoading: boolean;
}

function DetailsInfo({ comic, chapters, isLoading }: IProps) {
  const router = useRouter();
  const notification = useNotification();

  const setShowModal = useSetAtom(followModal);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const firstChapterSlug = useMemo(() => {
    const firstChap =
      chapters?.chapters_list &&
      chapters?.chapters_list.length &&
      [...chapters.chapters_list[0].chapters].pop();

    return firstChap && firstChap?.chapterSlug;
  }, [chapters]);

  const firstChapterNumber = useMemo(() => {
    const firstChapNumber =
      chapters?.chapters_list &&
      chapters?.chapters_list.length &&
      [...chapters.chapters_list[0].chapters].pop();

    return firstChapNumber && firstChapNumber?.chapterNumber;
  }, [chapters]);

  const latestChapterSlug = useMemo(() => {
    return (
      chapters?.chapters_list &&
      chapters?.chapters_list.length &&
      chapters.chapters_list[0].chapters[0].chapterSlug
    );
  }, [chapters]);

  const latestChapterNumber = useMemo(() => {
    return (
      chapters?.chapters_list &&
      chapters?.chapters_list.length &&
      chapters.chapters_list[0].chapters[0].chapterNumber
    );
  }, [chapters]);

  const handleShowFollowModal = () => {
    // if (status === 'unauthenticated') {
    //     router.push('/login');
    //     return;
    // }
    // setShowModal(true);
  };

  const handleTurnOnNotification = async () => {
    // const response = await notification.subscribe(comic?.slug);
    // switch (response) {
    //     case 'permission_denied':
    //         toast.error('User-kun cần cấp quyền thông báo!', {
    //             duration: 3000,
    //             style: { zIndex: 899 },
    //         });
    //         break;
    //     case 'unsupported_browser':
    //         toast.error(
    //             'Trình duyệt của user-kun không hỗ trợ thông báo!',
    //             {
    //                 duration: 3000,
    //                 style: { zIndex: 899 },
    //             },
    //         );
    //         break;
    //     case 'success':
    //         toast.success('Bật thông báo thành công!', {
    //             duration: 3000,
    //             style: { zIndex: 899 },
    //         });
    //         setIsSubscribed(true);
    //         break;
    // }
  };

  const handleTurnOffNotification = async () => {
    // const response = await notification.unsubscribe(comic?.slug);
    // switch (response) {
    //     case 'success':
    //         toast.success('Tắt thông báo thành công!', {
    //             duration: 3000,
    //             style: { zIndex: 899 },
    //         });
    //         setIsSubscribed(false);
    //         break;
    //     case 'error':
    //         toast.error('Có gì đó không đúng?, Vui lòng thử lại!', {
    //             duration: 3000,
    //             style: { zIndex: 899 },
    //         });
    //         break;
    // }
  };

  // useEffect(() => {
  //     (async function () {
  //         const res = await notification.info(comic?.slug);

  //         if (res === 'subscribed') {
  //             setIsSubscribed(true);
  //         }
  //     })();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [session]);

  const convertQuery = (value: string) => {
    switch (value?.toLowerCase()) {
      case 'manga':
      case 'manhua':
      case 'manhwa':
      case 'doujinshi':
        return 'comics';
      default:
        return 'genres';
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center overflow-x-hidden md:flex-row md:items-start">
      {/* manga thumbnail  */}
      <div className="mt-4 w-[50%] md:w-[250px] md:min-w-[250px]">
        {isLoading ? (
          <Skeleton
            inline={true}
            baseColor="#202020"
            highlightColor="#444"
            className="aspect-h-5 aspect-w-3 relative"
            style={{
              borderRadius: '2%',
            }}
          />
        ) : (
          <figure className="aspect-h-5 aspect-w-3 relative rounded-2xl">
            <Image
              className="absolute inset-0 rounded-2xl object-cover object-center"
              layout="fill"
              alt="manga-thumbnail"
              src={`https://img.otruyenapi.com/uploads/comics/${comic?.thumb_url}`}
            />
          </figure>
        )}
      </div>
      {/* manga desc*/}
      <div className="flex h-full w-full flex-col justify-center p-4  text-white md:min-h-[430px] lg:ml-4">
        <div className="w-full space-y-4 text-center md:ml-2 md:text-left lg:w-[80%]">
          {isLoading ? (
            <>
              <Skeleton
                inline={true}
                baseColor="#202020"
                highlightColor="#444"
                className="my-2 h-[35px] overflow-hidden"
              />
              <Skeleton
                inline={true}
                baseColor="#202020"
                highlightColor="#444"
                className="my-2 max-w-[50%] md:min-h-[28px]"
              />
              <Skeleton
                inline={true}
                baseColor="#202020"
                highlightColor="#444"
                className="my-2 max-w-[30%] md:min-h-[28px]"
              />

              <Skeleton
                inline={true}
                baseColor="#202020"
                highlightColor="#444"
                className="my-2 max-w-[25%] md:min-h-[28px]"
              />
            </>
          ) : (
            <>
              <h1
                className={`font-secondary  font-bold leading-none ${
                  comic?.name && comic?.name?.length < 40
                    ? 'text-[6.5vw] md:text-[5.5vw] lg:text-[3.5vw]'
                    : 'text-[5.5vw] md:text-[3.5vw] lg:text-[2.5vw]'
                }`}
              >
                {comic?.name}
              </h1>
              <h2 className="text-[3vw] md:min-h-[28px] md:text-[2vw] lg:text-[1.2vw]">
                {comic?.origin_name?.[0]}
              </h2>
              {comic?.author?.[0] ? (
                <Link href={`/${MANGA_AUTHOR_PATH}/${comic?.author?.[0]}`}>
                  <a className="full-size">
                    <button className="mx-auto my-2 flex w-fit items-center space-x-2 rounded-xl bg-highlight px-4 py-2 text-center text-[3vw] md:mx-0 md:text-left md:text-[2vw] lg:text-[1.1vw]">
                      <UserIcon className="h-6 w-6" />
                      <span>{comic?.author?.[0]}</span>
                    </button>
                  </a>
                </Link>
              ) : (
                <span>Tác giả: chưa rõ</span>
              )}

              <h4 className="flex items-center justify-center gap-4 md:justify-start">
                <span
                  className={`block h-3 w-3 rounded-full ${
                    comic?.status === 'ongoging'
                      ? 'bg-green-500'
                      : 'bg-cyan-500'
                  } `}
                ></span>
                {STATUS_MAPPING[comic?.status ?? '']}
              </h4>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-col-reverse gap-2 md:flex-col">
          {isLoading ? (
            <Skeleton
              inline={true}
              baseColor="#202020"
              highlightColor="#444"
              className="my-4 max-w-[80%] md:min-h-[50px]"
            />
          ) : (
            <ul className="my-4 flex flex-wrap items-center gap-4">
              <h3 className="px-2 py-2">Thể loại:</h3>
              {comic?.category?.map((genre) => {
                if (!genre) return;

                return (
                  <li
                    key={genre?.id}
                    className="rounded-xl bg-highlight px-4 py-2"
                  >
                    <Link
                      href={{
                        pathname: `/${MANGA_BROWSE_PAGE}`,
                        query: {
                          [convertQuery(genre?.name)]: genre?.slug,
                        },
                      }}
                    >
                      <a>{genre?.name}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* manga interrace  */}
          <div className="my-6 flex h-[150px] w-full flex-col items-center gap-6 md:my-0 md:flex-row md:items-start">
            {comic ? (
              <>
                <Link
                  href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${comic?.slug}/1`}
                >
                  <a>
                    <button className="pulse-effect-primary absolute-center h-[50px] w-[150px] gap-3 rounded-2xl bg-primary transition-all hover:scale-[110%]">
                      <BookOpenIcon className="h-8 w-8" /> Đọc ngay
                    </button>
                  </a>
                </Link>

                <Link
                  href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${
                    comic?.slug
                  }/${
                    comic?.chapters?.[0]?.server_data?.[
                      comic?.chapters?.[0]?.server_data?.length - 1
                    ].chapter_name
                  }`}
                >
                  <a>
                    <button className="pulse-effect-secondary absolute-center h-[50px] w-[150px] gap-3 rounded-2xl bg-white text-gray-800 transition-all hover:scale-[110%]">
                      <BoltIcon className="h-8 w-8 text-primary" /> Chap mới
                      nhất
                    </button>
                  </a>
                </Link>
              </>
            ) : (
              <>
                <div className="absolute-center loading-pulse h-[50px] min-h-[50px] w-[150px] rounded-2xl bg-white/20"></div>

                <div className="absolute-center loading-pulse h-[50px] min-h-[50px] w-[150px] rounded-2xl bg-white/20"></div>
              </>
            )}

            <div className="flex w-fit space-x-2">
              <button
                onClick={handleShowFollowModal}
                className="shine-effect absolute-center bg-hight-light h-[50px] w-[50px] rounded-xl transition-all hover:text-primary"
              >
                <BookmarkIcon className="h-8 w-8" />
              </button>

              <button
                onClick={
                  isSubscribed
                    ? handleTurnOffNotification
                    : handleTurnOnNotification
                }
                className="absolute-center bg-hight-light h-[50px] w-[50px] rounded-xl transition-all hover:text-primary"
              >
                {isSubscribed ? (
                  <BellIconSolid className="animate__animated animate__faster animate__heartBeat h-8 w-8 text-primary" />
                ) : (
                  <BellIcon className="animate__animated animate__faster animate__heartBeat h-8 w-8" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DetailsInfo);
