import { memo } from 'react';
import { Page } from '~/types';
import Img from '../shared/Img';

interface IProps {
  images: Page[];
  handleSaveCurrentPage: (page: number) => void;
}

function VerticalImages({ images, handleSaveCurrentPage }: Readonly<IProps>) {
  return (
    <>
      {!!images?.length &&
        images.map((img, index) => {
          return (
            <div
              id={`page-${index}`}
              key={img.id}
              className={`relative h-fit w-full`}
            >
              <Img
                saveCurrentPage={handleSaveCurrentPage}
                index={index}
                src={img.src}
                fallbackSrc={img?.fallbackSrc}
              />
            </div>
          );
        })}
    </>
  );
}
export default memo(VerticalImages);
