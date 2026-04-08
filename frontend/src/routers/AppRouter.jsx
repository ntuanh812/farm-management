import { Routes, Route, Navigate } from "react-router-dom";
import { DashBoard } from "../pages/dashboard/DashBoard";
import { Login } from "../pages/auth/Login";
import { AppLayout } from "../components/layout/AppLayout";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { VerifyOtp } from "../pages/auth/VerifyOtp";
import PigManage  from "../pages/pig/PigManage";
import PigstyHistory from "../pages/pig/PigstyHistory";
import PigDead from "../pages/pig/PigDead";
import PigSell from "../pages/pig/PigSell";

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
                <Route path="/pigmanage/pigsty-history" element={<PigstyHistory />} />
                <Route path="/pigmanage/pig-dead" element={<PigDead />} />
                <Route path="/pigmanage/pig-sell" element={<PigSell />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
