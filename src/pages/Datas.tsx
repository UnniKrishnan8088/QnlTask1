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
  const [editData, setEditData] = useState<Post>({
    job: "",
    name: "",
    userId: 0,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSerch] = useState<string>("");

  const columns = [
    columnHelper.accessor("id", {
      header: () => "ID",
      cell: (info) => info.getValue(),
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

  const table = useReactTable({
    data: posts,
    // data: storedData,
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

  const getPosts = async (): Promise<void> => {
    try {
      //   const response = await axios.get(
      //     "https://jsonplaceholder.typicode.com/posts"
      //   );
      const response = await axios.get("http://localhost:3001/posts");

      console.log(response?.data);

      setPosts(response?.data);
      console.log("Posts =>> ", posts);
      localStorage.setItem("tableData", JSON.stringify(posts));
    } catch (error: any) {
      console.log(error.message);
    }
  };

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
        <button onClick={() => setIsCreate(true)}>Create</button>
        <input
          type="text"
          placeholder="Search..."
          value={search ?? ""}
          onChange={(e) => setSerch(e.target.value)}
        />
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
                    {...{
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                  {header.column.getCanFilter() && (
                    <input
                      type="text"
                      value={(header.column.getFilterValue() || "") as string}
                      onChange={(e) =>
                        header.column.setFilterValue(e.target.value)
                      }
                    />
                  )}
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
        <button onClick={() => table.setPageIndex(0)}>First Page</button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Prev
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
          Last Page
        </button>
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
