/* eslint-disable react/no-children-prop */
import React from "react";
import { Button, Table } from "rsuite";
import SearchAndFilter from "./SearchAndFilter";
import useQueryBuilder, { QueryBuilder } from "@/helpers/QueryBUilder";
import TableActionButtonProvider from "./TableActionButtonProvider";
import { NavLink } from "../layout/Navlink";
import {
  useDeleteUserMutation,
  useGetUserListQuery,
} from "@/redux/api/users/user.api";
import UsersPagination from "./UsersPagination";
import UserStatusProvider from "./UserStatusProvider";
import { useSession } from "next-auth/react";

const UsersTable = () => {
  const { Cell, Column, HeaderCell } = Table;
  const { addField, deleteField, query } = useQueryBuilder();

  const {
    data: userData,
    isLoading: userDataLoading,
    isFetching: userDataFetching,
  } = useGetUserListQuery(query);
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const session = useSession();

  return (
    <div className="mx-2">
      <div className="my-2 grid grid-cols-12 justify-start items-center gap-2 ">
        <Button
          appearance="primary"
          color="blue"
          size="lg"
          className="col-span-2"
          as={NavLink}
          href="/users/new?mode=new"
        >
          Add New
        </Button>
        <SearchAndFilter
          addField={addField}
          deleteField={deleteField}
          getQuery={query}
        />
      </div>
      <div>
        <Table
          loading={userDataLoading || userDataFetching || deleteLoading}
          data={userData?.data?.data}
          cellBordered
          bordered
          autoHeight
        >
          <Column flexGrow={1}>
            <HeaderCell children="UUID" />
            <Cell dataKey="uuid" />
          </Column>
          <Column flexGrow={3}>
            <HeaderCell children="Name" />
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={2}>
            <HeaderCell children="Email" />
            <Cell dataKey="email" />
          </Column>

          <Column flexGrow={0.5}>
            <HeaderCell children="Status" />
            <Cell>
              {(rowData) => (
                <UserStatusProvider status={rowData?.user?.status as string} />
              )}
            </Cell>
          </Column>
          <Column flexGrow={1.5}>
            <HeaderCell children="..." />
            <Cell align="center">
              {(rowData) => {
                return (
                  <>
                    <TableActionButtonProvider
                      uuid={rowData?.uuid}
                      route="/user/new"
                      deleteFn={deleteUser}
                    />
                  </>
                );
              }}
            </Cell>
          </Column>
        </Table>

        <div>
          <UsersPagination
            addField={addField}
            deleteField={deleteField}
            query={query}
            total={userData?.data?.meta?.total}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
