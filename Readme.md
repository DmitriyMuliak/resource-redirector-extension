unzip url-redirector-extension.zip && cd url-redirector-extension
npm install
npm run build # → dist/
npm run test # Vitest suite
npm run dev # HMR dev server

```

**Завантаження в Chrome:**
1. `chrome://extensions` → увімкни **Developer mode**
2. **Load unpacked** → вибери папку `dist/`

---

## 🏗️ Архітектура
```

src/
├── popup/ ← React UI (580px popup)
│ ├── App.tsx ← Root: search, modals, state init
│ ├── components/
│ │ ├── ui/ ← Button, Input, Toggle, Modal (primitives)
│ │ ├── RuleForm/ ← Add/Edit форма + ResourceTypeSelect
│ │ ├── RuleItem ← Картка правила з group-hover діями
│ │ └── RuleList ← Список + Edit modal
│ ├── hooks/useModal ← Reusable modal state hook
│ └── stores/ ← Zustand 5 store (devtools enabled)
├── background/
│ └── index.ts ← Service Worker: слухає storage → синхронізує declarativeNetRequest
└── shared/
├── types/ ← RedirectRule, CreateRulePayload, ResourceType...
├── utils/ ← storage.ts, ruleMapper.ts, validators.ts
└── constants/ ← STORAGE_KEY, RESOURCE_TYPE_LABELS...
