import React from "react";

type User = {
  id: number;
  name: string;
};

type Msg = {
  msg: string;
  date: string;
};

type Props = {
  user: User;
  msg: Msg[];
};

function User({ user, msg }: Props) {
  console.log(msg);
  return (
    <>
      <h3 className="font-bold text-lg">{user.name}</h3>
      <hr />
      <h4 className="font-bold">Messages.</h4>
      {msg.map((m, i) => (
        <div key={i} className="my-2">
          <section>{m.msg}</section>
          <section>{m.date}</section>
          <hr />
        </div>
      ))}
    </>
  );
}

export default User;
