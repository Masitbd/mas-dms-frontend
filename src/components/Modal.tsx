/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { Button, Loader, Modal } from "rsuite";
import CloseIcon from "@rsuite/icons/Close";

const RModal = ({
  size,
  open,
  title,
  children,
  okHandler,
  cancelHandler,
  loading,
}: {
  size: string;
  open: boolean;
  title: string;
  children: React.ReactElement;
  okHandler?: <T>(data: T) => void;
  cancelHandler?: <T>(data: T) => void;
  loading?: boolean;
}) => {
  return (
    <div className="">
      <Modal
        size={size}
        open={open}
        backdrop="static"
        onClose={cancelHandler}
        className=""
      >
        <div className="bg-[#3498ff] text-white px-2 py-3 text-center font-sans font-semibold shadow-lg  text-xl -mt-5 -mb-5 -mx-5 z-20 grid grid-cols-12 ">
          <h3 className="col-start-2 col-span-10">{title}</h3>
          <div className="col-start-12 flex justify-end mx-2">
            <div className=" flex items-center justify-center">
              <Button
                color="red"
                appearance="primary"
                className="font-bold"
                onClick={() => {
                  cancelHandler && cancelHandler(null);
                }}
              >
                <CloseIcon />
              </Button>
            </div>
          </div>
        </div>

        <Modal.Body className="p-5 shadow-md my-5">
          <div className="relative">
            {loading && <Loader />}

            {children}
          </div>
        </Modal.Body>
        {okHandler && cancelHandler && (
          <Modal.Footer>
            <Button
              onClick={cancelHandler}
              appearance="primary"
              loading={loading ? loading : false}
              color="red"
            >
              Cancel
            </Button>
            <Button
              onClick={okHandler}
              appearance="primary"
              loading={loading ? loading : false}
            >
              OK
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default RModal;
