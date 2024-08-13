import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRef } from 'react';
import { sidebarState } from '~/atoms/sidebarAtom';
import { MANGA_BROWSE_PAGE, MangaTypesPreview } from '~/constants';
import LogoSVG from '/public/images/torii-gate-japan.svg';

import { Dialog } from '@headlessui/react';
// eslint-disable-next-line prettier/prettier
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import TextLogo from '../icons/TextLogo';
import { axiosClientV2 } from '~/services/axiosClient';
import useSWR from 'swr';
import { DropDownLink } from '../shared/DropDown';

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useAtom(sidebarState);

  //prevent sidebar close before adding effects
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  const handleSidebarClose = () => {
    sidebarRef.current?.classList.remove('slideLeftReturn');
    sidebarRef.current?.classList.add('slideLeft');
    overlayRef.current?.classList.remove('animate__fadeIn');
    overlayRef.current?.classList.add('animate__fadeOut');

    setTimeout(() => {
      setShowSidebar(false);
    }, 350);
  };

  return (
    <Dialog
      className="lg:hidden"
      open={showSidebar}
      onClose={handleSidebarClose}
    >
      {/* backdrop */}
      <Dialog.Overlay
        ref={overlayRef}
        className="animate__fadeIn animate__animated animate__faster fixed inset-0 z-[100] bg-black/30"
        aria-hidden="true"
      />
      <aside
        ref={sidebarRef}
        className={`${
          showSidebar && 'slideLeftReturn'
        } magictime absolute-center	 fixed inset-0 z-[999] w-[250px] min-w-[230px] bg-secondary p-4 md:w-[40%]`}
      >
        <div className="flex h-full w-full flex-col">
          {/* control sidebar & logo */}
          <div className="absolute-center mt-6 flex h-fit w-full items-center justify-between">
            <button
              className="absolute-center bg-hight-light ml-4 rounded-full p-4 text-white md:p-5"
              onClick={handleSidebarClose}
            >
              <ChevronLeftIcon className="h-8 w-8 md:h-10 md:w-10" />
            </button>

            <div className="absolute-center relative flex-1">
              <LogoSVG
                className="md:width-[100px] absolute"
                width={50}
                height={50}
              />
              <figure className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <TextLogo className="left-1/2 h-[40px] w-[130px] md:h-[50px] md:w-[200px]" />
              </figure>
            </div>
          </div>
          {/* sidebar list  */}
          <ul className="mt-4 h-full w-full text-white">
            {/* list title  */}
            <li className="mx-4 mt-4 md:mt-8">
              <h3 className="font-secondary text-3xl md:text-5xl">
                Truyện tranh
              </h3>
            </li>

            <li className="flex flex-wrap">
              {MangaTypesPreview.map((item) => (
                <button
                  onClick={handleSidebarClose}
                  key={item?.label}
                  className="absolute-center bg-hight-light ml-4 mt-4 w-fit rounded-xl px-4 py-2 md:mt-6"
                >
                  <Link href={item.href}>
                    <a className="text-xl md:text-3xl">{item?.label}</a>
                  </Link>
                </button>
              ))}
            </li>
            {/* list title  */}
            <li className="mx-4 mt-4 border-t-[2px] border-highlight pt-4 md:mt-8">
              <h3 className="font-secondary text-3xl md:text-5xl">Thể loại</h3>
            </li>
            <li className="grid grid-cols-2">
              {genres?.slice(0, 4)?.map((manga) => {
                return (
                  <button
                    onClick={handleSidebarClose}
                    key={manga?.value}
                    className="hover:bg-hight-light ml-4 mt-4 flex w-full items-center rounded-xl px-4 py-2 md:mt-6"
                  >
                    <Link href={manga?.href}>
                      <a className="text-xl md:text-3xl">{manga?.label}</a>
                    </Link>
                  </button>
                );
              })}
              <button
                onClick={handleSidebarClose}
                className="hover:bg-hight-light ml-4 mt-4 flex w-full items-center rounded-xl px-4 py-2 md:mt-6"
              >
                <Link href={`/${MANGA_BROWSE_PAGE}`}>
                  <a className="flex items-center text-xl md:text-3xl">
                    <PlusIcon className="mr-2 h-6 w-6" /> Xem thêm
                  </a>
                </Link>
              </button>
            </li>
            {/* title  */}
            <li className="mx-4 mt-4 border-t-[2px] border-highlight pt-4 md:mt-8">
              <h3 className="font-secondary text-3xl md:text-5xl">
                <Link href={`/${MANGA_BROWSE_PAGE}?view=newComic`}>
                  <a onClick={handleSidebarClose} className="flex items-center">
                    Mới cập nhật
                    <button className="absolute-center h-full">
                      <ChevronRightIcon className="ml-2 h-6 w-6" />
                    </button>
                  </a>
                </Link>
              </h3>
            </li>
            {/* title  */}
            <li className="mx-4 mt-4 border-t-[2px] border-highlight pt-4 md:mt-8">
              <h3 className="font-secondary text-3xl md:text-5xl">
                <Link href={`/${MANGA_BROWSE_PAGE}?view=all`}>
                  <a onClick={handleSidebarClose} className="flex items-center">
                    Bảng xếp hạng
                    <button className="absolute-center h-full">
                      <ChevronRightIcon className="ml-2 h-6 w-6" />
                    </button>
                  </a>
                </Link>
              </h3>
            </li>
          </ul>
        </div>
      </aside>
    </Dialog>
  );
}
