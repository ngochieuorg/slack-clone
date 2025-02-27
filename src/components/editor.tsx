/* eslint-disable @typescript-eslint/no-explicit-any */
import Quill, { Delta, Op, type QuillOptions } from 'quill';

import 'quill/dist/quill.snow.css';
import { useEffect, useRef, RefObject, useLayoutEffect, useState } from 'react';
import { Button } from './ui/button';
import { PiTextAa } from 'react-icons/pi';
import { MdSend } from 'react-icons/md';
import { ImageIcon, Smile, XIcon } from 'lucide-react';
import Hint from './hint';
import { cn } from '@/lib/utils';
import EmojiPopover from './emoji-popover';
import Image from 'next/image';
import 'quill-mention/autoregister';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { GenericId } from 'convex/values';
import { renderDisplayName } from '@/app/utils/label';

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: 'create' | 'update';
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
}

const Editor = ({
  variant = 'create',
  onSubmit,
  onCancel,
  placeholder = 'Write something',
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) => {
  const workspaceId = useWorkspaceId();
  const { data: members } = useGetMembers({ workspaceId });

  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;

    const mentions = document.querySelectorAll('.ql-editor .mention');
    mentions.forEach((mention) => {
      (mention as HTMLElement).style.background = '#d5e3ee';
      (mention as HTMLElement).style.color = '#1264a3';
    });
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    );
    const atValues = (members || [])?.map((member) => {
      return {
        id: member.userId,
        value:
          renderDisplayName(member.user.name, member.user.memberPreference) ||
          '',
        name: member.user.name || '',
        avatar: member.user.memberPreference.image || member.user?.image || '',
      };
    });

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
        mention: {
          allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
          mentionDenotationChars: ['@', '#'],
          renderItem: (item: { avatar: any; value: any; name: any }) => {
            const container = document.createElement('div');
            container.className = 'flex gap-2 items-center p-1';

            let imgDiv;

            if (item.avatar) {
              const img = document.createElement('img');
              img.src = item.avatar;
              img.alt = item.value;
              img.className = 'size-[18px] rounded-md';
              imgDiv = img;
            } else {
              const fallbackAvar = document.createElement('div');
              fallbackAvar.className =
                'size-[18px] rounded-md flex items-center justify-center bg-sky-500 text-xs';
              fallbackAvar.innerText = String(item.value)
                .charAt(0)
                .toUpperCase();
              imgDiv = fallbackAvar;
            }

            const spanName = document.createElement('span');
            spanName.innerText = item.name;
            const span = document.createElement('span');
            span.innerText = item.value;

            container.appendChild(imgDiv);
            container.appendChild(span);
            container.appendChild(spanName);

            return container;
          },

          source: function (
            searchTerm: string,
            renderList: (
              arg0: {
                id: GenericId<'users'>;
                value: string;
                avatar: string;
                name: string;
              }[],
              arg1: any
            ) => void,
            mentionChar: string
          ) {
            const values = mentionChar === '@' ? atValues : atValues;

            if (searchTerm.length === 0) {
              renderList(values, searchTerm);
            } else {
              const matches = values.filter(
                (v) =>
                  v.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  v.name.toLowerCase().includes(searchTerm.toLowerCase())
              );
              renderList(matches, searchTerm);
            }
          },
        },
      },
    };
    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((curent) => !curent);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden');
    }
  };

  const emojiSelect = (emoji: any) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image"
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          'flex flex-col border border-slate-200 rounded-md  focus-within:border-slate-300 focus-within:shadow-sm transition bg-white',
          disabled && 'opacity-50'
        )}
      >
        <div ref={containerRef} className="h-full ql-custom" />
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>

              <Image
                src={URL.createObjectURL(image)}
                alt="Upload"
                fill
                className="rounded overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5px]">
          <Hint label={isToolbarVisible ? 'Hide format' : 'Show format'}>
            <Button
              className=""
              disabled={disabled}
              variant={'ghost'}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={emojiSelect}>
            <Button className="" disabled={disabled} variant={'ghost'}>
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label="Image">
              <Button
                className=""
                disabled={disabled}
                variant={'ghost'}
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant={'outline'}
                size={'sm'}
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                size={'sm'}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                disabled={disabled || isEmpty}
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                });
              }}
              size={'sm'}
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white hover:bg-white text-muted-foreground'
                  : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition',
            !isEmpty && 'opacity-100'
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
