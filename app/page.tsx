
"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Tag,
  Avatar,
  Skeleton,
  Empty,
  Popconfirm,
  message,
  Tooltip,
  notification
} from "antd";
import { useRouter } from "next/navigation";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  RobotOutlined,
  PlusOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Link from "next/link";



export default function Home() {

    {/*Route Managment */}
  const router = useRouter()

  interface Post {
    _id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    author: string;
  }


  {/*Constant variables */ }
  const defaultStyles = {
    root: {
      backgroundColor: '#f6ffed',
      border: '2px solid #95de64',
      borderRadius: 16,
      boxShadow: '4px 4px 0 #d9f7be',
    },
    icon: {
      color: '#237804',
    },
    title: {
      color: '#237804',
      fontWeight: 600,
    },
    description: {
      color: '#3f6600',
    },
  };

  const styleFn = ({ props }: { props: { type?: string } }) => {
    if (props.type === 'error') {
      return {
        ...defaultStyles,
        root: {
          ...defaultStyles.root,
          backgroundColor: '#fff2f0',
          borderColor: '#ffccc7',
          boxShadow: '4px 4px 0 #ffccc7',
        },
        icon: {
          color: '#cf1322',
        },
        title: {
          color: '#cf1322',
        },
        description: {
          color: '#5c0011',
        },
      };
    }

    return defaultStyles;
  };
  {/* State Management */ }
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Post[]>([]);
  const [filteredData, setFilteredData] = useState<Post[]>([]);
  const [api, contextHolder] = notification.useNotification();



  const fetchData = async () => {
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post`);

      if (!response.ok) {
        api.error({
          title: 'Api Error',
          description: 'There is Some Backend issue',
          duration: 3000,
          placement: "bottomRight",
          type: 'error',
          styles: styleFn,
        });
        throw  Error("Failed to fetch posts");
      }

      const getData = await response.json();
      setData(getData?.message || [])
      setFilteredData(getData?.message || [])
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    document.title=" Home | Page"
    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);

    const searchValue = value.toLowerCase();

    const filtered = data.filter(
      (post) =>
        post?.title?.toLowerCase().includes(searchValue) ||
        post?.description?.toLowerCase().includes(searchValue) ||
        post?.category?.toLowerCase().includes(searchValue)
    );

    setFilteredData(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        api.error({
          title: "API Error",
          description: "There is some backend issue.",
          placement: "bottomRight",
          duration: 3,
          type: "error",
          styles: styleFn,
        });

        return;
      }

      api.success({
        title: "Success",
        description: "Post deleted successfully.",
        placement: "bottomRight",
        duration: 3,
        styles: defaultStyles,
      });

      // Get the latest data from backend
      await fetchData();

    } catch (error) {
      api.error({
        title: "Network Error",
        description: "Unable to connect to the backend.",
        duration: 3,
        type: "error",
        styles: styleFn,
      });
    }
  };
  const handleView = (id: String) => {
    // message.info(`Opening post ${id}`);
  };

  const handleEdit = (id: String) => {
    router.push(`/createpost?mode=Edit&cid=${id}`)
  };
  return (
    <>
      {contextHolder}
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 animate-[fadeIn_1.5s_ease-in-out]">
        {/* Header */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/30 backdrop-blur-[2px]">
            <div className="rounded-2xl border border-white/60 bg-white/80 px-8 py-6 text-center shadow-xl backdrop-blur-xl">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

              <p className="font-medium text-gray-800">
                Loading posts...
              </p>

              <p className="mt-1 text-sm text-gray-500">
                AI is preparing your content
              </p>
            </div>
          </div>
        )}

        {/* <section className="relative overflow-hidden border-b border-gray-200 bg-white"> */}
<section className="relative overflow-hidden">
  {/* Background glow */}
  <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
  <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

  <div
    className="
      relative mx-auto flex max-w-7xl
      flex-col items-start gap-10
      px-6 py-20
      lg:flex-row lg:items-center lg:justify-between
    "
  >
    {/* Text content */}
    <div className="max-w-3xl">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600">
        <span className="flex h-2 w-2 rounded-full bg-purple-500" />
        AI Powered Blog
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
        Ideas that shape the
        <br />
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          future of technology.
        </span>
      </h1>

      {/* Description */}
      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
        Discover insights, ideas and knowledge about AI, technology,
        development and modern design.
      </p>
    </div>

    {/* Create Post */}
    <div className="w-full lg:w-auto">
      <Link href="/createpost">
        <button
          className="
            group inline-flex w-full items-center justify-center gap-3
            rounded-xl bg-slate-800 px-6 py-3.5
            text-sm font-semibold text-white
            shadow-lg shadow-slate-900/20
            transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-xl
            cursor-pointer
            sm:w-auto
          "
        >
          <span
            className="
              flex h-7 w-7 items-center justify-center rounded-lg
              bg-white/10 text-lg
              transition-transform
              group-hover:-translate-x-2
            "
          >
            +
          </span>

          Create Post

          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </Link>
    </div>
  </div>
</section>

        {/* Content */}

        {/* <section className="mx-auto max-w-7xl px-6 py-8"> */}
        <section className="mx-auto max-w-7xl px-6 py-8">

          {/* latest post and search bar section */}
          <section className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

              {/* Section Heading */}
              <div>
                {/* Section badge */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  Latest Posts
                </div>

                {/* Heading */}
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Explore Our Latest Articles
                  </h2>

                  <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-600">
                    {data.length} articles
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
                  Explore insights, ideas and practical knowledge across AI,
                  technology, development and modern design.
                </p>
              </div>

              {/* Modern Search */}
              <div className="w-full lg:w-[380px]">
                <div
                  className="
                              group relative flex h-14 items-center
                              rounded-2xl border border-slate-200
                              bg-white/80
                              shadow-lg
                              backdrop-blur-xl
                              transition-all duration-300
                              hover:border-purple-200
                              hover:shadow-md
                              focus-within:border-purple-400
                              focus-within:shadow-lg
                              focus-within:shadow-purple-100
                            border-2 border-red-900
                            "
                >
                  {/* Search Icon */}
                  <div className="pointer-events-none absolute left-4 flex items-center">
                    <SearchOutlined
                      className="
              text-lg text-slate-400
              transition-colors duration-200
              group-focus-within:text-purple-500
            "
                    />
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="
            h-full w-full
            rounded-2xl
            bg-transparent
            pl-12 pr-12
            text-sm font-medium text-slate-700
            outline-none
            placeholder:text-slate-400
          "
                  />

                  {/* Search Shortcut */}
                  <div className="pointer-events-none absolute right-4 hidden items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-400 sm:flex">
                    <span>⌘</span>
                    <span>K</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          {filteredData?.length === 0 && !loading ? (
            <Empty
              description="No posts found"
              className="rounded-2xl bg-white py-20"
            />
          ) : (
            <div className="relative">

              <div
                className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 ${loading
                  ? "pointer-events-none select-none blur-[4px]"
                  : ""
                  }`}
              >
                {filteredData?.map((post) => (
                  <Card
                    key={post?._id}
                    hoverable
                    className="overflow-hidden rounded-2xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    cover={
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={post?.image || ""}
                          alt={post?.title || ""}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />

                        <div className="absolute left-4 top-4">
                          <Tag
                            color="blue"
                            className="rounded-full border-0 px-3 py-1"
                          >
                            {post?.category || ""}
                          </Tag>
                        </div>
                      </div>
                    }
                  >
                    <Skeleton
                      loading={loading}
                      active
                      avatar={false}
                      paragraph={{ rows: 3 }}
                    >
                      {/* Author */}
                      <div className="mb-4 flex items-center gap-3">
                        <Avatar
                          size={36}
                          className="bg-gradient-to-r from-purple-500 to-blue-500"
                        >
                          {post?.author?.charAt(0) || ""}
                        </Avatar>

                        <div>
                          <p className="mb-0 text-sm font-medium text-gray-800">
                            {post?.author || ""}
                          </p>

                          <p className="mb-0 text-xs text-gray-400">
                            AI Generated Content
                          </p>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900">
                        {post?.title || ""}
                      </h2>

                      {/* Description */}
                      <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-500">
                        {post?.description || ""}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <Link href={`/view?id=${post?._id}`}>
                        <Button
                          type="link"
                          className="px-0"
                          icon={<ArrowRightOutlined />}
                          iconPlacement="end"
                          onClick={() => handleView(post?.title || "")}
                        >
                          Read More
                        </Button>
                      </Link>

                        <div className="flex items-center gap-1">
                          <Tooltip title="View">
                            <Button
                              type="text"
                              shape="circle"
                              icon={<EyeOutlined />}
                              onClick={() => handleView(post?._id || "")}
                            />
                          </Tooltip>

                          <Tooltip title="Edit">
                            <Button
                              type="text"
                              shape="circle"
                              icon={<EditOutlined />}
                              onClick={() => handleEdit(post?._id || "")}
                            />
                          </Tooltip>

                          <Popconfirm
                            title="Delete this post?"
                            description="This action cannot be undone."
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{
                              danger: true,
                            }}
                            onConfirm={() => handleDelete(post?._id || "")}
                          >
                            <Tooltip title="Delete">
                              <Button
                                type="text"
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                              />
                            </Tooltip>
                          </Popconfirm>
                        </div>
                      </div>
                    </Skeleton>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>

      </main>
    </>
  );
}