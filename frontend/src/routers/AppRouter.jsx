import { Routes, Route, Navigate } from "react-router-dom";
import { DashBoard } from "../pages/dashboard/DashBoard";
import { Login } from "../pages/auth/Login";
import { AppLayout } from "../components/layout/AppLayout";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { VerifyOtp } from "../pages/auth/VerifyOtp";
import PigManage from "../pages/pig/PigManage";
import PigstyHistory from "../pages/pig/PigstyHistory";
import PigDead from "../pages/pig/PigDead";
import PigBreeding from "../pages/reproduction/PigBreeding";
import PigFarrowing from "../pages/reproduction/PigFarrowing";
import PigFattening from "../pages/pig/PigFattening";
import PigBarns from "../pages/pig/PigBarns";
import BranUsage from "../pages/materials/Bran";
import MedicineUsage from "../pages/materials/Medicine";
import PigVaccination from "../pages/health/PigVaccination";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<DashBoard />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/pigmanage/barns" element={<PigBarns />} />
        <Route path="/pigmanage" element={<PigManage />} />
        <Route path="/pigmanage/pigsty-history" element={<PigstyHistory />} />
        <Route path="/pigmanage/pig-dead" element={<PigDead />} />
        <Route path="/breeding/pig-breeding" element={<PigBreeding />} />
        <Route path="/breeding/pig-farrowing" element={<PigFarrowing />} />
        <Route path="/pigmanage/pig-fattening" element={<PigFattening />} />
        <Route path="/materials/bran" element={<BranUsage />} />
        <Route path="/materials/medicine" element={<MedicineUsage />} />
        <Route path="/vaccination/schedule-vaccine" element={<PigVaccination />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
