"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Import shared components
import Button from "@/components/shared/button/Button";
import { Connector } from "@/components/shared/layout/curvy-rect";
import HeroFlame from "@/components/shared/effects/flame/hero-flame";
import AsciiExplosion from "@/components/shared/effects/flame/ascii-explosion";
import { HeaderProvider } from "@/components/shared/header/HeaderContext";

// Import hero section components
import HomeHeroBackground from "@/components/app/(home)/sections/hero/Background/Background";
import { BackgroundOuterPiece } from "@/components/app/(home)/sections/hero/Background/BackgroundOuterPiece";
import HomeHeroBadge from "@/components/app/(home)/sections/hero/Badge/Badge";
import HomeHeroPixi from "@/components/app/(home)/sections/hero/Pixi/Pixi";
import HomeHeroTitle from "@/components/app/(home)/sections/hero/Title/Title";
import HeroInputSubmitButton from "@/components/app/(home)/sections/hero-input/Button/Button";
import Globe from "@/components/app/(home)/sections/hero-input/_svg/Globe";
import { Endpoint } from "@/components/shared/Playground/Context/types";
import Step2Placeholder from "@/components/app/(home)/sections/step2/Step2Placeholder";
import WorkflowBuilder from "@/components/app/(home)/sections/workflow-builder/WorkflowBuilder";

// Import header components
import HeaderBrandKit from "@/components/shared/header/BrandKit/BrandKit";
import HeaderWrapper from "@/components/shared/header/Wrapper/Wrapper";
import HeaderDropdownWrapper from "@/components/shared/header/Dropdown/Wrapper/Wrapper";
import GithubIcon from "@/components/shared/header/Github/_svg/GithubIcon";
import ButtonUI from "@/components/ui/shadcn/button";

function StyleGuidePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab] = useState<Endpoint>(Endpoint.Scrape);
  const [url, setUrl] = useState<string>("");
  const [showStep2, setShowStep2] = useState(false);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [loadWorkflowId, setLoadWorkflowId] = useState<string | null>(null);
  const [loadTemplateId, setLoadTemplateId] = useState<string | null>(null);

  // Handle URL params
  useEffect(() => {
    if (!searchParams) return;

    const view = searchParams.get("view");
    const workflowId = searchParams.get("workflow");
    const templateId = searchParams.get("template");

    if (view === "workflows") {
      setShowStep2(true);
      setShowWorkflowBuilder(false);
    } else if (workflowId) {
      setLoadWorkflowId(workflowId);
      setShowWorkflowBuilder(true);
      setShowStep2(false);
    } else if (templateId) {
      setLoadTemplateId(templateId);
      setShowWorkflowBuilder(true);
      setShowStep2(false);
    }
  }, [searchParams]);

  const handleSubmit = () => {
    setShowStep2(true);
    router.push("/?view=workflows");
  };

  const handleReset = () => {
    setShowStep2(false);
    setShowWorkflowBuilder(false);
    setLoadWorkflowId(null);
    setLoadTemplateId(null);
    setUrl("");
    router.push("/");
  };

  const handleCreateWorkflow = () => {
    setLoadWorkflowId(null);
    setLoadTemplateId(null);
    setShowWorkflowBuilder(true);
    router.push("/?view=builder");
  };

  return (
    <HeaderProvider>
      <WorkflowBuilder
        onBack={handleReset}
        initialWorkflowId={loadWorkflowId}
        initialTemplateId={loadTemplateId}
      />
    </HeaderProvider>
  );
}

export default function StyleGuidePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StyleGuidePageContent />
    </Suspense>
  );
}
