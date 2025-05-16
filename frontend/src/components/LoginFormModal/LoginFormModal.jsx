import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// no longer needed after changing LoginFormPage to LoginFormModal
// import { Navigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";


function LoginFormModal() {
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  // no longer needed after changing LoginFormPage to LoginFormModal:
  // // if user is already logged in when trying to access LoginFormPage, redirect them to the / path
  // if (sessionUser) return <Navigate to="/" replace={true} />;
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };  // On submit of form, dispatch the login thunk action with the form input values. Display errors if needed

  // Render a form with a controlled input for the user login credential (username or email) and password
  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className="error">{errors.credential}</p>}
        <button type="submit">Log In</button>
      </form>
    </>
  );
}



export default LoginFormModal;
