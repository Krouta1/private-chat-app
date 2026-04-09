import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const ANIMALS = [
  "tiger",
  "eagle",
  "wolf",
  "panther",
  "dragon",
  "phoenix",
  "leopard",
  "falcon",
  "serpent",
  "griffin",
];

const STORAGE_KEY = "chat_username";

const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `anonymous-${word}-${nanoid(5)}`;
};

export const useUsername = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUsername(stored);
        return;
      }
      // No username stored, generate a new one
      const newUsername = generateUsername();
      localStorage.setItem(STORAGE_KEY, newUsername);
      setUsername(newUsername);
    };
    main();
  }, []);
  return { username };
};
