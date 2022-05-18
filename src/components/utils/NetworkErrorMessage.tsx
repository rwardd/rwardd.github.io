import React from "react";

interface NetworkErrorMessageProps {
  message: any;
  dismiss: any;
}

export const NetworkErrorMessage: React.FC<NetworkErrorMessageProps> = (
  props
) => {
  const { message, dismiss } = props;

  return (
    <div className='alert alert-danger' role='alert'>
      {message}
      <button
        type='button'
        className='close'
        data-dismiss='alert'
        aria-label='Close'
        onClick={dismiss}
      >
        <span aria-hidden='true'>&times;</span>
      </button>
    </div>
  );
};
