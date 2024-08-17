import { NextPage } from 'next';
import useSWR from 'swr';
import Filters from '~/components/features/Filters';
import Pagination from '~/components/features/Pagination';
import withDbScroll from '~/components/hoc/withDbScroll';
import Head from '~/components/shared/Head';
import ListView from '~/components/shared/ListView';
import Section from '~/components/shared/Section';
import { axiosClientV2 } from '~/services/axiosClient';
import { QueryObject } from '~/services/nettruyenRepository';
import { Comic } from '~/types';

import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IProps {
  queryObj: QueryObject;
}

const BrowsePage: NextPage<IProps> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: comicsByGenres } = useSWR<{
    data: Comic[];
    pagination: any;
  } | null>(
    `get-comic-by-genres-${router.query?.genres}-${router.query?.page}`,
    async () => {
      if (!router.query.genres) {
        setLoading(false);
        return null;
      }
      setLoading(true);

      const { data } = await axiosClientV2.get(
        `/v1/api/the-loai/${router.query?.genres}?page=${
          router.query.page || 1
        }`,
      );

      setLoading(false);
      return {
        data: data?.items || [],
        pagination: data?.params?.pagination,
      };
    },
  );
  const { data: comicsByStatus } = useSWR<{
    data: Comic[];
    pagination: any;
  } | null>(
    `get-comic-by-status-${router.query?.status}-${router.query?.page}`,
    async () => {
      if (!router.query.status) {
        setLoading(false);
        return null;
      }
      const { data } = await axiosClientV2.get(
        `/v1/api/danh-sach/${router.query.status}?page=${
          router.query.page || 1
        }`,
      );
      setLoading(false);
      return {
        data: data?.items || [],
        pagination: data?.params?.pagination,
      };
    },
  );

  const getTotalPages = () => {
    let pages = comicsByGenres?.pagination?.totalItems || 1;
    const sizePerPage =
      comicsByGenres?.pagination?.totalItemsPerPage ||
      comicsByStatus?.pagination?.totalItemsPerPage ||
      1;

    if (pages < comicsByStatus?.pagination?.totalItems)
      pages = comicsByStatus?.pagination?.totalItems;
    return Math.floor(pages / sizePerPage);
  };

  const totalPages = getTotalPages();

  return (
    <div className="flex min-h-screen flex-col">
      <Head title="Danh sách truyện - Manga World" />

      <Section style="z-10 mx-auto min-h-fit w-[98%] md:w-[90%]">
        <Filters />
      </Section>

      {!loading && (!comicsByGenres || !comicsByStatus) && (
        <>
          <Section style="my-4 z-0 mx-auto min-h-[900px] w-[98%]   md:w-[90%]">
            <ListView
              isLoading={loading}
              comicList={[
                ...(comicsByGenres?.data || []),
                ...(comicsByStatus?.data || []),
              ]}
            />
          </Section>
          <Section style="my-4 z-0 h-fit w-full">
            {totalPages > 1 && <Pagination totalPages={totalPages} />}
          </Section>
        </>
      )}

      {!loading &&
        !comicsByGenres?.data?.length &&
        !comicsByStatus?.data?.length && (
          <Section style="my-14 z-0 mx-auto min-h-[900px] w-[98%]   md:w-[90%]">
            <div className="absolute-center w-full gap-4 text-white">
              <h1>Dữ liệu bạn cần chưa có!</h1>
              <FaceFrownIcon className="h-12 w-12" />
            </div>
          </Section>
        )}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// export const getServerSideProps: GetServerSideProps = async ({
//     query,
//     res,
// }) => {
//     //caching
//     res.setHeader(
//         'Cache-Control',
//         `public, s-maxage=${REVALIDATE_TIME}, stale-while-revalidate=${
//             REVALIDATE_TIME * 6
//         }`,
//     );

//     const { genres, comics, page, view, status, chapter, gender } = query;

//     const realGenres = String(genres)
//         .split(',')
//         .map((genre) => {
//             return GENRES_NT.find((item) => item.value === genre)?.id;
//         })
//         .join(',');
//     const realComics = String(comics)
//         .split(',')
//         .map((comic) => {
//             return COMIC_GENRES.find((item) => item.value === comic)?.id;
//         })
//         .join(',');

//     let queryGenres = '';
//     if (realGenres) queryGenres += `${realGenres},`;
//     if (realComics) queryGenres += realComics;

//     const queryObj: QueryObject = {};

//     if (queryGenres) queryObj['genres'] = queryGenres;
//     if (page) queryObj['page'] = Number(page);
//     if (view) queryObj['top'] = String(view);
//     if (status) queryObj['status'] = String(status);
//     if (chapter) queryObj['minchapter'] = Number(chapter);
//     if (gender) queryObj['gender'] = Number(gender);

//     return {
//         props: {
//             queryObj,
//         },
//     };
// };

export default withDbScroll<BrowsePageProps>(BrowsePage);
