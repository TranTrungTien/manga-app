import { Comic } from '~/types';

export default function webtoonChecker(manga: Comic) {
  return manga?.category?.some(
    (genre) =>
      !!['manhua', 'manhwa', 'webtoon'].find(
        (i) => i === genre?.name?.trim()?.toLocaleLowerCase(),
      ),
  );
}
