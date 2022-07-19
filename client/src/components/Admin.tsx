import React, { useState } from "react";
import { Socket } from "socket.io-client";
type User = {
  id: number;
  name: string;
};

type Props = {
  users: User[];
  socket: Socket;
};

function Admin({ users, socket }: Props) {
  const [msg, setMsg] = useState<string>("");

  const sendTo = (id: number) => {
    const date = new Date();
    socket.emit("sendTo", {
      id: id,
      msg: msg,
      date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
    });
  };

  return (
    <>
      <h3 className="text-lg font-bold">Admin</h3>
      <hr />
      <textarea
        className="border border-green-400 rounded p-2 my-2"
        style={{ width: "100%" }}
        onChange={(e) => setMsg(e.target.value)}
      ></textarea>
      <hr />
      {users.map(
        (user) =>
          user.id !== 0 && (
            <button
              key={user.id}
              className="m-2 py-1 px-3 rounded bg-green-500 text-white"
              onClick={() => sendTo(user.id)}
            >
              Send to : {user.name}
            </button>
          )
      )}
    </>
  );
}

export default Admin;
