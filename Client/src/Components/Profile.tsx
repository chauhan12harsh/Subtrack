import { useEffect, useState } from "react";

import { userService } from "../Services/userService";
import type {
  User,
  UpdateUserRequest,
  ChangePasswordRequest,
} from "../Types/user";

import Alert from "./Alert";
import type { AlertState } from "../Types/Alert";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (
    type: AlertState["type"],
    title: string,
    message: string,
  ) => {
    setAlert({ type, title, message });
  };

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await userService.getCurrentUser();

      setUser(data);
      setUsername(data.username);
      setEmail(data.email);
    } catch (error) {
      console.error("Failed to load profile:", error);

      showAlert(
        "error",
        "Unable to Load Profile",
        "Something went wrong while loading your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>,) => {
    event.preventDefault();

    if (!username.trim()) {
      showAlert("warning", "Invalid Username", "Username cannot be empty.");
      return;
    }

    if (!email.trim()) {
      showAlert("warning", "Invalid Email", "Email cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);

      const data: UpdateUserRequest = {
        username: username.trim(),
        email: email.trim(),
      };

      const updatedUser = await userService.updateProfile(data);

      setUser(updatedUser);
      setUsername(updatedUser.username);
      setEmail(updatedUser.email);

      showAlert(
        "success",
        "Profile Updated",
        "Your profile has been updated successfully.",
      );
    } catch (error) {
      console.error("Failed to update profile:", error);

      showAlert(
        "error",
        "Update Failed",
        "Unable to update your profile. Please try again.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      showAlert("warning", "Invalid Password", "Password cannot be empty.");
      return;
    }

    if (password.length < 6) {
      showAlert(
        "warning",
        "Invalid Password",
        "Password must contain at least 6 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert(
        "warning",
        "Passwords Do Not Match",
        "New password and confirmation password must match.",
      );
      return;
    }

    try {
      setChangingPassword(true);

      const data:ChangePasswordRequest = {
        Password: password,        
      }

      await userService.changePassword(data);

      setPassword("");
      setConfirmPassword("");

      showAlert(
        "success",
        "Password Updated",
        "Your password has been changed successfully.",
      );
    } catch (error) {
      console.error("Failed to change password:", error);

      showAlert(
        "error",
        "Password Update Failed",
        "Unable to change your password. Please try again.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(balance);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex justify-center items-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />

            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Unable to load profile
          </h2>

          <p className="text-gray-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>

        <p className="text-gray-500 mt-1">
          Manage your account information and password.
        </p>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              {user.username}
            </h2>

            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>

          <div className="border-t mt-6 pt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Role</p>

              <p className="font-medium text-gray-800 mt-1">{user.role}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Created</p>

              <p className="font-medium text-gray-800 mt-1">
                {formatDate(user.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Balance</p>

              <p className="font-semibold text-green-600 text-lg mt-1">
                {formatBalance(user.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Profile Information
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={savingProfile}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-2.5
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  disabled:bg-gray-100
                "
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={savingProfile}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-2.5
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  disabled:bg-gray-100
                "
              />
            </div>

            {/* Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Balance
              </label>

              <input
                type="text"
                value={formatBalance(user.balance)}
                disabled
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-lg
                  px-4
                  py-2.5
                  bg-gray-100
                  text-gray-600
                  cursor-not-allowed
                "
              />

              <p className="text-xs text-gray-500 mt-1">
                Balance cannot be changed from your profile.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-blue-300
                  text-white
                  px-5
                  py-2.5
                  rounded-lg
                  font-medium
                  transition
                "
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Change Password
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Use a strong password with at least 6 characters.
          </p>

          <form
            onSubmit={handleChangePassword}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={changingPassword}
                placeholder="Enter new password"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-2.5
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  disabled:bg-gray-100
                "
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={changingPassword}
                placeholder="Confirm new password"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-2.5
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  disabled:bg-gray-100
                "
              />
            </div>

            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="
                  bg-slate-800
                  hover:bg-slate-900
                  disabled:bg-slate-400
                  text-white
                  px-5
                  py-2.5
                  rounded-lg
                  font-medium
                  transition
                "
              >
                {changingPassword ? "Changing Password..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
