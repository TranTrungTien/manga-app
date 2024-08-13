import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useSwiper } from 'swiper/react';
// import { baseURL } from '~/services/axiosClient';

interface IProps {
  imgSrc: string;
  style?: string;
  childStyle?: string;
}

const SwiperCard = ({ imgSrc, style, childStyle }: IProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const swiper = useSwiper();
  const [triggerEffect, setTriggerEffect] = useState(false);

  useEffect(() => {
    swiper.on('slideChange', () => {
      setTriggerEffect((prevState) => !prevState);
    });

    return () => {
      setTriggerEffect((prevState) => !prevState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div key={String(triggerEffect)} className={classNames(style)}>
      <div
        ref={cardRef}
        className={classNames(childStyle, 'magictime', 'vanishIn')}
      >
        <Image
          priority
          className="absolute inset-0 object-cover object-center"
          alt="image-preview"
          src={`https://img.otruyenapi.com/uploads/comics/${imgSrc}`}
          layout="fill"
        />
      </div>
    </div>
  );
};

export default SwiperCard;
