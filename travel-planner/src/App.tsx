import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import TripPage from "./pages/TripPage";

import {
  signInWithGoogle,
  signOut,
} from "./lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [email, setEmail] =
    useState("");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log(user);

      setEmail(user?.email ?? "");
    };

    loadUser();
  }, []);

  return (
    <BrowserRouter>
      {email ? (
  <>
    <p>ログイン中: {email}</p>

    <button onClick={signOut}>
      ログアウト
    </button>
  </>
) : (
  <button onClick={signInWithGoogle}>
    Googleでログイン
  </button>
)}

      <p>{email}</p>

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/trip/:id"
          element={<TripPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;