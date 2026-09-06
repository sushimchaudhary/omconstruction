// components/LanguageSelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ne", label: "नेपाली" },
  { value: "ja", label: "日本語" },
  { value: "hi", label: "हिन्दी" },
  { value: "ko", label: "한국어" },
];

export default function LanguageSelector() {
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    // Read existing googtrans cookie on mount if available
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const code = match[1].split("/").pop();
      if (code && LANGUAGES.some((l) => l.value === code)) {
        setSelectedLang(code);
      }
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setSelectedLang(langCode);

    // Set cookie for Google Translate
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/`;

    // Refresh page to trigger Google Translate
    window.location.reload();
  };

  return (
    <div className="flex items-center  bg-gray-50 hover:bg-gray-100 border border-gray-200/80 px-2 py-1 rounded-full transition-all">
      <Globe size={14} className="text-[#c47c30] flex-shrink-0" />
      
      <Select
        value={selectedLang}
        onChange={changeLanguage}
        options={LANGUAGES}
        variant="borderless"
        size="small"
        className="w-20 text-[11px] font-bold text-[#241712]"
        popupMatchSelectWidth={false}
      />
    </div>
  );
}