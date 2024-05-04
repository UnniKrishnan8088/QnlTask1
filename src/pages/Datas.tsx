// import { createColumnHelper } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import EditPost from "../components/EditPost";
import { FaRegEdit } from "react-icons/fa";

type Post = {
  body: string;
  title: string;
  userId: number;
  id?: number | null;
};

const columnHelper = createColumnHelper<Post>();

export default function Datas() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Post>({
    body: "",
    title: "",
    userId: 0,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSerch] = useState<string>("");

  const columns = [
    columnHelper.accessor("id", {
      header: () => "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
      header: () => "title",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "edit",
      cell: (info) => {
        return (
          <button
            onClick={() => {
              setIsEdit(true);
              setEditData(info.cell.row.original);
            }}
          >
            Edit
          </button>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: () => "Delete",
      cell: (info) => (
        <button
          onClick={() => {
            handleDelete(info.getValue());
          }}
        >
          <FaRegEdit />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: posts,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting: sorting,
      globalFilter: search,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSerch,
  });

  const getPosts = async (): Promise<void> => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );

      console.log(response?.data);

      setPosts(response?.data);
      console.log("Posts =>> ", posts);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleDelete = async (id: number | null | undefined) => {
    console.log(id);

    try {
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setIsCreate(true)}>Create</button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
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
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: "🔽",
                    desc: "🔼",
                  }[header.column.getIsSorted() as string] ?? null}
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
          getPosts={getPosts}
          closeModal={() => setIsEdit(false)}
          editData={editData}
        />
      )}
    </div>
  );
}
