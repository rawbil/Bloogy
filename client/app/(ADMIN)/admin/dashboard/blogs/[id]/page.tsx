"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MessageCircle,
  ThumbsUp,
  PlusCircle,
  ArrowLeft,
  Trash,
  Trash2,
  Trash2Icon,
  Edit2Icon,
  Camera,
  X,
  CameraIcon,
} from "lucide-react";
import { IBlog, IVideo, useContextFunc } from "@/components/context/AppContext";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import Image from "next/image";
import {
  ICreateVideo,
  IUpdateBlog,
  updateBlog,
} from "@/components/services/blogService";
import { toast } from "react-hot-toast";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

export default function BlogDetails() {
  const { blogs, getBlogsFunc } = useContextFunc();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [blog, setBlog] = useState<IBlog | null>(null);
  /*   const [editedBlog, setEditedBlog] = useState<IBlog | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [newTag, setNewTag] = useState<string>(""); */

  const [title, setTitle] = useState(blog?.title || "");
  const [description, setDescription] = useState(blog?.description || "");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState<string | { url: string }>("");
  const [tags, setTags] = useState<string[]>([]);
  const [addTag, setAddTag] = useState(false);
  const [addVideoLink, setAddVideoLink] = useState(false);
  const [links, setLinks] = useState<string[]>([]);
  const [addLink, setAddLink] = useState(false);
  //markdown
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  //videos
  const [videos, setVideos] = useState<IVideo[]>([]);
  /* const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [videoLinks, setVideoLinks] = useState([]); */
  //const [videoThumbnail, setVideoThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      const foundBlog = blogs?.find((b) => b._id.toString() === id);
      setBlog(foundBlog || null);

      if (foundBlog) {
        setTitle(foundBlog.title);
        setDescription(foundBlog.description);
        setBody(foundBlog.body);
        setCategory(foundBlog.category);
        setLinks(foundBlog.links);
        setTags(foundBlog.tags);
        setThumbnail(foundBlog.thumbnail);

        //videos
        setVideos(foundBlog.videos);
      }
      console.log("found blog: ", foundBlog);
    }
  }, [id, blogs]);

  useEffect(() => {
    console.log(thumbnail);
  }, [thumbnail]);

  //delete entire blog
  const handleDeleteBlog = async () => {};

  if (blog === null) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        Blog not found!
      </p>
    );
  }

  const handleEditLink = (e: any, index: number) => {
    const updatedLinks = [...links];
    updatedLinks[index] = e.target.value;
    setLinks(updatedLinks);
  };

  const addNewLink = (e: any) => {
    if (e.key === "Enter") {
      setLinks([...links, e.target.value]);
      setAddLink(false);
    }
    e.target.value === "";
  };

  const handleEditTag = (e: any, index: number) => {
    const updatedTags = [...tags];
    updatedTags[index] = e.target.value;
    setTags(updatedTags);
  };

  const addNewTag = (e: any) => {
    if (e.key === "Enter") {
      setTags([...tags, e.target.value]);
      setAddTag(false);
    }
    e.target.value === "";
  };

  /*   const addNewVideoTag = (e: any) => {
    if(e.key === "Enter") {
      const updated
    }
  } */

  const handleThumbnailUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState == 2) {
        const fileName = fileReader.result as string;
        setThumbnail(fileName);
      }
    };
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  /*  const handleVideoThumbnailUpdate = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const fileName = fileReader.result as string;
        setVideoThumbnail(fileName);
      }
    };
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0]);
    }
  }; */

  const handleUpdateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const updatedBlog: IUpdateBlog = {
      title,
      description,
      body,
      category,
      tags,
      links,
      videos: videos.map((video) => ({
        ...video,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        videoThumbnail:
          typeof video.videoThumbnail === "object"
            ? video.videoThumbnail.url // Use existing URL
            : video.videoThumbnail, // Or new Base64 string
        links: video.links,
      })),
    };

    // Only include thumbnail if it's a new Base64 string
    if (typeof thumbnail === "string") {
      updatedBlog.thumbnail = thumbnail;
    }

    try {
      const response = await updateBlog(updatedBlog, id as string);
      if (response.success) {
        toast.success(response.message);
        router.push("/admin/dashboard/blogs");
        getBlogsFunc().then(() => setLoading(false));
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-[80px] max-700:mb-[150px] p-6 max-w-3xl mx-auto overflow-y-auto font-poppins">
      <header className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
        >
          ← Go Back
        </button>
        <button
          title="delete blog"
          onClick={() => handleDeleteBlog()}
          className="flex items-center gap-1 border-[1.5px] p-2 rounded shadow-inner shadow-crimson bg-opacity-50 border-crimson hover:bg-red-500/50 transition-all group"
        >
          <span> Delete Blog </span>
          <Trash2Icon
            size={14}
            fill="transparent"
            className="text-crimson group-hover:text-white"
          />
        </button>
      </header>

      <div className="dark:border-none border shadow dark:shadow-slate-600 shadow-slate-400 p-4 rounded-md mb-4 relative mt-5">
        <h1 className="text-xl 700:text-2xl font-semibold">Edit Blog</h1>
        <form className="mt-8" onSubmit={handleUpdateBlog}>
          {/* Blog Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="blogTitle">Blog Title: </label>
            <input
              type="text"
              placeholder="Blog Title"
              id="blogTitle"
              value={title}
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
            />
          </div>
          {/* Blog Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="blogDescription">Blog Description: </label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
              placeholder="Blog Description"
            ></textarea>
          </div>

          {/* body */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="blogBody"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Blog Body:
            </label>
            <ReactMde
              value={body}
              onChange={setBody}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(converter.makeHtml(markdown))
              }
              childProps={{
                writeButton: {
                  //  className: "bg-blue-500 dark:text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all",
                },
              }}
              classes={{
                reactMde:
                  "border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800",
                toolbar: "bg-gray-100 dark:bg-gray-900",
                preview:
                  "p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100",
                textArea:
                  "p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded focus:outline focus:outline-slate-800",
              }}
            />
          </div>

          {/* category */}
          <div className="flex flex-col gap-1 mt-4">
            <label htmlFor="blogCategory">Category: </label>
            <input
              type="text"
              placeholder="Blog Category"
              id="blogCategory"
              value={category}
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
            />
          </div>

          {/* thumbnail */}
          <div className="flex flex-col gap-1 my-4">
            <p>Update Thumbnail: </p>
            <div className="relative w-fit">
              <Image
                src={typeof thumbnail === "string" ? thumbnail : thumbnail.url}
                alt="thumbnail"
                width={150}
                height={150}
                className="rounded shadow shadow-slate-700"
              />
              <label htmlFor="thumbnail">
                <Camera
                  className="absolute bottom-2 right-3 cursor-pointer hover:w-[24px] hover:h-[24px] transition-all"
                  width={20}
                  height={20}
                />
              </label>
            </div>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailUpdate}
              hidden
            />
          </div>

          {/* links */}
          <section className="border dark:border-slate-800 p-2 rounded shadow dark:shadow-slate-500">
            <div>
              <label htmlFor="links">Links: </label>
              {links && links.length > 0 ? (
                <div>
                  <div className="flex gap-2 flex-wrap">
                    {links.map((tag, index) => (
                      <input
                        type="text"
                        key={index}
                        defaultValue={tag}
                        /* onChange={(e) => setLinks([...links, e.target.value])} */
                        onKeyDown={(e) => handleEditLink(e, index)}
                        className=" p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-fit"
                      />
                    ))}
                  </div>
                  <div
                    className="flex items-center gap-1"
                    onClick={() => setAddLink(true)}
                  >
                    <PlusCircle className="hover:dark:text-green hover:text-crimson cursor-pointer transition-all" />{" "}
                    <span className="text-xs">Add Link</span>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1"
                  onClick={() => setAddLink(true)}
                >
                  <PlusCircle className="hover:dark:text-green hover:text-crimson cursor-pointer transition-all" />
                  <span className="text-xs">Add Link</span>
                </div>
              )}
            </div>

            {/* Add Link */}
            {addLink && (
              <div>
                <p className="text-xs">Press (Enter) to add</p>
                <input
                  type="text"
                  className="p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-fit"
                  onKeyDown={addNewLink}
                  autoFocus
                />
              </div>
            )}
          </section>

          {/* tags */}
          <section className="border dark:border-slate-800 p-2 rounded shadow dark:shadow-slate-500 mt-7">
            <div>
              <label htmlFor="links">Tags: </label>
              {tags && tags.length > 0 ? (
                <div>
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag, index) => (
                      <input
                        type="text"
                        key={index}
                        defaultValue={tag}
                        onKeyDown={(e) => handleEditTag(e, index)}
                        className=" p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-fit"
                      />
                    ))}
                  </div>
                  <div
                    className="flex items-center gap-1"
                    onClick={() => setAddTag(true)}
                  >
                    <PlusCircle className="hover:dark:text-green hover:text-crimson cursor-pointer transition-all" />{" "}
                    <span className="text-xs">Add Tag</span>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1"
                  onClick={() => setAddTag(true)}
                >
                  <PlusCircle className="hover:dark:text-green hover:text-crimson cursor-pointer transition-all" />
                  <span className="text-xs">Add Tag</span>
                </div>
              )}
            </div>

            {/* Add Tag */}
            {addTag && (
              <div>
                <p className="text-xs">Press (Enter) to add</p>
                <input
                  type="text"
                  className="p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-fit"
                  onKeyDown={addNewTag}
                  autoFocus
                />
              </div>
            )}
          </section>

          {/* videos */}
          <section className="border dark:border-slate-800 p-2 rounded shadow dark:shadow-slate-500 mt-7">
            <h1 className="text-xl mb-3 font-semibold">Blog Videos</h1>
            {videos && videos.length > 0 ? (
              <div>
                {videos.map((video, index) => (
                  <section
                    key={index}
                    className="border-b-2 mt-2 last:border-none "
                  >
                    <h2 className="font-medium mb-2 text-center">
                      Video{" "}
                      <span className="font-bold dark:text-green text-crimson">
                        {index + 1}
                      </span>
                    </h2>
                    <section>
                      <div className="mb-2">
                        <label htmlFor={`title-${index}`}>Title: </label>
                        <input
                          type="text"
                          value={video.title}
                          placeholder="video title"
                          id={`title-${index}`}
                          onChange={(e) => {
                            const updatedVideos = [...videos];
                            updatedVideos[index] = {
                              ...video,
                              title: e.target.value,
                            };
                            setVideos(updatedVideos);
                          }}
                          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor={`description-${index}`}>
                          Description:{" "}
                        </label>
                        <textarea
                          name="description"
                          id={`description-${index}`}
                          placeholder="video description"
                          value={video.description}
                          onChange={(e) => {
                            const updatedVideos = [...videos];
                            updatedVideos[index] = {
                              ...video,
                              description: e.target.value,
                            };
                            setVideos(updatedVideos);
                          }}
                          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
                        ></textarea>
                      </div>
                      <div className="mb-2">
                        <label htmlFor={`url-${index}`}>Video Url: </label>
                        <input
                          type="text"
                          id={`url-${index}`}
                          name="videoUrl"
                          placeholder="videoUrl"
                          value={video.videoUrl}
                          onChange={(e) => {
                            const updatedVideos = [...videos];
                            updatedVideos[index] = {
                              ...video,
                              videoUrl: e.target.value,
                            };
                            setVideos(updatedVideos);
                          }}
                          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
                        />
                      </div>

                      {/* links */}
                      <div className="mb-2">
                        <h2 className="after:">Video Links: </h2>
                        {video.links && video.links.length > 0 ? (
                          <>
                            <div className="flex flex-wrap gap-2">
                              {video.links.map((link, linkIndex) => (
                                <div key={linkIndex} className="flex">
                                  <input
                                    type="text"
                                    placeholder={`link-${linkIndex + 1}`}
                                    value={link}
                                    onChange={(e) => {
                                      const updatedVideos = [...videos];
                                      const singleVideo = {
                                        ...updatedVideos[index],
                                      };
                                      if (Array.isArray(singleVideo.links)) {
                                        singleVideo.links[linkIndex] =
                                          e.target.value;
                                        updatedVideos[index] = singleVideo;
                                        setVideos(updatedVideos);
                                      }
                                    }}
                                    className="w-fit p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
                                  />
                                  <X
                                    className="-ml-4 cursor-pointer"
                                    size={16}
                                    onClick={() => {
                                      const updatedVideos = [...videos];
                                      const singleVideo = {
                                        ...updatedVideos[index],
                                      };
                                      const updatedLinks =
                                        singleVideo.links.filter(
                                          (_, i) => i !== linkIndex
                                        );
                                      updatedVideos[index] = {
                                        ...singleVideo,
                                        links: updatedLinks,
                                      };
                                      setVideos(updatedVideos);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                            <section>
                              <div
                                className="flex items-center gap-1"
                                onClick={() => setAddVideoLink(true)}
                              >
                                <PlusCircle className="hover:dark:text-green hover:text-crimson cursor-pointer transition-all" />
                                <span className="text-xs">Add Link</span>
                              </div>
                              {addVideoLink && (
                                <div className="block">
                                  <p className="text-xs">
                                    Press (Enter) to add
                                  </p>
                                  <input
                                    type="text"
                                    className="p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-fit"
                                    onKeyDown={(e: any) => {
                                      if (e.key === "Enter") {
                                        const updatedVideos = [...videos];
                                        const updatedVideo = {
                                          ...updatedVideos[index],
                                        };
                                        const newLink = e.target.value;

                                        if (
                                          !updatedVideo.links.includes(newLink)
                                        ) {
                                          const updatedLinks = [
                                            ...updatedVideo.links,
                                            newLink,
                                          ];
                                          updatedVideos[index] = {
                                            ...updatedVideo,
                                            links: updatedLinks,
                                          };
                                          setVideos(updatedVideos);
                                          e.target.value = "";
                                        } else {
                                          alert("Link already exists");
                                        }
                                      }
                                    }}
                                    autoFocus
                                  />
                                </div>
                              )}
                            </section>
                          </>
                        ) : (
                          <div>
                            <section>
                              <div
                                className="flex items-center gap-1"
                                onClick={() => setAddVideoLink(true)}
                              >
                                <PlusCircle className="hover:dark:text-green hover:text-crimson cursor-pointer transition-all" />
                                <span className="text-xs">Add Link</span>
                              </div>
                              {addVideoLink && (
                                <div className="block">
                                  <p className="text-xs">
                                    Press (Enter) to add
                                  </p>
                                  <input
                                    type="text"
                                    className="p-2 mb-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md w-fit"
                                    onKeyDown={(e: any) => {
                                      if (e.key === "Enter") {
                                        const updatedVideos = [...videos];
                                        const updatedVideo = {
                                          ...updatedVideos[index],
                                        };
                                        const newLink = e.target.value;

                                        if (
                                          !updatedVideo.links.includes(newLink)
                                        ) {
                                          const updatedLinks = [
                                            ...updatedVideo.links,
                                            newLink,
                                          ];
                                          updatedVideos[index] = {
                                            ...updatedVideo,
                                            links: updatedLinks,
                                          };
                                          setVideos(updatedVideos);
                                          e.target.value = "";
                                        } else {
                                          alert("Link already exists");
                                        }
                                      }
                                    }}
                                    autoFocus
                                  />
                                </div>
                              )}
                            </section>
                          </div>
                        )}
                      </div>

                      {/* video thumbnail */}
                      <div className="my-2 mt-4">
                        <p>Update Video Thumbnail: </p>
                        <div className="relative w-fit">
                          {video.videoThumbnail && (
                            <Image
                              src={
                                typeof video.videoThumbnail === "object"
                                  ? video.videoThumbnail.url
                                  : video.videoThumbnail || ""
                              }
                              alt="video-thumbnail"
                              width={100}
                              height={100}
                              unoptimized
                              className="rounded shadow shadow-slate-700"
                            />
                          )}

                          <label htmlFor={`videothumbnail-${index}`}>
                            <Camera
                              className="absolute bottom-2 right-3 cursor-pointer hover:w-[24px] hover:h-[24px] transition-all"
                              width={20}
                              height={20}
                            />
                          </label>
                          <input
                            type="file"
                            id={`videothumbnail-${index}`}
                            accept="image/*"
                            name="videoThumbnail"
                            hidden
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const fileReader = new FileReader();
                              fileReader.onload = () => {
                                if (fileReader.readyState === 2) {
                                  const base64String =
                                    fileReader.result as string;
                                  const updatedVideos = [...videos];
                                  updatedVideos[index] = {
                                    ...updatedVideos[index],
                                    videoThumbnail: base64String,
                                  };
                                  setVideos(updatedVideos);
                                }
                              };
                              if (e.target.files && e.target.files[0]) {
                                fileReader.readAsDataURL(e.target.files[0]); // Read the file as a Base64 string
                              }
                            }}
                          />
                        </div>
                      </div>
                    </section>
                  </section>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </section>
          {/* submit button */}
          <button
            type="submit"
            className="flex items-center place-self-end mt-5 gap-1 border-[1.5px] p-2 rounded shadow-inner shadow-green bg-opacity-50 border-green hover:bg-emerald-200/50 transition-all group"
          >
            {!loading ? (
              <>
                {" "}
                <span> Update Blog </span>
                <Edit2Icon
                  size={14}
                  fill="transparent"
                  className="text-green group-hover:text-white"
                />
              </>
            ) : (
              "Updating in progress..."
            )}
          </button>
        </form>
      </div>
    </section>
  );

  /* const handleInputChange = (field: keyof IBlog, value: any) => {
    setEditedBlog({ ...editedBlog, [field]: value } as IBlog);
    setIsModified(true);
  };

  const handleReply = (commentId: number) => {
    if (!blog || !replyContent.trim()) return;
    const updatedComments = blog.comments.map((comment) =>
      comment.id === commentId
        ? { 
            ...comment, 
            replies: [...comment.replies, { id: Date.now(), content: replyContent, replies: [] }] 
          }
        : comment
    );
    setEditedBlog({ ...blog, comments: updatedComments });
    setReplyingTo(null);
    setReplyContent("");
    setIsModified(true);
  };

  const handleAddTag = () => {
    if (!blog || !newTag.trim()) return;
    setEditedBlog({ ...blog, tags: [...blog.tags, newTag] });
    setNewTag("");
    setIsModified(true);
  };

  if (!blog) {
    return <p className="text-center text-red-500 text-lg font-semibold">Blog not found!</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto mb-20 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-semibold mb-4"
      >
        <ArrowLeft size={20} />
        Go Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Blog Details</h1>
      
      <input
        type="text"
        value={blog.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Blog Title"
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 text-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        value={blog.body}
         onChange={(e) => handleInputChange("content", e.target.value)} 
        placeholder="Blog Content"
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 text-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
      />

      <div>
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <input
              key={index}
              type="text"
              value={tag}
              onChange={(e) => {
                const updatedTags = [...blog.tags];
                updatedTags[index] = e.target.value;
                handleInputChange("tags", updatedTags);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleAddTag} className="text-blue-500 hover:text-blue-600">
            <PlusCircle size={24} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Comments</h2>
        
        {blog.comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded-lg shadow-sm mb-4 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-blue-500 hover:text-blue-600"
              >
                <MessageCircle size={20} />
              </button>
              <button className="text-green-500 hover:text-green-600">
                <ThumbsUp size={20} />
              </button>
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleReply(comment.id)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Submit Reply
                </button>
              </div>
            )}

            {comment.replies.length > 0 && (
              <div className="mt-3 ml-6 border-l-2 border-gray-300 dark:border-gray-700 pl-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Replies:</h4>
                {comment.replies.map((reply: any) => (
                  <p key={reply.id} className="mt-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    {reply.content}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModified && (
        <button
          onClick={() => alert("Blog updated!")}
          className="bg-green-500 text-white px-5 py-2 rounded-lg mt-6 hover:bg-green-600 transition-all"
        >
          Update Blog
        </button>
      )}
    </div>
  );
};

 */
}
