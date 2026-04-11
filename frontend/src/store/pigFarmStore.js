import { create } from "zustand";
import {
  addDaysISO,
  BreedingStatus,
  LifecycleStatus,
  PigCategory,
} from "../domain/pigFarm";

function uid(prefix = "id") {
  const u =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `${prefix}-${u}`;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

function generateMockData() {
  const today = todayISO();

  const barns = [
    {
      id: uid("barn"),
      code: "NA1",
      name: "Nái 1",
      purpose: "sow",
      capacity: 20,
      createdAt: "2024-01-15",
    },
    {
      id: uid("barn"),
      code: "NA2",
      name: "Nái 2",
      purpose: "sow",
      capacity: 15,
      createdAt: "2024-02-01",
    },
    {
      id: uid("barn"),
      code: "TM1",
      name: "Thịt 1",
      purpose: "fattening",
      capacity: 100,
      createdAt: "2024-01-10",
    },
    {
      id: uid("barn"),
      code: "TM2",
      name: "Thịt 2",
      purpose: "fattening",
      capacity: 80,
      createdAt: "2024-01-20",
    },
    {
      id: uid("barn"),
      code: "HC1",
      name: "Hỗn hợp 1",
      purpose: "mixed",
      capacity: 50,
      createdAt: "2024-03-01",
    },
  ];

  const staff = [
    { id: uid("staff"), fullName: "Nguyễn Văn A", role: "Trưởng trại" },
    { id: uid("staff"), fullName: "Trần Thị B", role: "Thú y" },
    { id: uid("staff"), fullName: "Lê Văn C", role: "Công nhân" },
    { id: uid("staff"), fullName: "Phạm Thị D", role: "Kế toán" },
    { id: uid("staff"), fullName: "Hoàng Văn E", role: "Công nhân" },
  ];

  const pigs = [
    // Sows (8)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: uid("pig"),
      earTag: `NA${String(i + 1).padStart(3, "0")}`,
      category: PigCategory.SOW,
      barnId: barns[0].id,
      reproductiveLabel: "Chờ phối",
      breedingStatus: BreedingStatus.READY, // ✅ để trang phối giống có dữ liệu
      ageDays: 800 + Math.floor(Math.random() * 200),
      weightKg: 180 + Math.floor(Math.random() * 40),
      arrivedAt: addDaysISO(today, -(365 + Math.floor(Math.random() * 365))),
      lifecycleStatus: LifecycleStatus.ACTIVE,
    })),

    // Boars (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: uid("pig"),
      earTag: `DC${String(i + 1).padStart(3, "0")}`,
      category: PigCategory.BOAR,
      barnId: barns[0].id,
      ageDays: 900,
      weightKg: 220,
      arrivedAt: addDaysISO(today, -500),
      lifecycleStatus: LifecycleStatus.ACTIVE,
    })),

    // Piglets (10)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: uid("pig"),
      earTag: `LC${String(i + 1).padStart(3, "0")}`,
      category: PigCategory.PIGLET,
      barnId: barns[4].id,
      ageDays: 20 + Math.floor(Math.random() * 40),
      weightKg: 8 + Math.floor(Math.random() * 5),
      arrivedAt: addDaysISO(today, -(20 + Math.floor(Math.random() * 40))),
      lifecycleStatus: LifecycleStatus.ACTIVE,
    })),

    // Fattening (8 active)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: uid("pig"),
      earTag: `TM${String(i + 1).padStart(3, "0")}`,
      category: PigCategory.FATTENING,
      barnId: barns[2].id,
      fattening: { phase: ["raising", "ready"][i % 2] },
      ageDays: 120 + Math.floor(Math.random() * 60),
      weightKg: 60 + Math.floor(Math.random() * 30),
      arrivedAt: addDaysISO(today, -(120 + Math.floor(Math.random() * 60))),
      lifecycleStatus: LifecycleStatus.ACTIVE,
    })),

    // Sold fattening (5)
    ...Array.from({ length: 5 }, (_, i) => ({
      id: uid("pig"),
      earTag: `TM${String(20 + i).padStart(3, "0")}`,
      category: PigCategory.FATTENING,
      barnId: barns[3].id,
      fattening: null,
      ageDays: 180,
      weightKg: 90 + Math.floor(Math.random() * 10),
      arrivedAt: addDaysISO(today, -180),
      lifecycleStatus: LifecycleStatus.SOLD,
    })),
  ];

  const saleBatches = Array.from({ length: 3 }, (_, i) => {
    const soldAt = addDaysISO(today, -(10 + i * 7));

    return {
      id: uid("sale"),
      soldAt,
      staffName: staff[i % staff.length].fullName,
      lines: pigs
        .filter((p) => p.lifecycleStatus === LifecycleStatus.SOLD)
        .slice(0, 2)
        .map((p) => ({
          pigId: p.id,
          earTag: p.earTag,
          weightKg: p.weightKg,
          pricePerKg: 65000,
          totalAmount: p.weightKg * 65000,
          reason: "Xuất bán",
          note: "",
        })),
    };
  });

  const medicineUsages = Array.from({ length: 6 }, (_, i) => ({
    id: uid("med"),
    usageType: ["Sử dụng cá nhân", "Sử dụng chung"][i % 2],
    barnId: barns[i % barns.length].id,
    pigId: pigs[i]?.id || null,
    startDate: addDaysISO(today, -(10 + i * 3)),
    endDate: addDaysISO(today, -(7 + i * 3)),
    productName: ["Suifertil 1L", "Gendextyl 100ml", "Gel lubricante"][i % 3],
    productCode: ["M0908-095913", "O1812-104111-199", "M0908-092300"][i % 3],
    unit: ["chai(1000ml)", "chai(100ml)", "chai(1000ml)"][i % 3],
    quantity: 2 + Math.floor(Math.random() * 3),
    totalAmount: 50000 + Math.floor(Math.random() * 20000),
    performedBy: staff[i % staff.length].fullName,
  }));

  const feedUsages = Array.from({ length: 8 }, (_, i) => ({
    id: uid("feed"),
    usageType: ["Sử dụng chung", "Sử dụng cá nhân"][i % 2],
    barnId: barns[i % barns.length].id,
    pigId: pigs[i]?.id || null,
    startDate: addDaysISO(today, -(5 + i * 2)),
    endDate: addDaysISO(today, -(2 + i * 2)),
    productName: ["567S( kg) SILO", "566 SILO", "550p/pack"][i % 3],
    productCode: ["O0701-150758-514", "O1002-101831-715", "O0505-094746-136"][
      i % 3
    ],
    unit: ["kg", "kg", "bao"][i % 3],
    quantity: 200 + Math.floor(Math.random() * 300),
    totalAmount:
      (5000 + Math.floor(Math.random() * 2000)) *
      (2 + Math.floor(Math.random() * 3)),
    performedBy: staff[i % staff.length].fullName,
  }));

  // ✅ Vaccinations đúng field theo PigVaccination.jsx
  const vaccinations = Array.from({ length: 5 }, (_, i) => ({
    id: uid("vax"),
    pigId: pigs[i * 2]?.id,
    vaccineName: "Vắc xin PRRS",
    vaccinatedAt: addDaysISO(today, -i * 10),
    performedBy: staff[i % staff.length].fullName,
    note: "",
  }));

  return {
    barns,
    staff,
    pigs,
    movements: [],
    deaths: [],
    saleBatches,
    feedUsages,
    medicineUsages,
    vaccinations,
    activities: [],
  };
}

export const usePigFarmStore = create((set, get) => ({
  // =======================
  // STATE
  // =======================
  ...generateMockData(),
  initialized: true,

  // =======================
  // INIT
  // =======================
  initializeMockData: () => {
    if (!get().initialized) {
      set({ ...generateMockData(), initialized: true });
    }
  },

  // =======================
  // PIG
  // =======================
  addPig: (data) =>
    set((s) => ({
      pigs: [
        {
          id: uid("pig"),
          lifecycleStatus: LifecycleStatus.ACTIVE,
          ...data,
        },
        ...s.pigs,
      ],
    })),

  // =======================
  // MOVE PIGS (PigstyHistory.jsx)
  // =======================
  movePigs: ({ pigIds, toBarnId, movedAt, staffName, note }) =>
    set((state) => {
      const newMovements = pigIds.map((pigId) => {
        const pig = state.pigs.find((p) => p.id === pigId);

        return {
          id: uid("move"),
          pigId,
          fromBarnId: pig?.barnId || null,
          toBarnId,
          movedAt,
          staffName,
          note,
        };
      });

      return {
        pigs: state.pigs.map((p) =>
          pigIds.includes(p.id) ? { ...p, barnId: toBarnId } : p
        ),
        movements: [...newMovements, ...state.movements],
      };
    }),

  // =======================
  // SALE
  // =======================
  recordSaleBatch: ({ pigIds, soldAt, pricePerKg, staffName, note }) =>
    set((s) => {
      const lines = pigIds.map((id) => {
        const p = s.pigs.find((x) => x.id === id);
        return {
          pigId: id,
          earTag: p?.earTag || id,
          weightKg: p?.weightKg || 0,
          pricePerKg,
          totalAmount: (p?.weightKg || 0) * pricePerKg,
          reason: "Xuất bán",
          note: note || "",
        };
      });

      return {
        pigs: s.pigs.map((p) =>
          pigIds.includes(p.id)
            ? {
                ...p,
                lifecycleStatus: LifecycleStatus.SOLD,
                fattening: null,
              }
            : p
        ),
        saleBatches: [
          {
            id: uid("sale"),
            soldAt,
            staffName: staffName || "",
            lines,
          },
          ...s.saleBatches,
        ],
      };
    }),

  // =======================
  // DEATH (PigDead.jsx)
  // =======================
  recordDeath: ({
    pigId,
    diedAt,
    cause,
    reproductiveSnapshot,
    performedBy,
    note,
  }) =>
    set((state) => {
      const pig = state.pigs.find((p) => p.id === pigId);
      if (!pig) return {};

      return {
        pigs: state.pigs.map((p) =>
          p.id === pigId ? { ...p, lifecycleStatus: LifecycleStatus.DEAD } : p
        ),
        deaths: [
          {
            id: uid("death"),
            pigId,
            earTag: pig.earTag,
            barnId: pig.barnId,
            diedAt,
            cause,
            reproductiveSnapshot,
            performedBy,
            note: note || "",
          },
          ...state.deaths,
        ],
      };
    }),

  updateDeath: (deathId, data) =>
    set((state) => ({
      deaths: state.deaths.map((d) =>
        d.id === deathId ? { ...d, ...data } : d
      ),
    })),

  deleteDeath: (deathId) =>
    set((state) => ({
      deaths: state.deaths.filter((d) => d.id !== deathId),
    })),

  // =======================
  // BREEDING (PigBreeding.jsx)
  // =======================
  recordBreeding: ({ earTag, bredAt, method, staffName, note }) =>
    set((state) => ({
      pigs: state.pigs.map((p) =>
        p.earTag === earTag
          ? {
              ...p,
              breedingStatus: BreedingStatus.PREGNANT,
              bredAt,
              expectedFarrowAt: addDaysISO(bredAt, 114),
              breedStaffName: staffName,
              reproductiveLabel: "Đã phối",
              breedMethod: method,
              breedNote: note || "",
              lactation: null,
            }
          : p
      ),
    })),

  // =======================
  // FARROWING (Farrowing.jsx)
  // =======================
  recordFarrowing: ({ earTag, birthAt, totalBorn, alive, dead, barnId }) =>
    set((state) => ({
      pigs: state.pigs.map((p) =>
        p.earTag === earTag
          ? {
              ...p,
              barnId: barnId || p.barnId,
              reproductiveLabel: "Đẻ con",
              breedingStatus: BreedingStatus.READY,
              lactation: {
                birthAt,
                totalBorn,
                alive,
                dead,
              },
            }
          : p
      ),
    })),

  // =======================
  // VACCINATION (PigVaccination.jsx)
  // =======================
  addVaccination: (data) =>
    set((state) => ({
      vaccinations: [{ id: uid("vax"), ...data }, ...state.vaccinations],
    })),

  deleteVaccination: (id) =>
    set((state) => ({
      vaccinations: state.vaccinations.filter((v) => v.id !== id),
    })),

  // =======================
  // BARN
  // =======================
  addBarn: (data) =>
    set((s) => ({
      barns: [{ id: uid("barn"), createdAt: todayISO(), ...data }, ...s.barns],
    })),

  // =======================
  // MEDICINE
  // =======================
  addMedicineUsage: (data) =>
    set((s) => ({
      medicineUsages: [{ id: uid("med"), ...data }, ...s.medicineUsages],
    })),

  updateMedicineUsage: (id, data) =>
    set((s) => ({
      medicineUsages: s.medicineUsages.map((u) =>
        u.id === id ? { ...u, ...data } : u
      ),
    })),

  deleteMedicineUsage: (id) =>
    set((s) => ({
      medicineUsages: s.medicineUsages.filter((u) => u.id !== id),
    })),

  // =======================
  // FEED
  // =======================
  addFeedUsage: (data) =>
    set((s) => ({
      feedUsages: [{ id: uid("feed"), ...data }, ...s.feedUsages],
    })),

  updateFeedUsage: (id, data) =>
    set((s) => ({
      feedUsages: s.feedUsages.map((u) =>
        u.id === id ? { ...u, ...data } : u
      ),
    })),

  deleteFeedUsage: (id) =>
    set((s) => ({
      feedUsages: s.feedUsages.filter((u) => u.id !== id),
    })),
}));