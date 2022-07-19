import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import AdminComp from "./components/Admin";
import UserComp from "./components/User";

const socket = io("http://localhost:8000");

type User = {
  id: number;
  name: string;
};

type Msg = {
  msg: string;
  date: string;
};

function App() {
  const mounted = useRef<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({ id: -1, name: "" });
  const [msg, setMsg] = useState<Msg[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected.");
    });

    socket.on("joinedCallback", (payload: any) => {
      console.log({ joinedCallback: payload });
      // alert(payload);
    });

    socket.on("msg", (payload: { msg: string; date: string }) => {
      setMsg((prev) => [...prev, payload]);
    });

    return () => {
      socket.off("connect");
      socket.off("joinedCallback");
      socket.off("msg");
    };
  }, []);

  const getUsers = useCallback(async () => {
    const res = await axios.get<{ users: User[] }>(
      "http://localhost:8000/users"
    );
    console.log(res.data);
    setUsers(res.data.users);
  }, []);

  const joinedClick = (user: User) => {
    socket.emit("joined", user.id);
    setUser(user);
  };

  useEffect(() => {
    if (!mounted.current) {
      getUsers();
      mounted.current = true;
    }
  }, []);

  return (
    <div className="p-8">
      {user.id === -1 && (
        <div>
          <h3 className="font-bold text-lg">Select User</h3>
          <hr />
          {users.map((user) => (
            <button
              key={user.id}
              className="text-white m-2 py-1 px-2 bg-blue-400 rounded"
              onClick={() => joinedClick(user)}
            >
              {user.name}
            </button>
          ))}
        </div>
      )}

      {user?.id === 0 && <AdminComp users={users} socket={socket} />}
      {user?.id > 0 && <UserComp user={user} msg={msg} />}
    </div>
  );
}

export default App;
