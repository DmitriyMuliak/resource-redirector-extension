# Chrome Extension Regex Guide: Resource Redirection

This guide explains how to correctly use Regular Expressions (Regex) in Chrome Extensions (Manifest V3) to redirect resources, specifically focusing on why partial matches often fail and how to fix them.

## 🎯 The Challenge
You want to redirect:
`https://convertico.com/imgs/convertico-com-logo.png`
To:
`https://picsum.photos/200/300`

---

## ⚠️ The "Partial Replacement" Trap
In Chrome's `declarativeNetRequest` API, when `isRegex: true` is used, the `regexSubstitution` field performs a **find-and-replace** operation *only on the part of the URL that matched the Regex*.

### ❌ Incorrect Approach
**Source Regex:** `/imgs/convertico-com-logo\.png`
**Target URL:** `https://picsum.photos/200/300`

**What happens:**
1. Chrome finds the match `/imgs/convertico-com-logo.png` inside the full URL.
2. It leaves the domain `https://convertico.com` untouched.
3. It swaps the matched part for your target.
4. **Resulting "Garbage" URL:** `https://convertico.comhttps://picsum.photos/200/300` (This will fail).

---

## ✅ Solution 1: Full-String Regex (Recommended for Regex users)
To replace the **entire** URL, your Regex must capture the URL from the very beginning (`^`) to the very end (`$`).

**Source Regex:**
```regex
^https?:\/\/convertico\.com\/imgs\/convertico-com-logo\.png.*
```
**Target URL:**
```text
https://picsum.photos/200/300
```

### 🔍 How it works:
- `^https?:\/\/` : Matches the start of the string and the protocol (http or https).
- `convertico\.com` : Matches the specific domain (dots are escaped with `\`).
- `\/imgs\/...` : Matches the specific path.
- `.*` : Matches any trailing parameters (like `?v=1.2`), ensuring the **whole** string is consumed.
- **Result:** Since the Regex matched the *entire* URL, the entire URL is replaced by the target.

---

## ✅ Solution 2: Exact Match (No Regex - Simplest)
If you are just swapping one specific file for another, **do not use Regex**.

**isRegex:** `false`
**Source Pattern:** `https://convertico.com/imgs/convertico-com-logo.png`
**Target URL:** `https://picsum.photos/200/300`

### 🔍 How it works:
- Chrome performs a standard URL comparison.
- When it finds an exact match, it replaces the **entire** request URL with the Target URL.
- This is faster for the browser and less prone to syntax errors.

---

## ✅ Solution 3: Wildcard Match (The Middle Ground)
If the domain might change but the file path is unique.

**isRegex:** `false`
**Source Pattern:** `*convertico-com-logo.png*`
**Target URL:** `https://picsum.photos/200/300`

### 🔍 How it works:
- The `*` acts as a wildcard.
- This will match any URL that **contains** that filename.
- Chrome will replace the **entire** URL with the Target.

---

## ⚡ Solution 4: Dynamic Capture Groups (Advanced)
If you want to swap the **domain** but keep the **original path**, use capture groups `()`.

**isRegex:** `true`
**Source Regex:**
```regex
^https?:\/\/cdn\.production\.com\/(.*)
```
**Target URL:**
```text
http://localhost:3000/$1
```

### 🔍 How it works:
- `(.*)` in the source: Everything inside these parentheses is stored as **Group #1**.
- `$1` in the target: This placeholder is replaced by the content of Group #1.
- **Example:** `https://cdn.production.com/js/app.js` will be redirected to `http://localhost:3000/js/app.js`.
- You can use multiple groups: `$2`, `$3`, etc., for each additional set of parentheses.

---

## 🛠️ Summary for Tech Interviews
"When working with `declarativeNetRequest`, it's critical to remember that `regexFilter` paired with `regexSubstitution` behaves like a string replacement. If the Regex doesn't consume the entire original URL, the browser will prepend the original unmatched prefix to your redirect target. To replace a URL completely, the Regex must start with `^` and cover the entire string, or we should use a standard `urlFilter` for better performance and simplicity."
