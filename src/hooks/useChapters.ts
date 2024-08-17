import { useRouter } from 'next/router';
import { MANGA_PATH_NAME, MANGA_PATH_READ_NAME } from '~/constants';
import { axiosClientV2 } from '~/services/axiosClient';

export default function useChapters() {
  const router = useRouter();

  const goToFirstChapter = async (slug: string) => {
    try {
      // NProgress.start();

      const { data } = await axiosClientV2.get(`/v1/api/truyen-tranh/${slug}`);
      const { item: comic } = data;

      if (comic?.chapters[0].server_data?.length) {
        const chapter = comic?.chapters[0].server_data[0];
        if (!chapter) return;

        router.push(
          `/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${slug}/${chapter.chapter_name}`,
        );
        // .then(() => NProgress.done());
      }
    } catch (err) {
      // NProgress.done();
    }
  };

  const saveCurrentChapter = async (
    source: string,
    comicSlug: string,
    chapterSlug: string,
    chapterNumber: string,
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // if (status === 'unauthenticated' || !session?.user?.id) return false;
    // try {
    //     const res = await (
    //         await axios.post(`/api/history`, {
    //             source,
    //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //             //@ts-ignore
    //             userId: session?.user?.id as string,
    //             comicSlug,
    //             chapterSlug,
    //             chapterNumber,
    //         })
    //     ).data;
    //     return res.success;
    // } catch (error) {
    //     return false;
    // }
  };

  const getUserHistory = async () => {
    // try {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     //@ts-ignore
    //     if (status === 'unauthenticated' || !session?.user?.id)
    //         return false;
    //     const res = await axios.get(
    //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //         //@ts-ignore
    //         `/api/history?userId=${session?.user?.id}`,
    //     );
    //     if (res.data) return res.data?.user;
    // } catch (error) {
    //     return false;
    // }
  };

  return { goToFirstChapter, saveCurrentChapter, getUserHistory };
}
