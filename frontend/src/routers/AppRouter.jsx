import { Routes, Route, Navigate } from "react-router-dom";
import { DashBoard } from "../pages/dashboard/DashBoard";
import PigManage  from "../pages/pig/PigManage";
import { Login } from "../pages/auth/Login";
import { AppLayout } from "../components/layout/AppLayout";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { VerifyOtp } from "../pages/auth/VerifyOtp";

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
                <Route path="/pigmanage" element={<PigManage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
