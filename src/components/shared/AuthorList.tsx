import { useAutoAnimate } from '@formkit/auto-animate/react';
import { memo, RefObject } from 'react';
import AuthorItem from './AuthorItem';

function AuthorList() {
  const animationParent = useAutoAnimate({}) as RefObject<HTMLUListElement>;
  // const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const userId = session?.user.id;

  // const { data: authors } = useSWR<Author[]>(
  //     `/api/users/followAuthor?userId=${userId}`,
  //     async (slug) => {
  //         const { authors } = await (await axios.get(slug)).data;

  //         return authors;
  //     },
  // );
  const authors: any = [];
  return (
    <ul
      ref={animationParent}
      className="grid h-fit w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5"
    >
      {authors &&
        authors.length > 0 &&
        authors.map((author: any) => {
          return <AuthorItem author={author} key={author._id} />;
        })}
    </ul>
  );
}

export default memo(AuthorList);
