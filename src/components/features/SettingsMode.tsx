import { useMediaQuery } from 'usehooks-ts';
import ListBox from '~/components/shared/ListBox';
import useSettingsMode from '~/context/SettingsContext';
import convertMode from '~/utils/modeConverter';

import { XMarkIcon } from '@heroicons/react/24/outline';

interface SettingsModeProps {
  styles?: string;
  show: boolean;
  handleConfig: (value: string) => void;
}

export default function SettingsMode({
  styles,
  show,
  handleConfig,
}: SettingsModeProps) {
  const settings = useSettingsMode();
  const matchesTouchScreen = useMediaQuery('(max-width: 1024px)');
  if (matchesTouchScreen) return null;

  const handleSelect = (val: string) => {
    handleConfig(val);
  };

  if (!show) return null;

  return (
    <div
      className={`${styles} magictime flex h-[50px] w-full items-center rounded-b-xl bg-highlight text-white`}
    >
      {show && (
        <div className="mx-4 flex h-full w-full justify-between">
          <div className="absolute-center h-full w-full gap-4">
            <div className="absolute-center h-full w-fit">
              <ListBox
                defaultOption={convertMode(settings?.readMode || 'vertical')}
                handleSelect={handleSelect}
                highlightSelect="text-primary mx-2"
                title="Chế độc đọc: "
                options={['ngang', 'dọc']}
              />
            </div>

            <div className="absolute-center h-full w-fit">
              <ListBox
                defaultOption={!settings?.autoNext ? 'tắt' : 'bật'}
                handleSelect={handleSelect}
                highlightSelect="text-primary mx-2"
                title="Chuyển chap tự động: "
                options={['bật', 'tắt']}
              />
            </div>

            {settings?.readMode === 'horizontal' && (
              <div className="absolute-center h-full w-fit">
                <ListBox
                  defaultOption={convertMode(settings?.readDirection || 'rtl')}
                  handleSelect={handleSelect}
                  highlightSelect="text-primary mx-2"
                  title="Hướng đọc: "
                  options={['phải sang trái', 'trái sang phải']}
                />
              </div>
            )}

            {settings?.readMode === 'vertical' && (
              <div className="absolute-center h-full w-fit">
                <ListBox
                  defaultOption={convertMode(
                    settings?.nextDirection || 'right',
                  )}
                  handleSelect={handleSelect}
                  highlightSelect="text-primary mx-2"
                  title="Chuyển chap bên: "
                  options={['cạnh phải', 'cạnh trái']}
                />
              </div>
            )}

            {settings?.readMode === 'vertical' && (
              <div className="absolute-center h-full w-fit">
                <ListBox
                  defaultOption={convertMode(settings?.imageMode || 'full')}
                  handleSelect={handleSelect}
                  highlightSelect="text-primary mx-2"
                  title="Chế độ ảnh: "
                  options={['full', 'fit width', 'fit height']}
                />
              </div>
            )}
          </div>

          <div className="h-full w-fit">
            <button
              onClick={() => settings?.turnOffSettings()}
              className="absolute-center h-full rounded-full p-4 transition-all hover:text-primary"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
