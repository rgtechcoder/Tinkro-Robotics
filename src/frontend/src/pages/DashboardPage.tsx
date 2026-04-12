import { DashboardLayout } from "@/components/DashboardLayout";
import {
  DashboardAddresses,
  DashboardCoupons,
  DashboardOrders,
  DashboardOverview,
  DashboardProfile,
  DashboardTracking,
} from "@/components/dashboard";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentType } from "react";
import { useState } from "react";

type Section =
  | "overview"
  | "orders"
  | "tracking"
  | "addresses"
  | "coupons"
  | "profile";

const SECTION_COMPONENTS: Record<Section, ComponentType> = {
  overview: DashboardOverview,
  orders: DashboardOrders,
  tracking: DashboardTracking,
  addresses: DashboardAddresses,
  coupons: DashboardCoupons,
  profile: DashboardProfile,
};

export function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const SectionComponent = SECTION_COMPONENTS[activeSection];

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSectionChange={(s) => setActiveSection(s as Section)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <SectionComponent />
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}
