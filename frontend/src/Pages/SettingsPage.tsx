import React, { useState } from "react";
import { Lock } from "lucide-react";
import { LogOut } from "lucide-react";
import { User } from "lucide-react";
import { Trash2 } from "lucide-react";
import LoadingEffect from "../Imports/LoadingEffect";
type ChangeProfileRequest={
    new_name: string;
    new_number: string;
}
type ChangePasswordRequest={
    old_password: string;
    new_password: string;
    confirm_password: string;
}


type InternalServerError={
      status_code:number;
      detail:string;
}
type SuccessResponse={
    message: string
}
type MessageBoxProps = {
  Msg: string;
  isErrorMsg: boolean;
};

function MessageBox({ isErrorMsg,Msg }: MessageBoxProps) {

  const styles = {
    error: {
      border: "border-red-300",
      bg: "bg-red-50",
      icon: "text-red-600",
      text: "text-red-800"
    },

    success: {
      border: "border-green-300",
      bg: "bg-green-50",
      icon: "text-green-600",
      text: "text-green-800"
    }
  };

  const current = isErrorMsg? styles["error"]:styles["success"]

  return (
    <div className={`translate-y-4 border rounded-lg p-4 ${current.border} ${current.bg}`}>
      <div className="flex items-start gap-3">

        <svg
          className={`w-5 h-5 mt-0.5 ${current.icon}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <div className="flex-1">
          <p className={`text-sm ${current.text}`}>
            {Msg}
          </p>
        </div>

      </div>
    </div>
  );
}
function useSettingsPage(){
  // change name and password states (user's states and accessories states(additional states for user experience))
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading1, setIsLoading1] = useState(false);
  const [isThereError1, setIsThereError1] = useState(false);
  const [Msg1, setMsg1] = useState("");
  const [finishedProcessingProfile,setFinishedProcessingProfile]=useState(false);
  
  //handle change password states(user's states and accessories states(additional states for user experience))
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading2, setIsLoading2] = useState(false);
  const [isThereError2, setIsThereError2] = useState(false);
  const [Msg2, setMsg2] = useState("");
  const [finishedProcessingPassword,setFinishedProcessingPassword]=useState(false);
  const   handleSaveProfile = async(e:React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading1(true);
    setIsThereError1(false);
    setMsg1("");
    setFinishedProcessingProfile(false);
    const payload:ChangeProfileRequest={
      new_name:name,
      new_number:phone
    }   
    console.log("send payload is : ", payload)
    try{
      const response = await fetch("http://localhost:8000/UserSettings/change-profile", { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body:JSON.stringify(payload),
          credentials:"include",
      });
      if (!response.ok) {
            setFinishedProcessingProfile(true);
            setIsLoading1(false)
            setIsThereError1(true);
            const errorData:InternalServerError= await response.json();
            setMsg1(errorData.detail);
            
            setTimeout(() => {
              setFinishedProcessingProfile(false);
            }, 2000);  
            return
      }  
      setIsLoading1(false)
      setIsThereError1(false);
      setFinishedProcessingProfile(true);
      const data:SuccessResponse= await response.json();
      setMsg1(data.message)
      setTimeout(() => {
        setFinishedProcessingProfile(false);
      }, 2000);  
    }catch(error){
      setFinishedProcessingProfile(true);
      setIsLoading1(false);
      setIsThereError1(true);
      setMsg1("Please check your internet connection");
      setTimeout(() => {
        setFinishedProcessingProfile(false);
      }, 2000);      
    }
  };

  const handleChangePassword = async(e:React.SubmitEvent<HTMLFormElement>) => {
    // Frontend only - no backend logic
      e.preventDefault();
      setIsLoading2(true);
      setIsThereError2(false);
      setMsg2("");
      setFinishedProcessingPassword(false);
    if (confirmPassword!==newPassword) {
      setIsLoading2(false);
      setIsThereError2(true);
      setMsg2("new and confirmed passwords does not match.");
      setFinishedProcessingPassword(true);
      setTimeout(() => {
        setFinishedProcessingPassword(false);
      }, 2000);  
      return;
    }

    const payload2:ChangePasswordRequest={
      old_password:currentPassword,
      new_password:newPassword,
      confirm_password:confirmPassword
    }   
    console.log("sent payload is : ", payload2)
  try{
        const response2 = await fetch("http://localhost:8000/UserSettings/change-password", { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(payload2),
            credentials:"include",
        });
        if (!response2.ok) {
              setFinishedProcessingPassword(true);
              setIsLoading2(false)
              setIsThereError2(true);
              const errorData:InternalServerError= await response2.json();
              setMsg2(errorData.detail);
              
              setTimeout(() => {
                setFinishedProcessingPassword(false);
              }, 2000);  
              return
        }  
        setIsLoading2(false)
        setIsThereError2(false);
        setFinishedProcessingPassword(true);
        const data:SuccessResponse= await response2.json();
        setMsg2(data.message)
        setTimeout(() => {
          setFinishedProcessingPassword(false);
        }, 2000);  
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }catch(error){
        setFinishedProcessingPassword(true);
        setIsLoading2(false);
        setIsThereError2(true);
        setMsg2("Please check your internet connection");
        setTimeout(() => {
          setFinishedProcessingPassword(false);
        }, 2000);      
      }
    };
    
  const handleLogout = () => {
    //question to chatgpt, let's call it question XXX:  I want to delete the cookie that is inside the browser, and I want react to detect that it was deleted, and route the user to the login page.
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
    name,setName,
    phone,setPhone,
    handleSaveProfile,
    isLoading1,
    isThereError1,
    Msg1,finishedProcessingProfile,
    
    currentPassword,setCurrentPassword,
    newPassword,setNewPassword,
    confirmPassword,setConfirmPassword,
    isLoading2,
    isThereError2,
    Msg2,finishedProcessingPassword,
    handleChangePassword,

    handleLogout,
    handleDeleteAccount,
  }


  };



export   default function SettingsPage() {
  const{
    name,setName,
    phone,setPhone,
    handleSaveProfile,
    isLoading1,
    isThereError1,
    Msg1,finishedProcessingProfile,
    
    currentPassword,setCurrentPassword,
    newPassword,setNewPassword,
    confirmPassword,setConfirmPassword,
    handleChangePassword,
    isLoading2,
    isThereError2,
    Msg2,finishedProcessingPassword,
    handleLogout,
    handleDeleteAccount,
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

        <form className="space-y-4" onSubmit={handleSaveProfile}>
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
              placeholder="e.g. Ahmad"
              disabled={isLoading1}
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
              placeholder="e.g. 0785768300"
              disabled={isLoading1}
            />
          </div>

          <div className="pt-2">
            {/** for onclick property, if want provide parameters, add a wrapper function ()=>handleSaveProfile(parametrs...) */}
            <button              
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
                     {isLoading1 ? (
                      <>
                         <LoadingEffect />
                         Processing info...
                      </>
                     ) : (
                      
                      <>
                        <p>Save profile</p>
                      </>

                    )}
            </button>
          </div>
        </form>
      

          

          {finishedProcessingProfile && (
            <MessageBox Msg={Msg1} isErrorMsg={isThereError1} />
          )}

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

        <form className="space-y-4" onSubmit={handleChangePassword}>
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
              disabled={isLoading2}
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
              disabled={isLoading2}
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
              disabled={isLoading2}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              
                     {isLoading2 ? (
                      <>
                         <LoadingEffect />
                         Processing info...
                      </>
                     ) : (
                      
                      <>
                        <p>Update password</p>
                      </>

                    )}
            </button>
          </div>
        </form>
          {finishedProcessingPassword && (
            <MessageBox Msg={Msg2} isErrorMsg={isThereError2} />
          )}
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
