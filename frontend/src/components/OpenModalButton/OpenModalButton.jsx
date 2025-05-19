// frontend/src/components/OpenModalButton/OpenModalButton.jsx

import { useModal } from "../../context/Modal";

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  className // optional: additional class names for styling
}) {
  // consume the setModalContent and setOnModalClose from the ModalContext
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === 'function') onButtonClick();
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return (
    <button onClick={onClick} className={className || ""}>
      {buttonText}
    </button>
  );
}


export default OpenModalButton;



// OLD VERSION - not using "className" parameter
//   const { setModalContent, setOnModalClose } = useModal();

//   const onClick = () => {
//     if (onModalClose) setOnModalClose(onModalClose);
//     setModalContent(modalComponent);
//     if (typeof onButtonClick === "function") onButtonClick();
//   };

//   return <button onClick={onClick}>{buttonText}</button>;
// }



// export default OpenModalButton;
