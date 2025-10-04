import React from 'react';
import './box.css';

type BoxProps = {
  children: React.ReactNode;
  id?: string;
};

function Box({ children, id }: BoxProps ){

    return(
        <div className="box" id={id}>
            {children}
        </div>
    )
}

export default Box;