import {
  COMIC_GENRES,
  GENDER,
  GENRES_NT,
  MANGA_BROWSE_PAGE,
  MangaTypesPreview,
  SORT,
  STATUS_NT,
  VIEW_NT,
} from '~/constants';

import FilterItem from '../shared/FilterItem';
import useSWR from 'swr';
import { DropDownLink } from '../shared/DropDown';
import { axiosClientV2 } from '~/services/axiosClient';

export default function Filters() {
  const { data: genres } = useSWR<DropDownLink[]>('genres', async (query) => {
    const categories = localStorage.getItem('categories');
    if (categories) return JSON.parse(categories);

    const { data } = await axiosClientV2.get('/v1/api/the-loai');
    const { items: genres } = data;
    const result = genres?.map((item: any) => {
      return {
        id: item?.id,
        label: item.name,
        value: item.slug,
        href: `/${MANGA_BROWSE_PAGE}?genres=${item.slug}`,
      };
    });
    localStorage.setItem('categories', JSON.stringify(result));
    return result;
  });

  return (
    <div className="mx-2 grid min-h-[100px] w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <FilterItem
        instanceId="genres"
        title="Thể loại"
        placeholder="Thể loại..."
        options={genres}
      />
      <FilterItem
        title="Trạng thái"
        instanceId="status"
        placeholder="Trạng thái..."
        options={MangaTypesPreview}
      />
      {/* <FilterItem
        title=""
        instanceId="view"
        placeholder="thể loại..."
        defaultValue={[VIEW_NT[0]]}
        options={VIEW_NT}
      />
      <FilterItem
        isMulti
        title="Loại truyện"
        instanceId="comics"
        placeholder="Loại truyện..."
        disabled
      />
      <FilterItem
        title="Số chương"
        instanceId="chapter"
        placeholder="Số chương..."
        disabled
      />
      <FilterItem
        title="Giới tính"
        instanceId="gender"
        placeholder="Giới tính..."
        disabled
      /> */}
    </div>
  );
}
