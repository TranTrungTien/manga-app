import LogoSVG from '/public/images/torii-gate-japan.svg';
import classNames from 'classnames';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { useState } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { sidebarState } from '~/atoms/sidebarAtom';
import { MANGA_BROWSE_PAGE, MangaTypesPreview } from '~/constants';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { BellIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import TextLogo from '../icons/TextLogo';
import DropDown, { DropDownLink } from '../shared/DropDown';
import HeaderNotifications from './HeaderNotifications';
import HeaderSearch from './HeaderSearch';
import HeaderUser from './HeaderUser';
import useSocket from '~/context/SocketContext';
import useSWR from 'swr';
import { axiosClientV2 } from '~/services/axiosClient';
import Image from 'next/image';

interface IProps {
  style?: string;
}

const Header = ({ style }: Readonly<IProps>) => {
  const socketCtx = useSocket();
  const setSidebarState = useSetAtom(sidebarState);
  const [isOpenMangaTypes, setIsOpenMangaTypes] = useState(false);
  const [isOpenMangaGenres, setIsOpenMangaGenres] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  // const { status } = useSession();

  const handleOpenSidebar = () => {
    setSidebarState(true);
  };

  return (
    <header className={classNames(style)}>
      <div className="mx-auto flex h-full w-full items-center md:max-w-[644px] lg:max-w-[90%]">
        {/* menu button mobile */}
        <button
          className="button rounded-full p-4 md:m-0 lg:hidden"
          onClick={handleOpenSidebar}
        >
          <HiMenuAlt2 className=" text-4xl text-white" />
        </button>

        {/* logo */}
        <figure className="relative grid h-fit flex-1 place-content-center md:place-content-start">
          <Link href="/">
            <Image
              src="/images/logo-top.png"
              alt="logo top"
              width={250}
              height={100}
              objectFit="contain"
            />
          </Link>
        </figure>

        <div className="flex items-center">
          {/* navigation */}
          <nav>
            <ul className="ml-32 hidden h-full w-fit items-center gap-x-4 space-x-10 font-secondary text-3xl text-white lg:flex">
              <li className="relative transition-all">
                <button
                  onMouseEnter={() => {
                    setIsOpenMangaGenres(true);
                  }}
                  onMouseLeave={() => {
                    setIsOpenMangaGenres(false);
                  }}
                  className={`flex items-center gap-x-2 ${
                    isOpenMangaGenres && 'text-primary'
                  }`}
                >
                  Thể loại <ChevronDownIcon className="h-8 w-8" />
                </button>
                {/* manga genres drop down  */}
                <div
                  onMouseEnter={() => {
                    setIsOpenMangaGenres(true);
                  }}
                  onMouseLeave={() => {
                    setIsOpenMangaGenres(false);
                  }}
                >
                  <DropDown
                    listDropDown={genres}
                    show={isOpenMangaGenres}
                    layoutClass="grid grid-cols-4"
                    isMore={true}
                  />
                </div>
              </li>
              <li className="relative transition-all">
                <button
                  onMouseEnter={() => {
                    setIsOpenMangaTypes(true);
                  }}
                  onMouseLeave={() => {
                    setIsOpenMangaTypes(false);
                  }}
                  className={`flex items-center gap-x-2 ${
                    isOpenMangaTypes && 'text gap-x-2-primary'
                  }`}
                >
                  Trạng thái <ChevronDownIcon className="h-8 w-8" />
                </button>
                {/* manga type drop down  */}
                <div
                  onMouseEnter={() => {
                    setIsOpenMangaTypes(true);
                  }}
                  onMouseLeave={() => {
                    setIsOpenMangaTypes(false);
                  }}
                >
                  <DropDown
                    listDropDown={MangaTypesPreview}
                    show={isOpenMangaTypes}
                  />
                </div>
              </li>
              <li className="transition-all hover:text-primary  ">
                <Link href={`/${MANGA_BROWSE_PAGE}?view=newComic`}>
                  <a>Mới cập nhật</a>
                </Link>
              </li>
              <li className="transition-all hover:text-primary  ">
                <Link href={`/${MANGA_BROWSE_PAGE}?view=all`}>
                  <a>Bảng xếp hạng</a>
                </Link>
              </li>
            </ul>
          </nav>
          {/* search & notifications & user */}
          <div className="relative flex h-full flex-1 items-center justify-end md:ml-10 md:justify-between lg:ml-0">
            {/* search  */}
            <HeaderSearch />

            <button
              onClick={() => {
                if (status !== 'authenticated') {
                  toast.error('Đăng nhập để thao tác bạn nhé!');
                  return;
                }

                if (socketCtx?.signal) {
                  socketCtx.setSignal(false);
                }

                setShowNotifications(true);
              }}
              className="relative ml-4 rounded-2xl bg-highlight p-4"
            >
              <BellIcon className="h-8 w-8 text-white" />

              {socketCtx?.signal && (
                <span className="absolute right-0 top-0 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-sky-500"></span>
                </span>
              )}
            </button>

            <HeaderNotifications
              shouldShow={showNotifications}
              setShow={(state: boolean) => {
                setShowNotifications(state);
              }}
            />

            {/* user  */}
            {/* <div className="absolute-center mx-4 h-full w-24">
              <HeaderUser />
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
