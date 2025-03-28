import React, { Fragment } from 'react';
import { Input } from './ui/input';

interface InputSearchProps extends React.ComponentProps<'input'> {
  options: React.ReactNode[];
  search?: string;
}

const InputSearch = (props: InputSearchProps) => {
  return (
    <div className="relative z-50">
      <Input {...props} value={props.search} />
      {props.search && (
        <div className=" absolute top-9 lef-0 w-full bg-white rounded py-2">
          {props.options?.map((option, idx) => {
            return <Fragment key={idx}>{option}</Fragment>;
          })}
        </div>
      )}
    </div>
  );
};

export default InputSearch;
