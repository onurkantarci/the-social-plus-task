import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import SearchBar from "../components/SearchBar";
import { Progress } from "../../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Label } from "../../components/ui/label";
import { useUsersStore } from "../stores/UserStore";

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [progress, setProgress] = useState(13);
  const navigate = useNavigate();

  const users = useUsersStore((state) => state.users);

  const { setUsers, setSelectedUser } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
      setProgress(100);
    } catch (err: any) {
      setProgress(100);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    navigate(`/user/posts/${user.id}`);
  };

  const filterUsers = (users: User[], query: string) => {
    if (!query.trim()) return users;

    const lowercaseQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.username.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.website.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filteredUsers = filterUsers(users, searchQuery);

  if (progress < 100) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Progress value={progress} color="indigo" className="w-1/2" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-2 px-5">
      <Label>
        <h1 className="text-2xl mb-2 font-bold text-center text-black py-1  ">
          Users
        </h1>
      </Label>
      <SearchBar
        placeholder="Search users..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead>Email address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              className={`hover:bg-cyan-600/30 transition-all duration-300 h-20 cursor-pointer`}
              onClick={() => handleUserSelect(user)}
            >
              <TableCell>
                <img
                  src={`https://i.pravatar.cc/150?img=${user.id}?size=50x50`}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </TableCell>
              <TableCell className="font-medium">
                <h1 className="text-[18px]">{user.name}</h1>
                <h4 className="text-[12px] mr-23 text-gray-400">
                  @{user.username}
                </h4>
              </TableCell>
              <TableCell className="py-6">
                {user.address.street}, {user.address.city}
              </TableCell>
              <TableCell className="py-6">{user.company.name}</TableCell>
              <TableCell className="py-6">{user.phone}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
