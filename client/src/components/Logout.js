import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("Initiating logout...");

        try {
            const response = await fetch("/logout", {
                method: "DELETE",
                credentials: "include", // keeps sesh cookies
            });

            console.log("Logout fetch response:", response);

            if (response.ok) {
                console.log("Logout successful on the backend.");
                const result = await response.json();
                console.log("Logout Response Data:", result);

                toast.success("Successfully logged out!");
                console.log("Navigating to login page...");
                navigate("/login"); // Redirect to login pg
            } else {
                console.warn("Logout failed, status:", response.status);
                const errorData = await response.json();
                console.error("Logout Error Details:", errorData);
                toast.error(errorData.error || "Logout failed.");
            }
        } catch (err) {
            console.error("Logout Error (Network/Unexpected):", err);
            toast.error("An unexpected error occurred during logout.");
        } finally {
            console.log("Logout process completed.");
        }
    };

    return (
        <div>
            <Toaster />
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Log Out
            </button>
        </div>
    );
}