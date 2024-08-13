import { memo, SyntheticEvent, useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import useSettingsMode from '~/context/SettingsContext';
interface IProps {
  index: number;
  src: string;
  fallbackSrc?: string;
  saveCurrentPage: (currPage: number) => void;
}

function Img({ src, fallbackSrc, index, saveCurrentPage }: IProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const settings = useSettingsMode();
  const isVisible = !!entry?.isIntersecting;

  if (isVisible) {
    saveCurrentPage(index);
  }

  const handleErrorImg = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
      e.currentTarget.removeAttribute('alt');
    }

    e.currentTarget.onerror = null; // prevents looping
  };

  if (settings?.readMode === 'horizontal') {
    return (
      <img
        data-id={index}
        ref={ref}
        alt="chapter-img"
        className={`comic-img mx-auto h-screen w-auto transition-all duration-300 md:opacity-20`}
        src={src}
        onError={handleErrorImg}
      />
    );
  }

  return (
    <img
      ref={ref}
      alt="chapter-img"
      className={`${
        settings?.imageMode === 'fitH' ? 'h-screen' : 'h-auto'
      } comic-img mx-auto ${
        settings?.imageMode === 'fitW' ? 'w-full' : 'w-auto'
      }`}
      src={src}
      onError={handleErrorImg}
    />
  );
}

export default memo(Img);
