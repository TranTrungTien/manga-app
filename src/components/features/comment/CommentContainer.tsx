import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { memo } from 'react';
import { Else, If, Then } from 'react-if';
import { confirmModal } from '~/atoms/confirmModalAtom';
import CommentInput from './CommentInput';
import CommentsList from './CommentsList';

const ConfirmModal = dynamic(
  () =>
    import('~/components/features/comment/ConfirmModal', {
      ssr: false,
    } as ImportCallOptions),
);

const CommentSettingsModal = dynamic(
  () =>
    import('./CommentSettingsModal', {
      ssr: false,
    } as ImportCallOptions),
);

const commentStylesContainer = 'mx-auto w-full md:w-4/5 lg:w-3/4 my-4';

function CommentContainer() {
  const shouldMountConfirmModal = useAtomValue(confirmModal);

  return (
    <div className="full-size py-4">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      {shouldMountConfirmModal && <ConfirmModal />}

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <CommentSettingsModal />
      <If condition={status !== 'authenticated'}>
        <Then>
          <div
            className={`${commentStylesContainer} absolute-center h-20 rounded-2xl bg-deep-black`}
          >
            <h3>
              <Link href={'/login'}>
                <a className="smooth-effect rounded-xl text-primary hover:bg-highlight hover:px-4 hover:py-2">
                  Đăng nhập
                </a>
              </Link>{' '}
              để bình luận bạn nhé!
            </h3>
          </div>
        </Then>

        <Else>
          <h5 className="text-center italic text-gray-500">
            Hãy bình luận văn minh, lịch sự và mang tính xây dựng 🙏
          </h5>
          <CommentInput
            submitType="create"
            inputMode="new"
            containerStyles={commentStylesContainer}
          />
        </Else>
      </If>

      <CommentsList styles={commentStylesContainer} />
    </div>
  );
}

export default memo(CommentContainer);
