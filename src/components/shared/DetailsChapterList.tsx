import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';

import styled from '@emotion/styled';
import { BookOpenIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentType, useEffect, useRef, useState } from 'react';
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso';
import { animateFill, followCursor } from 'tippy.js';
import { mangaSources } from '~/atoms/mangaSourcesAtom';
import { MANGA_PATH_NAME, MANGA_PATH_READ_NAME } from '~/constants';
import { Comic, IServerData } from '~/types';

import ChapterInput from './ChapterInput';
import LazyTippy from './LazyTippy';

const ListBox = dynamic(() => import('../buttons/ListBoxButton'));

interface IProps {
  mobileUI?: boolean;
  chapterList: IServerData[];
  chapterInfo?: Comic;
  containerStyle: string;
  selectSource: boolean;
  mobileHeight: number;
  maxWTitleMobile: number;
  highlightCurrentChapter?: boolean;
}

const ListContainer = styled.div`
  display: grid;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  height: fit;
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
`;

const ItemContainer = styled.div`
  padding: 0.5rem;
  width: full;
  height: full;
`;

function DetailsChapterList({
  mobileUI,
  mobileHeight,
  maxWTitleMobile,
  selectSource,
  containerStyle,
  highlightCurrentChapter,
  chapterList,
}: Readonly<IProps>) {
  const router = useRouter();
  const virtuoso = useRef(null);
  const { params } = router?.query;
  const [slug, chapter] = (params as string[]) || [];

  const availableSource = useAtomValue(mangaSources);
  const [list, setList] = useState<IServerData[]>(chapterList);

  useEffect(() => {
    setList(chapterList);
  }, [chapterList]);

  // useEffect(() => {
  //     if (highlightCurrentChapter) {
  //         const paramIndex = params && params[1];
  //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //         //@ts-ignore
  //         virtuoso.current?.scrollToIndex({
  //             index: list.findIndex((e) => e.chapterNumber === paramIndex),
  //             align: 'center',
  //         });
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [params, chapterList, list]);

  // const filterChapterNumber = (chapterN: string) => {
  //     if (!chapterN) {
  //         setList(chapterList);
  //         return;
  //     }

  //     setList(() => {
  //         const arr = chapterList.filter((chapter) =>
  //             chapter.chapterTitle.includes(String(chapterN)),
  //         );
  //         return arr.reverse();
  //     });
  // };

  return (
    <div className={containerStyle}>
      <div className="z-40 my-4 flex min-h-[40px] w-full items-center gap-4 text-white md:my-2">
        <ChapterInput
          style={`${
            selectSource
              ? 'mx-4 flex h-[32px] w-[50%] items-center justify-center rounded-xl bg-[#5f5f5f] px-2 hover:bg-white/25 md:w-[30%] lg:w-[20%]'
              : 'flex w-full h-[32px] bg-[#5f5f5f] px-2 mx-4 rounded-xl'
          }`}
        />
        {selectSource && (
          <ListBox
            title="Nguồn:"
            defaultSelected={'OTruyen'}
            listDropDown={availableSource.map((item) => ({
              title: item.sourceName,
              id: item.sourceId,
            }))}
          />
        )}
      </div>
      {!!list?.length &&
        (list?.length > 0 && mobileUI ? (
          <Virtuoso
            ref={virtuoso}
            style={{ height: `${mobileHeight}px` }}
            totalCount={list.length}
            itemContent={(index) => (
              <div className="animate__fadeIn animate__animated m-2 overflow-hidden text-white">
                <Link
                  href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${
                    slug || router?.query?.slug
                  }/${list[index].chapter_name}`}
                >
                  <a className="full-size">
                    <div
                      className={`flex h-[30px] items-center justify-between rounded-lg`}
                    >
                      <div className="flex w-[30%] min-w-max items-center">
                        <DocumentTextIcon className="mx-4 h-4 w-4" />
                        <span
                          className={classNames(
                            `line-clamp-1  inline-block overflow-hidden text-left text-lg font-bold hover:text-white`,
                            `max-w-[${maxWTitleMobile}px]`,
                            `${
                              list[index].chapter_name === chapter &&
                              'text-primary'
                            }`,
                          )}
                        >
                          Chap {list[index]?.chapter_name}
                        </span>
                      </div>
                      <div className="flex items-center px-4">
                        <span className="whitespace-nowrap text-lg font-extralight text-gray-300">
                          Cập nhật: No data
                        </span>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            )}
          />
        ) : (
          list?.length > 0 && (
            <VirtuosoGrid
              style={{
                height: `${chapterList.length > 50 ? '750px' : '450px'}`,
              }}
              totalCount={list.length}
              components={{
                List: ListContainer as ComponentType,
                Item: ItemContainer,
              }}
              overscan={50}
              itemContent={(index) => (
                <div
                  key={list[index].chapter_api_data || index}
                  className="h-ful animate__fadeIn animate__animated w-full text-white"
                >
                  <Link
                    href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${
                      slug || router?.query?.slug
                    }/${list[index].chapter_name}`}
                  >
                    <a>
                      <LazyTippy
                        content={list[index].chapter_name}
                        animation="scale"
                        interactiveBorder={20}
                        followCursor={true}
                        animateFill={true}
                        plugins={[followCursor, animateFill]}
                      >
                        <div className="bubble-top-left-to-bottom-right flex h-[30px] items-center justify-between rounded-lg bg-deep-black  md:h-[100px] md:flex-col md:items-start md:justify-center md:space-y-4">
                          <div className="flex w-[30%] min-w-max items-center   md:justify-between md:px-4">
                            <span
                              className={`${
                                list[index].chapter_name === chapter &&
                                'text-primary'
                              } line-clamp-1 max-w-[200px] text-left text-lg font-bold hover:text-white md:max-w-[140px] md:text-xl  lg:max-w-[160px] lg:text-2xl`}
                            >
                              Chap {list[index].chapter_name}
                            </span>
                          </div>
                          <div className="flex items-center px-4 md:w-full md:justify-between">
                            <span className="text-lg font-extralight text-gray-300 md:text-2xl">
                              Cập nhật: No data
                            </span>
                            <BookOpenIcon className="md:h-10 md:w-10 lg:h-10 lg:w-14 lg:min-w-14" />
                          </div>
                        </div>
                      </LazyTippy>
                    </a>
                  </Link>
                </div>
              )}
            />
          )
        ))}
    </div>
  );
}

export default DetailsChapterList;
