/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from "sweetalert2";

import {
  TypedMutationTrigger,
  FetchBaseQueryError,
  BaseQueryFn,
  MutationDefinition,
  ResultTypeFrom,
  QueryArgFrom,
} from "@reduxjs/toolkit/query/react";

import { Message, toaster } from "rsuite";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  deleteApi: () =>
    | readonly [
        TypedMutationTrigger<
          ResultTypeFrom<any>,
          QueryArgFrom<any>,
          BaseQueryFn
        >,
        { isLoading: boolean }
      ]
    | any;
}

const DeleteButton = <T,>({ id, deleteApi }: DeleteButtonProps) => {
  const [deleteData, { isLoading }] = deleteApi(); // Receiving API as a prop

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteData(id as any).unwrap();
          Swal.fire("Success", "Deleted Successfully", "success");
        } catch (error) {
          Swal.fire(
            "Error",
            (error ?? "Internal server Error") as string,
            "error"
          );
        }
      }
    });
  };

  return (
    <button
      className="text-red-600 hover:text-red-800"
      onClick={() => handleDelete()}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <Trash2 className="h-5 w-5" />
      )}
    </button>
  );
};

export default DeleteButton;
