import Image from 'next/image';
import Link from 'next/link';

import { useMediaQuery } from 'usehooks-ts';

export default function Footer() {
  const matchesMobile = useMediaQuery('(max-width: 643px)');

  return (
    <footer className="my-6 bg-background pb-6 text-white">
      <div className="flex flex-col items-center justify-center md:flex-row">
        <figure className="relative h-fit">
          <Link href="/">
            <Image
              src="/images/logo-bottom.png"
              alt="logo top"
              width={250}
              height={100}
              objectFit="contain"
            />
          </Link>
        </figure>

        {/* <div className="absolute-center mb-4 w-full space-x-6">
        <button className="transition-all duration-200 hover:text-primary">
          <a
            href="https://www.facebook.com/kyotomanga"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebookSquare className="h-8 w-8" />
          </a>
        </button>

        <button className="transition-all duration-200 hover:text-primary">
          <a
            href="https://discord.gg/vxVnXUUt"
            target="_blank"
            rel="noreferrer"
          >
            <FaDiscord className="h-8 w-8" />
          </a>
        </button>
      </div> */}

        <div className="flex flex-col justify-center space-y-4 text-lg md:text-2xl">
          <h2 className="text-center font-secondary text-2xl font-bold md:text-4xl">
            Manga World là website đọc truyện tranh miễn phí
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:space-x-8 md:text-2xl">
            <Link href="/terms-of-service">
              <a className="hover:text-primary">Điều khoản dịch vụ</a>
            </Link>
            <Link href="/privacy-policy">
              <a className="hover:text-primary">Chính sách riêng tư</a>
            </Link>
            <Link href="/dmca">
              <a className="hover:text-primary">DMCA</a>
            </Link>
            <Link href="/contact">
              <a className="hover:text-primary">Liên hệ</a>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto my-4 space-y-4">
        <p className="text-center text-lg text-white/40 md:text-2xl">
          Manga World không lưu trữ bất kì tệp tin nào trên máy chủ, chúng tôi
          chỉ liên kết tới những phương tiện truyền thông được lưu trữ bên dịch
          vụ thứ 3.
        </p>
        <p className="text-center text-lg text-white/40 md:text-2xl">
          Manga World does not store any files on our server, we only linked to
          the media which is hosted on 3rd party services.
        </p>

        <p className="text-center text-lg text-white/40 md:text-2xl">
          &copy; Manga World
        </p>
      </div>
    </footer>
  );
}
