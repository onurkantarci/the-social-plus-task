import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "../types";
import SearchBar from "../components/SearchBar";
import { ChevronLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { useUsersStore } from "../stores/UserStore";

const fetchRandomWallpaper = () => {
  return `https://picsum.photos/1920/1080?random=${Math.floor(
    Math.random() * 1000
  )}`;
};

const UserPosts = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  const selectedUser = useUsersStore((state) => state.selectedUser);
  const { setSelectedUser } = useUsersStore();

  useEffect(() => {
    if (id && isLoading) {
      setProgress(10);

      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          return prevProgress < 70 ? prevProgress + 5 : prevProgress;
        });
      }, 200);

      const fetchPost = async () => {
        try {
          const postsResponse = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${id}`
          );
          if (!postsResponse.ok) {
            throw new Error("Failed to fetch posts");
          }
          setProgress(80);

          const data: Post[] = await postsResponse.json();
          setPosts(data);
          setProgress(90);

          if (!selectedUser) {
            const userResponse = await fetch(
              `https://jsonplaceholder.typicode.com/users/${id}`
            );
            if (!userResponse.ok) {
              throw new Error(`Failed to fetch user with id ${id}`);
            }

            const userData = await userResponse.json();
            setSelectedUser(userData);
          }

          setProgress(100);
          clearInterval(progressInterval);
          setIsLoading(false);
        } catch (err) {
          setProgress(100);
          clearInterval(progressInterval);
          setIsLoading(false);
        }
      };

      fetchPost();

      return () => clearInterval(progressInterval);
    }
  }, [id]);

  useEffect(() => {
    const randomWallpaper = fetchRandomWallpaper();
    setBackgroundImage(randomWallpaper);
  }, []);

  const handleNavigation = () => {
    navigate("/");
  };

  const filterPosts = (posts: Post[], query: string) => {
    if (!query.trim()) return posts;

    const lowercaseQuery = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.body.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filteredPosts = filterPosts(posts, searchQuery);

  if (progress < 100) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Progress value={progress} color="indigo" className="w-1/2" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
        className="w-full h-60 bg-cover bg-center flex items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="mt-55 items-center">
            <img
              src={`https://i.pravatar.cc/150?img=${id}?size=50x50`}
              alt="User Avatar"
              className="w-28 h-28 rounded-full"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Label className="mt-4">
              <h1 className="text-2xl font-bold py-1 px-6 rounded-lg text-center">
                {selectedUser?.name}
              </h1>
            </Label>
            <h1 className="font-bold">
              {filteredPosts.length}{" "}
              <span className="font-light text-gray-600">posts</span>
            </h1>
          </div>
        </div>
      </div>
      <Button
        onClick={handleNavigation}
        variant="outline"
        size="icon"
        className="text-cyan-500 border-cyan-500 hover:text-cyan-700 hover:border-cyan-700 ml-10 mt-5 cursor-pointer"
      >
        <ChevronLeft />
      </Button>
      <div className="px-10 mt-20">
        <Label className="mb-2">
          <h1 className="text-2xl font-bold rounded-lg text-center">
            Recent posts
          </h1>
        </Label>
        <SearchBar
          placeholder="Search posts..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ul className="mt-5">
          {filteredPosts.map((post) => (
            <li
              key={post.id}
              className="bg-white hover:bg-cyan-600/30 p-6 my-5 rounded-lg shadow-md"
            >
              <Dialog>
                <DialogTrigger
                  className="cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex mb-4">
                    <img
                      src={`https://i.pravatar.cc/150?img=${id}?size=50x50`}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full mr-5"
                    />
                    <h1 className="text-left mb-5">{selectedUser?.name}</h1>
                  </div>
                  <h2 className="text-lg text-left font-semibold text-gray-900">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 text-left mt-2">{post.body}</p>
                </DialogTrigger>
                {selectedPost && (
                  <DialogContent className="text-left py-10 px-10">
                    <DialogHeader>
                      <DialogTitle>{selectedPost.title}</DialogTitle>
                      <DialogDescription>{selectedPost.body}</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                )}
              </Dialog>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPosts;
