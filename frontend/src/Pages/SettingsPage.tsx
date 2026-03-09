import { useState } from "react";
import { Lock } from "lucide-react";
import { LogOut } from "lucide-react";
import { User } from "lucide-react";
import { Trash2 } from "lucide-react";

function useSettingsPage(){
  const [name, setName] = useState("John Anderson");
  const [email, setEmail] = useState("john.anderson@email.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  
  // User is required to provide current password if he wish to change the password; security measure .
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleSaveProfile = () => {
    // Frontend only - no backend logic
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    // Frontend only - no backend logic
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    // Frontend only - no backend logic
    alert("Logged out successfully!");
  };

  const handleDeleteAccount = () => {
    // Frontend only - no backend logic
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirm) {
      alert("Account deleted successfully!");
    }
  };
  return{
    name,
    handleLogout,
    handleDeleteAccount,
    handleSaveProfile,
    handleChangePassword,
    email,
    phone,
    currentPassword,
    setCurrentPassword,
    setName,
    setEmail,
    setPhone,
    setNewPassword,
    setConfirmPassword,
    newPassword,
    confirmPassword
  }
}

export   default function SettingsPage() {
  const{
    name,
    handleLogout,
    handleDeleteAccount,
    handleSaveProfile,
    handleChangePassword,
    email,
    phone,
    currentPassword,
    setCurrentPassword,
    setName,
    setEmail,
    setPhone,
    setNewPassword,
    setConfirmPassword,
    newPassword,
    confirmPassword
  }=useSettingsPage();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500">
              Update your personal details
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>
            <p className="text-sm text-gray-500">
              Update your account password
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Confirm new password"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleChangePassword}
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <LogOut className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Account Actions
            </h2>
            <p className="text-sm text-gray-500">
              Manage your account access
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 justify-center"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
            <p className="text-sm text-gray-500">
              Irreversible account actions
            </p>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> Deleting your account will permanently
            remove all your data. This action cannot be undone.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}
