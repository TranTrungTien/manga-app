import { Dialog, Transition } from '@headlessui/react';
import {
  FaceFrownIcon,
  FaceSmileIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDebounce } from 'usehooks-ts';
import { searchModalState } from '~/atoms/searchModelAtom';
import { axiosClientV2 } from '~/services/axiosClient';

import SearchInput from './SearchInput';
import { Comic } from '~/types';

const SearchResult = dynamic(() => import('./SearchResult'));

export default function SearchModal() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useAtom(searchModalState);
  const [showBtnClearInput, setShowBtnClearInput] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [comics, setComics] = useState<Comic[] | null>(null);
  const debouncedValue = useDebounce<string>(searchValue, 1000);

  useEffect(() => {
    //fetch api
    (async function () {
      if (debouncedValue) {
        try {
          setIsSearching(true);

          const { data } = await axiosClientV2.get(
            `/v1/api/tim-kiem?keyword=${debouncedValue}`,
          );

          const { items: comics } = data;

          if (comics?.length) {
            setComics(comics);
            setIsSearching(false);
          } else {
            setComics([]);
          }
        } catch (err) {
          setComics([]);
        } finally {
          setIsSearching(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    setComics([]);

    if (e.currentTarget.value) {
      setSearchValue(e.currentTarget.value.trim());
    } else {
      setIsSearching(false);
    }
  }, []);

  const handleClearSearchValue = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setSearchValue('');
    }
    setShowBtnClearInput(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowBtnClearInput(false);
    setSearchValue('');
    setIsSearching(false);
    setComics([]);
  };

  const handleOpenButtonClearSearch = useCallback(() => {
    //Displayed only when input has value
    if (inputRef.current?.value) {
      setShowBtnClearInput(true);
    }
  }, []);

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        initialFocus={inputRef}
        as="div"
        className="relative z-[999]"
        onClose={handleCloseModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed left-0 right-0 top-[10%] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-h-[70vh] w-[85%] transform overflow-x-hidden overflow-y-scroll rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all md:w-[75%] lg:max-h-[85vh]">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="mx-2 my-4 font-secondary text-4xl leading-6 text-white md:text-6xl"
                  >
                    Tìm Truyện
                  </Dialog.Title>
                  <button
                    className="button rounded-full p-4 text-white md:mr-6"
                    onClick={handleCloseModal}
                  >
                    <XMarkIcon className="h-10 w-10" />
                  </button>
                </div>
                <div className="my-10 flex h-[60px] items-center rounded-xl bg-secondary py-4 text-white">
                  {/* search icon  */}
                  <MagnifyingGlassIcon className="mx-2 h-10 w-10 md:mx-6 md:h-14 md:w-14" />
                  {/* search input  */}
                  <SearchInput
                    ref={inputRef}
                    setShowBtnClearInput={setShowBtnClearInput}
                    handleOpenButtonClearSearch={handleOpenButtonClearSearch}
                    handleSearch={handleSearch}
                  />
                  {/* clear input  */}
                  {showBtnClearInput && (
                    <button
                      className="absolute-center m-4 h-10 w-10 rounded-lg bg-primary text-white hover:opacity-60 md:h-14 md:w-14 md:rounded-xl"
                      onClick={handleClearSearchValue}
                    >
                      <XMarkIcon className="h-8 w-8" />
                    </button>
                  )}
                </div>

                {/* loading  */}
                {isSearching && (
                  <div className="absolute-center w-full">
                    <div className="dot-pulse"></div>
                  </div>
                )}

                {comics !== null ? (
                  <>
                    {!!comics?.length && !isSearching && (
                      <SearchResult comics={comics} />
                    )}
                    {!comics?.length && (
                      <div className="absolute-center mx-auto my-4 w-3/4 rounded-xl bg-secondary py-4 text-white">
                        <p className="mr-4 whitespace-nowrap text-base md:text-2xl">
                          Truyện bạn cần tìm chưa có!
                        </p>
                        <FaceFrownIcon className="h-10 w-10" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute-center mx-auto my-4 w-3/4 rounded-xl bg-secondary py-4 text-white">
                    <p className="mr-4 whitespace-nowrap text-base md:text-2xl">
                      Hãy tìm kiếm thứ gì đó đi!
                    </p>
                    <FaceSmileIcon className="h-10 w-10" />
                  </div>
                )}

                {}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
