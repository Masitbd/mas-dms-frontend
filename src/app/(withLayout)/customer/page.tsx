// src/components/customer/CustomerListTable.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Pagination, Button, Loader } from "rsuite";
import { Search, Eye, Pencil, Trash2, Plus } from "lucide-react";
import useQueryBuilder from "@/helpers/QueryBUilder";
import {
  useDeleteCustomerMutation,
  useGetCustomersQuery,
} from "@/redux/api/customer/customer.api";

type CustomerListItem = {
  uuid: string;
  fullName: string;
  phone: string;
};

type CustomersApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: { page: number; limit: number; total: number };
    result: CustomerListItem[];
  };
};

const safeErrorMessage = (err: any) =>
  err?.data?.message ||
  err?.data?.error ||
  err?.error ||
  err?.message ||
  "Something went wrong.";

export default function CustomerListTable() {
  const router = useRouter();
  const { addField, deleteField, query } = useQueryBuilder();

  // Defaults (do not overwrite if already present)
  useEffect(() => {
    if (!query?.page) addField("page", 1);
    if (!query?.limit) addField("limit", 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, isFetching } = useGetCustomersQuery(query) as {
    data?: CustomersApiResponse;
    isLoading: boolean;
    isFetching: boolean;
  };

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const total = data?.data?.meta?.total ?? 0;
  const rows = data?.data?.result ?? [];

  // Search (debounced)
  const initialSearch = useMemo(
    () => String(query?.searchTerm ?? ""),
    [query?.searchTerm]
  );
  const [searchText, setSearchText] = useState(initialSearch);

  useEffect(() => setSearchText(initialSearch), [initialSearch]);

  useEffect(() => {
    const t = setTimeout(() => {
      const v = searchText.trim();

      if (!v) deleteField("searchTerm");
      else addField("searchTerm", v);

      addField("page", 1);
    }, 300);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const busy = isLoading || isFetching || isDeleting;

  const handleDelete = async (uuid: string) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete customer?",
      text: `This will permanently delete customer ${uuid}.`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#111827",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteCustomer(uuid).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Customer deleted successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: safeErrorMessage(err),
      });
    }
  };

  return (
    <div className="w-full">
      {/* Top bar (matches your reference) */}
      <div className="mb-3 flex items-center gap-3">
        <Button
          appearance="primary"
          className="!rounded-md"
          onClick={() => router.push("/customer/new?mode=new")}
          disabled={busy}
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </span>
        </Button>

        <div className="relative w-full">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search customer..."
            className="h-10 w-full rounded-md border border-gray-200 bg-white px-4 pr-10 text-sm outline-none focus:border-blue-400"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-md border border-gray-200 bg-white">
        {/* Loading overlay */}
        {busy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-md border bg-white px-4 py-2 shadow-sm">
              <Loader size="sm" />
              <span className="text-sm text-gray-700">Loading...</span>
            </div>
          </div>
        )}

        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="bg-gray-200">
            <tr className="text-left">
              <th className="w-[140px] border-r border-gray-300 px-4 py-3 font-semibold">
                ID
              </th>
              <th className="border-r border-gray-300 px-4 py-3 font-semibold">
                Name
              </th>
              <th className="border-r border-gray-300 px-4 py-3 font-semibold">
                Phone
              </th>
              <th className="w-[180px] px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {!busy && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.uuid} className="border-t border-gray-100">
                  <td className="border-r border-gray-100 px-4 py-3 font-mono">
                    {c.uuid}
                  </td>
                  <td className="border-r border-gray-100 px-4 py-3">
                    {c.fullName}
                  </td>
                  <td className="border-r border-gray-100 px-4 py-3">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* View */}
                      <button
                        type="button"
                        className="inline-flex h-7 items-center justify-center rounded-md bg-blue-500 px-3 text-white hover:bg-blue-600 disabled:opacity-60 cursor-pointer"
                        onClick={() =>
                          router.push(`/customer/view?uuid=${c.uuid}`)
                        }
                        disabled={busy}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Update */}
                      <button
                        type="button"
                        className="inline-flex h-7 items-center justify-center rounded-md bg-green-500 px-3 text-white hover:bg-green-600 disabled:opacity-60 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/customer/new?mode=update&uuid=${c.uuid}`
                          )
                        }
                        disabled={busy}
                        title="Update"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="inline-flex h-7 items-center justify-center rounded-md bg-red-500 px-3 text-white hover:bg-red-600 disabled:opacity-60 cursor-pointer"
                        onClick={() => handleDelete(c.uuid)}
                        disabled={busy}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Bottom bar (Total left, Pagination right like reference) */}
        <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
          <div className="text-sm text-gray-800">Total Rows: {total}</div>

          <Pagination
            layout={["total", "-", "limit", "|", "pager", "skip"]}
            size={"md"}
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            total={total ?? 0}
            limit={Number(query?.limit ?? 10)}
            limitOptions={[10, 20, 50]}
            maxButtons={5}
            activePage={Number(query?.page ?? 1)}
            onChangePage={(v: number) => addField("page", v)}
            onChangeLimit={(v: number) => {
              addField("limit", v);
              addField("page", 1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
