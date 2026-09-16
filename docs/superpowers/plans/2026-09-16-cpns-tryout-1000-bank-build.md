# CPNS Tryout 2026 — 1000 Bank Soal Build Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build APK offline CPNS Tryout 2026 (1000 soal bank → random 110 per tryout, timer CAT 100 menit, skor 550) yang install di J9AXGF026014KUC dan rilis ke Lynk 20K, modal Rp0 G3260 via GH Actions

**Architecture:** Vanilla JS `www/` (no framework) + `questions.json` 301KB bank → Capacitor 6.2.2 wrap Android → GH Actions `cap sync + assembleDebug` → artifact `app-debug.apk` <15MB. Palette navy #1A495D teal #0B8EC2 yellow #FFD23F cream #FFF9E6, no https literal, offline 100%.

**Tech Stack:** Capacitor 6.2.2 + @capacitor/android 6.2.2 + Java 17 + Node 20 + Pillow (cover/mockup) + GitHub Actions

**Spec:** `docs/PRS_CPNS_Tryout_2026_1000_Soal.md`

## Global Constraints
- Modal Rp0 — no billing, no VPS 24 jam
- PC G3260 4GB — no local Gradle `assembleDebug`, wajib GH Actions
- APK <15MB, cold start <2s, Android 8+ (API 21+)
- No `https://` literal di `www/` — `grep -r https www/` = 0 sebelum push
- 1000 soal valid: 300 TWK / 350 TIU / 350 TKP, random 110 (30+35+45) tiap MULAI
- Timer CAT 100 menit (130 difabel) + passing 65/80/166 total 311
- AppId `com.chukie99.cpnstryout`, webDir `www`
- Branch `main`, tag `v1.0.0`, workflow `build-apk.yml` `permissions: contents: write`

---

### Task 1: Git Init + Project Scaffolding (superpowers:using-git-worktrees pattern)

**Files:**
- Create: `.gitignore`
- Create: `README.md` (update)
- Modify: `package.json` (capacitor deps)
- Test: `git status`

**Interfaces:**
- Consumes: existing `www/`, `docs/`, `capacitor.config.json` at root
- Produces: git repo `Chukie99/cpns-tryout-2026` ready `main`

- [ ] Step 1: Write .gitignore
```gitignore
node_modules/
android/
dist/
.DS_Store
*.log
```

- [ ] Step 2: Update package.json deps
```json
{
  "name": "cpns-tryout-2026",
  "version": "1.0.0",
  "private": true,
  "dependencies": {"@capacitor/core":"6.2.2","@capacitor/android":"6.2.2"},
  "devDependencies": {"@capacitor/cli":"6.2.2"}
}
```

- [ ] Step 3: git init + add + commit
```bash
cd "C:/file ku/04-CPNS-Tryout"
git init
git add .
git commit -m "feat: init CPNS Tryout 2026 1000 bank (30+35+45 random 110)"
git branch -M main
gh repo create Chukie99/cpns-tryout-2026 --public --source=. --remote=origin --push
```

- [ ] Step 4: Verify
```bash
git log --oneline -1
gh repo view Chukie99/cpns-tryout-2026 --json nameWithOwner
```

---

### Task 2: Capacitor Config + Icons

**Files:**
- Modify: `capacitor.config.json:1-10` (ensure webDir www)
- Create: `www/icon-512.png` etc already exists
- Test: `npx cap --version`

**Interfaces:**
- Consumes: Task 1 package.json
- Produces: `capacitor.config.json` valid + icons 48-512

- [ ] Step 1: Verify capacitor.config.json
```json
{"appId":"com.chukie99.cpnstryout","appName":"CPNS Tryout 2026","webDir":"www","bundledWebRuntime":false}
```

- [ ] Step 2: Ensure icons exist (48,72,96,144,192,512 + icon.png 1024)
```bash
ls www/icon*.png
```

- [ ] Step 3: Commit if changed
```bash
git add capacitor.config.json www/icon*.png
git commit -m "chore: capacitor config + icons" || true
```

---

### Task 3: Bank 1000 + Engine Random 110 Verification (TDD)

**Files:**
- Modify: `www/content/questions.json` (verify 1000)
- Modify: `www/js/app.js:1-20` (buildBank 30+35+45)
- Test: `tests/bank.test.js` (optional) or manual node check

**Interfaces:**
- Consumes: Task 2
- Produces: engine `buildBank()` + `timer 100*60` + `bar TKP/225` verified

- [ ] Step 1: Write failing test (node)
```js
// node check_bank.js
import {readFileSync} from 'fs';
const qs=JSON.parse(readFileSync('www/content/questions.json','utf8'));
assert(qs.length===1000);
assert(qs.filter(q=>q.cat==='TWK').length===300);
```

- [ ] Step 2: Run test
```bash
node check_bank.js
# Expected PASS 1000 Counter TWK 300 TIU 350 TKP 350
```

- [ ] Step 3: Verify app.js has buildBank + 100*60 + /225 + /110
```bash
grep -c "buildBank" www/js/app.js  # >=2
grep -c "100\*60" www/js/app.js     # >=1
grep -c "/225" www/js/app.js        # >=1
```

- [ ] Step 4: Verify no https
```bash
grep -r "https://" www/ || echo "CLEAN 0"
```

---

### Task 4: GitHub Actions Build Workflow

**Files:**
- Create: `.github/workflows/build-apk.yml`
- Test: `gh workflow view build-apk`

**Interfaces:**
- Consumes: Task 1-3
- Produces: workflow success 6 min → `app-debug.apk`

- [ ] Step 1: Write workflow
```yaml
name: build-apk
on: {push: {tags: ['v*']}, workflow_dispatch: {}}
permissions: {contents: write}
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: {node-version: 20}
      - uses: actions/setup-java@v4
        with: {java-version: 17, distribution: temurin}
      - run: npm ci
      - run: npx cap add android || true
      - run: npx cap sync android
      - run: cd android && chmod +x gradlew && ./gradlew assembleDebug
      - uses: actions/upload-artifact@v4
        with: {name: app-debug, path: android/app/build/outputs/apk/debug/app-debug.apk}
      - uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with: {files: android/app/build/outputs/apk/debug/app-debug.apk}
```

- [ ] Step 2: Commit + tag + push
```bash
git add .github/workflows/build-apk.yml
git commit -m "ci: add build-apk GH Actions"
git tag v1.0.0
git push origin main --tags
```

- [ ] Step 3: Poll until success
```bash
gh run watch --exit-status
```

---

### Task 5: HTML Mockup UI Integration

**Files:**
- Create: `docs/mockup_ui.html` (already 14KB)
- Create: `docs/mockups/*.png` (4x 1080x1920)
- Test: open `docs/mockup_ui.html` in browser

**Interfaces:**
- Consumes: Task 3 www
- Produces: mockup HTML 4 phone + iframe live demo

- [ ] Step 1: Verify mockup exists
```bash
ls docs/mockup_ui.html docs/mockups/
```

- [ ] Step 2: Manual visual check
Open `docs/mockup_ui.html` → 4 phone render + iframe `www/index.html` live

---

### Task 6: Post-Build Verify (superpowers:verification-before-completion)

**Files:**
- Modify: `LISTING_LYNK_SIAP_PASTE.txt` (ensure 20K tripwire)
- Test: install APK on J9AXGF026014KUC

**Interfaces:**
- Consumes: Task 4 artifact
- Produces: verified APK <15MB + listing ready

- [ ] Step 1: Download artifact
```bash
gh run download --name app-debug
ls -lh app-debug.apk
```

- [ ] Step 2: Install test
```bash
adb -s J9AXGF026014KUC install -r app-debug.apk
adb shell am start -n com.chukie99.cpnstryout/.MainActivity
```

- [ ] Step 3: Checklist PRS acceptance (8 items) → mark done
