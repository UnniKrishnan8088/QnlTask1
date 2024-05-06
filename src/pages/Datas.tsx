// import { createColumnHelper } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  SortingState,
  GlobalFilterTableState,
  getSortedRowModel,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import EditPost from "../components/EditPost";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import {
  FiChevronRight,
  FiChevronsRight,
  FiChevronsLeft,
  FiChevronLeft,
} from "react-icons/fi";
import { useAuth } from "../context/auth";

export type Post = {
  job: string;
  name: string;
  userId: number;
  id?: number | null;
};

interface ColumnFilter {
  id: string;
  value: unknown;
}
type ColumnFiltersState = ColumnFilter[];

const columnHelper = createColumnHelper<Post>();

export default function Datas() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  //   const [storedData, setStoredData] = useState<Post[]>([]);

  const auth = useAuth();

  const [editData, setEditData] = useState<Post>({
    job: "",
    name: "",
    userId: 0,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSerch] = useState<string>("");

  //Defining the columns of the table
  const columns = [
    columnHelper.accessor("id", {
      header: () => "No.",
      cell: (info) => info.row.index + 1,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.getValue(),
      enableColumnFilter: true,
    }),
    columnHelper.accessor("job", {
      header: () => "Job",
      cell: (info) => info.getValue(),
      enableColumnFilter: true,
    }),
    columnHelper.accessor("id", {
      header: () => "Edit",
      cell: (info) => {
        return (
          <button
            className="action-btn edit"
            onClick={() => {
              setIsEdit(true);
              setEditData(info.cell.row.original);
            }}
          >
            <FaRegEdit />
          </button>
        );
      },
      enableColumnFilter: false,
    }),
    columnHelper.accessor("id", {
      header: () => "Delete",
      cell: (info) => (
        <button
          className="action-btn dlt"
          onClick={() => {
            handleDelete(info.getValue());
          }}
        >
          <FaRegTrashAlt />
        </button>
      ),
      enableColumnFilter: false,
    }),
  ];

  //creating an instance
  const table = useReactTable({
    data: posts,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting: sorting,
      globalFilter: search,
      columnFilters,
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setSerch,
    onColumnFiltersChange: setColumnFilters,
  });

  //api call for get the data
  const getPosts = async (): Promise<void> => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      console.log(response?.data);
      setPosts(response?.data);
      console.log("Posts =>> ", posts);
      localStorage.setItem("tableData", JSON.stringify(posts));
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //function for delete the data
  const handleDelete = async (id: number | null | undefined) => {
    try {
      const response = await axios.delete(`http://localhost:3001/posts/${id}`);
      console.log(response);
      setPosts(posts?.filter((post) => post?.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="table-datas">
      <div className="header">
        <button className="create-btn" onClick={() => setIsCreate(true)}>
          Create
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={search ?? ""}
          onChange={(e) => setSerch(e.target.value)}
        />
        <button onClick={() => auth?.logout()}>Logout</button>
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}

                  //   onClick={header.column.getToggleSortingHandler()}
                >
                  <div
                    className="header__title"
                    {...{
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <FaChevronUp />,
                      desc: <FaChevronDown />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                  {/* {header.column.getCanFilter() && (
                    <input
                      type="text"
                      value={(header.column.getFilterValue() || "") as string}
                      onChange={(e) =>
                        header.column.setFilterValue(e.target.value)
                      }
                    />
                  )} */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <button onClick={() => table.setPageIndex(0)}>
          <FiChevronsLeft />
        </button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <FiChevronLeft />
        </button>
        <p>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <FiChevronRight />
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
          <FiChevronsRight />
        </button>
        <div className="go__to__page">
          <p>Go to page: </p>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
        </div>
      </div>

      {isCreate && (
        <CreatePost getPosts={getPosts} closeModal={() => setIsCreate(false)} />
      )}

      {isEdit && (
        <EditPost
          setPosts={setPosts}
          getPosts={getPosts}
          closeModal={() => setIsEdit(false)}
          editData={editData}
        />
      )}
    </div>
  );
}
