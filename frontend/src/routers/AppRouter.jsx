import { Routes, Route, Navigate } from "react-router-dom";
import { DashBoard } from "../pages/dashboard/DashBoard";
import { Livestock } from "../pages/livestock/Livestock";
import { Login } from "../pages/auth/Login";
import { AppLayout } from "../components/layout/AppLayout";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { VerifyOtp } from "../pages/auth/VerifyOtp";
import { LivestockDetail } from "../pages/livestock/LivestockDetail";


export const AppRouter = () => {
    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            <Route element={<AppLayout/>}>
                <Route path="/" element={<DashBoard />} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/livestock" element={<Livestock />} />
                <Route path="/livestock/:id" element={<LivestockDetail />} />

            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
