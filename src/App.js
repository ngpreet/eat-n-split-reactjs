import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friendsList) => [...friendsList, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend(friend);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectFriend={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  return (
    <li className="">
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you ₹{Math.abs(friend.balance)}
        </p>
      )}

      <Button onClick={() => onSelectFriend(friend)}>Select</Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = Date.now();
    const friend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    onAddFriend(friend);

    setName("");
    setimage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      ></input>

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billValue, SetBillValue] = useState("");
  const [userExpense, SetUserExpense] = useState("");
  const friendExpense = billValue ? billValue - userExpense : "";
  const [whoIsPaying, SetWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!billValue || !userExpense) return;

    onSplitBill(whoIsPaying === "user" ? friendExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>Bill Value</label>
      <input
        type="number"
        value={billValue}
        onChange={(e) => SetBillValue(Number(e.target.value))}
      ></input>

      <label>Your expense</label>
      <input
        type="number"
        value={userExpense}
        onChange={(e) =>
          Number(e.target.value) > billValue
            ? userExpense
            : SetUserExpense(Number(e.target.value))
        }
      ></input>

      <label>{selectedFriend.name}'s expense</label>
      <input type="number" disabled value={friendExpense}></input>

      <label>Who is paying</label>
      <select
        value={whoIsPaying}
        onChange={(e) => SetWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
