import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import torriGate from '/public/images/torri-gate.jpg';

interface IProps {
  imgUrl: string;
  isLoading: boolean;
}

export default function DetailsBanner({ imgUrl, isLoading }: IProps) {
  const styles = 'deslide-cover h-full w-full bg-cover bg-top bg-no-repeat';

  return (
    <div className="absolute inset-0 z-0 h-[35%] w-full lg:h-[45%]">
      {isLoading ? (
        <Skeleton
          className={styles}
          baseColor="#202020"
          highlightColor="#444"
        />
      ) : (
        <figure className="deslide-cover">
          <Image
            alt="comic-banner"
            className="object-fit absolute h-full w-full bg-cover bg-top bg-no-repeat object-cover blur"
            layout="fill"
            src={
              imgUrl !== 'notFound'
                ? `https://img.otruyenapi.com/uploads/comics/${imgUrl}`
                : torriGate
            }
          />
        </figure>
      )}
    </div>
  );
}
