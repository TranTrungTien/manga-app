import { memo } from 'react';
import Section from '~/components/shared/Section';
import { Description, ViewSelection } from '~/types';

interface IProps {
  viewSelection: ViewSelection;
  description?: Description;
}

function DetailedCategory({ viewSelection, description }: IProps) {
  return (
    <Section>
      {viewSelection !== 'Chapters' && (
        <span className="font-semibold text-white">No Data</span>
      )}
      {/* {viewSelection === 'Characters' && (
                <Characters characters={description.characters} />
            )}
            {viewSelection === 'Details' && <MalDetails desc={description} />}
            {viewSelection === 'Pictures' && (
                <MalPictures pictures={description.pictures} />
            )} */}
    </Section>
  );
}

export default memo(DetailedCategory);
